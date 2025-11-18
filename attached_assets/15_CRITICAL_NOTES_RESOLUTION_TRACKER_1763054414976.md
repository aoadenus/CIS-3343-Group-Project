# Emily Bakes Cakes: Critical Notes Resolution Tracker
## Implementation Audit and Action Plan

**Project:** Emily Bakes Cakes - CIS 3343 Group 4  
**Date:** November 5, 2025  
**Deadline:** November 21, 2025 (16 days remaining)  
**Status:** Active Planning Phase  
**Purpose:** Systematize all "**NOTE -**" items from project documentation with priority, stakeholder, and timeline

---

## ⏰ COUNTDOWN TIMER

| Days Remaining | Status |
|---|---|
| **16** | ⚠️ CRITICAL - Final Week Approaching |
| **Decisions Needed TODAY** | 8 items |
| **Implementation THIS WEEK** | 12 items |
| **Final Review (Nov 15-21)** | 7 items |

---

## Executive Summary

Your project contains **42 documented notes** across 9 files. These fall into 4 categories:

| Category | Count | Impact | Urgency |
|----------|-------|--------|---------|
| **BLOCKING** (Must fix to launch) | 8 | Critical | IMMEDIATE |
| **HIGH** (Rubric-aligned, affects grading) | 12 | High | This Week |
| **MEDIUM** (Improves UX/completeness) | 15 | Medium | Next Week |
| **LOW** (Nice-to-have enhancements) | 7 | Low | Final Polish |

**Primary Issues:**
1. ❌ Demo credentials not finalized
2. ❌ Role-based dashboards not fully designed
3. ❌ Standard product menu not defined
4. ⚠️ Customer order tracking unclear
5. ⚠️ Staff report generation underspecified

---

## BLOCKING ISSUES - DO TODAY (8 items)

### Block #1: Demo Credentials Undefined
**Files:** `04_PAGES_AND_WIREFRAME_SPECS.md` (5 notes)  
**Status:** 🔴 BLOCKING - Login cannot be tested without this

| Item | Note | Decision Needed | Proposal |
|------|------|-----------------|----------|
| Demo Email | Figure out demo credentials | What email format? | Use: staff@emilybakes.com, manager@emilybakes.com, baker@emilybakes.com |
| Demo Password | Figure out demo credentials | What password? | Use: DemoPass123! (simple, memorable) |
| Email Validation | Figure out demo credentials | How strict? | Basic validation: must contain @ and . |
| Login Flow | Figure out demo credentials | Test path? | Create test accounts NOW in database seed |
| Password Reset | Non-functional | In scope? | No - for demo, use "forgot password?" link redirects to info page |

**Action:** 
- ✅ Create 4 demo accounts with fixed credentials
- ✅ Document in README and login page
- ✅ Add to database seed data TODAY
- **Owner:** Team decision NOW
- **Timeline:** 30 minutes

---

### Block #2: Role-Based Dashboards Not Finalized
**Files:** `04_PAGES_AND_WIREFRAME_SPECS.md`, `11_SECURITY_AND_COMPLIANCE.md` (3 notes)  
**Status:** 🔴 BLOCKING - Affects core feature requirement

| Role | Current Status | Missing | Action |
|------|---|---|---|
| Sales Staff | Partially specified | Exact dashboard layout | Design in 04_PAGES_AND_WIREFRAME_SPECS.md |
| Baker | Not specified | Assigned layer queue view | ADD to 04_PAGES_AND_WIREFRAME_SPECS.md |
| Decorator | Not specified | Ready-for-decoration queue | ADD to 04_PAGES_AND_WIREFRAME_SPECS.md |
| Manager | Fully specified | NONE - Ready ✓ | Deploy as-is |
| Accountant | Question raised (**note - clarity, are we adding accountant page??????**) | Permission set, dashboard layout | Decision: Include YES (use restricted dashboard in 07_AUTHENTICATION_ARCHITECTURE.md) |

**Action:**
- ✅ Add Baker dashboard wireframe (order queue by layer status)
- ✅ Add Decorator dashboard wireframe (layers ready for decoration)
- ✅ Confirm Accountant dashboard (financial reports only)
- ✅ Update `08_API_SPEC_AND_ENDPOINTS.md` with role-specific endpoints
- **Owner:** Design team
- **Timeline:** 2-3 hours (TODAY)

**NOTE:** This aligns with 07_AUTHENTICATION_ARCHITECTURE.md recommendation to implement role-based dashboards - HIGH priority for rubric

---

### Block #3: Standard Menu / Product Options Not Defined
**Files:** `02_INFORMATION_ARCHITECTURE.md`, `01_SCOPE_AND_NON_GOALS.md` (4 notes - "stnd menu")  
**Status:** 🔴 BLOCKING - Dropdown lists cannot be built without this

| Menu Type | Current | Needed | Notes |
|-----------|---------|--------|-------|
| **Cake Flavors** | Generic list | Specific list | Define: Vanilla, Chocolate, Marble, Strawberry, Lemon, Red Velvet, Carrot (min 7) |
| **Fillings** | Generic list | Specific list | Define: Vanilla Buttercream, Chocolate Ganache, Raspberry Jam, Lemon Curd, Cream Cheese (min 5) |
| **Icing Types** | Generic list | Specific list | Define: Buttercream, Fondant, Ganache, Cream Cheese (min 4) |
| **Writing Colors** | Generic list | Specific list | Define: White, Black, Red, Pink, Gold, Silver (min 6) |
| **Cake Sizes** | Serves ranges | Firm sizes | DONE: Small, Medium, Large, XL, Sheet (prices in 07-UPDATE-_DATABASE_MIGRATIONS_SEED.md) |
| **Layer Pricing** | Mentioned in notes | Exact formula | Base price + layer adjustments (spec in 07-UPDATE-_DATABASE_MIGRATIONS_SEED.md) |

**Action:**
- ✅ Get Emily's menu from real bakery
- ✅ Update seed data in `07-UPDATE-_DATABASE_MIGRATIONS_SEED.md` 
- ✅ Add to UI style guide in `03_UI_STYLE_GUIDE_COMPONENTS.md`
- **Owner:** Product/business owner (Emily or assigned contact)
- **Timeline:** 1-2 hours (Must confirm TODAY)

---

### Block #4: Layer Pricing Calculation Unclear
**Files:** `02_INFORMATION_ARCHITECTURE.md` (1 note - "get layer price")  
**Status:** 🟡 SEMI-BLOCKING - Pricing validation cannot be tested without this

**Current Understanding:**
\`\`\`
Total Price = Base Cake Price + Sum(Layer Adjustments)

Example:
- Small cake: $25.00 (base)
- Layer 1: Chocolate (+$5)
- Layer 2: Vanilla ($0)
- Layer 3: Strawberry (+$3)
Total: $33.00
\`\`\`

**Action:**
- ✅ Confirm this formula with Emily/Professor
- ✅ Document in `08_API_SPEC_AND_ENDPOINTS.md` POST /orders endpoint
- ✅ Add to validation tests in `12_QA_TEST_PLAN.md`
- **Owner:** Product owner confirmation
- **Timeline:** 30 minutes (TODAY)

---

## HIGH PRIORITY - THIS WEEK (12 items)

### High #1: Staff Report Generation Underspecified
**Files:** `10_REPORTS_AND_ANALYTICS_SPEC.md` (2 notes)  
**Status:** 🟠 HIGH - Affects manager dashboard and grading rubric

| Note | Issue | Specification | Action |
|------|-------|---|---|
| "quick analysis...compare day/month revenue" | Unclear reporting scope | Add month-over-month, week-over-week comparisons to dashboard | Update 10_REPORTS_AND_ANALYTICS_SPEC.md with additional KPI cards |
| "staff should have this report...bad weather or power out" | Disaster recovery unclear | Create "Orders by Pickup Date" report (printable for offline access) | Implement offline-ready PDF export |

**Proposal:**
- ✅ Add "Orders by Pickup Date" report (helps staff continue if system down)
- ✅ Add printable production sheet (with all layer details)
- ✅ Add "Today's Pickups" report (for staff schedule)
- **Owner:** Development + Product
- **Timeline:** 4-6 hours (by Nov 13)

---

### High #2: Customer Order Status Tracking Ambiguous
**Files:** `01_SCOPE_AND_NON_GOALS.md` (2 notes)  
**Status:** 🟠 HIGH - Affects customer communication flow

| Specification | Current | Decision | Implementation |
|---|---|---|---|
| Can customers view order status? | Conflicting notes | "Via email link with unique ID" | Generate unique tracking URL in confirmation email |
| Who accesses it? | Unclear | Customer can click link → view status only (no edit) | Create public read-only /track/:orderId route |
| What do they see? | Not defined | Order status, layer progress, pickup time | Design /track/:orderId page in 04_PAGES_AND_WIREFRAME_SPECS.md |

**Action:**
- ✅ Add /track/:orderId public page (not in admin)
- ✅ Generate unique tracking token per order (store in database)
- ✅ Add tracking link to order confirmation email
- ✅ Design tracking page wireframe
- **Owner:** Development
- **Timeline:** 6-8 hours (by Nov 14)

---

### High #3: Disaster Recovery Strategy Vague
**Files:** `06-UPDATE-_PROFESSOR_ERD_ENHANCEMENT_NOTES.md` (1 note)  
**Status:** 🟠 HIGH - Shows project completeness for rubric

| Current Note | Issue | Better Approach |
|---|---|---|
| "option to download critical info and print in few seconds" | Unclear implementation | Create "Emergency Backup Report" feature |

**Proposal:**
- ✅ Implement "Download Daily Summary" (PDF of all orders for today/this week)
- ✅ Printable format (no graphics, text-only, page breaks)
- ✅ Includes: Order list, layer details, customer contact info
- ✅ File naming: `Emily_Bakes_Backup_2025-11-05.pdf`
- **Owner:** Development
- **Timeline:** 3-4 hours (by Nov 14)

---

### High #4: Email Confirmation Flow Undefined
**Files:** `02_INFORMATION_ARCHITECTURE.md` (2 notes)  
**Status:** 🟠 HIGH - Affects customer communication

| Item | Current | Needed |
|---|---|---|
| Send email to customer? | "Possibly: Send Email confirmation to customers" | YES - Send confirmation email after order created |
| Email content | Not specified | Include: Order ID, cake details, pickup info, tracking link |
| When sent | Not specified | Immediately after order saved (async) |

**Action:**
- ✅ Add email template for order confirmation
- ✅ Implement email sending in order creation API
- ✅ Include tracking URL in email
- ✅ Add to 08_API_SPEC_AND_ENDPOINTS.md
- **Owner:** Development
- **Timeline:** 4-5 hours (by Nov 14)

---

### High #5: Dashboard KPI Scope for Non-Managers
**Files:** `04_PAGES_AND_WIREFRAME_SPECS.md` (1 note - "is revenue today relevant to non mgmt?")  
**Status:** 🟠 HIGH - UX Design decision

**Question:** Should regular staff see "Revenue Today" KPI?

**Decision Options:**
| Option | Pros | Cons |
|--------|------|------|
| YES - Show all staff | Everyone sees business performance | Might be overwhelming/irrelevant to bakers |
| NO - Only managers | Cleaner staff dashboard | Siloes information |
| HYBRID - Show only relevant KPIs | Staff see: "Orders Today", "In Progress", "Ready for Pickup" | Managers see: Revenue, Customer spend, etc. |

**Recommendation:** HYBRID approach
- Staff dashboard: 3 KPIs (Today's Orders, In Progress count, Ready for Pickup count)
- Manager dashboard: 6 KPIs (add Revenue, Avg Order Value, New Customers)

**Action:**
- ✅ Update 04_PAGES_AND_WIREFRAME_SPECS.md with staff dashboard KPIs
- ✅ Implement role-specific KPI filtering in frontend
- **Owner:** Product + Design
- **Timeline:** 2 hours (by Nov 12)

---

### High #6: Order View Filtering Underspecified
**Files:** `01_SCOPE_AND_NON_GOALS.md` (1 note - "order view by options")  
**Status:** 🟠 HIGH - Affects staff workflow

**Current:** "View orders by status"  
**Requested:** "View by Flavor, Filling, Layers, customer status, pickup time, date"

**Proposal:** Add advanced filters
- ✅ Filter by: Flavor, Filling, Layer count, Customer Type (Retail/Corporate), Pickup Date, Status
- ✅ Implement in Orders List page as filter panel
- ✅ Add to 08_API_SPEC_AND_ENDPOINTS.md GET /orders endpoint

**Action:**
- ✅ Update GET /orders endpoint to support query filters
- ✅ Add filter UI to orders list page
- ✅ Test with sample data
- **Owner:** Development
- **Timeline:** 5-6 hours (by Nov 15)

---

## MEDIUM PRIORITY - NEXT WEEK (15 items)

### Medium #1: API Transitions Not Fully Specified
**Files:** `08_API_SPEC_AND_ENDPOINTS.md` (1 note - "lets see...")  
**Note:** "Allowed Transitions"

**Current:** Workflow documented but transition validation not specified

**Action:**
- ✅ Add validation logic in PATCH /orders/:orderId/status endpoint
- ✅ Only allow: To Be Created → In Baking → Decorating → Ready → Picked Up
- ✅ Only allow: Any status → Cancelled
- ✅ Add validation tests in 12_QA_TEST_PLAN.md
- **Timeline:** 3 hours (by Nov 16)

---

### Medium #2: Delivery Options Scope
**Files:** `02_INFORMATION_ARCHITECTURE.md` (1 note - "is delivery allowed??")  
**Status:** 🟡 MEDIUM - May not be in scope

**Decision:** For MVP, assume pickup only (no delivery)
- ✅ Remove "delivery" concept from orders
- ✅ All pickups at Emily Bakes storefront
- ✅ Document in 01_SCOPE_AND_NON_GOALS.md

---

### Medium #3: Special Design Notes Field
**Files:** `02_INFORMATION_ARCHITECTURE.md` (1 note - "add special design notes")  
**Status:** 🟡 MEDIUM - Nice-to-have field

**Implementation:**
- ✅ Add "Design Notes" text field to order form (optional)
- ✅ Field persists in ORDER.Special_Notes
- ✅ Visible on production sheet
- **Timeline:** 1 hour

---

### Medium #4: Pickup Time Slots Definition
**Files:** `02_INFORMATION_ARCHITECTURE.md` (1 note - "specific time slots or all day?")  
**Status:** 🟡 MEDIUM - Business rule clarification

**Decision:** Free-form time entry (no pre-set slots)
- ✅ Allow staff to enter any time during business hours
- ✅ Validation: 9:00 AM - 5:00 PM
- ✅ Store as HH:MM format

---

### Medium #5-15: Miscellaneous UI/UX Clarifications
**Files:** Multiple  
**Status:** 🟡 MEDIUM - UX refinement

| Item | Current Note | Action | Timeline |
|------|---|---|---|
| Version numbers | "Wrong Version Number" in 01_SCOPE_AND_NON_GOALS.md | Update to 2.0 (post-clarification) | 30 min |
| Admin functionality | "for admin more functionality" in 01_SCOPE_AND_NON_GOALS.md | Expand admin role permissions | 2 hrs |
| Note clarity | "Clarity" appears 10+ times | Review each and document decisions | 3 hrs |
| Mobile responsiveness | Assumed but not tested | Test all pages on mobile | 4 hrs |
| Error messages | Generic placeholder messages | Write specific, helpful error texts | 2 hrs |
| Keyboard shortcuts | Not documented | Add Ctrl+S for save, Escape for cancel | 1 hr |
| Search functionality | Basic search only | Add full-text search for orders/customers | 4 hrs |

**Timeline for all Medium items:** By Nov 18

---

## LOW PRIORITY - Final Polish (7 items)

### Low #1-7: Enhancement Ideas
| Feature | Current | Proposal | Priority |
|---------|---------|----------|----------|
| Blog section | "maybe" | Skip for MVP | Low |
| Live chat | "prob not" | Don't implement | Low |
| Instagram feed | "maybe" | Skip for MVP | Low |
| Video tour | "maybe with AI" | Skip for MVP | Low |
| Newsletter signup | "maybe" | Skip for MVP | Low |
| Chatbot | Already decided NO | ✓ Don't implement | Low |
| 3D builder | Already decided NO | ✓ Don't implement | Low |

**Recommendation:** Focus on core functionality. Skip all "maybe" items for Nov 21 deadline.

---

## SUMMARY TABLE: ALL 42 NOTES BY FILE

| File | Count | Blocking | High | Medium | Low | Status |
|------|-------|----------|------|--------|-----|--------|
| **04_PAGES_AND_WIREFRAME_SPECS.md** | 9 | 5 | 2 | 2 | 0 | 🔴 URGENT |
| **11_SECURITY_AND_COMPLIANCE.md** | 10 | 1 | 1 | 6 | 2 | 🟠 HIGH |
| **06-UPDATE-_PROFESSOR_ERD_ENHANCEMENT_NOTES.md** | 2 | 1 | 1 | 0 | 0 | 🟠 HIGH |
| **06_DFD_UPDATE_AND_DATA_STORES.md** | 3 | 1 | 1 | 1 | 0 | 🟠 HIGH |
| **10_REPORTS_AND_ANALYTICS_SPEC.md** | 3 | 0 | 2 | 1 | 0 | 🟠 HIGH |
| **02_INFORMATION_ARCHITECTURE.md** | 8 | 0 | 4 | 4 | 0 | 🟠 HIGH |
| **08_API_SPEC_AND_ENDPOINTS.md** | 1 | 0 | 0 | 1 | 0 | 🟡 MEDIUM |
| **01_SCOPE_AND_NON_GOALS.md** | 3 | 0 | 1 | 2 | 0 | 🟡 MEDIUM |
| **14_DELTA_LOG.md** | 1 | 0 | 0 | 0 | 1 | ✓ OK |
| **13_PUBLIC_WEBSITE_PLAN.md** | 2 | 0 | 0 | 0 | 2 | ✓ OK |
| **TOTAL** | **42** | **8** | **12** | **17** | **5** | |

---

## DECISION FRAMEWORK: How to Use This Tracker

### TODAY (Nov 5, 6 PM)
1. ✅ Stakeholder review: Confirm all BLOCKING decisions
2. ✅ Create demo credentials (30 min)
3. ✅ Get real product menu from Emily (1 hour)
4. ✅ Finalize role-based dashboard design (1 hour)
5. ✅ Assign owners for HIGH priority items

**Est. Time:** 3-4 hours

### This Week (Nov 6-12)
- ✅ Implement all BLOCKING fixes
- ✅ Start HIGH priority items (in parallel teams if possible)
- ✅ Update documentation as decisions are made

**Est. Time:** 20-25 hours of development work

### Next Week (Nov 13-18)
- ✅ Finish HIGH priority items
- ✅ Implement MEDIUM priority items
- ✅ Final testing and bug fixes

**Est. Time:** 15-20 hours of development work

### Final Days (Nov 19-21)
- ✅ Polish and refinement
- ✅ Final review before submission
- ✅ Prep presentation materials

---

## RUBRIC ALIGNMENT

### How These Notes Impact Your Grade

| Rubric Category | Notes Affecting This | Impact |
|---|---|---|
| **Database Design** | ERD enhancement notes (2) | HIGH - Shows complex data modeling |
| **Security & Compliance** | Security notes (10) | MEDIUM - Shows awareness of security |
| **API & Integration** | API transitions (1) | MEDIUM - Shows proper endpoint design |
| **UI/UX Design** | Dashboard design (3) | HIGH - Shows thoughtful UX |
| **Role-Based Access** | RBAC notes (2) | HIGH - Shows understanding of security |
| **Business Logic** | Pricing, validation (4) | HIGH - Shows implementation detail |
| **Testing** | Test scenarios (5) | MEDIUM - Shows QA planning |
| **Documentation** | All clarifications (10+) | MEDIUM - Shows professional standards |

**Total Impact:** ~18 notes directly affect grading (HIGH priority = ~45% of notes)

---

## SUCCESS CRITERIA: Ready for Nov 21

- [x] All BLOCKING items resolved
- [x] All HIGH priority items implemented
- [x] MEDIUM items completed (80%+)
- [x] Code tested and documented
- [x] Demo works end-to-end
- [x] Team understands all decisions
- [x] Presentation prep complete

---

## NEXT STEPS

### Immediate (Before Nov 6, 6 PM)
1. **Read this document as a team** (15 min)
2. **Schedule decision-making meeting** (30 min)
3. **Assign owners** (15 min)
4. **Create demo accounts + get menu** (1.5 hours)

### This Meeting
1. Confirm or revise all recommendations above
2. Assign specific developers to BLOCKING + HIGH items
3. Set daily standup: 9 AM each day through Nov 21
4. Create GitHub issues for each item with this tracker reference

---

## Contacts & Escalation

**Questions about decisions?** Escalate to Professor (role clarification, scope decisions)

**Questions about implementation?** Team lead decides

**Blocked on requirements?** Raise in standup immediately - don't wait

---

## Document Maintenance

**This tracker is LIVE.** Update it daily as you resolve items.

- ✅ Mark items complete as you finish them
- ✅ Move items to higher priority if dependencies block other work
- ✅ Add new notes as they come up
- ✅ Share updates in standup

---

**Last Updated:** November 5, 2025, 6:30 PM CST  
**Next Review:** November 6, 2025, 9:00 AM CST (Daily Standup)  
**Final Deadline:** November 21, 2025, 11:59 PM CST
