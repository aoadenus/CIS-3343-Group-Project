# Detailed Backend Implementation Plan
## Emily Bakes Cakes - Step-by-Step Development Guide

---

## 📋 OVERVIEW

**Document Purpose:** Provide a detailed, actionable implementation plan for backend modernization.  
**Target Audience:** Development team  
**Timeline:** 10 weeks (400 hours)  
**CIS 3343 Fall 2025**

---

## 🗓️ PHASE 1: FOUNDATION (WEEKS 1-3)

### **Week 1: Database Schema Expansion**

#### **Day 1-2: Employee Management System**

**Tasks:**
1. Create `employees` table in schema
2. Add relationships to `orders` table
3. Seed initial employee data
4. Create CRUD API endpoints

**Implementation:**

\`\`\`typescript
// shared/schema.ts - ADD THIS TABLE

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'owner', 'manager', 'sales', 'baker', 'decorator', 'accountant'
  phone: varchar('phone', { length: 50 }),
  isActive: boolean('is_active').default(true).notNull(),
  hireDate: date('hire_date'),
  skillLevel: varchar('skill_level', { length: 20 }), // 'junior', 'senior', 'master'
  specialties: jsonb('specialties').$type<string[]>(),
  maxOrdersPerDay: integer('max_orders_per_day').default(5),
  hourlyRate: integer('hourly_rate'), // in cents
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// UPDATE orders table - ADD THESE FIELDS
export const orders = pgTable('orders', {
  // ... existing fields ...
  salesStaffId: integer('sales_staff_id').references(() => employees.id),
  lastEmployeeId: integer('last_employee_id').references(() => employees.id),
  finalApprovalId: integer('final_approval_id').references(() => employees.id),
  approvedAt: timestamp('approved_at'),
  isRushOrder: boolean('is_rush_order').default(false).notNull(),
  completionDeadline: timestamp('completion_deadline')
});
\`\`\`

**Seed Data:**

\`\`\`typescript
// server/seeds/employees.ts

export const initialEmployees = [
  {
    email: 'emily@emilybakes.com',
    passwordHash: await hashPassword('demo123'),
    firstName: 'Emily',
    lastName: 'Boudreaux',
    role: 'owner',
    phone: '(713) 555-0100',
    isActive: true,
    hireDate: '2003-01-15',
    skillLevel: 'master',
    specialties: ['European baking', 'Cake decoration', 'Business management']
  },
  {
    email: 'james@emilybakes.com',
    passwordHash: await hashPassword('demo123'),
    firstName: 'James',
    lastName: 'Manager',
    role: 'manager',
    phone: '(713) 555-0101',
    isActive: true,
    hireDate: '2010-06-01',
    skillLevel: 'senior'
  },
  {
    email: 'mike@emilybakes.com',
    firstName: 'Mike',
    lastName: 'Baker',
    role: 'baker',
    maxOrdersPerDay: 6,
    skillLevel: 'senior'
  },
  {
    email: 'anna@emilybakes.com',
    firstName: 'Anna',
    lastName: 'Decorator',
    role: 'decorator',
    specialties: ['Wedding cakes', 'Fondant work'],
    skillLevel: 'master'
  },
  {
    email: 'dan@emilybakes.com',
    firstName: 'Dan',
    lastName: 'Accountant',
    role: 'accountant'
  }
];
\`\`\`

**Migration Command:**

\`\`\`bash
npm run db:push
\`\`\`

**API Endpoints:**

\`\`\`typescript
// server/index.ts - ADD THESE ROUTES

// Employee endpoints
app.get('/api/employees', authMiddleware, async (req, res) => {
  const employees = await db.select().from(schema.employees);
  res.json(employees);
});

app.post('/api/employees', authMiddleware, requireRole(['owner', 'manager']), async (req, res) => {
  const { email, firstName, lastName, role, phone } = req.body;
  
  const passwordHash = await bcrypt.hash('temp123', 10);
  
  const [employee] = await db.insert(schema.employees).values({
    email,
    passwordHash,
    firstName,
    lastName,
    role,
    phone
  }).returning();
  
  res.json(employee);
});
\`\`\`

#### **Day 3-4: Product Options Database Migration**

**Tasks:**
1. Create `product_options` table
2. Migrate data from `/src/data/cakeOptions.ts`
3. Update builder to use database
4. Create admin UI for managing options

**Implementation:**

\`\`\`typescript
// shared/schema.ts

export const productOptions = pgTable('product_options', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  optionType: varchar('option_type', { length: 50 }).notNull(),
  extraCost: integer('extra_cost').default(0),
  isActive: boolean('is_active').default(true),
  isAvailable: boolean('is_available').default(true),
  displayOrder: integer('display_order').default(0),
  description: text('description'),
  allergenInfo: varchar('allergen_info', { length: 255 }),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
\`\`\`

**Migration Script:**

\`\`\`typescript
// server/migrations/migrateOptions.ts

import { flavors, fillings, icings } from '../src/data/cakeOptions';

async function migrateOptions() {
  // Migrate flavors
  for (const flavor of flavors) {
    await db.insert(schema.productOptions).values({
      name: flavor.name,
      optionType: 'flavor',
      extraCost: flavor.price || 0,
      displayOrder: flavors.indexOf(flavor)
    });
  }
  
  // Migrate fillings
  for (const filling of fillings) {
    await db.insert(schema.productOptions).values({
      name: filling.name,
      optionType: 'filling',
      extraCost: filling.price || 0,
      displayOrder: fillings.indexOf(filling)
    });
  }
  
  // Migrate icings
  for (const icing of icings) {
    await db.insert(schema.productOptions).values({
      name: icing.name,
      optionType: 'icing',
      extraCost: icing.price || 0,
      displayOrder: icings.indexOf(icing)
    });
  }
  
  console.log('✅ Options migrated successfully');
}

// Run: npm run migrate:options
\`\`\`

#### **Day 5: Customer Enhancements**

**Tasks:**
1. Add customer type field
2. Add address fields
3. Update customer forms

\`\`\`typescript
// shared/schema.ts - UPDATE customers table

export const customers = pgTable('customers', {
  // ... existing fields ...
  customerType: varchar('customer_type', { length: 20 }).default('retail'),
  companyName: varchar('company_name', { length: 255 }),
  addressLine1: varchar('address_line1', { length: 100 }),
  addressLine2: varchar('address_line2', { length: 100 }),
  city: varchar('city', { length: 60 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 10 }),
  taxId: varchar('tax_id', { length: 50 })
});
\`\`\`

---

### **Week 2: Authentication System**

#### **Day 1-2: JWT Authentication Setup**

**Install Dependencies:**

\`\`\`bash
npm install jsonwebtoken bcrypt cookie-parser
npm install --save-dev @types/jsonwebtoken @types/bcrypt @types/cookie-parser
\`\`\`

**Implementation:**

\`\`\`typescript
// server/auth/jwt.ts

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  permissions: string[];
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h'
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
\`\`\`

**Auth Middleware:**

\`\`\`typescript
// server/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
    permissions: string[];
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
\`\`\`

#### **Day 3-4: Login/Logout Endpoints**

\`\`\`typescript
// server/routes/auth.ts

import express from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../auth/jwt';
import { db } from '../db';
import { employees } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find employee
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.email, email))
    .limit(1);
  
  if (!employee) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, employee.passwordHash);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Update last login
  await db
    .update(employees)
    .set({ lastLoginAt: new Date() })
    .where(eq(employees.id, employee.id));
  
  // Generate token
  const token = generateToken({
    userId: employee.id,
    email: employee.email,
    role: employee.role,
    permissions: getPermissionsByRole(employee.role)
  });
  
  res.json({
    success: true,
    token,
    user: {
      id: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role
    }
  });
});

router.post('/logout', authMiddleware, (req, res) => {
  // In stateless JWT, logout is handled client-side by discarding token
  res.json({ success: true });
});

router.get('/me', authMiddleware, async (req, res) => {
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, req.user!.userId))
    .limit(1);
  
  res.json(employee);
});

export default router;
\`\`\`

#### **Day 5: Role-Based Access Control**

\`\`\`typescript
// server/middleware/permissions.ts

const rolePermissions = {
  owner: ['ALL:*'],
  manager: ['ALL:*'],
  sales: ['customers:read', 'customers:create', 'orders:create', 'orders:read'],
  baker: ['orders:read', 'orders:update_status'],
  decorator: ['orders:read', 'orders:update_status', 'orders:add_notes'],
  accountant: ['payments:read', 'payments:create', 'reports:financial']
};

export function getPermissionsByRole(role: string): string[] {
  return rolePermissions[role] || [];
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

export function requirePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const hasPermission = req.user.permissions.includes('ALL:*') || 
                         req.user.permissions.includes(permission);
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}
\`\`\`

---

### **Week 3: Business Rules Engine**

#### **Day 1-2: Rules Configuration Table**

\`\`\`typescript
// shared/schema.ts

export const businessRules = pgTable('business_rules', {
  id: serial('id').primaryKey(),
  ruleKey: varchar('rule_key', { length: 100 }).notNull().unique(),
  ruleName: varchar('rule_name', { length: 200 }).notNull(),
  ruleValue: varchar('rule_value', { length: 500 }).notNull(),
  dataType: varchar('data_type', { length: 20 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  lastModifiedBy: integer('last_modified_by').references(() => employees.id),
  updatedAt: timestamp('updated_at').defaultNow()
});
\`\`\`

**Seed Rules:**

\`\`\`typescript
// server/seeds/businessRules.ts

export const defaultRules = [
  {
    ruleKey: 'deposit_percentage_required',
    ruleName: 'Minimum Deposit Percentage',
    ruleValue: '50',
    dataType: 'integer',
    description: 'Minimum deposit percentage for custom orders'
  },
  {
    ruleKey: 'minimum_advance_notice_days',
    ruleName: 'Advance Notice Period',
    ruleValue: '2',
    dataType: 'integer',
    description: 'Days in advance for custom cake orders'
  },
  {
    ruleKey: 'max_fillings_per_layer',
    ruleName: 'Max Fillings Per Layer',
    ruleValue: '2',
    dataType: 'integer',
    description: 'Maximum fillings allowed per cake layer'
  },
  {
    ruleKey: 'completion_before_pickup_hours',
    ruleName: 'Completion Buffer',
    ruleValue: '4',
    dataType: 'integer',
    description: 'Hours before pickup that cake must be completed'
  }
];
\`\`\`

#### **Day 3-5: Rules Validation Service**

\`\`\`typescript
// server/services/rulesEngine.ts

export class RulesEngine {
  private rules: Map<string, any> = new Map();
  
  async loadRules() {
    const dbRules = await db.select().from(businessRules);
    dbRules.forEach(rule => {
      this.rules.set(rule.ruleKey, this.parseValue(rule.ruleValue, rule.dataType));
    });
  }
  
  parseValue(value: string, dataType: string): any {
    switch (dataType) {
      case 'integer': return parseInt(value);
      case 'decimal': return parseFloat(value);
      case 'boolean': return value === 'true';
      case 'json': return JSON.parse(value);
      default: return value;
    }
  }
  
  get(ruleKey: string): any {
    return this.rules.get(ruleKey);
  }
  
  async validateOrder(orderData: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Rule 1: Deposit requirement
    const depositPercentage = this.get('deposit_percentage_required');
    if (orderData.depositAmount < orderData.totalAmount * (depositPercentage / 100)) {
      errors.push(`Deposit must be at least ${depositPercentage}% of total amount`);
    }
    
    // Rule 2: Advance notice
    const advanceNoticeDays = this.get('minimum_advance_notice_days');
    const daysBetween = this.getDaysBetween(new Date(), new Date(orderData.eventDate));
    if (daysBetween < advanceNoticeDays) {
      errors.push(`Orders must be placed ${advanceNoticeDays} days in advance`);
    }
    
    // Rule 3: Max fillings
    const maxFillings = this.get('max_fillings_per_layer');
    for (const layer of orderData.layers || []) {
      if (layer.fillings && layer.fillings.length > maxFillings) {
        errors.push(`Maximum ${maxFillings} fillings per layer allowed`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  getDaysBetween(date1: Date, date2: Date): number {
    const diff = date2.getTime() - date1.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

// Initialize
export const rulesEngine = new RulesEngine();
await rulesEngine.loadRules();
\`\`\`

**Use in Order Creation:**

\`\`\`typescript
// server/routes/orders.ts

router.post('/api/orders/custom', authMiddleware, async (req, res) => {
  // Validate against business rules
  const validation = await rulesEngine.validateOrder(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Order validation failed',
      details: validation.errors
    });
  }
  
  // Create order...
});
\`\`\`

---

## 🗓️ PHASE 2: INTEGRATIONS (WEEKS 4-6)

### **Week 4: Email Notification System**

#### **Install Dependencies:**

\`\`\`bash
npm install nodemailer
npm install --save-dev @types/nodemailer
\`\`\`

#### **Email Queue Table:**

\`\`\`typescript
// shared/schema.ts

export const emailQueue = pgTable('email_queue', {
  id: serial('id').primaryKey(),
  toEmail: varchar('to_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text'),
  status: varchar('status', { length: 20 }).default('pending'),
  sentAt: timestamp('sent_at'),
  errorMessage: text('error_message'),
  orderId: integer('order_id').references(() => orders.id),
  customerId: integer('customer_id').references(() => customers.id),
  templateKey: varchar('template_key', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
});
\`\`\`

#### **Email Service:**

\`\`\`typescript
// server/services/emailService.ts

import nodemailer from 'nodemailer';
import { db } from '../db';
import { emailQueue } from '../../shared/schema';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function queueEmail(data: {
  toEmail: string;
  subject: string;
  bodyHtml: string;
  orderId?: number;
  customerId?: number;
}) {
  await db.insert(emailQueue).values({
    ...data,
    status: 'pending'
  });
}

export async function processEmailQueue() {
  const pending = await db
    .select()
    .from(emailQueue)
    .where(eq(emailQueue.status, 'pending'))
    .limit(10);
  
  for (const email of pending) {
    try {
      await transporter.sendMail({
        from: 'Emily Bakes Cakes <noreply@emilybakes.com>',
        to: email.toEmail,
        subject: email.subject,
        html: email.bodyHtml,
        text: email.bodyText
      });
      
      await db
        .update(emailQueue)
        .set({ status: 'sent', sentAt: new Date() })
        .where(eq(emailQueue.id, email.id));
        
    } catch (error) {
      await db
        .update(emailQueue)
        .set({ 
          status: 'failed',
          errorMessage: error.message
        })
        .where(eq(emailQueue.id, email.id));
    }
  }
}

// Run every minute
setInterval(processEmailQueue, 60000);
\`\`\`

---

### **Week 5-6: Real-Time System (WebSockets)**

**Install Dependencies:**

\`\`\`bash
npm install socket.io
npm install --save-dev @types/socket.io
\`\`\`

**Implementation:**

\`\`\`typescript
// server/websocket.ts

import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function initializeWebSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5000',
      credentials: true
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join role-specific room
    socket.on('join_role', (role: string) => {
      socket.join(`role:${role}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  return io;
}

// Usage in order updates
export function broadcastOrderUpdate(io: Server, order: any) {
  // Notify all connected clients
  io.emit('order:updated', order);
  
  // Notify specific roles
  io.to('role:baker').emit('order:new_to_bake', order);
}
\`\`\`

---

## 🗓️ PHASE 3: TESTING & DOCUMENTATION (WEEKS 7-10)

### **Week 7-8: Automated Testing**

**Setup:**

\`\`\`bash
npm install vitest supertest
npm install --save-dev @types/supertest
\`\`\`

**Test Structure:**

\`\`\`typescript
// tests/integration/auth.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server';

describe('Authentication API', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'emily@emilybakes.com',
        password: 'demo123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.role).toBe('owner');
  });
  
  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'fake@email.com',
        password: 'wrong'
      });
    
    expect(response.status).toBe(401);
  });
});
\`\`\`

---

### **Week 9-10: Documentation & Deployment**

**OpenAPI/Swagger Documentation:**

\`\`\`bash
npm install swagger-jsdoc swagger-ui-express
\`\`\`

\`\`\`typescript
// server/swagger.ts

import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Emily Bakes Cakes API',
      version: '2.0.0',
      description: 'Backend API for bakery management system'
    },
    servers: [
      { url: 'http://localhost:8080', description: 'Development' }
    ]
  },
  apis: ['./server/routes/*.ts']
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
\`\`\`

---

## ✅ DELIVERABLES CHECKLIST

- [ ] Employee management system
- [ ] Product options database
- [ ] Customer enhancements
- [ ] JWT authentication
- [ ] Role-based access control
- [ ] Business rules engine
- [ ] Email notification system
- [ ] WebSocket real-time updates
- [ ] Automated test suite (80%+ coverage)
- [ ] API documentation (Swagger)
- [ ] Deployment scripts
- [ ] Performance optimization

---

**Prepared By:** Emily Bakes Cakes Development Team  
**Document Version:** 1.0  
**CIS 3343 Fall 2025**
