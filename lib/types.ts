export interface Message {
  id: string;
  senderId: string;
  senderType: 'customer' | 'bot' | 'agent';
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  messages: Message[];
  assignedAgent?: string;
  createdAt: number;
  updatedAt: number;
  internalNotes: string;
  // Optional lifecycle fields used by actions
  resolvedAt?: number;
  resolutionTime?: number;
  escalatedAt?: number;
  escalatedBy?: string;
  transferredAt?: number;
  transferredBy?: string;
  firstResponseAt?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  applications: Application[];
}

export interface Application {
  id: string;
  type: string;
  amount: number;
  status: string;
  lastUpdate: string;
}

export interface Agent {
  username: string;
  name: string;
  status: 'available' | 'busy' | 'away';
  email: string;
  phone: string;
}

export interface AppState {
  currentUser: Customer | Agent | null;
  userType: 'customer' | 'agent' | null;
  tickets: Ticket[];
  customers: Customer[];
  agents: Agent[];
  activeTicketId: string | null;
}

export type Action =
  | { type: 'LOGIN'; payload: { user: Customer | Agent; userType: 'customer' | 'agent' } }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: { id: string; updates: Partial<Ticket> } }
  | { type: 'ADD_MESSAGE'; payload: { ticketId: string; message: Message } }
  | { type: 'SET_ACTIVE_TICKET'; payload: string | null }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };