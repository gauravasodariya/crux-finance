"use client";

import React, { useState } from "react";
import { Agent, Ticket } from "@/lib/types";
import {
  Inbox,
  LogOut,
  Plus,
  Search,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Clock,
  Shield,
} from "lucide-react";

type SidebarProps = {
  agent: Agent;
  logout: () => void;
  search: string;
  setSearch: (v: string) => void;
  filter: "all" | "open" | "in-progress" | "resolved";
  setFilter: (v: "all" | "open" | "in-progress" | "resolved") => void;
  queue: "all" | "unassigned" | "my-open" | "waiting" | "escalations";
  setQueue: (
    v: "all" | "unassigned" | "my-open" | "waiting" | "escalations"
  ) => void;
  tickets: Ticket[];
  activeTicketId: string | null;
  onSelectTicket: (id: string) => void;
  setShowWizard: (v: boolean) => void;
  selectedTickets: Set<string>;
  setSelectedTickets: (v: Set<string>) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

const priorityBadge = (p: Ticket["priority"], collapsed: boolean) => (
  <span
    className={`text-xs px-2 py-0.5 rounded-full border ${
      p === "high"
        ? "bg-red-50 text-red-700 border-red-200"
        : p === "medium"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200"
    }`}
  >
    {collapsed ? p[0] : p}
  </span>
);

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export default function Sidebar({
  agent,
  logout,
  search,
  setSearch,
  filter,
  setFilter,
  queue,
  setQueue,
  tickets,
  activeTicketId,
  onSelectTicket,
  setShowWizard,
  selectedTickets,
  setSelectedTickets,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const QueueButton = ({
    Icon,
    label,
    queueName,
  }: {
    Icon: React.ElementType;
    label: string;
    queueName: "unassigned" | "my-open" | "waiting" | "escalations";
  }) => (
    <button
      onClick={() => setQueue(queueName)}
      className={`text-sm px-3 py-2 rounded-lg border flex items-center gap-3 transition-all duration-200 cursor-pointer ${
        queue === queueName
          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
          : "bg-gray-50 hover:bg-gray-100"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <Icon className="w-4 h-4" />
      {!collapsed && label}
    </button>
  );

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col h-full overflow-y-auto scrollbar-thin overscroll-contain transition-all duration-300 ${
        collapsed ? "w-24" : "w-96"
      }`}
    >
      <div
        className={`px-4 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-slate-200 dark:bg-gray-800 z-10 ${
          collapsed ? "flex flex-col items-center" : ""
        }`}
      >
        <div
          className={`flex items-center gap-4 mb-4 ${
            collapsed ? "flex-col" : ""
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold">{agent.name[0]}</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {agent.name}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Available
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5" />
            ) : (
              <ChevronsLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <div
          className={`grid gap-3 ${
            collapsed ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          <button
            onClick={() => setShowWizard(true)}
            className={`px-3 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer ${
              collapsed ? "w-12 h-12" : ""
            }`}
          >
            <Plus className="w-4 h-4" />
            {!collapsed && "New Ticket"}
          </button>
          <button
            onClick={logout}
            className={`px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              collapsed ? "w-12 h-12" : ""
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      <div className={`p-3 ${collapsed ? "px-2" : ""}`}>
        <div className="flex-1 relative mb-2">
          {!collapsed && (
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={collapsed ? "Search" : "Search tickets..."}
            className={`w-full py-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              collapsed ? "pl-3 pr-3 text-center" : "pl-9 pr-3"
            }`}
          />
        </div>
        {!collapsed && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full text-sm bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-2 py-2 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        )}
        {!collapsed && (
          <p className="col-span-2 mt-4 mb-2 text-xs font-semibold text-slate-600">
            Queues
          </p>
        )}
        <div
          className={`grid gap-2 ${
            collapsed ? "grid-cols-1 mt-2" : "grid-cols-2"
          }`}
        >
          <QueueButton Icon={Inbox} label="Unassigned" queueName="unassigned" />
          <QueueButton Icon={Users} label="My Open" queueName="my-open" />
          <QueueButton
            Icon={Clock}
            label="Waiting"
            queueName="waiting"
          />
          <QueueButton
            Icon={Shield}
            label="Escalations"
            queueName="escalations"
          />
        </div>
      </div>

      {/* Enhanced Ticket List */}
      <div className={`px-4 pb-4 pr-2 flex-1 min-h-0`}>
                <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <h4 className="text-sm font-semibold text-slate-700">
                Tickets
              </h4>
            )}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                collapsed
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {tickets.length}
            </span>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-slate-400" />
              </div>
              {!collapsed && (
                <>
                  <p className="text-slate-600 font-medium mb-1">
                    No tickets found
                  </p>
                  <p className="text-sm text-slate-500">
                    Try adjusting your filters
                  </p>
                </>
              )}
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className={`group relative p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  activeTicketId === ticket.id
                    ? "bg-indigo-50 border-indigo-300 shadow-lg shadow-indigo-100"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100"
                }`}
              >
                {/* Selection Checkbox removed as requested */}

                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {priorityBadge(ticket.priority, collapsed)}
                  </div>
                  <div className="flex items-center gap-2">
                    {!collapsed && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ticket.status === "open"
                            ? "bg-red-100 text-red-700"
                            : ticket.status === "in-progress"
                            ? "bg-amber-100 text-amber-700"
                            : ticket.status === "resolved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {ticket.status.replace("-", " ")}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {formatTime(ticket.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Subject or category fallback */}
                {!collapsed && (
                  <h5 className="font-medium text-slate-900 mb-1 line-clamp-2">
                    {(ticket as any).subject || ticket.category}
                  </h5>
                )}

                {/* Last Message Preview */}
                {ticket.messages.length > 0 && !collapsed && (
                  <div className="mb-3 text-sm text-slate-600 line-clamp-2 bg-slate-50 rounded-lg p-2">
                    {ticket.messages[ticket.messages.length - 1].content}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`relative w-8 h-8 rounded-full text-white shadow-md ring-2 flex items-center justify-center ${
                      ticket.priority === 'high' ? 'bg-red-600 ring-red-200' :
                      ticket.priority === 'medium' ? 'bg-amber-500 ring-amber-200' :
                      'bg-indigo-600 ring-indigo-200'
                    }`}>
                      <span className="text-xs font-semibold">
                        {ticket.customerName[0]}
                      </span>
                      {/* status dot */}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                        ticket.status === 'resolved' ? 'bg-emerald-500' :
                        ticket.status === 'in-progress' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></span>
                    </div>
                    {!collapsed && (
                      <span className="text-sm font-medium text-slate-700">
                        {ticket.customerName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {ticket.assignedAgent === agent?.username && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    )}
                    {!collapsed && (
                      <span className="text-xs text-slate-500">
                        {ticket.messages.length} messages
                      </span>
                    )}
                  </div>
                </div>


              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}