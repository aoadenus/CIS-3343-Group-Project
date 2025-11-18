# Emily Bakes Cakes: ERD Update and Database Rationale

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Database Type:** PostgreSQL / MySQL  
**Status:** Production Ready

---

## Executive Summary

This document details all changes to the entity relationship diagram (ERD) based on professor clarification. Key changes include removal of occasion and servings fields, enforcement of firm pricing, addition of per-layer customization support, and new ORDER_ATTACHMENT table for design images.

---

## Key ERD Changes from Original

| What Changed | Reason | Impact |
|--------------|--------|--------|
| Removed: OCCASION field | Professor removed as out-of-scope | Simplifies order form |
| Removed: SERVINGS calculation | Use firm CAKE_SIZE instead | Clearer pricing model |
| Changed: PRICE field | Now FIRM_PRICE (decimal, not range) | No more "$71+" pricing |
| Added: ORDER_LAYER table | Support per-layer customizations | 7-layer maximum |
| Added: ORDER_ATTACHMENT table | Store design images | Supports image uploads |
| Added: CAKE_SIZE lookup table | Standardized sizes | Replaces serving calc |
| Enhanced: CUSTOMER table | Add loyalty and spending tracking | Better reporting |
| Added: EMPLOYEE table | Staff management and assignment | Role-based access |
| Modified: PRODUCT_OPTION | Per-layer flexibility | Dynamic dropdowns |

---

## Complete Updated ERD (Crow's Foot Notation)

\`\`\`
CUSTOMER ||--o{ CUSTOM_ORDER : places
CUSTOMER ||--o{ PAYMENT_TRANSACTION : pays_for

CUSTOM_ORDER ||--o{ ORDER_LAYER : contains
CUSTOM_ORDER ||--o{ ORDER_ATTACHMENT : has
CUSTOM_ORDER ||--o{ PAYMENT_TRANSACTION : has

ORDER_LAYER ||--o{ ORDER_LAYER_OPTION : includes
ORDER_LAYER_OPTION }o--|| PRODUCT_OPTION : selects

CUSTOM_ORDER }o--|| PRODUCT : uses
CUSTOM_ORDER }o--|| CAKE_SIZE : has
CUSTOM_ORDER }o--|| EMPLOYEE : assigned_to
CUSTOM_ORDER }o--|| ORDER_STATUS : has

PRODUCT_OPTION ||--o{ ORDER_LAYER_OPTION : is_selected_on

ORDER_STATUS ||--o{ CUSTOM_ORDER : tracks

EMPLOYEE ||--o{ CUSTOM_ORDER : creates
\`\`\`

---

## Database Tables (Text-Only Crow's Foot)

### Core Entities with Relationships

**CUSTOMER**
- PK: Cust_ID (INT)
- Attributes: First_Name, Last_Name, Email, Phone, Address, Preferences
- Relationships: 1:M with CUSTOM_ORDER (one customer → many orders)

**CUSTOM_ORDER**
- PK: Order_ID (INT)
- FK: Cust_ID (references CUSTOMER)
- FK: Product_ID (references PRODUCT)
- FK: Cake_Size_ID (references CAKE_SIZE)
- FK: Order_Status_ID (references ORDER_STATUS)
- Attributes: Total_Price (DECIMAL, not null), Deposit_Amount, Pickup_Date, Pickup_Time
- Relationships: 1:M with ORDER_LAYER, 1:M with PAYMENT_TRANSACTION, M:1 with CAKE_SIZE

**ORDER_LAYER**
- PK: (Order_ID, Layer_Number)
- FK: Order_ID (references CUSTOM_ORDER)
- Attributes: Layer_Number (1-7), Special_Notes, Position (Bottom/Middle/Top)
- Relationships: 1:M with ORDER_LAYER_OPTION (one layer → many selections)

**ORDER_LAYER_OPTION**
- PK: (Order_ID, Layer_Number, Option_Type, Option_ID)
- FK: Order_ID, Layer_Number (references ORDER_LAYER)
- FK: Option_ID (references PRODUCT_OPTION)
- Attributes: Option_Type (Flavor, Filling, Icing, Color), Quantity
- Relationships: M:1 with PRODUCT_OPTION (many layer options → one product option)

**PRODUCT_OPTION**
- PK: Option_ID (INT)
- Attributes: Option_Name, Option_Type (Flavor/Filling/Icing/Color), Extra_Cost
- Relationships: 1:M with ORDER_LAYER_OPTION, 1:M with ORDER_LAYER

**CAKE_SIZE**
- PK: Size_ID (INT)
- Attributes: Size_Name (Small/Medium/Large/XL), Base_Price, Serves_Min, Serves_Max
- Relationships: 1:M with CUSTOM_ORDER

**ORDER_STATUS**
- PK: Order_Status_ID (INT)
- Attributes: Status_Description (To Be Created, In Baking, Decorating, Ready for Pickup, Picked Up, Cancelled)
- Relationships: 1:M with CUSTOM_ORDER

**ORDER_ATTACHMENT**
- PK: Attachment_ID (INT)
- FK: Order_ID (references CUSTOM_ORDER)
- FK: Layer_Number (can be NULL for order-level images)
- Attributes: File_URL, File_Type (image/jpeg, image/png), Uploaded_Date, File_Size
- Relationships: M:1 with CUSTOM_ORDER, optional M:1 with ORDER_LAYER

**EMPLOYEE**
- PK: Employee_ID (INT)
- FK: Role_ID (references EMPLOYEE_ROLE)
- Attributes: First_Name, Last_Name, Email, Phone, Role (Baker, Sales, Manager, Admin)
- Relationships: 1:M with CUSTOM_ORDER (creation/assignment)

**PAYMENT_TRANSACTION**
- PK: Transaction_ID (INT)
- FK: Order_ID (references CUSTOM_ORDER)
- Attributes: Payment_Amount, Payment_Date, Payment_Method, Status (Pending/Completed/Failed)
- Relationships: M:1 with CUSTOM_ORDER

---

## Key Business Rules Enforced in Schema

### Pricing Rules
**Firm Price Enforcement:**
- CUSTOM_ORDER.Total_Price is DECIMAL(10,2), NOT NULL
- No price ranges stored
- Validation: Total_Price > 0
- Validation: Total_Price >= 20.00 (minimum order)

**Deposit Rules:**
- Deposit_Amount: DECIMAL(10,2), NOT NULL
- Validation: Deposit_Amount >= (Total_Price * 0.5)
- Validation: Deposit_Amount <= Total_Price
- Check constraint: CHECK (Deposit_Amount >= Total_Price * 0.5)

### Layer Rules
**Maximum Layers:**
- ORDER_LAYER.Layer_Number: INT, range 1-7
- Check constraint: CHECK (Layer_Number BETWEEN 1 AND 7)
- Cannot create Order_ID with Layer_Number > 7

**Per-Layer Customization:**
- Each layer can have independent selections
- Flavor (1 per layer)
- Filling (1 per layer)
- Icing Flavor (1 per layer)
- Writing Color (1 per layer)
- Special Notes (text, optional)
- Images (optional, per layer)

### Temporal Rules
**Pickup Date Validation:**
- CUSTOM_ORDER.Pickup_Date: DATE, NOT NULL
- Validation: Pickup_Date >= CURRENT_DATE + 2 days
- Exception: Manager can override (logged in audit)

### Referential Integrity
- FK constraints with ON DELETE CASCADE for orders
- FK constraints with ON DELETE RESTRICT for lookups (prevent deleting used options)
- All PK/FK data types match exactly

---

## Indexes and Performance Optimization

### Primary Indexes (Mandatory)

\`\`\`sql
-- Customer lookup
CREATE INDEX idx_customer_email ON CUSTOMER(Email);
CREATE INDEX idx_customer_name ON CUSTOMER(Last_Name, First_Name);

-- Order lookup
CREATE INDEX idx_order_customer ON CUSTOM_ORDER(Cust_ID);
CREATE INDEX idx_order_status ON CUSTOM_ORDER(Order_Status_ID);
CREATE INDEX idx_order_pickup_date ON CUSTOM_ORDER(Pickup_Date);
CREATE INDEX idx_order_created_date ON CUSTOM_ORDER(Order_Date);

-- Layer lookup
CREATE INDEX idx_layer_order ON ORDER_LAYER(Order_ID);

-- Attachment lookup
CREATE INDEX idx_attachment_order ON ORDER_ATTACHMENT(Order_ID);
\`\`\`

### Composite Indexes (High-Impact)

\`\`\`sql
-- Revenue reporting by date
CREATE INDEX idx_order_date_status ON CUSTOM_ORDER(Pickup_Date, Order_Status_ID);

-- Customer order history
CREATE INDEX idx_customer_order_date ON CUSTOM_ORDER(Cust_ID, Order_Date DESC);

-- Layer option selection
CREATE INDEX idx_layer_option_order ON ORDER_LAYER_OPTION(Order_ID, Layer_Number);
\`\`\`

### Full-Text Search Index

\`\`\`sql
-- Customer search
CREATE FULLTEXT INDEX idx_customer_search 
ON CUSTOMER(Cust_First_Name, Cust_Last_Name, Cust_Email_Addr);
\`\`\`

---

## Field Cardinality and Optionality

| Table | Field | Type | PK | FK | Null | Unique | Default |
|-------|-------|------|----|----|------|--------|---------|
| CUSTOMER | Cust_ID | INT | ✓ | | N | ✓ | auto |
| | Email | VARCHAR | | | N | ✓ | |
| | Phone | VARCHAR | | | Y | | |
| CUSTOM_ORDER | Order_ID | INT | ✓ | | N | ✓ | auto |
| | Cust_ID | INT | | ✓ | N | | |
| | Total_Price | DECIMAL | | | N | | |
| | Deposit_Amount | DECIMAL | | | N | | |
| | Pickup_Date | DATE | | | N | | |
| ORDER_LAYER | Order_ID | INT | ✓ | ✓ | N | | |
| | Layer_Number | INT | ✓ | | N | | |
| | Special_Notes | VARCHAR | | | Y | | |
| CAKE_SIZE | Size_ID | INT | ✓ | | N | ✓ | auto |
| | Base_Price | DECIMAL | | | N | | |

**Legend:**
- PK = Primary Key
- FK = Foreign Key
- Null = Allows NULL values
- Unique = Unique constraint
- Default = Default value if not provided

---

## Data Type Specifications

**Decimal Precision:**
- DECIMAL(10,2) for all prices and amounts
- Ensures exact currency calculations (not FLOAT)

**String Lengths:**
- Names: VARCHAR(50) max
- Email: VARCHAR(100) max
- Phone: VARCHAR(20) max
- Notes: VARCHAR(500) max
- Text fields: TEXT for unlimited

**Temporal:**
- Dates: DATE (YYYY-MM-DD)
- Times: TIME (HH:MM:SS)
- Timestamps: TIMESTAMP with current_timestamp()

**Boolean:**
- Use CHAR(1) with values 'Y'/'N'
- Or use BOOLEAN/TINYINT(1)

---

## Sample Data Relationships

**Example Order with 3 Layers:**

\`\`\`
Order #1001
├─ Customer: John Smith (Cust_ID: 123)
├─ Product: Chocolate Cake (Product_ID: 5)
├─ Cake Size: Large (Size_ID: 3, Base Price: $45)
├─ Total Price: $75.00
├─ Deposit: $40.00 (minimum 50%)
├─ Pickup Date: 2026-01-15
├─ Pickup Time: 14:00
├─ Status: In Baking
└─ Layers:
   ├─ Layer 1 (Bottom)
   │  ├─ Flavor: Chocolate (Option_ID: 10, +$5)
   │  ├─ Filling: Raspberry (Option_ID: 20, +$3)
   │  ├─ Icing: Dark Chocolate (Option_ID: 35)
   │  ├─ Color: Red (Option_ID: 50)
   │  └─ Notes: "Extra filling"
   │
   ├─ Layer 2 (Middle)
   │  ├─ Flavor: Vanilla (Option_ID: 11)
   │  ├─ Filling: Vanilla (Option_ID: 21)
   │  ├─ Icing: Vanilla (Option_ID: 36)
   │  ├─ Color: Ivory (Option_ID: 51)
   │  └─ Notes: ""
   │
   └─ Layer 3 (Top)
      ├─ Flavor: Strawberry (Option_ID: 12, +$2)
      ├─ Filling: Strawberry (Option_ID: 22, +$2)
      ├─ Icing: Cream Cheese (Option_ID: 37, +$3)
      ├─ Color: Pink (Option_ID: 52)
      └─ Notes: "Decorative flowers on top"
\`\`\`

---

## Migration Path from Old Schema

**Steps to implement:**
1. Create new tables (CAKE_SIZE, ORDER_LAYER, ORDER_ATTACHMENT, etc.)
2. Migrate existing orders to new structure (if applicable)
3. Add new indexes
4. Add check constraints
5. Verify referential integrity
6. Test with sample data

**Backward Compatibility:**
- No need to support old schema once migrated
- All legacy orders must be converted to ORDER_LAYER structure

---

## Related Documents

- **01_SCOPE_AND_NON_GOALS.md** - Project scope
- **06_DFD_UPDATE_AND_DATA_STORES.md** - Data flow context
- **07_DATABASE_MIGRATIONS_AND_SEED_DATA.md** - Migration scripts
- **08_API_SPEC_DIFF_AND_NEW_ENDPOINTS.md** - API implementation

---

**Status:** Ready for Database Implementation  
**Last Updated:** November 5, 2025
