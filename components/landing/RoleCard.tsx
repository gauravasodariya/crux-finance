"use client";

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Users } from 'lucide-react';

export function CustomerRoleCard() {
  return (
    <Link href="/customer-login" className={`group relative bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      <div className="relative">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Customer Support</h2>
        <p className="text-white/80 mb-6 text-lg">Chat with our AI assistant or connect with support agents</p>
        <div className={`w-full bg-white text-blue-600 font-semibold py-4 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2`}>
          Start Chat
        </div>
      </div>
    </Link>
  );
}

export function AgentRoleCard() {
  return (
    <Link href="/agent-login" className={`group relative bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      <div className="relative">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Agent Dashboard</h2>
        <p className="text-white/80 mb-6 text-lg">Manage customer tickets and provide real-time support</p>
        <div className={`w-full bg-white text-indigo-600 font-semibold py-4 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2`}>
          Agent Login
        </div>
      </div>
    </Link>
  );
}