import { db } from './db.js';
import { products, customers, orders, inquiries, contactMessages, payments, employees, orderStatusHistory } from '../shared/schema.js';
import type { NewProduct, NewCustomer, NewOrder, NewInquiry, NewContactMessage, NewPayment, NewEmployee } from '../shared/schema.js';
import { eq, desc, and, or, like, ilike, sql, isNull } from 'drizzle-orm';

// ============ PRODUCTS ============

export async function getAllProducts() {
  return await db.select().from(products)
    .where(isNull(products.deletedAt))
    .orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const [product] = await db.select().from(products)
    .where(and(eq(products.id, id), isNull(products.deletedAt)));
  return product || null;
}

export async function createProduct(data: NewProduct) {
  const [product] = await db.insert(products).values(data).returning();
  return product;
}

export async function updateProduct(id: number, data: Partial<NewProduct>) {
  const [updated] = await db.update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return updated;
}

export async function deleteProduct(id: number, deletedBy: string) {
  // Soft delete
  const [deleted] = await db.update(products)
    .set({ 
      deletedAt: new Date(),
      deletedBy,
      updatedAt: new Date()
    })
    .where(eq(products.id, id))
    .returning();
  return deleted;
}

export async function searchProducts(query: string) {
  const searchPattern = `%${query}%`;
  return await db.select().from(products)
    .where(
      and(
        isNull(products.deletedAt),
        or(
          ilike(products.name, searchPattern),
          ilike(products.category, searchPattern),
          ilike(products.description, searchPattern)
        )
      )
    )
    .orderBy(desc(products.popularity))
    .limit(20);
}

// ============ CUSTOMERS ============

export async function createCustomer(data: NewCustomer) {
  const [customer] = await db.insert(customers).values(data).returning();
  return customer;
}

export async function getCustomerByEmail(email: string) {
  const [customer] = await db.select().from(customers).where(eq(customers.email, email));
  return customer || null;
}

export async function getCustomerById(id: number) {
  const [customer] = await db.select().from(customers).where(eq(customers.id, id));
  return customer || null;
}

export async function getAllCustomers() {
  return await db.select().from(customers).orderBy(desc(customers.createdAt));
}

export async function updateCustomer(id: number, data: Partial<NewCustomer>) {
  const [updated] = await db.update(customers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(customers.id, id))
    .returning();
  return updated;
}

// Find or create customer
export async function findOrCreateCustomer(data: { name: string; email: string; phone?: string }) {
  let customer = await getCustomerByEmail(data.email);
  
  if (!customer) {
    customer = await createCustomer({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      totalOrders: 0,
      isVip: false,
    });
  }
  
  return customer;
}

// Search customers by name, email, or ID
export async function searchCustomers(query: string) {
  // If query is a number, search by ID
  const numericQuery = parseInt(query);
  if (!isNaN(numericQuery)) {
    const customer = await getCustomerById(numericQuery);
    return customer ? [customer] : [];
  }
  
  // Otherwise search by name or email (case-insensitive)
  const searchPattern = `%${query}%`;
  return await db.select().from(customers)
    .where(
      or(
        ilike(customers.name, searchPattern),
        ilike(customers.email, searchPattern)
      )
    )
    .orderBy(desc(customers.createdAt))
    .limit(20); // Limit to 20 results for performance
}

// ============ ORDERS ============

export async function createOrder(data: NewOrder) {
  // Enhancement #32: Calculate 50% deposit requirement for custom orders
  let orderData = { ...data };
  if (data.orderType === 'custom' && data.totalAmount) {
    orderData.depositRequired = Math.ceil(data.totalAmount * 0.5); // 50% deposit
    orderData.depositMet = (data.depositAmount || 0) >= orderData.depositRequired;
  }
  
  const [order] = await db.insert(orders).values(orderData).returning();
  
  // Update customer's total orders and last order date
  const customer = await getCustomerById(data.customerId);
  if (customer) {
    await updateCustomer(data.customerId, {
      totalOrders: (customer.totalOrders || 0) + 1,
      lastOrderDate: new Date(),
      isVip: (customer.totalOrders || 0) + 1 >= 5, // VIP after 5 orders
    });
  }
  
  return order;
}

export async function getAllOrders() {
  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getAllOrdersWithCustomers() {
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      flavor: orders.flavor,
      servings: orders.servings,
      eventDate: orders.eventDate,
      message: orders.message,
      additionalNotes: orders.additionalNotes,
      inspirationImages: orders.inspirationImages,
      layers: orders.layers,
      status: orders.status,
      priority: orders.priority,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      paymentStatus: orders.paymentStatus,
      depositRequired: orders.depositRequired, // Enhancement #32
      depositMet: orders.depositMet, // Enhancement #32
      cancellationReason: orders.cancellationReason,
      cancelledAt: orders.cancelledAt,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt));
}

export async function getOrdersByCustomerId(customerId: number) {
  return await db.select().from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  return order || null;
}

export async function updateOrderStatus(id: number, status: string) {
  const [updated] = await db.update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();
  return updated;
}

export async function updateOrder(id: number, data: Partial<NewOrder>) {
  const [updated] = await db.update(orders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();
  return updated;
}

// Get customers with order statistics for reports
export async function getCustomersForReport(minSpending?: number, maxSpending?: number, customerType?: string) {
  // Build WHERE conditions
  const whereConditions: any[] = [isNull(customers.deletedAt)];
  
  if (customerType && customerType !== 'all') {
    whereConditions.push(sql`${customers.customerType} = ${customerType}`);
  }
  
  // Build HAVING conditions for spending filters (SQL-based, not client-side)
  const havingConditions: any[] = [];
  if (minSpending !== undefined) {
    havingConditions.push(sql`COALESCE(SUM(${orders.totalAmount}), 0) >= ${minSpending}`);
  }
  if (maxSpending !== undefined) {
    havingConditions.push(sql`COALESCE(SUM(${orders.totalAmount}), 0) <= ${maxSpending}`);
  }
  
  // Build query
  let query = db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      customerType: customers.customerType,
      createdAt: customers.createdAt,
      orderCount: sql<number>`COUNT(${orders.id})::int`,
      totalSpent: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)::int`
    })
    .from(customers)
    .leftJoin(orders, and(
      eq(orders.customerId, customers.id),
      isNull(orders.deletedAt)
    ))
    .where(and(...whereConditions))
    .groupBy(customers.id, customers.name, customers.email, customers.phone, customers.customerType, customers.createdAt);
  
  // Apply HAVING clause if spending filters exist
  if (havingConditions.length > 0) {
    query = query.having(and(...havingConditions)) as any;
  }
  
  // Order by creation date
  const customersData = await query.orderBy(desc(customers.createdAt));
  
  return customersData;
}

// Get orders for reports with date range and status filter
export async function getOrdersForReport(startDate: Date, endDate: Date, status?: string) {
  const conditions = [
    sql`${orders.createdAt} >= ${startDate.toISOString()}`,
    sql`${orders.createdAt} <= ${endDate.toISOString()}`,
    isNull(orders.deletedAt)
  ];
  
  if (status) {
    conditions.push(eq(orders.status, status));
  }
  
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      eventDate: orders.eventDate,
      status: orders.status,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(...conditions))
    .orderBy(desc(orders.createdAt));
}

// TIER 3 - Report 3: Revenue Report
// Returns: invoiced revenue (totalAmount), deposits, outstanding (balanceDue), collection rate
// Excludes: cancelled orders, refunded orders, soft-deleted orders
// Per architect guidance: Use totalAmount for revenue, balanceDue for outstanding
export async function getRevenueData(startDate: Date, endDate: Date) {
  // Get all non-cancelled, non-refunded orders in the date range
  const revenueOrders = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      orderType: orders.orderType,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(and(
      sql`${orders.createdAt} >= ${startDate.toISOString()}`,
      sql`${orders.createdAt} <= ${endDate.toISOString()}`,
      isNull(orders.deletedAt),
      sql`${orders.status} != 'cancelled'`,
      sql`${orders.paymentStatus} != 'refunded'`
    ))
    .orderBy(desc(orders.createdAt));
  
  return revenueOrders;
}

// Get order by tracking token (public endpoint - limited fields)
export async function getOrderByTrackingToken(token: string) {
  const result = await db
    .select({
      id: orders.id,
      status: orders.status,
      trackingToken: orders.trackingToken,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      depositRequired: orders.depositRequired,
      depositMet: orders.depositMet,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(
      and(
        eq(orders.trackingToken, token),
        isNull(orders.deletedAt)
      )
    )
    .limit(1);

  return result[0] || null;
}

// ============================================================================
// DORMANT FUNCTIONS - OPTIONAL WEBSITE FEATURE (PRIORITY 4)
// These functions query inquiries/contactMessages tables which are part of the
// optional updated website (Priority 4 per case study).
// They are NOT part of the mandatory staff application scope (Priorities 1-3).
// Functions retained for future optional website implementation.
// DO NOT use these functions in the staff application.
// ============================================================================

// DORMANT: Inquiry functions (Optional Website Feature - Priority 4)
export async function createInquiry(data: NewInquiry) {
  const [inquiry] = await db.insert(inquiries).values(data).returning();
  return inquiry;
}

export async function getAllInquiries() {
  return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function updateInquiryStatus(id: number, status: string) {
  const [updated] = await db.update(inquiries)
    .set({ status })
    .where(eq(inquiries.id, id))
    .returning();
  return updated;
}

// DORMANT: Contact Message functions (Optional Website Feature - Priority 4)
export async function createContactMessage(data: NewContactMessage) {
  const [message] = await db.insert(contactMessages).values(data).returning();
  return message;
}

export async function getAllContactMessages() {
  return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function updateContactMessageStatus(id: number, status: string) {
  const [updated] = await db.update(contactMessages)
    .set({ status })
    .where(eq(contactMessages.id, id))
    .returning();
  return updated;
}

// ============================================================================
// END DORMANT FUNCTIONS
// ============================================================================

// ============ PAYMENTS (Admin Tracking) ============

export async function createPayment(data: NewPayment) {
  const [payment] = await db.insert(payments).values(data).returning();
  return payment;
}

export async function getPaymentsByOrderId(orderId: number) {
  return await db.select().from(payments)
    .where(eq(payments.orderId, orderId))
    .orderBy(desc(payments.paymentDate));
}

export async function getPaymentById(id: number) {
  const [payment] = await db.select().from(payments).where(eq(payments.id, id));
  return payment || null;
}

export async function updatePayment(id: number, data: Partial<NewPayment>) {
  const [updated] = await db.update(payments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(payments.id, id))
    .returning();
  return updated;
}

// ============ EMPLOYEES ============

export async function getEmployeeByEmail(email: string) {
  const [employee] = await db.select().from(employees)
    .where(and(eq(employees.email, email), eq(employees.isActive, true)));
  return employee || null;
}

export async function getEmployeeByEmailIncludingInactive(email: string) {
  const [employee] = await db.select().from(employees)
    .where(eq(employees.email, email));
  return employee || null;
}

export async function getEmployeeById(id: number) {
  const [employee] = await db.select().from(employees)
    .where(and(eq(employees.id, id), eq(employees.isActive, true)));
  return employee || null;
}

export async function getEmployeeByIdIncludingInactive(id: number) {
  const [employee] = await db.select().from(employees)
    .where(eq(employees.id, id));
  return employee || null;
}

export async function getAllEmployees() {
  return await db.select().from(employees)
    .where(eq(employees.isActive, true))
    .orderBy(employees.name);
}

export async function getAllEmployeesIncludingInactive() {
  return await db.select().from(employees)
    .orderBy(desc(employees.createdAt));
}

export async function createEmployee(data: NewEmployee) {
  const [employee] = await db.insert(employees).values(data).returning();
  return employee;
}

export async function updateEmployee(id: number, data: Partial<NewEmployee>) {
  const [updated] = await db.update(employees)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(employees.id, id))
    .returning();
  return updated;
}

export async function toggleEmployeeStatus(id: number) {
  const employee = await getEmployeeByIdIncludingInactive(id);
  if (!employee) return null;
  
  const [updated] = await db.update(employees)
    .set({ isActive: !employee.isActive, updatedAt: new Date() })
    .where(eq(employees.id, id))
    .returning();
  return updated;
}

export async function searchEmployees(query: string) {
  const searchPattern = `%${query}%`;
  return await db.select().from(employees)
    .where(
      or(
        ilike(employees.name, searchPattern),
        ilike(employees.email, searchPattern)
      )
    )
    .orderBy(employees.name)
    .limit(20);
}

// ============ COMBINED QUERIES ============

// Get customer with all their orders
export async function getCustomerWithOrders(customerId: number) {
  const customer = await getCustomerById(customerId);
  if (!customer) return null;
  
  const customerOrders = await getOrdersByCustomerId(customerId);
  
  return {
    ...customer,
    orders: customerOrders,
  };
}

// ============ DASHBOARD METRICS ============

// Helper: Get start and end of today
function getTodayRange() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return { startOfToday, endOfToday };
}

// Helper: Get start and end of yesterday
function getYesterdayRange() {
  const now = new Date();
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
  const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
  return { startOfYesterday, endOfYesterday };
}

// Helper: Get start and end of this week
function getThisWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0);
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - dayOfWeek), 23, 59, 59);
  return { startOfWeek, endOfWeek };
}

// Helper: Get start and end of last week
function getLastWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek - 7, 0, 0, 0);
  const endOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek - 1, 23, 59, 59);
  return { startOfLastWeek, endOfLastWeek };
}

// Sales Dashboard Metrics - CASE STUDY ALIGNED
// Measurable Objectives (Page 3):
// 1. Reduce order creation time: 20hrs/week → 15hrs/week (25% reduction)
// 2. Increase returning customers: 700/year → 805/year (15% increase)
// 3. Deposit compliance: 50% minimum per business rules
export async function getSalesDashboardMetrics() {
  const { startOfToday, endOfToday } = getTodayRange();
  const { startOfWeek, endOfWeek } = getThisWeekRange();

  // KPI 1: DEPOSIT COMPLIANCE (Business Rule: 50% minimum deposit required)
  // Critical for cash flow - ensures all custom orders meet 50% deposit requirement
  const weekOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.createdAt} >= ${startOfWeek.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfWeek.toISOString()}`,
      isNull(orders.deletedAt),
      sql`${orders.status} != 'cancelled'`,
      eq(orders.orderType, 'custom')
    ));

  const depositCompliantOrders = weekOrders.filter(o => {
    if (!o.totalAmount || !o.depositAmount) return false;
    const requiredDeposit = o.totalAmount * 0.5;
    return o.depositAmount >= requiredDeposit;
  }).length;
  
  const depositComplianceRate = weekOrders.length > 0 
    ? Math.round((depositCompliantOrders / weekOrders.length) * 100)
    : 100;

  // KPI 2: ORDERS CREATED TODAY
  // Tracks order creation speed (targeting time reduction)
  const todayOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.createdAt} >= ${startOfToday.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfToday.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  // KPI 3: RETURNING CUSTOMERS (This Week)
  // Measures customer retention (targeting 15% increase)
  const returningCustomers = await db
    .select({ customerId: orders.customerId })
    .from(orders)
    .where(and(
      sql`${orders.createdAt} >= ${startOfWeek.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfWeek.toISOString()}`,
      isNull(orders.deletedAt)
    ))
    .groupBy(orders.customerId);

  const returningCustomerIds = returningCustomers.map(r => r.customerId);
  const returningCount = await db
    .select({ id: customers.id })
    .from(customers)
    .where(and(
      sql`${customers.id} IN (${returningCustomerIds.length > 0 ? sql.raw(returningCustomerIds.join(',')) : sql`NULL`})`,
      sql`${customers.totalOrders} > 1`
    ));

  // KPI 4: UPCOMING PICKUPS (Today)
  // Operational coordination - orders due for pickup today
  const pickupsToday = await db.select().from(orders)
    .where(and(
      sql`DATE(${orders.eventDate}) = DATE(${startOfToday.toISOString()})`,
      isNull(orders.deletedAt),
      sql`${orders.status} != 'cancelled'`
    ));

  return {
    depositComplianceRate,
    depositCompliantCount: depositCompliantOrders,
    totalCustomOrders: weekOrders.length,
    todayOrdersCount: todayOrders.length,
    returningCustomersCount: returningCount.length,
    pickupsTodayCount: pickupsToday.length,
  };
}

// Baker Dashboard Metrics - CASE STUDY ALIGNED
// Required KPIs:
// 1. Prep time per order (average minutes)
// 2. On-time handoff percentage (orders ready on schedule)
// 3. Current workload by assignment (number of assigned orders)
// 4. Orders in production today
// 5. Overdue orders count
export async function getBakerDashboardMetrics(bakerId: number) {
  const { startOfToday, endOfToday } = getTodayRange();
  const { startOfWeek, endOfWeek } = getThisWeekRange();
  const now = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // KPI 1: PREP TIME PER ORDER (Average Minutes)
  // TODO: Requires prepStartTime and prepEndTime fields in schema (Phase 8)
  // For now, use approximate calculation based on order creation to status change
  const completedOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`${orders.status} IN ('completed', 'ready', 'in_decoration', 'awaiting_decoration')`,
      sql`${orders.updatedAt} >= ${thirtyDaysAgo.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  let avgPrepTimeMinutes = 0;
  if (completedOrders.length > 0) {
    const totalPrepTimeMs = completedOrders.reduce((sum, order) => {
      const createdTime = new Date(order.createdAt).getTime();
      const completedTime = new Date(order.updatedAt).getTime();
      return sum + (completedTime - createdTime);
    }, 0);
    const avgPrepTimeMs = totalPrepTimeMs / completedOrders.length;
    avgPrepTimeMinutes = Math.round(avgPrepTimeMs / (1000 * 60)); // Convert to minutes
  }

  // KPI 2: ON-TIME HANDOFF PERCENTAGE (Orders ready on schedule)
  // Calculate based on orders completed before eventDate
  const weekCompletedOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`${orders.status} IN ('completed', 'ready', 'in_decoration', 'awaiting_decoration')`,
      sql`${orders.updatedAt} >= ${startOfWeek.toISOString()}`,
      sql`${orders.updatedAt} <= ${endOfWeek.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  let onTimeCount = 0;
  weekCompletedOrders.forEach(order => {
    if (order.eventDate && order.updatedAt) {
      const eventDate = new Date(order.eventDate);
      const completedDate = new Date(order.updatedAt);
      if (completedDate <= eventDate) {
        onTimeCount++;
      }
    }
  });

  const onTimePercentage = weekCompletedOrders.length > 0
    ? Math.round((onTimeCount / weekCompletedOrders.length) * 100)
    : 100;

  // KPI 3: CURRENT WORKLOAD BY ASSIGNMENT (Number of assigned orders)
  const assignedOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`${orders.status} NOT IN ('completed', 'cancelled')`,
      isNull(orders.deletedAt)
    ));

  // KPI 4: ORDERS IN PRODUCTION TODAY
  const ordersInProduction = await db.select().from(orders)
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`${orders.status} IN ('in_baking', 'pending', 'cooling')`,
      isNull(orders.deletedAt)
    ));

  // KPI 5: OVERDUE ORDERS COUNT
  // Orders past their eventDate but not completed
  const overdueOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`${orders.eventDate} < ${now.toISOString()}`,
      sql`${orders.status} NOT IN ('completed', 'ready', 'cancelled')`,
      isNull(orders.deletedAt)
    ));

  return {
    // KPI 1: Prep Time Per Order
    avgPrepTimeMinutes,
    completedOrdersCount: completedOrders.length,
    
    // KPI 2: On-Time Handoff Percentage
    onTimePercentage,
    onTimeCount,
    totalHandoffs: weekCompletedOrders.length,
    
    // KPI 3: Current Workload
    currentWorkload: assignedOrders.length,
    
    // KPI 4: Orders in Production Today
    ordersInProductionCount: ordersInProduction.length,
    
    // KPI 5: Overdue Orders
    overdueOrdersCount: overdueOrders.length,
  };
}

// Decorator Dashboard Metrics - CASE STUDY ALIGNED
// Required KPIs:
// 1. Design queue age (average days waiting)
// 2. Rush orders ready (count of rush orders in queue)
// 3. Current workload by assignment
// 4. Decoration completion rate (this week)
// 5. Overdue decorations count
export async function getDecoratorDashboardMetrics(decoratorId: number) {
  const { startOfToday, endOfToday } = getTodayRange();
  const { startOfWeek, endOfWeek } = getThisWeekRange();
  const now = new Date();
  const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // KPI 1: DESIGN QUEUE AGE (Average Days Waiting)
  // Calculate average age of orders waiting for decoration
  const queuedOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.status} IN ('awaiting_decoration', 'in_decoration')`,
      isNull(orders.deletedAt)
    ));

  let totalQueueDays = 0;
  queuedOrders.forEach(order => {
    const createdTime = new Date(order.createdAt).getTime();
    const nowTime = now.getTime();
    const daysWaiting = Math.floor((nowTime - createdTime) / (1000 * 60 * 60 * 24));
    totalQueueDays += daysWaiting;
  });

  const avgQueueAgeDays = queuedOrders.length > 0
    ? Math.round(totalQueueDays / queuedOrders.length)
    : 0;

  // KPI 2: RUSH ORDERS READY (Count of rush orders in queue)
  // Orders with eventDate within 48 hours that need decoration
  const fortyEightHoursFromNow = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const rushOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.eventDate} >= ${now.toISOString()}`,
      sql`${orders.eventDate} <= ${fortyEightHoursFromNow.toISOString()}`,
      sql`${orders.status} IN ('awaiting_decoration', 'in_decoration')`,
      isNull(orders.deletedAt)
    ));

  // KPI 3: CURRENT WORKLOAD BY ASSIGNMENT
  // All orders assigned to decorator that are not completed/cancelled
  const assignedOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.status} NOT IN ('completed', 'cancelled')`,
      isNull(orders.deletedAt)
    ));

  // KPI 4: DECORATION COMPLETION RATE (This Week)
  // Percentage of orders completed this week vs total assigned
  const weekOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.createdAt} >= ${startOfWeek.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfWeek.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  const weekCompletedOrders = weekOrders.filter(o => 
    o.status === 'completed' || o.status === 'ready'
  ).length;

  const completionRate = weekOrders.length > 0
    ? Math.round((weekCompletedOrders / weekOrders.length) * 100)
    : 0;

  // KPI 5: OVERDUE DECORATIONS COUNT
  // Orders past their eventDate but not completed
  const overdueOrders = await db.select().from(orders)
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.eventDate} < ${now.toISOString()}`,
      sql`${orders.status} NOT IN ('completed', 'ready', 'cancelled')`,
      isNull(orders.deletedAt)
    ));

  return {
    // KPI 1: Design Queue Age
    avgQueueAgeDays,
    queuedOrdersCount: queuedOrders.length,
    
    // KPI 2: Rush Orders Ready
    rushOrdersCount: rushOrders.length,
    
    // KPI 3: Current Workload
    currentWorkload: assignedOrders.length,
    
    // KPI 4: Decoration Completion Rate
    completionRate,
    weekCompletedCount: weekCompletedOrders,
    weekTotalCount: weekOrders.length,
    
    // KPI 5: Overdue Decorations
    overdueOrdersCount: overdueOrders.length,
  };
}

// Accountant Dashboard Metrics - CASE STUDY ALIGNED
// Required KPIs:
// 1. Deposit shortfalls (orders missing 50% deposit)
// 2. Outstanding balances aging (total due, aging buckets)
// 3. Payment reconciliation accuracy
// 4. Deposit compliance rate (matching Sales dashboard)
// 5. Revenue collected this week
export async function getAccountantDashboardMetrics() {
  const { startOfToday, endOfToday } = getTodayRange();
  const { startOfWeek, endOfWeek } = getThisWeekRange();
  const now = new Date();

  // KPI 1: DEPOSIT SHORTFALLS (Orders missing 50% deposit)
  // Orders that don't meet the 50% deposit requirement (Case Study Objective 3)
  const ordersWithShortfalls = await db.select().from(orders)
    .where(and(
      sql`${orders.status} != 'cancelled'`,
      or(
        sql`${orders.depositAmount} < (${orders.totalAmount} * 0.5)`,
        isNull(orders.depositAmount),
        sql`${orders.depositAmount} = 0`
      ),
      isNull(orders.deletedAt)
    ));

  const totalShortfallAmount = ordersWithShortfalls.reduce((sum, order) => {
    const required = (order.totalAmount || 0) * 0.5;
    const received = order.depositAmount || 0;
    return sum + (required - received);
  }, 0);

  // KPI 2: OUTSTANDING BALANCES AGING (Total due, aging buckets)
  const outstandingOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.balanceDue} > 0`,
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ));

  let aging30Days = 0;
  let aging60Days = 0;
  let aging90PlusDays = 0;
  let aging30Count = 0;
  let aging60Count = 0;
  let aging90PlusCount = 0;

  outstandingOrders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const daysOutstanding = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    const balance = order.balanceDue || 0;

    if (daysOutstanding >= 90) {
      aging90PlusDays += balance;
      aging90PlusCount++;
    } else if (daysOutstanding >= 60) {
      aging60Days += balance;
      aging60Count++;
    } else if (daysOutstanding >= 30) {
      aging30Days += balance;
      aging30Count++;
    }
  });

  const totalOutstanding = aging30Days + aging60Days + aging90PlusDays;

  // KPI 3: PAYMENT RECONCILIATION ACCURACY
  // TODO: Requires paymentReconciled field in schema (Phase 8)
  // For now, calculate based on payment status matching order status
  const allActiveOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ));

  let reconciledCount = 0;
  allActiveOrders.forEach(order => {
    // Consider reconciled if payment status matches order status appropriately
    if (order.paymentStatus === 'paid' && order.balanceDue === 0) {
      reconciledCount++;
    } else if (order.paymentStatus === 'partial' && order.depositAmount && order.depositAmount > 0) {
      reconciledCount++;
    }
  });

  const reconciliationAccuracy = allActiveOrders.length > 0
    ? Math.round((reconciledCount / allActiveOrders.length) * 100)
    : 100;

  // KPI 4: DEPOSIT COMPLIANCE RATE (Matching Sales dashboard)
  // Percentage of orders meeting 50% deposit requirement
  const allOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ));

  const compliantOrders = allOrders.filter(order => {
    const depositAmount = order.depositAmount || 0;
    const totalAmount = order.totalAmount || 0;
    return depositAmount >= (totalAmount * 0.5);
  }).length;

  const depositComplianceRate = allOrders.length > 0
    ? Math.round((compliantOrders / allOrders.length) * 100)
    : 100;

  // KPI 5: REVENUE COLLECTED THIS WEEK
  const weekPayments = await db.select().from(payments)
    .where(and(
      sql`${payments.paymentDate} >= ${startOfWeek.toISOString()}`,
      sql`${payments.paymentDate} <= ${endOfWeek.toISOString()}`,
      eq(payments.paymentStatus, 'completed')
    ));

  const weekRevenue = weekPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return {
    // KPI 1: Deposit Shortfalls
    depositShortfallCount: ordersWithShortfalls.length,
    totalShortfallAmount,
    
    // KPI 2: Outstanding Balances Aging
    totalOutstanding,
    aging30Days,
    aging60Days,
    aging90PlusDays,
    aging30Count,
    aging60Count,
    aging90PlusCount,
    totalOutstandingCount: outstandingOrders.length,
    
    // KPI 3: Payment Reconciliation Accuracy
    reconciliationAccuracy,
    reconciledCount,
    totalOrdersCount: allActiveOrders.length,
    
    // KPI 4: Deposit Compliance Rate
    depositComplianceRate,
    compliantOrdersCount: compliantOrders,
    totalOrdersForCompliance: allOrders.length,
    
    // KPI 5: Revenue Collected This Week
    weekRevenue,
    weekPaymentsCount: weekPayments.length,
  };
}

// Manager Dashboard Metrics - CASE STUDY ALIGNED
// Required KPIs:
// 1. Lost-order risk tracking (orders with missing data/overdue tasks)
// 2. Cross-role staff utilization (Baker/Decorator workload distribution)
// 3. SLA adherence (on-time completion percentage)
// 4. Critical action items count
// 5. Team performance overview
export async function getManagerDashboardMetrics() {
  const { startOfWeek, endOfWeek } = getThisWeekRange();
  const now = new Date();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // KPI 1: LOST-ORDER RISK TRACKING (Orders with missing data/overdue tasks)
  // Tracks orders at risk of being lost due to incomplete data or delays
  const atRiskOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.status} NOT IN ('completed', 'cancelled')`,
      or(
        // Missing critical data
        isNull(orders.flavor),
        isNull(orders.servings),
        isNull(orders.eventDate),
        // Missing assignments
        isNull(orders.assignedBaker),
        isNull(orders.assignedDecorator),
        // Overdue (past eventDate but not completed)
        sql`${orders.eventDate} < ${now.toISOString()}`
      ),
      isNull(orders.deletedAt)
    ));

  // Calculate estimated cost of at-risk orders (contributes to $4,800→$960 objective)
  const atRiskValue = atRiskOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // KPI 2: CROSS-ROLE STAFF UTILIZATION (Baker/Decorator workload distribution)
  // Get all active staff
  const activeStaff = await db.select().from(employees)
    .where(and(
      eq(employees.isActive, true),
      sql`${employees.role} IN ('baker', 'decorator')`
    ));

  const bakers = activeStaff.filter(s => s.role === 'baker');
  const decorators = activeStaff.filter(s => s.role === 'decorator');

  // Calculate workload per baker
  const bakerWorkloads = await Promise.all(bakers.map(async (baker) => {
    const workload = await db.select().from(orders)
      .where(and(
        eq(orders.assignedBaker, baker.id),
        sql`${orders.status} NOT IN ('completed', 'cancelled')`,
        isNull(orders.deletedAt)
      ));
    return { bakerId: baker.id, bakerName: baker.name, workload: workload.length };
  }));

  // Calculate workload per decorator
  const decoratorWorkloads = await Promise.all(decorators.map(async (decorator) => {
    const workload = await db.select().from(orders)
      .where(and(
        eq(orders.assignedDecorator, decorator.id),
        sql`${orders.status} NOT IN ('completed', 'cancelled')`,
        isNull(orders.deletedAt)
      ));
    return { decoratorId: decorator.id, decoratorName: decorator.name, workload: workload.length };
  }));

  const avgBakerWorkload = bakers.length > 0
    ? Math.round(bakerWorkloads.reduce((sum, b) => sum + b.workload, 0) / bakers.length)
    : 0;

  const avgDecoratorWorkload = decorators.length > 0
    ? Math.round(decoratorWorkloads.reduce((sum, d) => sum + d.workload, 0) / decorators.length)
    : 0;

  // KPI 3: SLA ADHERENCE (On-time completion percentage)
  const completedOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.status} IN ('completed', 'ready')`,
      sql`${orders.updatedAt} >= ${sevenDaysAgo.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  let onTimeCount = 0;
  let lateCount = 0;

  completedOrders.forEach(order => {
    if (order.eventDate && order.updatedAt) {
      const eventDate = new Date(order.eventDate);
      const completedDate = new Date(order.updatedAt);
      
      if (completedDate <= eventDate) {
        onTimeCount++;
      } else {
        lateCount++;
      }
    }
  });

  const totalDelivered = onTimeCount + lateCount;
  const slaAdherenceRate = totalDelivered > 0 
    ? Math.round((onTimeCount / totalDelivered) * 100)
    : 100;

  // KPI 4: CRITICAL ACTION ITEMS COUNT
  // Orders requiring immediate manager attention
  const criticalActionItems = await db.select().from(orders)
    .where(and(
      sql`${orders.status} NOT IN ('completed', 'cancelled')`,
      or(
        // High priority orders
        eq(orders.priority, 'high'),
        // Overdue orders
        sql`${orders.eventDate} < ${now.toISOString()}`,
        // Missing deposits (critical for cash flow)
        sql`${orders.depositAmount} < (${orders.totalAmount} * 0.5)`
      ),
      isNull(orders.deletedAt)
    ));

  // KPI 5: TEAM PERFORMANCE OVERVIEW
  // Overall team efficiency metrics
  const weekOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.createdAt} >= ${startOfWeek.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfWeek.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  const weekCompletedOrders = weekOrders.filter(o => 
    o.status === 'completed' || o.status === 'ready'
  ).length;

  const teamPerformanceRate = weekOrders.length > 0
    ? Math.round((weekCompletedOrders / weekOrders.length) * 100)
    : 0;

  return {
    // KPI 1: Lost-Order Risk Tracking
    atRiskOrdersCount: atRiskOrders.length,
    atRiskValue,
    
    // KPI 2: Cross-Role Staff Utilization
    avgBakerWorkload,
    avgDecoratorWorkload,
    totalBakers: bakers.length,
    totalDecorators: decorators.length,
    bakerWorkloads,
    decoratorWorkloads,
    
    // KPI 3: SLA Adherence
    slaAdherenceRate,
    onTimeCount,
    lateCount,
    totalDelivered,
    
    // KPI 4: Critical Action Items
    criticalActionItemsCount: criticalActionItems.length,
    
    // KPI 5: Team Performance Overview
    teamPerformanceRate,
    weekOrdersCount: weekOrders.length,
    weekCompletedCount: weekCompletedOrders,
  };
}

// Owner Dashboard Metrics - CASE STUDY ALIGNED
// Required KPIs:
// 1. Time saved trendline (targeting 20→15hrs/week)
// 2. Cost of lost orders (targeting $4,800→$960/year reduction)
// 3. Retention growth (targeting 700→805 returning customers/year)
// 4. Overall deposit compliance
// 5. Business health scorecard
export async function getOwnerDashboardMetrics() {
  const { startOfWeek, endOfWeek } = getThisWeekRange();
  const { startOfLastWeek, endOfLastWeek } = getLastWeekRange();
  const now = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  // KPI 1: TIME SAVED TRENDLINE (Targeting 20→15hrs/week)
  // TODO: Requires orderCreationTime field in schema (Phase 8)
  // For now, calculate based on number of orders created per week
  // Assumption: Each order takes average time to create
  const thisWeekOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.createdAt} >= ${startOfWeek.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfWeek.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  const lastWeekOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.createdAt} >= ${startOfLastWeek.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfLastWeek.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  // Approximate: Assume baseline 20hrs/week for 10 orders, target 15hrs/week
  const BASELINE_HOURS = 20;
  const TARGET_HOURS = 15;
  const BASELINE_ORDERS = 10;
  
  const avgOrdersPerWeek = (thisWeekOrders.length + lastWeekOrders.length) / 2;
  const estimatedHoursPerWeek = avgOrdersPerWeek > 0
    ? Math.round((avgOrdersPerWeek / BASELINE_ORDERS) * BASELINE_HOURS)
    : BASELINE_HOURS;
  
  const timeSavedPercentage = BASELINE_HOURS > 0
    ? Math.round(((BASELINE_HOURS - estimatedHoursPerWeek) / BASELINE_HOURS) * 100)
    : 0;

  // KPI 2: COST OF LOST ORDERS (Targeting $4,800→$960/year reduction)
  // Calculate value of cancelled/lost orders
  const yearCancelledOrders = await db.select().from(orders)
    .where(and(
      eq(orders.status, 'cancelled'),
      sql`${orders.createdAt} >= ${oneYearAgo.toISOString()}`,
      isNull(orders.deletedAt)
    ));

  const lostOrdersCost = yearCancelledOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  // Also include at-risk orders (overdue, missing data)
  const atRiskOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.status} NOT IN ('completed', 'cancelled')`,
      or(
        isNull(orders.flavor),
        isNull(orders.servings),
        sql`${orders.eventDate} < ${now.toISOString()}`
      ),
      isNull(orders.deletedAt)
    ));

  const atRiskValue = atRiskOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalLostOrdersCost = lostOrdersCost + atRiskValue;
  
  const BASELINE_LOST_COST = 480000; // $4,800 in cents
  const TARGET_LOST_COST = 96000; // $960 in cents
  const lostOrdersReductionPercentage = BASELINE_LOST_COST > 0
    ? Math.round(((BASELINE_LOST_COST - totalLostOrdersCost) / BASELINE_LOST_COST) * 100)
    : 0;

  // KPI 3: RETENTION GROWTH (Targeting 700→805 returning customers/year)
  // Calculate returning customers (customers with 2+ orders)
  const allCustomers = await db.select({
    id: customers.id,
    orderCount: sql<number>`COUNT(${orders.id})::int`
  })
  .from(customers)
  .leftJoin(orders, eq(orders.customerId, customers.id))
  .where(isNull(customers.deletedAt))
  .groupBy(customers.id);

  const returningCustomersCount = allCustomers.filter(c => c.orderCount >= 2).length;
  
  const BASELINE_RETURNING = 700;
  const TARGET_RETURNING = 805;
  const retentionGrowthPercentage = BASELINE_RETURNING > 0
    ? Math.round(((returningCustomersCount - BASELINE_RETURNING) / BASELINE_RETURNING) * 100)
    : 0;

  // KPI 4: OVERALL DEPOSIT COMPLIANCE
  // Percentage of orders meeting 50% deposit requirement
  const allActiveOrders = await db.select().from(orders)
    .where(and(
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ));

  const compliantOrders = allActiveOrders.filter(order => {
    const depositAmount = order.depositAmount || 0;
    const totalAmount = order.totalAmount || 0;
    return depositAmount >= (totalAmount * 0.5);
  }).length;

  const depositComplianceRate = allActiveOrders.length > 0
    ? Math.round((compliantOrders / allActiveOrders.length) * 100)
    : 100;

  // KPI 5: BUSINESS HEALTH SCORECARD
  // Composite score based on all case study objectives
  const TARGET_DEPOSIT_COMPLIANCE = 100; // 100% compliance
  
  // Calculate overall health score (average of all KPIs meeting targets)
  const timeTargetMet = estimatedHoursPerWeek <= TARGET_HOURS ? 100 : Math.max(0, 100 - ((estimatedHoursPerWeek - TARGET_HOURS) / TARGET_HOURS * 100));
  const lostOrdersTargetMet = totalLostOrdersCost <= TARGET_LOST_COST ? 100 : Math.max(0, 100 - ((totalLostOrdersCost - TARGET_LOST_COST) / BASELINE_LOST_COST * 100));
  const retentionTargetMet = returningCustomersCount >= TARGET_RETURNING ? 100 : Math.round((returningCustomersCount / TARGET_RETURNING) * 100);
  const depositTargetMet = depositComplianceRate;
  
  const businessHealthScore = Math.round((timeTargetMet + lostOrdersTargetMet + retentionTargetMet + depositTargetMet) / 4);

  return {
    // KPI 1: Time Saved Trendline
    estimatedHoursPerWeek,
    baselineHours: BASELINE_HOURS,
    targetHours: TARGET_HOURS,
    timeSavedPercentage,
    thisWeekOrdersCount: thisWeekOrders.length,
    
    // KPI 2: Cost of Lost Orders
    totalLostOrdersCost,
    lostOrdersCost,
    atRiskValue,
    baselineLostCost: BASELINE_LOST_COST,
    targetLostCost: TARGET_LOST_COST,
    lostOrdersReductionPercentage,
    cancelledOrdersCount: yearCancelledOrders.length,
    atRiskOrdersCount: atRiskOrders.length,
    
    // KPI 3: Retention Growth
    returningCustomersCount,
    baselineReturning: BASELINE_RETURNING,
    targetReturning: TARGET_RETURNING,
    retentionGrowthPercentage,
    totalCustomersCount: allCustomers.length,
    
    // KPI 4: Overall Deposit Compliance
    depositComplianceRate,
    compliantOrdersCount: compliantOrders,
    totalOrdersCount: allActiveOrders.length,
    
    // KPI 5: Business Health Scorecard
    businessHealthScore,
    timeTargetMet: Math.round(timeTargetMet),
    lostOrdersTargetMet: Math.round(lostOrdersTargetMet),
    retentionTargetMet: Math.round(retentionTargetMet),
    depositTargetMet,
  };
}

// ============ DASHBOARD DETAIL ENDPOINTS (Phase 2.2) ============

// SALES DASHBOARD DETAIL QUERIES

export async function getTodaysOrders() {
  const { startOfToday, endOfToday } = getTodayRange();
  
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      paymentStatus: orders.paymentStatus,
      status: orders.status,
      priority: orders.priority,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      sql`${orders.createdAt} >= ${startOfToday.toISOString()}`,
      sql`${orders.createdAt} <= ${endOfToday.toISOString()}`,
      isNull(orders.deletedAt)
    ))
    .orderBy(desc(orders.createdAt));
}

export async function getPendingDeposits() {
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      depositRequired: orders.depositRequired,
      depositMet: orders.depositMet,
      paymentStatus: orders.paymentStatus,
      status: orders.status,
      priority: orders.priority,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.paymentStatus, 'partial'),
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ))
    .orderBy(desc(orders.eventDate));
}

export async function getPickupsToday() {
  const { startOfToday } = getTodayRange();
  
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      paymentStatus: orders.paymentStatus,
      status: orders.status,
      priority: orders.priority,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      sql`DATE(${orders.eventDate}) = DATE(${startOfToday.toISOString()})`,
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ))
    .orderBy(orders.eventDate);
}

export async function getRecentInquiries() {
  return await db
    .select({
      id: contactMessages.id,
      name: contactMessages.name,
      email: contactMessages.email,
      phone: contactMessages.phone,
      subject: contactMessages.subject,
      message: contactMessages.message,
      status: contactMessages.status,
      createdAt: contactMessages.createdAt,
    })
    .from(contactMessages)
    .where(eq(contactMessages.status, 'unread'))
    .orderBy(desc(contactMessages.createdAt));
}

// BAKER DASHBOARD DETAIL QUERIES

export async function getBakerQueue(bakerId: number) {
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      flavor: orders.flavor,
      layers: orders.layers,
      servings: orders.servings,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      status: orders.status,
      priority: orders.priority,
      additionalNotes: orders.additionalNotes,
      adminNotes: orders.adminNotes,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`${orders.status} IN ('pending', 'in_baking')`,
      isNull(orders.deletedAt)
    ))
    .orderBy(orders.eventDate, orders.priority);
}

export async function getBakerOrdersDueToday(bakerId: number) {
  const { startOfToday } = getTodayRange();
  
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      flavor: orders.flavor,
      layers: orders.layers,
      servings: orders.servings,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      status: orders.status,
      priority: orders.priority,
      additionalNotes: orders.additionalNotes,
      adminNotes: orders.adminNotes,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`DATE(${orders.eventDate}) = DATE(${startOfToday.toISOString()})`,
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ))
    .orderBy(orders.eventDate);
}

export async function getBakerTomorrowSchedule(bakerId: number) {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0);
  
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      flavor: orders.flavor,
      layers: orders.layers,
      servings: orders.servings,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      status: orders.status,
      priority: orders.priority,
      additionalNotes: orders.additionalNotes,
      adminNotes: orders.adminNotes,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.assignedBaker, bakerId),
      sql`DATE(${orders.eventDate}) = DATE(${startOfTomorrow.toISOString()})`,
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ))
    .orderBy(orders.eventDate);
}

// DECORATOR DASHBOARD DETAIL QUERIES

export async function getDecoratorQueue(decoratorId: number) {
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      flavor: orders.flavor,
      layers: orders.layers,
      servings: orders.servings,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      status: orders.status,
      priority: orders.priority,
      inspirationImages: orders.inspirationImages,
      additionalNotes: orders.additionalNotes,
      adminNotes: orders.adminNotes,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.status} IN ('in_decoration', 'awaiting_decoration')`,
      isNull(orders.deletedAt)
    ))
    .orderBy(orders.eventDate, orders.priority);
}

export async function getOrdersAwaitingPhotos(decoratorId: number) {
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      status: orders.status,
      priority: orders.priority,
      inspirationImages: orders.inspirationImages,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.status} IN ('ready', 'completed')`,
      isNull(orders.deletedAt)
    ))
    .orderBy(desc(orders.createdAt));
}

export async function getUrgentOrders(decoratorId: number) {
  const urgentDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      flavor: orders.flavor,
      layers: orders.layers,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      status: orders.status,
      priority: orders.priority,
      additionalNotes: orders.additionalNotes,
      adminNotes: orders.adminNotes,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.assignedDecorator, decoratorId),
      sql`${orders.eventDate} <= ${urgentDeadline.toISOString()}`,
      sql`${orders.status} NOT IN ('completed', 'cancelled')`,
      isNull(orders.deletedAt)
    ))
    .orderBy(orders.eventDate);
}

// ACCOUNTANT DASHBOARD DETAIL QUERIES

export async function getOutstandingBalances() {
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      paymentStatus: orders.paymentStatus,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      sql`${orders.balanceDue} > 0`,
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ))
    .orderBy(desc(orders.balanceDue));
}

export async function getPaidInFullOrders() {
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      orderType: orders.orderType,
      eventDate: orders.eventDate,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      paymentStatus: orders.paymentStatus,
      paymentDate: orders.paymentDate,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      eq(orders.paymentStatus, 'paid'),
      isNull(orders.deletedAt)
    ))
    .orderBy(desc(orders.paymentDate));
}

export async function getRevenueBreakdown(period: 'daily' | 'weekly' = 'daily') {
  const now = new Date();
  let startDate: Date;
  
  if (period === 'daily') {
    // Last 7 days
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
  } else {
    // Last 4 weeks
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28, 0, 0, 0);
  }
  
  return await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      customerName: customers.name,
      orderType: orders.orderType,
      totalAmount: orders.totalAmount,
      depositAmount: orders.depositAmount,
      balanceDue: orders.balanceDue,
      paymentStatus: orders.paymentStatus,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(
      sql`${orders.createdAt} >= ${startDate.toISOString()}`,
      sql`${orders.status} != 'cancelled'`,
      isNull(orders.deletedAt)
    ))
    .orderBy(desc(orders.createdAt));
}

// ============ ACTIVITY FEED (Phase 2.3) ============

export async function getActivityFeed(limit: number = 20, offset: number = 0) {
  return await db
    .select({
      id: orderStatusHistory.id,
      orderId: orderStatusHistory.orderId,
      oldStatus: orderStatusHistory.oldStatus,
      newStatus: orderStatusHistory.newStatus,
      employeeName: employees.name,
      employeeRole: employees.role,
      notes: orderStatusHistory.notes,
      createdAt: orderStatusHistory.createdAt,
    })
    .from(orderStatusHistory)
    .leftJoin(employees, eq(orderStatusHistory.updatedBy, employees.id))
    .orderBy(desc(orderStatusHistory.createdAt))
    .limit(limit)
    .offset(offset);
}
