/**
 * DEMO DATA FOR DASHBOARD
 * Provides realistic sample data when no real orders exist
 * Makes the system look fully operational for presentations/demos
 */

export interface DemoOrder {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  totalAmount: number; // in cents
  eventDate: string;
  createdAt: string;
  cakeType: string;
  priority: string;
}

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
}

// Generate realistic demo orders
export const generateDemoOrders = (): DemoOrder[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    // Today's pickups
    {
      id: 'demo-001',
      customerId: 'cust-001',
      customerName: 'Sarah Johnson',
      status: 'ready',
      totalAmount: 8500, // $85
      eventDate: today.toISOString(),
      createdAt: lastWeek.toISOString(),
      cakeType: 'Birthday Celebration',
      priority: 'high'
    },
    {
      id: 'demo-002',
      customerId: 'cust-002',
      customerName: 'Michael Chen',
      status: 'ready',
      totalAmount: 12000, // $120
      eventDate: today.toISOString(),
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      cakeType: 'Italian Cream',
      priority: 'normal'
    },
    {
      id: 'demo-003',
      customerId: 'cust-003',
      customerName: 'Emma Rodriguez',
      status: 'decorating',
      totalAmount: 9500, // $95
      eventDate: today.toISOString(),
      createdAt: yesterday.toISOString(),
      cakeType: 'Chocolate Doberge',
      priority: 'high'
    },
    
    // Active orders (in progress)
    {
      id: 'demo-004',
      customerId: 'cust-004',
      customerName: 'James Williams',
      status: 'baking',
      totalAmount: 7500, // $75
      eventDate: tomorrow.toISOString(),
      createdAt: today.toISOString(),
      cakeType: 'Lemon & Cream Cheese',
      priority: 'normal'
    },
    {
      id: 'demo-005',
      customerId: 'cust-005',
      customerName: 'Olivia Martinez',
      status: 'pending',
      totalAmount: 14500, // $145
      eventDate: nextWeek.toISOString(),
      createdAt: today.toISOString(),
      cakeType: 'Black Forest',
      priority: 'normal'
    },
    {
      id: 'demo-006',
      customerId: 'cust-006',
      customerName: 'Daniel Lee',
      status: 'decorating',
      totalAmount: 10500, // $105
      eventDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: yesterday.toISOString(),
      cakeType: 'German Chocolate',
      priority: 'high'
    },
    
    // Completed orders
    {
      id: 'demo-007',
      customerId: 'cust-007',
      customerName: 'Sophia Anderson',
      status: 'completed',
      totalAmount: 8000, // $80
      eventDate: yesterday.toISOString(),
      createdAt: lastWeek.toISOString(),
      cakeType: 'Strawberry Delight',
      priority: 'normal'
    },
    {
      id: 'demo-008',
      customerId: 'cust-008',
      customerName: 'Ethan Brown',
      status: 'completed',
      totalAmount: 11000, // $110
      eventDate: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(lastWeek.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      cakeType: 'Almond Delight',
      priority: 'normal'
    },
    {
      id: 'demo-009',
      customerId: 'cust-009',
      customerName: 'Ava Taylor',
      status: 'completed',
      totalAmount: 9000, // $90
      eventDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(lastWeek.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      cakeType: 'Cookies & Cream Cake',
      priority: 'normal'
    },
    {
      id: 'demo-010',
      customerId: 'cust-001',
      customerName: 'Sarah Johnson',
      status: 'completed',
      totalAmount: 7800, // $78
      eventDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      cakeType: 'Lemon Doberge',
      priority: 'normal'
    },
    
    // Pending orders (future)
    {
      id: 'demo-011',
      customerId: 'cust-010',
      customerName: 'Noah Garcia',
      status: 'pending',
      totalAmount: 13500, // $135
      eventDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      cakeType: '½ & ½ Doberge (Lemon + Chocolate)',
      priority: 'normal'
    },
    {
      id: 'demo-012',
      customerId: 'cust-002',
      customerName: 'Michael Chen',
      status: 'pending',
      totalAmount: 9200, // $92
      eventDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: today.toISOString(),
      cakeType: 'Pecan Praline Cream Cheese',
      priority: 'normal'
    }
  ];
};

// Generate realistic customer data
export const generateDemoCustomers = (): DemoCustomer[] => {
  return [
    {
      id: 'cust-001',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      totalOrders: 2
    },
    {
      id: 'cust-002',
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      phone: '(555) 234-5678',
      totalOrders: 2
    },
    {
      id: 'cust-003',
      name: 'Emma Rodriguez',
      email: 'emma.r@example.com',
      phone: '(555) 345-6789',
      totalOrders: 1
    },
    {
      id: 'cust-004',
      name: 'James Williams',
      email: 'james.w@example.com',
      phone: '(555) 456-7890',
      totalOrders: 1
    },
    {
      id: 'cust-005',
      name: 'Olivia Martinez',
      email: 'olivia.m@example.com',
      phone: '(555) 567-8901',
      totalOrders: 1
    },
    {
      id: 'cust-006',
      name: 'Daniel Lee',
      email: 'daniel.l@example.com',
      phone: '(555) 678-9012',
      totalOrders: 1
    },
    {
      id: 'cust-007',
      name: 'Sophia Anderson',
      email: 'sophia.a@example.com',
      phone: '(555) 789-0123',
      totalOrders: 1
    },
    {
      id: 'cust-008',
      name: 'Ethan Brown',
      email: 'ethan.b@example.com',
      phone: '(555) 890-1234',
      totalOrders: 1
    },
    {
      id: 'cust-009',
      name: 'Ava Taylor',
      email: 'ava.t@example.com',
      phone: '(555) 901-2345',
      totalOrders: 1
    },
    {
      id: 'cust-010',
      name: 'Noah Garcia',
      email: 'noah.g@example.com',
      phone: '(555) 012-3456',
      totalOrders: 1
    }
  ];
};

// Generate revenue trend for last 6 months
export const generateDemoRevenueTrend = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseRevenue = 4000;
  
  return months.map((month, index) => ({
    month,
    revenue: baseRevenue + (Math.random() * 3000) + (index * 500) // Growing trend
  }));
};

// Recent activity log
export interface DemoActivity {
  id: string;
  type: 'order_created' | 'status_changed' | 'order_completed' | 'customer_added';
  message: string;
  timestamp: string;
  icon: string;
}

export const generateDemoActivity = (): DemoActivity[] => {
  const now = new Date();
  
  return [
    {
      id: 'act-001',
      type: 'order_completed',
      message: 'Order #demo-007 completed for Sophia Anderson',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      icon: 'check'
    },
    {
      id: 'act-002',
      type: 'status_changed',
      message: 'Order #demo-001 moved to Ready for Pickup',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      icon: 'arrow-right'
    },
    {
      id: 'act-003',
      type: 'order_created',
      message: 'New order created for Michael Chen - Pecan Praline',
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      icon: 'plus'
    },
    {
      id: 'act-004',
      type: 'status_changed',
      message: 'Order #demo-006 moved to Decorating stage',
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      icon: 'arrow-right'
    },
    {
      id: 'act-005',
      type: 'customer_added',
      message: 'New customer registered: Noah Garcia',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      icon: 'user-plus'
    }
  ];
};

// Check if demo mode should be enabled
export const shouldUseDemoMode = (orders: any[]): boolean => {
  // Use demo mode if no real orders exist
  return orders.length === 0;
};
