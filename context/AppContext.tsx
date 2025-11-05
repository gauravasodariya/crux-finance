'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Action, Customer, Agent, Ticket } from '@/lib/types';
import { MOCK_CUSTOMERS, MOCK_AGENTS } from '@/lib/mockData';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

const initialState: AppState = {
  currentUser: null,
  userType: null,
  tickets: [],
  customers: MOCK_CUSTOMERS,
  agents: MOCK_AGENTS,
  activeTicketId: null,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.payload.user,
        userType: action.payload.userType,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        userType: null,
        activeTicketId: null,
      };
    
    case 'ADD_TICKET':
      return {
        ...state,
        tickets: [...state.tickets, action.payload],
      };
    
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(t =>
          t.id === action.payload.id 
            ? { ...t, ...action.payload.updates, updatedAt: Date.now() } 
            : t
        ),
      };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        tickets: state.tickets.map(t =>
          t.id === action.payload.ticketId
            ? { 
                ...t, 
                messages: [...t.messages, action.payload.message], 
                updatedAt: Date.now() 
              }
            : t
        ),
      };
    
    case 'SET_ACTIVE_TICKET':
      return {
        ...state,
        activeTicketId: action.payload,
      };
    
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    const savedUserType = loadFromStorage(STORAGE_KEYS.USER_TYPE, null);
    const savedTickets = loadFromStorage<Ticket[]>(STORAGE_KEYS.TICKETS, []);

    if (savedUser && savedUserType) {
      dispatch({ 
        type: 'LOGIN', 
        payload: { user: savedUser, userType: savedUserType } 
      });
    }
    if (savedTickets.length > 0) {
      dispatch({ type: 'LOAD_STATE', payload: { tickets: savedTickets } });
    }
  }, []);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (state.tickets.length > 0) {
      saveToStorage(STORAGE_KEYS.TICKETS, state.tickets);
    }
  }, [state.tickets]);

  // Save current user whenever it changes
  useEffect(() => {
    if (state.currentUser) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
      saveToStorage(STORAGE_KEYS.USER_TYPE, state.userType);
    }
  }, [state.currentUser, state.userType]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};