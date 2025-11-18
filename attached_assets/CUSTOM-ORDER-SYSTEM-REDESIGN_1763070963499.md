# Emily Bakes Cakes – Custom Cake Order System Redesign
## A Web Designer's Framework for Fixing UX Issues & Solving Business Logic

---

## INTRO: THINKING OUT LOUD

Okay, let me break down what I'm seeing here. The current prototype is cute—it has personality, which is GOOD. But you're right: **it prioritizes aesthetics over usability**. Staff need to move fast. A baker doesn't want cute; they want **fast, clear, predictable, and bulletproof.**

Let me walk through the entire order creation system, identifying every issue, and then rebuild it from scratch with the case study as the single source of truth.

---

## CRITICAL UX ISSUES & FIXES

### **ISSUE #1: Dashboard KPIs Are Hidden Below the Fold**
**Problem:** Quick actions and system overview buried. Staff waste time scrolling.
**Root Cause:** Beautiful grid layout prioritizes visual appeal over task frequency.

**REDESIGN:**
- **Top Strip (Always Visible):** Sticky header with today's key numbers
  - "5 Orders Due Today" (RED if ≥3, AMBER if 1-2, GREEN if 0) — uses color for *meaning*, not decoration
  - "In Progress: 3 cakes" — status at a glance
  - "Revenue Today: $1,450" — for manager view only, hidden from baker/decorator
- **Quick Action Buttons (Prominent):** 
  - "New Order" (primary Raspberry, 48px tall, full width on mobile)
  - "Search Orders" (secondary outline)
  - These sit ABOVE the fold. Always.
- **Kanban Board or List (Below):** Orders grouped by status (To Be Created | In Baking | Decorating | Ready)
  - No pagination; scroll if needed. Real work doesn't fit in fixed containers.

**Design Principle:** Mobile-first, task-first. A baker on an iPhone should see "5 orders pending" and "New Order" button without scrolling.

---

### **ISSUE #2: Menu Labels Don't Match Page Titles**
**Problem:** Admin menu says "Business Analytics" but the page says "Sales Dashboard." Confusing navigation.
**Root Cause:** Disconnect between IA planning and development.

**REDESIGN:**
- **Single Source of Truth for Navigation:**
  1. Define each role's primary tasks
     - Sales: Customer → Orders → New Order → Tracking
     - Baker: Dashboard → In Baking → Ready → Print
     - Decorator: Dashboard → To Decorate → Decorating → Ready
     - Manager: All + Reports + Settings + Staff
  2. Menu label = Actual page title. Always.
  3. Highlight current page in menu (solid color, not subtle)
  
**Menu Structure (Updated):**
\`\`\`
📊 Dashboard
📋 Orders
👥 Customers
📈 Reports (Manager only)
⚙️ Settings (Manager/Admin only)
👤 Profile
\`\`\`

No more confusing labels like "Business Analytics."

---

### **ISSUE #3: Order Categorization by "Occasion" (Scope Violation)**
**Problem:** Occasion field exists but isn't in the case study. Staff confused about why it's there.
**Root Cause:** Feature creep. Someone thought "it would be nice to track occasions."

**REDESIGN — REMOVE IT:**
- Orders are orders. No "occasion" dropdown.
- If customer wants context, it goes in **Special Requests** during Step 4 (Pickup Details).
  - E.g., "Birthday cake for Sarah's 40th birthday — keep decorations elegant"
- One field per purpose. No redundancy.

**Why This Matters:** Less cognitive load. Fewer dropdowns to maintain. Cleaner data.

---

### **ISSUE #4: Custom Cake Builder – 1 Layer Only & "Design Style" Not in Scope**
**Problem:** Max 1 layer is nonsense (multi-tiered cakes are the business!). "Design Style" isn't a field.
**Root Cause:** Template copied from generic builder, not customized to Emily's actual products.

**REDESIGN — LAYER REPEATER:**

**Step 3: Customize Layers**

\`\`\`
⚠️  MINIMUM 2 LAYERS REQUIRED
All custom cakes must have at least 2 layers per bakery policy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYER 1 — BOTTOM
  ├─ Flavor      [Dropdown: Vanilla | Almond | Yellow | Devils Food Chocolate | Chocolate | Strawberry]
  ├─ Filling     [Dropdown: 15 options from case study]
  ├─ Icing       [Dropdown: 6 options from case study]
  ├─ Writing Color [Color Swatch: Red | Blue | Pink | Purple | Gold | Silver | Yellow | White | Green | Black]
  ├─ Special Notes [Text area: "Extra filling on this layer" / "Nut allergy — careful with fillings"]
  ├─ Design Image [Upload JPG/PNG: reference photo for decorator]
  └─ [Delete] button DISABLED (can't delete if only 1 layer)

LAYER 2 — MIDDLE
  [Same structure as Layer 1]
  └─ [Delete] button ENABLED (can delete, still leaves 1+ layer)

LAYER 3 — TOP
  [Same structure as Layer 1]
  └─ [Delete] button ENABLED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[+ Add Layer] button
├─ Enabled if < 7 layers
├─ Disabled if = 7 layers (show tooltip: "Maximum 7 layers")
└─ Clicking auto-numbers new layer (Layer 4, Layer 5, etc.)
\`\`\`

**Why This Works:**
- Repeater pattern is familiar from web development (Zapier, Airtable, etc.)
- Delete button disabled when only 1 layer (business rule enforced at UI)
- Add Layer button disabled at max (7 per case study)
- Color swatches with actual hex codes visible (not just a dropdown)
- Each layer independent (Layer 1 can be Chocolate Ganache, Layer 2 can be Vanilla Vanilla, Layer 3 can be Strawberry Cream Cheese)

**REMOVE "Design Style":**
- It's not in the scope. Don't invent fields.
- Decorator creativity happens during decoration (after order is placed).

---

### **ISSUE #5: No Breadcrumb Navigation**
**Problem:** Staff get lost; can't easily return to previous page.
**Root Cause:** SPA (single-page app) design doesn't use traditional bread trails.

**REDESIGN:**
\`\`\`
Dashboard > Orders > Order 5001 > [Current Page]
\`\`\`
Every page except Dashboard shows breadcrumbs:
- Clickable links (not just text)
- Appearance: Small text, 12px, Chocolate Brown, underline on hover
- Placement: Below header, above page title
- Mobile: Hamburger menu includes breadcrumb as secondary nav

---

### **ISSUE #6: Sales Staff Changing Order Status to "Pending" (Permission Violation)**
**Problem:** Who should be able to change order status? It's unclear.
**Root Cause:** No role-based permission matrix defined.

**REDESIGN — ROLE-BASED WORKFLOW:**

| Status Change | Sales | Baker | Decorator | Manager | Emily |
|---|---|---|---|---|---|
| To Be Created → In Baking | ❌ | ✅ | ❌ | ✅ | ✅ |
| In Baking → Cooling | ❌ | ✅ | ❌ | ✅ | ✅ |
| Cooling → Ready for Decoration | ❌ | ✅ | ❌ | ✅ | ✅ |
| Ready for Decoration → In Decorating | ❌ | ❌ | ✅ | ✅ | ✅ |
| In Decorating → Ready for Pickup | ❌ | ❌ | ✅ | ✅ | ✅ |
| Ready for Pickup → Picked Up | ✅ | ❌ | ❌ | ✅ | ✅ |
| ANY → Cancelled | ✅ | ✅ | ✅ | ✅ | ✅ |

**Implementation:**
- Dropdown shows only valid transitions
- Invalid transitions are greyed out (not clickable)
- System logs who changed status and when
- Sales can ONLY mark as "Picked Up"
- Everyone can cancel (with reason)

---

### **ISSUE #7: Dropdown UI – Icons & Text Misaligned**
**Problem:** Icons on far left, text on far right, weird spacing. Hard to click accurately.
**Root Cause:** Generic dropdown component not optimized.

**REDESIGN:**
\`\`\`
┌──────────────────────────────────────────┐
│ 🎂 [Select a Cake Flavor]          ▼     │  ← 48px height, clear padding
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 🎂 Chocolate                       ▼     │  ← Selected item shows icon + label
└──────────────────────────────────────────┘

OPEN DROPDOWN:
┌──────────────────────────────────────────┐
│ 🎂 Chocolate (selected, highlighted)     │
│ 🎂 Vanilla                               │
│ 🎂 Almond                                │
│ 🎂 Yellow                                │
│ 🎂 Devils Food Chocolate                 │
└──────────────────────────────────────────┘
\`\`\`

**Rules:**
- Icon always on LEFT (not right)
- 24px icon, 12px padding from edge
- Label starts 12px after icon
- 48px height (matches button height)
- Dropdown items same height, aligned
- Arrow on RIGHT side only
- Hover state: Light Cream background (#FAF5F0)
- Focus state: 2px Raspberry Pink outline

---

### **ISSUE #8: Order/Customer Detail Popups – Too Big, Cut Off, No Exit**
**Problem:** Modal dialogs are oversized, sometimes cut off, no visible close button.
**Root Cause:** Max-width not set, no close icon, poor responsive behavior.

**REDESIGN:**
\`\`\`
┌─────────────────────────────────────────────────┐
│  Order 5001 - Sarah Johnson              [✕]     │  ← X button top-right
├─────────────────────────────────────────────────┤
│                                                  │
│  CUSTOMER PICKUP                                │
│  ┌─────────────────────────────────────────┐    │
│  │ Sarah Johnson                           │    │
│  │ sarah@example.com                       │    │
│  │ 713-555-0123                            │    │
│  │ 123 Main St, Houston TX 77001           │    │
│  │ Pickup: Nov 15, 2025 @ 2:00 PM          │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  CAKE DETAILS                                   │
│  ┌─────────────────────────────────────────┐    │
│  │ Chocolate Cake, Large                   │    │
│  │ Layer 1: Chocolate | Ganache | White    │    │
│  │ Layer 2: Vanilla | Vanilla | Ivory      │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  PRICING                                        │
│  ┌─────────────────────────────────────────┐    │
│  │ Base: $75 | Adjustments: $5 | TOTAL: $80│    │
│  │ Deposit: $40 | Balance: $40              │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│                  [Back] [Edit]                  │
└─────────────────────────────────────────────────┘
\`\`\`

**Rules:**
- Max-width: 600px (fits on tablet, desktop)
- Padding: 24px
- Close icon: [✕] top-right, 24px, Chocolate Brown, visible & clickable
- Overlay: Semi-transparent dark (rgba 43,43,43,0.8), click-to-close
- Escape key closes modal
- Responsive: On mobile, modal is full screen (minus 16px margin)
- Scroll container inside modal if content > viewport height

---

### **ISSUE #9: Inquiry Management – No Inquiries Visible, "Rush Orders" Unclear**
**Problem:** Inquiry system missing; unclear how "rush orders" (< 2 days) are handled.
**Root Cause:** Feature not implemented; business process undefined.

**REDESIGN — RUSH ORDER WORKFLOW:**

**Case Study Rule:** "Customized cakes should be ordered at least 2 days in advance. Exceptions can be made at the Store Manager's discretion."

**Implementation:**

**Step 4 Validation:**
\`\`\`
If Pickup Date < TODAY + 2 days:
  ├─ Show Warning: ⚠️ This is a RUSH ORDER (due in < 2 days)
  ├─ Lock form (prevent submit)
  ├─ Show inquiry form instead:
  │  ├─ Message: "Rush orders require manager approval."
  │  ├─ Reason: [Text area] "Why the rush?"
  │  ├─ [Request Manager Approval] button
  │  └─ Manager gets email/notification
  └─ Wait for manager response (or cancel)
\`\`\`

**Manager Dashboard:**
\`\`\`
PENDING RUSH ORDERS
┌────────────────────────────────────────┐
│ Order 5012 - Jane Doe                  │
│ Requested: Nov 13 @ 10 AM (TODAY!)     │
│ Requested Pickup: Nov 14 @ 2 PM        │
│ Reason: "Surprise birthday party"      │
│ [✓ Approve] [✕ Deny]                   │
└────────────────────────────────────────┘
\`\`\`

**Database:**
- Add `IsRushOrder` boolean
- Add `RushOrderApprovedBy` (manager's user ID)
- Add `RushOrderApprovedAt` (timestamp)
- Add `RushOrderReason` (text)

---

### **ISSUE #10: Inventory Management – Staff Handling Inventory (Out of Scope)**
**Problem:** Inventory page exists, but inventory management isn't in scope. Product catalog expected.
**Root Cause:** Misalignment between requirements and implementation.

**REDESIGN — RENAME & LIMIT SCOPE:**

Change: **"Inventory Management" → "Product Catalog"**

**Admin Product Catalog (Manager/Admin Only):**
\`\`\`
MANAGE PRODUCTS

━━━ FLAVORS ━━━
├─ Vanilla           [Edit] [Delete]
├─ Almond            [Edit] [Delete]
├─ Yellow            [Edit] [Delete]
├─ Devils Food       [Edit] [Delete]
├─ Chocolate         [Edit] [Delete]
├─ Strawberry        [Edit] [Delete]
└─ [+ Add Flavor]

━━━ FILLINGS ━━━
├─ White Buttercream [Edit] [Delete]
├─ Chocolate Buttercream [Edit] [Delete]
├─ Almond Buttercream    [Edit] [Delete]
├─ Cream Cheese          [Edit] [Delete]
├─ Lemon Curd            [Edit] [Delete]
├─ Strawberry            [Edit] [Delete]
├─ Rum/Strawberry        [Edit] [Delete]
├─ Raspberry             [Edit] [Delete]
├─ Pecan Praline         [Edit] [Delete]
├─ Chocolate Mousse      [Edit] [Delete]
├─ Lemon Mousse          [Edit] [Delete]
├─ Strawberry Mousse     [Edit] [Delete]
├─ Raspberry Mousse      [Edit] [Delete]
├─ White Chocolate Mousse [Edit] [Delete]
├─ Mango Mousse          [Edit] [Delete]
└─ [+ Add Filling]

━━━ ICINGS ━━━
├─ White Buttercream         [Edit] [Delete]
├─ Chocolate Buttercream     [Edit] [Delete]
├─ Almond Buttercream        [Edit] [Delete]
├─ White Chocolate Buttercream [Edit] [Delete]
├─ Cream Cheese              [Edit] [Delete]
├─ Chocolate Ganache         [Edit] [Delete]
└─ [+ Add Icing]

━━━ WRITING COLORS ━━━
├─ 🔴 Red       #FF0000  [Edit] [Delete]
├─ 🔵 Blue      #0000FF  [Edit] [Delete]
├─ 🩷 Pink      #FFC0CB  [Edit] [Delete]
├─ 🟣 Purple    #800080  [Edit] [Delete]
├─ 🟡 Gold      #FFD700  [Edit] [Delete]
├─ ⚪ Silver    #C0C0C0  [Edit] [Delete]
├─ 🟨 Yellow    #FFFF00  [Edit] [Delete]
├─ ⚪ White     #FFFFFF  [Edit] [Delete]
├─ 🟢 Green     #008000  [Edit] [Delete]
├─ ⚫ Black     #000000  [Edit] [Delete]
└─ [+ Add Color]

━━━ CAKE SIZES ━━━
├─ 6" Double Layer (4-6 servings)  - $20  [Edit] [Delete]
├─ 8" Double Layer (12-15 servings) - $30 [Edit] [Delete]
├─ 10" Double Layer (25-30 servings) - $60 [Edit] [Delete]
├─ 12" Double Layer (35 servings) - $100   [Edit] [Delete]
├─ 14" Double Layer (40 servings) - $140   [Edit] [Delete]
├─ 16" Double Layer (85 servings) - $180   [Edit] [Delete]
├─ ¼ Sheet (15-20 servings) - $40          [Edit] [Delete]
├─ ½ Sheet (30-50 servings) - $100         [Edit] [Delete]
├─ Full Sheet (90-100 servings) - $200     [Edit] [Delete]
└─ [+ Add Size]

━━━ BASE CAKES ━━━
├─ Birthday Celebration    - $48  [Edit] [Delete]
├─ Almond Delight          - $48  [Edit] [Delete]
├─ Lemon and Cream Cheese  - $50  [Edit] [Delete]
├─ Black Forest            - $55  [Edit] [Delete]
├─ German Chocolate        - $52  [Edit] [Delete]
├─ Cream Cheese Chocolate  - $50  [Edit] [Delete]
├─ Chocolate Ganache       - $48  [Edit] [Delete]
├─ Italian Cream           - $50  [Edit] [Delete]
├─ Lemon Doberge           - $52  [Edit] [Delete]
├─ Chocolate Doberge       - $52  [Edit] [Delete]
├─ ½ & ½ Doberge          - $54  [Edit] [Delete]
├─ Pecan Praline           - $50  [Edit] [Delete]
├─ Cream Cheese Chocolate  - $52  [Edit] [Delete]
├─ Banana Strawberry       - $48  [Edit] [Delete]
├─ Cookies and Cream       - $50  [Edit] [Delete]
└─ [+ Add Base Cake]
\`\`\`

**Key Rules:**
- No "inventory counts"
- No "stock status"
- ONLY CRUD operations (Create, Read, Update, Delete)
- Changes appear immediately in dropdowns (real-time)
- No ordering/purchasing functionality

---

### **ISSUE #11: Business Intelligence Dashboard – Same for Sales & Manager**
**Problem:** BI page shows identical data for all users. Managers see order counts; bakers shouldn't.
**Root Cause:** Single dashboard template, no role filtering.

**REDESIGN — ROLE-SPECIFIC DASHBOARDS:**

**Sales Staff Dashboard:**
\`\`\`
📊 TODAY'S SNAPSHOT
├─ Orders Entered Today: 5
├─ Orders Ready for Pickup: 2
├─ Revenue Today: $1,450
└─ Average Order Value: $290

📋 TODAY'S READY ORDERS
├─ Order 5001 - Sarah Johnson - 2:00 PM
├─ Order 5003 - Michael Chen - 3:00 PM
└─ [View All]

📈 SALES TRENDS (Last 7 Days)
├─ Total Orders: 34
├─ Total Revenue: $9,860
├─ Repeat Customers: 12
└─ [View Full Report]
\`\`\`

**Baker Dashboard:**
\`\`\`
🍰 BAKING QUEUE
├─ To Be Created: 3 cakes
│  ├─ Order 5002 - Large Vanilla
│  ├─ Order 5004 - XL Chocolate
│  ├─ Order 5006 - 3-layer Almond
├─ In Progress: 2 cakes
│  ├─ Order 5001 - Ready to cool
│  ├─ Order 5003 - Cooling
└─ Completed & Ready for Decorator: 1 cake
   └─ Order 5005 - Awaiting decoration

⏰ UPCOMING PICKUPS
├─ Due Today: Order 5001 @ 2:00 PM
├─ Due Tomorrow: Order 5003 @ 3:00 PM
└─ Due in 2 Days: Orders 5004 & 5006
\`\`\`

**Decorator Dashboard:**
\`\`\`
🎨 DECORATION QUEUE
├─ Ready for Decoration: 3 cakes
│  ├─ Order 5005 - 2-layer Chocolate
│  ├─ Order 5007 - 3-layer Vanilla
│  ├─ Order 5009 - Large Strawberry
├─ In Progress: 1 cake
│  └─ Order 5002 - Finishing touches
└─ Awaiting Manager Approval: 2 cakes
   ├─ Order 5001 - Done
   ├─ Order 5003 - Done

👀 SPECIAL NOTES
├─ Order 5005: "NO NUTS - Customer allergy"
├─ Order 5007: "Extra fondant flowers requested"
├─ Order 5009: "Piping should be delicate"
\`\`\`

**Manager Dashboard:**
\`\`\`
📊 BUSINESS METRICS
├─ Total Revenue (Today): $1,450
├─ Total Revenue (This Week): $9,860
├─ Total Revenue (This Month): $42,300
├─ New Customers (This Month): 12
├─ Repeat Customer Rate: 68%
└─ Average Order Value: $285

📈 CHARTS
├─ Revenue Trend (Line chart)
├─ Orders by Status (Pie chart)
├─ Top 10 Customers (Bar chart)

⚠️ ALERTS & ACTIONS
├─ 3 Rush Orders Pending Approval
├─ 1 Overdue Order (Order 5010)
├─ 2 Orders Cancelled This Week
└─ Staff Workload: All within capacity
\`\`\`

---

### **ISSUE #12: Settings & System Configuration Naming Inconsistent**
**Problem:** Naming varies ("Settings", "Admin Settings", "System Configuration").
**Root Cause:** Multiple pages added without naming convention.

**REDESIGN — UNIFIED NAMING:**
\`\`\`
Manager/Admin Menu:
├─ Dashboard
├─ Orders
├─ Customers
├─ Reports
├─ Settings (singular, not "Settings & System Configuration")
│  ├─ Business Hours
│  ├─ Minimum Order Lead Time (2 days)
│  ├─ Default Deposit Percentage (50%)
│  ├─ Notification Preferences
│  ├─ Staff Management
│  └─ Product Catalog
└─ Profile
\`\`\`

No more confusing names. "Settings" = everything system-wide.

---

### **ISSUE #13: No Account Switching Without Logout**
**Problem:** To switch users on a shared terminal, staff must log out (loses session, frustrating).
**Root Cause:** Single-user session model.

**REDESIGN:**
\`\`\`
┌────────────────────────────────┐
│ Logged in as: Sarah (Sales)    │
│                                │
│ [Switch Account]               │
│ [Profile]                      │
│ [Settings]                     │
│ [Logout]                       │
└────────────────────────────────┘

Clicking [Switch Account]:
┌────────────────────────────────┐
│ SELECT STAFF MEMBER            │
├────────────────────────────────┤
│ ☐ James (Manager)              │
│ ☐ Emily (Owner/Baker)          │
│ ☐ Mike (Baker)                 │
│ ☑ Sarah (Sales)    ← Current   │
│ ☐ Lisa (Decorator)             │
└────────────────────────────────┘

[Switch to James]
\`\`\`

**Implementation:**
- No logout required
- Session transfers instantly
- Audit log records "Sarah switched to James @ 2:35 PM"
- Perfect for multi-user terminals

---

### **ISSUE #14: Manager Account Branding – Everyone Has "EB" Icon**
**Problem:** All users show same generic "EB" icon, no personalization.
**Root Cause:** Default avatar implementation.

**REDESIGN:**
\`\`\`
Sarah Johnson (Sales)
Avatar Options:
├─ Initials: "SJ" (white text on Raspberry Pink background)
├─ OR Emoji: 🎂 (cake for sales?), 👩‍🍳 (for bakers), 🎨 (for decorators)
├─ OR Initial Letter Only: "S" (larger, bolder)

Profile Picture (if available):
├─ 64x64px circular crop
├─ Fallback to initials
├─ Styled consistently
\`\`\`

**New Dropdown (Top-Right):**
\`\`\`
┌──────────────────────────────────────┐
│ 👩 Sarah Johnson                     │  ← Avatar (SJ or emoji)
├──────────────────────────────────────┤
│ Role: Sales Staff                    │
│ Email: sarah@emilybakes.com          │
│ Last Login: Today @ 9:15 AM          │
├──────────────────────────────────────┤
│ [View Profile]                       │
│ [Switch Account]                     │
│ [Settings]                           │
│ [Logout]                             │
└──────────────────────────────────────┘
\`\`\`

---

### **ISSUE #15: Dashboards Are Repetitive & Not Actionable**
**Problem:** KPI cards repeat same data; no specific insights.
**Root Cause:** Template approach; no tailoring per role.

**REDESIGN — ACTIONABLE KPIs:**

Instead of repeating "Orders Today: 5", show:

**Sales Dashboard:**
- "5 Orders Today | +2 from yesterday 📈"
- "Revenue: $1,450 | +$400 from average 📈"
- "2 Orders Ready | Customer waiting! ⚠️"

**Baker Dashboard:**
- "3 Cakes to Bake | First due in 6 hours 🕰️"
- "In Progress: 2 | Est. completion: 4 PM ✓"
- "No Rush Orders 👍"

**Decorator Dashboard:**
- "3 Cakes Awaiting Decoration | Largest 3-layer ✨"
- "Manager Approvals: 2 cakes done 👀"
- "Pickup Times: 1 today, 2 tomorrow, 1 in 2 days"

Each metric is actionable, role-specific, no fluff.

---

### **ISSUE #16: Admin Menu Doesn't Reflect Actual Page**
**Problem:** Menu doesn't highlight current page; staff unsure where they are.
**Root Cause:** Menu state not synced with router.

**REDESIGN:**
\`\`\`
Current URL: /orders
Active Menu: "Orders" is highlighted (Raspberry Pink background, white text)

Current URL: /dashboard
Active Menu: "Dashboard" is highlighted

Current URL: /admin/settings
Active Menu: "Settings" is highlighted
├─ Submenu appears with options:
│  ├─ Business Hours
│  ├─ Lead Time
│  ├─ Deposit %
│  └─ Notifications
\`\`\`

**Implementation:**
- Use React Router's `useLocation()` to match URL
- Highlight exact match + parent if in submenu
- Update on every navigation

---

## NEW CUSTOM ORDER FLOW (COMPLETE REDESIGN)

### **THE 6-STEP WIZARD (Fixed)**

\`\`\`
STEP 1: CUSTOMER
┌──────────────────────────────────────────────────┐
│ SELECT OR CREATE CUSTOMER                        │
├──────────────────────────────────────────────────┤
│ Search: [John Smith            ]                 │
│ 🔍 Results:                                      │
│    John Smith (5 orders, $1,250) [Select]      │
│    John S. Williams (1 order, $120) [Select]    │
│    No results? [Create New Customer]            │
│                                                  │
│ RECENT CUSTOMERS (Quick Select):                │
│ ┌─────────────────────────────────────────────┐  │
│ │ Sarah Johnson         👤 5 orders, $1,250   │  │
│ │ Michael Chen          👤 3 orders, $895     │  │
│ │ Jessica Williams      👤 1 order, $120      │  │
│ └─────────────────────────────────────────────┘  │
│                                                  │
│ Selected: Sarah Johnson                         │
│ Email: sarah@example.com                        │
│ Contact: 713-555-0123                           │
│ Address: 123 Main St, Houston TX 77001          │
└──────────────────────────────────────────────────┘
[Back: Disabled] [Next: Enabled] [Cancel]
\`\`\`

**Key Changes:**
- Autocomplete search (fast)
- Recent customers as quick buttons (faster)
- Display customer info once selected (confirmation)

---

\`\`\`
STEP 2: BASE CAKE & SIZE
┌──────────────────────────────────────────────────┐
│ SELECT BASE CAKE                                 │
├──────────────────────────────────────────────────┤
│ ☐ Birthday Celebration (Base: $48)              │
│ ☐ Almond Delight (Base: $48)                    │
│ ☐ Lemon and Cream Cheese (Base: $50)            │
│ ☐ Black Forest (Base: $55)                      │
│ ☐ German Chocolate (Base: $52)                  │
│ ☑ Chocolate Cake (Base: $48)  ← Selected        │
│ [... etc]                                        │
│                                                  │
│ SELECT SIZE                                      │
├──────────────────────────────────────────────────┤
│ ☐ 6" Round Double Layer (4-6 servings) - $20   │
│ ☐ 8" Round Double Layer (12-15 servings) - $30  │
│ ☐ 10" Round Double Layer (25-30 servings) - $60 │
│ ☑ Large 12" (Serves ~35) - $100  ← Selected    │
│ ☐ 14" Round Double Layer (40 servings) - $140   │
│ [... etc]                                        │
│                                                  │
│ 💰 Subtotal: $148 (Chocolate Cake Base $48 + Large $100) │
└──────────────────────────────────────────────────┘
[Back: Enabled] [Next: Enabled] [Cancel]
\`\`\`

---

\`\`\`
STEP 3: CUSTOMIZE LAYERS (Enforced Minimum 2)
┌──────────────────────────────────────────────────┐
│ ⚠️  MINIMUM 2 LAYERS REQUIRED                    │
│ Multi-layer cakes must have at least 2 layers.   │
├──────────────────────────────────────────────────┤
│                                                  │
│ LAYER 1 (BOTTOM)                                │
│ ┌────────────────────────────────────────────┐   │
│ │ Flavor     [Chocolate ▼]                   │   │
│ │ Filling    [Ganache ▼]                     │   │
│ │ Icing      [Buttercream - White ▼]        │   │
│ │ Writing    [🔴 Red]  🔵 🟣 ⚪ 🟡 ...      │   │
│ │ Notes      [Extra ganache on this layer]   │   │
│ │ Image      [📎 Upload Ref Photo]           │   │
│ │ Delete: [Disabled - Last Layer]            │   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│ LAYER 2 (MIDDLE)                                │
│ ┌────────────────────────────────────────────┐   │
│ │ Flavor     [Vanilla ▼]                     │   │
│ │ Filling    [Vanilla Buttercream ▼]        │   │
│ │ Icing      [Buttercream - Ivory ▼]        │   │
│ │ Writing    [⚪ White]                      │   │
│ │ Notes      [Clean and elegant]             │   │
│ │ Image      [No image]                      │   │
│ │ Delete: [✕ Remove Layer 2]                 │   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│ [+ Add Layer 3] [+ Add Layer 4] ... [Max 7]    │
│                                                  │
│ 💰 Layer Adjustments: +$5 (extra ganache)      │
└──────────────────────────────────────────────────┘
[Back: Enabled] [Next: Enabled] [Cancel]
\`\`\`

---

\`\`\`
STEP 4: PICKUP DETAILS
┌──────────────────────────────────────────────────┐
│ PICKUP DATE (Required, min 2 days from today)  │
│ [15 Nov 2025] 🗓️  ← Friday (green: valid date)  │
│ Dates < 2 days away will be RED (invalid)       │
│ Dates > 1 year away will be GREY (invalid)      │
│                                                  │
│ PICKUP TIME (Optional)                          │
│ [2:00 PM ▼] (Default: "Sometime before 5 PM")  │
│ Common times:                                    │
│ ├─ 9:00 AM (opening)                           │
│ ├─ 12:00 PM (lunch)                            │
│ ├─ 2:00 PM (afternoon)                         │
│ └─ 4:00 PM (closing time - 1 hr)               │
│ Or type custom time: [_:__ __]                 │
│                                                  │
│ SPECIAL REQUESTS & NOTES                        │
│ [                                                │
│  Customer requested extra fondant flowers.      │
│  Inspired by Pinterest photo.                   │
│  Keep decorations elegant and simple.           │
│  NO NUTS - Customer has severe allergy.         │
│ ]                                               │
│ Characters: 187 / 500                           │
│                                                  │
│ COMPLETION DEADLINE                             │
│ This cake will be completed by: Nov 15 @ 10 AM │
│ (4 hours before pickup, per bakery policy)     │
│ Status: ✅ Valid                                │
└──────────────────────────────────────────────────┘
[Back: Enabled] [Next: Enabled] [Cancel]
\`\`\`

---

\`\`\`
STEP 5: DECORATIONS & ADD-ONS (Optional)
┌──────────────────────────────────────────────────┐
│ ADD DECORATIONS (All optional)                  │
│                                                  │
│ ☐ Fresh Flowers (1 dozen, $25)                 │
│ ☐ Edible Gold Leaf ($15)  ← Selected ✓         │
│ ☐ Custom Cake Topper ($10)                     │
│ ☐ Cake Stand Display ($35)                     │
│ ☐ Sparklers/Candles ($5)                       │
│ ☐ Extra Icing Message ($8)                     │
│    If selected, enter message:                 │
│    [Happy 40th Birthday Sarah!]                │
│                                                  │
│ Decorations Subtotal: $15                      │
│                                                  │
│ 💰 RUNNING TOTAL:                              │
│    Cake & Layers: $153                         │
│    Decorations: $15                            │
│    Subtotal: $168                              │
└──────────────────────────────────────────────────┘
[Back: Enabled] [Next: Enabled] [Cancel]
\`\`\`

---

\`\`\`
STEP 6: PRICING & DEPOSIT
┌──────────────────────────────────────────────────┐
│ PRICING SUMMARY                                  │
├──────────────────────────────────────────────────┤
│ Base Cake & Size            $148                │
│ Layer Adjustments           +$5                 │
│ Decorations                 +$15                │
│ ────────────────────────────────                │
│ FIRM TOTAL PRICE:           $168                │
│ (No ranges; Emily sets exact price)            │
│                                                  │
│ PREFERRED CUSTOMER DISCOUNT                     │
│ ☐ Apply 10% discount?  (Sarah is preferred)    │
│   → New Total: $151.20                         │
│                                                  │
│ DEPOSIT CALCULATION                             │
│ Min Required (50%):     $84.00                  │
│ Amount Customer Pays:   [$ 84.00 ▼]  ← 50%    │
│ (Must be ≥ 50% of total, can be more)          │
│ Balance Due at Pickup:  $84.00                  │
│                                                  │
│ PAYMENT METHOD                                  │
│ ☑ Cash                                          │
│ ☐ Debit Card                                    │
│ ☐ Credit Card (Visa, Mastercard, Amex)        │
│                                                  │
│ ℹ️  Deposit validated ✅                        │
└──────────────────────────────────────────────────┘
[Back: Enabled] [Next: Enabled] [Cancel]
\`\`\`

---

\`\`\`
STEP 7: REVIEW ORDER
┌──────────────────────────────────────────────────┐
│ REVIEW YOUR ORDER - Order 5001                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ 👤 CUSTOMER                                     │
│    Sarah Johnson                                │
│    sarah@example.com | 713-555-0123             │
│    123 Main St, Houston TX 77001                │
│                                                  │
│ 🍰 CAKE                                         │
│    Chocolate Cake, 12" (Serves ~35)            │
│    Base Price: $100                            │
│                                                  │
│ 📋 LAYERS (2 Total)                             │
│    LAYER 1 (Bottom): Chocolate Ganache, White   │
│    LAYER 2 (Middle): Vanilla Vanilla, Ivory     │
│    Layer Adjustments: +$5                       │
│                                                  │
│ ✨ DECORATIONS                                  │
│    Edible Gold Leaf ($15)                       │
│    "Happy 40th Birthday Sarah!" message         │
│                                                  │
│ 🗓️  PICKUP                                       │
│    Date: Friday, Nov 15, 2025                   │
│    Time: 2:00 PM                                │
│    Completed By: 10:00 AM (4 hrs prior)        │
│                                                  │
│ 💵 PRICING                                      │
│    Total: $168                                  │
│    Deposit (50%): $84 (Cash)                    │
│    Balance Due: $84 (at pickup)                 │
│                                                  │
│ 📝 SPECIAL NOTES                                │
│    "NO NUTS - Severe allergy. Extra fondant    │
│     flowers. Keep decorations elegant."         │
│                                                  │
│ ════════════════════════════════════════════   │
│ All looks good? Submit to create order.         │
│ Need to change something? Go back.              │
└──────────────────────────────────────────────────┘
[Back: Edit] [Submit: Create Order] [Cancel]
\`\`\`

---

## COLOR APPLICATION (Using Your Palette)

**Form Inputs:**
- Border: Gray #C0C0C0 (neutral, clear)
- Border (focus): Raspberry #C44569 (3px, glow effect)
- Border (error): Red #FF0000 (alert)
- Background: White #FFFFFF
- Label: Charcoal #2B2B2B (dark, readable)
- Placeholder: Gray #6B7280 (muted)

**Buttons:**
- Primary (CTA): Raspberry #C44569 / Hover: Berry Red #8B1E3E
- Secondary: Outlined, Raspberry border, Chocolate text
- Danger (Delete, Cancel): Red #EF4444
- Disabled: Gray #6B7280 (50% opacity)

**Status Indicators:**
- To Be Created: Blue #3B82F6
- In Baking: Amber #F59E0B
- Decorating: Purple (neon, from palette)
- Ready: Green #10B981
- Cancelled: Red #EF4444

**Writing Color Swatches (Direct from Case Study):**
- Red: #FF0000
- Blue: #0000FF
- Pink: #FFC0CB
- Purple: #800080
- Gold: #FFD700
- Silver: #C0C0C0
- Yellow: #FFFF00
- White: #FFFFFF
- Green: #008000
- Black: #000000

---

## RESPONSIVE DESIGN (Mobile-First)

**Mobile (< 768px):**
- Single column layout
- Full-width buttons (100%)
- 48px touch targets
- Hamburger menu (left side)
- Modal dialogs: Full screen minus 16px margin
- Dropdowns: Stack vertically, full width
- Layer repeater: Accordion style (collapsed by default)

**Tablet (768px - 1024px):**
- Two columns where appropriate
- Buttons: 44px min height, 12px padding
- Modals: Max 600px, centered
- Layer repeater: Always expanded, two columns for field groups

**Desktop (> 1024px):**
- Three-column grid for dashboards
- Buttons: 48px height, hover effects
- Modals: Max 700px, centered
- Layer repeater: Horizontal layout (one layer per row, scrollable)

---

## VALIDATION RULES (Enforced at UI + Database)

| Field | Rule | Message |
|---|---|---|
| Customer | Required | "Please select or create a customer" |
| Pickup Date | Min 2 days advance | "Pickup date must be at least 2 days from today" |
| Pickup Date | Max 1 year | "Pickup date cannot be more than 1 year away" |
| Layers | Min 2, Max 7 | "Minimum 2 layers required; maximum 7 allowed" |
| Firm Price | Min $20 | "Price cannot be less than $20" |
| Deposit | ≥ 50% of price | "Deposit must be at least 50% of total price" |
| Special Notes | Max 500 chars | "Notes cannot exceed 500 characters" |
| All Required Fields | Cannot be empty | "Please complete all required fields" |

---

## ACCESSIBILITY (WCAG 2.1 AA)

- All form inputs have associated labels (`<label htmlFor>`)
- Error messages use `role="alert"` for screen readers
- Color not sole differentiator (always pair with icon/text)
- Minimum 4.5:1 contrast ratio for all text
- Focus indicators visible (2px Raspberry Pink outline)
- Tab order logical (left-to-right, top-to-bottom)
- Escape key closes modals
- Enter key submits forms

---

## SUMMARY: PRINCIPLES FOR THIS REDESIGN

1. **Business-First:** Every design decision aligns with Emily's actual workflow.
2. **Scope-Strict:** No invented features (no "Occasion", no "Design Style").
3. **Role-Based:** Sales sees sales info, bakers see baking info.
4. **Error Prevention:** Rules enforced at UI level (min 2 layers, deposit ≥50%).
5. **Speed:** Quick actions visible without scrolling.
6. **Clarity:** No confusing labels or hidden complexity.
7. **Consistency:** Same colors, buttons, spacing everywhere.
8. **Mobile-First:** Tablet & desktop are enhancements, not primary.
9. **Accessible:** WCAG AA compliance from day one.
10. **Production-Ready:** Everything defined, nothing ambiguous.

---

## NEXT STEPS FOR IMPLEMENTATION

1. **Create Layout Components:**
   - `StepWizard.tsx` (6-step wizard container)
   - `LayerRepeater.tsx` (add/remove layers, min 2 max 7)
   - `FormInput.tsx` (shared input with label, error, validation)
   - `FormSelect.tsx` (dropdown with icons, dynamic options)
   - `ColorSwatch.tsx` (for writing colors)

2. **Create Business Logic:**
   - Validation rules in `utils/orderValidation.ts`
   - Pricing calculator in `utils/pricingCalculator.ts`
   - Role-based permissions in `hooks/useRole.ts`

3. **Create Services:**
   - `services/orderService.ts` (create, update, fetch orders)
   - `services/customerService.ts` (search, create customers)
   - `services/productService.ts` (fetch flavors, fillings, icings, sizes)

4. **Update Database:**
   - Add `IsRushOrder`, `RushOrderApprovedBy`, `RushOrderReason` to Orders
   - Remove `Occasion` field (data migration)
   - Ensure min/max layer constraints

5. **Testing:**
   - Unit tests for validation rules
   - Integration tests for wizard flow
   - E2E tests for full order creation
   - Accessibility audit with axe, WAVE

This is a complete, case-study-aligned, business-ready custom order system. No more cute design that doesn't work—just fast, clear, compliant, and professional.

---

**Date Created:** November 13, 2025  
**Status:** Production-Ready Specification  
**For:** Group 4 CIS 3343 Final Implementation Phase  
**Target Deadline:** November 21, 2025
