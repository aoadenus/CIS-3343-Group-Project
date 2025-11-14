## Overview
"Emily Bakes Cakes" is a CIS 3343 case study project - a **pure staff-only internal order management system**. The system consists of:

1. **Public Marketing Website** - Home, shop (inspiration only), gallery, about, contact with Google Maps (5 pages) - NO customer ordering capability
2. **Public Order Tracking** (no login) - Auto-cycling demo page showing order progress
3. **Staff Portal** (role-based access) - 5 unique dashboards for Sales, Baker, Decorator, Accountant, Manager with JWT authentication
4. **Staff Management** - Full employee CRUD (Manager/Owner only) with authentication and password hashing
5. **Six Client Reports** - Complete with Recharts analytics, filters, CSV/PDF exports, and backend API
6. **Email Notifications** - Resend integration for order confirmations and status updates
7. **PostgreSQL Database** - Complete schema with customers, orders, staff, products, tracking tokens

**CRITICAL ARCHITECTURE DECISION (Nov 13, 2025):** Pure staff-only system - customers CANNOT order online. All orders are entered manually by staff through the admin portal. Customers call, email, or visit in person to place orders. Public pages serve marketing/awareness purposes only.

**LATEST SESSION (Nov 14, 2025):** All P phases completed - Staff Management, Email Notifications, Six Reports, Contact Page Enhancement, Comprehensive Testing, RBAC fixes.

## User Preferences
- **HOMEPAGE LOCKED**: The homepage design is finalized and stable. No major changes should be made without explicit user clarification and acceptance.
- **NAVIGATION BAR LOCKED**: The navigation bar design and functionality are finalized. No changes without explicit approval.
- **MOBILE MENU LOCKED**: The mobile menu layout, spacing, and close button are finalized. No changes without explicit approval.
- **FOOTER LOCKED**: The footer design and layout are finalized. No changes without explicit approval.

## System Architecture
The application is built with React 18.3.1, TypeScript, Vite 6.3.5, and Tailwind CSS 4.1. It utilizes Radix UI for components, Framer Motion for animations, React Hook Form for form management, and Recharts for data visualization.

### UI/UX Decisions
- **Color Palette**: "Vanilla Raspberry" (Raspberry Pink, Cream, Charcoal, Soft Gray).
- **Typography**: Playfair Display for headings, Poppins for subheadings, Open Sans for body text.
- **Responsiveness**: Fully responsive design targeting WCAG AA accessibility compliance.
- **Animations**: Smooth transitions and animations integrated using Framer Motion.
- **Theming**: Dark mode support.
- **Loading States**: Implemented with skeleton screens.
- **Design System**: Consistent border radius, shadow system, height standards, and animation timings.

### Technical Implementations
- **Public Interface**: Marketing-only pages - home, shop (inspiration), gallery, about, contact with Google Maps embed. NO customer ordering capability. Contact page features two-column layout (40% ordering workflow, 60% contact info).
- **Staff Order Creation**: Comprehensive admin form for manual order creation with unlimited layer system, dynamic pricing, status management, priority levels, internal notes, and payment tracking. Staff enter ALL orders.
- **Staff Management System (Nov 14, 2025)**: Full employee CRUD with Manager/Owner-only access. Features: search, filters, role badges, activate/deactivate, bcrypt password hashing, JWT authentication on all endpoints.
- **Email Notifications (Nov 14, 2025)**: Resend integration sends professional HTML emails for order confirmations and status updates. Non-blocking error handling. Templates use brand colors with tracking links.
- **Six Client Reports (Nov 14, 2025)**: Production-ready reports with Recharts analytics, filters, CSV/PDF exports:
    1. Order Summary Report - Bar chart
    2. Customer List Report - Line chart  
    3. Revenue Report - 3 charts (Accountant/Manager/Owner)
    4. Pending Orders Report - Funnel chart
    5. Completed Orders Report - Bar chart
    6. Product Inventory Report - Horizontal bar chart (Manager/Owner)
- **Reports Dashboard API (Nov 14, 2025)**: Backend `/api/reports/dashboard` endpoint returns pre-validated metrics with authentication. Monthly revenue, top selling cakes, customer distribution, completion times, KPIs - all calculated server-side with proper currency precision.
- **Admin Interface (Professional OMS)**: An enterprise-grade order management system featuring:
    - **Business Analytics Dashboard** with real-time data from backend API
    - **Fulfillment Board** (Kanban-style)
    - **Order Management Center** (advanced filtering/sorting)
    - **Product Catalog** (pure admin CRUD with 14 case study cakes, NO e-commerce)
    - **Customer Accounts** (CRM)
    - **Business Intelligence** (6 reports with role-based access)
    - **Staff Management** (Manager/Owner only)
    - **System Configuration**
- **Search Bar**: Smart search with autosuggest, keyboard navigation, and debouncing.
- **Accessibility**: Focus on ARIA labels and touch target sizes.
- **Customer Management System**: Includes server-side search, create/detail modals with validation, and backend APIs.
- **Order Cancellation System**: Allows cancellation of pending orders with reason tracking via an API endpoint.
- **Navigation Optimization**: Direct imports used for all pages. React.lazy() and Suspense cause complete application freeze in Replit's iframe environment and have been permanently disabled.
- **CRITICAL LESSON (Nov 4, 2025)**: React lazy loading BREAKS the Replit environment - causes total application freeze with no JavaScript interaction. Hero image fails to load, all clicks unresponsive, scrolling broken. NEVER attempt lazy loading again.

### System Design Choices
- **Backend & Database**: PostgreSQL (Replit Neon) with Drizzle ORM for type-safe queries. The API server is built with Express.js (TypeScript with tsx).
- **Database Schema**: Includes `customers`, `orders`, `employees`, `order_status_history`, `inquiries`, `contact_messages`, `products` tables with relational foreign keys. Enhanced with JWT authentication, tracking tokens, payment tracking, cancellation tracking, and a `layers` JSONB field for custom cake layers. Products table supports soft-delete.
- **Data Flow**: Staff manually enter all orders through admin portal. Public contact forms create inquiries only (NOT orders).
- **Migrations**: Uses `npm run db:push` for schema changes.
- **Project Structure**: Organized into `src/components`, `src/pages` (public and admin), `src/styles`, and `src/assets`.
- **Vite Configuration**: Configured for Replit environment (port 5000, host 0.0.0.0) with HMR.

### Backend API Endpoints
- **Order Creation:** `POST /api/orders/custom`
- **Customer Management:** `GET /api/customers`, `GET /api/customers/search`, `POST /api/customers`, `GET /api/customers/:id`
- **Order Management:** `GET /api/orders`, `PATCH /api/orders/:id/status`, `POST /api/orders/:id/cancel`
- **Inquiries & Contact:** `GET /api/inquiries`, `POST /api/inquiries`, `PATCH /api/inquiries/:id/status`, `GET /api/contact`, `POST /api/contact`
- **Product Management:** `GET /api/products`, `GET /api/products/search`, `GET /api/products/:id`, `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id`
- **Employee Management (Nov 14, 2025):** `GET /api/employees`, `GET /api/employees/search`, `POST /api/employees`, `PATCH /api/employees/:id`, `PATCH /api/employees/:id/status` (All protected with Manager/Owner RBAC)
- **Reports Dashboard (Nov 14, 2025):** `GET /api/reports/dashboard` (Accountant/Manager/Owner only - returns pre-validated metrics)

## External Dependencies
- **React**: Frontend library.
- **TypeScript**: Language.
- **Vite**: Build tool.
- **Tailwind CSS**: Styling framework.
- **Radix UI**: UI component primitives.
- **Framer Motion**: Animation library.
- **React Hook Form**: Form management.
- **Recharts**: Charting library.
- **Lucide React**: Icon library.
- **Sonner**: Toast notifications.
- **React DnD**: Drag-and-drop functionality.
- **PostgreSQL**: Database.
- **Drizzle ORM**: ORM for PostgreSQL.
- **Express.js**: Backend framework.
- **tsx**: TypeScript execution for Node.js.
- **Resend (Nov 14, 2025)**: Transactional email service for order notifications.
- **jsPDF + jsPDF-AutoTable (Nov 14, 2025)**: PDF generation for report exports.
- **xlsx (Nov 14, 2025)**: Excel/CSV export functionality for reports.
- **bcryptjs (Nov 14, 2025)**: Password hashing for employee accounts.

## Project Documentation
- **SINGLE SOURCE OF TRUTH:** `docs/FINAL_IMPLEMENTATION_PLAN.md` - Authoritative implementation plan for pure staff-only system. Covers public marketing pages (5 pages, NO ordering), public tracking page, staff portal (5 role-based dashboards + 11 admin pages), 6 client reports, JWT authentication, database schema, and complete technical specifications. Updated Nov 13, 2025.
- **Product Catalog Transformation (Nov 13, 2025):** `docs/PRODUCT-CATALOG-TRANSFORMATION.md` - Complete removal of all e-commerce "Add to Cart" functionality. Rebuilt with role-based access control: Manager/Owner get full CRUD admin interface; Sales/Baker/Decorator/Accountant get beautiful read-only menu view with product cards and images. Populated with all 14 case study standard cakes. NO customer ordering features.
- **P2 Testing Report (Nov 14, 2025):** `P2_TESTING_REPORT.md` - Comprehensive testing documentation covering RBAC verification for all 6 roles, validation of all 6 client reports, code quality checks, and production readiness assessment. Includes demo credentials and role permission matrices.
- **Critical Business Rule:** Baker and Decorator roles have FULL Sales permissions + specialized functions (per case study: "Bakers/Decorators can also serve as sales staff when not busy").
- **RBAC Update (Nov 14, 2025):** Accountant role now has access to ALL 6 reports (including Product Inventory) per case study requirements for financial oversight.
- **Superseded Documents:** All other planning documents (23_MASTER, EMILY-BAKES, etc.) are outdated. Use FINAL_IMPLEMENTATION_PLAN.md only.

## Recent Major Changes (Nov 14, 2025)
1. **Staff Management Page**: Full employee CRUD with Manager/Owner-only access, bcrypt password hashing, JWT authentication on all endpoints
2. **Email Notifications**: Resend integration with professional HTML templates for order confirmations and status updates
3. **Six Client Reports**: All completed with Recharts analytics, filters, CSV/PDF exports, real data from backend APIs
4. **Reports Dashboard API**: Backend endpoint with pre-validated metrics, proper authentication, currency precision
5. **Contact Page Enhancement**: Two-column layout (40% workflow, 60% contact info), Google Maps iframe embed
6. **RBAC Fixes**: Accountant role granted access to all 6 reports for proper financial oversight
7. **Comprehensive P2 Testing**: Full system testing with RBAC validation, code quality checks, production readiness verification