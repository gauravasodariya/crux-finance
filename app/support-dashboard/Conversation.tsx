"use client";

import React, { RefObject } from "react";
import { Ticket } from "@/lib/types";
import { Bot, Clock, MessagesSquare, Paperclip, Send, User as UserIcon } from "lucide-react";

type ConversationProps = {
  activeTicket?: Ticket;
  responseTime: string;
  message: string;
  setMessage: (v: string) => void;
  sendMessage: () => void;
  messagesEndRef: RefObject<HTMLDivElement>;
  setShowAttach: (v: boolean) => void;
  setShowAssign: (v: boolean) => void;
  formatTime: (ts: number) => string;
};

export default function Conversation({
  activeTicket,
  responseTime,
  message,
  setMessage,
  sendMessage,
  messagesEndRef,
  setShowAttach,
  setShowAssign,
  formatTime,
}: ConversationProps) {
  return (
    <section className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessagesSquare className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="font-semibold text-gray-900">Conversation</p>
            <p className="text-xs text-gray-500">
              {activeTicket?.customerName} • {activeTicket?.customerPhone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setShowAttach(true)}
            className="px-3 py-1.5 bg-gray-100 border rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Paperclip className="w-4 h-4" /> Attach
          </button>
          <button
            onClick={() => setShowAssign(true)}
            className="px-3 py-1.5 bg-gray-100 border rounded-lg cursor-pointer"
          >
            Assign
          </button>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" /> <span>Response: {responseTime}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-gray-900 scrollbar-thin scroll-smooth overscroll-contain">
        {activeTicket?.messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderType === "agent" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end gap-3 max-w-[75%] ${m.senderType === "agent" ? "flex-row-reverse" : "flex-row"}`}>
              {m.senderType !== "agent" && (
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md">
                  {m.senderType === "bot" ? (
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              )}
              <div className={`${m.senderType === "agent" ? "order-1" : "order-2"}`}>
                <div className={`px-5 py-3 rounded-2xl shadow-lg ${m.senderType === "agent" ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-lg" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-lg"}`}>
                  <p className="text-base whitespace-pre-line leading-relaxed">{m.content}</p>
                </div>
                <span className={`text-sm mt-2 block font-medium ${m.senderType === "agent" ? "text-right text-indigo-500 dark:text-indigo-400" : "text-left text-gray-500 dark:text-gray-400"}`}>
                  {formatTime(m.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-6">
        <div className="max-w-5xl mx-auto flex gap-3 items-end">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-all duration-200 shadow-inner">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              placeholder="Type your reply…"
              className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center font-medium">
          Enter to send • Shift+Enter for newline
        </p>
      </div>
    </section>
  );
}