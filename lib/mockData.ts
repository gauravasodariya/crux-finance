import { Customer, Agent } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'C001',
    name: 'Gaurav Asodariya',
    phone: '8799300210',
    email: 'gaurav@gmail.com',
    applications: [
      { 
        id: 'APP-17903', 
        type: 'Business Loan', 
        amount: 500000, 
        status: 'Under Review', 
        lastUpdate: 'Today 09:45' 
      },
      { 
        id: 'APP-15621', 
        type: 'Personal Loan', 
        amount: 200000, 
        status: 'Approved', 
        lastUpdate: 'Yesterday' 
      }
    ]
  },
  {
    id: 'C002',
    name: 'Raj Patel',
    phone: '5879525878',
    email: 'rajpatel@gmail.com',
    applications: [
      { 
        id: 'APP-18741', 
        type: 'Home Loan', 
        amount: 3500000, 
        status: 'Pending', 
        lastUpdate: 'Today 08:15' 
      },
      { 
        id: 'APP-19234', 
        type: 'Vehicle Loan', 
        amount: 800000, 
        status: 'Approved', 
        lastUpdate: '2 days ago' 
      }
    ]
  }
];

export const MOCK_AGENTS: Agent[] = [
  { 
    username: 'amit.kumar', 
    name: 'Amit Kumar', 
    status: 'available',
    email: 'amit.kumar@krux.finance',
    phone: '+919876543212'
  },
  { 
    username: 'sneha.singh', 
    name: 'Sneha Singh', 
    status: 'available',
    email: 'sneha.singh@krux.finance',
    phone: '+919876543213'
  }
];

export const QUICK_REPLIES = [
  "Thank you for contacting KRUX Finance. How can I assist you today?",
  "I'm checking your application status now. Please give me a moment.",
  "Could you please provide your Application ID for verification?",
  "Your documents have been received. Our team will review them within 24 hours.",
  "I'll escalate this to our senior team for priority handling.",
  "Is there anything else I can help you with today?"
];