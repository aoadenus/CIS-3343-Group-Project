# Emily Bakes Cakes: DFD Update and Data Stores

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Format:** Gane & Sarson Data Flow Diagrams  
**Status:** Production Ready

---

## Executive Summary

This document provides updated Data Flow Diagrams (DFDs) aligned with the professor's clarification. The system is now focused on **internal staff order management** (not customer e-commerce). The diagrams show how data flows between staff, system, and data stores through the complete order lifecycle.

**Key Change:** Removed all customer-facing flows. Added staff-focused flows for order entry, status tracking, and manager reporting.

---

## Context Diagram (Level 0)

\`\`\`
                        ┌─────────────────────────┐
                        │   Emily Bakes Cakes     │
                        │   Order Management      │
                        │       System            │
                        └─────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │  Staff  │ │ Manager │ │ Bakery  │  **note - there are more roles to add *
              │ (Entry) │ │ (Admin) │ │ (Baker) │
              └─────────┘ └─────────┘ └─────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 │
                        ┌─────────────────────────┐
                        │  Optional Public        │
                        │  Website (Separate)     │ **note - maybe noinquiries its extra**
                        │  (Inquiry emails)       │
                        └─────────────────────────┘
\`\`\`

**External Entities:**
- **Staff (Order Entry):** Create orders, enter customer info, manage order details
- **Manager (Admin):** View reports, configure products, manage staff
- **Baker:** Update order status, view production details
- **Public Website:** Send inquiry emails (separate system)

---

## Level 1 DFD: Main Processes

\`\`\`
                        CUSTOMER
                          │
                          │ (calls/emails/visits)
                          │
                    ┌─────▼─────┐
                    │    1.0     │
                    │ ENTER      │
                    │ CUSTOMER   │
                    │ INFO       │
                    └─────┬─────┘
                          │
                   ┌──────┴──────┐
                   │             │
                   ▼             ▼
            ┌──────────────┐  ┌──────────────┐
            │   2.0        │  │ CUSTOMER     │
            │ CREATE ORDER │  │ RECORDS D.S. │
            │   & CUSTOM   │  │              │
            │   DETAILS    │  └──────────────┘
            └──────┬───────┘
                   │
          ┌────────┼────────┐
          │        │        │
          ▼        ▼        ▼
      ┌────────┐ ┌────────┐ ┌────────┐
      │ ORDER  │ │ PROD   │ │ ATTACH │
      │ LOG    │ │ OPTS   │ │ MENTS  │
      │ D.S.   │ │ D.S.   │ │ D.S.   │
      └────────┘ └────────┘ └────────┘
          │                     │
          │        ┌────────────┘
          │        │
          ▼        ▼
    ┌──────────────────┐
    │      3.0         │
    │ UPDATE ORDER     │ **note - here we can send email to cust to track order*
    │ STATUS & TRACK   │
    │ PRODUCTION       │
    └──────────────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐  ┌───────────────┐
│ORDERS   │  │MANAGER REPORTS│
│D.S.     │  │& ANALYTICS    │
└─────────┘  └───────────────┘
\`\`\`

**Processes:**
1. **1.0 - Enter Customer Info:** Staff searches or creates customer record
2. **2.0 - Create Order & Customize:** Staff enters order details, layers, pricing
3. **3.0 - Update Order Status & Track:** Baker/staff update status, manager views reports

**Data Stores:**
- **D1: Customer Records** - Customer contact, preferences, order history
- **D2: Order Log** - All orders, customizations, status, pricing
- **D3: Product Options** - Flavors, fillings, icings, colors (dynamic)
- **D4: Attachments** - Design images, specifications
- **D5: Payments** - Deposit tracking, payment status

---

## Level 2 DFD: Process 2.0 (Create Order & Customize)

\`\`\`
STAFF
  │
  ▼
┌─────────────────────────────────────────────┐
│ 2.1 SELECT CUSTOMER                         │
├─────────────────────────────────────────────┤
│ Input:  Customer name or ID                 │
│ Output: Customer details (ID, email, phone) │
│ Data:   D1 - Customer Records              │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ 2.2 SELECT PRODUCT & SIZE                   │
├─────────────────────────────────────────────┤
│ Input:  Base product, cake size             │
│ Output: Product ID, base price              │
│ Data:   D3 - Product Options               │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ 2.3 ADD LAYERS (UP TO 7)                    │ **note - no max *
├─────────────────────────────────────────────┤
│ Input:  Per-layer: flavor, filling,         │
│         icing, color, notes, image          │
│ Output: Layer customizations                │
│ Data:   D3 - Product Options               │
│         D4 - Attachments (images)          │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ 2.4 VALIDATE & CALCULATE PRICE              │
├─────────────────────────────────────────────┤
│ Input:  Base price + layer adjustments      │
│ Output: Firm total price                    │
│ Rules:  Min $20, no ranges                 │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ 2.5 SET DELIVERY & DEPOSIT                  │
├─────────────────────────────────────────────┤
│ Input:  Pickup date, time, deposit amount   │
│ Output: Validated delivery details          │
│ Rules:  Pickup >= today + 2 days           │
│         Deposit >= 50% of total            │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ 2.6 CREATE & SAVE ORDER                     │
├─────────────────────────────────────────────┤
│ Input:  All order details                   │
│ Output: Order ID, confirmation              │
│ Data:   D2 - Order Log                      │
│         D5 - Payments (deposit)             │
└─────────────────────────────────────────────┘
                    │
                    ▼
                  STAFF
              (Confirmation)
\`\`\`

---

## Level 2 DFD: Process 3.0 (Update Status & Track)

\`\`\`
BAKER / MANAGER
       │
       ▼
┌─────────────────────────────────────────────┐
│ 3.1 VIEW ORDER DETAILS                      │
├─────────────────────────────────────────────┤
│ Input:  Order ID                            │
│ Output: Full order customization details    │
│ Data:   D2 - Order Log                      │
│         D4 - Attachments                    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ 3.2 UPDATE ORDER STATUS                     │
├─────────────────────────────────────────────┤
│ Input:  New status (To Created, In Baking,  │
│         Decorating, Ready, Picked Up)       │
│ Output: Updated status, timestamp, user     │
│ Rules:  Valid state transitions only       │
│ Data:   D2 - Order Log                      │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ 3.3 GENERATE REPORTS & ANALYTICS            │
├─────────────────────────────────────────────┤
│ Input:  Date range, filters                 │
│ Output: Revenue totals, order counts        │
│ Data:   D2 - Order Log                      │
│         D5 - Payments                       │
└─────────────────────────────────────────────┘
                    │
                    ▼
                 MANAGER
              (Dashboard)
\`\`\`

---

## Data Store Specifications

### D1: Customer Records

**Purpose:** Store customer contact and preference information

**Data Elements:**
- Cust_ID (PK)
- Cust_First_Name
- Cust_Last_Name
- Cust_Email_Addr
- Cust_Phone_Number
- Cust_Address_Line_1
- Cust_Address_State
- Cust_Zip_Code
- Cust_Status (Active, Inactive, VIP)
- Preferred_Customer (Y/N)
- Total_Orders (denormalized for quick stats)
- Total_Spending (denormalized for quick stats)
- Last_Order_Date
- Created_Date
- Updated_Date

**Accessed By:**
- Process 2.1 (Select Customer) - READ
- Process 1.0 (Enter Customer) - WRITE

---

### D2: Order Log

**Purpose:** Track all orders and customizations

**Data Elements:**
- Order_ID (PK)
- Cust_ID (FK to D1)
- Product_ID (FK to D3)
- Cake_Size_ID (FK to D3)
- Order_Date
- Pickup_Date
- Pickup_Time
- Order_Status_ID (To Created, In Baking, Decorating, Ready, Picked Up, Cancelled)
- Firm_Price (DECIMAL)
- Deposit_Amount (DECIMAL)
- Balance_Due (calculated)
- Created_By (Employee ID)
- Updated_By (Employee ID)
- Updated_Date
- Special_Requests (VARCHAR)

**Sub-Records (One-to-Many):**
- ORDER_LAYER (per-layer details)
  - Layer_Number (1-7)
  - Flavor_Option_ID (FK to D3)
  - Filling_Option_ID (FK to D3)
  - Icing_Option_ID (FK to D3)
  - Writing_Color_Option_ID (FK to D3)
  - Layer_Notes

**Accessed By:**
- Process 2.0 (Create Order) - WRITE
- Process 3.0 (Update Status) - READ, UPDATE
- Process 3.3 (Generate Reports) - READ

---

### D3: Product Options

**Purpose:** Dynamic lookup for cakes, flavors, fillings, icings, colors

**Data Elements:**
- Option_ID (PK)
- Option_Name (e.g., "Chocolate", "Vanilla", "Ganache")
- Option_Type (Flavor, Filling, Icing, Color, Size, Accessory)
- Extra_Cost (DECIMAL)
- Display_Order (INT)
- Is_Active (Y/N)
- Category (Cake Flavor, Filling, Icing, Color, etc.)
- Created_Date
- Updated_Date

**Accessed By:**
- Process 2.2 (Select Product & Size) - READ
- Process 2.3 (Add Layers) - READ
- Manager (Admin config) - READ, WRITE

---

### D4: Attachments

**Purpose:** Store design images and specifications

**Data Elements:**
- Attachment_ID (PK)
- Order_ID (FK to D2)
- Layer_Number (1-7, or NULL for order-level)
- File_URL (S3 or local path)
- File_Type (image/jpeg, image/png, image/webp)
- File_Size (INT)
- File_Name (original filename)
- Uploaded_By (Employee ID)
- Uploaded_Date
- Created_Date

**Accessed By:**
- Process 2.3 (Add Layers) - WRITE
- Process 3.1 (View Order Details) - READ

---

### D5: Payments

**Purpose:** Track deposits and payment status

**Data Elements:**
- Transaction_ID (PK)
- Order_ID (FK to D2)
- Payment_Amount (DECIMAL)
- Payment_Date
- Payment_Method (Cash, Credit Card, Check)
- Transaction_Status (Pending, Completed, Failed, Refunded)
- Transaction_Reference (auth code)
- Created_Date
- Notes (VARCHAR)

**Accessed By:**
- Process 2.5 (Set Delivery & Deposit) - WRITE
- Process 3.3 (Generate Reports) - READ

---

## Data Dictionary: Key Fields

| Field | Type | Length | Format | Constraint |
|-------|------|--------|--------|-----------|
| Order_ID | INT | - | Auto-increment | PK |
| Firm_Price | DECIMAL | 10,2 | Currency | NOT NULL, > 0 |
| Deposit_Amount | DECIMAL | 10,2 | Currency | NOT NULL, >= 50% of Firm_Price |
| Pickup_Date | DATE | - | YYYY-MM-DD | NOT NULL, >= today + 2 |
| Layer_Number | INT | - | 1-7 | NOT NULL, CHECK (1-7) |
| Option_ID | INT | - | Auto-increment | FK to Options |
| File_Size | INT | - | Bytes | <= 5,242,880 (5MB) |

---

## Process Summary: Key Flows

### Flow 1: Customer → Order Entry → Customization

\`\`\`
Customer calls/emails/visits
        │
        ▼
Staff logs into system
        │
        ▼
[2.1] Search customer OR [1.0] Create customer
        │
        ▼
[2.2] Select product & size
        │
        ▼
[2.3] Add layers (1-7) with customizations **note - no max *
        │
        ▼
[2.4] Validate & calculate price
        │
        ▼
[2.5] Set delivery date & deposit
        │
        ▼
[2.6] Create & save order
        │
        ▼
Order saved to D2 (Order Log)
Deposit tracked in D5 (Payments)
        │
        ▼
Staff shows Order ID to customer
\`\`\`

### Flow 2: Status Tracking & Production

\`\`\`
Order created [Status: To Be Created]
        │
        ▼
Baker views order [3.1]
        │
        ▼
Baker starts baking
        │
        ▼
[3.2] Update status → "In Baking"
        │
        ▼
Baker finishes, passes to decorator
        │
        ▼
[3.2] Update status → "Decorating"
        │
        ▼
Decorator finishes
        │
        ▼
[3.2] Update status → "Ready for Pickup"
        │
        ▼
Manager dashboard shows ready orders
        │
        ▼
Customer picks up cake
        │
        ▼
[3.2] Update status → "Picked Up"
\`\`\`

### Flow 3: Manager Reporting

\`\`\`
Manager logs in [Manager role only]
        │
        ▼
[3.3] Generate Revenue Report
        │
        ├─ Date range filter (Today, Week, Month, Quarter, Custom)
        ├─ Sum all Firm_Price WHERE Pickup_Date IN range
        ├─ Count orders by status
        ├─ List top customers by spending
        │
        ▼
Dashboard displays KPIs
        │
        ├─ Total Revenue: $5,430.00
        ├─ Order Count: 34
        ├─ Average Order: $159.70
        ├─ Orders by Status: pie chart
        └─ Top Customers: table
\`\`\`

---

## Balancing Notes

**DFD Balancing (Flows match between levels):**

✅ **Context Diagram Balance:**
- Level 0 shows staff, manager, baker as external entities
- Level 1 breaks into 3 main processes
- Each level 1 process decomposes to Level 2

✅ **Data Store Consistency:**
- All data created at Level 1 flows to correct Level 2 processes
- No data appears without source
- No data consumed without being produced first

✅ **Entity Consistency:**
- Staff appears in multiple processes (entry, status update)
- Manager only in reporting
- Baker only in status update
- All interactions documented

---

## Security Considerations in Data Flow

**Authentication:**
- Login required before any process
- Role-based access (Staff vs Manager) **note - vs accountant vs baker vs decorator**

**Authorization:**
- Staff: Can create orders, view own orders
- Manager: Can view all orders, create reports, configure products
- Baker: Can update status, view production details

**Data Protection:**
- All data in transit: HTTPS/TLS
- Sensitive data at rest: Encrypted
- Audit trail: All status changes logged with user/timestamp

---

## Related Documents

- **05_ERD_UPDATE_AND_RATIONALE.md** - Complete database schema
- **07_DATABASE_MIGRATIONS_SEED.md** - SQL implementation
- **08_API_SPEC_AND_ENDPOINTS.md** - API processes
- **02_INFORMATION_ARCHITECTURE.md** - User workflows

---

**Status:** Production Ready  
**Last Updated:** November 5, 2025
