# 🚨 CRITICAL WEBSITE FIXES REQUIRED
## Emily Bakes Cakes - Issues Found During Walkthrough

**Date Identified:** November 14, 2025  
**Status:** ⚠️ URGENT - Must be fixed before prefinal draft deadline (Nov 15, 2025)  
**Source:** Website walkthrough transcription + Case study review

---

## 📋 TABLE OF CONTENTS

1. [Critical Broken Functionality](#critical-broken-functionality)
2. [Navigation & UX Issues](#navigation--ux-issues)
3. [Public Pages - Content & Layout Problems](#public-pages---content--layout-problems)
4. [Staff Portal Issues](#staff-portal-issues)
5. [Case Study Compliance Violations](#case-study-compliance-violations)
6. [Missing Features](#missing-features)
7. [Priority Matrix](#priority-matrix)

---

## 🔥 CRITICAL BROKEN FUNCTIONALITY

### 1. Create Order Button - COMPLETELY BROKEN ❌
**Location:** Staff Dashboard → Create Order button  
**Error:** "TypeError: cannot destruct property basename of react-19 useContext as it is known"  
**Impact:** Staff CANNOT create any orders - core functionality broken  
**Priority:** 🔴 P0 - FIX IMMEDIATELY

**Fix Required:**
- Debug React context error in order creation flow
- Likely related to routing context not being properly provided
- Test all order creation workflows after fix

---

### 2. Shop Page - Search/Filter Criteria Completely Wrong ❌
**Location:** `/shop` page  
**Current Categories:** "All | Birthday | Wedding | Anniversary | Corporate | Seasonal"  
**Problem:** These categories DON'T match the case study products or standardized menu

**Case Study Says:**
- Products categorized as: Cakes, Pastries, Cupcakes, Cookies, Petit Fours, Pies, Breads, Seasonal Products
- Standard cakes: Birthday Celebration, Almond Delight, Lemon and Cream Cheese, Black Forest, German Chocolate, etc.

**Fix Required:**
Replace current categories with:
1. **All Cakes** (shows all standard cakes)
2. **Flavors** (Vanilla, Almond, Yellow, Devil's Food Chocolate, etc.)
3. **Fillings** (White Buttercream, Chocolate Buttercream, Cream Cheese, etc.)
4. **Colors** (Primary, Pastel, Neon, Fall colors, etc.)
5. **Remove the current broken categories entirely**

**Alternative:** Remove filter completely and just show all products as inspiration

---

## 🧭 NAVIGATION & UX ISSUES

### 3. No Breadcrumb Trail ❌
**Location:** Entire site  
**Problem:** Users can't see where they are in site hierarchy  
**Impact:** Poor navigation experience  
**Priority:** 🟡 P2 - Important for UX

**Fix Required:**
Add breadcrumb trail to all pages:
\`\`\`
Home > Shop > Chocolate Cakes
Home > Admin > Orders > Create Order
\`\`\`

---

### 4. Login Button Exposed to Public ❌
**Location:** Navigation menu (visible to customers)  
**Problem:** Login button is in the public navigation menu  
**Security Risk:** Exposes admin portal to customers  
**Priority:** 🔴 P0 - Security concern

**Fix Required:**
- **Remove** login button from public top navigation menu
- **Keep** login button only in the expandable hamburger menu on the right side
- Staff should access via direct URL or discreet menu option

---

### 5. Demo Credentials Text Too Small ⚠️
**Location:** Login page, bottom of screen  
**Problem:** "DemoPass123" is way too small and hard to see  
**Impact:** Professor and teammates can't easily test the portal  
**Priority:** 🟠 P1 - Critical for grading/demo

**Fix Required:**
- Make demo credentials MUCH LARGER
- Use prominent styling (maybe a box or card)
- Format clearly:
  \`\`\`
  🔐 DEMO CREDENTIALS FOR TESTING
  Email: emily@emilybakes.com
  Password: DemoPass123
  
  (6 staff accounts available - see documentation)
  \`\`\`

---

## 🌐 PUBLIC PAGES - CONTENT & LAYOUT PROBLEMS

### 6. Home Page - Invalid CTAs ❌
**Location:** `/` (home page)  
**Problem:** Hero section has "Start Building" buttons  
**Violation:** This is a staff-only system - customers CANNOT order online  
**Priority:** 🔴 P0 - Case study violation

**Fix Required:**
Remove all "Start Building" CTAs and replace with:
- "📞 Call to Order: (555) 123-4567"
- "✉️ Email Us: orders@emilybakes.com"
- "🏪 Visit Our Store" (with address)

---

### 7. Shop Page - Needs Complete Restructure ❌
**Location:** `/shop`  
**Current State:** Has inquiry forms and ordering hints  
**Required State:** Inspiration-only marketing page  
**Priority:** 🔴 P0 - Case study violation

**Fixes Required:**
1. Remove ALL inquiry forms
2. Remove any "order now" or "customize" buttons
3. Add clear text: "To order, please call (555) 123-4567 or visit our store"
4. Fix category filters (see Issue #2)
5. Convert to pure inspiration/gallery format

---

### 8. Gallery Page - Invalid CTA ❌
**Location:** `/gallery`  
**Problem:** Has "Start Custom Builder" button  
**Priority:** 🔴 P0 - Case study violation

**Fix Required:**
- Remove "Start Custom Builder" button completely
- Add text: "Love what you see? Call us to order: (555) 123-4567"
- Keep gallery images as pure inspiration

---

### 9. Contact Page - Multiple Issues ⚠️
**Location:** `/contact`  
**Problems:**
1. "How Ordering Works" box is COMICALLY LARGE - takes too much scrolling
2. Contact information buried below the fold
3. Google Maps NOT integrated (still missing)
4. Poor layout hierarchy

**Priority:** 🟠 P1 - Important customer touchpoint

**Fixes Required:**
1. **Reduce "How Ordering Works" box height by 60%**
2. **Reorganize layout:**
   - LEFT side: "How Ordering Works" (smaller box)
   - RIGHT side: Contact information vertically stacked:
     - 📞 Call Us
     - ✉️ Email Us  
     - 🏪 Visit Us
     - 🕐 Business Hours
3. **Add Google Maps embed** (no API key needed - just iframe)
4. **Test responsiveness** on mobile

---

### 10. About Page - Misaligned Elements ⚠️
**Location:** `/about`  
**Problem:** "The Artisan Behind the Arts" section - 4 boxes misaligned with large image  
**Priority:** 🟡 P2 - Visual quality issue

**Fix Required:**
- Align the 4 boxes properly with the large image
- Ensure consistent spacing and visual harmony
- Test on multiple screen sizes

---

## 👥 STAFF PORTAL ISSUES

### 11. Employee Page - Lackluster & Unprofessional ❌
**Location:** Staff portal (specific page not identified in transcription)  
**User Feedback:** "NOT VERY NICE, VERY LACKLUSTER"  
**Priority:** 🟠 P1 - User specifically upset about this

**Investigation Needed:**
- Which specific employee page? (Staff list? Employee management? Staff dashboard?)
- What makes it lackluster? (Styling? Functionality? Layout?)

**Potential Issues:**
- Poor styling/design
- Missing key information
- Lack of functionality
- Unprofessional appearance
- No profile photos or details
- Bad table layout

**Fix Required (Pending Investigation):**
1. Identify specific employee page
2. Add professional styling
3. Include employee details:
   - Name, role, photo
   - Contact information
   - Assigned orders
   - Performance metrics (if manager view)
4. Use cards or modern layout instead of basic table
5. Add search/filter capabilities

---

### 12. Dashboard Issues ⚠️
**Location:** Staff dashboard (all roles)  
**Status:** Unknown - needs testing after Create Order fix

**Potential Issues to Verify:**
- Are all 5 role-based dashboards working?
- Do Bakers and Decorators have FULL Sales access tabs?
- Are quick actions functional?
- Are analytics displaying correctly?

---

## 📜 CASE STUDY COMPLIANCE VIOLATIONS

### 13. Missing Required Features ❌

**From Case Study Business Requirements:**

#### Requirement 1: Customer Management (MANDATORY - Highest Priority)
- ✅ Customer input functionality exists
- ⚠️ Need to verify: Email list and phone number list export
- **Action:** Test customer export features

#### Requirement 2: Order Creation and Tracking (MANDATORY - 2nd Priority)
- ❌ Order creation BROKEN (see Issue #1)
- ✅ Order tracking with tokens exists
- ⚠️ Need to verify: Status updates, employee tracking, reminders
- **Action:** Fix order creation, test all tracking features

#### Requirement 3: Product Management (KEY - 3rd Priority)
- ✅ Product CRUD exists
- ⚠️ Need to verify: All pricing captured, options included
- **Action:** Verify all cake flavors, fillings, icings, decorations are in system

#### Requirement 4: Updated Website (OPTIONAL - 4th Priority)
- ⚠️ Website exists but has MAJOR issues (see all issues above)
- ❌ Not mobile-optimized (needs testing)
- **Action:** Fix all public page issues, test mobile responsiveness

---

### 14. Business Rules Not Reflected ❌

**From Case Study - Critical Rules:**

1. **Multi-tiered cakes:** "Layer 1 is always the bottom-most layer"
   - ⚠️ Need to verify order form reflects this
   
2. **Pricing:** "Prices for decorated cakes are negotiated at time of ordering"
   - ⚠️ Need manual price field in order form (not auto-calculated)

3. **Customization:** "Customers can provide photos, clippings, or examples"
   - ⚠️ Need image upload in order form (mentioned in transcription)

4. **Deposits:** "Customers must pay at least 50% deposit on all custom orders"
   - ⚠️ Verify deposit calculation in order form

5. **Lead Time:** "Customized cakes should be ordered at least 2 days in advance"
   - ⚠️ Need validation in order form (date picker should enforce this)

6. **Categories:** Products must be in ONE category only
   - ❌ Shop page categories don't match (see Issue #2)

**Action:** Verify ALL business rules are enforced in order creation form

---

## ❌ MISSING FEATURES

### 15. Email Notifications - Not Integrated ⚠️
**Status:** Resend integration not working  
**Impact:** Customers can't receive tracking links  
**Priority:** 🟠 P1 - Key feature

**Required:**
- Integrate Resend email service
- Send email on order creation with tracking link
- Test email delivery

---

### 16. Google Maps - Still Missing ❌
**Location:** Contact page  
**Status:** Not integrated (mentioned in walkthrough)  
**Priority:** 🟡 P2 - Nice to have

**Required:**
- Add Google Maps iframe embed
- No API key needed - just use embed code
- Show bakery location near Galleria (Houston)

---

### 17. Six Client Reports - Incomplete ⚠️
**Status:** In progress, not all completed  
**Priority:** 🟠 P1 - Required deliverable

**Required Reports:**
1. Order Summary Report
2. Customer List Report  
3. Revenue Report (Accountant/Manager only)
4. Pending Orders Report
5. Completed Orders Report
6. Product Inventory Report (Manager only)

**Each report needs:**
- Recharts visualization (bar, line, or pie chart)
- CSV/PDF export functionality
- Proper role-based access control

---

## 📊 PRIORITY MATRIX

### 🔴 P0 - CRITICAL (Fix TODAY - Nov 14)
1. ✅ **Create Order button broken** - Core functionality
2. ✅ **Shop page categories wrong** - Case study violation  
3. ✅ **Remove all customer ordering CTAs** - Case study violation
4. ✅ **Hide login button from public** - Security issue

### 🟠 P1 - HIGH (Fix by Nov 15 deadline)
1. ✅ **Demo credentials too small** - Grading impact
2. ✅ **Employee page lackluster** - User specifically upset
3. ✅ **Contact page layout issues** - Customer touchpoint
4. ✅ **Email notifications** - Key feature
5. ✅ **Six client reports completion** - Required deliverable

### 🟡 P2 - MEDIUM (Fix if time permits)
1. ✅ **Breadcrumb trail** - UX improvement
2. ✅ **About page alignment** - Visual quality
3. ✅ **Google Maps integration** - Nice to have

### 🟢 P3 - LOW (Post-deadline improvements)
1. ✅ **Mobile responsiveness testing** - Quality assurance
2. ✅ **Performance optimization** - User experience

---

## ✅ RECOMMENDED FIX ORDER

### **TODAY (Nov 14) - CRITICAL FIXES**
1. Fix Create Order button (investigate React context error)
2. Fix Shop page categories (align with case study)
3. Remove all "Start Building", "Custom Builder" CTAs from public pages
4. Hide login button from public navigation
5. Make demo credentials MUCH larger on login page

### **TONIGHT (Nov 14) - HIGH PRIORITY**
6. Redesign employee page (identify which one, make it professional)
7. Reorganize Contact page layout (smaller How Ordering box, stacked contact info)
8. Complete remaining client reports with Recharts
9. Integrate Resend email notifications

### **TOMORROW MORNING (Nov 15) - FINISHING TOUCHES**
10. Add breadcrumb trail across site
11. Fix About page alignment issues
12. Add Google Maps to Contact page
13. Test all functionality with all 6 demo staff accounts

### **BEFORE SUBMISSION (Nov 15) - QUALITY ASSURANCE**
14. Test mobile responsiveness on all pages
15. Verify all case study business rules are enforced
16. Test all 6 staff roles and permissions
17. Verify all 6 reports work correctly
18. Final walkthrough with checklist

---

## 🎯 CASE STUDY ALIGNMENT CHECKLIST

### **Core Requirements (MUST HAVE)**
- [ ] Customer Management: Input, store, export email/phone lists
- [ ] Order Creation: Staff create ALL orders (no customer ordering)
- [ ] Order Tracking: Public tracking page with auto-cycling
- [ ] Product Management: All products, flavors, fillings, decorations captured
- [ ] Role-Based Access: 5 dashboards (Sales, Baker, Decorator, Accountant, Manager)
- [ ] Bakers & Decorators have FULL Sales permissions when not busy

### **Business Rules (MUST ENFORCE)**
- [ ] One cake/product per order
- [ ] 50% deposit required on custom orders
- [ ] 2-day advance ordering (with manager override)
- [ ] Layer 1 is bottom-most layer
- [ ] Negotiated pricing for decorated cakes
- [ ] Customer can provide reference photos
- [ ] Products in ONE category only

### **Technical Requirements**
- [ ] PostgreSQL database with Drizzle ORM
- [ ] JWT authentication for staff
- [ ] 6 demo staff accounts working
- [ ] Public tracking with unique tokens
- [ ] Email notifications (Resend)
- [ ] 6 client reports with Recharts

### **UI/UX Requirements**
- [ ] Public pages: Marketing ONLY (no customer ordering)
- [ ] Staff portal: Role-based dashboards
- [ ] Mobile-responsive design
- [ ] Professional, polished appearance
- [ ] Clear call-to-actions (call/email/visit)

---

## 📝 NOTES FROM WALKTHROUGH

**User's Emotional State:**
- "I was upset with lack of functionality"
- "Employee page is not very nice, it is very lackluster"
- "This is the second time I'm trying to implement this change" (re: demo credentials)
- "We haven't made sure the other things are done but we're focusing on this website is perfect but the scope is not 100% met"

**Key Quote:**
> "We can't miss these little things in the case study. We need to, we must, we must edit our website to be matching these little things in the case studies."

**User's Frustration:**
The user is clearly frustrated that:
1. Core functionality is broken (Create Order button)
2. Case study requirements aren't being followed (wrong categories, customer ordering CTAs)
3. Previous feedback not implemented (demo credentials still too small)
4. Focus on aesthetics over requirements compliance
5. Employee page remains unprofessional

---

## 🚀 ACTION ITEMS SUMMARY

**For the Development Team:**

1. **DEBUG IMMEDIATELY:** Create Order button error (P0)
2. **RESTRUCTURE:** Shop page categories to match case study (P0)
3. **REMOVE:** All customer ordering CTAs from public pages (P0)
4. **HIDE:** Login button from public navigation (P0)
5. **ENLARGE:** Demo credentials on login page (P1)
6. **REDESIGN:** Employee page to be professional (P1)
7. **REORGANIZE:** Contact page layout (P1)
8. **INTEGRATE:** Resend email notifications (P1)
9. **COMPLETE:** All 6 client reports with Recharts (P1)
10. **ADD:** Breadcrumb trail, Google Maps, alignment fixes (P2)

**Testing Required:**
- All 6 staff role dashboards
- All order creation workflows
- All 6 client reports
- Mobile responsiveness
- Email notifications
- Public tracking page
- Case study business rules enforcement

---

**Last Updated:** November 14, 2025  
**Status:** 🚨 URGENT ACTION REQUIRED  
**Deadline:** November 15, 2025 (Prefinal Draft)  
**Priority:** Address P0 and P1 items IMMEDIATELY
