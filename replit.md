## Overview
This project is for "Emily Bakes Cakes," a dual-interface web application designed to offer a warm and inviting customer experience alongside an efficient staff management system. It features a public-facing website for customers to browse products, build custom cakes, and view galleries, and an administrative portal for staff to manage orders, customers, products, and reports. The application aims to provide a comprehensive solution for a baking business, enhancing customer engagement and streamlining internal operations.

## User Preferences
- **HOMEPAGE LOCKED**: The homepage design is finalized and stable. No major changes should be made without explicit user clarification and acceptance.
- **NAVIGATION BAR LOCKED**: The navigation bar design and functionality are finalized. No changes without explicit approval.
- **MOBILE MENU LOCKED**: The mobile menu layout, spacing, and close button are finalized. No changes without explicit approval.
- **FOOTER LOCKED**: The footer design and layout are finalized. No changes without explicit approval.

## System Architecture
The application is built using React 18.3.1 with TypeScript, Vite 6.3.5, and Tailwind CSS 4.1. It leverages Radix UI primitives for components, Framer Motion for animations, React Hook Form for forms, and Recharts for data visualization.

### UI/UX Decisions
- **Color Palette**: "Vanilla Raspberry" (Raspberry Pink, Cream, Charcoal, Soft Gray).
- **Typography**: Playfair Display for headings, Poppins for subheadings, Open Sans for body text.
- **Responsiveness**: Fully responsive design targeting WCAG AA accessibility compliance.
- **Animations**: Smooth transitions and animations are integrated throughout using Framer Motion.
- **Theming**: Dark mode support is included.
- **Loading States**: Implemented with skeleton screens.
- **Z-Index Layering**: Standardized hierarchy for UI elements.

### Technical Implementations
- **Public Interface**: Includes a home page, product shop, custom cake builder (with unlimited layer system and dynamic pricing), photo gallery, about page, and contact form.
- **Admin Interface**: Features a dashboard with analytics, order management with a Kanban board (drag-and-drop), customer database, product management, and reporting.
- **Mock Data System**: Comprehensive mock data is used for development and demonstration of admin features.
- **Search Bar**: Smart search with autosuggest, keyboard navigation, and debouncing.
- **Component Design**: Reusable and interactive components like `ProductCard` with hover effects.
- **Accessibility**: Focus on ARIA labels and touch target sizes.

### System Design Choices
- **Backend & Database**: PostgreSQL (Replit Neon) with Drizzle ORM for type-safe queries. The API server is built with Express.js (TypeScript with tsx).
- **Database Schema**: Includes `customers`, `orders`, `inquiries`, `contact_messages` tables with relational foreign keys.
- **Data Flow**: Form submissions (Custom Builder, Shop Inquiries, Contact) persist to the database. Custom Builder automatically creates/links customers.
- **Migrations**: Uses `npm run db:push` for schema changes.
- **Project Structure**: Organized into `src/components`, `src/pages` (public and admin), `src/styles`, and `src/assets`.
- **Vite Configuration**: Configured for Replit environment (port 5000, host 0.0.0.0) with HMR.
- **Build Output**: Production builds target the `build/` directory.

### Backend API Endpoints
**Customer Management:**
- `GET /api/customers` - Fetch all customers with order stats
- `GET /api/customers/search?q=query` - Search customers by name, email, or ID (case-insensitive, limit 20)
- `POST /api/customers` - Create new customer with email uniqueness validation
- `GET /api/customers/:id` - Get customer details with complete order history

**Order Management:**
- `GET /api/orders` - Fetch all orders with joined customer data and payment info
- `POST /api/orders/custom` - Create custom cake order with layer support
- `PATCH /api/orders/:id/status` - Update order status (for Kanban board drag-drop)
- `POST /api/orders/:id/cancel` - Cancel order (pending-only) with reason tracking

**Inquiries & Contact:**
- `GET /api/inquiries` - Fetch all shop inquiries
- `POST /api/inquiries` - Create new inquiry from Shop page
- `PATCH /api/inquiries/:id/status` - Update inquiry status
- `GET /api/contact` - Fetch all contact messages
- `POST /api/contact` - Create contact form submission

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

## Recent Changes

### Phase 2: Admin Enhancements (November 2025) - 60% Complete ✅
**Objective:** Enable backend staff to efficiently manage customers, orders, and implement payment/cancellation systems.

**Completed Features:**

1. **Enhanced Database Schema** (shared/schema.ts):
   - **Payment Tracking**: depositAmount, balanceDue, paymentStatus, paymentDate, paymentMethod, stripePaymentIntentId
   - **Cancellation Tracking**: cancellationReason, cancelledAt, cancelledBy
   - All fields properly typed with PostgreSQL constraints
   - Successfully migrated with `npm run db:push`

2. **Customer Management System** (src/pages/Customers.tsx + APIs):
   - **Server-Side Search**: Debounced search (300ms) by name, email, or ID with live results
   - **Create Customer Modal**: Form validation, email uniqueness check, auto-refresh on success
   - **Customer Detail Modal**: Full profile with contact info, order statistics, complete order history
   - **Backend APIs**: 
     * `GET /api/customers/search?q=query` - Case-insensitive search, 20 result limit
     * `POST /api/customers` - Create with duplicate email prevention
     * `GET /api/customers/:id` - Detailed customer with order array
   - **Enhanced UI**: VIP badges, analytics cards, empty states, responsive grid layout

3. **Order Cancellation System** (server/index.ts):
   - **API Endpoint**: `POST /api/orders/:id/cancel` with reason and user tracking
   - **Business Rules**: Only pending orders can be cancelled (enforced server-side)
   - **Error Handling**: Clear messages for invalid cancellation attempts
   - **Audit Trail**: Captures who cancelled, when, and why

4. **Admin Order List Page** (src/pages/admin/OrderList.tsx):
   - **Comprehensive Table View**: 8 columns (ID, Customer, Occasion, Event Date, Status, Payment, Created, Actions)
   - **Advanced Filtering**: 
     * Real-time search (customer name/email/ID/occasion)
     * Status dropdown filter (all/pending/preparing/ready/completed/cancelled)
     * Sort controls (date, customer, status with asc/desc toggle)
   - **Order Detail Modal**: Complete order info including layer-by-layer details, payment status, cancellation info
   - **Cancellation Workflow**: Modal with required reason field, instant order refresh
   - **Summary Statistics**: 4 stat cards (Total, Pending, Completed, Cancelled)
   - **Visual Indicators**: Color-coded status badges, payment status badges, layer count icons
   - **Backward Compatibility**: Displays both layer-based and legacy single-flavor orders

5. **Navigation & Routing** (App.tsx, AdminLayout.tsx):
   - Added "Order List" menu item with List icon to admin navigation
   - Positioned between Order Board (Kanban) and Cake Inquiries
   - Complete routing integration with 'order-list' case

**Architect Approval:** All completed features have received PASS ratings with no security issues observed.

**Pending Features (40% remaining):**
- Task 5: Admin Create Order page (mirroring layer-by-layer builder)
- Task 7: Payment tracking APIs (deposit calculations, balance management)
- Task 8: Customer-facing payment form page
- Task 9: Stripe payment gateway integration

**Next Steps:** Payment system implementation or user-directed priorities.

---

### Phase 1: Enhanced Custom Cake Builder (November 2025) - Complete ✅
**Objective:** Transform Custom Builder from single-flavor to professional unlimited-layer cake customization.

**Delivered:**
- **Unlimited Layer System**: Customers can add unlimited cake layers with flavor, up to 2 fillings, and optional notes per layer
- **Centralized Data**: `src/data/cakeOptions.ts` with 8 flavors, 10 filling options, pricing constants
- **Dynamic Pricing**: $50 base + $15/layer + $1/filling with live display
- **LayerBuilder Component**: Smooth animations, >20 layer warning, 255-char notes limit with counter
- **Backend Validation**: API validates layer arrays, enforces filling limits, sanitizes inputs
- **Admin Order Board**: Enhanced to display layer count and details with backward compatibility
- **Database Schema**: Added `layers` JSONB field to orders table
- **Type Safety**: Full TypeScript with CakeLayer interface and LSP-clean codebase

**Architect Status:** PASS with suggestions for future JSON parsing hardening and server-side price persistence.