# Emily Bakes Cakes: Pages and Wireframe Specifications

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Production Ready  
**Document Purpose:** Detailed wireframe specs and page-level requirements

---

## Executive Summary

This document specifies every page in the Emily Bakes Cakes internal staff application. Each page includes wireframe layout, key components, required data, validations, and responsive behavior. All pages are designed for staff use only (no customer-facing features).

---

## Page Inventory Summary

| Page | Route | Audience | Purpose | Status |
|------|-------|----------|---------|--------|
| **Login** | `/login` | All (unauthenticated) | Staff authentication | ✅ | **NOTE - demo cred**
| **Dashboard** | `/` | All staff | Daily overview & quick actions | ✅ |
| **Orders List** | `/orders` | All staff | Browse all orders | ✅ |
| **New Order Wizard** | `/orders/new` | Sales staff | Create custom order (6 steps) | ✅ |
| **Order Detail** | `/orders/:id` | All staff | View/edit single order | ✅ |
| **Customers List** | `/customers` | All staff | Browse customers | ✅ |
| **New Customer** | `/customers/new` | Sales staff | Create new customer | ✅ |
| **Customer Detail** | `/customers/:id` | All staff | View customer profile | ✅ |
| **Manager Dashboard** | `/reports/dashboard` | Manager only | Revenue analytics | ✅ |
| **Admin Options** | `/admin/options` | Admin only | Product configuration | ✅ |
| **Staff Management** | `/admin/staff` | Admin only | Employee management | ✅ |
| **Settings** | `/admin/settings` | Admin only | System configuration | ✅ |
| **Account Profile** | `/account/profile` | All staff | User profile/preferences | ✅ |
| **Help/FAQ** | `/help` | All staff | Documentation | ✅ |

---

## Page Specifications

### 1. Login Page

**Route:** `/login`  
**Access:** Unauthenticated users only  
**Redirect:** Authenticated users → Dashboard

**Purpose:** Staff authentication with email and password

**Wireframe:**
\`\`\`
┌─────────────────────────────────────┐
│          Emily Bakes                │
│         Cakes Logo                  │
│                                     │
│      STAFF LOGIN                    │
│                                     │
│  Email                              │
│  [________________________]          │
│                                     │
│  Password                           │
│  [________________________]          │
│                                     │
│  [ Remember Me ]                    │
│                                     │
│  [ Login Button ]                   │
│  [ Forgot Password? ]               │
│                                     │
└─────────────────────────────────────┘
\`\`\`

**Components:**
- Email input (required, simple format for demo )  **note - figure out demo credentials**
- Password input (required, min 1 char,  simple format for demo)
- Remember me checkbox (optional)
- Login button (disabled until both fields filled)
- Forgot password link (optional feature)
- Error message area (role="alert")

**Data Required:**
- email: string
- password: string
- rememberMe: boolean

**Validations:**
- Email format validation (basic @domain.com) **note - figure out demo credentials**
- Password not empty
- Show errors inline below fields

**Error Handling:**
- "Invalid email or password" (generic, for security) ONLY FOR DEMO **note - figure out demo credentials**
- Show for 5 seconds then auto-clear
-

**Responsive:**
- Mobile: Full width, centered, padding 16px
- Tablet: Max width 400px, centered
- Desktop: Max width 400px, centered

**Accessibility:**
- Label associated with inputs (for/id)
- Password field masked
- Tab navigates through form
- Enter key submits
- Focus indicator visible

---

### 2. Dashboard Page

**Route:** `/`  
**Access:** Authenticated users (all roles)  
**Purpose:** Daily overview and quick actions

**Wireframe:** **note - add orders to be baked, is revenue today relebant to non mgmt?**
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Dashboard | Orders | Customers | Reports    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Welcome, [Staff Name]!  [Change Password] [Logout]         │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│ │ TODAY'S     │ │ ORDERS IN   │ │ REVENUE     │           │
│ │ ORDERS      │ │ PROGRESS    │ │ TODAY       │           │
│ │ 5           │ │ 8           │ │ $1,450.00   │           │
│ └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ORDERS READY FOR PICKUP (Today)                         │ │
│ │                                                         │ │
│ │ Order #5001 - Sarah Johnson - 2:00 PM                 │ │
│ │ Order #5003 - Michael Chen - 3:00 PM                  │ │
│ │ Order #5005 - James Martinez - 4:00 PM                │ │
│ │                                                         │ │
│ │ [View All Orders]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ RECENT ACTIVITY                                         │ │
│ │                                                         │ │
│ │ 11:05 AM - New order created #5012                    │ │
│ │ 11:00 AM - Order #5009 status updated to Decorating   │ │
│ │ 10:45 AM - New customer: Lisa Taylor                  │ │
│ │                                                         │ │
│ │ [View All Activity]                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐                    │
│ │ New  │ │View  │ │View  │ │Manager   │                   │
│ │Order │ │Orders│ │Custs │ │Dashboard │                   │
│ └──────┘ └──────┘ └──────┘ └──────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**Components:**
- Header: Logo, navigation tabs
- User greeting
- 3 KPI stat cards (today's orders, in progress, revenue) ** **note - is revenue today relebant to non mgmt?**
- Orders ready for pickup (list, limit 5)
- Recent activity feed (limit 5 items)
- Quick action buttons

**Data Required:**
- User name, role
- Today's order count
- In progress order count
- Today's revenue total 
- Orders ready today (list: Order ID, Customer, Pickup Time)
- Recent activity (last 5: timestamp, action, object)

**Responsive:**
- Mobile: Single column, stat cards stack, full width
- Tablet: Single column, stat cards in 2 columns
- Desktop: Stat cards in 3 columns, activity side-by-side

**Accessibility:**
- Stat cards are links (clickable) or have buttons
- Status indicators use color + text (not color alone)
- Tab through all quick action buttons

---

### 3. Orders List Page

**Route:** `/orders`  
**Access:** Authenticated users  ** **note - maybe all roles**
**Purpose:** Browse all orders with search and filters

**Wireframe:**
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Dashboard | [Orders] | Customers | Reports  │
├─────────────────────────────────────────────────────────────┤
│ [+ New Order]                                               │
│                                                             │
│ Search: [_________________]                                │
│ Status: [All ▼] Date Range: [Today ▼]                     │
│                                                             │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Order ID | Customer | Date | Pickup | Status | Price   │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 5001     │ Sarah   │ Nov5 │ Nov15  │ Ready  │ $95.00   │ │
│ │          │ Johnson │      │ 2:00PM │        │          │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 5003     │ Michael │ Nov5 │ Nov18  │ Baking │ $120.00  │ │
│ │          │ Chen    │      │ 3:00PM │        │          │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 5005     │ James   │ Nov5 │ Nov16  │ Decor  │ $150.00  │ │
│ │          │ Martinez│      │ 4:00PM │        │          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                             │
│ Showing 1-20 of 47 orders                                  │
│ [< Previous] Page 1 [Next >]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**Components:**
- New Order button (prominent)
- Search box (Order ID or Customer name)  **note - maybe search by more or dropdown**
- Filter dropdowns: Status, Date Range 
- Data table with sortable columns
- Row click → Order Detail
- Pagination controls

**Data Required:**
- Order ID, Customer Name, Order Date, Pickup Date, Pickup Time, Status, Total Price  **note - go back to recent erd**
- Sorting: By date, customer, status, price
- Filtering: By status (multiselect), date range

**Columns:**
| Column | Data Type | Sortable | Filterable |
|--------|-----------|----------|-----------|
| Order ID | INT | Yes | No |
| Customer | VARCHAR | Yes | No |
| Date | DATE | Yes | Yes |
| Pickup | DATE TIME | Yes | Yes |
| Status | VARCHAR | Yes | Yes |
| Price | DECIMAL | Yes | No |

**Status Badge Colors:**
- To Be Created: Blue (#3B82F6)
- In Baking: Amber (#F59E0B)
- Decorating: Purple (#A855F7)
- Ready for Pickup: Green (#10B981)
- Picked Up: Gray (#6B7280)
- Cancelled: Red (#EF4444)

**Responsive:**
- Mobile: Horizontal scroll for table, show Order ID + Customer + Status
- Tablet: Show 5 columns (hide Price)
- Desktop: Show all 6 columns

---

### 4. New Order Wizard (6 Steps)  **note - CLARIFICATION NEEDED**

**Route:** `/orders/new`  
**Access:** Sales staff only   **note - maybe all roles**
**Purpose:** Multi-step order creation

**Overall Structure:**
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Dashboard | Orders | Customers | Reports    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ NEW ORDER                                                   │
│                                                             │
│ [Customer] [Product] [Layers] [Delivery] [Pricing] [Review]│
│     ●---------●---------●--------●---------●----------●    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Step content here]                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Back] (disabled if Step 1)      [Next] or [Create Order]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**Step 1: Customer Selection**
\`\`\`
┌────────────────────────────────────────┐
│ SELECT CUSTOMER                        │
│                                        │
│ Search: [_________________] [Search]  │
│                                        │
│ OR [+ Create New Customer]             │
│                                        │
│ Recent Customers:                      │
│ ☐ Sarah Johnson (5 orders, $1250)    │
│ ☐ Michael Chen (3 orders, $895)      │
│ ☐ Jessica Williams (1 order, $120)   │
│                                        │
│ Search Results:                        │
│ (none shown until search)              │
│                                        │
└────────────────────────────────────────┘
\`\`\`

**Step 2: Product Selection**  **note - drop down menus**
\`\`\`
┌────────────────────────────────────────┐
│ SELECT BASE PRODUCT                    │
│                                        │
│ ☐ Vanilla Cake ($40 base)             │
│ ☐ Chocolate Cake ($40 base)           │
│ ☐ Marble Cake ($42 base, +$2)         │
│ ☐ Strawberry Cake ($43 base, +$3)     │
│                                        │
│ SELECT CAKE SIZE                       │
│                                        │
│ ☐ Small (4-6 servings, $40)           │
│ ☐ Medium (8-10 servings, $55)         │
│ ☐ Large (12-14 servings, $75)    ✓    │
│ ☐ XL (16-18 servings, $95)            │
│                                        │
│ Total (before layers): $75.00          │
│                                        │
└────────────────────────────────────────┘
\`\`\`

**Step 3: Layers (see LayerRepeater component)**
\`\`\`
┌────────────────────────────────────────┐
│ CUSTOMIZE LAYERS                       │
│                                        │
│ Layer 1 (Bottom)          [✕ Delete]  │
│ ┌──────────────────────────────────┐  │
│ │ Flavor:    [Chocolate ▼]         │  │
│ │ Filling:   [Ganache ▼]           │  │
│ │ Icing:     [Buttercream ▼]       │  │
│ │ Color:     [White ▼]             │  │
│ │ Notes:     [________________]     │  │
│ │ Image:     [Choose File]          │  │
│ └──────────────────────────────────┘  │
│                                        │
│ Layer 2 (Middle)          [✕ Delete]  │
│ ┌──────────────────────────────────┐  │
│ │ Flavor:    [Vanilla ▼]           │  │
│ │ ... (same fields)                │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [+ Add Layer]  (Max 7)                 │
│                                        │
└────────────────────────────────────────┘
\`\`\`

**Step 4: Delivery Details**  **note - word as pickup details so no confusion**
\`\`\`
┌────────────────────────────────────────┐
│ DELIVERY DETAILS                       │
│                                        │
│ Pickup Date:                           │
│ [________________] (min 2 days advance)│
│                                        │
│ Pickup Time:                           │
│ [________________] (optional)          │
│                                        │
│ Special Requests:                      │
│ [____________________________]          │
│ (max 500 chars)                        │
│                                        │
└────────────────────────────────────────┘
\`\`\`

**Step 5: Pricing**
\`\`\`
┌────────────────────────────────────────┐
│ PRICING & DEPOSIT                      │
│                                        │
│ Base Price:             $75.00         │
│ Layer Adjustments:      +$5.00         │
│ ─────────────────────────────          │
│ TOTAL FIRM PRICE:       $80.00 ✓       │
│ [Edit Price]                           │
│                                        │
│ Deposit Amount (min 50%): $40.00       │
│ [________________]                     │
│                                        │
│ Balance Due:            $40.00         │
│                                        │
│ [Deposit $40.00] [Deposit $50.00]     │
│                                        │
└────────────────────────────────────────┘
\`\`\`

**Step 6: Review**
\`\`\`
┌────────────────────────────────────────┐
│ REVIEW ORDER                           │
│                                        │
│ Customer: Sarah Johnson                │
│ Email: sarah@example.com               │
│                                        │
│ Product: Chocolate Cake (Large)        │
│ Layers: 2                              │
│                                        │
│ Layer 1: Chocolate, Ganache, White     │
│ Layer 2: Vanilla, Vanilla, White       │
│                                        │
│ Pickup: Nov 15, 2025 @ 2:00 PM         │
│                                        │
│ Total Price:   $80.00                  │
│ Deposit:       $40.00                  │
│ Balance Due:   $40.00                  │  **note - balance due at pickup**
│                                        │
│ [Back] [Edit] [Create Order]           │
│                                        │
└────────────────────────────────────────┘
\`\`\`

**Step Validations:**
- Step 1: Customer required
- Step 2: Product and size required
- Step 3: At least 1 layer, max 7, all fields filled
- Step 4: Pickup date >= today + 2 days
- Step 5: Price > $20, deposit >= 50%
- Step 6: Review and confirm

---

### 5. Order Detail Page

**Route:** `/orders/:id`  
**Access:** All authenticated users   **note - maybe all roles**
**Purpose:** View and edit single order

**Wireframe:**
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Dashboard | Orders | Customers | Reports    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ORDER #5001                            [Print] [Edit] [More]│
│                                                             │
│ Status: READY FOR PICKUP                                   │
│ Created: Nov 5, 2025 @ 11:00 AM                            │
│ Last Updated: Nov 5, 2025 @ 2:00 PM                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ CUSTOMER                               PICKUP              │
│ Sarah Johnson                          Nov 15, 2025        │
│ sarah@example.com                      2:00 PM             │
│ (713) 555-0101                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ CAKE DETAILS                                               │
│ Product: Chocolate Cake (Large)                            │
│ Layers: 2                                                  │
│                                                             │
│ ▸ Layer 1 (Bottom)                                         │
│   Flavor: Chocolate | Filling: Ganache                    │
│   Icing: Buttercream | Writing: White                     │
│   Notes: Extra filling                                     │
│   [Image: design.jpg]                                      │
│                                                             │
│ ▸ Layer 2 (Top)                                            │
│   Flavor: Vanilla | Filling: Vanilla                      │
│   Icing: Buttercream | Writing: White                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ PRICING                                                    │
│ Base Price:        $75.00                                  │
│ Adjustments:       +$5.00                                  │
│ Total Price:       $80.00                                  │
│ Deposit Paid:      $40.00                                  │
│ Balance Due:       $40.00                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ UPDATE STATUS                                              │
│ Current: Ready for Pickup                                  │
│ Change to: [Picked Up ▼]                                   │
│ [Confirm]                                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STATUS HISTORY                                             │
│ Nov 5, 2:00 PM  - Updated to Ready for Pickup             │
│ Nov 5, 1:00 PM  - Updated to Decorating                   │
│ Nov 5, 11:00 AM - Created (To Be Created)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**Components:**
- Order header (ID, status, dates)
- Customer section (name, contact, history link)
- Pickup section (date, time, special requests)
- Cake details (collapsible layers with customizations)
- Pricing breakdown
- Status update dropdown
- Status history timeline
- Action buttons (Print, Edit, Cancel)

**Responsive:**
- Mobile: Single column, collapsible sections
- Desktop: Two-column layout where appropriate

---

### 6-8. Customer Pages

**Routes:**
- `/customers` - List
- `/customers/new` - Create
- `/customers/:id` - Detail

**Similar structure to Orders pages with customer-specific content:**
- Name, email, phone, address
- Order history (list of previous orders)
- Total spending
- Preferred customer indicator
- Edit button
- Delete button (manager only)

---

### 9. Manager Dashboard

**Route:** `/reports/dashboard`  
**Access:** Manager role only  
**Purpose:** Business analytics and revenue tracking

(Full specs in 10_REPORTS_AND_ANALYTICS_SPEC.md)

---

### 10-13. Admin Pages

**Routes:**
- `/admin/options` - Product configuration
- `/admin/staff` - Staff management
- `/admin/settings` - System settings
- `/account/profile` - User profile

**Admin Options:**
- Manage Flavors (add/edit/delete)
- Manage Fillings
- Manage Icings
- Manage Writing Colors
- Manage Cake Sizes
- Manage Accessories

---

## Related Documents

- **02_INFORMATION_ARCHITECTURE.md** - User flows and navigation
- **03_UI_STYLE_GUIDE_COMPONENTS.md** - Design system and components
- **08_API_SPEC_AND_ENDPOINTS.md** - Backend data requirements
- **09_FRONTEND_IMPLEMENTATION.md** - React component implementation

---

**Status:** Production Ready  
**Last Updated:** November 5, 2025
