import { db } from './db.js';
import { customers, orders, inquiries, contactMessages } from '../shared/schema.js';
import type { NewCustomer, NewOrder, NewInquiry, NewContactMessage } from '../shared/schema.js';
import { eq, desc, and, or, like, ilike, sql } from 'drizzle-orm';

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
  const [order] = await db.insert(orders).values(data).returning();
  
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
