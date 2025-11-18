# Backend Modernization Proposal
## Emily Bakes Cakes - Enterprise-Grade API Architecture

---

## 📋 EXECUTIVE SUMMARY

**Project:** Backend Infrastructure Modernization  
**Version:** 2.0  
**Status:** Proposal  
**Prepared For:** CIS 3343 Fall 2025 - Emily Bakes Cakes  
**Prepared By:** Development Team  
**Date:** November 2025

### **Overview**

This proposal outlines a comprehensive plan to modernize the Emily Bakes Cakes backend infrastructure, transforming it from a functional prototype into an **enterprise-grade, scalable, role-based system** that supports multiple user interfaces, enforces business rules automatically, and provides real-time capabilities.

### **Current State Assessment**

**Strengths:**
- ✅ PostgreSQL database with Drizzle ORM (type-safe)
- ✅ Express.js REST API (22 endpoints)
- ✅ Basic CRUD operations functional
- ✅ Payment tracking implemented

**Critical Gaps:**
- ❌ No authentication/authorization system
- ❌ No role-based access control (RBAC)
- ❌ Business rules hardcoded in application
- ❌ Product options static in code files
- ❌ No employee management system
- ❌ No real-time notifications
- ❌ Limited input validation
- ❌ No automated testing suite

### **Proposed Improvements**

| Area | Current | Proposed | Impact |
|------|---------|----------|--------|
| **Authentication** | None | JWT + Session-based | HIGH |
| **Authorization** | None | Role-Based Access Control | HIGH |
| **Employee System** | N/A | Full CRUD + Assignment Logic | HIGH |
| **Product Options** | Hardcoded | Database-driven | HIGH |
| **Business Rules** | Code | Configurable Rules Engine | MEDIUM |
| **Real-Time** | None | WebSocket Server | MEDIUM |
| **Testing** | Manual | Automated Test Suite | HIGH |
| **Documentation** | Limited | OpenAPI/Swagger | MEDIUM |

### **Investment & ROI**

**Development Effort:** 8-10 weeks  
**Annual Operational Savings:** $24,300  
**Annual Revenue Increase:** $30,400  
**Total Annual Benefit:** $54,700  
**Payback Period:** 4-6 months

---

## 🎯 BUSINESS OBJECTIVES ALIGNMENT

### **Case Study Pain Points Addressed**

1. **Lost Orders ($4,800/year)**
   - Solution: Database persistence, automated workflows, audit trails
   - Impact: 80% reduction → $960/year

2. **Time Inefficiency (20 hrs/week)**
   - Solution: Role-based UIs, automated assignments, real-time updates
   - Impact: 25% reduction → 15 hrs/week (saves $6,500/year)

3. **Customer Retention (700 → 805)**
   - Solution: CRM system, email automation, order history
   - Impact: 15% increase → $8,400 additional revenue

4. **Staff Productivity**
   - Solution: Specialized interfaces for each role
   - Impact: 30% efficiency gain

---

## 🏗️ TECHNICAL ARCHITECTURE

### **High-Level System Architecture**

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React/TypeScript)              │
├─────────────┬──────────────┬──────────────┬────────────────────┤
│  Customer   │  Sales Staff │   Baker UI   │   Decorator UI     │
│  Website    │     UI       │              │                    │
├─────────────┼──────────────┼──────────────┼────────────────────┤
│  Manager    │  Accountant  │   Emily's    │   Admin Portal     │
│  Dashboard  │     UI       │   Dashboard  │                    │
└─────────────┴──────────────┴──────────────┴────────────────────┘
                              │
                         HTTP/REST + WebSockets
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    API GATEWAY LAYER                            │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Authentication Middleware (JWT Verification)          │   │
│  │  Authorization Middleware (Role-Based Permissions)     │   │
│  │  Rate Limiting & Request Validation                    │   │
│  │  Logging & Monitoring                                  │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌─────────────────┬──────────────────┬────────────────────┐  │
│  │  Auth Service   │  Order Service   │  Customer Service  │  │
│  │  - Login        │  - CRUD          │  - CRUD            │  │
│  │  - Logout       │  - Assignment    │  - Segmentation    │  │
│  │  - Permissions  │  - Workflow      │  - CRM             │  │
│  ├─────────────────┼──────────────────┼────────────────────┤  │
│  │ Employee Svc    │  Product Svc     │  Payment Service   │  │
│  │  - CRUD         │  - CRUD          │  - Deposit Track   │  │
│  │  - Assignment   │  - Options CRUD  │  - Stripe Integ.   │  │
│  ├─────────────────┼──────────────────┼────────────────────┤  │
│  │ Notification    │  Analytics Svc   │  Rules Engine      │  │
│  │  - Email Queue  │  - Reports       │  - Validation      │  │
│  │  - SMS Queue    │  - Dashboard     │  - Enforcement     │  │
│  └─────────────────┴──────────────────┴────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    DATA ACCESS LAYER                            │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Drizzle ORM (Type-Safe Query Builder)                 │   │
│  │  - Schema Definitions                                  │   │
│  │  - Migration Management                                │   │
│  │  - Connection Pooling                                  │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    DATABASE LAYER                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Neon)                                     │   │
│  │  - Customers, Orders, Products, Employees              │   │
│  │  - Product Options, Payments, Inquiries               │   │
│  │  - Business Rules, Email Queue, Notifications         │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌──────────────┬──────────────┬───────────────┬──────────┐   │
│  │  Stripe API  │  Twilio SMS  │  SendGrid     │  Redis   │   │
│  │  (Payments)  │  (Text Msg)  │  (Email)      │ (Cache)  │   │
│  └──────────────┴──────────────┴───────────────┴──────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 📦 DATABASE SCHEMA ENHANCEMENTS

### **New Tables to Add**

#### **1. Employees Table** (Critical Priority)

\`\`\`typescript
employees: {
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
  specialties: text('specialties').array(), // ["Wedding cakes", "Fondant work"]
  maxOrdersPerDay: integer('max_orders_per_day').default(5),
  hourlyRate: integer('hourly_rate'), // for cost tracking (in cents)
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}
\`\`\`

#### **2. Product Options Table** (High Priority)

\`\`\`typescript
product_options: {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  optionType: varchar('option_type', { length: 50 }).notNull(), // 'flavor', 'filling', 'icing_flavor', 'icing_color', 'decoration'
  extraCost: integer('extra_cost').default(0), // in cents
  isActive: boolean('is_active').default(true),
  isAvailable: boolean('is_available').default(true), // seasonal toggle
  displayOrder: integer('display_order').default(0),
  description: text('description'),
  allergenInfo: varchar('allergen_info', { length: 255 }), // "Contains nuts"
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}
\`\`\`

#### **3. Employee Assignments Table**

\`\`\`typescript
employee_assignments: {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'sales_rep', 'baker', 'decorator', 'approver'
  assignedAt: timestamp('assigned_at').defaultNow(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  hoursSpent: decimal('hours_spent', { precision: 5, scale: 2 }),
  notes: text('notes')
}
\`\`\`

#### **4. Business Rules Configuration**

\`\`\`typescript
business_rules: {
  id: serial('id').primaryKey(),
  ruleKey: varchar('rule_key', { length: 100 }).notNull().unique(),
  ruleName: varchar('rule_name', { length: 200 }).notNull(),
  ruleValue: varchar('rule_value', { length: 500 }).notNull(), // JSON for complex rules
  dataType: varchar('data_type', { length: 20 }).notNull(), // 'integer', 'decimal', 'boolean', 'json'
  description: text('description'),
  isActive: boolean('is_active').default(true),
  lastModifiedBy: integer('last_modified_by').references(() => employees.id),
  updatedAt: timestamp('updated_at').defaultNow()
}
\`\`\`

#### **5. Email Queue Table**

\`\`\`typescript
email_queue: {
  id: serial('id').primaryKey(),
  toEmail: varchar('to_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text'),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'sent', 'failed'
  sentAt: timestamp('sent_at'),
  errorMessage: text('error_message'),
  orderId: integer('order_id').references(() => orders.id),
  customerId: integer('customer_id').references(() => customers.id),
  templateKey: varchar('template_key', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
}
\`\`\`

#### **6. Audit Log Table**

\`\`\`typescript
audit_log: {
  id: serial('id').primaryKey(),
  tableName: varchar('table_name', { length: 50 }).notNull(),
  recordId: integer('record_id').notNull(),
  action: varchar('action', { length: 20 }).notNull(), // 'create', 'update', 'delete'
  changes: jsonb('changes'), // { field: { old: ..., new: ... } }
  performedBy: integer('performed_by').references(() => employees.id),
  performedAt: timestamp('performed_at').defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 255 })
}
\`\`\`

### **Schema Updates to Existing Tables**

#### **Customers Table Enhancements**

\`\`\`typescript
// ADD these fields to existing customers table:
customerType: varchar('customer_type', { length: 20 }).default('retail'), // 'retail' | 'corporate'
companyName: varchar('company_name', { length: 255 }),
addressLine1: varchar('address_line1', { length: 100 }),
addressLine2: varchar('address_line2', { length: 100 }),
city: varchar('city', { length: 60 }),
state: varchar('state', { length: 50 }),
zipCode: varchar('zip_code', { length: 10 }),
taxId: varchar('tax_id', { length: 50 })
\`\`\`

#### **Orders Table Enhancements**

\`\`\`typescript
// ADD these fields to existing orders table:
salesStaffId: integer('sales_staff_id').references(() => employees.id),
lastEmployeeId: integer('last_employee_id').references(() => employees.id),
finalApprovalId: integer('final_approval_id').references(() => employees.id),
approvedAt: timestamp('approved_at'),
isRushOrder: boolean('is_rush_order').default(false),
completionDeadline: timestamp('completion_deadline') // eventDate - 4 hours
\`\`\`

---

## 🔐 AUTHENTICATION & AUTHORIZATION SYSTEM

### **Authentication Strategy: JWT + Session Hybrid**

**Approach:** Use JSON Web Tokens (JWT) for stateless authentication with optional session storage for enhanced security.

#### **JWT Structure**

\`\`\`typescript
interface JWTPayload {
  userId: number;
  email: string;
  role: string; // 'owner', 'manager', 'sales', 'baker', 'decorator', 'accountant'
  permissions: string[]; // ['orders:read', 'orders:write', 'customers:read']
  iat: number; // issued at
  exp: number; // expiration (24 hours)
}
\`\`\`

#### **Authentication Flow**

\`\`\`typescript
// 1. Login
POST /api/auth/login
{
  "email": "james@emilybakes.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "james@emilybakes.com",
    "firstName": "James",
    "lastName": "Manager",
    "role": "manager"
  }
}

// 2. Protected Request
GET /api/orders
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// 3. Logout
POST /api/auth/logout
\`\`\`

### **Role-Based Permissions Matrix**

| Permission | Owner | Manager | Sales | Baker | Decorator | Accountant |
|-----------|-------|---------|-------|-------|-----------|------------|
| **Customers** |
| View Customers | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Create Customer | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Customer | ✅ | ✅ | 🟡 (own) | ❌ | ❌ | ❌ |
| Delete Customer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Orders** |
| View All Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Order | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Order | ✅ | ✅ | 🟡 (pending) | 🟡 (baking) | 🟡 (decorating) | ❌ |
| Cancel Order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Products** |
| View Products | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Products | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Options | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Payments** |
| View Payments | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Record Payment | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Process Refund | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Employees** |
| View Employees | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Employees | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Reports** |
| View Reports | ✅ | ✅ | 🟡 (limited) | ❌ | ❌ | ✅ |
| Export Data | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Settings** |
| Business Rules | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| System Config | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ Full Access
- 🟡 Limited Access (conditions apply)
- ❌ No Access

---

## 🔌 API ENHANCEMENTS

### **New API Endpoints (33 Additional)**

#### **Authentication Endpoints**

\`\`\`typescript
POST   /api/auth/register           // Create employee account (Owner/Manager only)
POST   /api/auth/login              // Login with email/password
POST   /api/auth/logout             // Logout and invalidate token
GET    /api/auth/me                 // Get current user info
POST   /api/auth/refresh            // Refresh JWT token
POST   /api/auth/forgot-password    // Request password reset
POST   /api/auth/reset-password     // Reset password with token
\`\`\`

#### **Employee Endpoints**

\`\`\`typescript
GET    /api/employees               // List all employees
GET    /api/employees/:id           // Get employee details
POST   /api/employees               // Create employee (Owner/Manager)
PATCH  /api/employees/:id           // Update employee
DELETE /api/employees/:id           // Deactivate employee
GET    /api/employees/:id/orders    // Get employee's assigned orders
GET    /api/employees/:id/stats     // Employee productivity stats
\`\`\`

#### **Employee Assignment Endpoints**

\`\`\`typescript
GET    /api/assignments                    // List all assignments
POST   /api/assignments                    // Assign employee to order
PATCH  /api/assignments/:id/start          // Mark work started
PATCH  /api/assignments/:id/complete       // Mark work completed
DELETE /api/assignments/:id                // Remove assignment
GET    /api/assignments/workload           // Get workload by employee
\`\`\`

#### **Product Options Endpoints**

\`\`\`typescript
GET    /api/options                 // Get all options (filterable by type)
GET    /api/options/:id             // Get option details
POST   /api/options                 // Create option (Manager only)
PATCH  /api/options/:id             // Update option
DELETE /api/options/:id             // Deactivate option
PATCH  /api/options/:id/toggle      // Toggle seasonal availability
POST   /api/options/reorder         // Reorder display sequence
\`\`\`

#### **Business Rules Endpoints**

\`\`\`typescript
GET    /api/rules                   // List all business rules
GET    /api/rules/:key              // Get rule by key
PATCH  /api/rules/:key              // Update rule value (Owner/Manager)
GET    /api/rules/validate          // Validate rule changes
\`\`\`

#### **Email & Notification Endpoints**

\`\`\`typescript
GET    /api/emails/queue            // View email queue
POST   /api/emails/send             // Send immediate email
GET    /api/emails/:id              // Get email details
POST   /api/emails/test             // Send test email
\`\`\`

#### **Analytics & Reporting Endpoints**

\`\`\`typescript
GET    /api/analytics/dashboard     // Dashboard metrics
GET    /api/analytics/revenue       // Revenue analytics
GET    /api/analytics/orders        // Order analytics
GET    /api/analytics/employees     // Employee productivity
GET    /api/analytics/customers     // Customer insights
POST   /api/analytics/custom        // Custom report query
\`\`\`

#### **Audit Log Endpoints**

\`\`\`typescript
GET    /api/audit                   // Get audit logs (filterable)
GET    /api/audit/:id               // Get specific audit entry
\`\`\`

### **Enhanced Existing Endpoints**

\`\`\`typescript
// All endpoints now include:
// - Authentication required (except public pages)
// - Permission checking based on role
// - Input validation with detailed error messages
// - Audit logging for write operations
// - Standardized error responses

// Example enhanced endpoint
PATCH  /api/orders/:id
// Now checks:
// 1. Is user authenticated?
// 2. Does user have 'orders:update' permission?
// 3. If baker, can only update status to 'preparing'/'baking_complete'
// 4. If decorator, can only update status to 'decorating'/'decorating_complete'
// 5. Validates business rules (e.g., can't cancel after baking started)
// 6. Logs change to audit_log table
\`\`\`

---

## ⚙️ BUSINESS RULES ENGINE

### **Configurable Rules System**

**Goal:** Move business logic from code into database configuration, allowing managers to adjust rules without developer intervention.

#### **Default Business Rules Configuration**

\`\`\`json
{
  "deposit_percentage_required": {
    "value": 50,
    "dataType": "integer",
    "description": "Minimum deposit percentage for custom orders",
    "validation": "min: 0, max: 100"
  },
  "minimum_advance_notice_days": {
    "value": 2,
    "dataType": "integer",
    "description": "Days in advance for custom cake orders",
    "validation": "min: 0, max: 30"
  },
  "max_fillings_per_layer": {
    "value": 2,
    "dataType": "integer",
    "description": "Maximum fillings allowed per cake layer",
    "validation": "min: 0, max: 5"
  },
  "completion_before_pickup_hours": {
    "value": 4,
    "dataType": "integer",
    "description": "Hours before pickup that cake must be completed",
    "validation": "min: 0, max: 48"
  },
  "preferred_customer_discount_percentage": {
    "value": 10,
    "dataType": "integer",
    "description": "Discount for preferred/VIP customers",
    "validation": "min: 0, max: 50"
  },
  "max_inspiration_images": {
    "value": 5,
    "dataType": "integer",
    "description": "Maximum inspiration images per order",
    "validation": "min: 0, max: 10"
  },
  "vip_order_count_threshold": {
    "value": 5,
    "dataType": "integer",
    "description": "Orders needed to become VIP customer",
    "validation": "min: 1, max: 100"
  },
  "cancellation_allowed_until_status": {
    "value": "preparing",
    "dataType": "string",
    "description": "Latest status at which orders can be cancelled",
    "validation": "enum: pending,preparing,baking,decorating"
  }
}
\`\`\`

#### **Rules Validation Service**

\`\`\`typescript
// server/services/rulesEngine.ts

export class RulesEngine {
  async validateOrder(orderData: any): Promise<ValidationResult> {
    const rules = await this.loadRules();
    const errors: string[] = [];
    
    // Check deposit requirement
    if (orderData.depositAmount < orderData.totalAmount * (rules.deposit_percentage_required / 100)) {
      errors.push(`Deposit must be at least ${rules.deposit_percentage_required}% of total amount`);
    }
    
    // Check advance notice
    const daysDifference = this.getDaysBetween(new Date(), orderData.eventDate);
    if (daysDifference < rules.minimum_advance_notice_days) {
      errors.push(`Orders must be placed ${rules.minimum_advance_notice_days} days in advance`);
    }
    
    // Check fillings per layer
    for (const layer of orderData.layers) {
      if (layer.fillings.length > rules.max_fillings_per_layer) {
        errors.push(`Maximum ${rules.max_fillings_per_layer} fillings per layer`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
\`\`\`

---

## 🧪 AUTOMATED TESTING STRATEGY

### **Testing Pyramid**

\`\`\`
                    ▲
                   / \
                  /   \
                 / E2E \        (10%) - End-to-end tests
                /       \
               /---------\
              /           \
             / Integration \    (30%) - API integration tests
            /               \
           /-----------------\
          /                   \
         /    Unit Tests       \  (60%) - Function-level tests
        /_______________________\
\`\`\`

### **Test Suite Structure**

\`\`\`
tests/
├── unit/
│   ├── services/
│   │   ├── auth.test.ts
│   │   ├── orderService.test.ts
│   │   ├── rulesEngine.test.ts
│   │   └── pricing.test.ts
│   ├── utils/
│   │   ├── validation.test.ts
│   │   └── permissions.test.ts
│   └── middleware/
│       ├── auth.test.ts
│       └── errorHandler.test.ts
├── integration/
│   ├── api/
│   │   ├── orders.test.ts
│   │   ├── customers.test.ts
│   │   ├── employees.test.ts
│   │   └── auth.test.ts
│   └── database/
│       ├── migrations.test.ts
│       └── transactions.test.ts
└── e2e/
    ├── orderFlow.test.ts
    ├── employeeWorkflow.test.ts
    └── adminOperations.test.ts
\`\`\`

### **Sample Test Cases**

\`\`\`typescript
// tests/integration/api/orders.test.ts

describe('Order API - Role-Based Access', () => {
  it('should allow sales staff to create orders', async () => {
    const token = await loginAs('sales');
    const response = await request(app)
      .post('/api/orders/custom')
      .set('Authorization', `Bearer ${token}`)
      .send(validOrderData);
    
    expect(response.status).toBe(201);
  });
  
  it('should prevent bakers from creating orders', async () => {
    const token = await loginAs('baker');
    const response = await request(app)
      .post('/api/orders/custom')
      .set('Authorization', `Bearer ${token}`)
      .send(validOrderData);
    
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Insufficient permissions');
  });
  
  it('should enforce 50% deposit rule', async () => {
    const token = await loginAs('sales');
    const invalidOrder = {
      ...validOrderData,
      totalAmount: 10000, // $100
      depositAmount: 3000  // $30 (less than 50%)
    };
    
    const response = await request(app)
      .post('/api/orders/custom')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidOrder);
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('at least 50%');
  });
});
\`\`\`

---

## 📊 IMPLEMENTATION TIMELINE

### **Phase 1: Foundation (Weeks 1-3)**

**Deliverables:**
- ✅ Employee management system (table + CRUD)
- ✅ Authentication system (JWT)
- ✅ Authorization middleware (RBAC)
- ✅ Product options migration to database
- ✅ Enhanced schema with relationships

**Estimated Effort:** 120 hours

### **Phase 2: Business Logic (Weeks 4-5)**

**Deliverables:**
- ✅ Business rules engine
- ✅ Rules configuration UI
- ✅ Automated validation
- ✅ Employee assignment system
- ✅ Workflow state machine

**Estimated Effort:** 80 hours

### **Phase 3: Integration & Real-Time (Weeks 6-7)**

**Deliverables:**
- ✅ Email notification system
- ✅ SMS integration (Twilio)
- ✅ WebSocket server (real-time updates)
- ✅ Payment gateway (Stripe)
- ✅ Audit logging

**Estimated Effort:** 80 hours

### **Phase 4: Testing & Documentation (Weeks 8-10)**

**Deliverables:**
- ✅ Automated test suite (100+ tests)
- ✅ OpenAPI/Swagger documentation
- ✅ Performance optimization
- ✅ Security hardening
- ✅ Deployment automation

**Estimated Effort:** 120 hours

**Total Effort:** 400 hours (10 weeks @ 40 hours/week)

---

## 🚀 DEPLOYMENT STRATEGY

### **Continuous Integration/Deployment (CI/CD)**

\`\`\`yaml
# .github/workflows/backend-deploy.yml

name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
      - run: npm run lint
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: npm run db:push
      - run: npm run deploy
\`\`\`

---

## 💰 COST-BENEFIT ANALYSIS

### **Development Investment**

| Resource | Hours | Rate | Cost |
|----------|-------|------|------|
| Senior Developer | 200 | $75/hr | $15,000 |
| Mid-Level Developer | 150 | $50/hr | $7,500 |
| QA Engineer | 50 | $40/hr | $2,000 |
| **Total** | **400** | - | **$24,500** |

### **Annual Operational Savings**

| Benefit | Annual Value |
|---------|--------------|
| Reduced order time (5 hrs/week @ $25/hr) | $6,500 |
| Lost order prevention (80% of $4,800) | $3,840 |
| Automation efficiency (10 hrs/week @ $25/hr) | $13,000 |
| **Total Savings** | **$23,340** |

### **Annual Revenue Increase**

| Benefit | Annual Value |
|---------|--------------|
| Customer retention (+15%) | $8,400 |
| Online payment convenience (+10% conversion) | $12,000 |
| Corporate accounts (5 clients @ $2,000) | $10,000 |
| **Total Revenue** | **$30,400** |

### **ROI Calculation**

\`\`\`
Total Annual Benefit = Savings + Revenue
                     = $23,340 + $30,400
                     = $53,740

ROI = (Benefit - Investment) / Investment
    = ($53,740 - $24,500) / $24,500
    = 119%

Payback Period = Investment / Annual Benefit
               = $24,500 / $53,740
               = 0.46 years (5.5 months)
\`\`\`

---

## 🎯 SUCCESS METRICS

### **Technical KPIs**

- ✅ API response time < 200ms (95th percentile)
- ✅ Database query time < 50ms average
- ✅ Test coverage > 80%
- ✅ Zero critical security vulnerabilities
- ✅ 99.5% uptime

### **Business KPIs**

- ✅ Order creation time reduced by 25%
- ✅ Lost orders reduced by 80%
- ✅ Customer retention increased by 15%
- ✅ Employee productivity increased by 30%

---

## ✅ RECOMMENDATION

**Approve backend modernization project with phased implementation approach.**

**Justification:**
1. Strong ROI (119%) with 5.5 month payback
2. Addresses all critical business pain points
3. Enables role-based interfaces (Phase 2 requirement)
4. Provides foundation for future enhancements
5. Aligns with case study academic requirements

**Next Steps:**
1. Review and approve proposal
2. Allocate development resources
3. Begin Phase 1 implementation
4. Establish weekly progress reviews

---

**Document Version:** 1.0  
**Approval Status:** Pending  
**Review Deadline:** 2 weeks from submission  
**Questions/Clarifications:** Contact development team

---

**Prepared By:** Emily Bakes Cakes Development Team  
**CIS 3343 Fall 2025**
