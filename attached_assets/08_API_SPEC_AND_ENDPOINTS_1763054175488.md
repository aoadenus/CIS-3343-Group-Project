# Emily Bakes Cakes: API Specification and REST Endpoints

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Format:** RESTful JSON API  
**Authentication:** JWT Bearer Token

---

## API Overview

Base URL: `/api/v1`  
All requests require: `Authorization: Bearer {jwt_token}`  
Content-Type: `application/json`

---

## Authentication Endpoints

### POST /auth/login

**Purpose:** Authenticate staff member and return JWT token **Response (200 OK):**

**Request:**
\`\`\`json
{
  "email": "staff@emilybakes.com", 
  "password": "secure_password"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "employeeId": 1,
    "name": "John Smith",
    "role": "Sales Staff",
    "permissions": ["create:order", "read:own"]
  }
}
\`\`\`

**Response (401 Unauthorized):**
\`\`\`json
{
  "error": "Invalid email or password"
}
\`\`\`

---

## Customers API

### POST /customers

**Purpose:** Create new customer record

**Request:**
\`\`\`json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@example.com",
  "phone": "(713) 555-0101",
  "addressLine1": "123 Oak Street",
  "state": "TX",
  "zipCode": "77001",
  "type": "Retail"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "customerId": 42,
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@example.com",
  "totalOrders": 0,
  "totalSpending": 0,
  "createdAt": "2025-11-05T10:30:00Z"
}
\`\`\`

**Validation Errors (400 Bad Request):**
\`\`\`json
{
  "errors": [
    { "field": "email", "message": "Email is required" },
    { "field": "email", "message": "Email already exists" }
  ]
}
\`\`\`

### GET /customers/:customerId

**Purpose:** Retrieve customer profile with order history

**Response (200 OK):**
\`\`\`json
{
  "customerId": 42,
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@example.com",
  "phone": "(713) 555-0101",
  "address": {
    "line1": "123 Oak Street",
    "state": "TX",
    "zipCode": "77001"
  },
  "status": "Active",
  "preferredCustomer": true,
  "loyaltyTier": "Gold",
  "totalOrders": 12,
  "totalSpending": 1250.00,
  "lastOrderDate": "2025-10-28T14:00:00Z",
  "recentOrders": [
    {
      "orderId": 1001,
      "orderDate": "2025-10-28",
      "totalPrice": 95.00,
      "status": "Picked Up"
    }
  ]
}
\`\`\`

### GET /customers?search=john&limit=20&offset=0

**Purpose:** Search customers by name or email

**Query Parameters:**
- `search`: Search term (name or email)
- `limit`: Results per page (default 20, max 100)
- `offset`: Pagination offset (default 0)
- `status`: Filter by customer status (Active, VIP, Preferred)

**Response (200 OK):**
\`\`\`json
{
  "total": 3,
  "limit": 20,
  "offset": 0,
  "customers": [
    {
      "customerId": 42,
      "firstName": "Sarah",
      "lastName": "Johnson",
      "email": "sarah@example.com",
      "totalSpending": 1250.00
    }
  ]
}
\`\`\`

---

## Orders API

### POST /orders

**Purpose:** Create new custom cake order

**Request:**
\`\`\`json
{
  "customerId": 42,
  "productId": 1,
  "cakeSizeId": 3,
  "pickupDate": "2025-11-15",
  "pickupTime": "14:00",
  "firmPrice": 95.00,
  "depositAmount": 50.00,
  "layers": [
    {
      "layerNumber": 1,
      "flavorId": 2,
      "fillingId": 9,
      "icingId": 1,
      "writingColorId": 21,
      "specialNotes": "Extra filling please"
    },
    {
      "layerNumber": 2,
      "flavorId": 1,
      "fillingId": 1,
      "icingId": 1,
      "writingColorId": 21,
      "specialNotes": ""
    }
  ],
  "images": [
    {
      "fileUrl": "s3://bucket/design-1.jpg",
      "layerNumber": null
    }
  ],
  "specialRequests": "No nuts please"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "orderId": 5001,
  "customerId": 42,
  "orderDate": "2025-11-05T10:30:00Z",
  "pickupDate": "2025-11-15",
  "pickupTime": "14:00",
  "status": "To Be Created",
  "firmPrice": 95.00,
  "depositAmount": 50.00,
  "balanceDue": 45.00
}
\`\`\`

**Validation Errors (400 Bad Request):**
\`\`\`json
{
  "errors": [
    { "field": "pickupDate", "message": "Pickup date must be at least 2 days in advance" },
    { "field": "depositAmount", "message": "Deposit must be at least 50% of total price" }
  ]
}
\`\`\`

### GET /orders/:orderId

**Purpose:** Retrieve complete order details

**Response (200 OK):**
\`\`\`json
{
  "orderId": 5001,
  "customer": {
    "customerId": 42,
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah@example.com"
  },
  "product": {
    "productId": 1,
    "name": "Chocolate Cake"
  },
  "cakeSize": {
    "sizeId": 3,
    "name": "Large",
    "basePrice": 55.00
  },
  "orderDate": "2025-11-05T10:30:00Z",
  "pickupDate": "2025-11-15",
  "pickupTime": "14:00",
  "status": "In Baking",
  "statusHistory": [
    {
      "status": "To Be Created",
      "changedAt": "2025-11-05T10:30:00Z",
      "changedBy": "John Smith"
    },
    {
      "status": "In Baking",
      "changedAt": "2025-11-06T08:00:00Z",
      "changedBy": "Baker Team"
    }
  ],
  "layers": [
    {
      "layerNumber": 1,
      "flavor": "Chocolate",
      "filling": "Ganache",
      "icing": "Buttercream",
      "writingColor": "White",
      "specialNotes": "Extra filling please"
    },
    {
      "layerNumber": 2,
      "flavor": "Vanilla",
      "filling": "Vanilla",
      "icing": "Buttercream",
      "writingColor": "White",
      "specialNotes": ""
    }
  ],
  "attachments": [
    {
      "attachmentId": 1,
      "fileUrl": "s3://bucket/design-1.jpg",
      "layerNumber": null,
      "uploadedAt": "2025-11-05T10:30:00Z"
    }
  ],
  "pricing": {
    "basePrice": 55.00,
    "layerAdjustments": 5.00,
    "firmPrice": 95.00,
    "depositPaid": 50.00,
    "balanceDue": 45.00
  },
  "specialRequests": "No nuts please"
}
\`\`\`

### PATCH /orders/:orderId/status

**Purpose:** Update order status (Manager only)

**Request:**
\`\`\`json
{
  "newStatus": "Decorating",
  "notes": "Started decorating this morning"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "orderId": 5001,
  "status": "Decorating",
  "updatedAt": "2025-11-06T09:00:00Z",
  "updatedBy": "Manager Name"
}
\`\`\`

**Allowed Transitions:** **note - lets see...**
- To Be Created → In Baking
- In Baking → Decorating
- Decorating → Ready for Pickup
- Ready for Pickup → Picked Up
- Any status → Cancelled

### GET /orders?status=in_baking&date=2025-11-15&limit=20

**Purpose:** List orders with filtering

**Query Parameters:**
- `status`: Filter by status
- `date`: Filter by pickup date
- `customerId`: Filter by customer
- `limit`: Results per page (default 20)
- `offset`: Pagination offset
- `sort`: Sort field (date, status, price)

**Response (200 OK):**
\`\`\`json
{
  "total": 15,
  "limit": 20,
  "offset": 0,
  "orders": [
    {
      "orderId": 5001,
      "customerId": 42,
      "customerName": "Sarah Johnson",
      "pickupDate": "2025-11-15",
      "status": "In Baking",
      "firmPrice": 95.00,
      "depositPaid": 50.00
    }
  ]
}
\`\`\`

### POST /orders/:orderId/payment

**Purpose:** Record payment transaction

**Request:**
\`\`\`json
{
  "paymentAmount": 45.00,
  "paymentMethod": "Credit Card",
  "transactionReference": "TXN-123456"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "transactionId": 1001,
  "orderId": 5001,
  "paymentAmount": 45.00,
  "status": "Completed",
  "transactionDate": "2025-11-10T14:00:00Z"
}
\`\`\`

---

## Products API

### GET /products?category=Cakes&limit=50

**Purpose:** List all active products

**Query Parameters:**
- `category`: Filter by category
- `limit`: Results per page
- `offset`: Pagination offset

**Response (200 OK):**
\`\`\`json
{
  "products": [
    {
      "productId": 1,
      "name": "Chocolate Cake",
      "description": "Rich, moist chocolate cake",
      "basePrice": 40.00,
      "image": "s3://bucket/chocolate-cake.jpg",
      "category": "Cakes"
    }
  ]
}
\`\`\`

### GET /products/:productId/options

**Purpose:** Get customization options for a product

**Response (200 OK):**
\`\`\`json
{
  "options": {
    "flavors": [
      { "optionId": 1, "name": "Vanilla", "cost": 0 },
      { "optionId": 2, "name": "Chocolate", "cost": 0 },
      { "optionId": 4, "name": "Strawberry", "cost": 3.00 }
    ],
    "fillings": [
      { "optionId": 9, "name": "Ganache", "cost": 2.00 }
    ],
    "icings": [
      { "optionId": 1, "name": "Buttercream", "cost": 0 }
    ],
    "writingColors": [
      { "optionId": 21, "name": "White", "cost": 0 }
    ]
  }
}
\`\`\`

---

## Manager Reports API

### GET /analytics/dashboard?dateRange=month&endDate=2025-11-05

**Purpose:** Get KPI dashboard data

**Query Parameters:**
- `dateRange`: today, week, month, quarter, custom
- `startDate`: Start date (required if custom)
- `endDate`: End date (required if custom)

**Response (200 OK):**
\`\`\`json
{
  "period": "November 2025",
  "startDate": "2025-11-01",
  "endDate": "2025-11-05",
  "kpis": {
    "totalRevenue": 2450.00,
    "orderCount": 12,
    "averageOrderValue": 204.17,
    "newCustomers": 3,
    "returningCustomerRate": 0.65
  },
  "ordersByStatus": {
    "toBeListed": 2,
    "inBaking": 4,
    "decorating": 3,
    "readyForPickup": 2,
    "pickedUp": 1,
    "cancelled": 0
  },
  "topCustomers": [
    {
      "customerId": 42,
      "name": "Sarah Johnson",
      "orders": 3,
      "totalSpent": 285.00
    }
  ],
  "revenueTrend": [
    { "date": "2025-11-01", "revenue": 450.00 },
    { "date": "2025-11-02", "revenue": 380.00 }
  ]
}
\`\`\`

---

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Not found",
  "message": "Order #5001 not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
\`\`\`

---

## WebSocket Events (Real-Time Updates)

### Client emits to server

\`\`\`javascript
// Subscribe to order updates
socket.emit('order:subscribe', { orderId: 5001 });

// Order status change
socket.emit('order:statusChange', { 
  orderId: 5001, 
  newStatus: 'Decorating' 
});
\`\`\`

### Server broadcasts to clients

\`\`\`javascript
// Order status updated
socket.on('order:statusUpdated', (data) => {
  // { orderId, status, changedAt, changedBy }
});

// New order created
socket.on('order:created', (data) => {
  // { orderId, customerId, pickupDate }
});

// Order ready notification
socket.on('notification:orderReady', (data) => {
  // { orderId, customerName, pickupTime }
});
\`\`\`

---

## Rate Limiting

- **Login endpoint:** 5 requests per 15 minutes
- **All other endpoints:** 100 requests per 15 minutes
- **File uploads:** 10 requests per hour

---

## Related Documents

- **01_SCOPE_AND_NON_GOALS.md** - Project scope
- **05_ERD_UPDATE_AND_RATIONALE.md** - Database schema
- **09_FRONTEND_IMPLEMENTATION_PLAYBOOK.md** - Frontend integration

---

**Status:** Production Ready  
**Last Updated:** November 5, 2025
