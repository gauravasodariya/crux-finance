"use client";

import React from "react";
import { QUICK_REPLIES } from "@/lib/mockData";

type ToolsPanelProps = {
  useQuickReply: (text: string) => void;
  handleResolve: () => void;
  handleEscalate: () => void;
  handleTransfer: () => void;
  note: string;
  setNote: (v: string) => void;
  saveNotes: () => void;
};

export default function ToolsPanel({
  useQuickReply,
  handleResolve,
  handleEscalate,
  handleTransfer,
  note,
  setNote,
  saveNotes,
}: ToolsPanelProps) {
  return (
    <aside className="bg-white border-l p-3 space-y-4 h-full overflow-y-auto scrollbar-thin overscroll-contain">
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Quick Replies</p>
        <div className="grid grid-cols-1 gap-2">
          {QUICK_REPLIES.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => useQuickReply(qr)}
              className="text-left text-base p-2 bg-gray-50 border rounded-lg hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer"
            >
              {qr}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-700">Ticket Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={handleResolve} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg border cursor-pointer">Resolve</button>
          <button onClick={handleEscalate} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg border cursor-pointer">Escalate</button>
          <button onClick={handleTransfer} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg border cursor-pointer">Transfer</button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-700">Internal Notes</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded-lg text-sm"
          rows={4}
          placeholder="Add a note for other agents"
        />
        <button onClick={saveNotes} className="px-3 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer">Save Note</button>
      </div>
    </aside>
  );
}