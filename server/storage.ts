import { db } from './db.js';
import { products, customers, orders, inquiries, contactMessages, payments, employees } from '../shared/schema.js';
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
      occasion: orders.occasion,
      flavor: orders.flavor,
      design: orders.design,
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

// ============ INQUIRIES ============

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

// ============ CONTACT MESSAGES ============

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

export async function getEmployeeById(id: number) {
  const [employee] = await db.select().from(employees)
    .where(and(eq(employees.id, id), eq(employees.isActive, true)));
  return employee || null;
}

export async function getAllEmployees() {
  return await db.select().from(employees)
    .where(eq(employees.isActive, true))
    .orderBy(employees.name);
}

export async function createEmployee(data: NewEmployee) {
  const [employee] = await db.insert(employees).values(data).returning();
  return employee;
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
