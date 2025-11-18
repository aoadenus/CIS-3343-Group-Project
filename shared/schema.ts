import { pgTable, text, serial, timestamp, integer, varchar, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// TIER 3 - Report 2: Customer type classification enum
export const customerTypeEnum = pgEnum('customer_type', ['retail', 'corporate']);

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

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'sales', 'baker', 'decorator', 'accountant', 'manager', 'owner'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
  
  // Enhancement #45: Customer type classification for reports (TIER 3 - Report 2)
  // Staff guidance: Choose 'corporate' for businesses, event planners, recurring orders >$5k annually
  customerType: customerTypeEnum('customer_type').default('retail').notNull(),
  
  // Enhancement #12: Audit tracking
  lastModifiedBy: varchar('last_modified_by', { length: 255 }),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  
  // Order type
  orderType: varchar('order_type', { length: 50 }).notNull(), // 'custom', 'shop', etc
  
  // Custom Builder fields
  flavor: varchar('flavor', { length: 100 }), // Legacy single flavor (for shop orders)
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
  
  // Staff Portal: Tracking and assignment
  trackingToken: varchar('tracking_token', { length: 50 }),
  assignedBaker: integer('assigned_baker').references(() => employees.id),
  assignedDecorator: integer('assigned_decorator').references(() => employees.id),
  
  // Rush order detection (orders due in <2 days require manager approval)
  isRushOrder: boolean('is_rush_order').default(false).notNull(),
  rushOrderApprovedBy: varchar('rush_order_approved_by', { length: 255 }),
  
  // CASE STUDY KPI TRACKING: Order lifecycle timestamps
  // These support measurable objectives: time reduction, lost order prevention
  prepStartedAt: timestamp('prep_started_at'), // Baker starts preparation
  prepCompletedAt: timestamp('prep_completed_at'), // Baker finishes prep, ready for decorator
  decorationCompletedAt: timestamp('decoration_completed_at'), // Decorator finishes, ready for pickup
  depositCollectedAt: timestamp('deposit_collected_at'), // When 50% deposit was received
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// DORMANT TABLES - OPTIONAL WEBSITE FEATURE (PRIORITY 4)
// These tables are part of the optional updated website (Priority 4 per case study).
// They are NOT part of the mandatory staff application scope (Priorities 1-3).
// Schema retained for future optional website implementation.
// DO NOT query these tables in the staff application.
// ============================================================================

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

// ============================================================================
// END DORMANT TABLES
// ============================================================================

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

// Order Status History Tracking
export const orderStatusHistory = pgTable('order_status_history', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  oldStatus: varchar('old_status', { length: 50 }),
  newStatus: varchar('new_status', { length: 50 }).notNull(),
  updatedBy: integer('updated_by').references(() => employees.id),
  notes: text('notes'), // Optional notes about the status change
  createdAt: timestamp('created_at').defaultNow().notNull(),
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

export const employeesRelations = relations(employees, ({ many }) => ({
  assignedBakerOrders: many(orders, { relationName: 'baker' }),
  assignedDecoratorOrders: many(orders, { relationName: 'decorator' }),
  statusUpdates: many(orderStatusHistory),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
  employee: one(employees, {
    fields: [orderStatusHistory.updatedBy],
    references: [employees.id],
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
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type NewOrderStatusHistory = typeof orderStatusHistory.$inferInsert;
