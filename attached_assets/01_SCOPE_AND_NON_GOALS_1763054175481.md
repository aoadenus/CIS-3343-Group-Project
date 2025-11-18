# Emily Bakes Cakes: Scope and Non-Goals

**Version:** 1.0  **Wrong Version Number**
**Last Updated:** November 5, 2025  
**Status:** Professor-Approved Clarification  
**Document Purpose:** Define project scope and establish clear boundaries

---

## Executive Summary

Emily Bakes Cakes is an **internal staff-only web application** for bakery employees to enter, customize, and track custom cake orders. This replaces the paper-based manual process. The system helps the bakery stay organized, prevent lost orders, and track customer history and spending.

A separate **public website** (read-only) displays cake galleries, bakery information, and contact forms. The public site does NOT facilitate online ordering.

What Changed: Originally, the project was designed as a customer-facing e-commerce platform with online ordering,online inquiries, etc. The professor clarified that customers call, email, or visit in person to place orders. Staff use the internal application to enter all order details.

---

## Core System Purpose

Build a secure, staff-only order management system that:
- Allows staff to create and manage custom cake orders
- Captures customer information and preferences
- Tracks order status through production workflow
- Maintains customer history and spending records
- Enables manager dashboard with revenue insights by date range
- Supports firm pricing (no dynamic pricing or price ranges)
- Enforces proper validation and workflow rules

---

## Primary Users and Roles

**Role: Bakery Staff (Sales/Order Entry)**
- Create new orders
- Enter customer information
- Edit Customer Information such as contact information, etc.
- Add cake customizations (layers, flavors, fillings, icing, writing)
- Upload design images
- View order status
- Print order sheets
- Access to last 3 month orders, and upcoming orders **NOTE - Clarity**
- Possibly: Send Email confirmation to customers  **NOTE - Clarity**

**Role: Bakery Manager/Admin** **NOTE - for admin more functionality and consideration of reports they want. **
- View all orders and customer history
- Manage order status workflow
- View revenue reports by date range
- Access analytics dashboard
- Manage staff and assignments
- Configure product options (flavors, fillings, icings, colors)
- Permissions: Full CRUD on all orders, reports, and admin functions

**Non-Users: Customers**
- Cannot log into the internal system
- Cannot place orders online
- 1. Cannot view order status online (customers must call or visit) 2. Can view order status through link to tracking page in email confirmation. **NOTE - Clarity**

---

## What IS in Scope

### Core Features
1. **Staff Authentication**
   - Login with username/password
   - Role-based access control
   - Session management
   - Secure password reset - (non-functional) idea: demo credentials for different staff. **NOTE - Clarity**

2. **Customer Management**
   - Create/search customer records
   - Store contact information and address
   - Track customer history and total spending
   - Customer notes and preferences

3. **Order Entry Workflow**
   - Start new order (required: customer first)
   - Select base cake product
   - Choose cake size from firm options
   - Add layers (no maximum) **NOTE - maintain no max**
   - Per-layer customization: **NOTE - stnd menu**
     - Flavor (dropdown)
     - Filling (dropdown)
     - Icing flavor (dropdown)
     - Writing color (dropdown)
     - Special notes per layer
   - Add accessories/extras
   - Upload design images (per-order)
   - Set pickup date and time
   - Set firm price (no price ranges like "$71+") **NOTE - standard menu**
   - Collect deposit information (minimum 50% of total) **NOTE - Clarity**
   - Add special requests/instructions
   - On demand report options (analysis, etc) **NOTE - Clarity**
   - order count by .... **NOTE - Clarity**

4. **Order Management**
   - View all orders with status OR Order View by options ( ex: Flavor, Filling, Layers, customer status, pickup time, date) **NOTE - Clarity**
   - Update order status (Processing → Now Baking → Decorating → Ready for Pickup)
   - Assign orders to staff
   - Update order information
   - Cancel orders with reason tracking
   - Print production sheets with all customization details

5. **Manager Dashboard**
   - Real-time KPI cards (orders today, revenue today, pending orders)
   - Date range filtering (Today, This Week, This Month, Quarter, Year, Custom Date)
   - Revenue reporting by date range 
   - Order count by status
   - Order Count by options ( ex: Flavor, Filling, Layers, customer status, pickup time, date)
   - Staff performance metrics
   - Customer spending insights

6. **Product Configuration (Admin)**
   - Manage product options (flavors, fillings, icings, writing colors)
   - Dynamic dropdown lists from database (no hardcoding)
   - Add/edit/delete options
   - Enable/disable options

7. **Database with Seed Data**
   - Real customer data for testing
   - Product options (flavors, fillings, icings, colors)
   - Sample orders in various states
   - Staff accounts for role testing

---

## What IS NOT in Scope

### Explicitly Removed Features
- **No chatbot** (all support is manual)
- **No customer login/registration** (staff only)
- **No online ordering** (customers call/email/visit)
- **No online payment** (handled outside system)
- **No checkout flow** (internal staff use only)
- **No occasion field** (professor removed)
- **No serving size calculations** (use firm cake sizes instead)
- **No price ranges** (use firm prices only, no "$71+")
- **No 3D/AR cake builder** (too complex for staff workflow)
- **No inventory management** (out of scope)
- **No customer portal** (no customer-facing features)
- **No AI recommendations** (out of scope)
- **No subscription service** (out of scope for core app)
- **No SMS notifications** (optional future feature)
- **No real-time video consultations** (out of scope)

### Public Website (Separate, Lower Priority, but already made, so figure out a way to keep it + make the rest) **NOTE - Clarity**
- Gallery of cake designs (showcase only)
- About/contact information
- Contact form (sends email only, does NOT create orders)
- Clear messaging: "Orders are placed by phone or in person"
- Possible: Inquiry capability, order status tracking page using unique id or order updates through email or text.
- No online ordering capability
- No payment integration
- No customer account system

---

## Success Criteria and Demo Checklist

### Functional Requirements
- [ ] Staff can log in with role-based access
- [ ] Staff can create new order starting with customer entry
- [ ] All dropdown lists (flavors, fillings, icings, colors) pull from database
- [ ] Staff can add up to 7 layers per cake **NOTE - no max**
- [ ] Each layer has independent customization options
- [ ] Staff can upload design images (5 per-order)
- [ ] Price calculation enforces firm price (no ranges) **NOTE - stnd menu**
- [ ] Deposit validation enforces 50% minimum rule
- [ ] Orders persist and display correctly
- [ ] Manager can filter revenue by date range (today/week/month/quarter)
- [ ] Order status workflow enforces valid transitions
- [ ] Production sheet prints with all customization details

### UI/UX Requirements
- [ ] Mobile responsive (works on desktop, tablet, mobile)
- [ ] Dropdown caret symbols are large and visible. Drop Down Menus are designed to be easily identified and easily viewable and with an easy exit option
- [ ] Form layout is clean and intuitive
- [ ] Error messages are clear and helpful
- [ ] Loading states show feedback to user
- [ ] All interactive elements are keyboard accessible (Tab navigation)
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Form labels clearly identify each field

### Data Requirements
- [ ] Customer data required: first name, last name, email, phone
- [ ] Order data required: pickup date, total price, deposit amount
- [ ] Per-layer data: flavor, filling, icing flavor, writing color, notes
- [ ] Database includes seed data with sample orders in multiple states

### Security Requirements - **NOTE - Clarity**
- [ ] HTTPS enabled (or localhost development)
- [ ] Passwords hashed (bcrypt or similar)
- [ ] JWT tokens for API authentication
- [ ] Environment variables for secrets (no hardcoded keys)
- [ ] Rate limiting on login attempts
- [ ] SQL injection prevention (parameterized queries)

### Documentation Requirements
- [ ] ERD updated to reflect new schema
- [ ] DFD updated to show staff workflow
- [ ] API endpoints documented
- [ ] Database schema documented
- [ ] Component library documented
- [ ] Deployment instructions included

---

## Project Deliverables

### Phase 1: Internal Staff Application (PRIMARY - GRADED)
1. ✅ Complete web application deployed and running
2. ✅ Database populated with seed data
3. ✅ All core workflows functional
4. ✅ Manager dashboard with date-range reporting
5. ✅ Comprehensive documentation (ERD, DFD, API specs, design system)
6. ✅ Role-based access control working

### Phase 2: Public Website (SECONDARY - EXTRA CREDIT)
1. Homepage with bakery information
2. Gallery of cake designs
3. Contact form (email only, no orders)
4. Mobile responsive design
5. Brand consistency with staff app
6. Order Tracking with semi functionality

### Acceptance Criteria for Professor Demo
- **Order Creation Flow**: Staff can complete full order in under 2 minutes
- **Data Integrity**: All entered data persists correctly
- **Report Accuracy**: Revenue totals match manual calculation
- **Dropdown Functionality**: Options load dynamically, no hardcoded values
- **Accessibility**: Tab navigation works through entire form
- **Error Handling**: Invalid inputs show helpful error messages

---

## Technical Requirements

### Technology Stack
- **Frontend**: React 18+ with TypeScript (or vanilla JavaScript)
- **Backend**: Node.js/Express OR Python/Django OR similar modern framework
- **Database**: PostgreSQL, MySQL, or similar relational database
- **Styling**: Tailwind CSS or CSS-in-JS (consistent design system)
- **Authentication**: JWT tokens with secure password hashing
- **File Upload**: Local storage or cloud (AWS S3, Google Cloud Storage)

### Environment Setup
- Development environment must run locally
- Database seeded with 100 sample customers and 80 sample orders. tip - For Day Off presentation simulate real workday order count.like 10 orders on that day
- All environment variables stored in .env file
- Database migrations provided for easy setup
- README with clear setup instructions

---

## Constraints and Assumptions

**Constraints:**
- Internal staff use only (no public access to core app) 
- Staff must be logged in to enter orders - demo credentials **NOTE - Clarity**
- Orders cannot be placed until customer is created
- Deposits must be 50% minimum of total price
- No maximum layers per cake **NOTE - yes**
- Pickup date must be at least 2 days in advance (unless manager override) **NOTE - Clarity**
- No payment processing (handled offline)  **NOTE - do we need cc info and payment info? - where it says one cc machine and one cash register, so maybe assume cc info load in to app and we can log cash manually**

**Assumptions:** **NOTE - Clarity**
- Staff members are trained and trustworthy (no advanced fraud prevention)
- Emily or James manage the admin functions
- Current workflow is documented and understood by team
- Bakery has consistent product options (flavors, fillings, etc.)

---

## Related Documents

- **02_INFORMATION_ARCHITECTURE_AND_USER_FLOW.md** - Detailed user journey and navigation
- **03_UI_STYLE_GUIDE_AND_COMPONENT_LIBRARY.md** - Design system and components
- **04_PAGES_AND_WIREFRAME_SPECS.md** - Page-level specifications
- **05_ERD_UPDATE_AND_RATIONALE.md** - Database schema changes
- **06_DFD_UPDATE_AND_DATA_STORES.md** - Data flow diagrams
- **07_DATABASE_MIGRATIONS_AND_SEED_DATA.md** - Database setup
- **08_API_SPEC_DIFF_AND_NEW_ENDPOINTS.md** - REST API documentation
- **09_FRONTEND_IMPLEMENTATION_PLAYBOOK.md** - Frontend development guide
- **10_REPORTS_AND_ANALYTICS_SPEC.md** - Dashboard and reporting
- **11_SECURITY_AND_COMPLIANCE_CHECKLIST.md** - Security requirements
- **12_QA_TEST_PLAN_AND_ACCEPTANCE_CRITERIA.md** - Testing and QA
- **13_PUBLIC_WEBSITE_REVISION_PLAN.md** - Website scope (separate)
- **14_DELTA_LOG_FROM_PREVIOUS_SCOPE.md** - Change tracking


**Case Study Business Rules**
Business Rules
 Never buy “ready-made” cake mixes.
 Each unique person is a customer.
 Customers can either be Retail or Corporate, not both.
 Certain “Preferred” customers can receive a discount of 10% at the discretion of Emily
or the Bakery Manager.
 Corporate Customers can have more than one location, but a corporation should be
considered a single customer.
 One Cake or Product per Order.
 Customers must pay at least 50% deposit on all custom orders.
 Cash, Debit and Major Credit Cards are the valid forms of payment.
 Customers can customize any of the “standard” cakes.
 Cup Cakes can also be customized. However, all cupcake fillings are done in the top
center portion of the cupcake.
 Customized cakes should be ordered at least 2 days in advance. Exceptions can be
made at the Store Manager’s discretion.
 For multi-tiered cakes, Layer 1 is always the bottom-most layer.
 Products can only be in one category. Products are categorized as follows:
o Cakes
o Pastries
o Cup Cakes
o Cookies
o Petit Fours
o Pies
o Breads
o Seasonal Products (limited availability per season)
 One cake layer can have no filling, one filling, or at most two layers of the same filling.
 Prices for decorated cakes are negotiated at the time of ordering. This is because the
customization work may be very extensive, time consuming and required specialized
decorating skills.
 Cakes should be completed and fully decorated at least 4 hours before the customer’s
scheduled pickup day/time.
 The Bakery Manager or Emily must approve all completed customized cakes.
 Cake Orders can be cancelled prior to baking beginning. Decorations can be modified
before decorating begins. However, decorating changes could result in a change of the
quoted price of the finished product.
 Customers can provide photos, clippings, or example copies of their desired finished
product. These examples will be evaluated to determine the feasibility of being
replicated by our Cake Decorators. Cake Decorators will make the final decision
---

## Sign-Off

**Approved by:** Adetutu (Add Names) 
**Professor Clarification Date:** November 5, 2025  
**Project Status:** Ready for Implementation  

This document serves as the binding scope statement for the Emily Bakes Cakes project. All team members must reference this document when making development decisions.
