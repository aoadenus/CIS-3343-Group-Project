# 🚨 ADMIN PORTAL UX/FUNCTIONALITY EMERGENCY FIXES
## CRITICAL PRIORITY - Copy & paste to Replit AI NOW

You are Replit AI. The staff admin portal has significant functionality and UX issues that are BLOCKING the project. This is the PRIMARY PRIORITY. Fix these systematically.

---

## BATCH 1: REMOVE OUT-OF-SCOPE FIELDS (HIGHEST PRIORITY)

**Orders & Custom Cake Builder:**
- Remove ALL "Occasion" field from order creation, order management, and custom cake builder
- REMOVE "Design Style" option entirely (not in case study scope)
- Cake layers: Enforce MINIMUM 2 layers (1 layer = impossible, invalid)
- Remove any cake occasion categorization

**Inventory vs Products:**
- Rename "Inventory Management" to "Products" or "Product Catalog"
- This is NOT inventory management - it's product CRUD only
- Staff should NOT handle inventory adjustments
- Verify "Standard Products" are implemented correctly per spec

**Settings naming:**
- Rename "System Configuration" to "Settings" for consistency
- Match the naming everywhere in menu and page titles

---

## BATCH 2: MENU & NAVIGATION FIXES

**Menu Label Matching:**
For EACH ROLE, ensure menu labels match actual page content:
- Sales: Menu says "Sales Dashboard" + page says "Sales Dashboard" (NOT "Business Analytics")
- Baker: Menu says "Baker Dashboard" + page says "Baker Dashboard"
- Decorator: Menu says "Decorator Dashboard" (NOT something else)
- Accountant: Menu says "Accountant Dashboard" (NOT "Business Analytics")
- Manager: Menu says "Manager Dashboard" + or "System Overview"

**Active Menu State:**
- Highlight the current page in the menu
- When viewing "Orders", highlight "Orders" in menu (not another page)
- Keep active state synchronized with actual route/page

**Add Breadcrumb Navigation:**
- Implement breadcrumb trail on ALL staff pages: Home > Dashboard > Orders > Order Details
- Allow easy back navigation without clicking menu repeatedly

**User Avatar Fix:**
- Replace generic "eb" icon with user initials (Sarah = "S", Tom = "T", Lisa = "L", etc.)
- Each staff member should have their own identifier, not everyone showing "eb"

---

## BATCH 3: DASHBOARD CONTENT & LAYOUT

**Sales Dashboard Redesign:**
- Move KPIs to TOP (not bottom) - make them prominent
- Show quick action buttons VISIBLY (Create Order, View Pending, etc.)
- Add system overview section at top
- Show Today's Pickups (5-item list)
- Show Recent Orders
- Show Pending Customer Follow-ups
- No hidden content below fold - ALL important info visible immediately

**All Dashboards:**
- Redesign to be BUSINESS-LIKE, not "cute" (no decorative elements getting in way)
- Prioritize actionable data
- Remove repetitive/generic content
- Ensure each role sees tailored info for their job

---

## BATCH 4: POPUP & MODAL UX FIXES

**Order/Customer Details Popups:**
- Optimize popup max-width/height to fit screen (not cut off, not too large)
- Add CLEAR CLOSE/CANCEL button (X icon top right, easily visible)
- Make sure popups fit on 1024px width screens
- Add overlay/backdrop so popup stands out
- Popups should be dismissable (click X, click outside, ESC key)
- Text should NOT be cut off or hard to read

---

## BATCH 5: ORDER MANAGEMENT PERMISSIONS & UI

**Sales Role Scope:**
- Sales should NOT move orders to "Pending" or "In Production"
- Sales can: Create orders, view orders, manage customers, create inquiries
- Sales CANNOT: Change order status (baker/decorator handle that)
- Verify dropdown shows only Sales-appropriate actions

**Dropdown Redesign:**
- Fix icon/text alignment - they should be LEFT ALIGNED, not split left/right
- Icons should be CLEAR and CONSISTENT
- Text should be easily readable, not far right
- Remove "weird icon on far left" - use standard UI patterns

**Order Fulfillment Board:**
- Drag-and-drop should work properly
- Orders show: Customer Name, Cake Type, Pickup Date (NOT Occasion)
- Baker/Decorator can move orders between columns
- Sales cannot change status on this board

---

## BATCH 6: INQUIRY & RUSH ORDER MANAGEMENT

**Inquiry Management Page:**
- Make sure customer inquiries are being collected from contact form
- Display inquiries in clean table/list format
- Add ability to convert inquiry to order
- If "rush orders" are in scope, add RUSH ORDER FLAG/STATUS to orders

**Verify:**
- Contact page inquiries are being saved
- Inquiry management page displays them
- Staff can manage/follow up on inquiries

---

## BATCH 7: BUSINESS INTELLIGENCE / REPORTS

**Access Control:**
- Sales user accessing Reports: Should see only "Order Summary" and "Customer List"
- Accountant accessing Reports: Should see ALL 6 reports with financial focus
- Manager accessing Reports: Should see ALL 6 reports
- Don't show same reports to everyone

**Reports UI:**
- Each report should be professional and business-focused
- Role-specific filters and data
- Clear titles matching what user expects
- Not repetitive or generic

---

## BATCH 8: ACCOUNT SWITCHING

**Add Quick Switch Feature:**
- In top right corner (with user avatar), add "Switch Account" option
- Let staff switch users without logging out
- Faster workflow for shared machines
- Maintain JWT session properly during switch

---

## IMPLEMENTATION ORDER:
1. Remove Occasion + Design Style (10 min)
2. Fix menu labels to match pages (15 min)
3. Fix user avatar display (5 min)
4. Add breadcrumb navigation (15 min)
5. Optimize popups (20 min)
6. Redesign Sales Dashboard (15 min)
7. Fix dropdown UI (10 min)
8. Verify inquiry system (10 min)
9. Check reports access control (10 min)
10. Add account switch feature (20 min)

**After each batch, test in browser. Create UX-FIX-LOG.txt documenting all fixes applied.**

This is YOUR MAIN PRIORITY. The system works but looks/feels broken. Fix the UX and it becomes usable. Go.
