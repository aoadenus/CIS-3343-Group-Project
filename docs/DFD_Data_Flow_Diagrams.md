# Data Flow Diagrams (DFD) - Emily Bakes Cakes
## System Analysis and Process Documentation

---

## DFD LEVEL 0: CONTEXT DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Emily Bakes Cakes System Context                  │
└─────────────────────────────────────────────────────────────────────┘


                     External Entities & Data Flows


┌──────────────┐                                      ┌──────────────┐
│              │    Custom Cake Request               │              │
│  CUSTOMER    │    Product Inquiry                   │              │
│   (Public)   │─────────────────────────────────────>│              │
│              │                                       │              │
│              │    Order Confirmation                 │   EMILY      │
│              │    Status Updates                     │   BAKES      │
│              │<─────────────────────────────────────│   CAKES      │
│              │                                       │   WEB        │
│              │    Contact Messages                   │  DATABASE    │
│              │─────────────────────────────────────>│  SYSTEM      │
│              │                                       │              │
└──────────────┘                                       │   (P0.0)     │
                                                       │              │
┌──────────────┐                                       │              │
│              │    Order Details View                 │              │
│  SALES       │    Customer Information               │              │
│  STAFF       │<─────────────────────────────────────│              │
│              │                                       │              │
│              │    New Order Entry                    │              │
│              │    Status Updates                     │              │
│              │─────────────────────────────────────>│              │
│              │                                       │              │
└──────────────┘                                       │              │
                                                       │              │
┌──────────────┐                                       │              │
│              │    Order Queue/Assignments            │              │
│  BAKERS &    │    Decoration Specifications          │              │
│ DECORATORS   │<─────────────────────────────────────│              │
│              │                                       │              │
│              │    Work Completion                    │              │
│              │    Status Updates                     │              │
│              │─────────────────────────────────────>│              │
│              │                                       │              │
└──────────────┘                                       │              │
                                                       │              │
┌──────────────┐                                       │              │
│              │    Business Reports                   │              │
│  MANAGER /   │    Analytics Dashboard                │              │
│   EMILY      │<─────────────────────────────────────│              │
│              │                                       │              │
│              │    Product/Inventory Updates          │              │
│              │    Customer Management                │              │
│              │    Final Order Approval               │              │
│              │─────────────────────────────────────>│              │
│              │                                       │              │
└──────────────┘                                       └──────────────┘
```

### Context Diagram Summary

**System Boundary:** Emily Bakes Cakes Web Database Application

**External Entities:**
1. **Customers (Public)** - Place orders, submit inquiries, browse products
2. **Sales Staff** - Create/manage orders, handle customer interactions
3. **Bakers & Decorators** - View assignments, update work status
4. **Manager/Emily** - Oversee operations, approve orders, manage inventory

**Primary Data Flows:**
- **Inbound:** Customer requests, order entries, status updates, management actions
- **Outbound:** Order confirmations, work assignments, reports, analytics

---

## DFD LEVEL 1: SYSTEM DECOMPOSITION

```
┌─────────────────────────────────────────────────────────────────────┐
│              Emily Bakes Cakes - Level 1 Decomposition              │
└─────────────────────────────────────────────────────────────────────┘


┌──────────┐                                             ┌──────────┐
│ Customer │                                             │  Staff   │
│          │                                             │          │
└────┬─────┘                                             └────┬─────┘
     │                                                        │
     │ Custom Cake Design                                    │
     │ Shop Product Inquiry                                  │
     │                                                        │
     ▼                                                        ▼
┌─────────────────────────────────────┐    ┌─────────────────────────────┐
│                                     │    │                             │
│  P1.0: MANAGE CUSTOMER              │◄───│  Order Entry                │
│        INTERACTIONS                 │    │  Customer Lookup            │
│                                     │───>│                             │
└──────────┬──────────────────────────┘    └─────────────────────────────┘
           │                                              ▲
           │ New Customer                                 │
           │ Customer Data                                │
           ▼                                              │
    ┌─────────────┐                                       │
    │ D1: Customer│                                       │
    │   Records   │                                       │
    └─────────────┘                                       │
           │                                              │
           │ Customer Info                                │
           ▼                                              │
┌─────────────────────────────────────┐                   │
│                                     │    Product Options │
│  P2.0: MANAGE ORDERS &              │◄──────────────────┘
│        FULFILLMENT                  │
│                                     │
└──────────┬──────────────────────────┘
           │
           │ New Order
           │ Status Update
           ▼
    ┌─────────────┐
    │ D2: Order   │
    │     Log     │
    └─────────────┘
           │
           │ Order Details
           │
           ▼
┌─────────────────────────────────────┐         ┌──────────────┐
│                                     │         │   Manager/   │
│  P3.0: MANAGE FULFILLMENT           │◄────────│    Emily     │
│        WORKFLOW                     │         │              │
│                                     │────────>│ Work Queue   │
└─────────────────────────────────────┘         │ Approval     │
           │                                    └──────────────┘
           │ Work Assignment
           │ Status Change
           ▼
    ┌─────────────┐
    │ D4: Employee│
    │ Assignments │
    └─────────────┘


┌─────────────────────────────────────┐         ┌──────────────┐
│                                     │         │   Manager/   │
│  P4.0: MANAGE PRODUCT               │◄────────│    Emily     │
│        CATALOG                      │         │              │
│                                     │────────>│ Catalog View │
└──────────┬──────────────────────────┘         └──────────────┘
           │
           │ Product Data
           ▼
    ┌─────────────┐
    │ D3: Product │
    │& Custom Opts│
    └─────────────┘


┌─────────────────────────────────────┐         ┌──────────────┐
│                                     │         │   Manager/   │
│  P5.0: GENERATE BUSINESS            │◄────────│    Emily     │
│        ANALYTICS                    │         │              │
│                                     │────────>│   Reports    │
└─────────────────────────────────────┘         │  Dashboard   │
           ▲                                    └──────────────┘
           │
           │ Customer Data
           │ Order History
           │ Product Performance
           │
    ┌──────┴────┬──────────┬──────────┐
    │           │          │          │
┌───┴────┐ ┌────┴────┐ ┌───┴────┐ ┌──┴──────┐
│   D1   │ │   D2    │ │   D3   │ │   D5    │
│Customer│ │ Order   │ │Product │ │ Payment │
│Records │ │  Log    │ │Catalog │ │ Records │
└────────┘ └─────────┘ └────────┘ └─────────┘
```

---

## PROCESS SPECIFICATIONS

### **P1.0: MANAGE CUSTOMER INTERACTIONS**

**Purpose:** Handle all customer-facing interactions and data collection

**Inputs:**
- Custom cake design requests (from Customers)
- Product inquiries (from Customers)
- Contact messages (from Customers)
- Customer search queries (from Staff)

**Processing:**
1. Validate customer contact information
2. Check for existing customer records (email lookup)
3. Create new customer record if not found
4. Link inquiry/order to customer
5. Store inspiration images if provided
6. Update customer statistics (total orders, last order date)
7. Flag VIP customers based on order history

**Outputs:**
- Customer record → D1 (Customer Records)
- Order confirmation → Customer
- Customer details → P2.0 (Order Management)

**Data Stores Used:**
- D1: Customer Records (Read/Write)

---

### **P2.0: MANAGE ORDERS & FULFILLMENT**

**Purpose:** Create, track, and manage custom cake orders through lifecycle

**Inputs:**
- Order details from P1.0 (Customer Interactions)
- Product options from D3 (Product Catalog)
- Status updates from Staff/Bakers
- Payment information from Staff

**Processing:**
1. **Order Creation:**
   - Validate required fields (occasion, design, layers/flavor)
   - Validate layer structure (max 2 fillings per layer)
   - Calculate total price based on layers and options
   - Assign order ID and initial status ('pending')
   - Calculate deposit requirement (50% of total)

2. **Order Tracking:**
   - Update order status (pending → preparing → ready → completed)
   - Track assigned employee (last employee working on order)
   - Log status change timestamps
   - Store customer and admin notes separately

3. **Payment Processing:**
   - Record deposit payments
   - Calculate balance due
   - Update payment status (pending → partial → paid)
   - Link Stripe payment intents (if applicable)

4. **Order Lifecycle Management:**
   - Handle cancellations with reason tracking
   - Soft delete cancelled orders (preserve audit trail)
   - Update customer order statistics
   - Trigger notifications for status changes

**Outputs:**
- Order record → D2 (Order Log)
- Work assignments → P3.0 (Fulfillment Workflow)
- Payment records → D5 (Payment Records)
- Order status updates → Customer
- Order confirmations → Customer

**Data Stores Used:**
- D1: Customer Records (Read)
- D2: Order Log (Read/Write)
- D3: Product & Customizations (Read)
- D5: Payment Records (Write)

**Business Rules Enforced:**
- ✅ One cake per order
- ✅ Minimum 50% deposit required
- ✅ Max 2 fillings per layer
- ✅ 2-day advance notice (not enforced in system yet)
- ✅ Final approval by Manager/Emily before completion

---

### **P3.0: MANAGE FULFILLMENT WORKFLOW**

**Purpose:** Coordinate baking and decorating workflow from order to pickup

**Inputs:**
- Order details from D2 (Order Log)
- Work status updates from Bakers/Decorators
- Final approval from Manager/Emily

**Processing:**
1. **Work Queue Management:**
   - Display orders by status and priority
   - Filter by assigned employee
   - Sort by event date (earliest first)
   - Highlight overdue orders (age tracking)

2. **Kanban Board Workflow:**
   - Visual status tracking (New → Baking → Decorating → Ready)
   - Drag-and-drop status updates
   - Real-time status synchronization

3. **Assignment Tracking:**
   - Record last employee working on order
   - Track decorator-specific notes
   - Log completion timestamps

4. **Quality Control:**
   - Require Manager/Emily approval before "Ready for Pickup"
   - Store approval timestamp and approver name
   - Prevent pickup without final approval

**Outputs:**
- Updated order status → D2 (Order Log)
- Employee assignments → D4 (Employee Assignments)
- Work queue display → Bakers/Decorators
- Approval notifications → Manager/Emily

**Data Stores Used:**
- D2: Order Log (Read/Write)
- D4: Employee Assignments (Read/Write)

---

### **P4.0: MANAGE PRODUCT CATALOG**

**Purpose:** Maintain product offerings, pricing, and customization options

**Inputs:**
- Product updates from Manager/Emily
- Pricing changes from Manager/Emily
- Stock status updates from Manager/Emily

**Processing:**
1. **Product Management (CRUD):**
   - Create new products with category, price, description
   - Update existing product details
   - Soft delete discontinued products
   - Upload product images

2. **Catalog Organization:**
   - Categorize products (Cakes, Cupcakes, Cookies, etc.)
   - Set popularity scores (0-100)
   - Mark new/popular items
   - Manage stock status

3. **Pricing Management:**
   - Set base prices for standard products
   - Define price ranges for customizable items
   - Store prices in cents (avoid decimal issues)

4. **Search & Discovery:**
   - Full-text search across name, category, description
   - Filter by category
   - Sort by popularity, rating, price

**Outputs:**
- Product records → D3 (Product Catalog)
- Available options → P2.0 (Order Management)
- Catalog display → Customers (Shop page)

**Data Stores Used:**
- D3: Product & Customizations (Read/Write)

---

### **P5.0: GENERATE BUSINESS ANALYTICS**

**Purpose:** Provide insights and reports for business decision-making

**Inputs:**
- Customer data from D1
- Order history from D2
- Product performance from D3
- Payment records from D5
- Report criteria from Manager/Emily

**Processing:**
1. **Key Performance Indicators (KPIs):**
   - Total orders (current period)
   - Revenue (total, deposit, balance due)
   - Average order value
   - Customer acquisition (new vs. returning)
   - Order completion rate
   - Cancellation rate with reasons

2. **Customer Analytics:**
   - VIP customer identification (high order count)
   - Customer lifetime value
   - Order frequency analysis
   - Customer segmentation (Retail vs. Corporate)
   - Email/phone list generation for marketing

3. **Operational Metrics:**
   - Orders by status (pending, preparing, ready, completed)
   - Average fulfillment time
   - Order aging (overdue alerts)
   - Employee productivity (orders assigned/completed)
   - Peak ordering periods

4. **Product Performance:**
   - Top-selling products
   - Revenue by category
   - Popular flavors/fillings
   - Custom vs. shop order mix

5. **Financial Reports:**
   - Daily/weekly/monthly revenue
   - Deposit collection rate
   - Outstanding balances
   - Payment method breakdown
   - Refund tracking

**Outputs:**
- Dashboard visualizations → Manager/Emily
- Exportable reports (CSV) → Manager/Emily
- Marketing lists (email, phone) → Manager/Emily
- Performance alerts → Manager/Emily

**Data Stores Used:**
- D1: Customer Records (Read)
- D2: Order Log (Read)
- D3: Product Catalog (Read)
- D5: Payment Records (Read)

**Report Types Generated:**
- ✅ Customer retention analysis
- ✅ Sales trends (chart visualizations)
- ✅ Order status distribution
- ✅ Revenue forecasting
- ✅ Inventory alerts (low stock)

---

## DATA STORES DETAIL

### **D1: CUSTOMER RECORDS**
**Contents:** Customer contact info, order history, VIP status, admin notes  
**Access:** P1.0 (RW), P2.0 (R), P5.0 (R)  
**Volume:** ~800+ customers/year (growing 15% annually per case study goals)  
**Key Fields:** id, name, email, phone, totalOrders, isVip, lastOrderDate

### **D2: ORDER LOG**
**Contents:** All order details, status, payment tracking, layer configurations  
**Access:** P2.0 (RW), P3.0 (RW), P5.0 (R)  
**Volume:** ~2000+ orders/year (custom + shop)  
**Key Fields:** id, customerId, layers (JSONB), status, totalAmount, depositAmount, eventDate

### **D3: PRODUCT & CUSTOMIZATIONS**
**Contents:** Catalog items, pricing, customization options (flavors, fillings, icings)  
**Access:** P2.0 (R), P4.0 (RW), P5.0 (R)  
**Volume:** ~50-100 products/options  
**Key Fields:** id, name, category, price, inStock, popularity

### **D4: EMPLOYEE ASSIGNMENTS**
**Contents:** Staff assignments to orders, completion tracking  
**Access:** P3.0 (RW)  
**Volume:** Transient (current active orders only)  
**Key Fields:** orderId, employeeId, assignedAt, completedAt

### **D5: PAYMENT RECORDS**
**Contents:** Payment transactions, record-keeping only (not processing)  
**Access:** P2.0 (W), P5.0 (R)  
**Volume:** ~3000+ transactions/year (multiple per order)  
**Key Fields:** id, orderId, paymentType, amount, paymentDate, recordedBy

---

## DATA FLOW DETAILS

### **DF-A: Custom Cake Request** (Customer → P1.0)
```
Contents: { name, email, phone, occasion, design, layers[], eventDate, 
            inspirationImages[], message, notes }
Frequency: ~5-10 requests/day
Volume: Medium (with image uploads can be 1-5MB)
```

### **DF-B: New Customer Data** (P1.0 → D1)
```
Contents: { name, email, phone, isGuest, createdAt }
Frequency: ~2-3 new customers/day
Validation: Email uniqueness check, required fields
```

### **DF-C: Available Product Options** (D3 → P2.0)
```
Contents: { flavors[], fillings[], icings[], sizes[], decorations[] }
Frequency: On order creation (read-only reference)
Used for: Builder UI population, price calculation
```

### **DF-D: New Order Creation** (P2.0 → D2)
```
Contents: Complete order object with customer link, layers, pricing, status
Frequency: ~5-8 orders/day
Triggers: Customer record update (increment totalOrders)
```

### **DF-E: Order Details** (D2 → P2.0)
```
Contents: Full order with customer info, payment status, current status
Frequency: Continuous (admin order list view)
Used for: Order management center, status tracking
```

### **DF-F: Employee Assignment** (P2.0 → D4)
```
Contents: { orderId, employeeId, assignedAt, role }
Frequency: On status change or manual assignment
Purpose: Track who is working on which order
```

### **DF-G: Status Update** (Staff → P2.0)
```
Contents: { orderId, newStatus, lastModifiedBy, timestamp }
Frequency: Multiple times per order lifecycle
Triggers: Workflow progression, customer notifications
```

### **DF-H: Order Confirmation** (P2.0 → Customer)
```
Contents: Order summary, total, deposit due, pickup date
Frequency: On order creation and major status changes
Format: Email notification (future enhancement)
```

### **DF-I: Product Entry** (Staff → P4.0)
```
Contents: { name, category, price, description, image, inStock }
Frequency: Weekly (new products/seasonal items)
Validation: Required fields, price > 0
```

### **DF-J: Catalog Save** (P4.0 → D3)
```
Contents: Product record with timestamps
Frequency: Weekly
Effect: Immediate visibility on Shop page
```

### **DF-K: Report Request** (Manager → P5.0)
```
Contents: { reportType, dateRange, filters[] }
Frequency: Daily (dashboard), Weekly/Monthly (detailed reports)
Examples: "All customers who ordered wedding cakes in Q4"
```

### **DF-L: Analytics Data** (D1, D2, D3, D5 → P5.0)
```
Contents: Aggregated data from all stores
Processing: JOIN queries, grouping, calculations
Volume: Entire database (optimized with indexes)
```

### **DF-M: Generated Report** (P5.0 → Manager)
```
Contents: Charts, tables, KPIs, downloadable CSV
Frequency: Real-time dashboard + scheduled reports
Format: Visual dashboard + exportable data
```

---

## PROCESS FLOW EXAMPLE: CUSTOM CAKE ORDER

```
1. Customer completes Custom Builder form → P1.0
2. P1.0 validates email, finds or creates customer → D1
3. P1.0 passes validated data to P2.0
4. P2.0 retrieves product options from D3
5. P2.0 validates layers (max 2 fillings each)
6. P2.0 calculates total price (base + layers + fillings)
7. P2.0 creates order record → D2
8. P2.0 updates customer stats → D1 (increment totalOrders)
9. P2.0 sends confirmation → Customer
10. P3.0 displays new order in fulfillment queue
11. Staff assigns order to Baker → D4
12. Baker updates status to "preparing" → D2
13. Decorator takes over, updates to "decorating" → D2
14. Manager approves, sets status to "ready" → D2
15. Customer picks up, staff marks "completed" → D2
16. P5.0 includes order in analytics → Manager Dashboard
```

---

## SYSTEM IMPROVEMENTS FROM CASE STUDY

The digital system addresses these specific pain points:

### **Problem 1: Manual Order Tracking (Paper-Based)**
**Solution:** Processes P2.0 and P3.0 provide digital order management
- ✅ All orders stored in D2 (Order Log) - no lost papers
- ✅ Real-time status tracking replaces "Pink Basket" system
- ✅ Reduces lost orders from 3-5/month to ~0

### **Problem 2: No Customer Data Storage**
**Solution:** Process P1.0 and D1 (Customer Records)
- ✅ Automatic customer creation on first order
- ✅ Email lookup prevents duplicates
- ✅ Order history tracking enables targeted marketing
- ✅ VIP flagging for repeat customers

### **Problem 3: Time-Consuming Order Creation**
**Solution:** Custom Builder (P1.0 + P2.0) streamlines process
- ✅ Digital form vs. handwritten notes
- ✅ Auto-calculated pricing
- ✅ Validation prevents incomplete orders
- ✅ Estimated time savings: 10-15 minutes per order

### **Problem 4: Lack of Business Intelligence**
**Solution:** Process P5.0 provides comprehensive analytics
- ✅ Real-time dashboard with KPIs
- ✅ Customer retention metrics
- ✅ Revenue forecasting
- ✅ Product performance tracking

---

**Version:** 1.0 - November 2025  
**Methodology:** Structured Systems Analysis (Yourdon-DeMarco)  
**Notation:** Gane-Sarson DFD with Crow's Foot relationships
