import { pgTable, text, serial, timestamp, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  price: integer('price').notNull(), // in cents
  priceRange: varchar('price_range', { length: 50 }), // For products with variable pricing (e.g., "$45 - $85")
  description: text('description').notNull(),
  image: varchar('image', { length: 500 }), // URL to image
  inStock: boolean('in_stock').default(true).notNull(),
  popularity: integer('popularity').default(0).notNull(), // 0-100 score
  isNew: boolean('is_new').default(false).notNull(),
  isPopular: boolean('is_popular').default(false).notNull(),
  rating: integer('rating').default(5).notNull(), // 1-5 stars (stored as integer)
  reviews: integer('reviews').default(0).notNull(), // Number of reviews
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  deletedBy: varchar('deleted_by', { length: 255 }),
});

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
  
  // Enhancement #33: Soft delete support
  deletedAt: timestamp('deleted_at'),
  deletedBy: varchar('deleted_by', { length: 255 }),
  
  // Enhancement #35: Admin notes (internal only)
  adminNotes: text('admin_notes'),
  
  // Enhancement #39: Guest customer flagging
  isGuest: boolean('is_guest').default(false).notNull(),
  
  // Enhancement #12: Audit tracking
  lastModifiedBy: varchar('last_modified_by', { length: 255 }),
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
  additionalNotes: text('additional_notes'), // Customer-provided notes/special requests
  adminNotes: text('admin_notes'), // Internal management notes (not visible to customer)
  
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
  
  // Payment tracking
  depositAmount: integer('deposit_amount'), // in cents (minimum 50% for custom orders)
  balanceDue: integer('balance_due'), // in cents
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending').notNull(), // pending, partial, paid, refunded
  paymentDate: timestamp('payment_date'),
  paymentMethod: varchar('payment_method', { length: 50 }), // stripe, square, cash, etc
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }), // For Stripe integration
  
  // Cancellation tracking
  cancellationReason: text('cancellation_reason'),
  cancelledAt: timestamp('cancelled_at'),
  cancelledBy: varchar('cancelled_by', { length: 255 }), // Admin or customer name
  
  // Enhancement #33: Soft delete support
  deletedAt: timestamp('deleted_at'),
  deletedBy: varchar('deleted_by', { length: 255 }),
  
  // Enhancement #12: Audit tracking
  lastModifiedBy: varchar('last_modified_by', { length: 255 }),
  
  // Enhancement #32: Deposit requirement tracking
  depositRequired: integer('deposit_required'), // in cents (e.g., 50% of total)
  depositMet: boolean('deposit_met').default(false).notNull(),
  
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
  
  // Enhancement #43: Email/open status tracking
  viewedAt: timestamp('viewed_at'),
  viewedBy: varchar('viewed_by', { length: 255 }),
  respondedAt: timestamp('responded_at'),
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

// Admin Payment Tracking (record-keeping only, no processing)
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  
  // Payment details (record-keeping only)
  paymentType: varchar('payment_type', { length: 50 }).notNull(), // credit_card, cash, check
  amount: integer('amount').notNull(), // in cents
  paymentDate: timestamp('payment_date').notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).default('completed').notNull(), // pending, completed
  
  // Metadata
  notes: text('notes'), // Optional notes about the payment
  recordedBy: varchar('recorded_by', { length: 255 }).notNull(), // Admin/employee who recorded payment
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  inquiries: many(inquiries),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
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
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
