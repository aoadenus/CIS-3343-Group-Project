/**
 * Emily Bakes Cakes - Presentation Mock Data
 * For CIS 3343 Class Project - Due Nov 21, 2025
 * 
 * This file contains realistic mock data for demonstration purposes.
 * Ensures the application looks complete and professional even without a backend.
 */

// ============================================================================
// 14 SIGNATURE CAKES (from case study)
// ============================================================================

export const SIGNATURE_CAKES = [
  {
    id: 'cake-001',
    name: 'Birthday Celebration',
    description: 'Classic vanilla or chocolate with custom decorations and personalized message',
    basePrice: 45.00,
    category: 'Specialty',
    sizes: ['6-inch', '8-inch', '10-inch', '12-inch'],
    image: '/products/birthday-celebration.jpg',
    popular: true
  },
  {
    id: 'cake-002',
    name: 'Chocolate Doberge',
    description: 'New Orleans classic - 6 layers of chocolate with chocolate custard',
    basePrice: 55.00,
    category: 'Doberge',
    sizes: ['8-inch', '10-inch'],
    image: '/products/chocolate-doberge.jpg',
    popular: true
  },
  {
    id: 'cake-003',
    name: 'Lemon Doberge',
    description: 'Traditional New Orleans treat - 6 layers with lemon custard',
    basePrice: 55.00,
    category: 'Doberge',
    sizes: ['8-inch', '10-inch'],
    image: '/products/lemon-doberge.jpg',
    popular: true
  },
  {
    id: 'cake-004',
    name: 'German Chocolate',
    description: 'Rich chocolate cake with coconut-pecan frosting',
    basePrice: 50.00,
    category: 'Chocolate',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/german-chocolate.jpg',
    popular: false
  },
  {
    id: 'cake-005',
    name: 'Italian Cream',
    description: 'Buttermilk cake with cream cheese frosting, pecans, and coconut',
    basePrice: 52.00,
    category: 'Specialty',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/italian-cream.jpg',
    popular: true
  },
  {
    id: 'cake-006',
    name: 'Black Forest',
    description: 'Chocolate layers with cherry filling and whipped cream',
    basePrice: 54.00,
    category: 'Chocolate',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/black-forest.jpg',
    popular: false
  },
  {
    id: 'cake-007',
    name: 'Strawberry Delight',
    description: 'Light vanilla cake with fresh strawberries and cream',
    basePrice: 48.00,
    category: 'Fruit',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/strawberry-delight.jpg',
    popular: true
  },
  {
    id: 'cake-008',
    name: 'Almond Delight',
    description: 'Almond-flavored cake with buttercream and toasted almonds',
    basePrice: 50.00,
    category: 'Specialty',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/almond-delight.jpg',
    popular: false
  },
  {
    id: 'cake-009',
    name: 'Red Velvet',
    description: 'Southern classic with cream cheese frosting',
    basePrice: 48.00,
    category: 'Classic',
    sizes: ['8-inch', '10-inch', '12-inch', 'Sheet'],
    image: '/products/red-velvet.jpg',
    popular: true
  },
  {
    id: 'cake-010',
    name: 'Carrot Cake',
    description: 'Moist carrot cake with cream cheese frosting and walnuts',
    basePrice: 46.00,
    category: 'Classic',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/carrot-cake.jpg',
    popular: false
  },
  {
    id: 'cake-011',
    name: 'Pineapple Upside Down',
    description: 'Caramelized pineapple and cherries on buttery cake',
    basePrice: 44.00,
    category: 'Classic',
    sizes: ['8-inch', '10-inch'],
    image: '/products/pineapple-upside-down.jpg',
    popular: false
  },
  {
    id: 'cake-012',
    name: 'Coconut Cream',
    description: 'Light cake with coconut cream filling and toasted coconut',
    basePrice: 49.00,
    category: 'Specialty',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/coconut-cream.jpg',
    popular: false
  },
  {
    id: 'cake-013',
    name: 'Hummingbird Cake',
    description: 'Southern favorite with banana, pineapple, and pecans',
    basePrice: 51.00,
    category: 'Specialty',
    sizes: ['8-inch', '10-inch', '12-inch'],
    image: '/products/hummingbird-cake.jpg',
    popular: true
  },
  {
    id: 'cake-014',
    name: 'Texas Sheet Cake',
    description: 'Large chocolate sheet cake perfect for parties',
    basePrice: 65.00,
    category: 'Sheet',
    sizes: ['Half-Sheet', 'Full-Sheet'],
    image: '/products/texas-sheet-cake.jpg',
    popular: true
  }
];

// ============================================================================
// SAMPLE CUSTOMERS (Retail + Corporate + Preferred)
// ============================================================================

export const SAMPLE_CUSTOMERS = [
  {
    id: 'cust-001',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(713) 555-0101',
    customerType: 'retail',
    isPreferred: true,
    totalOrders: 12,
    lifetimeValue: 840.00,
    joinedDate: '2024-03-15',
    notes: 'Prefers lemon flavors, allergic to nuts'
  },
  {
    id: 'cust-002',
    fullName: 'Michael Chen',
    email: 'michael.chen@techcorp.com',
    phone: '(713) 555-0102',
    customerType: 'corporate',
    isPreferred: true,
    company: 'TechCorp Industries',
    totalOrders: 8,
    lifetimeValue: 1250.00,
    joinedDate: '2024-01-20',
    notes: 'Monthly team celebrations, invoicing required'
  },
  {
    id: 'cust-003',
    fullName: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(713) 555-0103',
    customerType: 'retail',
    isPreferred: false,
    totalOrders: 3,
    lifetimeValue: 215.00,
    joinedDate: '2024-09-05',
    notes: ''
  },
  {
    id: 'cust-004',
    fullName: 'David Kim',
    email: 'dkim@mediahub.com',
    phone: '(713) 555-0104',
    customerType: 'corporate',
    isPreferred: true,
    company: 'MediaHub Agency',
    totalOrders: 15,
    lifetimeValue: 2100.00,
    joinedDate: '2023-11-10',
    notes: 'Net-30 payment terms, prefers chocolate'
  },
  {
    id: 'cust-005',
    fullName: 'Lisa Martinez',
    email: 'lisa.martinez@email.com',
    phone: '(713) 555-0105',
    customerType: 'retail',
    isPreferred: true,
    totalOrders: 7,
    lifetimeValue: 490.00,
    joinedDate: '2024-05-22',
    notes: 'Always orders 2 weeks in advance'
  },
  {
    id: 'cust-006',
    fullName: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '(713) 555-0106',
    customerType: 'retail',
    isPreferred: false,
    totalOrders: 2,
    lifetimeValue: 140.00,
    joinedDate: '2024-10-01',
    notes: ''
  },
  {
    id: 'cust-007',
    fullName: 'Maria Garcia',
    email: 'procurement@healthcare.org',
    phone: '(713) 555-0107',
    customerType: 'corporate',
    isPreferred: true,
    company: 'Houston Healthcare',
    totalOrders: 20,
    lifetimeValue: 3200.00,
    joinedDate: '2023-08-15',
    notes: 'Hospital events, large orders, requires dietary labels'
  },
  {
    id: 'cust-008',
    fullName: 'Robert Brown',
    email: 'robert.b@email.com',
    phone: '(713) 555-0108',
    customerType: 'retail',
    isPreferred: false,
    totalOrders: 1,
    lifetimeValue: 75.00,
    joinedDate: '2024-10-28',
    notes: 'First-time customer'
  },
  {
    id: 'cust-009',
    fullName: 'Jennifer Taylor',
    email: 'jtaylor@lawfirm.com',
    phone: '(713) 555-0109',
    customerType: 'corporate',
    isPreferred: true,
    company: 'Taylor & Associates Law',
    totalOrders: 10,
    lifetimeValue: 1450.00,
    joinedDate: '2024-02-14',
    notes: 'Quarterly events, prefers professional presentation'
  },
  {
    id: 'cust-010',
    fullName: 'Amanda White',
    email: 'amanda.white@email.com',
    phone: '(713) 555-0110',
    customerType: 'retail',
    isPreferred: true,
    totalOrders: 9,
    lifetimeValue: 680.00,
    joinedDate: '2024-04-03',
    notes: 'Loves Italian Cream cake'
  },
  {
    id: 'cust-011',
    fullName: 'Christopher Lee',
    email: 'chris.lee@email.com',
    phone: '(713) 555-0111',
    customerType: 'retail',
    isPreferred: false,
    totalOrders: 4,
    lifetimeValue: 320.00,
    joinedDate: '2024-07-19',
    notes: ''
  },
  {
    id: 'cust-012',
    fullName: 'Patricia Davis',
    email: 'events@grandhotel.com',
    phone: '(713) 555-0112',
    customerType: 'corporate',
    isPreferred: true,
    company: 'Grand Hotel Houston',
    totalOrders: 25,
    lifetimeValue: 4500.00,
    joinedDate: '2023-06-01',
    notes: 'Hotel catering partner, weekly orders'
  },
  {
    id: 'cust-013',
    fullName: 'Daniel Anderson',
    email: 'daniel.a@email.com',
    phone: '(713) 555-0113',
    customerType: 'retail',
    isPreferred: false,
    totalOrders: 2,
    lifetimeValue: 165.00,
    joinedDate: '2024-09-12',
    notes: ''
  },
  {
    id: 'cust-014',
    fullName: 'Michelle Thomas',
    email: 'michelle.thomas@email.com',
    phone: '(713) 555-0114',
    customerType: 'retail',
    isPreferred: true,
    totalOrders: 11,
    lifetimeValue: 795.00,
    joinedDate: '2024-01-08',
    notes: 'Birthday club member, monthly orders'
  },
  {
    id: 'cust-015',
    fullName: 'Kevin Jackson',
    email: 'kjackson@startup.io',
    phone: '(713) 555-0115',
    customerType: 'corporate',
    isPreferred: false,
    company: 'StartupHub',
    totalOrders: 5,
    lifetimeValue: 425.00,
    joinedDate: '2024-08-20',
    notes: 'New tech startup, growing team'
  }
];

// ============================================================================
// SAMPLE ORDERS (Various Statuses)
// ============================================================================

export const SAMPLE_ORDERS = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2025-0258',
    customerId: 'cust-001',
    customerName: 'Sarah Johnson',
    cakeId: 'cake-003',
    cakeName: 'Lemon Doberge',
    size: '8-inch',
    quantity: 1,
    totalAmount: 55.00,
    depositAmount: 27.50,
    balanceDue: 27.50,
    status: 'pending',
    orderDate: '2025-11-17',
    pickupDate: '2025-11-22',
    specialInstructions: 'Happy Birthday Sarah! - yellow icing'
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2025-0257',
    customerId: 'cust-002',
    customerName: 'Michael Chen',
    cakeId: 'cake-002',
    cakeName: 'Chocolate Doberge',
    size: '10-inch',
    quantity: 1,
    totalAmount: 75.00,
    depositAmount: 37.50,
    balanceDue: 37.50,
    status: 'in_prep',
    orderDate: '2025-11-15',
    pickupDate: '2025-11-21',
    specialInstructions: 'Corporate logo on top'
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2025-0256',
    customerId: 'cust-003',
    customerName: 'Emily Rodriguez',
    cakeId: 'cake-007',
    cakeName: 'Strawberry Delight',
    size: '8-inch',
    quantity: 1,
    totalAmount: 48.00,
    depositAmount: 24.00,
    balanceDue: 24.00,
    status: 'in_decoration',
    orderDate: '2025-11-14',
    pickupDate: '2025-11-20',
    specialInstructions: 'Fresh strawberries on top'
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2025-0255',
    customerId: 'cust-004',
    customerName: 'David Kim',
    cakeId: 'cake-004',
    cakeName: 'German Chocolate',
    size: '12-inch',
    quantity: 2,
    totalAmount: 140.00,
    depositAmount: 70.00,
    balanceDue: 70.00,
    status: 'ready',
    orderDate: '2025-11-13',
    pickupDate: '2025-11-19',
    specialInstructions: 'Two separate boxes'
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-2025-0254',
    customerId: 'cust-005',
    customerName: 'Lisa Martinez',
    cakeId: 'cake-008',
    cakeName: 'Almond Delight',
    size: '10-inch',
    quantity: 1,
    totalAmount: 65.00,
    depositAmount: 65.00,
    balanceDue: 0.00,
    status: 'completed',
    orderDate: '2025-11-10',
    pickupDate: '2025-11-18',
    specialInstructions: 'Extra toasted almonds'
  },
  {
    id: 'ord-006',
    orderNumber: 'ORD-2025-0253',
    customerId: 'cust-006',
    customerName: 'James Wilson',
    cakeId: 'cake-006',
    cakeName: 'Black Forest',
    size: '8-inch',
    quantity: 1,
    totalAmount: 54.00,
    depositAmount: 27.00,
    balanceDue: 27.00,
    status: 'pending',
    orderDate: '2025-11-16',
    pickupDate: '2025-11-23',
    specialInstructions: 'Extra cherries'
  },
  {
    id: 'ord-007',
    orderNumber: 'ORD-2025-0252',
    customerId: 'cust-007',
    customerName: 'Maria Garcia',
    cakeId: 'cake-014',
    cakeName: 'Texas Sheet Cake',
    size: 'Full-Sheet',
    quantity: 3,
    totalAmount: 195.00,
    depositAmount: 97.50,
    balanceDue: 97.50,
    status: 'in_prep',
    orderDate: '2025-11-15',
    pickupDate: '2025-11-21',
    specialInstructions: 'Hospital event - dietary labels required'
  },
  {
    id: 'ord-008',
    orderNumber: 'ORD-2025-0251',
    customerId: 'cust-008',
    customerName: 'Robert Brown',
    cakeId: 'cake-001',
    cakeName: 'Birthday Celebration',
    size: '8-inch',
    quantity: 1,
    totalAmount: 45.00,
    depositAmount: 22.50,
    balanceDue: 22.50,
    status: 'in_decoration',
    orderDate: '2025-11-14',
    pickupDate: '2025-11-20',
    specialInstructions: 'Happy 50th Birthday!'
  },
  {
    id: 'ord-009',
    orderNumber: 'ORD-2025-0250',
    customerId: 'cust-009',
    customerName: 'Jennifer Taylor',
    cakeId: 'cake-005',
    cakeName: 'Italian Cream',
    size: '10-inch',
    quantity: 1,
    totalAmount: 68.00,
    depositAmount: 34.00,
    balanceDue: 34.00,
    status: 'ready',
    orderDate: '2025-11-12',
    pickupDate: '2025-11-19',
    specialInstructions: 'Professional presentation for law firm'
  },
  {
    id: 'ord-010',
    orderNumber: 'ORD-2025-0249',
    customerId: 'cust-010',
    customerName: 'Amanda White',
    cakeId: 'cake-005',
    cakeName: 'Italian Cream',
    size: '8-inch',
    quantity: 1,
    totalAmount: 52.00,
    depositAmount: 52.00,
    balanceDue: 0.00,
    status: 'picked_up',
    orderDate: '2025-11-08',
    pickupDate: '2025-11-17',
    specialInstructions: 'Regular customer - knows the drill!'
  },
  {
    id: 'ord-011',
    orderNumber: 'ORD-2025-0248',
    customerId: 'cust-011',
    customerName: 'Christopher Lee',
    cakeId: 'cake-009',
    cakeName: 'Red Velvet',
    size: '8-inch',
    quantity: 1,
    totalAmount: 48.00,
    depositAmount: 24.00,
    balanceDue: 24.00,
    status: 'pending',
    orderDate: '2025-11-16',
    pickupDate: '2025-11-22',
    specialInstructions: 'Classic style'
  },
  {
    id: 'ord-012',
    orderNumber: 'ORD-2025-0247',
    customerId: 'cust-012',
    customerName: 'Patricia Davis',
    cakeId: 'cake-013',
    cakeName: 'Hummingbird Cake',
    size: '12-inch',
    quantity: 5,
    totalAmount: 350.00,
    depositAmount: 175.00,
    balanceDue: 175.00,
    status: 'in_prep',
    orderDate: '2025-11-14',
    pickupDate: '2025-11-21',
    specialInstructions: 'Hotel catering - delivery required'
  },
  {
    id: 'ord-013',
    orderNumber: 'ORD-2025-0246',
    customerId: 'cust-013',
    customerName: 'Daniel Anderson',
    cakeId: 'cake-010',
    cakeName: 'Carrot Cake',
    size: '8-inch',
    quantity: 1,
    totalAmount: 46.00,
    depositAmount: 23.00,
    balanceDue: 23.00,
    status: 'in_decoration',
    orderDate: '2025-11-13',
    pickupDate: '2025-11-19',
    specialInstructions: 'No walnuts - allergy'
  },
  {
    id: 'ord-014',
    orderNumber: 'ORD-2025-0245',
    customerId: 'cust-014',
    customerName: 'Michelle Thomas',
    cakeId: 'cake-001',
    cakeName: 'Birthday Celebration',
    size: '6-inch',
    quantity: 1,
    totalAmount: 35.00,
    depositAmount: 35.00,
    balanceDue: 0.00,
    status: 'completed',
    orderDate: '2025-11-09',
    pickupDate: '2025-11-18',
    specialInstructions: 'Birthday club member'
  },
  {
    id: 'ord-015',
    orderNumber: 'ORD-2025-0244',
    customerId: 'cust-015',
    customerName: 'Kevin Jackson',
    cakeId: 'cake-002',
    cakeName: 'Chocolate Doberge',
    size: '10-inch',
    quantity: 1,
    totalAmount: 75.00,
    depositAmount: 37.50,
    balanceDue: 37.50,
    status: 'ready',
    orderDate: '2025-11-11',
    pickupDate: '2025-11-19',
    specialInstructions: 'Startup celebration'
  },
  {
    id: 'ord-016',
    orderNumber: 'ORD-2025-0243',
    customerId: 'cust-001',
    customerName: 'Sarah Johnson',
    cakeId: 'cake-007',
    cakeName: 'Strawberry Delight',
    size: '10-inch',
    quantity: 1,
    totalAmount: 62.00,
    depositAmount: 31.00,
    balanceDue: 31.00,
    status: 'pending',
    orderDate: '2025-11-17',
    pickupDate: '2025-11-24',
    specialInstructions: 'Thanksgiving dessert'
  },
  {
    id: 'ord-017',
    orderNumber: 'ORD-2025-0242',
    customerId: 'cust-004',
    customerName: 'David Kim',
    cakeId: 'cake-009',
    cakeName: 'Red Velvet',
    size: '10-inch',
    quantity: 1,
    totalAmount: 62.00,
    depositAmount: 31.00,
    balanceDue: 31.00,
    status: 'in_prep',
    orderDate: '2025-11-14',
    pickupDate: '2025-11-20',
    specialInstructions: 'Media team meeting'
  },
  {
    id: 'ord-018',
    orderNumber: 'ORD-2025-0241',
    customerId: 'cust-007',
    customerName: 'Maria Garcia',
    cakeId: 'cake-012',
    cakeName: 'Coconut Cream',
    size: '8-inch',
    quantity: 2,
    totalAmount: 98.00,
    depositAmount: 49.00,
    balanceDue: 49.00,
    status: 'in_decoration',
    orderDate: '2025-11-13',
    pickupDate: '2025-11-19',
    specialInstructions: 'Patient appreciation event'
  },
  {
    id: 'ord-019',
    orderNumber: 'ORD-2025-0240',
    customerId: 'cust-005',
    customerName: 'Lisa Martinez',
    cakeId: 'cake-011',
    cakeName: 'Pineapple Upside Down',
    size: '8-inch',
    quantity: 1,
    totalAmount: 44.00,
    depositAmount: 44.00,
    balanceDue: 0.00,
    status: 'picked_up',
    orderDate: '2025-11-07',
    pickupDate: '2025-11-16',
    specialInstructions: 'Classic favorite'
  },
  {
    id: 'ord-020',
    orderNumber: 'ORD-2025-0239',
    customerId: 'cust-012',
    customerName: 'Patricia Davis',
    cakeId: 'cake-014',
    cakeName: 'Texas Sheet Cake',
    size: 'Half-Sheet',
    quantity: 4,
    totalAmount: 260.00,
    depositAmount: 130.00,
    balanceDue: 130.00,
    status: 'completed',
    orderDate: '2025-11-10',
    pickupDate: '2025-11-18',
    specialInstructions: 'Hotel weekly order'
  }
];

// ============================================================================
// MOCK KPIs FOR EACH ROLE
// ============================================================================

export const MOCK_DASHBOARD_DATA = {
  owner: {
    timeSaved: {
      currentHours: 12,
      baselineHours: 20,
      targetHours: 15,
      savedPercentage: 40,
      trend: { value: '40% reduction', period: 'vs. paper-based', direction: 'up' as const }
    },
    lostOrdersCost: {
      currentCost: 240000, // $2,400 in cents
      baselineCost: 480000, // $4,800 in cents
      targetCost: 240000,
      reductionPercentage: 50,
      cancelledCount: 3,
      atRiskCount: 1,
      trend: { value: '50% reduction', period: 'YoY', direction: 'up' as const }
    },
    retentionGrowth: {
      currentReturning: 9,
      baselineReturning: 6,
      targetReturning: 10,
      growthPercentage: 50,
      totalCustomers: 15,
      trend: { value: '+50%', period: 'this year', direction: 'up' as const }
    },
    depositCompliance: {
      rate: 95,
      compliantCount: 19,
      totalCount: 20,
      trend: { value: '+15%', period: 'vs. last quarter', direction: 'up' as const }
    },
    businessHealth: {
      score: 88,
      breakdown: {
        timeTarget: true,
        lostOrdersTarget: true,
        retentionTarget: false,
        depositTarget: true
      },
      trend: { value: '+8 points', period: 'this month', direction: 'up' as const }
    }
  },

  manager: {
    lostOrderRisk: {
      count: 1,
      value: 5400, // $54 in cents
      trend: { value: '-2 orders', period: 'vs. last week', direction: 'up' as const }
    },
    staffUtilization: {
      avgBakerWorkload: 4,
      avgDecoratorWorkload: 3,
      totalBakers: 2,
      totalDecorators: 2,
      trend: { value: 'Balanced', period: 'this week', direction: 'neutral' as const }
    },
    slaAdherence: {
      rate: 92,
      onTimeCount: 18,
      lateCount: 2,
      trend: { value: '+5%', period: 'this month', direction: 'up' as const },
      health: 'green' as const
    },
    criticalActionItems: {
      count: 2,
      trend: { value: '-1 item', period: 'today', direction: 'up' as const }
    },
    teamPerformance: {
      rate: 88,
      completedCount: 22,
      totalCount: 25,
      trend: { value: '+3%', period: 'this week', direction: 'up' as const }
    }
  },

  sales: {
    depositCompliance: {
      rate: 95,
      count: 19,
      total: 20,
      trend: { value: '+15%', period: 'this month', direction: 'up' as const }
    },
    todaysOrders: {
      count: 3,
      trend: { value: '+1', period: 'vs. yesterday', direction: 'up' as const }
    },
    returningCustomers: {
      count: 9,
      trend: { value: '+2', period: 'this month', direction: 'up' as const }
    },
    pickupsToday: {
      count: 4,
      trend: { value: 'On schedule', period: 'today', direction: 'neutral' as const }
    },
    newLeads: {
      count: 5,
      trend: { value: '+2', period: 'this week', direction: 'up' as const }
    }
  },

  baker: {
    prepTimePerOrder: {
      minutes: 85,
      completedCount: 6,
      trend: { value: '-10 min', period: 'vs. avg', direction: 'up' as const }
    },
    onTimeHandoff: {
      percentage: 94,
      onTimeCount: 17,
      totalHandoffs: 18,
      trend: { value: '+4%', period: 'this month', direction: 'up' as const }
    },
    currentWorkload: {
      count: 5,
      trend: { value: 'Normal', period: 'capacity', direction: 'neutral' as const }
    },
    ordersInProduction: {
      count: 3,
      trend: { value: 'Active', period: 'in oven', direction: 'neutral' as const }
    },
    qualityScore: {
      score: 98,
      trend: { value: 'Excellent', period: 'no reworks', direction: 'up' as const }
    }
  },

  decorator: {
    avgCompletionTime: {
      minutes: 45,
      completedCount: 8,
      trend: { value: '-5 min', period: 'vs. target', direction: 'up' as const }
    },
    activeQueue: {
      count: 4,
      trend: { value: 'On track', period: 'for today', direction: 'neutral' as const }
    },
    readyForApproval: {
      count: 2,
      trend: { value: 'Awaiting review', period: '', direction: 'neutral' as const }
    },
    reworkRate: {
      percentage: 2,
      count: 1,
      total: 50,
      trend: { value: '-3%', period: 'this month', direction: 'up' as const }
    },
    qualityScore: {
      score: 97,
      trend: { value: 'Excellent', period: 'customer feedback', direction: 'up' as const }
    }
  },

  accountant: {
    outstandingBalance: {
      amount: 51250, // $512.50 in cents
      count: 8,
      trend: { value: '-$125', period: 'vs. last week', direction: 'up' as const }
    },
    depositCompliance: {
      rate: 95,
      compliantCount: 19,
      totalCount: 20,
      trend: { value: '+15%', period: 'this month', direction: 'up' as const }
    },
    monthlyRevenue: {
      amount: 285000, // $2,850 in cents
      target: 300000,
      percentage: 95,
      trend: { value: '+12%', period: 'vs. last month', direction: 'up' as const }
    },
    overduePayments: {
      count: 1,
      amount: 7500, // $75 in cents
      trend: { value: '-2 accounts', period: 'this week', direction: 'up' as const }
    },
    profitMargin: {
      percentage: 42,
      trend: { value: '+2%', period: 'this quarter', direction: 'up' as const }
    }
  }
};

// ============================================================================
// ACTIVITY FEED EVENTS
// ============================================================================

export const MOCK_ACTIVITY_EVENTS = [
  {
    id: 'act-001',
    type: 'order_created',
    message: 'New order #ORD-2025-0258 created by Sarah Johnson',
    timestamp: '2025-11-17T14:30:00Z',
    user: 'Sales Staff'
  },
  {
    id: 'act-002',
    type: 'order_status',
    message: 'Order #ORD-2025-0257 moved to In Production',
    timestamp: '2025-11-17T13:15:00Z',
    user: 'Baker Team'
  },
  {
    id: 'act-003',
    type: 'payment',
    message: 'Deposit received: $27.50 for order #ORD-2025-0253',
    timestamp: '2025-11-17T12:00:00Z',
    user: 'Sales Staff'
  },
  {
    id: 'act-004',
    type: 'order_status',
    message: 'Order #ORD-2025-0256 ready for approval',
    timestamp: '2025-11-17T11:45:00Z',
    user: 'Decorator Team'
  },
  {
    id: 'act-005',
    type: 'customer',
    message: 'New preferred customer: Michelle Thomas',
    timestamp: '2025-11-17T10:30:00Z',
    user: 'Manager'
  },
  {
    id: 'act-006',
    type: 'order_completed',
    message: 'Order #ORD-2025-0254 picked up by Lisa Martinez',
    timestamp: '2025-11-17T09:15:00Z',
    user: 'Sales Staff'
  },
  {
    id: 'act-007',
    type: 'order_created',
    message: 'Corporate order #ORD-2025-0247 created (5 cakes)',
    timestamp: '2025-11-16T16:00:00Z',
    user: 'Sales Staff'
  },
  {
    id: 'act-008',
    type: 'order_status',
    message: 'Order #ORD-2025-0251 moved to Decoration',
    timestamp: '2025-11-16T14:30:00Z',
    user: 'Baker Team'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getOrdersByStatus(status: string) {
  return SAMPLE_ORDERS.filter(order => order.status === status);
}

export function getCustomersByType(type: 'retail' | 'corporate') {
  return SAMPLE_CUSTOMERS.filter(customer => customer.customerType === type);
}

export function getPreferredCustomers() {
  return SAMPLE_CUSTOMERS.filter(customer => customer.isPreferred);
}

export function getPopularCakes() {
  return SIGNATURE_CAKES.filter(cake => cake.popular);
}

export function getDashboardDataForRole(role: string) {
  return MOCK_DASHBOARD_DATA[role as keyof typeof MOCK_DASHBOARD_DATA] || null;
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
