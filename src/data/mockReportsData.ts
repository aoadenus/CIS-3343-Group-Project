// Mock data for all 18 reports
// Realistic data for a bakery doing ~500 orders over 6 months with ~$48,000 revenue

// ============================================================================
// 1. Sales Summary Report
// ============================================================================
export const salesSummaryData = {
  totalRevenue: 48750,
  averageOrderValue: 87.50,
  orderCount: 557,
  revenueByPeriod: [
    { date: '2025-11-01', revenue: 1250 },
    { date: '2025-11-02', revenue: 1450 },
    { date: '2025-11-03', revenue: 980 },
    { date: '2025-11-04', revenue: 1680 },
    { date: '2025-11-05', revenue: 1520 },
    { date: '2025-11-06', revenue: 1890 },
    { date: '2025-11-07', revenue: 2100 },
    { date: '2025-11-08', revenue: 1750 },
    { date: '2025-11-09', revenue: 1620 },
    { date: '2025-11-10', revenue: 1340 },
    { date: '2025-11-11', revenue: 1480 },
    { date: '2025-11-12', revenue: 1590 },
    { date: '2025-11-13', revenue: 1720 },
    { date: '2025-11-14', revenue: 2050 },
    { date: '2025-11-15', revenue: 1890 },
    { date: '2025-11-16', revenue: 1560 },
    { date: '2025-11-17', revenue: 1420 },
    { date: '2025-11-18', revenue: 1380 },
    { date: '2025-11-19', revenue: 1650 },
    { date: '2025-11-20', revenue: 1780 },
    { date: '2025-11-21', revenue: 2200 },
    { date: '2025-11-22', revenue: 1950 },
    { date: '2025-11-23', revenue: 1680 },
    { date: '2025-11-24', revenue: 1540 },
    { date: '2025-11-25', revenue: 1720 },
    { date: '2025-11-26', revenue: 1850 },
    { date: '2025-11-27', revenue: 2150 },
    { date: '2025-11-28', revenue: 2350 },
    { date: '2025-11-29', revenue: 1920 },
    { date: '2025-11-30', revenue: 1760 }
  ],
  topProducts: [
    { id: 1, name: 'Birthday Celebration', orderCount: 89, revenue: 5340 },
    { id: 2, name: 'Chocolate Doberge', orderCount: 76, revenue: 6840 },
    { id: 3, name: 'Lemon Doberge', orderCount: 65, revenue: 5200 },
    { id: 4, name: 'Black Forest Doberge', orderCount: 58, revenue: 5220 },
    { id: 5, name: 'Caramel Doberge', orderCount: 52, revenue: 4680 },
    { id: 6, name: 'Red Velvet Doberge', orderCount: 48, revenue: 4320 },
    { id: 7, name: 'Strawberry Delight', orderCount: 42, revenue: 3360 },
    { id: 8, name: 'Coconut Paradise', orderCount: 38, revenue: 3040 },
    { id: 9, name: 'Pumpkin Spice', orderCount: 35, revenue: 3150 },
    { id: 10, name: 'Pecan Praline', orderCount: 32, revenue: 2880 }
  ],
  previousPeriodRevenue: 42300,
  growthRate: 15.2
};

// ============================================================================
// 2. Customer Retention Report
// ============================================================================
export const customerRetentionData = {
  totalCustomers: 342,
  returningCustomers: 187,
  newCustomers: 155,
  retentionRate: 54.7,
  goalTarget: 805,
  goalProgress: 23.2,
  atRiskCustomers: [
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', lastOrder: '2025-05-15', daysSinceOrder: 187 },
    { id: 2, name: 'Emily Brown', email: 'emily.brown@email.com', lastOrder: '2025-05-22', daysSinceOrder: 180 },
    { id: 3, name: 'Michael Davis', email: 'michael.d@email.com', lastOrder: '2025-06-01', daysSinceOrder: 170 },
    { id: 4, name: 'Jessica Wilson', email: 'jwilson@email.com', lastOrder: '2025-06-08', daysSinceOrder: 163 },
    { id: 5, name: 'David Martinez', email: 'david.m@email.com', lastOrder: '2025-06-15', daysSinceOrder: 156 },
    { id: 6, name: 'Amanda Taylor', email: 'a.taylor@email.com', lastOrder: '2025-06-22', daysSinceOrder: 149 },
    { id: 7, name: 'Christopher Lee', email: 'chris.lee@email.com', lastOrder: '2025-06-28', daysSinceOrder: 143 },
    { id: 8, name: 'Jennifer Anderson', email: 'jen.a@email.com', lastOrder: '2025-07-05', daysSinceOrder: 136 },
    { id: 9, name: 'Matthew Thomas', email: 'matt.t@email.com', lastOrder: '2025-07-12', daysSinceOrder: 129 },
    { id: 10, name: 'Ashley Jackson', email: 'ashley.j@email.com', lastOrder: '2025-07-18', daysSinceOrder: 123 }
  ],
  monthlyRetention: [
    { month: 'Jun', rate: 48 },
    { month: 'Jul', rate: 51 },
    { month: 'Aug', rate: 49 },
    { month: 'Sep', rate: 53 },
    { month: 'Oct', rate: 52 },
    { month: 'Nov', rate: 55 }
  ]
};

// ============================================================================
// 3. Order Status Dashboard
// ============================================================================
export const orderStatusData = {
  statusBreakdown: [
    { status: 'pending', count: 23, color: '#FFB020' },
    { status: 'confirmed', count: 18, color: '#14B8A6' },
    { status: 'in_baking', count: 12, color: '#F97316' },
    { status: 'decorating', count: 8, color: '#8B5CF6' },
    { status: 'ready', count: 15, color: '#22C55E' },
    { status: 'completed', count: 456, color: '#6B7280' },
    { status: 'cancelled', count: 25, color: '#EF4444' }
  ],
  ordersPerDay: [
    { date: '2025-11-01', count: 15 },
    { date: '2025-11-02', count: 18 },
    { date: '2025-11-03', count: 12 },
    { date: '2025-11-04', count: 20 },
    { date: '2025-11-05', count: 19 },
    { date: '2025-11-06', count: 22 },
    { date: '2025-11-07', count: 25 },
    { date: '2025-11-08', count: 21 },
    { date: '2025-11-09', count: 19 },
    { date: '2025-11-10', count: 16 },
    { date: '2025-11-11', count: 18 },
    { date: '2025-11-12', count: 19 },
    { date: '2025-11-13', count: 21 },
    { date: '2025-11-14', count: 24 },
    { date: '2025-11-15', count: 23 },
    { date: '2025-11-16', count: 19 },
    { date: '2025-11-17', count: 17 },
    { date: '2025-11-18', count: 16 },
    { date: '2025-11-19', count: 20 },
    { date: '2025-11-20', count: 21 },
    { date: '2025-11-21', count: 25 },
    { date: '2025-11-22', count: 23 },
    { date: '2025-11-23', count: 20 },
    { date: '2025-11-24', count: 18 },
    { date: '2025-11-25', count: 20 },
    { date: '2025-11-26', count: 22 },
    { date: '2025-11-27', count: 25 },
    { date: '2025-11-28', count: 24 },
    { date: '2025-11-29', count: 22 },
    { date: '2025-11-30', count: 20 }
  ],
  averageCompletionTime: 18.5,
  rushOrderPercentage: 12.3
};

// ============================================================================
// 4. Product Performance Report
// ============================================================================
export const productPerformanceData = {
  productsByOrders: [
    { name: 'Birthday Celebration', orders: 89 },
    { name: 'Chocolate Doberge', orders: 76 },
    { name: 'Lemon Doberge', orders: 65 },
    { name: 'Black Forest Doberge', orders: 58 },
    { name: 'Caramel Doberge', orders: 52 },
    { name: 'Red Velvet Doberge', orders: 48 },
    { name: 'Strawberry Delight', orders: 42 },
    { name: 'Coconut Paradise', orders: 38 },
    { name: 'Pumpkin Spice', orders: 35 },
    { name: 'Pecan Praline', orders: 32 },
    { name: 'Lemon & Cream Cheese', orders: 28 },
    { name: 'Mocha Doberge', orders: 24 },
    { name: 'Vanilla Bean Classic', orders: 18 },
    { name: 'Half & Half Doberge', orders: 12 }
  ],
  revenueByCategory: [
    { name: 'Classic', value: 12500, color: '#C44569' },
    { name: 'Premium', value: 18750, color: '#5A3825' },
    { name: 'Signature', value: 9800, color: '#2B2B2B' },
    { name: 'Fruity', value: 7700, color: '#F97316' }
  ],
  bestSeller: { name: 'Birthday Celebration', orders: 89, revenue: 5340 },
  worstSeller: { name: 'Half & Half Doberge', orders: 12, revenue: 576 },
  seasonalTrends: [
    { month: 'Jun', classicOrders: 45, premiumOrders: 38, signatureOrders: 22, fruityOrders: 18 },
    { month: 'Jul', classicOrders: 42, premiumOrders: 35, signatureOrders: 20, fruityOrders: 25 },
    { month: 'Aug', classicOrders: 38, premiumOrders: 32, signatureOrders: 18, fruityOrders: 28 },
    { month: 'Sep', classicOrders: 48, premiumOrders: 42, signatureOrders: 25, fruityOrders: 15 },
    { month: 'Oct', classicOrders: 52, premiumOrders: 45, signatureOrders: 28, fruityOrders: 12 },
    { month: 'Nov', classicOrders: 55, premiumOrders: 48, signatureOrders: 30, fruityOrders: 10 }
  ]
};

// ============================================================================
// 5. Staff Performance Report
// ============================================================================
export const staffPerformanceData = {
  staffMembers: [
    {
      id: 1,
      name: 'Maria Garcia',
      role: 'baker',
      ordersCompleted: 145,
      avgCompletionTime: 4.2,
      qualityScore: 98.5
    },
    {
      id: 2,
      name: 'James Wilson',
      role: 'decorator',
      ordersCompleted: 132,
      avgCompletionTime: 3.8,
      qualityScore: 97.2
    },
    {
      id: 3,
      name: 'Sarah Chen',
      role: 'baker',
      ordersCompleted: 138,
      avgCompletionTime: 4.5,
      qualityScore: 96.8
    },
    {
      id: 4,
      name: 'Mike Thompson',
      role: 'decorator',
      ordersCompleted: 125,
      avgCompletionTime: 4.0,
      qualityScore: 95.5
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      role: 'baker',
      ordersCompleted: 142,
      avgCompletionTime: 4.3,
      qualityScore: 97.8
    },
    {
      id: 6,
      name: 'David Kim',
      role: 'decorator',
      ordersCompleted: 118,
      avgCompletionTime: 3.6,
      qualityScore: 98.2
    },
    {
      id: 7,
      name: 'Emma Johnson',
      role: 'manager',
      ordersCompleted: 85,
      avgCompletionTime: 2.5,
      qualityScore: 99.1
    },
    {
      id: 8,
      name: 'Robert Davis',
      role: 'baker',
      ordersCompleted: 128,
      avgCompletionTime: 4.8,
      qualityScore: 94.2
    }
  ],
  workloadBalance: [
    { name: 'Maria', workload: 32 },
    { name: 'James', workload: 28 },
    { name: 'Sarah', workload: 35 },
    { name: 'Mike', workload: 30 },
    { name: 'Lisa', workload: 33 },
    { name: 'David', workload: 26 },
    { name: 'Emma', workload: 18 },
    { name: 'Robert', workload: 29 }
  ],
  weeklyPerformance: [
    { week: 'Week 1', ordersCompleted: 125, avgQuality: 96.5 },
    { week: 'Week 2', ordersCompleted: 138, avgQuality: 97.2 },
    { week: 'Week 3', ordersCompleted: 142, avgQuality: 96.8 },
    { week: 'Week 4', ordersCompleted: 152, avgQuality: 97.5 }
  ]
};

// ============================================================================
// 6. Payment Collection Report
// ============================================================================
export const paymentCollectionData = {
  depositComplianceRate: 98.5,
  outstandingBalances: [
    { orderId: 'ORD-2025-0543', customer: 'Emily Johnson', amount: 47.50, dueDate: '2025-11-20' },
    { orderId: 'ORD-2025-0548', customer: 'Robert Williams', amount: 85.00, dueDate: '2025-11-21' },
    { orderId: 'ORD-2025-0551', customer: 'Jennifer Davis', amount: 125.50, dueDate: '2025-11-22' },
    { orderId: 'ORD-2025-0554', customer: 'Michael Brown', amount: 67.25, dueDate: '2025-11-22' },
    { orderId: 'ORD-2025-0556', customer: 'Sarah Miller', amount: 195.00, dueDate: '2025-11-23' },
    { orderId: 'ORD-2025-0559', customer: 'David Anderson', amount: 312.75, dueDate: '2025-11-24' },
    { orderId: 'ORD-2025-0562', customer: 'Lisa Taylor', amount: 156.50, dueDate: '2025-11-25' },
    { orderId: 'ORD-2025-0565', customer: 'James Martinez', amount: 258.00, dueDate: '2025-11-26' }
  ],
  paymentMethodBreakdown: [
    { method: 'Credit Card', count: 423, percentage: 75.9 },
    { method: 'Cash', count: 89, percentage: 16.0 },
    { method: 'Debit', count: 45, percentage: 8.1 }
  ],
  avgDaysToFullPayment: 3.2,
  totalOutstanding: 1247.50,
  weeklyCollections: [
    { week: 'Week 1', collected: 8450, outstanding: 1850 },
    { week: 'Week 2', collected: 9120, outstanding: 1420 },
    { week: 'Week 3', collected: 8780, outstanding: 1650 },
    { week: 'Week 4', collected: 9250, outstanding: 1248 }
  ]
};

// ============================================================================
// 7. Time Savings Analysis
// ============================================================================
export const timeSavingsData = {
  currentProcessingTime: 12.5,
  baselineTime: 20,
  targetTime: 15,
  goalProgress: 150,
  weeklyData: [
    { week: 'Week 1', hours: 18.5 },
    { week: 'Week 2', hours: 16.2 },
    { week: 'Week 3', hours: 14.8 },
    { week: 'Week 4', hours: 12.5 }
  ],
  timeByOrderType: [
    { type: 'Standard', avgMinutes: 15 },
    { type: 'Custom', avgMinutes: 35 },
    { type: 'Rush', avgMinutes: 45 }
  ],
  monthlyTrends: [
    { month: 'Jun', avgHours: 19.5 },
    { month: 'Jul', avgHours: 18.2 },
    { month: 'Aug', avgHours: 17.0 },
    { month: 'Sep', avgHours: 15.5 },
    { month: 'Oct', avgHours: 14.2 },
    { month: 'Nov', avgHours: 12.5 }
  ],
  taskBreakdown: [
    { task: 'Order Entry', beforeHours: 5.5, afterHours: 2.0 },
    { task: 'Customer Communication', beforeHours: 4.0, afterHours: 2.5 },
    { task: 'Scheduling', beforeHours: 3.5, afterHours: 1.5 },
    { task: 'Payment Processing', beforeHours: 3.0, afterHours: 2.0 },
    { task: 'Reporting', beforeHours: 4.0, afterHours: 4.5 }
  ]
};

// ============================================================================
// 8. Lost Order Cost Analysis
// ============================================================================
export const lostOrderData = {
  totalLostCost: 2340,
  yearlyTarget: 960,
  goalProgress: -143.8,
  cancellationReasons: [
    { reason: 'Customer Changed Mind', count: 12, cost: 780 },
    { reason: 'Scheduling Conflict', count: 8, cost: 640 },
    { reason: 'Price Concerns', count: 3, cost: 420 },
    { reason: 'Quality Issues', count: 2, cost: 500 }
  ],
  monthlyTrends: [
    { month: 'Jun', lostCost: 320 },
    { month: 'Jul', lostCost: 280 },
    { month: 'Aug', lostCost: 450 },
    { month: 'Sep', lostCost: 380 },
    { month: 'Oct', lostCost: 520 },
    { month: 'Nov', lostCost: 390 }
  ],
  recoveryAttempts: [
    { month: 'Jun', attempted: 8, recovered: 3, recoveryRate: 37.5 },
    { month: 'Jul', attempted: 6, recovered: 2, recoveryRate: 33.3 },
    { month: 'Aug', attempted: 10, recovered: 4, recoveryRate: 40.0 },
    { month: 'Sep', attempted: 9, recovered: 3, recoveryRate: 33.3 },
    { month: 'Oct', attempted: 12, recovered: 5, recoveryRate: 41.7 },
    { month: 'Nov', attempted: 8, recovered: 3, recoveryRate: 37.5 }
  ],
  avgOrderValueLost: 93.60
};

// ============================================================================
// 9. Custom vs Standard Orders
// ============================================================================
export const customVsStandardData = {
  standardOrders: 387,
  customOrders: 170,
  ratio: 2.28,
  avgCustomizationComplexity: 3.2,
  priceComparison: {
    avgStandardPrice: 65,
    avgCustomPrice: 125
  },
  profitMarginComparison: {
    standardMargin: 42,
    customMargin: 58
  },
  monthlyBreakdown: [
    { month: 'Jun', standard: 58, custom: 25 },
    { month: 'Jul', standard: 62, custom: 28 },
    { month: 'Aug', standard: 55, custom: 22 },
    { month: 'Sep', standard: 68, custom: 30 },
    { month: 'Oct', standard: 72, custom: 32 },
    { month: 'Nov', standard: 72, custom: 33 }
  ],
  customizationTypes: [
    { type: 'Size Modification', count: 85, percentage: 50 },
    { type: 'Flavor Combination', count: 52, percentage: 30.6 },
    { type: 'Design Request', count: 45, percentage: 26.5 },
    { type: 'Dietary Restrictions', count: 28, percentage: 16.5 },
    { type: 'Special Ingredients', count: 18, percentage: 10.6 }
  ]
};

// ============================================================================
// 10. Pickup Time Analysis
// ============================================================================
export const pickupTimeData = {
  peakHours: [
    { hour: '09:00', pickups: 8 },
    { hour: '10:00', pickups: 12 },
    { hour: '11:00', pickups: 18 },
    { hour: '12:00', pickups: 25 },
    { hour: '13:00', pickups: 22 },
    { hour: '14:00', pickups: 28 },
    { hour: '15:00', pickups: 35 },
    { hour: '16:00', pickups: 32 },
    { hour: '17:00', pickups: 45 },
    { hour: '18:00', pickups: 38 },
    { hour: '19:00', pickups: 15 }
  ],
  latePickupPercentage: 4.2,
  avgWaitTime: 8.5,
  capacityUtilization: [
    { day: 'Mon', utilization: 65 },
    { day: 'Tue', utilization: 58 },
    { day: 'Wed', utilization: 72 },
    { day: 'Thu', utilization: 68 },
    { day: 'Fri', utilization: 85 },
    { day: 'Sat', utilization: 95 },
    { day: 'Sun', utilization: 45 }
  ],
  noShowRate: 1.8,
  earlyPickupPercentage: 12.5,
  avgPickupsPerDay: 18,
  peakDay: 'Saturday',
  peakDayPickups: 42
};

// ============================================================================
// 11. Preferred Customer Analysis
// ============================================================================
export const preferredCustomerData = {
  totalPreferred: 87,
  totalRegular: 255,
  revenueFromPreferred: 28450,
  revenueFromRegular: 20300,
  discountImpact: 2845,
  conversionRate: 12.5,
  preferredCustomers: [
    { id: 1, name: 'Sarah Johnson', totalSpent: 2450, orderCount: 28, memberSince: '2024-03-15' },
    { id: 2, name: 'Corporate Events Inc', totalSpent: 8450, orderCount: 42, memberSince: '2024-01-15' },
    { id: 3, name: 'Lisa Thompson', totalSpent: 1890, orderCount: 22, memberSince: '2024-04-20' },
    { id: 4, name: 'Downtown Café', totalSpent: 3250, orderCount: 35, memberSince: '2024-02-10' },
    { id: 5, name: 'Maria Rodriguez', totalSpent: 1650, orderCount: 19, memberSince: '2024-05-05' },
    { id: 6, name: 'Party Planners LLC', totalSpent: 4120, orderCount: 38, memberSince: '2024-01-28' },
    { id: 7, name: 'Jennifer Adams', totalSpent: 1420, orderCount: 16, memberSince: '2024-06-12' },
    { id: 8, name: 'Hotel Grandview', totalSpent: 5680, orderCount: 45, memberSince: '2023-11-20' },
    { id: 9, name: 'Amanda White', totalSpent: 1180, orderCount: 14, memberSince: '2024-07-08' },
    { id: 10, name: 'City Events Co', totalSpent: 2890, orderCount: 32, memberSince: '2024-02-25' }
  ],
  monthlyConversions: [
    { month: 'Jun', conversions: 8 },
    { month: 'Jul', conversions: 12 },
    { month: 'Aug', conversions: 10 },
    { month: 'Sep', conversions: 15 },
    { month: 'Oct', conversions: 18 },
    { month: 'Nov', conversions: 24 }
  ],
  avgPreferredOrderValue: 327.01,
  avgRegularOrderValue: 79.61
};

// ============================================================================
// 12. Corporate vs Retail Split
// ============================================================================
export const corporateRetailData = {
  corporateRevenue: 18500,
  retailRevenue: 30250,
  corporateOrders: 89,
  retailOrders: 468,
  avgCorporateOrder: 207.87,
  avgRetailOrder: 64.64,
  growthTrends: [
    { month: 'Jun', corporate: 2800, retail: 4500 },
    { month: 'Jul', corporate: 2650, retail: 4800 },
    { month: 'Aug', corporate: 2950, retail: 4200 },
    { month: 'Sep', corporate: 3200, retail: 5100 },
    { month: 'Oct', corporate: 3450, retail: 5350 },
    { month: 'Nov', corporate: 3450, retail: 6300 }
  ],
  corporateClients: [
    { name: 'Corporate Events Inc', orders: 42, revenue: 8450 },
    { name: 'Hotel Grandview', orders: 45, revenue: 5680 },
    { name: 'Downtown Café', orders: 35, revenue: 3250 },
    { name: 'Party Planners LLC', orders: 38, revenue: 4120 },
    { name: 'City Events Co', orders: 32, revenue: 2890 }
  ],
  orderSizeDistribution: {
    corporate: [
      { size: 'Small (1-2 cakes)', count: 15, percentage: 16.9 },
      { size: 'Medium (3-5 cakes)', count: 38, percentage: 42.7 },
      { size: 'Large (6+ cakes)', count: 36, percentage: 40.4 }
    ],
    retail: [
      { size: 'Small (1 cake)', count: 385, percentage: 82.3 },
      { size: 'Medium (2-3 cakes)', count: 68, percentage: 14.5 },
      { size: 'Large (4+ cakes)', count: 15, percentage: 3.2 }
    ]
  }
};

// ============================================================================
// 13. Seasonal Trends Report
// ============================================================================
export const seasonalTrendsData = {
  monthlyOrders: [
    { month: 'Dec 2024', orders: 89 },
    { month: 'Jan 2025', orders: 52 },
    { month: 'Feb 2025', orders: 78 },
    { month: 'Mar 2025', orders: 65 },
    { month: 'Apr 2025', orders: 82 },
    { month: 'May 2025', orders: 95 },
    { month: 'Jun 2025', orders: 88 },
    { month: 'Jul 2025', orders: 72 },
    { month: 'Aug 2025', orders: 68 },
    { month: 'Sep 2025', orders: 85 },
    { month: 'Oct 2025', orders: 92 },
    { month: 'Nov 2025', orders: 98 }
  ],
  popularBySeason: {
    spring: ['Lemon & Cream Cheese', 'Strawberry Delight', 'Coconut Paradise', 'Vanilla Bean Classic'],
    summer: ['Coconut Paradise', 'Lemon Doberge', 'Strawberry Delight', 'Mocha Doberge'],
    fall: ['Pumpkin Spice', 'Pecan Praline', 'Caramel Doberge', 'Black Forest Doberge'],
    winter: ['Black Forest Doberge', 'Chocolate Doberge', 'Red Velvet Doberge', 'Pecan Praline']
  },
  nextQuarterForecast: 285,
  holidayPeaks: [
    { holiday: 'Valentine\'s Day', orderIncrease: 45, topProduct: 'Red Velvet Doberge' },
    { holiday: 'Easter', orderIncrease: 38, topProduct: 'Lemon Doberge' },
    { holiday: 'Mother\'s Day', orderIncrease: 52, topProduct: 'Strawberry Delight' },
    { holiday: 'Thanksgiving', orderIncrease: 65, topProduct: 'Pumpkin Spice' },
    { holiday: 'Christmas', orderIncrease: 78, topProduct: 'Chocolate Doberge' }
  ],
  weekdayDistribution: [
    { day: 'Mon', percentage: 8 },
    { day: 'Tue', percentage: 10 },
    { day: 'Wed', percentage: 12 },
    { day: 'Thu', percentage: 14 },
    { day: 'Fri', percentage: 18 },
    { day: 'Sat', percentage: 28 },
    { day: 'Sun', percentage: 10 }
  ]
};

// ============================================================================
// 14. Inventory & Production Report
// ============================================================================
export const inventoryProductionData = {
  topIngredients: [
    { name: 'Flour', usage: 450, unit: 'lbs', cost: 225, reorderPoint: 100 },
    { name: 'Sugar', usage: 320, unit: 'lbs', cost: 192, reorderPoint: 80 },
    { name: 'Butter', usage: 180, unit: 'lbs', cost: 720, reorderPoint: 40 },
    { name: 'Eggs', usage: 2400, unit: 'count', cost: 480, reorderPoint: 500 },
    { name: 'Vanilla Extract', usage: 12, unit: 'liters', cost: 360, reorderPoint: 3 },
    { name: 'Cocoa Powder', usage: 85, unit: 'lbs', cost: 340, reorderPoint: 20 },
    { name: 'Heavy Cream', usage: 95, unit: 'gallons', cost: 475, reorderPoint: 25 },
    { name: 'Cream Cheese', usage: 120, unit: 'lbs', cost: 480, reorderPoint: 30 }
  ],
  capacityUtilization: 78.5,
  bottlenecks: [
    { area: 'Decorating Station', utilizationRate: 95 },
    { area: 'Oven Capacity', utilizationRate: 82 },
    { area: 'Cooling Racks', utilizationRate: 75 },
    { area: 'Storage Space', utilizationRate: 68 }
  ],
  assignmentEfficiency: {
    bakers: 87.5,
    decorators: 91.2,
    overall: 89.1
  },
  weeklyProduction: [
    { week: 'Week 1', cakesProduced: 125, targetMet: true },
    { week: 'Week 2', cakesProduced: 138, targetMet: true },
    { week: 'Week 3', cakesProduced: 142, targetMet: true },
    { week: 'Week 4', cakesProduced: 152, targetMet: true }
  ],
  wastePercentage: 3.2
};

// ============================================================================
// 15. Customer Lifetime Value
// ============================================================================
export const customerLifetimeData = {
  topCustomers: [
    { id: 1, name: 'Corporate Events Inc', totalSpent: 8450, orderCount: 42, firstOrder: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', totalSpent: 2450, orderCount: 28, firstOrder: '2024-03-15' },
    { id: 3, name: 'Hotel Grandview', totalSpent: 5680, orderCount: 45, firstOrder: '2023-11-20' },
    { id: 4, name: 'Party Planners LLC', totalSpent: 4120, orderCount: 38, firstOrder: '2024-01-28' },
    { id: 5, name: 'Downtown Café', totalSpent: 3250, orderCount: 35, firstOrder: '2024-02-10' },
    { id: 6, name: 'City Events Co', totalSpent: 2890, orderCount: 32, firstOrder: '2024-02-25' },
    { id: 7, name: 'Lisa Thompson', totalSpent: 1890, orderCount: 22, firstOrder: '2024-04-20' },
    { id: 8, name: 'Maria Rodriguez', totalSpent: 1650, orderCount: 19, firstOrder: '2024-05-05' },
    { id: 9, name: 'Jennifer Adams', totalSpent: 1420, orderCount: 16, firstOrder: '2024-06-12' },
    { id: 10, name: 'Amanda White', totalSpent: 1180, orderCount: 14, firstOrder: '2024-07-08' }
  ],
  avgLifetimeValue: 342,
  orderFrequencyDistribution: [
    { frequency: '1 order', count: 155 },
    { frequency: '2-5 orders', count: 98 },
    { frequency: '6-10 orders', count: 52 },
    { frequency: '11+ orders', count: 37 }
  ],
  churnRisk: [
    { segment: 'High Risk', count: 23, color: '#EF4444' },
    { segment: 'Medium Risk', count: 45, color: '#FFB020' },
    { segment: 'Low Risk', count: 274, color: '#22C55E' }
  ],
  cohortAnalysis: [
    { cohort: 'Q4 2023', month1: 100, month3: 65, month6: 42, month12: 28 },
    { cohort: 'Q1 2024', month1: 100, month3: 68, month6: 45, month12: null },
    { cohort: 'Q2 2024', month1: 100, month3: 72, month6: 48, month12: null },
    { cohort: 'Q3 2024', month1: 100, month3: 70, month6: null, month12: null }
  ],
  predictedLTV: {
    newCustomer: 185,
    returningCustomer: 420,
    preferredCustomer: 680
  }
};

// ============================================================================
// 16. Order Modification Report
// ============================================================================
export const orderModificationData = {
  managerApprovals: 34,
  rushOrderFrequency: 68,
  overrideUsage: [
    { type: 'Rush Order Override', count: 45, percentage: 56.3 },
    { type: 'Price Override', count: 12, percentage: 15.0 },
    { type: 'Deposit Waiver', count: 8, percentage: 10.0 },
    { type: 'Date Override', count: 15, percentage: 18.7 }
  ],
  exceptionTrends: [
    { week: 'Week 1', exceptions: 18 },
    { week: 'Week 2', exceptions: 22 },
    { week: 'Week 3', exceptions: 15 },
    { week: 'Week 4', exceptions: 25 }
  ],
  approvalsByManager: [
    { manager: 'Emma Johnson', approvals: 18, avgResponseTime: 0.5 },
    { manager: 'Robert Chen', approvals: 12, avgResponseTime: 0.8 },
    { manager: 'Owner', approvals: 4, avgResponseTime: 1.2 }
  ],
  rushOrderSuccess: {
    completed: 62,
    failed: 6,
    successRate: 91.2
  },
  modificationReasons: [
    { reason: 'Customer Request', count: 42, percentage: 52.5 },
    { reason: 'Staff Availability', count: 18, percentage: 22.5 },
    { reason: 'Inventory Issues', count: 12, percentage: 15.0 },
    { reason: 'Emergency/Special', count: 8, percentage: 10.0 }
  ]
};

// ============================================================================
// 17. Revenue Forecasting
// ============================================================================
export const revenueForecastData = {
  next30DaysForecast: 52400,
  confidenceInterval: { low: 48200, high: 56600 },
  historicalPattern: [
    { date: '2025-11-01', actual: 1250, forecast: 1180 },
    { date: '2025-11-02', actual: 1450, forecast: 1320 },
    { date: '2025-11-03', actual: 980, forecast: 1050 },
    { date: '2025-11-04', actual: 1680, forecast: 1580 },
    { date: '2025-11-05', actual: 1520, forecast: 1450 },
    { date: '2025-11-06', actual: 1890, forecast: 1750 },
    { date: '2025-11-07', actual: 2100, forecast: 1950 },
    { date: '2025-11-08', actual: 1750, forecast: 1680 },
    { date: '2025-11-09', actual: 1620, forecast: 1580 },
    { date: '2025-11-10', actual: 1340, forecast: 1420 },
    { date: '2025-11-11', actual: 1480, forecast: 1520 },
    { date: '2025-11-12', actual: 1590, forecast: 1550 },
    { date: '2025-11-13', actual: 1720, forecast: 1680 },
    { date: '2025-11-14', actual: 2050, forecast: 1920 },
    { date: '2025-11-15', actual: 1890, forecast: 1850 },
    { date: '2025-11-16', actual: 1560, forecast: 1620 },
    { date: '2025-11-17', actual: 1420, forecast: 1480 },
    { date: '2025-11-18', actual: 1380, forecast: 1450 },
    { date: '2025-11-19', actual: null, forecast: 1620 },
    { date: '2025-11-20', actual: null, forecast: 1750 },
    { date: '2025-11-21', actual: null, forecast: 2180 },
    { date: '2025-11-22', actual: null, forecast: 1920 },
    { date: '2025-11-23', actual: null, forecast: 1650 },
    { date: '2025-11-24', actual: null, forecast: 1520 },
    { date: '2025-11-25', actual: null, forecast: 1680 },
    { date: '2025-11-26', actual: null, forecast: 1820 },
    { date: '2025-11-27', actual: null, forecast: 2850 },
    { date: '2025-11-28', actual: null, forecast: 2450 },
    { date: '2025-11-29', actual: null, forecast: 1980 },
    { date: '2025-11-30', actual: null, forecast: 1750 }
  ],
  growthRateProjection: 8.5,
  monthlyForecasts: [
    { month: 'Dec 2025', forecast: 58200, confidence: 0.85 },
    { month: 'Jan 2026', forecast: 42800, confidence: 0.78 },
    { month: 'Feb 2026', forecast: 51500, confidence: 0.72 }
  ],
  seasonalFactors: {
    thanksgiving: 1.35,
    christmas: 1.45,
    newYear: 0.85,
    valentines: 1.25,
    easter: 1.20,
    mothersDay: 1.30
  },
  forecastAccuracy: 94.2
};

// ============================================================================
// 18. Quality Metrics Report
// ============================================================================
export const qualityMetricsData = {
  orderAccuracyRate: 97.8,
  customerSatisfactionIndicators: {
    fiveStars: 89,
    fourStars: 8,
    threeOrLess: 3
  },
  reworkFrequency: 2.2,
  firstTimeRightRate: 97.8,
  qualityByProduct: [
    { product: 'Birthday Celebration', accuracyRate: 98.5, reworkRate: 1.5 },
    { product: 'Chocolate Doberge', accuracyRate: 99.2, reworkRate: 0.8 },
    { product: 'Lemon Doberge', accuracyRate: 97.5, reworkRate: 2.5 },
    { product: 'Black Forest Doberge', accuracyRate: 96.8, reworkRate: 3.2 },
    { product: 'Caramel Doberge', accuracyRate: 98.0, reworkRate: 2.0 }
  ],
  monthlyTrends: [
    { month: 'Jun', accuracyRate: 96.5, satisfactionScore: 4.6 },
    { month: 'Jul', accuracyRate: 97.0, satisfactionScore: 4.7 },
    { month: 'Aug', accuracyRate: 96.8, satisfactionScore: 4.6 },
    { month: 'Sep', accuracyRate: 97.5, satisfactionScore: 4.8 },
    { month: 'Oct', accuracyRate: 98.0, satisfactionScore: 4.8 },
    { month: 'Nov', accuracyRate: 97.8, satisfactionScore: 4.9 }
  ],
  commonIssues: [
    { issue: 'Decoration Mismatch', count: 8, percentage: 32 },
    { issue: 'Size Error', count: 5, percentage: 20 },
    { issue: 'Flavor Mix-up', count: 4, percentage: 16 },
    { issue: 'Late Delivery', count: 4, percentage: 16 },
    { issue: 'Packaging Issue', count: 4, percentage: 16 }
  ],
  staffQualityScores: [
    { name: 'Maria Garcia', score: 98.5 },
    { name: 'David Kim', score: 98.2 },
    { name: 'Lisa Rodriguez', score: 97.8 },
    { name: 'James Wilson', score: 97.2 },
    { name: 'Sarah Chen', score: 96.8 }
  ]
};

// ============================================================================
// Export all data
// ============================================================================
export default {
  salesSummaryData,
  customerRetentionData,
  orderStatusData,
  productPerformanceData,
  staffPerformanceData,
  paymentCollectionData,
  timeSavingsData,
  lostOrderData,
  customVsStandardData,
  pickupTimeData,
  preferredCustomerData,
  corporateRetailData,
  seasonalTrendsData,
  inventoryProductionData,
  customerLifetimeData,
  orderModificationData,
  revenueForecastData,
  qualityMetricsData
};
