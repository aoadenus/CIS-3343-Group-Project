# ⚡ QUICK FIX CHECKLIST
## Emily Bakes Cakes - Critical Issues to Fix

**Deadline:** November 15, 2025  
**Last Updated:** November 14, 2025

---

## 🔥 TODAY - CRITICAL (P0)

### 1. Create Order Button BROKEN
- [ ] Debug React context error ("cannot destruct property basename")
- [ ] Test order creation with all 6 staff accounts
- [ ] Verify layers can be added/configured
- [ ] Confirm customer selection works
- [ ] Test product selection works

**Status:** ❌ BLOCKING ALL ORDERS  
**Owner:** _______________

---

### 2. Shop Page Categories WRONG
**Current:** All | Birthday | Wedding | Anniversary | Corporate | Seasonal  
**Required:** All Cakes | Flavors | Fillings | Colors

- [ ] Remove current category filter buttons
- [ ] Add new categories aligned with case study:
  - [ ] All Cakes (Birthday Celebration, Almond Delight, etc.)
  - [ ] Flavors (Vanilla, Almond, Yellow, Chocolate, etc.)
  - [ ] Fillings (Buttercream varieties, Mousse varieties, etc.)
  - [ ] Colors (Primary, Pastel, Neon, Fall)
- [ ] OR: Remove filter entirely, show all products
- [ ] Test filtering works correctly

**Status:** ❌ CASE STUDY VIOLATION  
**Owner:** _______________

---

### 3. Remove Customer Ordering CTAs
- [ ] **Home page:** Remove "Start Building" buttons
  - [ ] Replace with "Call to Order: (555) 123-4567"
  - [ ] Add "Visit Our Store" CTA
- [ ] **Shop page:** Remove inquiry forms
  - [ ] Add "To order, call us at (555) 123-4567"
  - [ ] Convert to inspiration-only format
- [ ] **Gallery page:** Remove "Start Custom Builder" button
  - [ ] Add "Love what you see? Call to order"
- [ ] Test all public pages have NO ordering capability

**Status:** ❌ VIOLATES STAFF-ONLY ARCHITECTURE  
**Owner:** _______________

---

### 4. Hide Login Button from Public
- [ ] Remove "Login" from public top navigation menu
- [ ] Keep Login in hamburger/expandable menu only
- [ ] OR: Remove completely, staff access via direct URL
- [ ] Test login still accessible to staff

**Status:** ❌ SECURITY CONCERN  
**Owner:** _______________

---

## 🔥 TONIGHT - HIGH PRIORITY (P1)

### 5. Demo Credentials Too Small
- [ ] Make "DemoPass123" text MUCH LARGER on login page
- [ ] Create prominent credentials box with:
  ```
  🔐 DEMO CREDENTIALS
  Email: emily@emilybakes.com
  Password: DemoPass123
  
  (6 staff accounts available)
  ```
- [ ] Test visibility on laptop and projector screens

**Status:** ⚠️ GRADING IMPACT  
**Owner:** _______________

---

### 6. Employee Page Lackluster
**User Feedback:** "NOT VERY NICE, VERY LACKLUSTER"

- [ ] **Identify:** Which employee page is problematic?
  - [ ] Staff list page?
  - [ ] Employee management page?
  - [ ] Staff dashboard?
- [ ] **Redesign with:**
  - [ ] Professional card layout (not basic table)
  - [ ] Employee photos/avatars
  - [ ] Name, role, contact info clearly displayed
  - [ ] Assigned orders or queue visible
  - [ ] Search and filter capabilities
- [ ] Add modern styling (shadows, hover effects, colors)
- [ ] Test with all staff roles viewing

**Status:** ⚠️ USER SPECIFICALLY UPSET  
**Owner:** _______________

---

### 7. Contact Page Reorganization
- [ ] **Shrink** "How Ordering Works" box by 60%
- [ ] **Move** "How Ordering Works" to LEFT side
- [ ] **Create** RIGHT side column with contact info:
  - [ ] 📞 Call Us: (555) 123-4567
  - [ ] ✉️ Email: orders@emilybakes.com
  - [ ] 🏪 Visit Us: [Address near Galleria]
  - [ ] 🕐 Business Hours: [Hours]
- [ ] Stack contact info vertically on right
- [ ] Reduce scrolling needed to see contact info
- [ ] Test mobile responsiveness

**Status:** ⚠️ CUSTOMER TOUCHPOINT  
**Owner:** _______________

---

### 8. Email Notifications Integration
- [ ] Set up Resend account and API key
- [ ] Add email sending to order creation endpoint
- [ ] Create email template with:
  - [ ] Order confirmation details
  - [ ] Tracking link: `/track/{token}`
  - [ ] Pickup date/time
  - [ ] Deposit information
- [ ] Test email delivery
- [ ] Verify tracking link works when clicked

**Status:** ⚠️ KEY FEATURE MISSING  
**Owner:** _______________

---

### 9. Six Client Reports Completion
- [ ] **Report 1:** Order Summary Report
  - [ ] Bar chart showing orders by status
  - [ ] CSV/PDF export
- [ ] **Report 2:** Customer List Report  
  - [ ] Line chart showing customer growth
  - [ ] CSV/PDF export
- [ ] **Report 3:** Revenue Report (Accountant/Manager only)
  - [ ] 3 charts: daily, weekly, monthly revenue
  - [ ] CSV/PDF export
- [ ] **Report 4:** Pending Orders Report
  - [ ] Funnel chart showing order pipeline
  - [ ] CSV/PDF export
- [ ] **Report 5:** Completed Orders Report
  - [ ] Bar chart showing completion rates
  - [ ] CSV/PDF export
- [ ] **Report 6:** Product Inventory Report (Manager only)
  - [ ] Horizontal bar chart showing product counts
  - [ ] CSV/PDF export
- [ ] Test role-based access (who can see which reports)

**Status:** ⚠️ REQUIRED DELIVERABLE  
**Owner:** _______________

---

## 🟡 TOMORROW - FINISHING TOUCHES (P2)

### 10. Breadcrumb Trail
- [ ] Add breadcrumb component
- [ ] Implement on all pages:
  - [ ] Home > Shop > [Category]
  - [ ] Home > Gallery
  - [ ] Home > Admin > Orders > Create
- [ ] Style with Tailwind
- [ ] Test navigation

**Status:** 🟡 UX IMPROVEMENT  
**Owner:** _______________

---

### 11. About Page Alignment Fix
- [ ] Fix "Artisan Behind the Arts" section
- [ ] Align 4 boxes with large image
- [ ] Ensure consistent spacing
- [ ] Test on different screen sizes

**Status:** 🟡 VISUAL QUALITY  
**Owner:** _______________

---

### 12. Google Maps Integration
- [ ] Get Google Maps embed code for Houston location (near Galleria)
- [ ] Add iframe to Contact page
- [ ] Position below or beside contact information
- [ ] Test responsiveness

**Status:** 🟡 NICE TO HAVE  
**Owner:** _______________

---

## ✅ FINAL TESTING (Before Submission)

### Comprehensive Testing Checklist
- [ ] **Test all 6 staff accounts:**
  - [ ] Emily (Owner) - emily@emilybakes.com
  - [ ] James (Manager) - manager@emilybakes.com
  - [ ] Sarah (Sales) - sales@emilybakes.com
  - [ ] Tom (Baker) - baker@emilybakes.com
  - [ ] Lisa (Decorator) - decorator@emilybakes.com
  - [ ] Dan (Accountant) - accountant@emilybakes.com

- [ ] **Test order creation workflow:**
  - [ ] Create order with Sales account
  - [ ] Create order with Baker account (should have Sales access)
  - [ ] Create order with Decorator account (should have Sales access)
  - [ ] Verify Manager can assign orders
  - [ ] Confirm tracking token generated
  - [ ] Check email notification sent

- [ ] **Test order tracking:**
  - [ ] Access `/track/{token}` without login
  - [ ] Verify auto-cycling works (changes every 2 min)
  - [ ] Check 11 stages display correctly
  - [ ] Confirm continuous loop

- [ ] **Test all 6 reports:**
  - [ ] Verify charts render with Recharts
  - [ ] Test CSV export
  - [ ] Test PDF export
  - [ ] Confirm role-based access control

- [ ] **Test mobile responsiveness:**
  - [ ] All public pages
  - [ ] All staff portal pages
  - [ ] Order creation form
  - [ ] Reports page

- [ ] **Verify case study compliance:**
  - [ ] NO customer online ordering
  - [ ] Staff enter ALL orders
  - [ ] 50% deposit calculation
  - [ ] 2-day advance notice validation
  - [ ] Image upload for customer references
  - [ ] Layer 1 = bottom layer
  - [ ] Manual pricing (negotiated)

---

## 📊 PROGRESS TRACKING

### Priority 0 (Critical) - 4 items
- [ ] Create Order button (0%)
- [ ] Shop categories (0%)
- [ ] Remove customer CTAs (0%)
- [ ] Hide login button (0%)

**P0 Completion:** 0 / 4 (0%)

### Priority 1 (High) - 5 items
- [ ] Demo credentials (0%)
- [ ] Employee page (0%)
- [ ] Contact page (0%)
- [ ] Email integration (0%)
- [ ] Six reports (0%)

**P1 Completion:** 0 / 5 (0%)

### Priority 2 (Medium) - 3 items
- [ ] Breadcrumb trail (0%)
- [ ] About alignment (0%)
- [ ] Google Maps (0%)

**P2 Completion:** 0 / 3 (0%)

**OVERALL PROGRESS:** 0 / 12 (0%)

---

## 🎯 DAILY GOALS

### Thursday, Nov 14 (TODAY)
**Goal:** Complete ALL P0 items + start P1  
**Target:** 4 P0 + 2 P1 items = 6 items completed

- Morning: Fix Create Order button + Shop categories
- Afternoon: Remove customer CTAs + Hide login
- Evening: Demo credentials + Start employee page

### Friday, Nov 15 (TOMORROW)  
**Goal:** Complete ALL P1 + P2 items + final testing  
**Target:** 3 P1 + 3 P2 items = 6 items completed

- Morning: Finish P1 items (employee page, contact, email, reports)
- Afternoon: Complete P2 items (breadcrumb, alignment, maps)
- Evening: Comprehensive testing, bug fixes
- Night: Final review, submission prep

---

## 📞 COMMUNICATION

**Team Stand-up Schedule:**
- Morning: 9:00 AM - Review overnight progress
- Evening: 6:00 PM - End of day status update
- Night: 10:00 PM - Final check-in before deadline

**Status Updates Required:**
- [ ] Every task completion (post in team chat)
- [ ] Any blockers discovered (escalate immediately)
- [ ] Testing results (document issues found)

---

## 🚨 ESCALATION

**If you're blocked:**
1. Document the exact error message
2. Take screenshots
3. Post in team chat with @everyone
4. Try rubber duck debugging
5. Search Stack Overflow
6. Ask Claude/ChatGPT for help

**Blockers to watch for:**
- API connection issues
- Database schema mismatches
- React context errors (like Create Order bug)
- Authentication/permission problems
- Recharts integration issues

---

**Last Updated:** November 14, 2025, 3:00 PM  
**Next Update:** November 14, 2025, 6:00 PM  
**Final Deadline:** November 15, 2025, 11:59 PM
