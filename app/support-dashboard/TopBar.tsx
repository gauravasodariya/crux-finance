"use client";

import React from "react";
import { Bell, Plus } from "lucide-react";

type TopBarProps = {
  onNewTicket: () => void;
  onAlertsClick?: () => void;
};

export default function TopBar({ onNewTicket, onAlertsClick }: TopBarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text">KS</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            KRUX Support Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Alerts */}
        <button
          onClick={onAlertsClick}
          className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-2 transition-all duration-200 relative cursor-pointer"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="text-slate-700">Alerts</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
        </button>

        {/* New Ticket */}
        <button
          onClick={onNewTicket}
          className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>
    </div>
  );
}