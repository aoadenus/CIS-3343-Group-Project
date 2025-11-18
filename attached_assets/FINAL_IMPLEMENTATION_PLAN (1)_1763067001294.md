# 🎯 EMILY BAKES CAKES - FINAL IMPLEMENTATION PLAN
## Single Source of Truth - CIS 3343 Case Study Compliance

**Created:** November 13, 2025  
**Updated:** November 13, 2025 (Architecture clarified to pure staff-only)  
**Status:** ✅ AUTHORITATIVE - All other documents superseded  
**Deadline:** Saturday, November 15, 2025 (Prefinal Draft)  
**Architecture:** Pure Staff-Only System (NO customer e-commerce)

---

## 📑 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [What Already Exists](#what-already-exists)
3. [What Must Be Added](#what-must-be-added)
4. [Complete Page Inventory](#complete-page-inventory)
5. [Role-Based Permissions](#role-based-permissions)
6. [Database Schema](#database-schema)
7. [6 Required Client Reports](#6-required-client-reports)
8. [Technical Stack](#technical-stack)
9. [Implementation Checklist](#implementation-checklist)
10. [Demo Credentials](#demo-credentials)

---

## 1. EXECUTIVE SUMMARY

### Project Scope
"Emily Bakes Cakes" is a **pure staff-only internal order management system** for CIS 3343 case study:
- **Public marketing website** (NO customer e-commerce - marketing/awareness only)
- **Staff-only order management portal** (ALL orders entered by staff)
- **Public order tracking** (auto-cycling demo page)
- **Email notifications** (Resend integration)

### Key Architecture Decision
**Pure staff-only system** - customers CANNOT order online. This approach:
- ✅ Meets case study requirement: staff enter ALL orders
- ✅ Public pages serve marketing/awareness purposes only
- ✅ Customers call, email, or visit in person to place orders
- ✅ Staff portal handles complete order lifecycle

### Critical Business Rule (Case Study)
> "Bakers and Decorators, if not busy, can also serve as sales staff."

**Meaning:** Baker and Decorator roles have **FULL Sales permissions** + their specialized functions.

---

## 2. WHAT ALREADY EXISTS ✅

### Public Website (5 pages - MARKETING ONLY)

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Home | `/` | ⚠️ Needs CTA fixes | Hero with invalid "Start Building" buttons |
| Shop | `/shop` | ⚠️ Needs restructure | Must remove inquiry forms, convert to inspiration only |
| Gallery | `/gallery` | ⚠️ Needs CTA fixes | Remove "Start Custom Builder" button |
| About | `/about` | ✅ Complete | Parisian-themed story page |
| Contact | `/contact` | ⚠️ Needs enhancement | Add Google Maps, ordering workflow, remove Builder references |

**CRITICAL:** Public pages must have ALL customer ordering CTAs removed. Customers call/email/visit to order.

### Staff Portal (11 pages - BUILT, JWT auth completed)

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Login | `/admin/login` | ✅ Complete | JWT auth with 6 demo staff accounts |
| **5 Dashboards** | `/admin/analytics-dashboard` | ✅ Complete | Role-based (Sales, Baker, Decorator, Accountant, Manager) |
| OrderBoard | `/admin/fulfillment-board` | ✅ Complete | Kanban drag-and-drop |
| OrderList | `/admin/order-management` | ✅ Complete | Table view with filtering |
| OrderCreate | `/admin/order-create` | ✅ Complete | Manual order form (staff enter ALL orders) |
| Inquiries | `/admin/inquiry-management` | ✅ Complete | Customer inquiry management |
| Products | `/admin/inventory-management` | ✅ Complete | Product CRUD |
| Customers | `/admin/customer-accounts` | ✅ Complete | Customer CRUD with search |
| Reports | `/admin/business-intelligence` | ⚠️ In Progress | Needs 6 specific reports with Recharts |
| Settings | `/admin/system-configuration` | ✅ Complete | System config |
| **Tracking** | `/track/:token` | ✅ Complete | Public tracking with 11-stage auto-cycling (2-min loop) |

### Database (Drizzle ORM - WORKING)

**Existing Tables:**
- ✅ `products` - Full product catalog
- ✅ `customers` - Customer records with VIP status
- ✅ `orders` - Orders with JSON layers field, tracking_token, assigned staff
- ✅ `employees` - Staff with roles, passwords, JWT auth
- ✅ `order_status_history` - Status change tracking
- ✅ `inquiries` - Customer inquiries (NOT orders)
- ✅ `contact_messages` - Contact form submissions
- ✅ `payments` - Payment tracking

### Tech Stack (WORKING)
- ✅ React 18.3.1 + TypeScript
- ✅ Vite 6.3.5
- ✅ Drizzle ORM (PostgreSQL)
- ✅ Express backend
- ✅ Recharts (analytics working)
- ✅ Tailwind CSS 4.1
- ✅ Radix UI components
- ✅ Motion (Framer Motion)

---

## 3. WHAT MUST BE ADDED 🆕

### Remaining Tasks for Case Study Compliance

#### A. ✅ COMPLETED
1. ✅ **`employees` table** - Staff with roles, JWT auth (6 demo accounts)
2. ✅ **Order tracking tokens** - `tracking_token` field added to orders
3. ✅ **Order status history** - Tracking table with timestamps
4. ✅ **Public Tracking Page** (`/track/:token`) - Auto-cycling demo (11 stages, 2-min loop)
5. ✅ **JWT Authentication** - Login, token validation, protected routes
6. ✅ **5 Role-Based Dashboards** - Sales, Baker (+ Sales tab), Decorator (+ Sales tab), Accountant, Manager

#### B. ⚠️ IN PROGRESS
1. **6 Client Reports** - Order Summary, Customer List, Revenue, Pending Orders, Completed Orders, Product Inventory
2. **Critical UI Fixes** - Remove all customer ordering CTAs from public pages

#### C. 🔜 PENDING
1. **Email Notifications** - Resend integration for order tracking
2. **Google Maps** - Contact page embed
3. **Final Testing** - All role permissions, workflows, mobile responsiveness

#### E. Six Client Reports (with Recharts)
1. Order Summary Report
2. Customer List Report
3. Revenue Report (Accountant/Manager only)
4. Pending Orders Report
5. Completed Orders Report
6. Product Inventory Report (Manager only)

#### F. Email Service
- Resend integration
- Order creation notification
- Tracking link in email

#### G. Google Maps Integration
- Embed map in Contact page (no API key needed)

---

## 4. COMPLETE PAGE INVENTORY

### Final Page Count: **16 Pages Total** (Pure Staff-Only System)

#### PUBLIC MARKETING WEBSITE (5 pages - NO customer ordering)
1. Home - `/` ⚠️ (remove "Start Building" CTAs)
2. Shop - `/shop` ⚠️ (convert to inspiration-only, remove inquiry forms)
3. Gallery - `/gallery` ⚠️ (remove "Start Custom Builder" button)
4. About - `/about` ✅ (complete)
5. Contact - `/contact` ⚠️ (add Google Maps, ordering workflow)

**CRITICAL:** All public pages must emphasize phone/email/visit ordering only. NO customer online ordering capability.

#### PUBLIC TRACKING (1 page)
6. **Track Order** - `/track/:token` ✅ (auto-cycling 11 stages, 2-min loop)

#### STAFF PORTAL (10 pages - JWT authenticated)
7. **Staff Login** - `/admin/login` ✅ (JWT complete)
8. **Role-Based Dashboards** - `/admin/analytics-dashboard` ✅ (ONE page with 5 role views)
   - Sales Dashboard (role: sales)
   - Baker Dashboard (role: baker + Sales tab)
   - Decorator Dashboard (role: decorator + Sales tab)
   - Accountant Dashboard (role: accountant)
   - Manager Dashboard (role: manager/owner)
9. Fulfillment Board - `/admin/fulfillment-board` ✅ (Kanban)
10. Orders List - `/admin/order-management` ✅ (table with filters)
11. Order Create - `/admin/order-create` ✅ (staff enter ALL orders)
12. Customers - `/admin/customer-accounts` ✅ (CRM)
13. Products - `/admin/inventory-management` ✅ (product CRUD)
14. Reports - `/admin/business-intelligence` ⚠️ (needs 6 reports with Recharts)
15. Inquiries - `/admin/inquiry-management` ✅ (from public contact forms)
16. Settings - `/admin/system-configuration` ✅ (system config)

---

## 5. ROLE-BASED PERMISSIONS

### Permission Matrix

| Permission | Sales | Baker | Decorator | Accountant | Manager |
|-----------|-------|-------|-----------|------------|---------|
| **ORDERS** |
| Create orders | ✅ | ✅ | ✅ | ❌ | ✅ |
| View all orders | ✅ | ✅ | ✅ | ✅ (read) | ✅ |
| Edit orders | ✅ | ✅ | ✅ | ❌ | ✅ |
| Update status (own area) | Limited | ✅ Baking | ✅ Decorating | ❌ | ✅ All |
| Cancel orders | ❌ | ❌ | ❌ | ❌ | ✅ |
| Assign to staff | ❌ | ❌ | ❌ | ❌ | ✅ |
| **CUSTOMERS** |
| View all | ✅ | ✅ | ✅ | ✅ (read) | ✅ |
| Add/edit | ✅ | ✅ | ✅ | ❌ | ✅ |
| Mark VIP | ❌ | ❌ | ❌ | ❌ | ✅ |
| **PRODUCTS** |
| View | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit | ❌ | ❌ | ❌ | ❌ | ✅ |
| **FINANCIAL** |
| View revenue/KPIs | ❌ | ❌ | ❌ | ✅ | ✅ |
| Update payments | ❌ | ❌ | ❌ | ✅ | ✅ |
| **REPORTS** |
| Order Summary | ✅ | ✅ | ✅ | ❌ | ✅ |
| Customer List | ✅ | ✅ | ✅ | ❌ | ✅ |
| Revenue Report | ❌ | ❌ | ❌ | ✅ | ✅ |
| Pending Orders | ✅ | ✅ | ✅ | ❌ | ✅ |
| Completed Orders | ❌ | ✅ | ✅ | ❌ | ✅ |
| Product Inventory | ❌ | ❌ | ❌ | ❌ | ✅ |

### Dashboard Features by Role

#### **Sales Dashboard**
- Quick action: Create new order
- Today's pickups (5-item list)
- Pending customer follow-ups
- Recent orders (all orders for coordination)
- Recent customers

#### **Baker Dashboard** ⚠️ CRITICAL
- **My Baking Queue** (top priority - orders assigned to them)
- **FULL SALES ACCESS** when not busy:
  - Create orders
  - Manage customers
  - View all orders
- Layer-by-layer progress tracking
- Tomorrow's schedule preview

#### **Decorator Dashboard** ⚠️ CRITICAL
- **My Decoration Queue** (orders ready for decoration)
- **FULL SALES ACCESS** when not busy:
  - Create orders
  - Manage customers
  - View all orders
- Customer photo references
- Design gallery

#### **Accountant Dashboard**
- Financial KPIs (revenue, deposits, outstanding)
- Revenue trend chart (Recharts line)
- Outstanding balances tracker
- Access to all 6 reports
- Payment status updates

#### **Manager Dashboard**
- Complete system overview
- All KPIs + charts
- Staff performance tracking
- Order pipeline (Kanban view)
- Full CRUD on all entities

---

## 6. DATABASE SCHEMA

### New Table: `employees`

\`\`\`typescript
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
\`\`\`

### Updated Table: `orders` (add tracking)

\`\`\`typescript
// Add these fields to existing orders table:
trackingToken: varchar('tracking_token', { length: 50 }).unique(),
assignedBaker: integer('assigned_baker').references(() => employees.id),
assignedDecorator: integer('assigned_decorator').references(() => employees.id),
\`\`\`

### New Table: `order_status_history`

\`\`\`typescript
export const orderStatusHistory = pgTable('order_status_history', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  oldStatus: varchar('old_status', { length: 50 }),
  newStatus: varchar('new_status', { length: 50 }).notNull(),
  updatedBy: integer('updated_by').references(() => employees.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
\`\`\`

---

## 7. SIX REQUIRED CLIENT REPORTS

### Report 1: Order Summary Report
**Access:** Sales, Baker, Decorator, Manager  
**Route:** `/staff/reports/order-summary`

**Features:**
- Date range picker (default: today)
- Filter by status, assigned staff
- Table: Order#, Customer, Product, Pickup, Status, Price, Deposit, Balance
- **Chart:** Bar chart - Order volume by day (Recharts)
- Export: CSV, PDF
- Totals row

**Implementation:**
\`\`\`typescript
// Use existing Recharts infrastructure
<BarChart data={ordersByDay}>
  <Bar dataKey="count" fill="#C44569" />
</BarChart>
\`\`\`

---

### Report 2: Customer List Report
**Access:** Sales, Baker, Decorator, Manager  
**Route:** `/staff/reports/customer-list`

**Features:**
- Columns: Name, Email, Phone, Type, Total Orders, Total Spent
- Filters: Type (Retail/Corporate), spending range, VIP only
- **Chart:** Line chart - Customer acquisition over time (Recharts)
- Export: Email list, Phone list, Full CSV, PDF

---

### Report 3: Revenue Report ⭐
**Access:** Accountant, Manager ONLY  
**Route:** `/staff/reports/revenue`

**Features:**
- Time periods: Day / Week / Month / Custom
- KPI cards: Total Revenue, Deposits, Outstanding, Collection Rate
- **3 Charts (Recharts):**
  1. Revenue trend (line chart)
  2. Revenue by product type (pie chart)
  3. Monthly comparison (bar chart)
- Breakdown by cake size, order type, payment method
- Export: CSV, PDF, Excel

---

### Report 4: Pending Orders Report
**Access:** Sales, Baker, Decorator, Manager  
**Route:** `/staff/reports/pending-orders`

**Features:**
- Statuses: Quote, Pending, Confirmed, In Production
- Columns: Order#, Customer, Pickup Date, Days Until Due, Staff, Status
- **Chart:** Funnel chart - Orders by status (Recharts)
- Color coding: 🟢 Green (>2 days), 🟡 Yellow (24-48h), 🔴 Red (<24h)

---

### Report 5: Completed Orders Report
**Access:** Baker, Decorator, Manager  
**Route:** `/staff/reports/completed-orders`

**Features:**
- Columns: Completion Date, Customer, Baker, Decorator, Days to Complete, Rating, Price
- **Chart:** Bar chart - Avg completion time by order type (Recharts)
- Filters: Date range, staff, satisfaction rating

---

### Report 6: Product Inventory Report
**Access:** Manager ONLY  
**Route:** `/staff/reports/product-inventory`

**Features:**
- Columns: Product, Category, Price, Times Ordered, Revenue, Trending
- **Chart:** Horizontal bar chart - Top 10 products by revenue (Recharts)
- Filters: Category, popularity, date range

---

## 8. TECHNICAL STACK

### Confirmed Technologies (Keep Existing)
- ✅ **Frontend:** React 18.3.1 + TypeScript
- ✅ **Build Tool:** Vite 6.3.5
- ✅ **Styling:** Tailwind CSS 4.1
- ✅ **UI Components:** Radix UI
- ✅ **Animation:** Motion (Framer Motion)
- ✅ **Charts:** Recharts
- ✅ **Forms:** React Hook Form
- ✅ **Icons:** Lucide React
- ✅ **Toast:** Sonner
- ✅ **Backend:** Node.js + Express (TypeScript)
- ✅ **Database:** PostgreSQL (Replit Neon)
- ✅ **ORM:** Drizzle ORM

### New Integrations (Add)
- 🆕 **Authentication:** jsonwebtoken + bcryptjs
- 🆕 **Email Service:** Resend (simple, no SMTP)
- 🆕 **Maps:** Google Maps embed (no API key)

### Configuration
- Port: 5000 (frontend + backend proxy)
- Host: 0.0.0.0 (Replit requirement)
- CORS: Enabled for all origins

---

## 9. IMPLEMENTATION CHECKLIST

### Phase 1: Database & Auth (Tasks 1-3)
- [ ] Add `employees` table to schema
- [ ] Add `order_status_history` table
- [ ] Update `orders` table (add tracking_token, assigned_baker, assigned_decorator)
- [ ] Seed 6 demo staff accounts
- [ ] Implement JWT authentication (login endpoint)
- [ ] Create auth middleware for protected routes

### Phase 2: Public Tracking Page (Task 2)
- [ ] Create `/track/:token` route
- [ ] Build TrackingPage component with 11-stage auto-cycling
- [ ] Implement 2-minute interval timer
- [ ] Add progress bar and status timeline UI
- [ ] Make mobile-responsive

**11 Tracking Stages (2-min cycle, loops forever):**
1. Order Placed
2. Design Approved
3. Pending Baking
4. Baking in Progress
5. Cooling
6. Ready for Decorating
7. Decorating
8. Decorated Complete
9. Quality Check
10. Ready for Pickup
11. Picked Up → loops back to #1

### Phase 3: Role-Based Dashboards (Tasks 4-5)
- [ ] Create SalesDashboard component
- [ ] Create BakerDashboard component (with Sales access)
- [ ] Create DecoratorDashboard component (with Sales access)
- [ ] Create AccountantDashboard component
- [ ] Create ManagerDashboard component
- [ ] Implement role-based navigation menus
- [ ] Add role-based permission checks

### Phase 4: Six Client Reports (Task 6)
- [ ] Report 1: Order Summary (with bar chart)
- [ ] Report 2: Customer List (with line chart)
- [ ] Report 3: Revenue Report (with 3 charts)
- [ ] Report 4: Pending Orders (with funnel chart)
- [ ] Report 5: Completed Orders (with bar chart)
- [ ] Report 6: Product Inventory (with horizontal bar chart)
- [ ] Add CSV/PDF export functionality

### Phase 5: Email Integration (Task 7)
- [ ] Set up Resend integration
- [ ] Create email template for order tracking
- [ ] Send email on order creation with tracking link
- [ ] Test email delivery

### Phase 6: Contact Page Enhancement (Task 9)
- [ ] Add Google Maps iframe embed
- [ ] Test map responsiveness

### Phase 7: Testing & Polish
- [ ] Test all role-based permissions
- [ ] Test tracking page auto-cycling
- [ ] Verify all 6 reports work
- [ ] Test email notifications
- [ ] Mobile responsiveness check
- [ ] Update replit.md

---

## 10. DEMO CREDENTIALS

### 6 Staff Accounts (All passwords: `DemoPass123!`)

1. **Emily (Owner)**
   - Email: `emily@emilybakes.com`
   - Role: `owner`
   - Access: Full system access

2. **James (Manager)**
   - Email: `manager@emilybakes.com`
   - Role: `manager`
   - Access: Full system access, all 6 reports

3. **Sarah (Sales)**
   - Email: `sales@emilybakes.com`
   - Role: `sales`
   - Access: Orders, customers, 4 reports

4. **Tom (Baker)**
   - Email: `baker@emilybakes.com`
   - Role: `baker`
   - Access: **FULL SALES + Baking queue**, 4 reports

5. **Lisa (Decorator)**
   - Email: `decorator@emilybakes.com`
   - Role: `decorator`
   - Access: **FULL SALES + Decoration queue**, 4 reports

6. **Dan (Accountant)**
   - Email: `accountant@emilybakes.com`
   - Role: `accountant`
   - Access: View-only orders/customers, all 6 reports, financial KPIs

---

## 11. PUBLIC TRACKING PAGE SPECIFICATION

### Route: `/track/:token`

**Purpose:** Public order tracking (no login required)

**Features:**
- Auto-cycling status (changes every 2 minutes)
- Continuous loop (never stops)
- Order details (customer, pickup date/time, price, deposit)
- Progress bar (fills as status advances)
- Vertical status timeline
- Elapsed time + estimated completion
- Mobile-responsive

**Auto-Cycling Logic:**
\`\`\`javascript
// Calculate current stage based on time
const startTime = new Date(order.created_at);
const now = new Date();
const elapsedMinutes = (now - startTime) / 1000 / 60;
const currentStage = Math.floor(elapsedMinutes / 2) % 11;

// Stages array (11 total)
const stages = [
  'Order Placed',
  'Design Approved',
  'Pending Baking',
  'Baking in Progress',
  'Cooling',
  'Ready for Decorating',
  'Decorating',
  'Decorated Complete',
  'Quality Check',
  'Ready for Pickup',
  'Picked Up'
];

// Update UI every 10 seconds
setInterval(() => updateStatus(), 10000);
\`\`\`

**Email Workflow:**
1. Staff creates order in dashboard
2. System generates unique tracking token
3. Email sent via Resend with link: `/track/{token}`
4. Customer clicks → sees tracking page
5. Page auto-advances every 2 minutes (loops forever)

---

## 12. API ENDPOINTS

### Authentication
- `POST /api/auth/staff-login` - Staff login (returns JWT)
- `POST /api/auth/logout` - Logout

### Staff
- `GET /api/staff` - Get all staff (Manager only)
- `GET /api/staff/me` - Get current user info

### Orders (Enhanced)
- `GET /api/orders` - Get all orders (filtered by role)
- `POST /api/orders` - Create order (generates tracking token, sends email)
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/track/:token` - Public tracking (no auth)

### Reports (New)
- `GET /api/reports/order-summary?date=2025-11-13`
- `GET /api/reports/customer-list`
- `GET /api/reports/revenue?period=month`
- `GET /api/reports/pending-orders`
- `GET /api/reports/completed-orders`
- `GET /api/reports/product-inventory`

---

## 13. NAVIGATION STRUCTURE

### Public Navigation
\`\`\`
[Logo] Emily Bakes Cakes
[Home] [Shop] [Gallery] [About] [Contact]
\`\`\`

### Staff Navigation (Role-Based)

**Sales:**
\`\`\`
[Dashboard] [Create Order] [Orders] [Customers] [Products] [Reports] [Logout]
\`\`\`

**Baker:**
\`\`\`
[Dashboard] [My Queue] [Create Order] [Orders] [Customers] [Reports] [Logout]
\`\`\`

**Decorator:**
\`\`\`
[Dashboard] [My Queue] [Create Order] [Orders] [Customers] [Gallery] [Reports] [Logout]
\`\`\`

**Accountant:**
\`\`\`
[Dashboard] [Orders] [Customers] [Reports] [Analytics] [Payments] [Logout]
\`\`\`

**Manager:**
\`\`\`
[Dashboard] [Orders] [Customers] [Products] [Staff] [Reports] [Analytics] [Settings] [Logout]
\`\`\`

---

## ✅ FINAL ARCHITECTURE SUMMARY

**Total Functional Pages:** 16 (5 public marketing + 1 tracking + 10 staff portal)

**Pure Staff-Only System:**
- Public pages: Marketing/awareness only, NO customer online ordering
- Staff portal: Role-based dashboards with JWT authentication
- Order entry: Staff manually create ALL orders through admin portal
- Customer ordering: Call/email/visit in person only
- Public tracking: Auto-cycling demo (11 stages, 2-min loop)
- Email notifications: Resend integration for order tracking
- Reports: 6 client reports with Recharts visualization

**System Compliance:**
- ✅ Pure staff-only ordering (no customer e-commerce)
- ✅ Baker/Decorator have FULL Sales permissions (case study requirement)
- ✅ 5 role-based dashboards with session management
- ✅ JWT authentication with 6 demo staff accounts
- ✅ PostgreSQL database with complete schema
- ✅ Public tracking with auto-cycling demonstration
- ⚠️ Need to remove all customer ordering CTAs from public pages
- ⚠️ Need to build 6 client reports with Recharts
- ⚠️ Need Resend email integration
- ⚠️ Need Google Maps on Contact page

---

**Status:** ✅ AUTHORITATIVE - Single Source of Truth  
**Last Updated:** November 13, 2025  
**All Other Documents:** Superseded by this plan
