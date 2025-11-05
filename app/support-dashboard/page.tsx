// File: app/support-dashboard/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Agent, Message, Ticket } from '@/lib/types';
import { QUICK_REPLIES } from '@/lib/mockData';
import { CheckCircle, AlertTriangle, Bell } from 'lucide-react';
import TicketWizard from '@/components/TicketWizard';
import AssignModal from '@/components/AssignModal';
import AttachFilesModal from '@/components/AttachFilesModal';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Conversation from './Conversation';
import ToolsPanel from './ToolsPanel';

export default function SupportDashboardPage() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const agent = state.currentUser as Agent | null;

  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState<'all'|'open'|'in-progress'|'resolved'>('all');
  const [queue, setQueue] = useState<'all'|'unassigned'|'my-open'|'waiting'|'escalations'>('all');
  const [showWizard, setShowWizard] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'info'|'warning'|'success', timestamp: number}>>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sortBy, setSortBy] = useState<'newest'|'oldest'|'priority'|'status'>('newest');
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef<{[ticketId: string]: number}>({});

  // Protect route
  // (Removed global theme toggling)

  // Enhanced notification system
  const addNotification = useCallback((message: string, type: 'info'|'warning'|'success' = 'info') => {
    const notification = {
      id: `NOTIF-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);

    // Play sound if enabled
    if (soundEnabled && type !== 'info') {
      playNotificationSound();
    }
  }, [soundEnabled]);

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Real-time message monitoring
  useEffect(() => {
    state.tickets.forEach(ticket => {
      const currentMessageCount = ticket.messages.length;
      const lastCount = lastMessageCountRef.current[ticket.id] || 0;
      
      if (currentMessageCount > lastCount) {
        const newMessages = ticket.messages.slice(lastCount);
        const hasNewCustomerMessage = newMessages.some(msg => 
          msg.senderType === 'customer' && 
          Date.now() - msg.timestamp < 5000 // Message from last 5 seconds
        );
        
        if (hasNewCustomerMessage && ticket.assignedAgent === agent?.username) {
          addNotification(`New message from ${ticket.customerName}`, 'info');
        }
      }
      
      lastMessageCountRef.current[ticket.id] = currentMessageCount;
    });
  }, [state.tickets, agent?.username, addNotification]);

  // Active ticket
  const activeTicket: Ticket | undefined = state.tickets.find(t => t.id === state.activeTicketId) || state.tickets[0];

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages.length]);

  // Derived tickets with filtering, search and sorting
  const tickets = useMemo(() => {
    const statusFiltered = state.tickets.filter(t => filter === 'all' ? true : t.status === filter);
    const queueFiltered = statusFiltered.filter(t => {
      if (queue === 'all') return true;
      if (queue === 'unassigned') return !t.assignedAgent;
      if (queue === 'my-open') return t.assignedAgent === agent?.username && t.status !== 'resolved';
      if (queue === 'waiting') {
        const last = [...t.messages].reverse()[0];
        return last?.senderType === 'agent' && t.status !== 'resolved';
      }
      if (queue === 'escalations') return t.priority === 'high' || t.category.toLowerCase().includes('escalation');
      return true;
    });
    let result = queueFiltered;
    if (search) {
      const q = search.toLowerCase();
      result = queueFiltered.filter(t =>
        (t.customerName?.toLowerCase?.().includes(q) ?? false) ||
        (t.customerPhone?.toLowerCase?.().includes(q) ?? false) ||
        (t.category?.toLowerCase?.().includes(q) ?? false) ||
        // Optional subject support if present in some tickets
        ((t as any).subject ? ((t as any).subject.toLowerCase?.().includes(q) ?? false) : false) ||
        t.messages.some(m => m.content?.toLowerCase?.().includes(q))
      );
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { 'open': 4, 'in-progress': 3, 'waiting': 2, 'resolved': 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        case 'newest':
        default:
          return b.createdAt - a.createdAt;
      }
    });
    return result;
  }, [state.tickets, filter, search, queue, agent, sortBy]);

  // Remove global theme toggling to prevent unintended dark UI

  // (Removed KPI performance metrics calculation as requested)

  const priorityBadge = (p: Ticket['priority']) => (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${p === 'high' ? 'bg-red-50 text-red-700 border-red-200' : p === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{p}</span>
  );

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Enhanced send message with typing indicator
  const sendMessage = () => {
    if (!message.trim() || !activeTicket) return;
    
    const msg: Message = {
      id: `MSG-${Date.now()}`,
      senderId: agent?.username || 'agent',
      senderType: 'agent',
      content: message,
      timestamp: Date.now(),
      read: true,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { ticketId: activeTicket.id, message: msg } });
    setMessage('');
    
    // Update response time metrics
    if (activeTicket.status === 'open') {
      dispatch({ type: 'UPDATE_TICKET', payload: { 
        id: activeTicket.id, 
        updates: { 
          status: 'in-progress',
          firstResponseAt: activeTicket.firstResponseAt || Date.now(),
          assignedAgent: agent?.username
        } 
      }});
    }
    
    addNotification('Message sent successfully', 'success');
  };

  // Use quick reply with enhanced functionality
  const useQuickReply = (text: string) => {
    if (!activeTicket) return;
    const msg: Message = {
      id: `MSG-${Date.now()}`,
      senderId: agent?.username || 'agent',
      senderType: 'agent',
      content: text,
      timestamp: Date.now(),
      read: true,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { ticketId: activeTicket.id, message: msg } });
    addNotification('Quick reply sent', 'success');
  };

  // Resolve ticket (CSAT removed)
  const handleResolve = () => {
    if (!activeTicket) return;
    const resolutionTime = Date.now() - activeTicket.createdAt;
    
    dispatch({ type: 'UPDATE_TICKET', payload: { 
      id: activeTicket.id, 
      updates: { 
        status: 'resolved', 
        priority: 'low',
        resolvedAt: Date.now(),
        resolutionTime
      } 
    }});
    
    addNotification(`Ticket ${activeTicket.id} resolved successfully`, 'success');
  };

  // Enhanced escalate ticket
  const handleEscalate = () => {
    if (!activeTicket) return;
    
    dispatch({ type: 'UPDATE_TICKET', payload: { 
      id: activeTicket.id, 
      updates: { 
        priority: 'high', 
        category: 'Escalation',
        status: 'in-progress',
        escalatedAt: Date.now(),
        escalatedBy: agent?.username
      } 
    }});
    
    addNotification(`Ticket ${activeTicket.id} escalated to high priority`, 'warning');
  };

  // Enhanced transfer ticket
  const handleTransfer = () => {
    if (!activeTicket || !state.agents.length) return;
    const next = state.agents.find(a => a.username !== agent?.username);
    if (!next) {
      addNotification('No available agent to transfer this ticket', 'warning');
      return;
    }

    dispatch({ type: 'UPDATE_TICKET', payload: { 
      id: activeTicket.id, 
      updates: { 
        assignedAgent: next.username,
        transferredAt: Date.now(),
        transferredBy: agent?.username
      } 
    }});

    addNotification(`Ticket ${activeTicket.id} transferred to ${next.username}`, 'info');
  };

  // Enhanced save note
  const saveNotes = () => {
    if (!note.trim() || !activeTicket) return;
    const appended = `${activeTicket.internalNotes ? activeTicket.internalNotes + '\n' : ''}[Note] ${note}`;
    dispatch({ type: 'UPDATE_TICKET', payload: { 
      id: activeTicket.id, 
      updates: { internalNotes: appended } 
    }});
    
    setNote('');
    addNotification('Note saved successfully', 'success');
  };

  const responseTime = useMemo(() => {
    if (!activeTicket) return '—';
    const lastCustomerMsg = [...activeTicket.messages].reverse().find(m => m.senderType === 'customer');
    const lastAgentMsg = [...activeTicket.messages].reverse().find(m => m.senderType === 'agent');
    if (!lastCustomerMsg || !lastAgentMsg) return '—';
    const diffMs = lastAgentMsg.timestamp - lastCustomerMsg.timestamp;
    if (diffMs <= 0) return '—';
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${mins}m ${secs}s`;
  }, [activeTicket]);

  // Bulk operations (CSAT removed)
  const bulkResolve = () => {
    selectedTickets.forEach(ticketId => {
      const ticket = state.tickets.find(t => t.id === ticketId);
      if (ticket && ticket.status !== 'resolved') {
        dispatch({ type: 'UPDATE_TICKET', payload: { 
          id: ticketId, 
          updates: { 
            status: 'resolved', 
            resolvedAt: Date.now(),
          } 
        }});
      }
    });
    setSelectedTickets(new Set());
    addNotification(`${selectedTickets.size} tickets resolved`, 'success');
  };

  const bulkTransfer = (newAgent: string) => {
    selectedTickets.forEach(ticketId => {
      dispatch({ type: 'UPDATE_TICKET', payload: { 
        id: ticketId, 
        updates: { 
          assignedAgent: newAgent,
          transferredAt: Date.now(),
          transferredBy: agent?.username
        } 
      }});
    });
    setSelectedTickets(new Set());
    addNotification(`${selectedTickets.size} tickets transferred to ${newAgent}`, 'info');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            sendMessage();
            break;
          // Removed Ctrl+R to avoid conflict with browser refresh
          case 'e':
            e.preventDefault();
            if (activeTicket) handleEscalate();
            break;
          case 'n':
            e.preventDefault();
            setShowWizard(true);
            break;
          case 't':
            e.preventDefault();
            if (activeTicket) handleTransfer();
            break;
          case 'q':
            e.preventDefault();
            if (QUICK_REPLIES.length > 0) useQuickReply(QUICK_REPLIES[0]);
            break;
          case 'ArrowUp':
          case 'ArrowDown': {
            e.preventDefault();
            const currentIdx = tickets.findIndex(t => t.id === activeTicket?.id);
            if (currentIdx !== -1) {
              const nextIdx = e.key === 'ArrowUp' 
                ? Math.max(0, currentIdx - 1) 
                : Math.min(tickets.length - 1, currentIdx + 1);
              if (nextIdx !== currentIdx) {
                dispatch({ type: 'SET_ACTIVE_TICKET', payload: tickets[nextIdx].id });
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTicket, sendMessage, handleResolve, handleEscalate, handleTransfer, useQuickReply, tickets]);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  if (!agent) return null;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 grid grid-rows-[80px_1fr]">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div key={notification.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-lg ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {notification.type === 'info' && <Bell className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Top bar */}
      <TopBar onNewTicket={() => setShowWizard(true)} onAlertsClick={() => {}} />

      <div className={`grid grid-cols-1 overflow-hidden transition-all duration-300 ${collapsed ? 'lg:grid-cols-[96px_1fr]' : 'lg:grid-cols-[384px_1fr]'}`}>
        {/* Left: Ticket Queue */}
        <Sidebar
          agent={agent!}
          logout={logout}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          queue={queue}
          setQueue={setQueue}
          tickets={tickets}
          activeTicketId={state.activeTicketId || null}
          onSelectTicket={(id) => dispatch({ type: 'SET_ACTIVE_TICKET', payload: id })}
          setShowWizard={setShowWizard}
          selectedTickets={selectedTickets}
          setSelectedTickets={setSelectedTickets}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

      {/* Right: Conversation + Tools */}
        <main className="grid grid-cols-1 lg:grid-cols-[1fr_320px] h-full overflow-hidden">
        <Conversation
          activeTicket={activeTicket}
          responseTime={responseTime}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          messagesEndRef={messagesEndRef}
          setShowAttach={setShowAttach}
          setShowAssign={setShowAssign}
          formatTime={formatTime}
        />
        <ToolsPanel
          useQuickReply={useQuickReply}
          handleResolve={handleResolve}
          handleEscalate={handleEscalate}
          handleTransfer={handleTransfer}
          note={note}
          setNote={setNote}
          saveNotes={saveNotes}
        />
      </main>
      </div>
      {showWizard && <TicketWizard onClose={() => setShowWizard(false)} />}
      {showAssign && activeTicket && <AssignModal ticket={activeTicket} onClose={()=>setShowAssign(false)} />}
      {showAttach && activeTicket && <AttachFilesModal ticket={activeTicket} onClose={()=>setShowAttach(false)} />}
      
      {/* (Removed duplicate enhanced notifications block to eliminate warnings and duplicate UI) */}
    </div>
  );
}