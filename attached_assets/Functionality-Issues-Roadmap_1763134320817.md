# Emily Bakes Cakes - Critical Functionality Issues & Implementation Roadmap
**Prepared:** November 14, 2025  
**Status:** Issue Assessment + Priority Resolution Plan  
**Scope:** Dashboard, Employee Management, Staff Pages, Core Functionality Gaps

---

## Executive Summary

Based on comprehensive review of the case study requirements (CIS 3343) and implemented prototype, the following critical gaps have been identified across **dashboard functionality**, **employee/staff management**, and **core system features**. This document outlines every issue, its business impact, and the exact implementation required to meet course requirements and user expectations.

### Key Findings
- **Dashboard:** Lacks real-time data, actionable KPIs, and role-specific insights
- **Employee Page:** Currently minimal; needs full staff management, performance tracking, and scheduling
- **Functionality Gaps:** Missing 6 critical reports, email integration, and advanced order tracking
- **User Experience:** Insufficient feedback, limited quick actions, poor data visualization

---

## PART 1: DASHBOARD ISSUES & SOLUTIONS

### Issue 1.1: Dashboard Lacks Real-Time Data Updates
**Problem:** Current dashboard displays static data; no real-time refresh or live indicators.
**Business Impact:** Staff cannot see urgent orders requiring immediate action; delays in production.
**Solution Required:**
- Implement WebSocket connection for real-time order status changes
- Add automatic refresh interval (5-second updates) with manual refresh button
- Visual indicator showing "Last Updated: X seconds ago" with live status dot
- Toast notifications when orders change status

**Implementation Details:**
```
Frontend: useEffect with interval/WebSocket listener
Backend: Event emitter or WebSocket broadcast on order updates
Database: Optimize ORDER_STATUS_HISTORY queries for speed
UI: Add pulsing green dot + "Live" badge in header
```

---

### Issue 1.2: KPI Cards Are Not Clickable
**Problem:** Stat cards display numbers but don't link to filtered data; poor navigation flow.
**Business Impact:** Users must manually search; inefficient workflow.
**Solution Required:**
- Make each KPI card clickable
- Clicking "Todays Orders" filters Orders page to today's orders
- Clicking "In Progress" filters to active production orders
- Clicking "Revenue Today" (managers only) shows daily revenue breakdown
- Add hover state indicating clickability

**Implementation Details:**
```jsx
<KPICard 
  title="Today's Orders"
  value={5}
  onClick={() => navigate('/orders?date=today')}
  className="cursor-pointer hover:shadow-lg transition"
/>
```

---

### Issue 1.3: "Orders Ready for Pickup" List Lacks Context
**Problem:** Shows only 3 items; missing customer phone, order details, payment status.
**Business Impact:** Staff cannot efficiently call customers or verify payment; pickup process inefficient.
**Solution Required:**
- Expand to show 5-7 ready orders
- Add columns: Order ID, Customer Name, **Phone Number**, Pickup Time, **Total/Balance Due**
- Color-code by payment status (Green = Paid, Amber = Deposit Only, Red = No Payment)
- Add "Call Customer" button with auto-dial capability
- Add "Mark as Picked Up" inline button
- Show estimated wait time if customer is late

**Implementation Details:**
```
Columns: ID | Customer | Phone | Pickup Time | Payment Status | Total Price | Actions
Color: Green (Full payment), Amber (Deposit), Red (Unpaid)
Button: [Call] [Mark Picked Up] [View Order Details]
```

---

### Issue 1.4: Recent Activity Feed Is Too Generic
**Problem:** Shows only 5 items with minimal context; doesn't highlight critical events.
**Business Impact:** Important order issues may be missed; no action prompts for staff.
**Solution Required:**
- Categorize by type: Order Created (Blue), Status Changed (Purple), Payment (Green), Issue (Red)
- Show who performed action and timestamp
- Add "View" link for each activity
- Highlight rush orders, missed deadlines, customer issues in red
- Add severity/priority indicator

**Example Format:**
```
🔴 [URGENT] 11:45 AM - Order 5012 OVERDUE (3 hrs) - Baker Tom needs assistance
🟣 11:30 AM - Order 5011 moved to Decorating - By Sarah (Sales)
🟢 11:15 AM - Payment received for Order 5001 ($40) - Sarah recorded
🔵 11:00 AM - New customer Lisa Taylor created by Sarah
```

---

### Issue 1.5: Quick Actions Are Generic
**Problem:** All staff see same buttons regardless of role; no personalization.
**Business Impact:** Confusing UI; staff can access irrelevant actions.
**Solution Required:**
- **Sales Staff:** [Create Order] [View Pending Deposits] [Customer Search] [Print Orders]
- **Baker:** [My Queue] [Start New Order] [Ingredient Needs] [View Schedule]
- **Decorator:** [My Queue] [Design Gallery] [Ready Orders] [View Schedule]
- **Accountant:** [Payment Report] [View Invoices] [Revenue Analysis] [Reconciliation]
- **Manager:** [All Staff Activity] [Emergency Actions] [Weekly Report] [System Settings]

---

### Issue 1.6: Missing Manager-Specific KPIs
**Problem:** Manager dashboard lacks financial metrics, team performance, and business insights.
**Business Impact:** Manager cannot monitor business health, team productivity, or profitability.
**Solution Required:** Add Manager Dashboard with:
- **Financial KPIs:** Daily Revenue | This Week Revenue | Month-to-Date | Profit Margin | Deposit Collection Rate
- **Team KPIs:** Orders Completed | On-Time Rate | Quality Score | Staff Utilization | Revenue per Staff
- **Production KPIs:** Average Bake Time | Waste Rate | Rush Orders | Pending Orders Count
- **Customer KPIs:** New Customers This Week | Repeat Rate | Satisfaction Average

---

## PART 2: EMPLOYEE/STAFF MANAGEMENT ISSUES & SOLUTIONS

### Issue 2.1: Employee Page Completely Underdeveloped
**Problem:** Staff Management page exists but lacks functionality; barely more than a staff list.
**Business Impact:** Manager cannot track employee performance, schedule, or productivity; no HR capability.
**Solution Required:** Build comprehensive Staff Management Hub with 5 sections:

#### A. Staff Directory (Current State → Enhanced)
**Current:** Name, Email, Role, Status, Edit
**Required:**
- Add: Last Login, Hours This Week, Performance Score, Availability Status
- Edit Modal with: Full Name | Email | Role | Department | Phone | Start Date | Availability
- Bulk actions: Deactivate | Change Role | Send Bulk Email
- Filter by: Active/Inactive, Role, Department, Last Login

#### B. Staff Performance Dashboard (NEW)
**Metrics per Role:**
- **Sales:** Orders Created | Avg Order Value | Total Revenue | Repeat Customer % | Satisfaction Rating
- **Baker:** Cakes Completed | Avg Bake Time | Quality Score | On-Time % | Waste Rate
- **Decorator:** Cakes Decorated | Avg Decoration Time | Rework Rate | Customer Photos | Quality Score
- **Accountant:** Invoices Processed | Payments Reconciled | Error Rate | Processing Time

**Visualization:** 
- Weekly bar chart comparing team performance
- Individual performance cards (0-100 score)
- Trend indicators (↑ Improving, → Stable, ↓ Declining)
- Monthly breakdown view

#### C. Staff Scheduling (NEW)
**Features:**
- 4-week rolling calendar view
- Drag-drop shift assignment
- Color-coded by role (Sales=Blue, Baker=Orange, Decorator=Pink, Accountant=Green)
- Conflict detection (prevent double-booking)
- Coverage analysis (alert if understaffed)
- Time off requests management
- Payroll calculation (auto-calculate hours)
- Publish schedule (email to all staff)

#### D. Shift Requests & Time Off (NEW)
**Features:**
- Staff request time off (calendar picker)
- Manager approves/denies with notes
- Automatic schedule conflict detection
- Automatic coverage recommendations
- Temp coverage assignment
- Payroll adjustments

#### E. Staff Alerts & Recognition (NEW)
**Features:**
- Performance recognition (badges, achievements)
- Low-performance alerts (training recommendations)
- Attendance tracking (tardiness, absences)
- Communication log (coaching notes, warnings)
- Recognition achievements (Employee of Month, Top Performer)

---

### Issue 2.2: No Performance Tracking System
**Problem:** Manager cannot measure staff productivity or quality; no data-driven management.
**Business Impact:** Cannot identify training needs, recognize top performers, or manage accountability.
**Solution Required:**

Create **Staff Performance Dashboard** (Page 34 in wireframes - NOT YET BUILT) with:

**Sales Performance:**
```
Orders Created This Week: 12
Average Order Value: $156.88
Total Sales Revenue: $1,882.50
Customer Satisfaction: 4.8/5.0 stars
Repeat Customer Rate: 35%
Average Response Time: 2.3 minutes
Performance Score: 95/100
Trend: Strong (↑ +5 from last week)
Status: EXCEEDS EXPECTATIONS
```

**Baker Performance:**
```
Cakes Completed This Week: 11
Average Baking Time: 4.2 hours (target: 4h)
Quality Issues: 0 rejects
Waste/Spoilage Rate: 2% (excellent)
On-Time Completion: 91% (target: 95%)
Layer Consistency: 99%
Performance Score: 92/100
Trend: Stable (consistent performer)
Status: MEETS EXPECTATIONS
Attention Needed: Improve on-time completion to 95%
```

**Decorator Performance:**
```
Cakes Decorated This Week: 10
Average Decoration Time: 1.8 hours (target: 2h)
Quality Scores: 9.8/10 (excellent)
Customer Photos Shared: 6/10 (60%)
Design Customizations: 8 unique designs
Final QC Pass Rate: 100%
Rework/Redo Rate: 0%
Performance Score: 98/100
Trend: Excellent (↑ +8 from last week)
Status: EXCEEDS EXPECTATIONS
Recognition: Top performer this week!
```

**Implementation:**
- Calculate metrics daily from order_status_history + QC logs
- Cache performance scores (update every hour)
- Create performance_metrics table
- Build Recharts visualizations (bar, line, radar charts)

---

### Issue 2.3: No Staff Visibility into Their Own Performance
**Problem:** Staff cannot see their own performance scores or improvement areas.
**Business Impact:** No self-awareness, no motivation for improvement, no feedback loop.
**Solution Required:**

Create **Personal Performance Dashboard** (accessible by each staff member via /profile/performance) showing:
- My Performance Score this week/month/quarter
- My metrics vs. team average (visual comparison)
- My trends (chart showing last 12 weeks)
- Manager's notes and coaching feedback
- Recognition achievements and badges
- Goals set by manager
- Strengths and improvement areas

---

### Issue 2.4: No Shift/Scheduling System
**Problem:** Manager cannot assign or track staff shifts; scheduling done manually (not in system).
**Business Impact:** Confusion about who's working when, coverage gaps, payroll errors.
**Solution Required:**

Build **Staff Schedule Management** (Page 38 in wireframes - NOT YET BUILT) with:

**Features:**
- 4-week rolling calendar
- Role-based color coding
- Drag-drop shift assignment
- Conflict detection
- Coverage analysis (warning if understaffed)
- Time off requests
- Payroll integration (auto-calculate hours)
- Export to Google Calendar
- Email notifications to staff

**UI/UX:**
- Week view: Mon-Sun, show 7:00 AM - 5:00 PM
- Color legend: Sales (Blue), Baker (Orange), Decorator (Pink), Accountant (Green)
- Each shift shows: Staff name, Start time, End time, Type (Regular/Overtime/On-Call)
- Hover to see staff availability
- Click to edit or reassign

---

### Issue 2.5: No Performance-Based Recognition System
**Problem:** Cannot recognize top performers; no achievement system.
**Business Impact:** No motivation for excellence; good employees may leave.
**Solution Required:**

Add **Recognition Features:**
- Manager awards monthly bonuses (tied to performance scores)
- Achievements/badges (Employee of Month, Top Decorator, etc.)
- Recognition notifications (public team shout-out)
- Performance-based commission tracking (sales staff)
- Annual performance reviews (structured form)
- Growth paths and role advancement recommendations

---

## PART 3: MISSING FUNCTIONALITY & FEATURES

### Issue 3.1: 6 Required Client Reports Not Built
**Problem:** Business Intelligence page exists but lacks the 6 critical reports required by case study.
**Business Impact:** Manager cannot run reports for analysis, cannot demonstrate system value to Emily.
**Solution Required:**

Build all **6 Client Reports** with Recharts visualizations and export capabilities:

**Report 1: Order Summary Report**
- Date range selector (dropdown: Today, This Week, This Month, Custom)
- Chart: Bar chart showing orders by status (To Be Created, In Baking, Decorating, Ready, Picked Up)
- Table: Order details with totals
- Metrics: Total orders, completion rate, average value
- Export: PDF, CSV, Email

**Report 2: Customer List Report**
- Date range: Orders in last 30/90/365 days
- Chart: Line chart showing new customers trend
- Table: Customer name, total orders, total spending, satisfaction, status
- Metrics: Total customers, repeat customer %, average spending
- Filters: Active/VIP/First-time customers
- Export: PDF, CSV, Email

**Report 3: Revenue Report** (Accountant/Manager only)
- Period selector: Daily, Weekly, Monthly, Quarterly
- Charts: 
  - Line chart: Revenue trend over selected period
  - Pie chart: Revenue by order type (Standard, Rush, Corporate)
  - Bar chart: Revenue vs. deposit collection
- Metrics: Total revenue, deposits collected, balance due, profit margin, average order value
- Export: PDF, CSV, email

**Report 4: Pending Orders Report**
- Real-time list of all orders not yet completed
- Color-coded by urgency (Red = Overdue, Amber = Due soon, Green = On track)
- Columns: Order ID, Customer, Pickup Date, Current Status, Days Until Pickup, Assigned Staff
- Actions: [Escalate] [Reassign] [Mark Complete]

**Report 5: Completed Orders Report**
- Date range selector
- Chart: Bar chart showing completions per day
- Table: Order ID, Customer, Completion Date, Quality Score, Customer Satisfaction
- Metrics: Orders completed, average quality score, customer satisfaction %, on-time %
- Performance trends

**Report 6: Product Inventory Report** (Manager only)
- Current product list with pricing
- Usage frequency (how many times ordered in last 30 days)
- Revenue contribution by product
- Seasonal products (show availability)
- Flavor, filling, icing usage statistics
- Recommendations for popular vs. unpopular items

**Implementation:**
```
Tech Stack: Recharts (charts) + React Table (data tables)
Backend: GET /api/reports/[report-name]?dateRange=...
Frontend: ReportPage component with tabs for each report
Export: jsPDF (PDF) + papaparse (CSV)
Caching: Cache reports for 1 hour to improve performance
```

---

### Issue 3.2: No Email Notification System
**Problem:** Staff and customers receive no notifications; no order confirmations or tracking links.
**Business Impact:** Customers cannot track orders; staff miss critical alerts.
**Solution Required:**

Integrate **Resend Email Service**:

**Email Templates to Build:**
1. **Order Confirmation (to customer)**
   - Order details, tracking link, estimated completion
   
2. **Order Assigned (to baker/decorator)**
   - Order details, pickup date, special instructions
   
3. **Status Update (to customer)**
   - New status (e.g., "Decorating in progress"), estimated completion
   
4. **Ready for Pickup (to customer)**
   - Order ready message, pickup window, contact info
   
5. **Daily Summary (to manager)**
   - Orders completed, revenue, team activity, issues
   
6. **Low Stock Alert (to manager)**
   - Ingredient alerts (from special requests)

**Implementation:**
```
Backend: POST /api/orders → Generate tracking_token → Send email via Resend
Email: Include tracking link with token
Frontend: /track/:token page (already built, auto-cycling)
Trigger Events: 
  - Order created → Send confirmation
  - Status changes → Send customer update
  - Reaches "Ready for Pickup" → Send ready alert
```

---

### Issue 3.3: No Advanced Order Search/Filtering
**Problem:** Orders page has basic filters; users cannot find orders by custom criteria.
**Business Impact:** Difficult to locate specific orders; inefficient workflow.
**Solution Required:**

Enhance **Orders Page** with advanced filters:
- Customer name (with autocomplete)
- Order ID (exact match)
- Date range (order date vs. pickup date)
- Status (multi-select checkbox)
- Price range
- Assigned staff
- Urgency (rush orders only)
- Payment status (paid/unpaid/partial)
- Save custom views/filters

---

### Issue 3.4: No Quality Control/QC Workflow
**Problem:** No system to track quality inspections or customer satisfaction.
**Business Impact:** Cannot ensure consistent quality; no feedback loop for improvement.
**Solution Required:**

Add **Quality Control System:**
- QC checklist before marking "Ready for Pickup"
- Quality score (0-10) recorded with reason
- Photo capture of finished cake
- Customer satisfaction survey (post-pickup)
- Rework tracking (if quality issues found)
- Trend reporting (quality over time by staff)

---

### Issue 3.5: No Rush Order Management
**Problem:** Rush orders exist in case study but no system to manage them (approvals, surcharges, etc.).
**Business Impact:** Cannot effectively handle rush requests; no surge pricing.
**Solution Required:**

Build **Rush Order Workflow:**
- Manager approval step (check feasibility)
- Surcharge calculation (case study says 25% fee)
- Rush order badge/visual indicator throughout system
- Expedited production timeline
- Notifications to baker/decorator
- Tracking priority in production queue
- Report on rush order acceptance rate

---

### Issue 3.6: Public Website Missing Key Features
**Problem:** Public pages have broken CTAs, no ordering workflow, incomplete information.
**Business Impact:** Customers cannot understand ordering process or contact bakery.
**Solution Required:**

**Home Page:**
- Remove "Start Building" buttons (no customer e-commerce)
- Add "Order Process" section explaining: Call → Email → Visit
- Contact info prominent (phone, email, address)
- Hours of operation
- Gallery preview

**Shop Page:**
- Change from product builder to inspiration gallery
- Remove inquiry forms
- Add "Interested in custom order?" → Call/Email links
- Show flavor options, decorations as reference

**Gallery Page:**
- Portfolio of past cakes (no "Start Custom Builder" button)
- Photos organized by occasion type
- Testimonials from customers

**Contact Page:**
- Google Maps embed (business location)
- Hours, phone, email, address in bold
- Contact form sends to manager (inquiry_management page)
- "How to Order" workflow diagram

---

## PART 4: USER EXPERIENCE ISSUES

### Issue 4.1: Poor Loading States
**Problem:** No skeleton screens or progress indicators while data loads.
**Business Impact:** Confusing UX; users think system is broken.
**Solution Required:**
- Add skeleton screens for: Dashboard KPIs, Orders table, Customer list
- Progress bars for multi-step operations (Order creation)
- Toast notifications for long operations (Report generation)
- Estimated time remaining

---

### Issue 4.2: Insufficient Error Handling
**Problem:** Form validation errors unclear; no helpful error messages.
**Business Impact:** Users frustrated; don't know how to fix issues.
**Solution Required:**
- Inline error messages for all form fields
- Helpful hints (e.g., "Pickup date must be at least 2 days in advance")
- API error handling with user-friendly messages
- Error logging for debugging

---

### Issue 4.3: No Mobile Responsiveness Testing
**Problem:** Responsive classes in code but unclear if UI actually works on mobile.
**Business Impact:** Staff cannot use system on phones; workflow interrupted.
**Solution Required:**
- Test all pages on mobile (320px, 375px)
- Optimize for touch interactions (48px minimum touch targets)
- Collapsible navigation on mobile
- Stack cards vertically on small screens

---

### Issue 4.4: Accessibility Issues
**Problem:** No alt text for images, unclear keyboard navigation, color-only indicators.
**Business Impact:** Staff with disabilities cannot use system.
**Solution Required:**
- Add alt text to all images
- Status indicators use both color AND text (not color alone)
- Keyboard navigation tested on all pages
- WCAG 2.1 AA compliance audit

---

## IMPLEMENTATION PRIORITY MATRIX

### TIER 1: Critical Path (Case Study Requirements)
**Timeline: This Week**
- [ ] Build 6 Client Reports with Recharts
- [ ] Remove customer ordering CTAs from public pages
- [ ] Enhance Orders page with clickable KPI cards
- [ ] Add real-time dashboard updates

### TIER 2: High Impact (Case Study + User Experience)
**Timeline: Week 2**
- [ ] Build Staff Performance Dashboard (Page 34)
- [ ] Implement Resend email integration
- [ ] Build Production Calendar (Page 37)
- [ ] Enhance "Ready for Pickup" list
- [ ] Add Recent Activity categorization

### TIER 3: Enhanced Features (Nice-to-Have)
**Timeline: Week 3-4**
- [ ] Staff Schedule Management (Page 38)
- [ ] Quality Control system
- [ ] Rush Order Management
- [ ] Performance-based recognition
- [ ] Notification Center (Page 39)
- [ ] Audit Trail/System Logs (Page 40)

### TIER 4: Polish & Optimization
**Timeline: Final Week**
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Loading states and skeleton screens
- [ ] Error handling improvements

---

## SUCCESS METRICS

**Dashboard:**
- ✓ All KPI cards clickable and filtering correctly
- ✓ Real-time updates within 5 seconds of order changes
- ✓ Ready for Pickup list shows 5+ items with full context

**Employee Management:**
- ✓ Staff Performance Dashboard displays all metrics
- ✓ Schedule page allows drag-drop assignments
- ✓ Performance scores calculated and displayed

**Reports:**
- ✓ All 6 reports built and exporting to PDF/CSV
- ✓ Reports run in <2 seconds
- ✓ Manager can schedule automated reports

**Email:**
- ✓ Order confirmations sent to customers
- ✓ Status updates sent when orders progress
- ✓ Daily manager summary generated and sent

**User Experience:**
- ✓ No loading > 3 seconds without feedback
- ✓ All mobile pages tested (320px-768px)
- ✓ 100% keyboard navigation
- ✓ All error messages helpful and clear

---

## NEXT STEPS

1. **Today:** Review this document with team; prioritize items
2. **This Week:** Build 6 reports + email integration (highest ROI)
3. **Week 2:** Staff Performance Dashboard + Schedule Management
4. **Week 3:** Quality/Rush Order systems + Notification Center
5. **Final Week:** Testing, polish, accessibility audit

---

**Document Version:** 1.0  
**Last Updated:** November 14, 2025  
**Status:** Ready for Implementation  
**Prepared By:** Project Analysis Team
