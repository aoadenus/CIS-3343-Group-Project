# Role-Based Interface System Proposal
## Multi-User GUI Architecture for Emily Bakes Cakes

---

## 📋 EXECUTIVE SUMMARY

**Project:** Role-Based User Interface System  
**Version:** 1.0  
**Status:** Proposal  
**Prepared For:** CIS 3343 Fall 2025 - Emily Bakes Cakes  
**Date:** November 2025

### **Vision**

Transform Emily Bakes Cakes from a single administrative interface into a **comprehensive multi-user system** where each staff role has a specialized, purpose-built interface optimized for their daily workflow.

### **The Problem**

**Current State:**
- ❌ One "admin" interface for all staff
- ❌ Bakers see features they don't need (analytics, customer management)
- ❌ Accountants navigate through irrelevant order creation screens
- ❌ No workflow optimization per role
- ❌ Information overload for specialized tasks

**Business Impact:**
- Time wasted navigating irrelevant features (est. 2-3 hrs/week per employee)
- Increased error rate due to complex UI
- Poor user experience for non-technical staff
- Training difficulty for new employees

### **The Solution**

Create **6 specialized user interfaces**, each tailored to a specific role mentioned in the case study:

1. 🎨 **Customer Public Website** (Existing - Enhanced)
2. 💼 **Sales Staff Interface** (Task-focused order creation)
3. 🍰 **Baker Dashboard** (Production queue & status updates)
4. 🎂 **Decorator Workstation** (Design review & decoration workflow)
5. 💰 **Accountant Portal** (Financial management & reporting)
6. 👑 **Owner/Manager Dashboard** (Full system oversight & approvals)

---

## 🎯 BUSINESS OBJECTIVES

### **Case Study Role Alignment**

| Role (from Case Study) | Current Access | Proposed Interface | Priority |
|----------------------|----------------|-------------------|----------|
| **Emily (Owner)** | Admin portal | Enhanced Owner Dashboard | HIGH |
| **James (Manager)** | Admin portal | Manager Dashboard | HIGH |
| **Sales Staff** | Admin portal | Sales-Focused UI | HIGH |
| **Bakers** | None | Baker Dashboard | CRITICAL |
| **Decorators** | None | Decorator Workstation | CRITICAL |
| **Dan (Accountant)** | None | Accountant Portal | MEDIUM |
| **Customers** | Public website | Enhanced Customer Portal | HIGH |

### **Benefits by Stakeholder**

**Emily (Owner)**
- Real-time oversight of all operations
- Quick approval workflows
- Business intelligence at a glance
- Staff performance tracking

**James (Manager)**
- Workload distribution tools
- Employee assignment
- Quality control approvals
- Operational metrics

**Sales Staff**
- Streamlined order creation (60% faster)
- Customer lookup with history
- Real-time product availability
- Digital signature capture

**Bakers**
- Clear production queue
- Simple status updates
- Recipe access
- Timer management

**Decorators**
- Visual order gallery
- Inspiration image viewer
- Design complexity indicator
- Quality checklist

**Dan (Accountant)**
- Financial dashboard
- Payment reconciliation
- Tax reporting
- Bank deposit tracking

---

## 🏗️ INTERFACE ARCHITECTURE

### **System-Wide Navigation Flow**

```
                    ┌─────────────────────────┐
                    │   LOGIN PORTAL          │
                    │   /login                │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Authentication Check   │
                    │  Verify Role            │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │                                               │
    ┌────▼─────┐  ┌──────────┐  ┌────────┐  ┌──────────┐
    │  Owner/  │  │  Sales   │  │ Baker  │  │Decorator │
    │ Manager  │  │  Staff   │  │   UI   │  │    UI    │
    └──────────┘  └──────────┘  └────────┘  └──────────┘
                                                         
    ┌──────────┐  ┌──────────┐
    │Accountant│  │ Customer │
    │  Portal  │  │  Public  │
    └──────────┘  └──────────┘
```

### **Role Redirection Logic**

```typescript
// server/middleware/roleRouter.ts

export function redirectByRole(req: Request, res: Response, next: NextFunction) {
  const user = req.user; // Set by auth middleware
  
  const roleRoutes = {
    'owner': '/owner/dashboard',
    'manager': '/manager/dashboard',
    'sales': '/sales/orders',
    'baker': '/baker/queue',
    'decorator': '/decorator/workstation',
    'accountant': '/accountant/financial'
  };
  
  if (req.path === '/dashboard') {
    return res.redirect(roleRoutes[user.role] || '/');
  }
  
  next();
}
```

---

## 💼 INTERFACE #1: SALES STAFF UI

### **Purpose**
Streamlined order creation and customer management for front-desk staff.

### **Key Features**
1. ✅ **Quick Order Creation Wizard**
2. ✅ **Customer Search & History**
3. ✅ **Real-Time Pricing Calculator**
4. ✅ **Deposit Collection**
5. ✅ **Pickup Scheduling**

### **Screen Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  Emily Bakes Cakes - Sales Staff                    [Sarah] │
├─────────────────────────────────────────────────────────────┤
│  [New Order]  [Find Customer]  [Today's Pickups]  [Help]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Quick Actions:                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 📝 Custom    │  │ 🛒 Shop      │  │ 🎂 Standard  │     │
│  │ Cake Order   │  │ Product      │  │ Cake Order   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  Recent Orders:                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ #1052 - Lisa Thompson - 6" Vanilla - $45 - Pending  │  │
│  │ #1053 - Mark Johnson - 8" Chocolate - $60 - Paid ✓  │  │
│  │ #1054 - Sarah Lee - Custom 3-tier - $250 - Deposit ✓│  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Today's Pickups (8):                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 10:00 AM - Order #1048 - Maria Garcia - READY ✓     │  │
│  │ 2:00 PM  - Order #1049 - Tom Wilson - READY ✓       │  │
│  │ 4:00 PM  - Order #1050 - Emily Brown - In Progress   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Order Creation Workflow**

```
Step 1: Customer Selection
┌───────────────────────────────────┐
│ Find Customer                     │
│ ┌─────────────────────────────┐  │
│ │ 🔍 Search by name/phone...  │  │
│ └─────────────────────────────┘  │
│                                   │
│ [ ] New Customer                  │
│ [x] Existing: Lisa Thompson       │
│     📧 lisa.t@email.com           │
│     📱 (713) 555-0123             │
│     ⭐ VIP Customer (10% discount) │
│     📊 5 previous orders          │
│                                   │
│        [Continue →]               │
└───────────────────────────────────┘

Step 2: Order Type & Product
┌───────────────────────────────────┐
│ Select Product Type               │
│ ⚪ Standard Cake                  │
│ 🔵 Custom Cake ✓                  │
│ ⚪ Shop Product                   │
│                                   │
│ Occasion: [Birthday ▼]            │
│ Event Date: [11/15/2025]          │
│ Event Time: [3:00 PM]             │
│                                   │
│        [Continue →]               │
└───────────────────────────────────┘

Step 3: Customization (Custom Builder)
┌───────────────────────────────────┐
│ Build Your Cake                   │
│ Layers: 2                         │
│                                   │
│ Layer 1 (Bottom):                 │
│   Flavor: [Vanilla ▼]             │
│   Fillings: [Strawberry] [+]      │
│                                   │
│ Layer 2 (Top):                    │
│   Flavor: [Chocolate ▼]           │
│   Fillings: [Buttercream] [+]     │
│                                   │
│ Icing: [Cream Cheese ▼]           │
│ Message: [Happy Birthday Lisa!]   │
│                                   │
│ 📸 Upload Inspiration (0/5)       │
│                                   │
│ Estimated Price: $65.00           │
│ VIP Discount (10%): -$6.50        │
│ Total: $58.50                     │
│                                   │
│        [Continue →]               │
└───────────────────────────────────┘

Step 4: Payment
┌───────────────────────────────────┐
│ Payment Collection                │
│ Total Amount: $58.50              │
│ Deposit Required (50%): $29.25    │
│                                   │
│ Deposit Received: [$29.25]        │
│ Payment Method:                   │
│ ⚪ Cash                           │
│ 🔵 Credit Card ✓                  │
│ ⚪ Debit Card                     │
│                                   │
│ Balance Due: $29.25               │
│ (Due at pickup)                   │
│                                   │
│ [Process Card] [Complete Order]   │
└───────────────────────────────────┘
```

### **Sales Staff Permissions**

```typescript
const salesPermissions = [
  'customers:read',
  'customers:create',
  'customers:update', // own customers only
  'orders:create',
  'orders:read',
  'orders:update', // status: pending only
  'products:read',
  'payments:create',
  'payments:read',
  'inquiries:read',
  'inquiries:respond'
];
```

---

## 🍰 INTERFACE #2: BAKER DASHBOARD

### **Purpose**
Simple, focused production queue for baking staff.

### **Key Features**
1. ✅ **Production Queue (Kanban-style)**
2. ✅ **One-Click Status Updates**
3. ✅ **Timer Management**
4. ✅ **Recipe Quick Access**
5. ✅ **Ingredient Checklist**

### **Screen Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  🍰 Baker Dashboard                            [Mike - Baker]│
├─────────────────────────────────────────────────────────────┤
│  My Queue (4) │ Today's Schedule │ Recipes │ [Clock Out]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TO BAKE                    BAKING               COMPLETE   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │ Order #1055  │   │ Order #1053  │   │ Order #1051  │   │
│  │ 6" Vanilla   │   │ 8" Chocolate │   │ 10" Red Velvet│  │
│  │ Due: 2:00 PM │   │ ⏱️ 15 min    │   │ ✅ Ready     │   │
│  │ [Start Baking]│  │              │   │              │   │
│  │              │   │ [Mark Done]  │   │ [To Decorator]│  │
│  ├──────────────┤   └──────────────┘   └──────────────┘   │
│  │ Order #1056  │                                          │
│  │ Custom 3-tier│                                          │
│  │ 🔴 RUSH      │                                          │
│  │ Due: 10:00 AM│                                          │
│  │ [Start Baking]│                                         │
│  └──────────────┘                                          │
│                                                              │
│  🔔 Alerts:                                                 │
│  ⚠️ Order #1056 needs to start NOW (rush order)            │
│  ℹ️ Low inventory: Vanilla extract (reorder needed)        │
└─────────────────────────────────────────────────────────────┘
```

### **Order Detail View (Baker)**

```
┌───────────────────────────────────┐
│ Order #1053 - Baker View          │
├───────────────────────────────────┤
│ Customer: Mark Johnson            │
│ Product: 8" Chocolate Round       │
│ Event Date: Nov 12, 3:00 PM       │
│ Completion Deadline: Nov 12, 11 AM│
│                                   │
│ 📋 Baking Instructions:           │
│ ┌─────────────────────────────┐  │
│ │ ✓ Preheat oven to 350°F     │  │
│ │ ✓ Prepare 2x 8" pans        │  │
│ │ ○ Mix dry ingredients       │  │
│ │ ○ Combine wet ingredients   │  │
│ │ ○ Bake 25-30 minutes        │  │
│ │ ○ Cool completely           │  │
│ │ ○ Apply crumb coat          │  │
│ └─────────────────────────────┘  │
│                                   │
│ Layers:                           │
│ • Layer 1: Devil's Food Chocolate │
│   Filling: Chocolate Buttercream  │
│ • Layer 2: Devil's Food Chocolate │
│   Filling: None                   │
│                                   │
│ ⏱️ Timer: [Start Timer]           │
│                                   │
│ Status: Baking                    │
│ [Mark Complete] [Need Help]       │
└───────────────────────────────────┘
```

### **Baker Permissions**

```typescript
const bakerPermissions = [
  'orders:read', // assigned orders only
  'orders:update_status', // to 'baking', 'baking_complete'
  'products:read',
  'recipes:read',
  'inventory:read',
  'inventory:flag_low_stock'
];
```

---

## 🎂 INTERFACE #3: DECORATOR WORKSTATION

### **Purpose**
Visual, design-focused interface for decoration staff.

### **Key Features**
1. ✅ **Visual Order Gallery**
2. ✅ **Inspiration Image Viewer**
3. ✅ **Design Complexity Indicator**
4. ✅ **Quality Checklist**
5. ✅ **Customer Communication Log**

### **Screen Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  🎨 Decorator Workstation                    [Anna - Master]│
├─────────────────────────────────────────────────────────────┤
│  Awaiting Decoration │ In Progress │ Completed │ [Gallery] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AWAITING DECORATION                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ [Image]      │  │ [Image]      │  │ [Image]      │     │
│  │ Order #1057  │  │ Order #1058  │  │ Order #1059  │     │
│  │ Wedding Cake │  │ Birthday     │  │ Anniversary  │     │
│  │ 🌟🌟🌟 Complex│  │ 🌟 Simple    │  │ 🌟🌟 Medium   │     │
│  │ Due: Nov 10  │  │ Due: Nov 11  │  │ Due: Nov 12  │     │
│  │ [Start Work] │  │ [Start Work] │  │ [Start Work] │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  IN PROGRESS                                                │
│  ┌──────────────────────────────────────────┐              │
│  │ Order #1055 - Custom Birthday Cake       │              │
│  │ ⏱️ Started: 9:30 AM (2 hours ago)         │              │
│  │                                          │              │
│  │ 📸 Customer Inspiration (3 images):      │              │
│  │ [🖼️ Image 1] [🖼️ Image 2] [🖼️ Image 3]  │              │
│  │                                          │              │
│  │ Design Notes:                            │              │
│  │ "Pink roses with gold accents, name on   │              │
│  │  top in cursive script"                  │              │
│  │                                          │              │
│  │ Quality Checklist:                       │              │
│  │ ✓ Base icing smooth                     │              │
│  │ ✓ Roses piped (12/15 done)              │              │
│  │ ○ Gold leaf applied                     │              │
│  │ ○ Name written                          │              │
│  │ ○ Final touches                         │              │
│  │                                          │              │
│  │ [Mark Complete] [Need Approval]         │              │
│  └──────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### **Design Complexity Calculator**

```typescript
// Automatically calculates complexity based on order details

interface ComplexityFactors {
  tiers: number;              // Multi-tier = higher complexity
  decorationTypes: string[];  // Fondant, sugar flowers, etc.
  customDesign: boolean;      // Custom vs. standard
  colorCount: number;         // Multiple colors harder
  photoReplication: boolean;  // Trying to match photo
  timeSensitive: boolean;     // Rush order
}

function calculateComplexity(order: Order): 1 | 2 | 3 {
  let score = 0;
  
  if (order.layers.length > 2) score += 2;
  if (order.decorationTypes.includes('fondant')) score += 2;
  if (order.customDesign) score += 1;
  if (order.inspirationImages.length > 0) score += 1;
  if (order.isRushOrder) score += 1;
  
  if (score >= 5) return 3; // 🌟🌟🌟 Complex
  if (score >= 2) return 2; // 🌟🌟 Medium
  return 1;                 // 🌟 Simple
}
```

### **Decorator Permissions**

```typescript
const decoratorPermissions = [
  'orders:read', // assigned orders only
  'orders:update_status', // to 'decorating', 'awaiting_approval'
  'orders:add_notes',
  'customers:read', // for clarification questions
  'customers:message', // can send questions
  'products:read',
  'images:view', // inspiration images
  'designs:save' // save custom designs to library
];
```

---

## 💰 INTERFACE #4: ACCOUNTANT PORTAL

### **Purpose**
Financial management, payment tracking, and reporting for Dan (CPA).

### **Key Features**
1. ✅ **Financial Dashboard**
2. ✅ **Payment Reconciliation**
3. ✅ **Deposit Tracking**
4. ✅ **Tax Reporting**
5. ✅ **Cash Register Reconciliation**

### **Screen Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  💰 Accountant Portal                         [Dan - CPA]   │
├─────────────────────────────────────────────────────────────┤
│  Dashboard │ Payments │ Deposits │ Reports │ Tax Docs │    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Financial Summary - November 2025                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│  │ Monthly Revenue│ │ Outstanding    │ │ Deposit Rate   │ │
│  │  $18,450       │ │  $3,200        │ │  94%           │ │
│  │  ↑ 12% vs Oct  │ │  8 orders      │ │  ↑ 2%         │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ │
│                                                              │
│  Today's Payments to Reconcile (5):                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Order #1053 - $60.00 - Credit Card - ✓ Deposited    │  │
│  │ Order #1054 - $125.00 - Cash - ⚠️ Needs Deposit      │  │
│  │ Order #1055 - $58.50 - Credit Card - ✓ Deposited    │  │
│  │ Order #1056 - $250.00 - Check #4521 - ⏳ Pending    │  │
│  │ Order #1057 - $45.00 - Cash - ⚠️ Needs Deposit       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Outstanding Balances:                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Lisa Thompson - Order #1048 - $25.00 due at pickup  │  │
│  │ Mark Johnson - Order #1049 - $30.00 due at pickup   │  │
│  │ Sarah Lee - Order #1050 - $125.00 balance due        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Quick Actions:                                             │
│  [Record Payment] [Bank Deposit] [Generate Report]         │
└─────────────────────────────────────────────────────────────┘
```

### **Payment Reconciliation Flow**

```
┌───────────────────────────────────┐
│ Cash Register Reconciliation      │
├───────────────────────────────────┤
│ Date: November 5, 2025            │
│ Register: Front Desk #1           │
│ Cashier: Sarah (Sales Staff)      │
│                                   │
│ Expected (from system):           │
│ Cash: $485.00                     │
│ Credit: $1,240.00                 │
│ Total: $1,725.00                  │
│                                   │
│ Actual Count:                     │
│ Cash: [$485.00]                   │
│ Credit Card Receipts: [$1,240.00] │
│                                   │
│ Difference: $0.00 ✓               │
│                                   │
│ Notes: [All transactions match]   │
│                                   │
│ [Reconcile & Lock] [Report Issue] │
└───────────────────────────────────┘
```

### **Accountant Permissions**

```typescript
const accountantPermissions = [
  'payments:read',
  'payments:create',
  'payments:reconcile',
  'orders:read', // for payment context
  'customers:read', // for billing
  'reports:financial',
  'reports:tax',
  'reports:export',
  'analytics:revenue',
  'deposits:track',
  'deposits:record'
];
```

---

## 👑 INTERFACE #5: OWNER/MANAGER DASHBOARD

### **Purpose**
Comprehensive oversight and control for Emily and James.

### **Key Features**
1. ✅ **Full System Access**
2. ✅ **Approval Workflows**
3. ✅ **Employee Management**
4. ✅ **Business Intelligence**
5. ✅ **System Configuration**

### **Screen Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  👑 Owner Dashboard                              [Emily]    │
├─────────────────────────────────────────────────────────────┤
│  Overview│Orders│Customers│Employees│Analytics│Settings│   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Business Summary - Today                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ Orders  │ │ Revenue │ │ Pending │ │ Team    │         │
│  │ Today   │ │ Today   │ │ Approval│ │ Active  │         │
│  │   8     │ │ $645    │ │   2     │ │  5/6    │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                              │
│  🔔 Requires Your Attention (3):                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ⚠️ Order #1057 - Custom Wedding Cake                 │  │
│  │    Awaiting final approval before delivery           │  │
│  │    [Review & Approve] [Request Changes]              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ ⚠️ Order #1056 - Rush Order (Same Day)               │  │
│  │    Customer requested exception to 2-day rule        │  │
│  │    [Approve Exception] [Decline]                     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ ℹ️ Low Inventory Alert: Vanilla Extract             │  │
│  │    Current: 2 bottles | Reorder Point: 5 bottles    │  │
│  │    [Order Supplies] [Dismiss]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Team Performance:                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Mike (Baker)    - 4 orders completed today    ⭐⭐⭐  │  │
│  │ Anna (Decorator)- 3 orders in progress        ⭐⭐⭐  │  │
│  │ Sarah (Sales)   - 5 orders created today      ⭐⭐    │  │
│  │ Tom (Baker)     - 2 orders (running behind)   ⚠️      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Approval Workflow**

```
┌───────────────────────────────────┐
│ Order Approval - #1057            │
├───────────────────────────────────┤
│ Customer: Jennifer Martinez       │
│ Product: 3-Tier Wedding Cake      │
│ Event: November 15, 2025          │
│                                   │
│ 📸 Final Product Photo:           │
│ [Large image of completed cake]   │
│                                   │
│ Decorator Notes:                  │
│ "All specifications met. Used     │
│  fresh sugar flowers as requested.│
│  Customer approved color via text."│
│                                   │
│ Quality Checklist:                │
│ ✓ Matches inspiration images      │
│ ✓ All decorations secure          │
│ ✓ Customer specifications met     │
│ ✓ Structural integrity confirmed  │
│ ✓ Ready for safe transport        │
│                                   │
│ Your Decision:                    │
│ ⚪ Approve for Pickup             │
│ ⚪ Request Minor Fixes            │
│ ⚪ Reject (Remake Required)       │
│                                   │
│ Notes: [Optional feedback]        │
│                                   │
│ [Submit Approval]                 │
└───────────────────────────────────┘
```

### **Owner/Manager Permissions**

```typescript
const ownerPermissions = [
  'ALL:*', // Full system access
  'employees:manage',
  'settings:modify',
  'rules:configure',
  'orders:approve',
  'orders:override',
  'customers:manage',
  'products:manage',
  'reports:all',
  'analytics:all',
  'system:configure'
];
```

---

## 🎨 SHARED UI COMPONENTS

### **Design System Consistency**

All interfaces share:
- ✅ Same color palette (Vanilla Raspberry)
- ✅ Consistent navigation patterns
- ✅ Standard button styles
- ✅ Unified typography
- ✅ Common modals and dialogs
- ✅ Shared notification system

```typescript
// Shared Components Library

/src/components/shared/
├── Navigation/
│   ├── TopBar.tsx          // Role-specific top bar
│   ├── SideMenu.tsx        // Collapsible side navigation
│   └── UserMenu.tsx        // Profile, settings, logout
├── Cards/
│   ├── OrderCard.tsx       // Reusable order display
│   ├── CustomerCard.tsx
│   └── StatCard.tsx
├── Forms/
│   ├── FormField.tsx
│   ├── DatePicker.tsx
│   └── FileUpload.tsx
└── Feedback/
    ├── Toast.tsx           // Notifications
    ├── LoadingSpinner.tsx
    └── EmptyState.tsx
```

---

## 🔐 SECURITY & ACCESS CONTROL

### **Route Protection**

```typescript
// src/components/ProtectedRoute.tsx

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}

// Usage in routes
<Route path="/baker/queue" element={
  <ProtectedRoute allowedRoles={['baker', 'owner', 'manager']}>
    <BakerQueue />
  </ProtectedRoute>
} />
```

### **Feature Flags**

```typescript
// Fine-grained feature control within interfaces

interface FeaturePermissions {
  canApprove: boolean;
  canDelete: boolean;
  canExport: boolean;
  canViewFinancials: boolean;
}

function getFeatures(role: string): FeaturePermissions {
  const features = {
    owner: { canApprove: true, canDelete: true, canExport: true, canViewFinancials: true },
    manager: { canApprove: true, canDelete: true, canExport: true, canViewFinancials: true },
    sales: { canApprove: false, canDelete: false, canExport: false, canViewFinancials: false },
    baker: { canApprove: false, canDelete: false, canExport: false, canViewFinancials: false },
    decorator: { canApprove: false, canDelete: false, canExport: false, canViewFinancials: false },
    accountant: { canApprove: false, canDelete: false, canExport: true, canViewFinancials: true }
  };
  
  return features[role];
}
```

---

## 📱 RESPONSIVE DESIGN

All interfaces are **fully responsive** and optimized for:

- 💻 **Desktop** (Primary use case for staff)
- 📱 **Tablet** (Bakers/decorators in kitchen)
- 📱 **Mobile** (Quick status checks, notifications)

### **Mobile-First Baker Interface**

```
┌──────────────────┐
│ 🍰 My Queue      │
│       [Mike]  ☰  │
├──────────────────┤
│                  │
│ NEXT TO BAKE:    │
│                  │
│ Order #1055      │
│ 6" Vanilla Round │
│ Due: 2:00 PM     │
│ [START BAKING]   │
│                  │
│ BAKING NOW:      │
│                  │
│ Order #1053      │
│ 8" Chocolate     │
│ ⏱️ 15 min left   │
│                  │
│ [MARK COMPLETE]  │
│                  │
│ ✓ Completed: 3   │
│ ⚠️ Behind: 0     │
└──────────────────┘
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **Phase 1: Core Interfaces (4 weeks)**

**Week 1-2:** Authentication & Sales Staff UI
- Login system with role redirection
- Sales staff streamlined order creation
- Customer lookup with history

**Week 3-4:** Baker & Decorator Dashboards
- Baker production queue
- Decorator workstation with visual gallery
- Status update workflows

### **Phase 2: Financial & Management (3 weeks)**

**Week 5-6:** Accountant Portal
- Payment reconciliation
- Financial dashboard
- Reporting tools

**Week 7:** Owner/Manager Dashboard
- Approval workflows
- Business intelligence
- System oversight

### **Phase 3: Polish & Optimization (1 week)**

**Week 8:** Testing & Refinement
- User acceptance testing with staff
- Performance optimization
- Mobile responsiveness
- Bug fixes

**Total Timeline:** 8 weeks

---

## 📊 SUCCESS METRICS

### **User Satisfaction (by Role)**

| Role | Current Satisfaction | Target | Measurement |
|------|---------------------|--------|-------------|
| Sales Staff | 3/5 | 4.5/5 | Weekly survey |
| Bakers | N/A (no interface) | 4/5 | Weekly survey |
| Decorators | N/A (no interface) | 4.5/5 | Weekly survey |
| Accountant | 2/5 (manual) | 5/5 | Weekly survey |
| Manager | 3.5/5 | 4.5/5 | Weekly survey |

### **Efficiency Gains**

| Task | Current Time | Target Time | Improvement |
|------|-------------|-------------|-------------|
| Create Order (Sales) | 8 min | 3 min | 62.5% |
| Update Status (Baker) | Manual | 10 sec | N/A |
| Payment Reconciliation | 45 min/day | 15 min/day | 67% |
| Approval Process | Email chain | 2 min | 90% |

### **Business Impact**

- ✅ Order creation time: **-62%**
- ✅ Staff training time: **-40%** (simpler interfaces)
- ✅ Error rate: **-50%** (fewer complex navigation steps)
- ✅ Employee satisfaction: **+30%**

---

## 💰 INVESTMENT ANALYSIS

### **Development Cost**

| Component | Hours | Rate | Cost |
|-----------|-------|------|------|
| UI/UX Design | 80 | $60/hr | $4,800 |
| Frontend Development | 200 | $75/hr | $15,000 |
| Backend Integration | 80 | $75/hr | $6,000 |
| Testing & QA | 40 | $50/hr | $2,000 |
| **Total** | **400** | - | **$27,800** |

### **ROI Calculation**

**Annual Savings:**
- Time savings (all staff): **15 hrs/week × $25/hr × 52 weeks = $19,500**
- Error reduction: **$2,400** (fewer mistakes)
- Training cost reduction: **$1,500**
- **Total Annual Savings: $23,400**

**Payback Period:** $27,800 / $23,400 = **14.2 months**

---

## ✅ RECOMMENDATIONS

1. **Approve role-based interface development**
2. **Prioritize Phase 1 (Sales, Baker, Decorator)**
3. **Pilot with 2-3 staff members per role**
4. **Iterate based on feedback**
5. **Full rollout after successful pilot**

---

**Prepared By:** Emily Bakes Cakes Development Team  
**Document Version:** 1.0  
**Status:** Ready for Review  
**Next Step:** Stakeholder approval meeting

**CIS 3343 Fall 2025**
