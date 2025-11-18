# Emily Bakes Cakes: Database Migrations and Seed Data

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Production Ready

---

## Migration Strategy

### Phase 1: Create New Tables

\`\`\`sql
-- Create lookup tables
CREATE TABLE CAKE_SIZE (
  Size_ID INT PRIMARY KEY AUTO_INCREMENT,
  Size_Name VARCHAR(30) NOT NULL UNIQUE,
  Base_Price DECIMAL(10,2) NOT NULL,
  Serves_Min INT,
  Serves_Max INT,
  Display_Order INT,
  Is_Active CHAR(1) DEFAULT 'Y',
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order layer table
CREATE TABLE ORDER_LAYER (
  Order_ID INT NOT NULL,
  Layer_Number INT NOT NULL CHECK (Layer_Number BETWEEN 1 AND 7),
  Special_Notes VARCHAR(500),
  Position VARCHAR(20),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (Order_ID, Layer_Number),
  FOREIGN KEY (Order_ID) REFERENCES CUSTOM_ORDER(Order_ID) ON DELETE CASCADE
);

-- Create layer option junction table
CREATE TABLE ORDER_LAYER_OPTION (
  Order_ID INT NOT NULL,
  Layer_Number INT NOT NULL,
  Option_Type VARCHAR(30) NOT NULL,
  Option_ID INT NOT NULL,
  Quantity INT DEFAULT 1,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (Order_ID, Layer_Number, Option_Type, Option_ID),
  FOREIGN KEY (Order_ID, Layer_Number) REFERENCES ORDER_LAYER(Order_ID, Layer_Number),
  FOREIGN KEY (Option_ID) REFERENCES PRODUCT_OPTION(Option_ID)
);

-- Create attachment table
CREATE TABLE ORDER_ATTACHMENT (
  Attachment_ID INT PRIMARY KEY AUTO_INCREMENT,
  Order_ID INT NOT NULL,
  Layer_Number INT,
  File_URL VARCHAR(255) NOT NULL,
  File_Type VARCHAR(30),
  File_Size INT,
  Uploaded_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Order_ID) REFERENCES CUSTOM_ORDER(Order_ID) ON DELETE CASCADE,
  INDEX (Order_ID)
);
\`\`\`

### Phase 2: Modify Existing Tables

\`\`\`sql
-- Modify CUSTOM_ORDER table
ALTER TABLE CUSTOM_ORDER
  DROP COLUMN Occasion,
  DROP COLUMN Servings,
  ADD COLUMN Firm_Price DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER Total_Price,
  ADD COLUMN Cake_Size_ID INT AFTER Product_ID,
  ADD FOREIGN KEY (Cake_Size_ID) REFERENCES CAKE_SIZE(Size_ID),
  ADD CONSTRAINT CHECK (Firm_Price > 0),
  ADD CONSTRAINT CHECK (Deposit_Amount >= (Firm_Price * 0.5));

-- Add indexing for performance
CREATE INDEX idx_order_firm_price ON CUSTOM_ORDER(Firm_Price);
CREATE INDEX idx_order_size ON CUSTOM_ORDER(Cake_Size_ID);
\`\`\`

---

## Seed Data

### Cake Sizes

\`\`\`sql
INSERT INTO CAKE_SIZE (Size_Name, Base_Price, Serves_Min, Serves_Max, Display_Order) VALUES
('Small (4-6 servings)', 25.00, 4, 6, 1),
('Medium (8-10 servings)', 40.00, 8, 10, 2),
('Large (12-14 servings)', 55.00, 12, 14, 3),
('Extra Large (16-18 servings)', 75.00, 16, 18, 4),
('Sheet Cake (20+ servings)', 95.00, 20, 30, 5);
\`\`\`

### Product Options (Flavors)

\`\`\`sql
INSERT INTO PRODUCT_OPTION (Option_Name, Option_Type, Extra_Cost, Category, Display_Order, Is_Active) VALUES
-- Flavors
('Vanilla', 'Flavor', 0, 'Cake Flavor', 1, 'Y'),
('Chocolate', 'Flavor', 0, 'Cake Flavor', 2, 'Y'),
('Marble', 'Flavor', 2, 'Cake Flavor', 3, 'Y'),
('Strawberry', 'Flavor', 3, 'Cake Flavor', 4, 'Y'),
('Lemon', 'Flavor', 2.50, 'Cake Flavor', 5, 'Y'),
('Red Velvet', 'Flavor', 3, 'Cake Flavor', 6, 'Y'),
('Carrot Cake', 'Flavor', 2, 'Cake Flavor', 7, 'Y'),

-- Fillings
('Vanilla Buttercream', 'Filling', 0, 'Cake Filling', 1, 'Y'),
('Chocolate Ganache', 'Filling', 2, 'Cake Filling', 2, 'Y'),
('Raspberry Jam', 'Filling', 3, 'Cake Filling', 3, 'Y'),
('Lemon Curd', 'Filling', 2.50, 'Cake Filling', 4, 'Y'),
('Cream Cheese', 'Filling', 1.50, 'Cake Filling', 5, 'Y'),

-- Icing Types
('Buttercream', 'Icing', 0, 'Icing Type', 1, 'Y'),
('Fondant', 'Icing', 5, 'Icing Type', 2, 'Y'),
('Ganache', 'Icing', 3, 'Icing Type', 3, 'Y'),
('Cream Cheese Frosting', 'Icing', 2, 'Icing Type', 4, 'Y'),
('Whipped Cream', 'Icing', 1, 'Icing Type', 5, 'Y'),

-- Writing Colors
('White', 'Writing Color', 0, 'Decoration Color', 1, 'Y'),
('Black', 'Writing Color', 0, 'Decoration Color', 2, 'Y'),
('Red', 'Writing Color', 0.50, 'Decoration Color', 3, 'Y'),
('Pink', 'Writing Color', 0.50, 'Decoration Color', 4, 'Y'),
('Gold', 'Writing Color', 1, 'Decoration Color', 5, 'Y'),
('Silver', 'Writing Color', 1, 'Decoration Color', 6, 'Y');
\`\`\`

### Sample Customers

\`\`\`sql
INSERT INTO CUSTOMER (Cust_Status_ID, Cust_Type_ID, Cust_First_Name, Cust_Last_Name, Cust_Email_Addr, Cust_Mobile_Phone, Cust_Addr_Line1, State_ID, Cust_Zip_Code, Preferred_Customer) VALUES
(1, 1, 'Sarah', 'Johnson', 'sarah.johnson@email.com', '(713) 555-0101', '123 Oak Street', 1, '77001', 'Y'),
(1, 1, 'Michael', 'Chen', 'mchen@email.com', '(713) 555-0102', '456 Maple Ave', 1, '77002', 'Y'),
(1, 1, 'Jessica', 'Williams', 'jess.w@email.com', '(713) 555-0103', '789 Pine Road', 1, '77003', 'N'),
(1, 2, 'James', 'Martinez', 'james@corporateevents.com', '(713) 555-0104', '321 Business Blvd', 1, '77004', 'Y'),
(1, 1, 'Emily', 'Davis', 'emily.d@email.com', '(713) 555-0105', '654 Elm Street', 1, '77005', 'N'),
(1, 1, 'Robert', 'Brown', 'rbrown@email.com', '(713) 555-0106', '987 Birch Lane', 1, '77006', 'N'),
(1, 1, 'Amanda', 'Taylor', 'amanda.taylor@email.com', '(713) 555-0107', '147 Cedar Ave', 1, '77007', 'Y'),
(1, 1, 'David', 'Anderson', 'david.a@email.com', '(713) 555-0108', '258 Spruce Road', 1, '77008', 'N'),
(1, 1, 'Lisa', 'Thompson', 'lthompson@email.com', '(713) 555-0109', '369 Walnut Street', 1, '77009', 'N'),
(1, 2, 'Corporate', 'Events LLC', 'events@corp.com', '(713) 555-0110', '500 Business Park', 1, '77010', 'Y');
\`\`\`

### Sample Orders (Various States)

\`\`\`sql
INSERT INTO CUSTOM_ORDER (Cust_ID, Product_ID, Order_Date, Pickup_Date, Pickup_Time, Total_Price, Firm_Price, Deposit_Amount, Order_Status_ID, Cake_Size_ID) VALUES
-- Order 1: In Baking
(1, 1, '2025-11-03', '2025-11-08', '14:00', 75.00, 75.00, 37.50, 2, 3),
-- Order 2: Decorating
(2, 2, '2025-11-02', '2025-11-07', '15:00', 95.00, 95.00, 47.50, 3, 4),
-- Order 3: Ready for Pickup
(3, 1, '2025-11-01', '2025-11-05', '16:00', 55.00, 55.00, 27.50, 4, 2),
-- Order 4: To Be Created (new order just entered)
(4, 3, '2025-11-05', '2025-11-10', '10:00', 120.00, 120.00, 60.00, 1, 5),
-- Order 5: Picked Up
(5, 1, '2025-11-04', '2025-11-04', '17:00', 65.00, 65.00, 32.50, 5, 2);
\`\`\`

### Sample Order Layers

\`\`\`sql
INSERT INTO ORDER_LAYER (Order_ID, Layer_Number, Special_Notes, Position) VALUES
-- Order 1, Layer 1
(1, 1, 'Extra filling please', 'Bottom'),
(1, 2, 'Standard', 'Middle'),
(1, 3, 'No nuts', 'Top'),

-- Order 2, Layer 1
(2, 1, 'Very moist', 'Bottom'),
(2, 2, 'Decorative flowers', 'Top'),

-- Order 3, Layer 1
(3, 1, 'Standard', 'Single Layer'),

-- Order 4, Layer 1-3
(4, 1, 'Raspberry filling', 'Bottom'),
(4, 2, 'Vanilla filling', 'Middle'),
(4, 3, 'Strawberry on top', 'Top'),

-- Order 5, Layer 1
(5, 1, 'Birthday cake - classic', 'Single Layer');
\`\`\`

### Sample Layer Options (Customizations)

\`\`\`sql
INSERT INTO ORDER_LAYER_OPTION (Order_ID, Layer_Number, Option_Type, Option_ID, Quantity) VALUES
-- Order 1, Layer 1
(1, 1, 'Flavor', 2, 1),           -- Chocolate
(1, 1, 'Filling', 9, 1),          -- Chocolate Ganache
(1, 1, 'Icing', 1, 1),            -- Buttercream
(1, 1, 'Writing Color', 21, 1),   -- White

-- Order 1, Layer 2
(1, 2, 'Flavor', 1, 1),           -- Vanilla
(1, 2, 'Filling', 1, 1),          -- Vanilla Buttercream
(1, 2, 'Icing', 1, 1),            -- Buttercream
(1, 2, 'Writing Color', 21, 1),   -- White

-- Order 1, Layer 3
(1, 3, 'Flavor', 4, 1),           -- Strawberry
(1, 3, 'Filling', 11, 1),         -- Cream Cheese
(1, 3, 'Icing', 4, 1),            -- Cream Cheese Frosting
(1, 3, 'Writing Color', 24, 1);   -- Pink
\`\`\`

---

## Node.js/Express Seeder Script

\`\`\`javascript
// seed.js - Database seeding script
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function seedDatabase() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting database seed...');
    
    // 1. Seed Cake Sizes
    await connection.query(`
      INSERT INTO CAKE_SIZE (Size_Name, Base_Price, Serves_Min, Serves_Max) VALUES
      ('Small', 25.00, 4, 6),
      ('Medium', 40.00, 8, 10),
      ('Large', 55.00, 12, 14),
      ('XL', 75.00, 16, 18)
    `);
    console.log('✓ Cake sizes seeded');
    
    // 2. Seed Product Options
    const flavors = [
      { name: 'Vanilla', cost: 0 },
      { name: 'Chocolate', cost: 0 },
      { name: 'Strawberry', cost: 3 }
    ];
    
    for (const flavor of flavors) {
      await connection.query(
        'INSERT INTO PRODUCT_OPTION (Option_Name, Option_Type, Extra_Cost) VALUES (?, ?, ?)',
        [flavor.name, 'Flavor', flavor.cost]
      );
    }
    console.log('✓ Product options seeded');
    
    // 3. Seed Sample Customers
    await connection.query(`
      INSERT INTO CUSTOMER (Cust_Status_ID, Cust_Type_ID, Cust_First_Name, Cust_Last_Name, Cust_Email_Addr, Preferred_Customer)
      VALUES (1, 1, 'Sarah', 'Johnson', 'sarah@example.com', 'Y')
    `);
    console.log('✓ Sample customers seeded');
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedDatabase();
\`\`\`

---

## Data Validation Rules (Application Level)

### Order Validation

\`\`\`javascript
const validateOrder = (order) => {
  const errors = [];
  
  // Customer required
  if (!order.customerId) errors.push('Customer is required');
  
  // Pickup date validation
  const pickupDate = new Date(order.pickupDate);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  
  if (pickupDate < minDate) {
    errors.push('Pickup date must be at least 2 days in advance');
  }
  
  // Price validation
  if (order.firmPrice <= 0) {
    errors.push('Price must be greater than zero');
  }
  
  if (order.firmPrice < 20) {
    errors.push('Minimum order is $20');
  }
  
  // Deposit validation
  const minDeposit = order.firmPrice * 0.5;
  if (order.depositAmount < minDeposit) {
    errors.push(`Deposit must be at least ${minDeposit.toFixed(2)}`);
  }
  
  if (order.depositAmount > order.firmPrice) {
    errors.push('Deposit cannot exceed total price');
  }
  
  // Layer validation
  if (!order.layers || order.layers.length === 0) {
    errors.push('At least one layer is required');
  }
  
  if (order.layers && order.layers.length > 7) {
    errors.push('Maximum 7 layers allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
\`\`\`

---

## Database Constraints

\`\`\`sql
-- Add check constraints
ALTER TABLE CUSTOM_ORDER
ADD CONSTRAINT check_price CHECK (Firm_Price > 0),
ADD CONSTRAINT check_deposit CHECK (Deposit_Amount >= (Firm_Price * 0.5) AND Deposit_Amount <= Firm_Price),
ADD CONSTRAINT check_pickup_date CHECK (Pickup_Date >= CURDATE() + INTERVAL 2 DAY);

-- Add unique constraints
ALTER TABLE PRODUCT_OPTION
ADD CONSTRAINT unique_option_name UNIQUE (Option_Name, Option_Type);
\`\`\`

---

## Related Documents

- **05_ERD_UPDATE_AND_RATIONALE.md** - Database schema
- **08_API_SPEC_DIFF_AND_NEW_ENDPOINTS.md** - API usage
- **09_FRONTEND_IMPLEMENTATION_PLAYBOOK.md** - Integration

---

**Status:** Ready for Implementation  
**Last Updated:** November 5, 2025
