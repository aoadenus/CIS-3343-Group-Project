# Entity Relationship Diagram (ERD) - Emily Bakes Cakes
## Current Implementation Schema (November 2025)

---

## ENTITIES AND ATTRIBUTES

### 1. CUSTOMERS (Primary Entity)
```
┌─────────────────────────────────────────────────────────────┐
│                         CUSTOMERS                            │
├─────────────────────────────────────────────────────────────┤
│ PK: id (SERIAL)                                             │
│                                                             │
│ Core Attributes:                                            │
│  • name (VARCHAR 255) NOT NULL                             │
│  • email (VARCHAR 255) NOT NULL UNIQUE                     │
│  • phone (VARCHAR 50) NULL                                 │
│                                                             │
│ Business Metrics:                                           │
│  • totalOrders (INTEGER) DEFAULT 0                         │
│  • lastOrderDate (TIMESTAMP) NULL                          │
│  • isVip (BOOLEAN) DEFAULT FALSE                           │
│  • isGuest (BOOLEAN) DEFAULT FALSE                         │
│                                                             │
│ Administrative:                                             │
│  • adminNotes (TEXT) NULL                                  │
│  • lastModifiedBy (VARCHAR 255) NULL                       │
│                                                             │
│ Audit Trail:                                                │
│  • createdAt (TIMESTAMP) DEFAULT NOW()                     │
│  • updatedAt (TIMESTAMP) DEFAULT NOW()                     │
│  • deletedAt (TIMESTAMP) NULL                              │
│  • deletedBy (VARCHAR 255) NULL                            │
└─────────────────────────────────────────────────────────────┘
```

### 2. ORDERS (Transaction Entity)
```
┌─────────────────────────────────────────────────────────────┐
│                          ORDERS                              │
├─────────────────────────────────────────────────────────────┤
│ PK: id (SERIAL)                                             │
│ FK: customerId → CUSTOMERS.id (NOT NULL)                    │
│                                                             │
│ Order Classification:                                        │
│  • orderType (VARCHAR 50) NOT NULL                         │
│    ['custom', 'shop', 'inquiry']                           │
│                                                             │
│ Custom Cake Specifications:                                 │
│  • occasion (VARCHAR 100) NULL                             │
│  • flavor (VARCHAR 100) NULL [Legacy]                      │
│  • design (VARCHAR 100) NULL                               │
│  • servings (INTEGER) NULL                                 │
│  • layers (TEXT/JSON) NULL                                 │
│    Structure: [{ flavor, fillings[], notes }]              │
│                                                             │
│ Shop Product Reference:                                     │
│  • productName (VARCHAR 255) NULL                          │
│                                                             │
│ Event Details:                                              │
│  • eventDate (TIMESTAMP) NULL                              │
│  • message (TEXT) NULL                                     │
│  • inspirationImages (TEXT/JSON) NULL                      │
│                                                             │
│ Order Management:                                           │
│  • status (VARCHAR 50) DEFAULT 'pending'                   │
│    ['pending','preparing','ready','completed','cancelled']  │
│  • priority (VARCHAR 20) DEFAULT 'medium'                  │
│    ['low', 'medium', 'high']                               │
│                                                             │
│ Financial Tracking:                                         │
│  • totalAmount (INTEGER) NULL [cents]                      │
│  • depositAmount (INTEGER) NULL [cents]                    │
│  • depositRequired (INTEGER) NULL [cents]                  │
│  • depositMet (BOOLEAN) DEFAULT FALSE                      │
│  • balanceDue (INTEGER) NULL [cents]                       │
│  • paymentStatus (VARCHAR 50) DEFAULT 'pending'            │
│    ['pending', 'partial', 'paid', 'refunded']              │
│  • paymentDate (TIMESTAMP) NULL                            │
│  • paymentMethod (VARCHAR 50) NULL                         │
│  • stripePaymentIntentId (VARCHAR 255) NULL                │
│                                                             │
│ Cancellation Tracking:                                      │
│  • cancellationReason (TEXT) NULL                          │
│  • cancelledAt (TIMESTAMP) NULL                            │
│  • cancelledBy (VARCHAR 255) NULL                          │
│                                                             │
│ Notes & Communication:                                      │
│  • additionalNotes (TEXT) NULL [Customer]                  │
│  • adminNotes (TEXT) NULL [Internal]                       │
│                                                             │
│ Audit Trail:                                                │
│  • lastModifiedBy (VARCHAR 255) NULL                       │
│  • createdAt (TIMESTAMP) DEFAULT NOW()                     │
│  • updatedAt (TIMESTAMP) DEFAULT NOW()                     │
│  • deletedAt (TIMESTAMP) NULL                              │
│  • deletedBy (VARCHAR 255) NULL                            │
└─────────────────────────────────────────────────────────────┘
```

### 3. PRODUCTS (Catalog Entity)
```
┌─────────────────────────────────────────────────────────────┐
│                         PRODUCTS                             │
├─────────────────────────────────────────────────────────────┤
│ PK: id (SERIAL)                                             │
│                                                             │
│ Product Information:                                         │
│  • name (VARCHAR 255) NOT NULL                             │
│  • category (VARCHAR 100) NOT NULL                         │
│    ['Cakes', 'Cupcakes', 'Cookies', 'Pastries', etc.]      │
│  • description (TEXT) NOT NULL                             │
│  • image (VARCHAR 500) NULL [URL]                          │
│                                                             │
│ Pricing:                                                    │
│  • price (INTEGER) NOT NULL [cents]                        │
│  • priceRange (VARCHAR 50) NULL                            │
│    e.g., "$45 - $85" for variable pricing                  │
│                                                             │
│ Inventory & Display:                                        │
│  • inStock (BOOLEAN) DEFAULT TRUE                          │
│  • isNew (BOOLEAN) DEFAULT FALSE                           │
│  • isPopular (BOOLEAN) DEFAULT FALSE                       │
│                                                             │
│ Analytics:                                                  │
│  • popularity (INTEGER) DEFAULT 0 [0-100 score]            │
│  • rating (INTEGER) DEFAULT 5 [1-5 stars]                 │
│  • reviews (INTEGER) DEFAULT 0                             │
│                                                             │
│ Audit Trail:                                                │
│  • createdAt (TIMESTAMP) DEFAULT NOW()                     │
│  • updatedAt (TIMESTAMP) DEFAULT NOW()                     │
│  • deletedAt (TIMESTAMP) NULL                              │
│  • deletedBy (VARCHAR 255) NULL                            │
└─────────────────────────────────────────────────────────────┘
```

### 4. INQUIRIES (Lead Entity)
```
┌─────────────────────────────────────────────────────────────┐
│                        INQUIRIES                             │
├─────────────────────────────────────────────────────────────┤
│ PK: id (SERIAL)                                             │
│ FK: customerId → CUSTOMERS.id (NULL)                        │
│                                                             │
│ Contact Information:                                         │
│  • name (VARCHAR 255) NOT NULL                             │
│  • email (VARCHAR 255) NOT NULL                            │
│  • phone (VARCHAR 50) NULL                                 │
│                                                             │
│ Inquiry Details:                                            │
│  • eventDate (TIMESTAMP) NULL                              │
│  • message (TEXT) NULL                                     │
│  • productName (VARCHAR 255) NULL                          │
│  • inspirationImages (TEXT/JSON) NULL                      │
│                                                             │
│ Workflow Tracking:                                          │
│  • status (VARCHAR 50) DEFAULT 'pending'                   │
│    ['pending', 'reviewed', 'contacted']                    │
│  • viewedAt (TIMESTAMP) NULL                               │
│  • viewedBy (VARCHAR 255) NULL                             │
│  • respondedAt (TIMESTAMP) NULL                            │
│                                                             │
│ Audit:                                                      │
│  • createdAt (TIMESTAMP) DEFAULT NOW()                     │
└─────────────────────────────────────────────────────────────┘
```

### 5. CONTACT_MESSAGES (Communication Entity)
```
┌─────────────────────────────────────────────────────────────┐
│                    CONTACT_MESSAGES                          │
├─────────────────────────────────────────────────────────────┤
│ PK: id (SERIAL)                                             │
│                                                             │
│ Contact Information:                                         │
│  • name (VARCHAR 255) NOT NULL                             │
│  • email (VARCHAR 255) NOT NULL                            │
│  • phone (VARCHAR 50) NULL                                 │
│                                                             │
│ Message Content:                                            │
│  • subject (VARCHAR 255) NOT NULL                          │
│  • message (TEXT) NOT NULL                                 │
│  • inspirationImages (TEXT/JSON) NULL                      │
│                                                             │
│ Workflow:                                                   │
│  • status (VARCHAR 50) DEFAULT 'unread'                    │
│    ['unread', 'read', 'responded']                         │
│                                                             │
│ Audit:                                                      │
│  • createdAt (TIMESTAMP) DEFAULT NOW()                     │
└─────────────────────────────────────────────────────────────┘
```

### 6. PAYMENTS (Financial Record Entity)
```
┌─────────────────────────────────────────────────────────────┐
│                         PAYMENTS                             │
├─────────────────────────────────────────────────────────────┤
│ PK: id (SERIAL)                                             │
│ FK: orderId → ORDERS.id (NOT NULL)                          │
│                                                             │
│ Payment Details:                                            │
│  • paymentType (VARCHAR 50) NOT NULL                       │
│    ['credit_card', 'cash', 'check']                        │
│  • amount (INTEGER) NOT NULL [cents]                       │
│  • paymentDate (TIMESTAMP) NOT NULL                        │
│  • paymentStatus (VARCHAR 50) DEFAULT 'completed'          │
│    ['pending', 'completed']                                │
│                                                             │
│ Record-Keeping:                                             │
│  • notes (TEXT) NULL                                       │
│  • recordedBy (VARCHAR 255) NOT NULL                       │
│                                                             │
│ Audit:                                                      │
│  • createdAt (TIMESTAMP) DEFAULT NOW()                     │
│  • updatedAt (TIMESTAMP) DEFAULT NOW()                     │
└─────────────────────────────────────────────────────────────┘
```

---

## RELATIONSHIPS (Crow's Foot Notation)

### 1. CUSTOMERS ─────< ORDERS (One-to-Many)
```
CUSTOMERS ||────────o{ ORDERS
   (1)                  (0..*)

Relationship Type: MANDATORY on ORDER side
Foreign Key: orders.customerId → customers.id
Business Rule: Every order must belong to exactly one customer
Cardinality: One customer can have zero or many orders
```

### 2. CUSTOMERS ─────< INQUIRIES (One-to-Many, Optional)
```
CUSTOMERS ||────────o{ INQUIRIES
   (1)                  (0..*)

Relationship Type: OPTIONAL (NULL allowed)
Foreign Key: inquiries.customerId → customers.id
Business Rule: Inquiries can be linked to existing customers or remain anonymous
Cardinality: One customer can have zero or many inquiries
```

### 3. ORDERS ─────< PAYMENTS (One-to-Many)
```
ORDERS ||────────o{ PAYMENTS
 (1)                (0..*)

Relationship Type: MANDATORY on PAYMENT side
Foreign Key: payments.orderId → orders.id
Business Rule: Every payment record must be associated with an order
Cardinality: One order can have zero or many payment transactions
```

---

## ENTITY RELATIONSHIPS SUMMARY

```
┌──────────────┐
│  CUSTOMERS   │
│   (Core)     │
└───────┬──────┘
        │
        │ 1:M (Mandatory)
        │
        ├─────────────────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│    ORDERS    │          │  INQUIRIES   │
│ (Transaction)│          │   (Leads)    │
└───────┬──────┘          └──────────────┘
        │
        │ 1:M (Mandatory)
        │
        ▼
┌──────────────┐
│   PAYMENTS   │
│  (Financial) │
└──────────────┘

┌──────────────┐          ┌──────────────────┐
│   PRODUCTS   │          │ CONTACT_MESSAGES │
│  (Catalog)   │          │  (Communication) │
│ [Independent]│          │   [Independent]  │
└──────────────┘          └──────────────────┘
```

---

## KEY DESIGN FEATURES

### 1. **Unlimited Layer System (JSONB)**
The `orders.layers` field stores an array of layer objects:
```json
[
  {
    "flavor": "Vanilla",
    "fillings": ["Chocolate Buttercream", "Raspberry"],
    "notes": "Extra thick filling layer"
  },
  {
    "flavor": "Chocolate",
    "fillings": ["White Chocolate Mousse"],
    "notes": ""
  }
]
```
- **Max 2 fillings per layer** (enforced in application logic)
- **Unlimited total layers** supported
- **Layer notes** up to 255 characters

### 2. **Soft Delete Pattern**
Implemented on `customers`, `orders`, and `products`:
- `deletedAt` (TIMESTAMP NULL)
- `deletedBy` (VARCHAR 255 NULL)
- Allows data recovery and audit trail
- Preserves referential integrity

### 3. **Dual Order System**
Orders support both:
- **Custom Builder Orders**: Uses `layers`, `occasion`, `design`
- **Shop Product Orders**: References `productName`
- **Inquiry Conversions**: Can be created from inquiries

### 4. **Comprehensive Payment Tracking**
- Multiple payment records per order
- Automatic status calculation (pending → partial → paid)
- Deposit requirement enforcement (50% minimum)
- Balance due tracking

### 5. **Audit & Compliance**
All major entities include:
- `createdAt` / `updatedAt` timestamps
- `lastModifiedBy` tracking for accountability
- Status workflow management
- Cancellation reason logging

---

## INDEXES (Recommended for Performance)

```sql
-- Customer lookups
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_deleted ON customers(deletedAt) WHERE deletedAt IS NULL;

-- Order queries
CREATE INDEX idx_orders_customer ON orders(customerId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_event_date ON orders(eventDate);
CREATE INDEX idx_orders_created ON orders(createdAt DESC);

-- Payment lookups
CREATE INDEX idx_payments_order ON payments(orderId);
CREATE INDEX idx_payments_date ON payments(paymentDate);

-- Product searches
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_deleted ON products(deletedAt) WHERE deletedAt IS NULL;

-- Inquiry management
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(createdAt DESC);
```

---

## DATA INTEGRITY CONSTRAINTS

1. **Unique Constraints:**
   - `customers.email` UNIQUE

2. **Check Constraints (Application-Level):**
   - Payment amounts must be > 0
   - Deposit must be ≥ 50% of total amount
   - Max 2 fillings per layer
   - Layer notes ≤ 255 characters

3. **Referential Integrity:**
   - ON DELETE CASCADE not used (soft delete pattern)
   - Foreign keys maintained with application-level validation

4. **Business Logic Constraints:**
   - Status transitions validated in application
   - Payment total cannot exceed order total
   - Cancelled orders cannot be modified

---

**Version:** 1.0 - November 2025  
**Database:** PostgreSQL (Neon)  
**ORM:** Drizzle ORM with TypeScript
