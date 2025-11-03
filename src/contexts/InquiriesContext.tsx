import { createContext, useContext, useState, ReactNode } from 'react';

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  message: string;
  productName: string;
  inspirationImages?: File[];
  status: 'pending' | 'reviewed' | 'contacted';
  submittedAt: string;
}

interface InquiriesContextType {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'submittedAt'>) => void;
  updateInquiryStatus: (id: number, status: 'pending' | 'reviewed' | 'contacted') => void;
}

const InquiriesContext = createContext<InquiriesContextType | undefined>(undefined);

const mockInquiries: Inquiry[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '555-123-4567',
    eventDate: '2025-12-15',
    message: 'Looking for a 3-tier wedding cake with floral decorations',
    productName: 'Elegant Wedding Tier',
    status: 'pending',
    submittedAt: '2025-11-02T14:30:00'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'mchen@company.com',
    phone: '555-234-5678',
    eventDate: '2025-11-20',
    message: 'Need a corporate logo cake for our company anniversary',
    productName: 'Corporate Logo Cake',
    status: 'reviewed',
    submittedAt: '2025-11-01T10:15:00'
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    phone: '555-345-6789',
    eventDate: '2025-11-25',
    message: 'Birthday cake for my daughter turning 5, she loves unicorns!',
    productName: 'Birthday Celebration',
    status: 'contacted',
    submittedAt: '2025-10-31T16:45:00'
  }
];

export function InquiriesProvider({ children }: { children: ReactNode }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'status' | 'submittedAt'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: number, status: 'pending' | 'reviewed' | 'contacted') => {
    setInquiries(prev =>
      prev.map(inquiry =>
        inquiry.id === id ? { ...inquiry, status } : inquiry
      )
    );
  };

  return (
    <InquiriesContext.Provider value={{ inquiries, addInquiry, updateInquiryStatus }}>
      {children}
    </InquiriesContext.Provider>
  );
}

export function useInquiries() {
  const context = useContext(InquiriesContext);
  if (context === undefined) {
    throw new Error('useInquiries must be used within an InquiriesProvider');
  }
  return context;
}
