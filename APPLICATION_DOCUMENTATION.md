# Emily Bakes Cakes - Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [Business Objectives](#business-objectives)
3. [System Architecture](#system-architecture)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Features & Functions](#features--functions)
6. [Technical Stack](#technical-stack)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Deployment](#deployment)

---

## Overview

**Emily Bakes Cakes** is a staff-only internal order management system designed for a custom cake bakery. The system eliminates paper-based ordering, improves operational efficiency, and tracks key business metrics.

**Business Contact:**
- Location: 2847 Westheimer Road, Houston, TX 77098
- Phone: (713) 555-CAKE (713-555-2253)
- Email: info@emilybakescakes.com

**Architecture Type:** Pure staff-only system - customers CANNOT order online. All orders are entered manually by staff through the admin portal. Customers call, email, or visit in person to place orders.

---

## Business Objectives

The system delivers three measurable improvements:

1. **Reduce Order Creation Time by 25%**
   - From: 20 hours/week → To: 15 hours/week
   - Streamlined digital forms replace manual paperwork

2. **Reduce Lost Product Costs by 80%**
   - From: $4,800/year → To: $960/year
   - Better tracking prevents miscommunication and production errors

3. **Increase Returning Customers by 15%**
   - From: 700/year → To: 805/year
   - Improved service quality through better order management

---

## System Architecture

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI primitives
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Notifications:** Sonner (toast notifications)

### Backend
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript (executed via tsx)
- **Database:** PostgreSQL (Replit Neon)
- **ORM:** Drizzle ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Email Service:** Resend integration

### Project Structure
\`\`\`
/workspace
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── dashboard-v2/    # Dashboard-specific components
│   │   └── ui/              # Base UI components
│   ├── pages/
│   │   ├── admin/           # Staff portal pages
│   │   │   └── dashboards/  # Role-based dashboards
│   │   └── public/          # Marketing pages (5 pages)
│   ├── styles/              # Global styles
│   └── assets/              # Images and static files
├── server/
│   ├── index.ts             # Express server entry point
│   ├── storage.ts           # Database queries and business logic
│   └── email.ts             # Email notification templates
├── shared/
│   └── schema.ts            # Drizzle ORM database schema
└── build/                   # Vite production build output
\`\`\`

---

## User Roles & Permissions

### 1. Owner
**Full System Access**
- All Manager permissions
- Strategic business analytics
- Complete financial oversight
- All 6 reports access

**Dashboard KPIs:**
- Time Saved (vs. paper system)
- Lost Order Costs
- Retention Growth
- Deposit Compliance
- Business Health Score

### 2. Manager
**Operational Management**
- Staff management (CRUD operations)
- Product catalog management
- Order oversight
- Performance analytics
- 6 reports access (all)

**Dashboard KPIs:**
- Lost-Order Risk Score
- Staff Utilization
- SLA Adherence
- Critical Actions
- Team Performance

### 3. Accountant
**Financial Operations**
- Payment tracking
- Deposit monitoring
- Revenue reports
- Financial reconciliation
- 6 reports access (all)

**Dashboard KPIs:**
- Deposit Shortfalls
- Aging Buckets (AR)
- Reconciliation Accuracy
- Deposit Compliance (50% rule)
- Week Revenue

### 4. Sales
**Order Entry & Customer Service**
- Create/edit orders
- Customer management
- Order status updates
- Payment collection
- Limited reports (1-5)

**Dashboard KPIs:**
- Deposit Compliance (50% rule)
- Today's Orders
- Returning Customers
- Pickups Today
- Order Creation Time

### 5. Baker
**Production Management**
- All Sales permissions +
- Production queue management
- Recipe/flavor management
- Handoff to Decorator
- Limited reports (1-5)

**Dashboard KPIs:**
- Prep Time per Order
- On-Time Handoff %
- Current Workload
- Orders in Production
- Overdue Orders

### 6. Decorator
**Finishing & Quality**
- All Sales permissions +
- Decoration queue management
- Design management
- Final product photos
- Limited reports (1-5)

**Dashboard KPIs:**
- Design Queue Age
- Rush Orders Ready
- Current Workload
- Week Completion Rate
- Overdue Decorations

**RBAC Rule:** Bakers and Decorators have FULL Sales permissions plus their specialized functions (per case study: "Bakers/Decorators can also serve as sales staff when not busy").

---

## Features & Functions

### 1. Authentication System
- JWT-based authentication
- bcrypt password hashing
- Role-based access control (RBAC)
- Session management
- Secure password storage

### 2. Order Management
**Order Creation:**
- Unlimited layer system (dynamic cake layers)
- Flavor selection per layer
- Filling selection per layer
- Size/servings calculation
- Priority levels (Standard, Rush, Express)
- Event date tracking
- Customer assignment
- Internal staff notes
- Automatic pricing calculation

**Order Tracking:**
- Status progression: Pending → In Prep → In Decoration → Ready → Completed → Picked Up
- Real-time status updates
- Order history
- Status change timestamps
- Cancellation with reason tracking
- Payment tracking (deposit + balance)

**Order Lifecycle Fields:**
- `prepStartedAt` - When baker begins work
- `prepCompletedAt` - When prep is finished
- `decorationCompletedAt` - When decoration is done
- `depositCollectedAt` - When 50% deposit is paid

### 3. Customer Management
- Customer profiles (CRUD)
- Contact information
- Order history
- Server-side search
- Relationship tracking
- Email/phone validation

### 4. Product Catalog
**14 Standard Cakes:**
1. Classic Vanilla
2. Chocolate Delight
3. Red Velvet
4. Lemon Bliss
5. Strawberry Dream
6. Carrot Cake
7. Marble Cake
8. Funfetti
9. Coconut Cream
10. Cookies & Cream
11. Salted Caramel
12. Chocolate Raspberry
13. Tiramisu
14. Black Forest

**Product Management:**
- Full CRUD (Manager/Owner only)
- Read-only view (Sales/Baker/Decorator/Accountant)
- Soft-delete functionality
- Flavor, filling, and color options
- Base pricing
- Product images

### 5. Staff Management
**Features (Manager/Owner Only):**
- Create employee accounts
- Edit employee details
- Activate/deactivate accounts
- Role assignment
- Search and filtering
- Password management

### 6. Business Intelligence (6 Reports)

**Report 1: Order Summary Report**
- Visual: Bar chart
- Access: All roles
- Filters: Date range, status
- Export: CSV, PDF
- Metrics: Orders by status, completion trends

**Report 2: Customer List Report**
- Visual: Line chart
- Access: All roles
- Filters: Date range, activity
- Export: CSV, PDF
- Metrics: Customer acquisition, retention

**Report 3: Revenue Report**
- Visual: 3 charts (line, bar, pie)
- Access: Accountant, Manager, Owner only
- Filters: Date range, payment status
- Export: CSV, PDF
- Metrics: Total revenue, deposits collected, outstanding balance

**Report 4: Pending Orders Report**
- Visual: Funnel chart
- Access: All roles
- Filters: Priority, event date
- Export: CSV, PDF
- Metrics: Orders by stage, bottlenecks

**Report 5: Completed Orders Report**
- Visual: Bar chart
- Access: All roles
- Filters: Date range, product
- Export: CSV, PDF
- Metrics: Completion rate, average time

**Report 6: Product Inventory Report**
- Visual: Horizontal bar chart
- Access: Manager, Owner, Accountant only
- Filters: Date range
- Export: CSV, PDF
- Metrics: Product popularity, revenue by product

### 7. Email Notifications
**Automated Emails via Resend:**
- Order confirmation (sent to customer)
- Status updates (Prep Started, Decoration Complete, Ready for Pickup)
- Professional HTML templates
- Brand colors (Vanilla Raspberry theme)
- Order tracking links
- Non-blocking error handling

### 8. Dashboard Analytics
**Real-time Metrics:**
- All KPIs calculated server-side
- Role-specific dashboards
- Live data refresh
- Trend indicators (up/down/neutral)
- Interactive drill-down modals
- Quick action tiles

### 9. Payment Tracking
**Features:**
- 50% deposit requirement
- Deposit compliance monitoring
- Balance due calculation
- Payment history
- Overdue tracking
- Reconciliation tools

---

## Technical Stack

### Dependencies (Production)
\`\`\`json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "react-router-dom": "^7.1.0",
  "typescript": "^5.7.2",
  "vite": "^6.3.5",
  "tailwindcss": "^4.1.0",
  "express": "^4.21.2",
  "postgres": "^3.4.5",
  "drizzle-orm": "^0.38.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "resend": "^4.0.1",
  "recharts": "^2.15.0",
  "framer-motion": "^11.15.0",
  "sonner": "^1.7.3",
  "lucide-react": "^0.468.0",
  "jspdf": "^2.5.2",
  "xlsx": "^0.18.5"
}
\`\`\`

### Development Tools
- TypeScript (5.7.2)
- tsx (for Node.js TypeScript execution)
- Drizzle Kit (database migrations)
- Vite (development server with HMR)
- ESLint (code quality)

### Environment Variables
\`\`\`
DATABASE_URL=<Replit Neon PostgreSQL connection string>
JWT_SECRET=<Production secret for token signing>
RESEND_API_KEY=<Email service API key>
PORT=3000 (backend)
\`\`\`

---

## Database Schema

### Tables

#### 1. `customers`
\`\`\`typescript
{
  id: serial (primary key),
  firstName: varchar(100),
  lastName: varchar(100),
  email: varchar(255) unique,
  phone: varchar(20),
  address: text,
  createdAt: timestamp,
  notes: text
}
\`\`\`

#### 2. `employees`
\`\`\`typescript
{
  id: serial (primary key),
  firstName: varchar(100),
  lastName: varchar(100),
  email: varchar(255) unique,
  passwordHash: varchar(255),
  role: varchar(50), // Owner, Manager, Sales, Baker, Decorator, Accountant
  isActive: boolean,
  createdAt: timestamp
}
\`\`\`

#### 3. `orders`
\`\`\`typescript
{
  id: serial (primary key),
  customerId: integer (FK → customers),
  orderType: varchar(50),
  status: varchar(50),
  priority: varchar(20), // Standard, Rush, Express
  eventDate: timestamp,
  servings: integer,
  totalPrice: decimal(10,2),
  depositAmount: decimal(10,2),
  depositPaid: boolean,
  balancePaid: boolean,
  layers: jsonb, // Dynamic layer configuration
  adminNotes: text,
  cancellationReason: text,
  trackingToken: varchar(100),
  prepStartedAt: timestamp,
  prepCompletedAt: timestamp,
  decorationCompletedAt: timestamp,
  depositCollectedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
\`\`\`

#### 4. `products`
\`\`\`typescript
{
  id: serial (primary key),
  name: varchar(255),
  category: varchar(100),
  basePrice: decimal(10,2),
  description: text,
  imageUrl: text,
  isActive: boolean,
  createdAt: timestamp
}
\`\`\`

#### 5. `order_status_history`
\`\`\`typescript
{
  id: serial (primary key),
  orderId: integer (FK → orders),
  previousStatus: varchar(50),
  newStatus: varchar(50),
  changedBy: integer (FK → employees),
  changedAt: timestamp,
  notes: text
}
\`\`\`

#### 6. `inquiries` (DORMANT - Future Optional Website)
\`\`\`typescript
{
  id: serial (primary key),
  name: varchar(255),
  email: varchar(255),
  phone: varchar(20),
  eventDate: date,
  eventType: varchar(100),
  guestCount: integer,
  message: text,
  status: varchar(50),
  createdAt: timestamp
}
\`\`\`

#### 7. `contactMessages` (DORMANT - Future Optional Website)
\`\`\`typescript
{
  id: serial (primary key),
  name: varchar(255),
  email: varchar(255),
  subject: varchar(255),
  message: text,
  createdAt: timestamp
}
\`\`\`

**Note:** Tables 6-7 are dormant and excluded from staff application scope. They exist for future optional public website features (Priority 4).

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Staff login with email/password
- `POST /api/auth/register` - Create staff account (Manager/Owner only)

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/search?q=<query>` - Search customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer

### Orders
- `GET /api/orders` - List all orders (with filters)
- `POST /api/orders/custom` - Create custom cake order
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order with reason

### Products
- `GET /api/products` - List all products
- `GET /api/products/search?q=<query>` - Search products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Manager/Owner)
- `PATCH /api/products/:id` - Update product (Manager/Owner)
- `DELETE /api/products/:id` - Soft-delete product (Manager/Owner)

### Employees
- `GET /api/employees` - List all employees (Manager/Owner)
- `GET /api/employees/search?q=<query>` - Search employees
- `POST /api/employees` - Create employee (Manager/Owner)
- `PATCH /api/employees/:id` - Update employee (Manager/Owner)
- `PATCH /api/employees/:id/status` - Activate/deactivate (Manager/Owner)

### Reports
- `GET /api/reports/dashboard` - Get dashboard metrics (role-based)
- `GET /api/dashboards/sales` - Sales dashboard KPIs
- `GET /api/dashboards/baker` - Baker dashboard KPIs
- `GET /api/dashboards/decorator` - Decorator dashboard KPIs
- `GET /api/dashboards/accountant` - Accountant dashboard KPIs
- `GET /api/dashboards/manager` - Manager dashboard KPIs
- `GET /api/dashboards/owner` - Owner dashboard KPIs

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## Deployment

### Development Environment
**Backend Server:**
\`\`\`bash
npm run server:dev
# Runs on: http://localhost:3000
\`\`\`

**Frontend Server:**
\`\`\`bash
npm run dev
# Runs on: http://localhost:5000 (exposed to Replit webview)
\`\`\`

### Production Environment
**Build Command:**
\`\`\`bash
npm run build
\`\`\`

**Deployment Configuration:**
- Platform: Replit Autoscale Deployments
- Port: 5000 (frontend must bind to 0.0.0.0:5000)
- Environment: Production
- Database: Replit Neon PostgreSQL

### Database Migrations
\`\`\`bash
# Sync schema changes to database
npm run db:push

# Force sync (use if conflicts)
npm run db:push --force
\`\`\`

### Environment Setup
1. Ensure `DATABASE_URL` is set (automatically provided by Replit)
2. Set `JWT_SECRET` for production
3. Configure Resend API key for email notifications
4. Enable CORS for frontend domain
5. Configure allowed hosts in Vite/Express

---

## Security Considerations

1. **Password Security:**
   - bcrypt hashing with salt rounds
   - No plaintext password storage
   - Password requirements enforced

2. **Authentication:**
   - JWT with expiration
   - HTTP-only token storage recommended
   - Role-based access control (RBAC)

3. **Data Validation:**
   - Server-side validation on all endpoints
   - SQL injection prevention via ORM
   - Input sanitization

4. **API Security:**
   - CORS configuration
   - Rate limiting recommended
   - Authentication required on all sensitive endpoints

5. **Database Security:**
   - Development/production separation
   - No direct database access from frontend
   - Foreign key constraints enforced

---

## Future Enhancements (Out of Current Scope)

The following are **Priority 4 - Optional Website Features** (not in current implementation):

1. **Public Marketing Website:**
   - Customer-facing inquiry forms
   - Contact form submissions
   - Public order tracking page
   - Gallery showcasing cakes

2. **Customer Portal:**
   - Self-service order tracking
   - Order history
   - Favorite products
   - Reorder functionality

3. **Advanced Analytics:**
   - Predictive ordering
   - Seasonal trend analysis
   - Customer lifetime value
   - Inventory forecasting

4. **Mobile App:**
   - iOS/Android applications
   - Push notifications
   - Mobile order entry

---

## Support & Maintenance

**System Status:**
- ✅ Production-ready
- ✅ All 6 dashboards operational
- ✅ All 6 reports functional
- ✅ Email notifications active
- ✅ 0 TypeScript errors
- ✅ 0 runtime errors

**Last Updated:** November 18, 2025 - Case Study Compliance Realignment

**Documentation:** See `replit.md` for technical architecture details and `docs/FINAL_IMPLEMENTATION_PLAN.md` for complete implementation specifications.

---

## Quick Start Guide

### For Staff Users:

1. **Login:** Navigate to the application and login with your credentials
2. **Dashboard:** View your role-specific dashboard with real-time KPIs
3. **Create Order:** Use the Order Management page to enter customer orders
4. **Track Orders:** Monitor order progress through the Fulfillment Board
5. **Generate Reports:** Access Business Intelligence for analytics and exports

### For Administrators (Manager/Owner):

1. **Staff Management:** Create and manage employee accounts
2. **Product Catalog:** Maintain the 14 standard cakes and options
3. **Reports:** Access all 6 reports for comprehensive business insights
4. **System Configuration:** Manage settings and preferences

---

**End of Documentation**
