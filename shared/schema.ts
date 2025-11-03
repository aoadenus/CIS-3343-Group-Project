import { pgTable, text, serial, timestamp, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  totalOrders: integer('total_orders').default(0).notNull(),
  lastOrderDate: timestamp('last_order_date'),
  isVip: boolean('is_vip').default(false).notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  
  // Order type
  orderType: varchar('order_type', { length: 50 }).notNull(), // 'custom', 'shop', etc
  
  // Custom Builder fields
  occasion: varchar('occasion', { length: 100 }),
  flavor: varchar('flavor', { length: 100 }), // Legacy single flavor (for shop orders)
  design: varchar('design', { length: 100 }),
  servings: integer('servings'),
  additionalNotes: text('additional_notes'),
  
  // NEW: Layer-by-layer customization (unlimited layers)
  layers: text('layers'), // JSON array: [{ flavor, fillings: [], notes }]
  
  // Shop product inquiry fields
  productName: varchar('product_name', { length: 255 }),
  
  // Common fields
  eventDate: timestamp('event_date'),
  message: text('message'),
  inspirationImages: text('inspiration_images'), // JSON array of image URLs
  
  // Order management
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, preparing, ready, completed, cancelled
  priority: varchar('priority', { length: 20 }).default('medium').notNull(), // low, medium, high
  totalAmount: integer('total_amount'), // in cents
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  eventDate: timestamp('event_date'),
  message: text('message'),
  productName: varchar('product_name', { length: 255 }),
  inspirationImages: text('inspiration_images'), // JSON array
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, reviewed, contacted
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  inspirationImages: text('inspiration_images'), // JSON array
  status: varchar('status', { length: 50 }).default('unread').notNull(), // unread, read, responded
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  inquiries: many(inquiries),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  customer: one(customers, {
    fields: [inquiries.customerId],
    references: [customers.id],
  }),
}));

// Layer structure for custom cakes
export interface CakeLayer {
  flavor: string;
  fillings: string[]; // Max 2 fillings per layer
  notes?: string; // Optional notes (max 255 chars)
}

// Types
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
