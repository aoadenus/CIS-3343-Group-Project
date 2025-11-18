# 🎯 EMILY BAKES CAKES - FINAL IMPLEMENTATION PLAN
## Single Source of Truth - CIS 3343 Case Study Compliance

**Created:** November 13, 2025  
**Status:** ✅ AUTHORITATIVE - All other documents superseded  
**Deadline:** Saturday, November 15, 2025 (Prefinal Draft)  
**Architecture:** Hybrid (Existing E-commerce + Staff Portal)

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
"Emily Bakes Cakes" is a **hybrid system** combining:
- **Public marketing website** (existing e-commerce features)
- **Staff-only order management portal** (new case study requirement)
- **Public order tracking** (auto-cycling demo page)
- **Email notifications** (Resend integration)

### Key Architecture Decision
**KEEP existing customer-facing features** (cake builder, shop, gallery) while **ADDING staff portal** for case study compliance. This hybrid approach:
- ✅ Preserves your excellent existing work
- ✅ Meets all case study requirements
- ✅ Demonstrates full-stack capabilities
- ✅ Provides realistic business workflow

### Critical Business Rule (Case Study)
> "Bakers and Decorators, if not busy, can also serve as sales staff."

**Meaning:** Baker and Decorator roles have **FULL Sales permissions** + their specialized functions.

---

## 2. WHAT ALREADY EXISTS ✅

### Public Website (7 pages - BUILT & WORKING)

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Home | `/` | ✅ Complete | Hero, testimonials, featured cakes |
| Shop | `/shop` | ✅ Complete | Product catalog with filtering |
| **Builder** | `/builder` | ✅ Complete | Multi-step custom cake builder |
| OrderReview | `/order-review` | ✅ Complete | Order confirmation page |
| Gallery | `/gallery` | ✅ Complete | Masonry grid with lightbox |
| About | `/about` | ✅ Complete | Parisian-themed story page |
| Contact | `/contact` | ✅ Complete | Contact form with FAQ |

### Admin Portal (10 pages - BUILT, needs role-based split)

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Login | `/admin/login` | ✅ Built (demo) | Needs JWT upgrade |
| Dashboard | `/admin/dashboard` | ✅ Complete | KPIs + Recharts analytics |
| OrderBoard | `/admin/fulfillment-board` | ✅ Complete | Kanban drag-and-drop |
| OrderList | `/admin/order-management` | ✅ Complete | Table view with filtering |
| OrderCreate | `/admin/order-create` | ✅ Complete | Manual order form |
| Inquiries | `/admin/inquiry-management` | ✅ Complete | Customer inquiry management |
| Products | `/admin/inventory-management` | ✅ Complete | Product CRUD |
| Customers | `/admin/customer-accounts` | ✅ Complete | Customer CRUD with search |
| Reports | `/admin/business-intelligence` | ✅ Built | Needs 6 specific reports |
| Settings | `/admin/system-configuration` | ✅ Complete | System config |

### Database (Drizzle ORM - WORKING)

**Existing Tables:**
- ✅ `products` - Full product catalog
- ✅ `customers` - Customer records with VIP status
- ✅ `orders` - Orders with JSON layers field
- ✅ `inquiries` - Customer inquiries
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

### Critical Additions for Case Study Compliance

#### A. Database Additions
1. **`employees` table** - Staff with roles (sales, baker, decorator, accountant, manager, owner)
2. **Order tracking tokens** - Add `tracking_token` field to orders
3. **Order status history** - Track status changes with timestamps

#### B. New Pages (2 pages)
1. **Public Tracking Page** (`/track/:token`) - Auto-cycling demo
2. **Staff Login** (upgrade existing to JWT)

#### C. Role-Based Dashboards (5 dashboards)
Convert existing admin pages to role-based views:
1. **Sales Dashboard** - Order creation focus
2. **Baker Dashboard** - Baking queue + Sales access
3. **Decorator Dashboard** - Decoration queue + Sales access
4. **Accountant Dashboard** - Financial KPIs + 6 reports
5. **Manager Dashboard** - Full system access

#### D. Authentication System
- JWT token generation/validation
- Role-based access control middleware
- Protected routes

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

### Final Page Count: **19 Pages Total**

#### PUBLIC WEBSITE (7 pages)
1. Home - `/`
2. Shop - `/shop`
3. Builder - `/builder`
4. OrderReview - `/order-review`
5. Gallery - `/gallery`
6. About - `/about`
7. Contact - `/contact`

#### PUBLIC TRACKING (1 page)
8. **Track Order** - `/track/:token` 🆕

#### STAFF PORTAL (11 pages)
9. **Staff Login** - `/staff-login` ⚡ (upgrade existing)
10. **Sales Dashboard** - `/staff/dashboard/sales` 🆕
11. **Baker Dashboard** - `/staff/dashboard/baker` 🆕
12. **Decorator Dashboard** - `/staff/dashboard/decorator` 🆕
13. **Accountant Dashboard** - `/staff/dashboard/accountant` 🆕
14. **Manager Dashboard** - `/staff/dashboard/manager` 🆕
15. Orders List - `/staff/orders` ✅ (existing)
16. Order Create - `/staff/orders/new` ✅ (existing)
17. Customers - `/staff/customers` ✅ (existing)
18. Products - `/staff/products` ✅ (existing)
19. Reports - `/staff/reports` ⚡ (add 6 reports)

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

**Total Pages:** 19 (7 public + 1 tracking + 11 staff)

**Hybrid Approach:**
- Keep existing customer e-commerce features (Builder, Shop)
- Add staff portal with role-based dashboards
- Add public tracking page (auto-cycling demo)
- Integrate email notifications
- Build 6 client reports with Recharts

**What Makes This Work:**
- ✅ Leverages existing excellent infrastructure
- ✅ Meets all case study requirements
- ✅ Demonstrates full-stack capabilities
- ✅ Realistic business workflow
- ✅ Achievable by Saturday deadline

---

**Status:** ✅ AUTHORITATIVE - Single Source of Truth  
**Last Updated:** November 13, 2025  
**All Other Documents:** Superseded by this plan
