# Emily Bakes Cakes - Professor's ERD Enhancement Notes
## Detailed Implementation Guide Based on Class Review

**Project:** Emily Bakes Cakes Bakery Application  
**Date Created:** November 5, 2025  
**Purpose:** Comprehensive Enhancement Documentation to Complement 05_ERD_UPDATE_AND_RATIONALE.md  
**Status:** Ready for Integration into Primary ERD Documentation

---

## 📋 Table of Contents

1. [Overview of Enhancements](#overview-of-enhancements)
2. [Customer Management Refinements](#customer-management-refinements)
3. [Order Processing Architecture](#order-processing-architecture)
4. [Layer Management System](#layer-management-system)
5. [Status Tracking Implementation](#status-tracking-implementation)
6. [Disaster Recovery Considerations](#disaster-recovery-considerations)
7. [Entity Relationships Summary](#entity-relationships-summary)
8. [Implementation Recommendations](#implementation-recommendations)

---

## Overview of Enhancements

The professor's review emphasized creating a **more granular and detailed ERD** that captures the complexity of the custom cake baking process. The key objective is to track order status at multiple levels—from order initiation through layer completion—while maintaining data integrity through proper foreign key relationships and status tables.

### Key Principles Emphasized
- **Modularity**: Each status type deserves its own entity and table
- **Foreign Key Enforcement**: Use foreign keys to force relationships back to parent tables
- **Dynamic Status Management**: Status tables allow for flexible, business-rule-driven status codes
- **Audit Trail**: The detailed structure enables comprehensive tracking of order progression
- **Disaster Recovery**: Inclement weather reporting capability built into the design

---

## Customer Management Refinements

### Customer Entity Enhancement

**Primary Keys:** The Customer entity uses a **composite approach** for better data management.

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| **CustomerID** | Integer | Primary Key (Auto-Numeric) | Unique customer identifier |
| **CustomerNumber** | String | Alternate Key | Business-facing customer reference |
| **FirstName** | String(50) | NOT NULL | Customer first name |
| **LastName** | String(50) | NOT NULL | Customer last name |
| **Email** | String(100) | UNIQUE | Primary contact and system login |
| **Phone** | String(20) | NOT NULL | Contact number |
| **Address** | String(255) | NULL | Delivery/billing address |
| **SegmentType** | String(10) | NOT NULL | Retail or Corporate classification |
| **CustomerStatusID** | Integer | Foreign Key to CustomerStatus | Current customer status code |

### Customer Status Entity

**Relationship:** Customer has a **one-to-many** relationship with CustomerStatus, allowing a single customer status code to apply to multiple customers, but each customer record points to exactly one active status.

**Status Table Structure:**

| Status Code | Description | Business Logic |
|-------------|-------------|-----------------|
| **1** | Active | Customer is current and can place orders |
| **2** | Inactive | Former customer; can be reactivated |
| **3** | Out of Business | Corporate customer has ceased operations |
| **4** | Banned | Customer account suspended (payment issues, behavioral concerns) |

**CustomerStatus Entity Definition:**

| Field | Type | Purpose |
|-------|------|---------|
| **CustomerStatusID** | Integer | Primary Key (Auto-Numeric) |
| **StatusCode** | Integer(1) | Numeric code (1-4) for dropdown representation |
| **StatusDescription** | String(50) | Human-readable label |
| **IsActive** | Boolean | Flag for currently available statuses |
| **CreatedDate** | DateTime | Audit trail |
| **ModifiedDate** | DateTime | Audit trail |

### Rationale for Status Table Separation

By creating a separate `CustomerStatus` table, the system gains:
- **Flexibility**: Status options can be added without modifying the Customer table structure
- **Consistency**: All status codes are defined in one place, reducing errors
- **Reporting**: Easy to query customers by status across the entire customer base
- **Audit Trail**: Track when statuses change and by whom

**Relationship Pattern:**
\`\`\`
CustomerStatus (1) ──has──> (∞) Customer
\`\`\`

---

## Order Processing Architecture

### Order Entity Enhancement

The Order entity serves as the central hub for the order fulfillment workflow.

**Core Order Attributes:**

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| **OrderID** | Integer | Primary Key (Auto-Numeric) | Unique order identifier |
| **CustomerID** | Integer | Foreign Key to Customer | Links to the customer who placed the order |
| **EmployeeID** | Integer | Foreign Key to Employee | Staff member assigned for fulfillment |
| **OrderStatusID** | Integer | Foreign Key to OrderStatus | Current phase of order creation |
| **OrderDate** | DateTime | NOT NULL | When order was placed |
| **DeliveryDate** | Date | NOT NULL | Target completion/pickup date |
| **TotalPrice** | Decimal(10,2) | NULL | Calculated total (nullable until finalized) |
| **PaymentStatus** | String(20) | NOT NULL | Paid, Pending, Failed, Refunded |
| **CreatedDate** | DateTime | NOT NULL | System audit field |
| **ModifiedDate** | DateTime | NOT NULL | System audit field |

### Order Status Entity

**Relationship:** Order has a **one-to-many** relationship with OrderStatus; multiple orders can have the same status, but each order has exactly one current status.

**Order Status Codes and Tracking:**

| Status Code | Status Description | Business Context |
|-------------|-------------------|-----------------|
| **1** | Pending | Order received; awaiting design/ingredient confirmation |
| **2** | In Progress | Design approved; baking has commenced |
| **3** | Picked Up / On Hold | Order partially complete or held for customer decision |
| **4** | Ready | Order complete and ready for delivery/pickup |
| **5** | Delivered/Completed | Order fulfilled and closed |

**OrderStatus Entity Definition:**

| Field | Type | Purpose |
|-------|------|---------|
| **OrderStatusID** | Integer | Primary Key (Auto-Numeric) |
| **StatusCode** | Integer | Numeric representation for frontend dropdown |
| **StatusName** | String(50) | Display name (e.g., "In Progress") |
| **Description** | String(255) | Detailed explanation of what this status means |
| **IsTerminal** | Boolean | Flag indicating if order can transition out of this status |
| **AllowsModification** | Boolean | Can order details be changed in this status? |
| **CreatedDate** | DateTime | Audit information |
| **ModifiedDate** | DateTime | Audit information |

### Key Relationship: Customer → Order → OrderStatus

\`\`\`
Customer (1) ──places──> (∞) Order
Order (1) ──has──> (∞) OrderStatus (lookup)
\`\`\`

**Business Rule:** An order cannot exist without an associated customer. Every order must be assigned to an employee once created. Order status transitions follow a defined workflow to prevent invalid state changes.

---

## Layer Management System

### The Challenge: Tracking Multi-Layer Cake Completion

Custom cakes often consist of multiple layers, each requiring distinct preparation steps (baking, cooling, decoration, assembly). The teacher emphasized the importance of granular layer tracking to answer: "Which layers are done? Are we waiting on layer 1? Is layer 2 decorated?"

### Layer Entity

**Purpose:** Each layer in a cake is tracked as an individual record, allowing precise progress monitoring.

**Layer Entity Definition:**

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| **LayerID** | Integer | Primary Key (Auto-Numeric) | Unique layer identifier |
| **OrderLineID** | Integer | Foreign Key to OrderLine | Links layer to its parent order line item |
| **LayerSequence** | Integer | NOT NULL | Layer position (1=bottom, 2=middle, 3=top, etc.) |
| **LayerDescription** | String(255) | NULL | "Vanilla sponge, 8-inch round" or custom notes |
| **LayerStatusID** | Integer | Foreign Key to LayerStatus | Current preparation state |
| **BakingStartDate** | DateTime | NULL | When layer baking commenced |
| **BakingCompleteDate** | DateTime | NULL | When layer baking finished |
| **DecoratingStartDate** | DateTime | NULL | When decoration began |
| **DecoratingCompleteDate** | DateTime | NULL | When decoration finished |
| **AssemblyDate** | DateTime | NULL | When layer was assembled into final product |
| **Notes** | String(500) | NULL | Special instructions or modifications |
| **CreatedDate** | DateTime | NOT NULL | System audit |
| **ModifiedDate** | DateTime | NOT NULL | System audit |

### Layer Status Entity

**Relationship:** Layer has a **one-to-many** relationship with LayerStatus.

**Layer Status Codes - Detailed Workflow:**

| Status Code | Status Name | Workflow Description |
|-------------|------------|----------------------|
| **1** | Not Started | Layer scheduled but work hasn't begun |
| **2** | Baking | Layer is currently in the oven |
| **3** | Cooling | Layer is cooling after baking |
| **4** | Ready for Decoration | Layer is cooled and available for next phase |
| **5** | Decorating | Active decoration in progress |
| **6** | Decorated Complete | Layer fully decorated and cured | **note - ready for pickup is better here **
| **7** | Assembled | Layer has been stacked/assembled into final cake |
| **8** | On Hold | Waiting for customer decision or ingredient availability |
| **9** | Cancelled** | Layer cancelled (customer request or ingredient issue) |

**LayerStatus Entity Definition:**

| Field | Type | Purpose |
|-------|------|---------|
| **LayerStatusID** | Integer | Primary Key (Auto-Numeric) |
| **StatusCode** | Integer | Numeric code for system reference |
| **StatusName** | String(50) | Display name |
| **Description** | String(255) | Detailed status explanation |
| **PercentComplete** | Integer | Progress indicator (0-100%) |
| **AllowsLayerTransition** | Boolean | Can this status transition to next phase? |
| **RequiresApproval** | Boolean | Does this status require staff/customer sign-off? |
| **CreatedDate** | DateTime | Audit trail |
| **ModifiedDate** | DateTime | Audit trail |

### Rationale for Granular Layer Tracking

The professor emphasized that tracking at the layer level provides:
- **Real-time Visibility**: Customers can see exactly which layers are complete
- **Resource Allocation**: Staff can prioritize work based on layer status
- **Quality Control**: Each layer's progress is independently documented
- **Audit Trail**: Complete history of each layer's creation timeline

---

## OrderLine Entity

### Purpose
OrderLine is the **associative entity** that resolves the many-to-many relationship between Order and Product. It represents a single line item in a custom cake order.

**OrderLine Entity Definition:**

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| **OrderLineID** | Integer | Primary Key (Auto-Numeric) | Unique line item identifier |
| **OrderID** | Integer | Foreign Key to Order | Links to parent order |
| **ProductID** | Integer | Foreign Key to Product | Links to product ordered |
| **OrderLineStatusID** | Integer | Foreign Key to OrderLineStatus | Current fulfillment status |
| **Quantity** | Integer | NOT NULL | Number of cakes/items ordered |
| **UnitPrice** | Decimal(10,2) | NOT NULL | Price per unit at order time |
| **ExtendedPrice** | Decimal(10,2) | NOT NULL | Quantity × UnitPrice |
| **CustomizationDetails** | JSON | NULL | Custom specifications (flavors, decorations) |
| **SpecialInstructions** | String(500) | NULL | Customer notes |
| **CreatedDate** | DateTime | NOT NULL | Audit field |
| **ModifiedDate** | DateTime | NOT NULL | Audit field |

### OrderLineStatus Entity

**Purpose:** Tracks fulfillment status of each line item within an order.

**OrderLineStatus Codes:**

| Status Code | Description | Relationship to Layers |
|-------------|-------------|----------------------|
| **1** | Pending | Order line received; waiting for layer breakdown |
| **2** | In Production** | One or more layers are in progress |
| **3** | Partially Complete | Some layers finished; others in progress |
| **4** | Complete | All layers finished and assembled |
| **5** | Quality Check | Final inspection before delivery |
| **6** | Ready for Pickup/Delivery | Approved and scheduled |
| **7** | Delivered | Customer received the item |

**Key Business Rule:** OrderLineStatus is **automatically updated based on aggregate LayerStatus values**. When all layers reach "Assembled" status, OrderLineStatus transitions to "Complete."

### Relationships
\`\`\`
OrderLine (1) ──contains──> (∞) Layer
OrderLine (1) ──has──> (1) OrderLineStatus (lookup)
Layer (1) ──has──> (1) LayerStatus (lookup)
\`\`\`

---

## Status Tracking Implementation

### Unified Status Architecture

All status tables follow a consistent pattern for maintainability:

\`\`\`sql
CREATE TABLE [Status_Entity_Name] (
    [StatusID] INT PRIMARY KEY IDENTITY(1,1),
    [StatusCode] INT NOT NULL UNIQUE,
    [StatusName] VARCHAR(50) NOT NULL,
    [Description] VARCHAR(255),
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [ModifiedDate] DATETIME NOT NULL DEFAULT GETDATE()
);
\`\`\`

### Dynamic Status Advantages

By implementing status as separate lookup tables:

1. **Extensibility**: New statuses can be added without code changes
2. **Validation**: Foreign key constraints prevent invalid status assignments
3. **Reporting**: Status codes enable consistent business intelligence queries
4. **Multi-level Tracking**: Different entities track different aspects of the cake workflow
5. **Audit Trail**: Every status change is time-stamped

### Status Propagation Workflow

\`\`\`
Layer Progress → LayerStatus Updated
                      ↓
                OrderLine Recalculates
                      ↓
                OrderLineStatus Updated
                      ↓
                Order Summarizes Progress
                      ↓
                OrderStatus Reflects Overall Progress
\`\`\`

---

## Disaster Recovery Considerations

### IncidentWeatherReport Entity

The professor emphasized the importance of **disaster recovery planning**. In a bakery context, inclement weather can disrupt order fulfillment, ingredient deliveries, and staff availability.

**IncidentWeatherReport Entity Definition:**

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| **IncidentID** | Integer | Primary Key (Auto-Numeric) | Unique incident identifier |
| **IncidentDate** | Date | NOT NULL | Date of weather event |
| **WeatherCondition** | String(100) | NOT NULL | Description (snow, flood, etc.) |
| **Severity** | Integer(1-5) | NOT NULL | Impact level: 1=Low, 5=Critical |
| **AffectedOrderIDs** | String | NULL | Comma-separated order IDs impacted |
| **StaffAvailability** | String(50) | NULL | Staff unavailable due to weather |
| **IngredientDeliveryImpact** | Boolean | NULL | Were deliveries disrupted? |
| **DeliveryDateAdjustments** | String(255) | NULL | Orders requiring reschedule |
| **ReportedBy** | String(100) | NOT NULL | Employee reporting incident |
| **ReportedDate** | DateTime | NOT NULL | When incident was documented |
| **ResolutionNotes** | String(500) | NULL | How orders were handled |
| **CreatedDate** | DateTime | NOT NULL | System audit |

### Disaster Recovery Business Rules **note - NO this should me more an option to donwload critical info and print in a few seconds, for if system is down for days business can keep on, on paper **

1. **Automatic Flagging**: When weather incident is created, system automatically flags affected orders
2. **Customer Notification**: Alerts sent to affected customers about delivery delays
3. **Rescheduling Logic**: Delivery dates extended appropriately with customer consent
4. **Audit Trail**: Complete record of incident and response maintained for quality improvement

---

## Entity Relationships Summary

### Complete Relationship Map

\`\`\`
CustomerStatus (1) ──← (∞) Customer
                        │
                        │ places
                        ↓ (1) → (∞)
OrderStatus (1) ──← (∞) Order ──→ (1) Employee
                        │
                        │ contains
                        ↓ (1) → (∞)
                    OrderLine
                        │ (1)
                        │
                        ├──→ Product
                        │
                        └──→ OrderLineStatus (1) ──← (∞)
                            │ (1)
                            │
                            ↓ (1) → (∞)
                        Layer ──→ LayerStatus (1) ──← (∞)
\`\`\`

### Foreign Key Requirements

**Critical Foreign Keys:**

| Child Table | Foreign Key | Parent Table | Purpose |
|-------------|------------|--------------|---------|
| Customer | CustomerStatusID → CustomerStatus | Lookup validation |
| Order | CustomerID → Customer | Order ownership |
| Order | OrderStatusID → OrderStatus | Status tracking |
| Order | EmployeeID → Employee | Staff assignment |
| OrderLine | OrderID → Order | Item ownership |
| OrderLine | ProductID → Product | Product reference |
| OrderLine | OrderLineStatusID → OrderLineStatus | Item status |
| Layer | OrderLineID → OrderLine | Layer-to-order linkage |
| Layer | LayerStatusID → LayerStatus | Layer progress |

### Cardinality Patterns Used

| Pattern | Meaning | Example |
|---------|---------|---------|
| (1) ──→ (∞) | One-to-Many | One Customer places many Orders |
| (∞) ──← (1) | Many-to-One | Many Orders belong to one Customer |
| (1) ──↔ (1) | One-to-One | One Order has one primary Employee assignment |

---

## Implementation Recommendations

### Phase 1: Core Order Processing
1. Implement Customer, Order, Product entities
2. Create CustomerStatus, OrderStatus lookup tables
3. Define Customer ↔ Order ↔ Product relationships
4. Deploy initial foreign key constraints

### Phase 2: Layer Tracking
1. Add OrderLine associative entity
2. Implement Layer entity with LayerStatus
3. Add OrderLineStatus tracking
4. Create status update triggers

### Phase 3: Disaster Recovery & Audit
1. Implement IncidentWeatherReport entity
2. Add comprehensive audit fields (CreatedDate, ModifiedDate)
3. Create incident notification workflows
4. Build reporting views for disaster analysis

### Phase 4: Optimization
1. Add indexes on foreign keys
2. Create views for common queries
3. Implement stored procedures for status transitions
4. Add data validation rules at database level

---

## Data Integrity & Validation Rules

### Business Rules Enforced at Database Level

1. **Customer-Order Relationship**
   - Every Order must have a valid CustomerID
   - Customers with Banned status cannot place new orders

2. **Order-Layer Relationship**
   - Layers can only be added to orders with OrderStatus = "In Progress"
   - All layers must exist for an order to transition to "Ready"

3. **Status Progression**
   - OrderStatus can only advance through defined workflow: Pending → In Progress → Picked Up → Ready → Delivered
   - Backward transitions only allowed by manager approval

4. **Layer Completion**
   - A layer cannot be marked "Assembled" until all previous layers are "Decorated Complete"
   - LayerStatus → OrderLineStatus synchronization must be automatic

5. **Financial Integrity**
   - TotalPrice cannot be modified once PaymentStatus = "Paid"
   - ExtendedPrice = Quantity × UnitPrice (enforced by trigger)

---

## Conclusion

This enhanced ERD architecture provides:
- **Comprehensive tracking** at customer, order, line item, and layer levels
- **Flexible status management** through separate lookup tables
- **Disaster recovery capability** through incident tracking
- **Audit compliance** with complete time-stamped history
- **Business rule enforcement** at the database constraint level

The design balances **detail and performance**, ensuring that Emily Bakes Cakes can track custom cake orders with the precision required for a boutique bakery while maintaining system scalability and data integrity.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 11/5/2025 | Professor's Class Notes | Initial comprehensive enhancement guide |
| 1.1 | 11/5/2025 | Project Team | Integrated with project requirements |

---

**Related Documents:**
- 05_ERD_UPDATE_AND_RATIONALE.md (Primary ERD documentation)
- DFD-ERD-Data-Dictionary.pdf (Current implementation)
- CIS-3343-Group-Project-Rubric-as-of-October-12th-2025.xlsx (Grading criteria)
