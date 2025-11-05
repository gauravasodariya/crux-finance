'use client';

import React, { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Customer, Ticket } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, UserPlus, ArrowLeft, ArrowRight, X } from 'lucide-react';

type Step = 1 | 2;

const contactSchema = z.object({
  name: z.string().min(2, 'Enter a name'),
  phone: z.string().regex(/^\+?\d{10,15}$/i, 'Enter phone like +919876543210'),
  email: z.string().email('Enter a valid email'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function TicketWizard({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useAppContext();
  const [step, setStep] = useState<Step>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('low');
  const [note, setNote] = useState('');
  const [query, setQuery] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '' },
  });

  const customers = useMemo(() => {
    if (!query) return state.customers;
    const q = query.toLowerCase();
    return state.customers.filter(c => (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    ));
  }, [state.customers, query]);

  const createTicket = () => {
    const c = selectedCustomer;
    if (!c) return;
    const t: Ticket = {
      id: `TKT-${Date.now()}`,
      customerId: c.id,
      customerName: c.name,
      customerPhone: c.phone,
      category: 'New Ticket',
      priority,
      status: 'open',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      internalNotes: note,
    };
    dispatch({ type: 'ADD_TICKET', payload: t });
    dispatch({ type: 'SET_ACTIVE_TICKET', payload: t.id });
    onClose();
  };

  const onCreateNew = handleSubmit((vals) => {
    const c: Customer = {
      id: `NEW-${Date.now()}`,
      name: vals.name,
      phone: vals.phone,
      email: vals.email,
      applications: [],
    };
    setSelectedCustomer(c);
    setStep(2);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border overflow-hidden">
        <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{step === 1 ? 'Select contact' : 'Set ticket priority'}</span>
            <span className="text-xs bg-white/10 rounded px-2 py-0.5">Step {step} of 2</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white flex items-center gap-1">
            <X className="w-4 h-4"/> Close
          </button>
        </div>

        {/* Selected contact preview */}
        <div className="px-4 py-3 bg-white border-b flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            {(selectedCustomer?.name || 'C')[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{selectedCustomer?.name || 'Select a contact'}</p>
            <p className="text-xs text-gray-500">{selectedCustomer?.email || '—'} • {selectedCustomer?.phone || '—'}</p>
          </div>
          {step === 2 && (
            <button onClick={()=>setStep(1)} className="text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4"/> Back
            </button>
          )}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* Find customer */}
            <div className="border rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Find customer</p>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, email, phone…" className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border rounded-lg text-sm"/>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {customers.map(c => (
                  <button key={c.id} onClick={()=>{ setSelectedCustomer(c); setStep(2); }} className="w-full text-left p-2 rounded-lg border hover:bg-blue-50">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-600">{c.email} • {c.phone}</p>
                  </button>
                ))}
                {customers.length === 0 && (
                  <p className="text-xs text-gray-500">No matches</p>
                )}
              </div>
            </div>

            {/* Create new contact */}
            <div className="border rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Create new contact <span className="text-xs text-gray-500">(Optional)</span></p>
              <form onSubmit={onCreateNew} className="space-y-2">
                <div>
                  <input {...register('name')} placeholder="Full name" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm"/>
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('email')} placeholder="Email" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm"/>
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <input {...register('phone')} placeholder="Phone (+91…)" className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm"/>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1">
                    <UserPlus className="w-4 h-4"/> Create & Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* Priority */}
            <div className="border rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Priority level <span className="text-xs text-gray-500">(Choose one)</span></p>
              <div className="space-y-2">
                {(['low','medium','high'] as const).map(p => (
                  <button key={p} onClick={()=>setPriority(p)} className={`w-full text-left p-3 rounded-xl border flex items-center justify-between ${priority===p?'border-blue-300 bg-blue-50':'border-gray-200 bg-white'}`}>
                    <div>
                      <p className="text-sm font-medium capitalize">{p}</p>
                      <p className="text-xs text-gray-600">{p==='low'?'General questions, no deadlines.':p==='medium'?'Requires response this week.':'Time sensitive, affects progress.'}</p>
                    </div>
                    <input type="radio" checked={priority===p} readOnly />
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <ArrowLeft className="w-4 h-4"/> <span>Back to contacts</span>
                <ArrowRight className="w-4 h-4"/> <span>Ready to create</span>
              </div>
            </div>

            {/* Notes */}
            <div className="border rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Add context <span className="text-xs text-gray-500">(Optional)</span></p>
              <textarea value={note} onChange={e=>setNote(e.target.value)} rows={8} placeholder="Add internal note for agents…" className="w-full p-2 bg-gray-50 border rounded-lg text-sm"/>
              <p className="text-xs text-gray-500 mt-1">Notes are private and stay with the ticket.</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
          <span className="text-xs text-gray-600">Selected priority: {priority}</span>
          <div className="flex gap-2">
            <button onClick={()=>setStep(1)} className="px-3 py-2 bg-white border rounded-lg text-sm">Back</button>
            <button onClick={createTicket} disabled={!selectedCustomer} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">Create ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
}