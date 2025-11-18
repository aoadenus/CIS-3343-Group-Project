# 📋 MASTER IMPLEMENTATION SPECIFICATION
## Emily Bakes Cakes - Complete System Design & Build Guide

**Project:** CIS 3343 Case Study - Staff-Only Order Management System  
**Deadline:** Saturday, November 15, 2025  
**Status:** ✅ FINAL - Ready for Development  
**Last Updated:** November 13, 2025  
**Total Pages:** 17 (6 Public + 11 Staff Portal)

---

## 📑 TABLE OF CONTENTS

1. [System Architecture Overview](#system-architecture-overview)
2. [Page Inventory & Routes](#page-inventory--routes)
3. [Complete Page Wireframes](#complete-page-wireframes)
4. [Role-Based Permissions Matrix](#role-based-permissions-matrix)
5. [6 Required Client Reports](#6-required-client-reports)
6. [Navigation Menus by Role](#navigation-menus-by-role)
7. [Technical Implementation Details](#technical-implementation-details)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [Build Timeline & Deliverables](#build-timeline--deliverables)

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### Four-Tier Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ TIER 1: PUBLIC WEBSITE (Customer-Facing Marketing)      │
├─────────────────────────────────────────────────────────┤
│ ✓ Homepage (hero, featured cakes, testimonials)        │
│ ✓ Gallery (masonry grid, lightbox)                     │
│ ✓ Menu/Shop (product display, pricing)                 │
│ ✓ About (Emily's story, team)                          │
│ ✓ Contact (Google Maps + form + email)                 │
│ ✓ Track Order (public, no login, auto-cycling demo)    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TIER 2: STAFF PORTAL (Role-Based Internal System)       │
├─────────────────────────────────────────────────────────┤
│ ✓ Staff Login (JWT authentication)                     │
│ ✓ Sales Dashboard (create orders, manage customers)    │
│ ✓ Baker Dashboard (SALES ACCESS + baking queue)        │
│ ✓ Decorator Dashboard (SALES ACCESS + decoration queue)│
│ ✓ Accountant Dashboard (financial KPIs + 6 reports)    │
│ ✓ Manager Dashboard (full system access + analytics)   │
│ ✓ Orders Management (list, create, edit, assign)       │
│ ✓ Customer Management (CRUD, search, history)          │
│ ✓ Product Management (view/edit standard products)     │
│ ✓ Reports & Analytics (6 client reports + charts)      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TIER 3: PUBLIC ORDER TRACKING (No Login Required)       │
├─────────────────────────────────────────────────────────┤
│ ✓ Route: /track/{unique-token}                         │
│ ✓ Auto-cycling status (11 stages, 2-min intervals)     │
│ ✓ Real-time timers (elapsed + estimated completion)    │
│ ✓ Order details (layers, icing, pickup info)           │
│ ✓ Mobile-responsive design                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TIER 4: DATABASE (PostgreSQL via Replit Neon)           │
├─────────────────────────────────────────────────────────┤
│ ✓ customers (id, name, email, phone, type, preferred)  │
│ ✓ employees (id, email, password_hash, role, name)     │
│ ✓ products (id, name, category, base_price, active)    │
│ ✓ orders (id, customer_id, status, tracking_token,     │
│            deposit_amount, balance_due, pickup_date)    │
│ ✓ order_layers (order_id, layer_num, flavor, filling)  │
│ ✓ order_status_history (order_id, old_status, new)     │
│ ✓ contact_messages (id, name, email, phone, message)   │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

## 2. PAGE INVENTORY & ROUTES

### PUBLIC WEBSITE (6 Pages)

| # | Page | Route | Auth | Status |
|---|------|-------|------|--------|
| 1 | Home | `/` | NO | ✅ Keep Existing |
| 2 | Gallery | `/gallery` | NO | ✅ Keep Existing |
| 3 | Menu/Shop | `/menu` | NO | ✅ Keep Existing |
| 4 | About | `/about` | NO | ✅ Keep Existing |
| 5 | Contact | `/contact` | NO | ✅ Enhanced (+ Maps) |
| 6 | Track Order | `/track/:token` | NO | 🆕 NEW |

### STAFF PORTAL (11 Pages)

| # | Page | Route | Auth | Roles |
|---|------|-------|------|-------|
| 7 | Staff Login | `/staff-login` | NO | All |
| 8 | Sales Dashboard | `/staff/dashboard/sales` | YES | Sales |
| 9 | Baker Dashboard | `/staff/dashboard/baker` | YES | Baker |
| 10 | Decorator Dashboard | `/staff/dashboard/decorator` | YES | Decorator |
| 11 | Accountant Dashboard | `/staff/dashboard/accountant` | YES | Accountant |
| 12 | Manager Dashboard | `/staff/dashboard/manager` | YES | Manager |
| 13 | Orders List | `/staff/orders` | YES | All |
| 14 | Order Form | `/staff/orders/new` | YES | Sales, Baker, Decorator, Manager |
| 15 | Customers List | `/staff/customers` | YES | Sales, Baker, Decorator, Accountant, Manager |
| 16 | Customer Form | `/staff/customers/new` | YES | Sales, Baker, Decorator, Manager |
| 17 | Reports | `/staff/reports` | YES | All (filtered by role) |

---

## 3. COMPLETE PAGE WIREFRAMES

### PAGE 6: TRACK ORDER PAGE ⭐ NEW (Most Important)

**Purpose:** Public order tracking (demo with auto-cycling status)  
**Access:** PUBLIC (anyone with link, NO login required)  
**URL:** `/track/{TOKEN}` (e.g., `/track/TRK-Q1-001`)

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ [🎂 LOGO] Emily Bakes Cakes           Track Your Order  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Order Tracking: #TRK-Q1-001                             │
│                                                          │
│ ╔═══════════════════════════════════════════════════╗  │
│ ║  Customer: John Doe                               ║  │
│ ║  Product: 3-Layer Birthday Cake                   ║  │
│ ║  Pickup: Saturday, Nov 16, 2025 at 2:00 PM        ║  │
│ ║  Total: $95.00 | Deposit Paid: $50.00             ║  │
│ ╚═══════════════════════════════════════════════════╝  │
│                                                          │
│ Order Status (Auto-updates every 2 minutes)             │
│                                                          │
│ Progress: ████████░░░░░░░░░░░░░░░░ 36%                 │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ STATUS TIMELINE                                 │    │
│ │                                                 │    │
│ │ ● Order Received          ✅ Complete           │    │
│ │ ● Order Confirmed         ✅ Complete           │    │
│ │ ● In Production           ✅ Complete           │    │
│ │   ├─ Baking Layer 1       ✅ Complete           │    │
│ │   ├─ Baking Layer 2       ✅ Complete           │    │
│ │   ├─ Baking Layer 3       🔵 Current (36%)      │    │
│ │   ├─ Assembling           ⏳ Pending            │    │
│ │   └─ Decorating           ⏳ Pending            │    │
│ │ ● Quality Check           ⏳ Pending            │    │
│ │ ● Packaging               ⏳ Pending            │    │
│ │ ● Ready for Pickup        ⏳ Pending            │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ ⏱️  Elapsed: 4 hours 23 minutes                         │
│ 📅 Est. Completion: Friday, Nov 15 at 6:00 PM           │
│ ⏳ Time Remaining: ~1 hour 37 minutes                   │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 🔔 You'll receive an email notification when    │    │
│ │    your order is ready for pickup!              │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ Questions? Call us at (713) 555-CAKE                    │
│                                                          │
│ [FOOTER]                                                │
└─────────────────────────────────────────────────────────┘
\`\`\`

**Auto-Cycling Logic (11 Stages, 2-min each, loops forever):**
1. Order Received (0:00 - 2:00)
2. Order Confirmed (2:00 - 4:00)
3. In Production - Baking Layer 1 (4:00 - 6:00)
4. In Production - Baking Layer 2 (6:00 - 8:00)
5. In Production - Baking Layer 3 (8:00 - 10:00)
6. In Production - Assembling (10:00 - 12:00)
7. In Production - Decorating (12:00 - 14:00)
8. Quality Check (14:00 - 16:00)
9. Packaging (16:00 - 18:00)
10. Ready for Pickup (18:00 - 20:00)
11. Loop back to #1 (20:00 - 0:00)

**Technical Implementation:**
\`\`\`javascript
// Calculate current stage based on time
const startTime = new Date(order.created_at);
const now = new Date();
const elapsedMinutes = (now - startTime) / 1000 / 60;
const currentStage = Math.floor(elapsedMinutes / 2) % 11;

// Stages array
const stages = [
  'Order Received',
  'Order Confirmed',
  'Baking Layer 1',
  'Baking Layer 2',
  'Baking Layer 3',
  'Assembling',
  'Decorating',
  'Quality Check',
  'Packaging',
  'Ready for Pickup'
];

// Update UI every 10 seconds
setInterval(() => updateStatus(), 10000);
\`\`\`

---

### PAGE 9: BAKER DASHBOARD ⭐ CORRECTED

**Purpose:** Baker home screen  
**Access:** Role: Baker  
**Login:** `baker@emilybakes.com` / `DemoPass123!`

**⚠️ CRITICAL:** Bakers have FULL SALES ACCESS + Baking Queue

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ [🎂 Logo] Emily Staff Portal               👤 Baker    │
│ [Dashboard] [My Queue] [Orders] [Customers] [Products]  │
│ [Logout]                                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Baker Dashboard                                         │
│                                                          │
│ 🔥 My Baking Queue (4 orders assigned to me)            │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ ⚡ URGENT - Due Today                           │    │
│ │ Order #234 - 3-Layer Chocolate Birthday Cake    │    │
│ │ Customer: Jane Smith                            │    │
│ │ Pickup: Today at 2:00 PM                        │    │
│ │                                                 │    │
│ │ Layer Details:                                  │    │
│ │ • Layer 1: Chocolate, Buttercream      ✅ Done  │    │
│ │ • Layer 2: Chocolate, Raspberry        ✅ Done  │    │
│ │ • Layer 3: Chocolate, Mousse           🔵 Current│   │
│ │                                                 │    │
│ │ Special Notes: "Extra moist, customer request"  │    │
│ │                                                 │    │
│ │ [Mark Layer 3 Complete] [Complete All]          │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ 📅 Tomorrow's Schedule (3 orders)                       │
│ ╔═══════════════════════════════════════════════════╗  │
│ ║ #235 │ 2-Layer Vanilla    │ Start: 8am │ 2 hours ║  │
│ ║ #236 │ 4-Layer Wedding    │ Start: 9am │ 4 hours ║  │
│ ║ #237 │ Cupcakes (24)      │ Start: 2pm │ 1 hour  ║  │
│ ╚═══════════════════════════════════════════════════╝  │
│                                                          │
│ ✅ Completed Today (2 orders)                           │
│ #230 (Wedding), #231 (Birthday)                         │
│                                                          │
│ 📊 This Week: 12 orders assigned to me                  │
│                                                          │
│ ──────────────────────────────────────────────────      │
│                                                          │
│ 🛒 SALES FUNCTIONS (When Not Busy)                      │
│ [+ Create New Order] [View All Orders] [Manage Customers]│
│                                                          │
│ Today's Pickups: 5 orders (same as Sales Dashboard)    │
│ Recent Customers: Available for coordination            │
│                                                          │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

### PAGE 10: DECORATOR DASHBOARD ⚠️ CORRECTED

**Purpose:** Decorator home screen  
**Access:** Role: Decorator  
**Login:** `decorator@emilybakes.com` / `DemoPass123!`

**⚠️ CRITICAL:** Decorators have FULL SALES ACCESS + Decoration Queue

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ [🎂 Logo] Emily Staff Portal          👤 Decorator     │
│ [Dashboard] [My Queue] [Orders] [Customers] [Gallery]   │
│ [Logout]                                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Decorator Dashboard                                     │
│                                                          │
│ 🎨 My Decoration Queue (3 orders ready for me)          │
│                                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ ⚡ PRIORITY - Wedding Cake                      │    │
│ │ Order #234 - 4-Tier Wedding Cake                │    │
│ │ Customer: Jane Smith                            │    │
│ │ Pickup: Tomorrow at 2:00 PM                     │    │
│ │                                                 │    │
│ │ Decoration Details:                             │    │
│ │ • Icing: White Buttercream                      │    │
│ │ • Colors: Blush Pink, Gold, White               │    │
│ │ • Decorations: Fondant flowers, sugar pearls    │    │
│ │ • Writing: "J & M" monogram on top tier         │    │
│ │                                                 │    │
│ │ 📸 Customer Reference Photos:                   │    │
│ │ [pinterest.com/pin/wedding-cake-example]        │    │
│ │                                                 │    │
│ │ 📝 Special Notes:                               │    │
│ │ "Customer wants exact match to photo.           │    │
│ │  Approved design in consultation."              │    │
│ │                                                 │    │
│ │ Progress: ████████░░░░░░░░ 40% Complete         │    │
│ │                                                 │    │
│ │ [Update Progress] [Mark Complete] [Contact      │    │
│ │  Customer] [Request Approval]                   │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ 📋 Next in Queue (2 orders)                             │
│ • #235 - Birthday (Start after #234)                    │
│ • #236 - Anniversary (Due Nov 18)                       │
│                                                          │
│ ✅ Completed This Week: 5 orders                        │
│                                                          │
│ 🖼️ My Design Gallery (Recent Work)                     │
│ [View all my finished cakes for portfolio/inspiration]  │
│                                                          │
│ ──────────────────────────────────────────────────      │
│                                                          │
│ 🛒 SALES FUNCTIONS (When Not Busy)                      │
│ [+ Create New Order] [View All Orders] [Manage Customers]│
│                                                          │
│ Today's Pickups: 5 orders (same as Sales Dashboard)    │
│ Recent Customers: Available for coordination            │
│                                                          │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

## 4. ROLE-BASED PERMISSIONS MATRIX

### ⚠️ CRITICAL CORRECTION: Baker/Decorator Permissions

**Case Study Rule:**
> "Bakers, if not busy, can also serve as sales staff."  
> "Decorators, if not busy, can also serve as sales staff."

This means **Baker and Decorator roles INHERIT Sales permissions** plus their specialized functions.

### Complete Permissions Table

| Permission | Sales | Baker | Decorator | Accountant | Manager |
|-----------|-------|-------|-----------|------------|---------|
| **ORDERS** |
| Create new orders | ✅ | ✅ | ✅ | ❌ | ✅ |
| View all orders | ✅ | ✅ | ✅ | ✅ (read-only) | ✅ |
| View own orders only | - | ✅ (queue) | ✅ (queue) | - | - |
| Edit order details | ✅ | ✅ | ✅ | ❌ | ✅ |
| Update order status | Limited | ✅ (baking) | ✅ (decorating) | ❌ | ✅ (all) |
| Cancel orders | ❌ | ❌ | ❌ | ❌ | ✅ |
| Assign to staff | ❌ | ❌ | ❌ | ❌ | ✅ |
| **CUSTOMERS** |
| View all customers | ✅ | ✅ | ✅ | ✅ (read-only) | ✅ |
| Add new customer | ✅ | ✅ | ✅ | ❌ | ✅ |
| Edit customer info | ✅ | ✅ | ✅ | ❌ | ✅ |
| Mark as Preferred | ❌ | ❌ | ❌ | ❌ | ✅ |
| **PRODUCTS** |
| View products | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit products | ❌ | ❌ | ❌ | ❌ | ✅ |
| **FINANCIAL** |
| View revenue/KPIs | ❌ | ❌ | ❌ | ✅ | ✅ |
| Update payment status | ❌ | ❌ | ❌ | ✅ | ✅ |
| View deposit tracking | ✅ | ✅ | ✅ | ✅ | ✅ |
| **REPORTS** |
| Daily Order Summary | ✅ | ✅ | ✅ | ❌ | ✅ |
| Customer List | ✅ | ✅ | ✅ | ❌ | ✅ |
| Revenue Report | ❌ | ❌ | ❌ | ✅ | ✅ |
| Pending Orders | ✅ | ✅ | ✅ | ❌ | ✅ |
| Completed Orders | ❌ | ✅ | ✅ | ❌ | ✅ |
| Product Inventory | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. 6 REQUIRED CLIENT REPORTS

**Rubric Requirement:** Each team member must create 2 unique client reports  
**Total:** 6 reports minimum

### REPORT 1: ORDER SUMMARY REPORT
**Access:** Sales, Baker, Decorator, Manager  
**Route:** `/staff/reports/order-summary`

**Features:**
- Date range picker (default: today)
- Filter by status, assigned staff
- Table with Order#, Customer, Product, Pickup, Status, Price, Deposit, Balance
- Bar chart: Order volume by day (Recharts)
- Export: CSV, PDF
- Totals row

### REPORT 2: CUSTOMER LIST REPORT
**Access:** Sales, Baker, Decorator, Manager  
**Route:** `/staff/reports/customer-list`

**Features:**
- Columns: Name, Email, Phone, Type, Total Orders, Total Spent
- Filters: Type, spending range, preferred only
- Line chart: Customer acquisition over time (Recharts)
- Export: Email list, Phone list, Full CSV, PDF

### REPORT 3: REVENUE REPORT ⭐
**Access:** Accountant, Manager ONLY  
**Route:** `/staff/reports/revenue`

**Features:**
- Time periods: Day/Week/Month/Custom
- KPI cards: Total Revenue, Deposits, Outstanding, Collection Rate
- 3 Recharts: Revenue trend (line), Revenue by type (pie), Monthly comparison (bar)
- Breakdown by cake size, order type, payment method
- Export: CSV, PDF, Excel

### REPORT 4: PENDING ORDERS REPORT
**Access:** Sales, Baker, Decorator, Manager  
**Route:** `/staff/reports/pending-orders`

**Features:**
- Statuses: Quote, Pending, Confirmed, In Production
- Columns: Order#, Customer, Pickup Date, Days Until Due, Staff, Status
- Funnel chart: Orders by status (Recharts)
- Color coding: 🟢 Green (>2 days), 🟡 Yellow (24-48h), 🔴 Red (<24h)

### REPORT 5: COMPLETED ORDERS REPORT
**Access:** Baker, Decorator, Manager  
**Route:** `/staff/reports/completed-orders`

**Features:**
- Columns: Completion Date, Customer, Baker, Decorator, Days to Complete, Rating, Price
- Bar chart: Avg completion time (Recharts)
- Filters: Date range, staff, satisfaction rating
- Sort by completion time, date, staff

### REPORT 6: PRODUCT INVENTORY REPORT
**Access:** Manager ONLY  
**Route:** `/staff/reports/product-inventory`

**Features:**
- Columns: Product, Category, Price, Times Ordered, Revenue, Trending
- Horizontal bar chart: Top 10 products (Recharts)
- Filters: Category, popularity, date range
- Includes recipes, ingredient costs, profitability

---

## 6. NAVIGATION MENUS BY ROLE

### BAKER NAVIGATION ⚠️ CORRECTED

\`\`\`
┌────────────────────────────────────────┐
│ [🎂 Logo] Emily Bakes                 │
│ 👤 Baker (baker@emilybakes.com)       │
├────────────────────────────────────────┤
│ 🏠 Dashboard                           │
│ 🔥 My Baking Queue                     │
│ 📋 Orders (FULL SALES ACCESS)          │
│    ├─ Create New Order                │
│    ├─ View All Orders                 │
│    └─ Today's Pickups                 │
│ 👥 Customers (FULL SALES ACCESS)       │
│    ├─ Customer List                   │
│    └─ Add New Customer                │
│ 🎂 Products (View Only)                │
│ 📊 Reports                             │
│    ├─ Daily Order Summary             │
│    ├─ Customer List                   │
│    ├─ Pending Orders                  │
│    └─ Completed Orders                │
│ ❓ Help                                │
│ 🚪 Logout                              │
└────────────────────────────────────────┘
\`\`\`

**What Baker Can Do:**
- ✅ ALL SALES FUNCTIONS (create orders, manage customers, view all orders)
- ✅ View baking queue (orders assigned to them)
- ✅ Update baking status
- ✅ Access 4 reports

**What Baker CANNOT Do:**
- ❌ View revenue/financial KPIs
- ❌ Access financial reports
- ❌ Manage staff

### DECORATOR NAVIGATION ⚠️ CORRECTED

\`\`\`
┌────────────────────────────────────────┐
│ [🎂 Logo] Emily Bakes                 │
│ 👤 Decorator (decorator@emilybakes.com)│
├────────────────────────────────────────┤
│ 🏠 Dashboard                           │
│ 🎨 My Decoration Queue                 │
│ 📋 Orders (FULL SALES ACCESS)          │
│    ├─ Create New Order                │
│    ├─ View All Orders                 │
│    └─ Today's Pickups                 │
│ 👥 Customers (FULL SALES ACCESS)       │
│    ├─ Customer List                   │
│    └─ Add New Customer                │
│ 🎂 Products (View Only)                │
│ 🖼️ Gallery (Design Reference)          │
│ 📊 Reports                             │
│    ├─ Daily Order Summary             │
│    ├─ Customer List                   │
│    ├─ Pending Orders                  │
│    └─ Completed Orders                │
│ ❓ Help                                │
│ 🚪 Logout                              │
└────────────────────────────────────────┘
\`\`\`

**What Decorator Can Do:**
- ✅ ALL SALES FUNCTIONS (create orders, manage customers, view all orders)
- ✅ View decoration queue
- ✅ Update decoration status
- ✅ Access 4 reports

**What Decorator CANNOT Do:**
- ❌ View revenue/financial KPIs
- ❌ Access financial reports
- ❌ Manage staff

---

## 7. TECHNICAL IMPLEMENTATION DETAILS

### Tech Stack

**Frontend:**
- React 18.3.1 (TypeScript)
- Vite 6.3.5
- Tailwind CSS 4.1
- Recharts (charts)
- React Router DOM
- React Hook Form
- Lucide React (icons)
- Sonner (toasts)

**Backend:**
- Node.js + Express (TypeScript)
- PostgreSQL (Replit Neon)
- Drizzle ORM
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Resend (email service)

**Configuration:**
- Port 5000 (frontend + backend)
- Host: 0.0.0.0 (Replit requirement)
- CORS enabled

---

## 8. DATABASE SCHEMA

\`\`\`sql
-- Customers
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  type VARCHAR(20) CHECK (type IN ('Retail', 'Corporate')),
  preferred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employees (Staff)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('sales', 'baker', 'decorator', 'accountant', 'manager', 'owner')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  base_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  status VARCHAR(50) DEFAULT 'Pending',
  tracking_token VARCHAR(50) UNIQUE,
  firm_price DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  balance_due DECIMAL(10,2),
  pickup_date DATE,
  pickup_time TIME,
  decoration_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Layers
CREATE TABLE order_layers (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  layer_number INTEGER,
  flavor VARCHAR(100),
  filling VARCHAR(100),
  icing VARCHAR(100),
  color VARCHAR(50)
);

-- Order Status History
CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  updated_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

## 9. API ENDPOINTS

### Authentication
- `POST /api/auth/staff-login` - Staff login (returns JWT)
- `POST /api/auth/logout` - Logout

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/search?q=john` - Search customers
- `POST /api/customers` - Create customer
- `PATCH /api/customers/:id` - Update customer

### Orders
- `GET /api/orders` - Get all orders (filtered by role)
- `POST /api/orders` - Create order (generates tracking token, sends email)
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/track/:token` - Public tracking (no auth)

### Products
- `GET /api/products` - Get all products

### Reports
- `GET /api/reports/order-summary?date=2025-11-13`
- `GET /api/reports/customer-list`
- `GET /api/reports/revenue?period=month`
- `GET /api/reports/pending-orders`
- `GET /api/reports/completed-orders`
- `GET /api/reports/product-inventory`

### Contact
- `POST /api/contact` - Submit contact form

---

## 10. BUILD TIMELINE & DELIVERABLES

### Demo Credentials (6 Staff Accounts)

All passwords: `DemoPass123!`

1. `emily@emilybakes.com` - Emily (Owner)
2. `manager@emilybakes.com` - James (Manager)
3. `sales@emilybakes.com` - Sales Staff
4. `baker@emilybakes.com` - Baker (FULL SALES ACCESS + Baking Queue)
5. `decorator@emilybakes.com` - Decorator (FULL SALES ACCESS + Decoration Queue)
6. `accountant@emilybakes.com` - Dan (Accountant)

---

## ✅ FINAL CHECKLIST

### Public Website
- [ ] Contact (enhanced with Google Maps)
- [ ] Track Order page (auto-cycling, 2-min intervals)

### Staff Portal
- [ ] 5 dashboards (Sales, Baker, Decorator, Accountant, Manager)
- [ ] Baker/Decorator have FULL Sales permissions + specialized functions
- [ ] Order management (create, list, edit, status update)
- [ ] Customer management (CRUD, search)
- [ ] 6 client reports with charts

### Technical
- [ ] 6 demo staff accounts seeded
- [ ] JWT authentication
- [ ] Email service (Resend)
- [ ] Role-based permissions enforced
- [ ] Mobile responsive

---

**Status:** ✅ READY FOR DEVELOPMENT  
**Last Updated:** November 13, 2025  
**Total Pages:** 17 (6 Public + 11 Staff Portal)  
**Estimated Build Time:** 36-48 hours
