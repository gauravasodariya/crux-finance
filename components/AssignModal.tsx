'use client';

import React, { useMemo, useState } from 'react';
import { X, Search } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Agent, Ticket } from '@/lib/types';

type Props = {
  ticket: Ticket;
  onClose: () => void;
};

export default function AssignModal({ ticket, onClose }: Props) {
  const { state, dispatch } = useAppContext();
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');

  const agents = state.agents;
  const filtered = useMemo(() => {
    if (!query) return agents;
    const q = query.toLowerCase();
    return agents.filter(a => a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q));
  }, [agents, query]);

  const assignTo = (assignee?: Agent, notify = false) => {
    dispatch({ type: 'UPDATE_TICKET', payload: { id: ticket.id, updates: { assignedAgent: assignee?.username } } });
    if (note.trim()) {
      dispatch({ type: 'UPDATE_TICKET', payload: { id: ticket.id, updates: { internalNotes: `${ticket.internalNotes ? ticket.internalNotes + '\n' : ''}[Assign Note] ${note}` } } });
    }
    if (notify && assignee) {
      // Add system message indicating assignment
      dispatch({ type: 'ADD_MESSAGE', payload: { ticketId: ticket.id, message: {
        id: `MSG-${Date.now()}`,
        senderId: 'system',
        senderType: 'bot',
        content: `Ticket assigned to ${assignee.name}.`,
        timestamp: Date.now(),
        read: true,
      } } });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border">
        <div className="px-5 py-4 bg-gray-900 text-white rounded-t-2xl flex items-center justify-between">
          <div>
            <p className="font-semibold">Assign conversation</p>
            <p className="text-xs text-gray-300">{ticket.customerName} • #{ticket.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5"/></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {/* Assign to agent */}
          <div className="border rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Assign to agent</p>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search agents..." className="w-full pl-8 pr-3 py-2 bg-gray-50 border rounded-lg text-sm"/>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filtered.map(a => (
                <button key={a.username} onClick={()=>assignTo(a, false)} className="w-full text-left p-3 bg-white border rounded-lg hover:bg-indigo-50">
                  <p className="text-sm font-medium text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-600">{a.username} • {a.status}</p>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-gray-500">No agents found.</p>
              )}
            </div>
          </div>

          {/* Notes and actions */}
          <div className="border rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Add note for assignee</p>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={6} placeholder="Optional note..." className="w-full p-2 bg-gray-50 border rounded-lg text-sm"/>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={()=>assignTo(undefined, false)} className="px-3 py-2 text-sm bg-gray-100 border rounded-lg">Unassign</button>
              <button onClick={()=>assignTo(filtered[0], true)} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg">Assign & notify</button>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-sm bg-gray-100 border rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}