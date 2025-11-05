'use client';

import React, { useState } from 'react';
import { X, Upload, File, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Ticket } from '@/lib/types';

type Props = {
  ticket: Ticket;
  onClose: () => void;
};

type FakeFile = {
  id: string;
  name: string;
  sizeKb: number;
  type: 'pdf' | 'jpg' | 'docx';
};

export default function AttachFilesModal({ ticket, onClose }: Props) {
  const { dispatch } = useAppContext();
  const [files, setFiles] = useState<FakeFile[]>([]);

  const addFakeFile = (name: string, type: FakeFile['type'], sizeKb: number) => {
    setFiles(prev => [...prev, { id: `FF-${Date.now()}-${prev.length+1}`, name, sizeKb, type }]);
  };

  const attach = () => {
    if (files.length === 0) { onClose(); return; }
    const list = files.map(f => `${f.name} (${f.sizeKb} KB)`).join(', ');
    const note = `${ticket.internalNotes ? ticket.internalNotes + '\n' : ''}[Files Attached] ${list}`;
    dispatch({ type: 'UPDATE_TICKET', payload: { id: ticket.id, updates: { internalNotes: note } } });
    dispatch({ type: 'ADD_MESSAGE', payload: { ticketId: ticket.id, message: {
      id: `MSG-${Date.now()}`,
      senderId: 'system',
      senderType: 'bot',
      content: `${files.length} file(s) attached to the ticket.`,
      timestamp: Date.now(),
      read: true,
    } } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border">
        <div className="px-5 py-4 bg-gray-900 text-white rounded-t-2xl flex items-center justify-between">
          <p className="font-semibold">Attach files to ticket</p>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5"/></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {/* Upload area (simulated) */}
          <div className="border rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Upload area</p>
            <div className="rounded-xl border-2 border-dashed p-6 text-center bg-gray-50">
              <Upload className="w-6 h-6 mx-auto text-gray-500"/>
              <p className="text-xs text-gray-600 mt-2">Drag & drop files here or use buttons</p>
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={()=>addFakeFile('income-proof.pdf','pdf',842)} className="px-3 py-2 text-sm bg-gray-100 border rounded-lg">Add PDF</button>
                <button onClick={()=>addFakeFile('id-front.jpg','jpg',1200)} className="px-3 py-2 text-sm bg-gray-100 border rounded-lg">Add Image</button>
                <button onClick={()=>addFakeFile('loan-summary.docx','docx',324)} className="px-3 py-2 text-sm bg-gray-100 border rounded-lg">Add DOCX</button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Max 10MB per file • Virus scan pending</p>
          </div>

          {/* Attached list */}
          <div className="border rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Attached files</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-2">
                    {f.type === 'pdf' ? <File className="w-4 h-4 text-gray-600"/> : f.type === 'jpg' ? <ImageIcon className="w-4 h-4 text-gray-600"/> : <File className="w-4 h-4 text-gray-600"/>}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{f.name}</p>
                      <p className="text-xs text-gray-600">{f.sizeKb} KB</p>
                    </div>
                  </div>
                  <button onClick={()=>setFiles(prev=>prev.filter(x=>x.id!==f.id))} className="text-sm px-2 py-1 bg-gray-100 border rounded-lg">Remove</button>
                </div>
              ))}
              {files.length === 0 && (
                <p className="text-xs text-gray-500">No files added.</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 flex justify-between">
          <p className="text-xs text-gray-600">Total: {files.reduce((a,b)=>a+b.sizeKb,0)} KB • Virus scan pending</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-2 text-sm bg-gray-100 border rounded-lg">Back</button>
            <button onClick={attach} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">Attach to ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
}