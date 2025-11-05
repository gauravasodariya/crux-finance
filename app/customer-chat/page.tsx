// File: app/customer-chat/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, LogOut, Bot, User as UserIcon, Menu, X, Mic, MicOff } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Customer, Message, Ticket } from '@/lib/types';
import { getBotResponse, shouldEscalateToHuman, getCategoryFromMessage } from '@/lib/botLogic';

export default function CustomerChatPage() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const customer = state.currentUser as Customer;
  const customerTicket = state.tickets.find(
    t => t.customerId === customer?.id && t.status !== 'resolved'
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!customer) {
      router.push('/');
    }
  }, [customer, router]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [customerTicket?.messages]);

  // Initialize ticket with welcome message
  useEffect(() => {
    if (customer && !customerTicket) {
      const newTicket: Ticket = {
        id: `TKT-${Date.now()}`,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        category: 'General Inquiry',
        priority: 'medium',
        status: 'open',
        messages: [
          {
            id: `MSG-${Date.now()}`,
            senderId: 'bot',
            senderType: 'bot',
            content: getBotResponse('hello'),
            timestamp: Date.now(),
            read: true
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        internalNotes: ''
      };
      dispatch({ type: 'ADD_TICKET', payload: newTicket });
    }
  }, [customer, customerTicket, dispatch]);

  const sendMessage = () => {
    if (!message.trim() || !customerTicket) return;

    const userMsg: Message = {
      id: `MSG-${Date.now()}`,
      senderId: customer.id,
      senderType: 'customer',
      content: message,
      timestamp: Date.now(),
      read: false
    };

    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: { ticketId: customerTicket.id, message: userMsg } 
    });

    const category = getCategoryFromMessage(message);
    dispatch({
      type: 'UPDATE_TICKET',
      payload: { id: customerTicket.id, updates: { category } }
    });

    setMessage('');

    // Check if should escalate to human
    if (shouldEscalateToHuman(message)) {
      setIsTyping(true);
      setTimeout(() => {
        const escalationMsg: Message = {
          id: `MSG-${Date.now() + 1}`,
          senderId: 'bot',
          senderType: 'bot',
          content: "🙋 Connecting you to our support team...\n\nA customer support agent will assist you shortly!\n\nAverage wait time: 2-3 minutes",
          timestamp: Date.now(),
          read: true
        };
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { ticketId: customerTicket.id, message: escalationMsg } 
        });
        dispatch({ 
          type: 'UPDATE_TICKET', 
          payload: { 
            id: customerTicket.id, 
            updates: { status: 'in-progress', priority: 'high', category: 'Agent Request' } 
          } 
        });
        setIsTyping(false);
      }, 1500);
    } else {
      // Bot response
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = getBotResponse(message);
        const botMsg: Message = {
          id: `MSG-${Date.now() + 1}`,
          senderId: 'bot',
          senderType: 'bot',
          content: botResponse,
          timestamp: Date.now(),
          read: true
        };
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { ticketId: customerTicket.id, message: botMsg } 
        });
        setIsTyping(false);
      }, 1200);
    }
  };

  // Voice Input (Web Speech API)
  const startVoiceInput = () => {
    setRecognitionError(null);
    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SpeechRecognition) {
        setRecognitionError('Voice input not supported in this browser.');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognitionRef.current = recognition;

      let finalTranscript = '';
      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        setMessage(prev => finalTranscript || prev);
      };

      recognition.onerror = (e: any) => {
        setRecognitionError(e.error || 'Voice input error');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } catch (e) {
      setRecognitionError('Failed to start voice input');
      setIsRecording(false);
    }
  };

  const stopVoiceInput = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setIsRecording(false);
  };

  // Quick topic selection to auto-send prompts
  const sendQuickTopic = (topic: 'loan'|'documents'|'status'|'rates'|'agent') => {
    if (!customerTicket) return;
    const mapping: Record<typeof topic, string> = {
      loan: 'Help me with loan application',
      documents: 'What documents are required?',
      status: 'Check my application status',
      rates: 'What are current interest rates and EMI?',
      agent: 'I want to talk to a human agent',
    } as any;
    const text = mapping[topic];

    const userMsg: Message = {
      id: `MSG-${Date.now()}`,
      senderId: customer!.id,
      senderType: 'customer',
      content: text,
      timestamp: Date.now(),
      read: false
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { ticketId: customerTicket.id, message: userMsg } });
    const category = getCategoryFromMessage(text);
    dispatch({ type: 'UPDATE_TICKET', payload: { id: customerTicket.id, updates: { category } } });

    if (shouldEscalateToHuman(text)) {
      setIsTyping(true);
      setTimeout(() => {
        const escalationMsg: Message = {
          id: `MSG-${Date.now() + 1}`,
          senderId: 'bot',
          senderType: 'bot',
          content: "🙋 Connecting you to our support team...\n\nA customer support agent will assist you shortly!\n\nAverage wait time: 2-3 minutes",
          timestamp: Date.now(),
          read: true
        };
        dispatch({ type: 'ADD_MESSAGE', payload: { ticketId: customerTicket.id, message: escalationMsg } });
        dispatch({ type: 'UPDATE_TICKET', payload: { id: customerTicket.id, updates: { status: 'in-progress', priority: 'high', category: 'Agent Request' } } });
        setIsTyping(false);
      }, 1200);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = getBotResponse(text);
        const botMsg: Message = {
          id: `MSG-${Date.now() + 1}`,
          senderId: 'bot',
          senderType: 'bot',
          content: botResponse,
          timestamp: Date.now(),
          read: true
        };
        dispatch({ type: 'ADD_MESSAGE', payload: { ticketId: customerTicket.id, message: botMsg } });
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!customer) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">KRUX Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100 font-medium">Always available</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"
          >
            {showMenu ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="bg-white border-b shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Badge */}
        <div className="flex justify-center">
          <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
            <span className="text-xs font-medium text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Messages */}
        {customerTicket?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.senderType === 'customer' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              {msg.senderType !== 'customer' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 bg-white border-2 border-gray-200 shadow-sm">
                  {msg.senderType === 'bot' ? (
                    <Bot className="w-4 h-4 text-blue-600" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.senderType === 'customer'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                      : msg.senderType === 'agent'
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-bl-sm'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </p>
                </div>
                <span className={`text-sm mt-1 block ${
                  msg.senderType === 'customer' ? 'text-right text-gray-500' : 'text-left text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0 mb-1">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Quick Topics */}
          <div className="mb-3 flex flex-wrap gap-2">
            <button onClick={() => sendQuickTopic('loan')} className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">Loan application</button>
            <button onClick={() => sendQuickTopic('documents')} className="text-sm px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">Documents</button>
            <button onClick={() => sendQuickTopic('status')} className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">Application status</button>
            <button onClick={() => sendQuickTopic('rates')} className="text-sm px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">Rates & EMI</button>
            <button onClick={() => sendQuickTopic('agent')} className="text-sm px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full">Talk to agent</button>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-base text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => (isRecording ? stopVoiceInput() : startVoiceInput())}
              className={`p-3.5 rounded-2xl border-2 ${isRecording ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 bg-gray-50 text-gray-700'} hover:bg-gray-100 transition`}
              aria-label={isRecording ? 'Stop voice input' : 'Start voice input'}
            >
              {isRecording ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
            </button>
            <button
              onClick={sendMessage}
              disabled={!message.trim() || isTyping}
              className="p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
          {recognitionError && (
            <p className="text-xs text-red-600 mt-1 text-center">{recognitionError}</p>
          )}
        </div>
      </div>
    </div>
  );
}