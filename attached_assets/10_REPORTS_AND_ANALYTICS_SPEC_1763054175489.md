# Emily Bakes Cakes: Reports and Analytics Specification

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Production Ready  
**Document Purpose:** Manager dashboard specs and reporting requirements

---

## Executive Summary

This document defines the manager dashboard and analytics features for the Emily Bakes Cakes internal application. The manager dashboard provides real-time KPIs, revenue tracking by date range, order status monitoring, and customer insights. All reports meet the professor's requirement: "Time frame for total revenue and details."

**Key Features:** **note - quick analysis, so managers can do things like compare day and month revenue**
- Date-range filtering (Today, Week, Month, Quarter, Custom) (quick analysis, so managers can do things like compare day and month revenue)
- Revenue reporting with breakdown
- Order status tracking
- Customer insights
- Export capabilities

---

## Manager Dashboard Overview

**Route:** `/reports/dashboard`  
**Access:** Manager role only  
**Purpose:** Business intelligence and real-time insights

**Layout:** **note - today stnd view**
\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│ Header: Logo | Dashboard | Orders | Customers | Reports (active)│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ MANAGER DASHBOARD                                                │
│                                                                  │
│ Date Range: [Today ▼] [This Week ▼] [This Month ▼] [Quarter ▼] │
│             [Custom: From _______ To _______] [Filter]          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ TOTAL REVENUE   │ │ ORDER COUNT     │ │ AVG ORDER VALUE │    │
│ │ $2,450.50       │ │ 12 orders       │ │ $204.21         │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                  │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ NEW CUSTOMERS   │ │ RETURNING RATE  │ │ BALANCE DUE     │    │
│ │ 3 customers     │ │ 65%             │ │ $1,250.50       │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ REVENUE TREND                      ORDERS BY STATUS             │
│                                                                  │
│ $2500 │     ╱╲                      ┌─────────────────┐         │
│ $2000 │  ╱╲╱  ╲              Ready   ░░░░░░ 30% (10) │         │
│ $1500 │╱╲╱    ╲╱            Picked  ███████ 35% (12) │         │
│ $1000 │ (line chart daily)  Baking   ▒▒▒▒▒▒ 20% (7)  │         │
│  $500 │                     Decor.   ▓▓▓▓ 15% (5)    │         │
│   $0  └─────────────────    Created  ░░ 0% (0)       │         │
│        Nov1 Nov5 Nov10               └─────────────────┘         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ TOP CUSTOMERS (by spending)                                     │
│                                                                  │
│ Customer Name      │ Orders │ Total Spent │ Last Order        │
│────────────────────┼────────┼─────────────┼─────────────────── │
│ Sarah Johnson      │   5    │   $1,250.00 │ Nov 15, 2025      │
│ Michael Chen       │   3    │    $895.50  │ Nov 10, 2025      │
│ James Martinez     │   2    │    $450.00  │ Nov 5, 2025       │
│ Corporate Events   │   2    │    $850.00  │ Oct 28, 2025      │
│ Amanda Taylor      │   1    │    $120.00  │ Oct 15, 2025      │
│                                                                  │
│ [View All Customers]                                            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ORDERS READY FOR PICKUP (TODAY)                                 │
│                                                                  │
│ Order │ Customer        │ Pickup Time │ Total  │ Status        │
│───────┼─────────────────┼─────────────┼────────┼─────────────── │
│ 5001  │ Sarah Johnson   │ 2:00 PM     │ $95    │ Ready ✓       │
│ 5003  │ Michael Chen    │ 3:00 PM     │ $120   │ Ready ✓       │
│                                                                  │
│ [View All Orders]                                               │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [Export to PDF]  [Export to Excel]  [Export to CSV]  [Print]   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
\`\`\` 
**note switch orders ready for pickup and switch top customers positions**

---

## Key Performance Indicators (KPIs)

### 1. Total Revenue

**Metric:** Sum of all firm_price WHERE pickup_date IN range

**Calculation:**
\`\`\`sql
SELECT SUM(firm_price) as total_revenue
FROM CUSTOM_ORDER
WHERE pickup_date BETWEEN @start_date AND @end_date
  AND order_status_id NOT IN (SELECT id FROM ORDER_STATUS WHERE description = 'Cancelled');
\`\`\`

**Display:**
- Large card with currency format ($X,XXX.XX)
- Trend indicator: ↑ or ↓ compared to previous period
- Percentage change: +12% from last week

**Drill-Down:** Click to see daily breakdown

---

### 2. Order Count

**Metric:** COUNT of orders in date range

**Calculation:**
\`\`\`sql
SELECT COUNT(*) as order_count
FROM CUSTOM_ORDER
WHERE pickup_date BETWEEN @start_date AND @end_date
  AND order_status_id NOT IN ('Cancelled');
\`\`\`

**Display:**
- Simple count with order icon
- Trend compared to previous period

**Context:** "12 orders this month (vs 9 last month)"

---

### 3. Average Order Value

**Metric:** Total Revenue / Order Count

**Calculation:**
\`\`\`sql
SELECT AVG(firm_price) as avg_order_value
FROM CUSTOM_ORDER
WHERE pickup_date BETWEEN @start_date AND @end_date;
\`\`\`

**Display:**
- Currency format ($XXX.XX)
- Useful for understanding order mix

**Example:** "$204.21 average"

---

### 4. New Customers

**Metric:** COUNT of customers with first order in date range

**Calculation:**
\`\`\`sql
SELECT COUNT(DISTINCT c.cust_id) as new_customers
FROM CUSTOMER c
JOIN CUSTOM_ORDER o ON c.cust_id = o.cust_id
WHERE o.order_date BETWEEN @start_date AND @end_date
GROUP BY c.cust_id
HAVING COUNT(o.order_id) = 1;
\`\`\`

**Display:** Count with customer icon

---

### 5. Returning Customer Rate

**Metric:** Orders from returning customers / Total orders

**Calculation:**
\`\`\`sql
SELECT 
  (COUNT(CASE WHEN repeat_customers.count > 1 THEN 1 END) * 100.0 / 
   COUNT(*)) as return_rate
FROM (
  SELECT COUNT(*) as count FROM CUSTOM_ORDER
  GROUP BY cust_id
) repeat_customers;
\`\`\`

**Display:** Percentage (65%)

---

### 6. Balance Due

**Metric:** Sum of unpaid balances (Total Price - Deposit)

**Calculation:**
\`\`\`sql
SELECT SUM(firm_price - deposit_amount) as balance_due
FROM CUSTOM_ORDER
WHERE pickup_date BETWEEN @start_date AND @end_date
  AND order_status_id NOT IN ('Picked Up', 'Cancelled');
\`\`\`

**Display:** Large amount outstanding

**Purpose:** Identify money to collect

---

## Charts and Visualizations

### 1. Revenue Trend (Line Chart)

**X-Axis:** Dates (daily breakdown)  
**Y-Axis:** Revenue ($)  
**Data Points:** One per day  
**Aggregation:** SUM(firm_price) per day

**Query:**
\`\`\`sql
SELECT 
  DATE(pickup_date) as date,
  SUM(firm_price) as revenue
FROM CUSTOM_ORDER
WHERE pickup_date BETWEEN @start_date AND @end_date
GROUP BY DATE(pickup_date)
ORDER BY date ASC;
\`\`\`

**Features:**
- Hover shows exact amount
- Click point to see orders for that day
- Zoom to specific date range

---

### 2. Orders by Status (Pie Chart)

**Categories:** To Be Created, In Baking, Decorating, Ready, Picked Up, Cancelled  
**Size:** Count of orders in each status

**Query:**
\`\`\`sql
SELECT 
  os.description as status,
  COUNT(co.order_id) as count
FROM CUSTOM_ORDER co
JOIN ORDER_STATUS os ON co.order_status_id = os.order_status_id
WHERE co.pickup_date BETWEEN @start_date AND @end_date
GROUP BY os.description;
\`\`\`

**Display:**
- Pie chart with percentages
- Click slice to filter orders list

---

### 3. Customer Spending Distribution (Bar Chart)

**X-Axis:** Spending ranges ($0-100, $100-200, $200-300, etc.)  
**Y-Axis:** Number of customers

**Purpose:** Understand customer segments

---

## Detailed Reports

### Report 1: Revenue Breakdown by Customer

**Purpose:** See which customers generated most revenue

**Table Columns:**
| Rank | Customer | Orders | Total Spent | Avg Order | Status |
|------|----------|--------|-------------|-----------|--------|
| 1 | Sarah Johnson | 5 | $1,250.00 | $250.00 | Active |
| 2 | Michael Chen | 3 | $895.50 | $298.50 | Active |
| 3 | James Martinez | 2 | $450.00 | $225.00 | Active |

**Query:**
\`\`\`sql
SELECT 
  c.cust_id,
  c.cust_first_name + ' ' + c.cust_last_name as customer,
  COUNT(co.order_id) as orders,
  SUM(co.firm_price) as total_spent,
  AVG(co.firm_price) as avg_order,
  c.cust_status
FROM CUSTOMER c
LEFT JOIN CUSTOM_ORDER co ON c.cust_id = co.cust_id
  AND co.pickup_date BETWEEN @start_date AND @end_date
GROUP BY c.cust_id, c.cust_first_name, c.cust_last_name, c.cust_status
ORDER BY total_spent DESC;
\`\`\`

---

### Report 2: Orders by Pickup Date (Readiness Report) **note - staff should have this report, if BAD WEATHER OR POWER out they should have some reports**

**Purpose:** Help staff prepare for pickups

**Table Columns:**
| Pickup Date | Time | Customer | Status | Total | Notes |
|-------------|------|----------|--------|-------|-------|
| Nov 15 | 2:00 PM | Sarah Johnson | Ready | $95.00 | 2-layer |
| Nov 15 | 3:00 PM | Michael Chen | Baking | $120.00 | 3-layer |

**Query:**
\`\`\`sql
SELECT 
  co.pickup_date,
  co.pickup_time,
  c.cust_first_name + ' ' + c.cust_last_name as customer,
  os.description as status,
  co.firm_price as total
FROM CUSTOM_ORDER co
JOIN CUSTOMER c ON co.cust_id = c.cust_id
JOIN ORDER_STATUS os ON co.order_status_id = os.order_status_id
WHERE co.pickup_date BETWEEN @start_date AND @end_date
ORDER BY co.pickup_date ASC, co.pickup_time ASC;
\`\`\`

---

### Report 3: Deposit Collection Report

**Purpose:** Track which customers have paid deposits

**Metrics:**
- Total deposits expected: $1,200.50
- Total deposits collected: $950.00
- Outstanding: $250.50

**Query:**
\`\`\`sql
SELECT 
  SUM(co.deposit_amount) as deposits_paid,
  SUM(co.firm_price * 0.5) as deposits_expected,
  SUM(co.firm_price * 0.5 - co.deposit_amount) as deposits_due
FROM CUSTOM_ORDER co
WHERE co.pickup_date BETWEEN @start_date AND @end_date
  AND co.order_status_id NOT IN ('Cancelled');
\`\`\`

---

## Date Range Filtering

### Preset Options

| Option | Calculation | Example |
|--------|-------------|---------|
| **Today** | Start: TODAY, End: TODAY | Nov 5, 2025 |
| **This Week** | Start: Monday this week, End: TODAY | Nov 3-5, 2025 |
| **This Month** | Start: 1st of month, End: TODAY | Nov 1-5, 2025 |
| **This Quarter** | Start: Q start date, End: TODAY | Oct 1 - Nov 5, 2025 |
| **Last 7 Days** | Start: TODAY - 7, End: TODAY | Oct 29 - Nov 5, 2025 |
| **Last 30 Days** | Start: TODAY - 30, End: TODAY | Oct 6 - Nov 5, 2025 |
| **Custom** | User selects both dates | User chooses |

### Custom Date Range

**UI:**
\`\`\`
From: [Date Picker] ______
To:   [Date Picker] ______
[Apply Filter]
\`\`\`

**Validation:**
- Start date must be ≤ End date
- Start date must be ≤ Today
- End date must be ≤ Today (can't report future)

---

## Export Capabilities

### 1. Export to PDF

**Content:**
- Report title and date range
- All KPI cards
- Charts (as images)
- Top customers table
- Orders ready for pickup

**Formatting:**
- Logo header
- Professional layout
- Page breaks for readability
- Footer with generated date/time

**File Name:** `Emily_Bakes_Revenue_Report_Nov1-5_2025.pdf`

---

### 2. Export to Excel

**Sheets:**
1. **Summary** - KPIs and charts
2. **Revenue by Customer** - Detailed table
3. **Orders Ready** - Pickup schedule
4. **Deposits** - Collection status

**Features:**
- Formulas for calculations
- Formatting with colors
- Freeze panes for headers
- Print-ready

**File Name:** `Emily_Bakes_Analytics_Nov1-5_2025.xlsx`

---

### 3. Export to CSV

**Format:** One table per CSV file  
**Files Generated:**
- `revenue_summary_nov1-5_2025.csv`
- `customers_nov1-5_2025.csv`
- `orders_nov1-5_2025.csv`
- `deposits_nov1-5_2025.csv`

**Use Case:** Import into other systems

---

## Print Capability

**Print-Friendly Layout:**
- Remove navigation
- Optimize for paper size (8.5" x 11")
- Adjust colors for black/white printing
- Include page numbers
- Include report metadata (date generated, manager name)

**Printing Path:**
- Click "Print" button
- Browser print dialog opens
- Select printer and options
- Print dashboard report

---

## Real-Time Data Updates

**Refresh Rate:**
- Dashboard auto-refreshes every 60 seconds
- Manual "Refresh Now" button available
- Indicates "Last Updated: X seconds ago"

**Caching:**
- Cache report queries for 30 seconds
- Clear cache on order status change
- Clear cache on new order creation

---

## Mobile Dashboard

**Responsive Breakpoints:**
- Mobile (<768px): Single column, stacked cards, horizontal scroll for tables
- Tablet (768-1024px): Two-column layout
- Desktop (>1024px): Full layout with all charts

**Mobile Optimizations:**
- Simplified charts (remove legends if needed)
- Tap to expand sections
- Swipe between date ranges
- Touch-friendly export buttons

---

## Sample Dashboard Data (Seed)

### November 5, 2025 (Today)

**KPIs:**
- Total Revenue: $450.00 (2 orders)
- Order Count: 2
- Avg Order Value: $225.00
- New Customers: 1
- Returning Rate: 50%
- Balance Due: $225.00

**Orders:**
- #5001 - Sarah Johnson - Ready - $95.00 @ 2:00 PM
- #5003 - Michael Chen - Baking - $120.00 @ 3:00 PM

### This Week (Nov 3-5, 2025)

**KPIs:**
- Total Revenue: $1,250.50 (8 orders)
- Order Count: 8
- Avg Order Value: $156.31
- New Customers: 3
- Returning Rate: 62%
- Balance Due: $625.25

### This Month (Nov 1-5, 2025)

**KPIs:**
- Total Revenue: $2,450.50 (12 orders)
- Order Count: 12
- Avg Order Value: $204.21
- New Customers: 4
- Returning Rate: 65%
- Balance Due: $1,225.25

---

## Performance Optimization

**Query Optimization:**
- Indexes on pickup_date, order_status_id, cust_id
- Materialized view for daily revenue summary (refreshed nightly)
- Cache report results for 30 seconds

**Frontend Optimization:**
- Lazy load charts (below-the-fold)
- Chart library: Chart.js or D3.js
- Pagination for large tables (20 rows per page)

---

## Access Control

**Who Can Access:**
- Manager role: Full access to all reports
- Admin role: Full access to all reports
- Staff role: Redirected to dashboard (no analytics)

**Audit Trail:**
- Log all report generation
- Record who accessed what data and when
- Retain audit logs for 90 days

---

## Related Documents

- **02_INFORMATION_ARCHITECTURE.md** - Manager dashboard page design
- **04_PAGES_AND_WIREFRAME_SPECS.md** - Manager dashboard wireframe
- **08_API_SPEC_AND_ENDPOINTS.md** - Analytics API endpoints
- **07_DATABASE_MIGRATIONS_SEED.md** - Sample data for reports

---

**Status:** Production Ready  
**Last Updated:** November 5, 2025
