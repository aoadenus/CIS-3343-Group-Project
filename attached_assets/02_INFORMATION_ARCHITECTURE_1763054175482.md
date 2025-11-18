# Emily Bakes Cakes: Information Architecture and User Flow

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Production Ready  
**Document Purpose:** Define application structure, user journeys, and information hierarchy

---

## Executive Summary

This document defines the complete information architecture for the Emily Bakes Cakes internal staff application. It outlines how information is organized, how users navigate the system, and the workflow required to complete all primary tasks. All interaction flows follow the principle: Customer → Order → Customization.

---

## Core User Journey

### Primary Flow: Creating a Custom Cake Order

\`\`\`
1. LOGIN
   ↓
2. DASHBOARD (Staff sees orders and quick actions)
   ↓
3. START NEW ORDER (Click "New Order" button)
   ↓
4. ENTER/SELECT CUSTOMER
   ├─ Search existing customer by name or email
   └─ Create new customer (required before order)
   ↓
5. SELECT BASE CAKE PRODUCT **NOTE - get stnd menu**
   ├─ Choose from list: Vanilla, Chocolate, Marble, etc.
   └─ Display includes image, description, base price
   ↓
6. CHOOSE CAKE SIZE **NOTE - get stnd menu**
   ├─ Dropdown: Small (4-6), Medium (8-10), Large (12-14), XL (16-18)
   └─ Updates base price
   ↓
7. ADD LAYERS (no max) **NOTE - no max**
   ├─ Click "Add Layer"
   ├─ Per layer:
   │  ├─ Flavor (dropdown from PRODUCT_OPTION)
   │  ├─ Filling (dropdown from PRODUCT_OPTION)
   │  ├─ Icing Flavor (dropdown from PRODUCT_OPTION)
   │  ├─ Writing Color (dropdown from PRODUCT_OPTION)
   │  ├─ Special Notes (text field)
   │  ├─ Upload Design Image (optional)
   │  └─ Delete Layer (button)
   └─ Price recalculates for each layer **NOTE - get layer price**
   ↓
8. ADD EXTRAS/ACCESSORIES (Optional)
   ├─ Toppers (dropdown)
   ├─ Delivery Option (if applicable) **NOTE - is delivery alloed??** **NOTE - add special notes**
   └─ Extra Services (dropdown)
   ↓
9. UPLOAD ORDER-LEVEL IMAGES (Optional) **NOTE - add special design notes**
   ├─ Click "Add Images"
   └─ Support multiple file uploads
   ↓
10. SET DELIVERY DETAILS
    ├─ Pickup Date (required, min 2 days advance) **NOTE - send inquiry to admin**
    ├─ Pickup Time (optional, defaults to business hours) **NOTE - are we doing specific time slots or all day?**
    └─ Special Instructions (text area)
    ↓
11. SET PRICING & DEPOSIT
    ├─ Firm Total Price (required, no ranges) **NOTE - get stnd menu**
    ├─ Deposit Amount (validated: min 50% of total)  **NOTE - enter paymrnt info? is payment info in data?**
    └─ Display remaining balance
    ↓
12. REVIEW ORDER
    ├─ Confirm all details
    ├─ Display price breakdown
    └─ Show customization summary
    ↓
13. SAVE ORDER
    ├─ System generates Order ID **NOTE - amake orders trackable**
    ├─ Status: "To Be Created"
    └─ Display confirmation with Order ID
    ↓
14. OPTIONAL: PRINT PRODUCTION SHEET
    ├─ All layers with customizations
    ├─ Design images embedded
    └─ Notes for baker/decorator
\`\`\`

---

## Application Navigation Structure

### Sitemap (Information Hierarchy)

\`\`\`
EMILY BAKES CAKES (Internal Staff Application) **NOTE - Double check, havong this perfect is key!**
│
├── DASHBOARD 
│   ├── Quick Stats (Orders Today, Revenue Today, Pending Orders)
│   ├── Orders In Progress (Quick View)
│   └── Recent Activity Feed
│
├── ORDERS
│   ├── All Orders (List View)
│   │   ├── Filter by Status (dropdown)
│   │   ├── Filter by Date Range (date picker)
│   │   ├── Search by Order ID or Customer Name
│   │   └── Sort (Date, Status, Customer, Price)
│   ├── New Order (FORM)
│   ├── Order Detail (VIEW / EDIT)
│   │   ├── Customer Info
│   │   ├── Customization Details
│   │   ├── Images/Attachments
│   │   ├── Status History
│   │   ├── Update Status (dropdown)
│   │   ├── Print Production Sheet
│   │   └── Cancel Order (if allowed)
│   └── Search Orders (Advanced)
│
├── CUSTOMERS
│   ├── All Customers (List View)
│   │   ├── Search by Name, Email, Phone
│   │   ├── Filter by Status (Active, VIP, Preferred)
│   │   └── Sort (Name, Last Order, Total Spending)
│   ├── Customer Detail
│   │   ├── Contact Information
│   │   ├── Address & Preferences
│   │   ├── Order History (linked)
│   │   ├── Total Spending
│   │   ├── Notes
│   │   └── Edit Customer (button)
│   └── New Customer (FORM)
│
├── REPORTS (Manager Only) **NOTE - Clarity**
│   ├── Revenue Dashboard
│   │   ├─ Date Range Picker (Today/Week/Month/Quarter/Custom)
│   │   ├─ Total Revenue Card
│   │   ├─ Orders by Status (chart)
│   │   ├─ Revenue Trend (line chart)
│   │   ├─ Top Customers (table)
│   │   └─ Export to PDF/Excel
│   ├── Order Status Report
│   │   ├─ Orders In Baking (count)
│   │   ├─ Orders Decorating (count)
│   │   ├─ Ready for Pickup (list)
│   │   └─ Overdue Orders (alert)
│   └── Customer Insights
│       ├─ New Customers (this period)
│       ├─ Returning Customer Rate
│       ├─ Average Order Value
│       └─ Customer Spending Segments
│
├── ADMIN (Manager/Admin Only)
│   ├── Product Configuration
│   │   ├─ Flavors (Add/Edit/Delete)
│   │   ├─ Fillings (Add/Edit/Delete)
│   │   ├─ Icing Types (Add/Edit/Delete)
│   │   ├─ Writing Colors (Add/Edit/Delete)
│   │   ├─ Cake Sizes (Add/Edit/Delete)
│   │   └─ Accessories (Add/Edit/Delete)
│   ├── Staff Management
│   │   ├─ Staff List
│   │   ├─ Add Staff Member **NOTE - and remove, change status to admin, etc**
│   │   ├─ Assign Role
│   │   └─ Edit Permissions
│   ├── Settings
│   │   ├─ Business Hours
│   │   ├─ Minimum Order Lead Time
│   │   ├─ Default Deposit Percentage
│   │   └─ Notification Preferences
│   └── Audit Log
│       ├─ Order Changes
│       ├─ User Actions
│       └─ System Events
│
├── ACCOUNT
│   ├── Profile (View/Edit)
│   │   ├─ Name
│   │   ├─ Email
│   │   ├─ Phone
│   │   └─ Role (Display Only)
│   ├── Change Password
│   ├── Notification Preferences
│   └── Logout
│
└── HELP
    ├── FAQ
    ├── Tutorials
    ├── Contact Support - Averium Solutions, include logo. **NOTE - Clarity**
    └── System Status
\`\`\`

---

## Page-Level Information Architecture

### 1. Dashboard (HOME)

**Purpose:** Provide staff with quick overview of today's activities and pending work

**Key Information:** **NOTE - Clarity, main info so has to be on point**
- Today's order count
- Today's revenue total
- Orders in progress (count by status)
- Orders ready for pickup (list)
- Recent activity feed
- Quick action buttons (New Order, Search Order, View Reports)

**User Roles:** All staff

**Navigation To:** Orders list, New Order form, Customer list, Reports

---
*************8POTENTIALLY ADD TODAYS ORDERS FIRST  **NOTE - Clarity**
### 2. Orders List Page

**Purpose:** Show all orders with filtering and search capability

**Key Information:**
- Order ID
- Customer Name
- Order Date
- Pickup Date
- Status (color-coded badge)
- Total Price
- Deposit Paid (indicator)

**Filters:**
- Date range picker
- Status dropdown (multiselect)
- Payment status

**Actions per Row:**
- View Details (click order ID)
- Update Status
- Print Production Sheet
- Cancel Order (if allowed)

**Search:** Order ID, Customer name, email

---

### 3. New Order Wizard (Multi-Step Form)

**Purpose:** Guide staff through order creation step-by-step

**Flow:**
1. **Step 1: Customer** (Search or Create)
2. **Step 2: Base Cake** (Product selection)
3. **Step 3: Size** (Cake size selection)
4. **Step 4: Layers** (Customization repeater, max 7 layers)
5. **Step 5: Extras** (Accessories and add-ons)
6. **Step 6: Delivery** (Pickup date/time and notes)
7. **Step 7: Pricing** (Firm price and deposit)
8. **Step 8: Review** (Confirmation before save)

**Validation:**
- Customer required before order
- Pickup date min 2 days advance
- Deposit min 50% of total
- At least 1 layer required
- All required fields must be filled

**Error Handling:**
- Inline error messages below fields
- Highlight invalid fields in red
- Disable Save button until valid

---

### 4. Order Detail Page

**Purpose:** Display complete order information with editing capability

**Sections:**
1. Order Header (Order ID, Status, Created Date, Pickup Date)
2. Customer Information (Link to customer page)
3. Cake Details
   - Base product
   - Size
   - Layers list (collapsible per layer)
4. Customizations
   - Per-layer details
   - Images/attachments
5. Pricing Breakdown
   - Base price
   - Layer adjustments
   - Extras
   - Total price
   - Deposit paid / balance
6. Order History/Status Changes
7. Notes and Special Requests
8. Action Buttons (Edit, Update Status, Print, Cancel)

---

### 5. Customer Detail Page

**Purpose:** Show customer profile and order history

**Sections:**
1. Contact Information (Name, Email, Phone, Address)
2. Customer Status (Active/VIP/Preferred indicator) **NOTE - Clarity** corporate, banned, rip...
3. Customer Notes
4. Statistics
   - Total Orders
   - Total Spending
   - Average Order Value
   - Last Order Date
5. Order History (Linked list of customer's orders)
6. Edit Customer (Button)

---

### 6. Manager Reports Dashboard

**Purpose:** Provide business insights and revenue tracking

**Key Components:**
1. Date Range Selector (Today / This Week / This Month / This Quarter / Custom)
2. KPI Cards
   - Total Revenue (selected period)
   - Order Count
   - Average Order Value
   - Customer Count (new this period)
3. Revenue Trend Chart (Line chart, daily/weekly breakdown)
4. Orders by Status (Pie chart)
5. Top 10 Customers (Table: Name, Orders, Total Spent)
6. Readiness Report (Orders ready for pickup today)
7. Export Options (PDF, Excel, CSV)

---

## Navigation Patterns

### Primary Navigation

**Location:** Top navigation bar (all pages)

Elements:
- Logo/Home link
- Menu toggle (Mobile)
- Breadcrumb trail (Desktop)
- User account dropdown (Profile, Logout)

**Desktop Menu:**
- Dashboard
- Orders
- Customers
- Reports (Managers only)
- Admin (Managers only)

**Mobile Menu:**
- Hamburger icon
- Slides in from left
- Same items as desktop

### Secondary Navigation

**Location:** Left sidebar (Dashboard, visible on desktop)

- Dashboard
- New Order (call-to-action button)
- Orders
- Customers
- Reports (if manager)
- Admin (if manager)

---

## Data Flow and Relationships

### Customer → Order → Customization Flow

\`\`\`
Customer Record (PK: Cust_ID)
│
├─ Contact Info (email, phone, address)
├─ Status (Active/Inactive/VIP)
├─ Preferences & Notes
└─ Order History (1:M relationship)
   │
   └─ Order Record (PK: Order_ID, FK: Cust_ID)
      │
      ├─ Product Selection (FK: Product_ID)
      ├─ Pricing (Total, Deposit)
      ├─ Pickup Date/Time
      ├─ Status (Workflow tracking)
      └─ Customizations (1:M relationship via layers)
         │
         └─ Layer 1, 2, 3... (no max) **NOTE - no max**
            │
            ├─ Flavor Selection (FK: Option_ID)
            ├─ Filling Selection (FK: Option_ID)
            ├─ Icing Flavor (FK: Option_ID)
            ├─ Writing Color (FK: Option_ID)
            ├─ Special Notes
            └─ Layer Images (stored in ORDER_ATTACHMENT) **NOTE - Clarity**
\`\`\`

---
**NOTE - Clarity**
## Screen Inventory with Purposes 

| Screen | Purpose | Primary Users | Key Fields | Type |
|--------|---------|---------------|-----------|------|
| Login | Authenticate staff | All | Email, Password | Form |
| Dashboard | Daily overview | All | KPIs, Recent orders, Quick stats | Dashboard |
| Orders List | Browse all orders | All | Order ID, Customer, Status, Price | List |
| New Order | Create order | Staff | Customer, Cake, Layers, Pricing | Wizard |
| Order Detail | View/edit order | Staff/Manager | All order info, Status, Images | Detail |
| Customer List | Browse customers | All | Name, Email, Total Spent | List |
| Customer Detail | View customer profile | All | Contact, History, Statistics | Detail |
| New Customer | Create customer | Staff | Name, Email, Phone, Address | Form |
| Reports | Business analytics | Manager | Revenue, Status counts, Trends | Dashboard |
| Admin Config | Product management | Manager | Flavors, Fillings, Colors, Sizes | Forms |
| Staff Management | Manage employees | Manager | Name, Role, Status | List |
| Settings | System config | Manager | Hours, Lead times, Defaults | Forms |

---

## Edge Cases and Alternate Flows

### Scenario: Order Placed with Insufficient Notice

**Trigger:** Pickup date < 2 days from now

**Flow:**
1. Form validation shows error: "Pickup date must be at least 2 days in advance" Come up with a way to send a notice to manager, maybe rush order inquiries??  **NOTE - Clarity**
2. Manager can override with supervisor approval
3. System logs override with reason

### Scenario: Customer Not Found

**Trigger:** Staff searches for customer, no results

**Flow:**
1. Display "No results found"
2. Offer "Create New Customer" button
3. Redirect to New Customer form
4. Auto-link to current order creation and retain filled info

### Scenario: Order Cancellation

**Trigger:** Manager clicks "Cancel Order" button

**Flow:**
1. Confirmation dialog: "Are you sure? This cannot be undone."
2. Reason dropdown (Customer request, Order error, etc.)
3. System records cancellation with timestamp and user
4. Status changes to "Cancelled"
5. Notification sent to staff

---

## Accessibility Navigation

**Keyboard Navigation:**
- Tab key cycles through all interactive elements
- Enter activates buttons **NOTE - Clarity**
- Arrow keys navigate dropdown lists
- Escape closes modals
- Focus indicators always visible

**Screen Reader Support:**
- All form labels associated with inputs
- ARIA landmarks: banner, main, contentinfo
- Status messages announced via role="status"
- Form errors announced as alerts

---

## Mobile Navigation Adjustments

**Breakpoint: < 768px**

- Hamburger menu replaces sidebar
- Single-column layout
- Touch-friendly button size (48px minimum)
- Sticky header with back button
- Simplified tables (swipe horizontally) **NOTE - Clarity**
- Stacked form fields
- Full-width inputs

---

## Related Documents

- **01_SCOPE_AND_NON_GOALS.md** - Project boundaries
- **03_UI_STYLE_GUIDE_AND_COMPONENT_LIBRARY.md** - Design system
- **04_PAGES_AND_WIREFRAME_SPECS.md** - Detailed page wireframes
- **08_API_SPEC_DIFF_AND_NEW_ENDPOINTS.md** - API endpoints for each flow
- **09_FRONTEND_IMPLEMENTATION_PLAYBOOK.md** - Component implementation


** Case study business roles**
Business Roles and Business Processes
Emily
Emily’s primary role is the overall business owner and project sponsor. Emily works closely with
James, the Bakery Manager. In addition, Emily is the Chief Decorator. If not busy, she can also
serve as a baker or as a member of the sales staff. Emily also serves as the Bakery Manager
when James is on vacation or away from the bakery.
James (Bakery Manager)
James’ primary role is to manage the day-to-day business of the bakery. James is responsible
for ordering whatever is needed from the company’s various Suppliers. James will directly
oversee the Sales, Baking, and Decorating Staff (except for Emily).
Sales Staff
The Sales Staff is responsible for selling products to “walk-in” customers. The Sales Staff also fill
out Custom Cake orders. Once a custom cake order is completed, the Sales Staff places the
custom orders in the Pink “To Be Created” basket located in the baking area. The Sales Staff are
also the ones who hand out the custom cakes when a customer returns to pick up their custom
order. At the end of each shift, the sales staff gives the money from their cash registers along
with the associated credit card receipts to James.
Bakers
The baking staff’s primary role is to bake and assemble the cakes and the other standard
products that are sold in the physical store. Each week, the Bakers tell James what baking
ingredients are needed for the week. Regarding Custom Cakes, the decorators give their
finished work to the Bakers who in turn bring the custom cakes to James for final approval.
Bakers, if not busy, can also serve as sales staff.
Decorators
The decorators’ job is to decorate the assembled cakes provided by the bakers. The decorators
are frequently consulted on the taking of custom orders. The Decorators also may have
additional questions for the customer before and once decorating begins. Decorators, if not
busy, can also serve as sales staff.
Accountant / CPA
Dan, who is also Emily’s cousin, serves as a part-time accountant for the business. Dan is a
registered CPA. Dan works with James in the handling of the business receipts and business
documents. Dan also handles all banking transactions. Dan provides weekly and monthly
reports to James and Emily. 
---

**Document Status:** Ready for Development  
**Last Updated:** November 5, 2025
