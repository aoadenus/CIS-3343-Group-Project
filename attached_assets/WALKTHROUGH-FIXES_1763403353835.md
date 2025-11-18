# EMILY BAKES CAKES - POLISH & REFINEMENT IMPLEMENTATION SPEC
## Sales-Focused UI/UX Improvements from Walkthrough Audit
### Document Version: 1.0 | Date: November 17, 2025

---

## EXECUTIVE SUMMARY

This document specifies exact fixes for all 43 identified issues from the walkthrough audit. Each fix is categorized by business impact, includes specific implementation details, code examples where applicable, and prioritization for developer assignment.

**Business Context:** Sales staff spend 88% of their time creating orders and managing customers. Every UI improvement directly impacts operational efficiency and revenue velocity.

---

## SECTION 1: HOME PAGE / PUBLIC SITE

### ISSUE 1.1: Staff Login Button - Too Small & Invisible
**Priority:** CRITICAL | **Impact:** High-visibility issue for professor evaluation  
**Owner:** Frontend Lead | **Estimated Time:** 30 minutes

#### Current State
- Small, underlined gray text label (not a button)
- No visual affordance - looks like regular text link
- Blends completely into background
- Professor cannot identify it as a login entry point

#### Exact Fix
**Component Name:** `CompactStaffLoginCTA`

**Visual Specification:**
- Shape: Rounded rectangle (border-radius: 8px)
- Background: Dark pink/raspberry (`#C44569` - Emily Bakes brand color)
- Padding: `py-1.5 px-3` (compact, not button-sized)
- Text: "Staff Login" in white, font-size: 12px, weight: 600
- Icon: Phone icon (📞) or lock icon, left-aligned, 14px
- Shadow: `box-shadow: 0 2px 8px rgba(196, 69, 105, 0.25)`
- Hover State: Background darkens to `#A63D54`, shadow increases to `0 4px 12px rgba(196, 69, 105, 0.35)`

**HTML/JSX Example:**
\`\`\`jsx
<a 
  href="/admin/login"
  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C44569] text-white rounded-lg text-sm font-semibold hover:bg-[#A63D54] transition-all shadow-md hover:shadow-lg"
>
  <LockIcon size={14} />
  Staff Login
</a>
\`\`\`

**Placement:** 
- Top-right corner of header/navigation
- Not buried in footer (must be visible on initial page load)
- Positioned near contact CTA elements

**Why This Works:**
- The dark pink immediately stands out against typical webpage backgrounds
- Compact height fits naturally in header without dominating
- Clear labeling eliminates confusion
- Icon provides visual cue that this is a login action
- Soft shadow gives depth without appearing aggressive

---

### ISSUE 1.2: Staff Login Button Visibility Balance
**Priority:** CRITICAL | **Impact:** Stakeholder satisfaction

#### Current State
- Button must be hidden enough that casual visitors don't see it
- But visible enough that professor immediately understands what it is
- Current solution is completely invisible to both

#### Exact Fix
**Implementation Approach:**
This is solved by ISSUE 1.1's fix. The compact pink CTA button achieves balance because:

1. **Color Creates Natural Hierarchy:** Pink stands out from navigation but doesn't scream "HIDDEN ADMIN LOGIN"
2. **Compact Size:** Not full-width, not dominating - takes up ~120px width max
3. **Natural Placement:** Lives in header where navigation elements belong (not footer or sidebar)
4. **Label Clarity:** "Staff Login" text is explicit - no confusion about purpose

**Positioning Context:**
Typical navbar structure should be:
\`\`\`
[LOGO] [HOME] [SHOP] [GALLERY] [ABOUT] [CONTACT] [Staff Login Button] [Cart Icon]
\`\`\`

The Staff Login button sits at same hierarchy level as other account items (cart), making it discoverable but not prominent to casual browsers.

---

## SECTION 2: SALES LOGIN PAGE

### ISSUE 2.1: Demo Credentials - Gray Highlights Removal
**Priority:** HIGH | **Impact:** Visual cleanliness, reduced cognitive load  
**Owner:** Frontend Dev | **Estimated Time:** 15 minutes

#### Current State
- Gray background highlights on username cells in demo credentials table
- Creates visual noise and distracts from functionality
- Makes entire credentials section feel "placeholder-ish"

#### Exact Fix
**Implementation:**
Remove all `bg-gray-100` or background styling from demo credential username/password cells.

**Before:**
\`\`\`jsx
<td className="px-4 py-2 bg-gray-100 text-sm font-mono">demo.sales@emilyb.com</td>
\`\`\`

**After:**
\`\`\`jsx
<td className="px-4 py-2 text-sm font-mono text-gray-700">demo.sales@emilyb.com</td>
\`\`\`

**Full Credentials Table Example:**
\`\`\`jsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-gray-200">
      <th className="text-left px-4 py-2 font-semibold text-gray-700">Role</th>
      <th className="text-left px-4 py-2 font-semibold text-gray-700">Email</th>
      <th className="text-left px-4 py-2 font-semibold text-gray-700">Password</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-2 text-gray-700">Sales Manager</td>
      <td className="px-4 py-2 font-mono text-gray-600">demo.sales@emilyb.com</td>
      <td className="px-4 py-2 font-mono text-gray-600">password123</td>
    </tr>
  </tbody>
</table>
\`\`\`

**Why This Works:**
- Cleaner visual appearance
- Removes "temporary" feeling from credentials
- Maintains readability with hover states instead
- Hover state (`hover:bg-gray-50`) provides subtle interaction feedback

---

### ISSUE 2.2: Reduce Scrolling - Full Login Page Visibility
**Priority:** HIGH | **Impact:** User friction reduction  
**Owner:** Frontend Dev | **Estimated Time:** 45 minutes

#### Current State
- Login form requires vertical scrolling to see all content
- Demo credentials table extends below fold
- User must scroll to understand available demo accounts

#### Exact Fix
**Layout Restructuring:**

**Current Layout (Vertical Stack):**
\`\`\`
[Header]
[Login Form]
[Long Demo Credentials Table - REQUIRES SCROLL]
\`\`\`

**New Layout (Two-Column Grid):**
\`\`\`
┌─────────────────────────────────────┐
│         LOGIN PAGE HEADER           │
├────────────────┬────────────────────┤
│                │                    │
│  LOGIN FORM    │  DEMO CREDENTIALS  │
│  (Compact)     │  (Condensed Table) │
│                │                    │
└────────────────┴────────────────────┘
\`\`\`

**Implementation Code:**
\`\`\`jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8">
  {/* Left Column: Login Form */}
  <div className="flex flex-col justify-center">
    <h1 className="text-3xl font-bold mb-6">Staff Portal Login</h1>
    <LoginForm />
  </div>
  
  {/* Right Column: Demo Credentials */}
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-lg font-semibold mb-4">Demo Accounts</h2>
    <CredentialsTable compact={true} />
  </div>
</div>
\`\`\`

**Tablet/Mobile Breakpoint:**
- On screens < 768px: Stack vertically (collapse back to 1 column)
- Credentials remain accessible but not blocking login flow

**Container Constraints:**
\`\`\`css
.login-container {
  max-width: 1200px;
  min-height: 100vh; /* Full viewport height, no scroll needed */
  display: flex;
  align-items: center;
}
\`\`\`

**Why This Works:**
- Both login form and credentials visible without scrolling
- Side-by-side layout leverages modern widescreen displays
- Credentials serve as reference without blocking primary task
- Mobile experience degrades gracefully

---

### ISSUE 2.3: Hide Demo Credentials Behind Toggle
**Priority:** HIGH | **Impact:** Reduces login page cognitive load  
**Owner:** Frontend Dev | **Estimated Time:** 45 minutes

#### Current State
- Demo credentials always visible
- Takes up 40% of login page real estate
- Non-staff visitors see all demo passwords (security concern)
- Creates "placeholder" feeling

#### Exact Fix
**Component:** `CredentialsToggle`

**Implementation:**
\`\`\`jsx
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function CredentialsToggle() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-blue-100 rounded transition-colors"
      >
        <span className="font-semibold text-blue-900">
          Demo Account Credentials
        </span>
        <ChevronDown 
          size={18} 
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <DemoCredentialsTable />
          <p className="text-xs text-gray-500 mt-4">
            💡 Tip: Click on any row to copy credentials
          </p>
        </div>
      )}
    </div>
  );
}
\`\`\`

**Behavior:**
- Collapsed by default (not shown on initial page load)
- User clicks chevron to expand
- Smooth animation on expand/collapse
- All 6 demo accounts shown in collapsed state message: "Show 6 demo accounts"

**Placement:**
- Below login form in single-column view
- Right column in two-column view (can be collapsed there too)

**Why This Works:**
- Dramatically reduces page height (no scroll needed)
- Credentials available for those who need them
- Reduces security concern of exposing passwords on public page
- "Show" vs "Hide" state provides affordance that it's interactive

---

### ISSUE 2.4: "Back to Site" Link - Visual Emphasis
**Priority:** MEDIUM | **Impact:** Navigation clarity  
**Owner:** Frontend Dev | **Estimated Time:** 20 minutes

#### Current State
- "Back to site" link is faint/gray
- Low visual priority
- Staff might miss it when they need to leave login page

#### Exact Fix
**Before:**
\`\`\`jsx
<a href="/" className="text-gray-400 hover:text-gray-600 text-sm">
  ← Back to site
</a>
\`\`\`

**After:**
\`\`\`jsx
<a 
  href="/" 
  className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 hover:underline transition-colors"
>
  ← Back to site
</a>
\`\`\`

**Key Changes:**
- Font weight increased to `font-medium` (from default weight)
- Text color changed to `text-gray-700` (from `text-gray-400`)
- Added underline on hover for clear interaction feedback
- Added explicit gap between icon and text

**Placement:** Top-right of login page, aligned with other account actions

**Why This Works:**
- No longer appears "disabled" or irrelevant
- Medium weight gives it proper visual hierarchy
- Darker color ensures readability against various backgrounds

---

### ISSUE 2.5: "Back to Site" Link - Hover Dropdown Menu
**Priority:** MEDIUM-HIGH | **Impact:** Workflow efficiency (staff confusion reduction)  
**Owner:** Frontend Dev + UX | **Estimated Time:** 60 minutes

#### Current State
- "Back to site" link is simple navigation
- Staff might want to logout instead of just leaving
- No context menu for account-related actions

#### Exact Fix
**Component:** `AccountActionDropdown`

**Implementation:**
\`\`\`jsx
import { ChevronDown, LogOut, Repeat2 } from 'lucide-react';
import { useState } from 'react';

export function AccountActionDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useAuth().user; // Assume auth hook exists
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <span>← Back</span>
        <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header with current user */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500">Logged in as:</p>
            <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.email}</p>
          </div>
          
          {/* Actions */}
          <div className="py-2">
            {/* Back to public site */}
            <a
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Back to Public Site</span>
            </a>
            
            {/* Switch accounts */}
            <button
              onClick={handleSwitchAccounts}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <Repeat2 size={16} />
              <span>Switch Account</span>
            </button>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

**Dropdown Menu Structure:**
\`\`\`
┌─────────────────────────┐
│ Logged in as:           │
│ Sarah Chen              │ ← Current user name
│ sarah@emilyb.com        │ ← Current user email
├─────────────────────────┤
│ ← Back to Public Site    │
│ 🔄 Switch Account       │
│ 🚪 Log Out              │ ← Red text
└─────────────────────────┘
\`\`\`

**Behavior:**
- Appears on hover or click of "Back" button
- Shows current logged-in user info
- Three actions:
  1. Back to Public Site - Navigate to home page
  2. Switch Account - Go back to login (clear current session context)
  3. Log Out - Clear session and redirect to login with logout message
- Closes when user hovers away or selects action

**Why This Works:**
- Addresses common staff confusion: "Do I go back to home or logout?"
- Provides immediate context (who am I logged in as?)
- Offers both options (stay on site or switch users)
- Prevents wasted time searching for logout button

---

### ISSUE 2.6: Sign-In Button Loading State Text
**Priority:** MEDIUM | **Impact:** Clarity during slow network conditions  
**Owner:** Frontend Dev | **Estimated Time:** 25 minutes

#### Current State
- Sign-in button text remains "Sign in" during authentication
- No visual feedback that request is processing
- User might click multiple times if network is slow

#### Exact Fix
**Component:** `SignInButton`

**Implementation:**
\`\`\`jsx
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function SignInButton({ isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full py-2 px-4 bg-[#C44569] text-white font-semibold rounded-lg hover:bg-[#A63D54] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <span>Sign in</span>
      )}
    </button>
  );
}

// Usage in form:
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await loginUser(formData);
      // Success handling
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <SignInButton isLoading={isLoading} onClick={handleSubmit} />
    </form>
  );
}
\`\`\`

**Visual States:**
| State | Display | Icon | Disabled |
|-------|---------|------|----------|
| Idle | "Sign in" | None | No |
| Loading | "Signing in..." | Spinner | Yes |
| Error | "Try again" | ⚠️ (optional) | No |

**Why This Works:**
- Spinner + text combination is universally understood as "loading"
- Button becomes disabled to prevent double-submissions
- User receives clear feedback that their action is being processed
- No confusion about whether server is responding

---

### ISSUE 2.7: Demo Credentials Visibility - Overall Reduction
**Priority:** MEDIUM | **Impact:** Security + UX polish  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes (combined with ISSUE 2.3)

#### Current State
- Demo credentials take up excessive page real estate
- Always visible to casual visitors
- Creates security concern (passwords on public page)
- Makes login page feel cluttered

#### Exact Fix
**Combined Solution:**
This is addressed by combining ISSUE 2.2 (two-column layout) + ISSUE 2.3 (toggle collapse):

**Final Result:**
1. On desktop (> 768px): Login form on left, collapsible credentials panel on right
2. Credentials collapsed by default
3. On mobile (< 768px): Stack vertically, credentials always collapsed
4. Approx. page height: 450px (no scroll needed)

**Implementation Checklist:**
- ✅ Use toggle from ISSUE 2.3
- ✅ Use two-column grid from ISSUE 2.2
- ✅ Set initial state: `collapsed`
- ✅ Mobile: `display: none` for credentials column on mobile, shown in collapsed menu
- ✅ Add visual hint: "ℹ️ Demo accounts available on the right" (desktop only)

---

## SECTION 3: SALES DASHBOARD - GENERAL LAYOUT

### ISSUE 3.1: Too Much Positive Space
**Priority:** HIGH | **Impact:** Information density, cognitive clarity  
**Owner:** Frontend Lead | **Estimated Time:** 90 minutes

#### Current State
- Dashboard has excessive whitespace
- Information scattered across page
- Requires vertical scrolling to see critical data
- Feels empty/incomplete

#### Exact Fix
**Container Restructuring:**

**Before (Current - Spacing Too Generous):**
\`\`\`
[Header: 80px]
[Vertical Gap: 40px]
[KPI Cards: 120px (4 cards in row)]
[Vertical Gap: 40px]
[Quick Actions: 60px]
[Vertical Gap: 40px]
[Recent Orders: variable]
\`\`\`

**After (Optimized - Compact but Organized):**
\`\`\`
[Header: 80px]
[Vertical Gap: 24px] ← Reduced from 40px
[KPI Cards: 100px (compact styling)]
[Vertical Gap: 20px] ← Reduced from 40px
[Quick Actions: 50px] ← Compact horizontal bar
[Vertical Gap: 20px] ← Reduced from 40px
[Recent Orders: variable] ← Now fits above fold
\`\`\`

**Implementation Code:**
\`\`\`jsx
export function SalesDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - 80px */}
      <DashboardHeader />
      
      {/* Main content grid - reduce spacing */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Gap: 24px (was 40px) */}
        
        {/* KPI Cards Section - Compact Version */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart3 size={18} />
            Today's Metrics
          </h2>
          <KPICardsCompact /> {/* Reduced from 120px to 100px height */}
        </section>
        
        {/* Gap: 20px (was 40px) */}
        
        {/* Quick Actions - Top Priority */}
        <section className="mb-6">
          <QuickActionsBar /> {/* New compact horizontal layout */}
        </section>
        
        {/* Gap: 20px (was 40px) */}
        
        {/* Recent Orders/Pickups */}
        <section>
          <RecentOrdersSection />
        </section>
      </div>
      
      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
\`\`\`

**Spacing Variable Changes:**
\`\`\`css
/* Update Tailwind spacing in components */
:root {
  --section-gap: 1.5rem; /* Was 2.5rem (40px), now 24px */
  --card-gap: 1rem; /* Was 1.5rem (24px), now 16px */
  --vertical-padding: 0.75rem; /* Card internal padding */
}
\`\`\`

**Card Width Optimization:**
\`\`\`jsx
// Previous: card took full width of container (too wide)
// New: max-width constraint to prevent excessive whitespace
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
  {/* Cards now constrained and more compact */}
</div>
\`\`\`

**Why This Works:**
- Reduces scrolling (critical information above fold)
- Information feels organized, not scattered
- Maintains breathing room (not cramped)
- Scan order improves (less vertical distance between sections)

---

### ISSUE 3.2: Sidebar - Always Open (Not Collapsible)
**Priority:** HIGH | **Impact:** Navigation efficiency  
**Owner:** Frontend Dev | **Estimated Time:** 60 minutes

#### Current State
- Navigation sidebar is collapsible
- Staff must click to expand/collapse
- Creates friction for quick navigation between sections
- On mobile: sidebar slides in/out (covers content)

#### Exact Fix
**Navigation Architecture:**

**Desktop (> 1024px):**
- Sidebar: Always visible, fixed width 200px
- Content area: Adjusts right with `margin-left: 200px`
- No collapse button
- Sidebar sticky to viewport (scrolls with page)

**Tablet (768px - 1024px):**
- Sidebar: Always visible, reduced width 160px
- Adjusted spacing but still visible

**Mobile (< 768px):**
- Sidebar: Not visible by default
- Hamburger menu shows sidebar in overlay/drawer
- Sidebar has explicit close button
- Clicking page content closes sidebar

**Implementation Code:**
\`\`\`jsx
export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="flex">
      {/* Sidebar - Desktop & Tablet always visible */}
      <aside className={`
        ${isMobile ? 'hidden' : 'block'} 
        w-48 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto
      `}>
        <SalesNavigation />
      </aside>
      
      {/* Mobile Overlay Drawer */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-screen w-48 bg-white shadow-lg z-50">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <SalesNavigation />
          </aside>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {/* Header with hamburger on mobile */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          {isMobile && (
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
          )}
          <DashboardHeader />
        </div>
        
        {/* Dashboard Content */}
        <div className="p-6">
          <SalesContent />
        </div>
      </main>
    </div>
  );
}
\`\`\`

**Sidebar Navigation Structure:**
\`\`\`jsx
export function SalesNavigation() {
  return (
    <nav className="p-4 space-y-2">
      <NavLink href="/admin/dashboard" icon={<LayoutDashboard />}>
        Dashboard
      </NavLink>
      
      <NavLink href="/admin/order-create" icon={<Plus />}>
        Create Order
      </NavLink>
      
      <NavLink href="/admin/order-management" icon={<List />}>
        All Orders
      </NavLink>
      
      <NavLink href="/admin/customer-accounts" icon={<Users />}>
        Customers
      </NavLink>
      
      <NavLink href="/admin/fulfillment-board" icon={<KanbanSquare />}>
        Fulfillment
      </NavLink>
      
      <NavLink href="/admin/business-intelligence" icon={<BarChart3 />}>
        Reports
      </NavLink>
    </nav>
  );
}
\`\`\`

**Why This Works:**
- Desktop staff never lose navigation context
- No friction for switching between pages
- Consistent experience (always know where you are)
- Mobile gets appropriate drawer UX (doesn't take up screen)

---

### ISSUE 3.3: "Create Order" Button - Consistent Accessibility
**Priority:** HIGH | **Impact:** Workflow speed (sales staff primary action)  
**Owner:** Frontend Dev | **Estimated Time:** 40 minutes

#### Current State
- "Create Order" button only in header
- Not visible when scrolling to bottom of page
- Staff must scroll back up to create new order
- Friction in workflow

#### Exact Fix
**Placement - Two Locations:**

**1. Header CTA (Always Visible at Top):**
\`\`\`jsx
<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <DashboardTitle />
    
    {/* Create Order Button - Primary Position */}
    <a
      href="/admin/order-create"
      className="flex items-center gap-2 px-4 py-2 bg-[#C44569] text-white font-semibold rounded-lg hover:bg-[#A63D54] shadow-md hover:shadow-lg transition-all"
    >
      <Plus size={18} />
      Create Order
    </a>
  </div>
</header>
\`\`\`

**2. Footer CTA (Always Visible at Bottom):**
\`\`\`jsx
<footer className="bg-white border-t border-gray-200 mt-12 py-6">
  <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
    <DashboardFooterInfo />
    
    {/* Create Order Button - Secondary Position (Sticky) */}
    <a
      href="/admin/order-create"
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#C44569] text-white font-semibold rounded-lg hover:bg-[#A63D54] transition-all"
    >
      <Plus size={18} />
      Create Order
    </a>
  </div>
</footer>
\`\`\`

**Alternative: Floating Action Button (More Modern):**
\`\`\`jsx
export function FloatingCreateOrderButton() {
  return (
    <a
      href="/admin/order-create"
      className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-[#C44569] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40"
      title="Create a new order"
    >
      <Plus size={20} />
      <span className="hidden sm:inline">Create Order</span>
    </a>
  );
}
\`\`\`

**Implementation Choice:**
- **Header + Footer approach:** Traditional, discoverable, works with all devices
- **Floating Button approach:** Modern, always accessible, persistent on screen

**Recommendation:** Use Header + Footer (traditional discovery) + Floating Button (modern convenience)

**Why This Works:**
- Staff never need to scroll up to create new order
- Multiple access points reduce cognitive friction
- Pink color matches global CTA styling
- Familiar interaction pattern

---

### ISSUE 3.4: Bakery Personality - Subtle Pattern in Title Area
**Priority:** MEDIUM | **Impact:** Brand consistency, visual appeal  
**Owner:** Design Lead | **Estimated Time:** 45 minutes

#### Current State
- Dashboard header generic and corporate
- No Emily Bakes Cakes brand personality
- Looks like any SaaS admin panel

#### Exact Fix
**Component:** `BrandedDashboardHeader` with subtle background pattern

**Visual Specification:**
- Background pattern: Subtle repeating bakery icons (rolling pins, whisk, cake slice)
- Opacity: 3-5% (very faint, not distracting)
- Pattern size: Small (20px-30px repeats)
- Icons: Rotated at slight angles for playful feel
- Color: Very light gray (#F8F8F8) or subtle pink tint (#FFF5F5)

**SVG Pattern Implementation:**
\`\`\`jsx
export function BakeryPattern() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ opacity: 0.03 }}>
      {/* Rolling Pin */}
      <g transform="translate(20, 20) rotate(-15)">
        <rect x="0" y="8" width="60" height="8" fill="#333" rx="4" />
        <circle cx="8" cy="12" r="6" fill="#333" />
        <circle cx="52" cy="12" r="6" fill="#333" />
      </g>
      
      {/* Whisk */}
      <g transform="translate(120, 40) rotate(25)">
        <path d="M 0 0 Q 8 15 0 30" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M 6 3 Q 10 15 6 27" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M -6 3 Q -2 15 -6 27" stroke="#333" strokeWidth="2" fill="none" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#333" strokeWidth="2" />
      </g>
      
      {/* Cake Slice */}
      <g transform="translate(50, 120) rotate(-35)">
        <path d="M 0 0 L 20 15 L 20 45 L 0 30 Z" fill="#333" />
        <line x1="0" y1="10" x2="20" y2="25" stroke="#FFF" strokeWidth="1" />
        <line x1="0" y1="20" x2="20" y2="35" stroke="#FFF" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function DashboardHeader() {
  return (
    <div className="relative bg-gradient-to-r from-[#F8F8F8] to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <BakeryPattern />
        {/* Repeated pattern fills the header */}
        <style>{`
          svg { 
            position: absolute;
            width: 200px;
            height: 200px;
            repeat: space;
          }
        `}</style>
      </div>
      
      {/* Content (z-index to appear above pattern) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="font-semibold text-gray-900">{staffName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
\`\`\`

**CSS Approach (Simpler Alternative):**
\`\`\`css
.dashboard-header {
  background: linear-gradient(135deg, #F8F8F8 0%, #FFFFFF 100%);
  background-image: 
    url("data:image/svg+xml,%3Csvg width='40' height='40'...%3E"),
    linear-gradient(135deg, #F8F8F8 0%, #FFFFFF 100%);
  background-size: 40px 40px, 100% 100%;
  opacity: 0.05;
  position: relative;
}
\`\`\`

**Why This Works:**
- Very subtle (3-5% opacity doesn't distract)
- Adds visual warmth and personality
- Feels intentional, not accidental
- Bakery icons reinforce brand identity

---

## SECTION 4: SALES DASHBOARD - HEADER ENHANCEMENTS

### ISSUE 4.1: Generic Header - Overall Customization
**Priority:** HIGH | **Impact:** Professional appearance, brand identity  
**Owner:** Frontend Dev | **Estimated Time:** 60 minutes

#### Current State
- Header is bare/minimal
- No visual hierarchy
- No branding elements
- Feels incomplete

#### Exact Fix
**Complete Header Component:**

\`\`\`jsx
export function EnhancedDashboardHeader() {
  const currentUser = useAuth().user;
  const currentDate = new Date();
  const dashboardMetrics = useDashboardMetrics(); // Hook to fetch real-time data
  
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Row: Logo + Title + Actions */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            {/* Emily Bakes Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#C44569] to-[#8B2E4F] rounded-full flex items-center justify-center">
              <Cake size={20} className="text-white" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sales Dashboard</h1>
              <p className="text-xs text-gray-500">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          {/* Right: Staff Info + Actions */}
          <div className="flex items-center gap-6">
            {/* Notifications Badge */}
            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                {dashboardMetrics.pendingApprovals > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {dashboardMetrics.pendingApprovals}
                  </span>
                )}
              </button>
            </div>
            
            {/* Staff Name + Avatar */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser.name.charAt(0)}
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Bottom Row: Urgency Indicators + Quick Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Left: Urgency Indicators */}
          <div className="flex items-center gap-4">
            {/* Overdue Orders */}
            {dashboardMetrics.overdueOrders > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {dashboardMetrics.overdueOrders} overdue
                </span>
              </div>
            )}
            
            {/* Pending Deposits */}
            {dashboardMetrics.pendingDeposits > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  {dashboardMetrics.pendingDeposits} awaiting deposits
                </span>
              </div>
            )}
            
            {/* Quick Jump to Today's Pickups */}
            {dashboardMetrics.pickupsToday > 0 && (
              <button 
                onClick={() => scrollToSection('todays-pickups')}
                className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Jump to {dashboardMetrics.pickupsToday} pickups
                </span>
              </button>
            )}
          </div>
          
          {/* Right: Last Update */}
          <div className="text-xs text-gray-500">
            Last updated: {dashboardMetrics.lastUpdated}
          </div>
        </div>
      </div>
    </header>
  );
}
\`\`\`

**Visual Layout:**
\`\`\`
┌────────────────────────────────────────────────────────┐
│ [Logo] Sales Dashboard          Staff Name             │
│        Mon, Nov 17, 2024        Sarah Chen  [logout]   │
├────────────────────────────────────────────────────────┤
│ 🔴 3 overdue  ⏰ 5 pending deposits  ✅ Jump to 8 pickups │
└────────────────────────────────────────────────────────┘
\`\`\`

**Key Elements:**
- Logo (Emily Bakes circular badge)
- Clear title with date
- Notification badge for pending approvals
- Staff name + avatar + role
- Urgency indicators (overdue, pending deposits)
- Quick jump to pickups
- Last update timestamp

**Why This Works:**
- All critical information visible at once
- Color coding for urgency (red=overdue, yellow=pending, green=action)
- Professional appearance with personality
- Clear staff identity + logout action

---

### ISSUE 4.2: Add Logo to Header
**Priority:** MEDIUM | **Impact:** Brand identity  
**Owner:** Design Lead | **Estimated Time:** 20 minutes

#### Current State
- Header has no Emily Bakes Cakes branding
- Generic and corporate

#### Exact Fix
**Logo Component:**

\`\`\`jsx
export function EmilyBakesLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Badge */}
      <div className="relative w-10 h-10">
        {/* Circular background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C44569] to-[#8B2E4F] rounded-full shadow-md" />
        
        {/* Cake icon inside */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Cake size={22} className="text-white" />
        </div>
      </div>
      
      {/* Text Brand */}
      <div>
        <div className="text-xs font-semibold text-[#C44569]">EMILY</div>
        <div className="text-xs font-bold text-gray-900">BAKES CAKES</div>
      </div>
    </div>
  );
}
\`\`\`

**Styling Details:**
- Size: 10x10 (px) circular badge
- Gradient: Pink (#C44569) → Dark maroon (#8B2E4F)
- Icon: Cake icon (Lucide React)
- Text: "EMILY BAKES CAKES" stacked vertically
- Font: Bold sans-serif
- Shadow: Subtle drop shadow

**Why This Works:**
- Immediately identifies the system
- Playful emoji-like badge feels friendly
- Scalable for use in multiple places (header, sidebar, favicon)

---

### ISSUE 4.3: Add Staff Name to Header
**Priority:** HIGH | **Impact:** Personal connection, context awareness  
**Owner:** Frontend Dev | **Estimated Time:** 15 minutes (included in 4.1)

#### Current State
- No indication who is logged in
- Staff must go to account settings to verify

#### Exact Fix
**Component (Already included in Issue 4.1):**

\`\`\`jsx
<div className="text-right">
  <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
  <p className="text-xs text-gray-500">{currentUser.role}</p>
</div>

<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
  {currentUser.name.charAt(0)}
</div>
\`\`\`

**Position:** Top-right of header, next to logout button

---

### ISSUE 4.4: Add Current Date to Header
**Priority:** MEDIUM | **Impact:** Time context, relevance  
**Owner:** Frontend Dev | **Estimated Time:** 10 minutes

#### Current State
- Users don't see what date the dashboard is showing
- Can be confusing for multi-day operations

#### Exact Fix
**Implementation (Already in Issue 4.1):**

\`\`\`jsx
<p className="text-xs text-gray-500">
  {new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })}
</p>
\`\`\`

**Output Example:**
- "Monday, Nov 17, 2024"
- "Tuesday, Nov 18, 2024"

**Position:** Under main dashboard title

---

### ISSUE 4.5: Urgency/Pickup Indicator - Overdue Orders
**Priority:** CRITICAL | **Impact:** Critical business indicator  
**Owner:** Frontend Dev | **Estimated Time:** 45 minutes

#### Current State
- No indication of overdue orders
- Staff might miss urgent orders
- No visual urgency on dashboard

#### Exact Fix
**Component:** `UrgencyIndicator`

\`\`\`jsx
export function OverdueOrdersIndicator() {
  const { overdueOrders } = useDashboardMetrics();
  
  if (!overdueOrders || overdueOrders.length === 0) {
    return null; // Don't show if no overdue orders
  }
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-l-4 border-red-600 rounded">
      <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-900">
          {overdueOrders.length} Order{overdueOrders.length > 1 ? 's' : ''} Overdue
        </p>
        <p className="text-xs text-red-700 mt-0.5">
          {overdueOrders[0].customerName} + {overdueOrders.length - 1} more
        </p>
      </div>
      <button
        onClick={() => scrollToSection('recent-orders')}
        className="text-xs font-medium text-red-600 hover:text-red-800 whitespace-nowrap ml-2"
      >
        View
      </button>
    </div>
  );
}
\`\`\`

**Definition of "Overdue":**
- Pickup date/time < current date/time
- Status is NOT "Picked Up"
- Visible indicator in header AND in recent orders cards

**Logic:**
\`\`\`javascript
const isOverdue = (order) => {
  const pickupTime = new Date(order.pickupDateTime);
  const now = new Date();
  return pickupTime < now && order.status !== 'PICKED_UP';
};
\`\`\`

---

### ISSUE 4.6: Quick Jump Button - Pickups Within Today
**Priority:** HIGH | **Impact:** Navigation efficiency  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes

#### Current State
- No quick access to today's pickups
- Staff must scroll down to see pickup section
- Friction in workflow

#### Exact Fix
**Component:** `PickupsQuickJump` (included in Issue 4.1)

\`\`\`jsx
export function PickupsQuickJump() {
  const { pickupsToday } = useDashboardMetrics();
  
  if (!pickupsToday || pickupsToday.length === 0) {
    return null;
  }
  
  const handleJump = () => {
    const element = document.getElementById('todays-pickups-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <button
      onClick={handleJump}
      className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
    >
      <CheckCircle size={18} className="text-green-600" />
      <span className="text-sm font-medium text-green-700">
        {pickupsToday.length} Ready for Pickup Today
      </span>
      <ChevronDown size={16} className="text-green-600" />
    </button>
  );
}
\`\`\`

**Behavior:**
- Shows number of ready pickups
- Click scrolls to pickup section smoothly
- Only shows if pickups exist today
- Green color (indicates positive/ready status)

---

### ISSUE 4.7: Pending Notifications Badge - Approvals Count
**Priority:** HIGH | **Impact:** Task visibility, workflow clarity  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes

#### Current State
- No indication of pending approvals
- Staff don't know what needs attention
- Approvals might be missed

#### Exact Fix
**Component:** `ApprovalsBadge`

\`\`\`jsx
export function PendingApprovalsNotification() {
  const { pendingApprovals } = useDashboardMetrics();
  
  return (
    <div className="relative">
      <button 
        onClick={handleOpenApprovals}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title={`${pendingApprovals} items awaiting approval`}
      >
        <Bell size={20} />
        
        {/* Badge */}
        {pendingApprovals > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
            {pendingApprovals > 99 ? '99+' : pendingApprovals}
          </span>
        )}
      </button>
      
      {/* Optional: Dropdown menu */}
      {showApprovals && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Pending Approvals ({pendingApprovals})</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {pendingApprovals.map(item => (
              <PendingApprovalItem key={item.id} approval={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
\`\`\`

**Badge Styling:**
- Red background (indicates action needed)
- White text (high contrast)
- Circular badge positioned top-right of bell icon
- Shows count (or "99+" if over 99)
- Grows slightly on hover to indicate clickability

**What Needs Approval:**
- Large order modifications
- Rush order requests
- High-value orders (> $500)
- Refund requests
- Special requests

---

### ISSUE 4.8: Customize Logout Button
**Priority:** MEDIUM | **Impact:** Clarity, accessibility  
**Owner:** Frontend Dev | **Estimated Time:** 20 minutes

#### Current State
- Logout button is generic or missing
- Unclear how to logout
- May require digging through menus

#### Exact Fix
**Component:** `LogoutButton`

\`\`\`jsx
export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    // Show confirmation
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) return;
    
    try {
      // Clear auth token
      await logout();
      
      // Redirect to login with message
      router.push('/admin/login?message=logged-out-successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Log out of your account"
    >
      <LogOut size={18} />
      <span className="text-sm font-medium">Logout</span>
    </button>
  );
}
\`\`\`

**Placement:** Top-right of header, after staff name/avatar

**UX Details:**
- Uses `LogOut` icon (universally recognized)
- Red color indicates "exit/close"
- Confirmation dialog prevents accidental logouts
- Accessible text label ("Logout")
- Tooltip on hover

---

## SECTION 5: SALES DASHBOARD - KPI CARDS

### ISSUE 5.1: Generic KPI Cards - Not Sales-Focused
**Priority:** CRITICAL | **Impact:** Decision-making clarity, business metrics  
**Owner:** Frontend Dev + Product | **Estimated Time:** 90 minutes

#### Current State
- KPI cards are generic/placeholder
- Don't reflect sales team priorities
- Current 4 cards don't drive behavior
- Text is vague

#### Exact Fix
**New KPI Card Configuration:**

**Exact Cards to Display (in this order):**

| # | Metric | Current Value | Target | Icon | Color | Click Action |
|---|--------|---|---|---|---|---|
| 1 | **Today's Revenue** | $1,240 | $2,000 | 💰 | Green | Filter orders to show revenue breakdown by product |
| 2 | **Pending Deposits** | $1,850 | $0 | ⚠️ | Yellow | Show orders awaiting payment |
| 3 | **Ready for Pickup** | 8 | — | ✅ | Blue | Jump to pickup section |
| 4 | **Overdue Orders** | 2 | 0 | 🔴 | Red | Filter orders showing only overdue |

**NOT included anymore:**
- "Total Orders This Week" (not actionable)
- Generic "Pending Orders" (replaced with Pending Deposits which is more specific)

**KPI Card Component:**

\`\`\`jsx
export function KPICard({ 
  icon: Icon, 
  title, 
  value, 
  target, 
  unit,
  color, 
  onClick,
  trend 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg p-4 text-left
        border-l-4 cursor-pointer
        transition-all hover:shadow-md
        ${color === 'green' ? 'bg-green-50 border-green-500' : ''}
        ${color === 'yellow' ? 'bg-yellow-50 border-yellow-500' : ''}
        ${color === 'blue' ? 'bg-blue-50 border-blue-500' : ''}
        ${color === 'red' ? 'bg-red-50 border-red-500' : ''}
      `}
    >
      {/* Icon Background */}
      <div className="absolute top-0 right-0 opacity-5 transform scale-150 translate-x-4 -translate-y-4">
        <Icon size={48} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</p>
        
        <div className="mt-2 flex items-baseline gap-2">
          <p className={`text-2xl font-bold ${
            color === 'green' ? 'text-green-900' :
            color === 'yellow' ? 'text-yellow-900' :
            color === 'blue' ? 'text-blue-900' :
            'text-red-900'
          }`}>
            {value}
          </p>
          <p className="text-sm text-gray-600">{unit}</p>
        </div>
        
        {/* Target or Trend */}
        <div className="mt-3 pt-3 border-t border-gray-200 border-opacity-50">
          {target !== undefined ? (
            <p className="text-xs text-gray-600">
              Target: <span className="font-semibold">{target}{unit}</span>
            </p>
          ) : (
            trend && <p className="text-xs text-gray-600">{trend}</p>
          )}
        </div>
      </div>
    </button>
  );
}

export function KPICardsGrid() {
  const metrics = useDashboardMetrics();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue Today */}
      <KPICard
        icon={TrendingUp}
        title="Today's Revenue"
        value={`$${metrics.todayRevenue}`}
        target={`$${metrics.revenueTarget}`}
        unit=""
        color="green"
        onClick={() => filterByRevenue()}
      />
      
      {/* Pending Deposits */}
      <KPICard
        icon={AlertCircle}
        title="Pending Deposits"
        value={`$${metrics.pendingDeposits}`}
        target="$0"
        unit=""
        color="yellow"
        onClick={() => filterByPaymentStatus('pending')}
      />
      
      {/* Ready for Pickup */}
      <KPICard
        icon={CheckCircle}
        title="Ready Today"
        value={metrics.pickupsReady}
        unit="orders"
        color="blue"
        onClick={() => scrollToPickups()}
      />
      
      {/* Overdue Orders */}
      <KPICard
        icon={AlertTriangle}
        title="Overdue Orders"
        value={metrics.overdueCount}
        target={0}
        unit="orders"
        color="red"
        onClick={() => filterByStatus('overdue')}
      />
    </div>
  );
}
\`\`\`

**Visual Layout:**
\`\`\`
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 💰 Today's   │ ⚠️  Pending  │ ✅ Ready     │ 🔴 Overdue   │
│ Revenue      │ Deposits     │ for Pickup   │ Orders       │
│              │              │              │              │
│ $1,240       │ $1,850       │ 8            │ 2            │
│ Target:$2000 │ Target: $0   │              │ Target: 0    │
└──────────────┴──────────────┴──────────────┴──────────────┘
\`\`\`

**Why This Works:**
- Each KPI directly impacts sales (revenue, cash flow, pickup workflow)
- Color coding creates instant visual hierarchy (red=urgency, green=success)
- Clickable cards enable quick filtering/jumping
- Metrics tie to staff actions (deposit collection, pickup management)

---

### ISSUE 5.2: KPI Cards Take Up Too Much Space
**Priority:** MEDIUM | **Impact:** Page layout efficiency  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes

#### Current State
- KPI cards are oversized
- Take up excessive vertical space
- Requires scrolling to see recent orders

#### Exact Fix
**Compact KPI Styling:**

**Before (Current - Too Large):**
\`\`\`
Height per card: 160px
Total 4 cards: 160px height + 24px gaps = ~184px
\`\`\`

**After (Optimized - Compact):**
\`\`\`
Height per card: 120px
Total 4 cards: 120px height + 16px gaps = ~156px
Reduction: ~28px saved
\`\`\`

**CSS Changes:**
\`\`\`jsx
// Before
<div className="p-8"> {/* Large padding */}
  <p className="text-4xl font-bold"> {/* Large font */}

// After
<div className="p-4"> {/* Reduced padding */}
  <p className="text-2xl font-bold"> {/* Smaller font */}
\`\`\`

**Implementation:**
\`\`\`jsx
export function KPICard({ ... }) {
  return (
    <button className="rounded-lg p-4 text-left border-l-4 cursor-pointer transition-all hover:shadow-md">
      <div className="relative z-10">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</p>
        
        {/* Reduced spacing */}
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-gray-600">{unit}</p>
        </div>
        
        {/* Minimal target display */}
        <p className="mt-2 text-xs text-gray-600">Target: {target}</p>
      </div>
    </button>
  );
}
\`\`\`

**Grid Layout Optimization:**
\`\`\`jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"> {/* Was gap-4 */}
  {/* KPI Cards */}
</div>
\`\`\`

**Result:**
- Cards still visible and readable
- But more compact overall
- Reduces scrolling requirement
- Recent orders section now visible above fold

---

### ISSUE 5.3: Existing KPI Metrics Don't Reflect Sales Priorities
**Priority:** CRITICAL | **Impact:** Business alignment  
**Owner:** Product Manager | **Estimated Time:** 60 minutes

#### Current State
- Current cards: "Today's Pickups", "Pending Orders This Week", "Total Orders", other generic
- Don't reflect actual sales workflow
- Missing critical business metrics

#### Exact Fix
**Card Replacement Plan:**

**REMOVE These Cards:**
- ❌ "Total Orders" (not actionable)
- ❌ "Pending Orders This Week" (too vague)
- ❌ Any "placeholder" cards

**ADD These Cards (Already in Issue 5.1):**
- ✅ "Today's Revenue" (Drives sales motivation)
- ✅ "Pending Deposits" (Critical cash flow metric)
- ✅ "Ready for Pickup" (Workflow enabler)
- ✅ "Overdue Orders" (Urgency indicator)

**Rationale:**
- **Revenue:** Sales staff are motivated by revenue targets
- **Deposits:** Cash flow is critical for business sustainability
- **Pickups:** Most time-sensitive daily task
- **Overdue:** Immediate action required

**How These Changed:**

| Old Card | Why Removed | New Card | Why Added |
|----------|-----------|----------|-----------|
| Total Orders | Not actionable; doesn't drive behavior | Today's Revenue | Directly motivates sales staff |
| Pending Orders Week | Too vague; covers too long timeframe | Pending Deposits | Actionable; cash flow focused |
| Orders Delivered | Already tracked elsewhere | Ready for Pickup | Daily workflow priority |
| — | — | Overdue Orders | Urgency indicator |

---

### ISSUE 5.4: KPI Text Vague - No Information Drill-Down
**Priority:** HIGH | **Impact:** Usability, context accessibility  
**Owner:** Frontend Dev | **Estimated Time:** 45 minutes

#### Current State
- KPI cards show number only
- No way to understand what drives that number
- Clicking card does nothing

#### Exact Fix
**Interactive KPI Implementation:**

Each KPI card is now **clickable and filters dashboard data**:

\`\`\`jsx
// Example: Clicking "Pending Deposits" card
const handlePendingDepositsClick = () => {
  // Filter recent orders to show ONLY those with pending deposits
  setOrdersFilter({
    paymentStatus: 'PENDING',
    paymentReceived: { $lt: 'orderTotal' }
  });
  
  // Scroll to filtered orders
  scrollToSection('filtered-orders');
  
  // Highlight the filtered section
  addHighlight('filtered-orders', 2000);
};
\`\`\`

**Complete Click Handlers:**

\`\`\`jsx
const kpiClickHandlers = {
  todayRevenue: () => {
    // Show orders from today only, grouped by product
    setOrdersFilter({ dateCreated: today });
    showBreakdown('byProduct');
  },
  
  pendingDeposits: () => {
    // Show orders with unpaid/partial payments
    setOrdersFilter({ paymentStatus: ['PENDING', 'PARTIAL'] });
    scrollToSection('recent-orders');
  },
  
  readyForPickup: () => {
    // Show orders with "READY" status for today
    setOrdersFilter({ status: 'READY', pickupDate: today });
    scrollToSection('pickups-section');
  },
  
  overdueOrders: () => {
    // Show orders past their pickup time
    setOrdersFilter({ status: 'NOT_PICKED_UP', pickupDate: { $lt: now } });
    scrollToSection('recent-orders');
  }
};
\`\`\`

**Card Click Behavior:**

\`\`\`jsx
<button
  onClick={kpiClickHandlers[metric.id]}
  className="group relative overflow-hidden rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg"
>
  {/* Card content */}
  
  {/* Hover hint */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-black transition-opacity rounded-lg" />
  <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
    Click to view details →
  </p>
</button>
\`\`\`

**Why This Works:**
- Cards become entry points to detailed views
- Staff can drill into metrics quickly
- Reduces cognitive load (don't need to remember filter options)
- Encourages data exploration

---

### ISSUE 5.5: Missing "Today's Revenue" KPI
**Priority:** CRITICAL | **Impact:** Sales motivation, business tracking  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes

#### Current State
- Revenue metric not displayed on dashboard
- Staff don't see revenue impact in real-time
- No motivation toward revenue targets

#### Exact Fix
**Included in Issue 5.1 - KPI Card Implementation**

\`\`\`jsx
<KPICard
  icon={TrendingUp}
  title="Today's Revenue"
  value={`$${metrics.todayRevenue}`}
  target={`$${metrics.revenueTarget}`}
  unit=""
  color="green"
  onClick={() => filterByRevenue()}
/>
\`\`\`

**Calculation Logic:**

\`\`\`javascript
const calculateTodayRevenue = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    })
    .filter(order => ['PAID', 'PARTIAL'].includes(order.paymentStatus))
    .reduce((sum, order) => sum + order.total, 0);
};
\`\`\`

**Display Format:**
- Currency symbol ($)
- 2 decimal places ($1,240.50)
- Green color (indicates positive/money)
- Target comparison (e.g., "Target: $2,000")

---

### ISSUE 5.6: Missing "Overdue Orders" KPI
**Priority:** CRITICAL | **Impact:** Urgency awareness  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes

#### Current State
- No indication of overdue orders at a glance
- Staff might miss urgent tasks

#### Exact Fix
**Included in Issue 5.1 - KPI Card Implementation**

\`\`\`jsx
<KPICard
  icon={AlertTriangle}
  title="Overdue Orders"
  value={metrics.overdueCount}
  target={0}
  unit="orders"
  color="red"
  onClick={() => filterByStatus('overdue')}
/>
\`\`\`

**Calculation Logic:**

\`\`\`javascript
const calculateOverdueOrders = () => {
  const now = new Date();
  
  return orders.filter(order => {
    const pickupTime = new Date(order.pickupDateTime);
    const isOverdue = pickupTime < now;
    const isNotPickedUp = order.status !== 'PICKED_UP';
    
    return isOverdue && isNotPickedUp;
  }).length;
};
\`\`\`

**Visual Indicator:**
- Red background + icon
- Count of overdue orders
- Target: 0 (no overdue is the goal)
- Clicking shows list of overdue orders

---

### ISSUE 5.7: Consider "Rush Orders" KPI
**Priority:** MEDIUM | **Impact:** Priority tracking  
**Owner:** Product | **Estimated Time:** 45 minutes

#### Current State
- Rush orders not prominently displayed
- Might get mixed with regular orders

#### Exact Fix
**Optional Fourth KPI or Section:**

**Decision: Don't add as KPI card (space constraints)**

**Instead: Add as Badge in Recent Orders Section**

This is more practical because:
- Rush orders are individual orders (not a daily aggregate)
- Better served as property on each order card
- Reduces KPI card count
- Can still see at a glance via color-coded badges

**Implementation (See Issue 8.1):**
\`\`\`jsx
// In Recent Orders Card
{order.isRush && (
  <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
    🚨 RUSH
  </div>
)}
\`\`\`

---

### ISSUE 5.8: Clickable KPIs - Link to Information Pages
**Priority:** HIGH | **Impact:** Navigation, data exploration  
**Owner:** Frontend Dev | **Estimated Time:** 60 minutes

#### Current State
- KPI cards are static display only
- No way to drill into details
- Requires manual filtering

#### Exact Fix
**Implemented in Issue 5.4 - Interactive KPI Cards**

Each card filters/navigates to relevant data view:
- Today's Revenue → Revenue page filtered to today only
- Pending Deposits → Orders filtered by payment status
- Ready for Pickup → Pickups section
- Overdue Orders → Orders filtered by overdue status

---

### ISSUE 5.9: KPI Layout - Compact Grid
**Priority:** HIGH | **Impact:** Space efficiency  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes

#### Current State
- KPI grid is wide but short
- Takes up too much space

#### Exact Fix
**Grid Configuration:**

\`\`\`jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 4 KPI cards in a row on large screens */}
  {/* 2 cards per row on tablets */}
  {/* 1 card per row on mobile */}
</div>
\`\`\`

**Responsive Behavior:**

| Breakpoint | Grid | Cards Per Row | Height |
|-----------|------|---|---|
| Mobile < 768px | 1 column | 1 | 4x height |
| Tablet 768-1024px | 2 columns | 2 | 2x height |
| Desktop > 1024px | 4 columns | 4 | 1x height |

**Implementation:**
\`\`\`jsx
// Tailwind classes
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl"

// Each card grows/shrinks to fill available width
\`\`\`

**Result:**
- Compact on all screen sizes
- Information remains accessible
- Doesn't waste vertical space

---

## SECTION 6: SALES DASHBOARD - QUICK ACTIONS SECTION

### ISSUE 6.1: Quick Actions Section - Buried & Not Prominent
**Priority:** CRITICAL | **Impact:** Workflow efficiency, sales velocity  
**Owner:** Frontend Dev + Product | **Estimated Time:** 90 minutes

#### Current State
- Quick actions section is below KPI cards
- Sales staff must scroll to see it
- Creates friction in primary workflow (creating orders)

#### Exact Fix
**New Section Placement: Move to TOP of dashboard**

**New Dashboard Layout Order:**

\`\`\`
1. Header (sticky)
2. [NEW] Quick Actions Bar ← MOVED TO TOP
3. KPI Cards
4. Recent Orders / Pickups
5. Footer
\`\`\`

**Rationale:**
- Sales staff spend 88% of time creating orders
- This should be first thing they see
- Reduces friction by placing action buttons at top

**Component:** `QuickActionsBar`

\`\`\`jsx
export function QuickActionsBar() {
  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Actions
        </p>
        
        <div className="flex flex-wrap gap-3">
          {/* Primary Action: Create Order */}
          <a
            href="/admin/order-create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C44569] text-white font-semibold rounded-lg hover:bg-[#A63D54] shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            <span>Create Order</span>
          </a>
          
          {/* Secondary Action: View Orders */}
          <a
            href="/admin/order-management"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Search size={20} />
            <span>View All Orders</span>
          </a>
          
          {/* Tertiary Action: Manage Customers */}
          <a
            href="/admin/customer-accounts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Users size={20} />
            <span>Manage Customers</span>
          </a>
          
          {/* Bonus: Fulfillment Board */}
          <a
            href="/admin/fulfillment-board"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
          >
            <KanbanSquare size={20} />
            <span>Fulfillment Board</span>
          </a>
        </div>
      </div>
    </div>
  );
}
\`\`\`

**Visual Layout:**

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ Quick Actions                                           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ │ + Create Ord │ │ 🔍 View All  │ │ 👥 Manage    │    │
│ │ (PINK)       │ │ (GRAY)       │ │ (BLUE)       │    │
│ └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
\`\`\`

**Mobile Responsive:**
\`\`\`jsx
// Mobile: Stack vertically
className="flex flex-wrap gap-3 md:flex-row"

// Text label hides on small screens
<span className="hidden sm:inline">Create Order</span>
// Show icon only on mobile
<span className="sm:hidden">➕</span>
\`\`\`

**Why This Works:**
- Immediately visible after login
- Matches sales staff workflow (88% of time)
- Color-coded buttons create visual hierarchy
- Reduces time to primary action

---

### ISSUE 6.2: Color-Coded Action Buttons
**Priority:** HIGH | **Impact:** Visual hierarchy, usability  
**Owner:** Design Lead | **Estimated Time:** 30 minutes

#### Current State
- Buttons are plain/generic
- No color hierarchy
- No visual indication of button purpose/priority

#### Exact Fix
**Color System for Action Buttons:**

| Button | Color | Use Case | Hex | Tailwind |
|--------|-------|----------|-----|----------|
| Create Order (Primary) | Pink/Raspberry | Main CTA | #C44569 | bg-[#C44569] |
| View/Search (Secondary) | Gray | Navigation | #E5E7EB | bg-gray-100 |
| Manage/Admin (Tertiary) | Blue | Management | #DBEAFE | bg-blue-50 |
| Workflow/Process | Purple | Operations | #F3E8FF | bg-purple-50 |

**Implementation:**
\`\`\`jsx
const buttonStyles = {
  primary: "bg-[#C44569] text-white hover:bg-[#A63D54] shadow-md",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  tertiary: "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200",
  workflow: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
};
\`\`\`

**Why This Works:**
- Pink immediately recognizable as primary action
- Gray = utilitarian (search, view)
- Blue/Purple = additional actions
- Consistent with Emily Bakes brand palette

---

### ISSUE 6.3: Primary CTA - "Create Order" (Larger)
**Priority:** HIGH | **Impact:** Visual prominence  
**Owner:** Design Lead | **Estimated Time:** 20 minutes

#### Current State
- Create Order button same size as other buttons
- Doesn't visually indicate it's the primary action

#### Exact Fix
**Size Differentiation:**

\`\`\`jsx
{/* Primary - LARGER */}
<a
  href="/admin/order-create"
  className="inline-flex items-center gap-2 px-6 py-3 text-lg font-bold rounded-lg" {/* Larger text + padding */}
>
  <Plus size={22} /> {/* Larger icon */}
  <span>Create Order</span>
</a>

{/* Secondary & Tertiary - SMALLER */}
<a
  href="/admin/order-management"
  className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-semibold rounded-lg" {/* Smaller text + padding */}
>
  <Search size={18} />
  <span>View All Orders</span>
</a>
\`\`\`

**Size Comparison:**
- Primary: 18px font, 6 padding (6px horizontal), 3 padding (12px vertical)
- Secondary: 16px font, 5 padding (5px horizontal), 2.5 padding (10px vertical)
- Difference: ~15% larger button creates visual hierarchy

**Why This Works:**
- Primary action immediately stands out
- Staff knows where to click first
- Visual weight matches business priority

---

### ISSUE 6.4: Secondary CTA - "View Orders" (Smaller)
**Priority:** MEDIUM | **Impact:** Visual hierarchy  
**Owner:** Design Lead | **Estimated Time:** 15 minutes (included in 6.2)

#### Current State
- View Orders button same size as Create Order
- No differentiation

#### Exact Fix
**Implemented in Issue 6.3**

Smaller size, gray background, medium weight font

---

### ISSUE 6.5: Tertiary CTA - "Manage Customers" (Smaller)
**Priority:** MEDIUM | **Impact:** Visual hierarchy  
**Owner:** Design Lead | **Estimated Time:** 15 minutes (included in 6.2)

#### Current State
- Manage Customers not prominent
- May be overlooked

#### Exact Fix
**Implemented in Issue 6.2**

Blue background, tertiary styling, smaller than primary/secondary

---

## SECTION 7: SALES DASHBOARD - RECENT ORDERS SECTION

### ISSUE 7.1: Recent Orders Section - Lacks Urgency
**Priority:** CRITICAL | **Impact:** Task priority, customer satisfaction  
**Owner:** Frontend Dev + UX | **Estimated Time:** 120 minutes

#### Current State
- Recent orders displayed without urgency indicators
- All orders look same priority
- No visual distinction between rushed/delayed orders
- Staff can't see what needs immediate attention

#### Exact Fix
**Order Card Enhancement with Urgency Visualization:**

\`\`\`jsx
export function OrderCard({ order }) {
  const urgencyLevel = calculateUrgency(order);
  
  return (
    <div className={`
      border-l-4 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all
      ${urgencyLevel === 'critical' ? 'border-l-red-600 bg-red-50' : ''}
      ${urgencyLevel === 'high' ? 'border-l-orange-500 bg-orange-50' : ''}
      ${urgencyLevel === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : ''}
      ${urgencyLevel === 'normal' ? 'border-l-blue-500 bg-white' : ''}
    `}>
      {/* Card content */}
    </div>
  );
}

const calculateUrgency = (order) => {
  const now = new Date();
  const pickupTime = new Date(order.pickupDateTime);
  const hoursUntilPickup = (pickupTime - now) / (1000 * 60 * 60);
  const isPastDue = hoursUntilPickup < 0;
  
  if (isPastDue) return 'critical'; // Red
  if (hoursUntilPickup < 2) return 'high'; // Orange
  if (hoursUntilPickup < 6) return 'medium'; // Yellow
  return 'normal'; // Blue
};
\`\`\`

**Urgency Color Legend:**
| Status | Hours Left | Color | Severity | Action |
|--------|-----------|-------|----------|--------|
| **OVERDUE** | < 0 (past due) | 🔴 Red | CRITICAL | Immediate |
| **URGENT** | 0-2 hours | 🟠 Orange | HIGH | Soon |
| **SOON** | 2-6 hours | 🟡 Yellow | MEDIUM | Next |
| **NORMAL** | > 6 hours | 🔵 Blue | LOW | Plan |

**Why This Works:**
- Visual color coding instantly communicates urgency
- Red demands attention (overdue)
- Orange signals "coming soon"
- Yellow = routine
- Blue = plenty of time
- Staff can prioritize at a glance

---

### ISSUE 7.2: Too Much Positive Space in Recent Orders
**Priority:** HIGH | **Impact:** Information density  
**Owner:** Frontend Dev | **Estimated Time:** 45 minutes

#### Current State
- Order cards take up excessive vertical space
- Only shows 5 orders (requires scrolling for more)
- Whitespace makes dashboard feel empty

#### Exact Fix
**Compact Card Styling:**

**Before:**
\`\`\`
Order Card Height: 180px
Spacing Between: 24px
5 cards total: ~1,080px (requires scrolling)
\`\`\`

**After:**
\`\`\`
Order Card Height: 100px (compact)
Spacing Between: 12px
10 cards visible: ~1,120px but fits with smart layout
\`\`\`

**Implementation:**
\`\`\`jsx
export function OrderCard({ order }) {
  return (
    <div className="border-l-4 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-all">
      {/* One-line header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {order.description}
          </h3>
          <p className="text-xs text-gray-600">{order.customerName}</p>
        </div>
        
        {/* Status badges - inline */}
        <div className="flex gap-1 flex-shrink-0">
          {order.isRush && <RushBadge />}
          {order.status && <StatusBadge status={order.status} />}
        </div>
      </div>
      
      {/* Compact info row */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span>📅 {formatTime(order.pickupDateTime)}</span>
        <span>💰 {order.paymentStatus}</span>
        <span>{order.totalPrice}</span>
      </div>
      
      {/* One-line action buttons */}
      <div className="flex gap-2 mt-2">
        <button className="text-xs px-2 py-1 hover:bg-gray-100 rounded">View</button>
        <button className="text-xs px-2 py-1 hover:bg-gray-100 rounded">Update</button>
      </div>
    </div>
  );
}
\`\`\`

**Layout Changes:**
- Padding: 24px → 12px
- Font sizes: 16px → 14px (header), 12px → 10px (details)
- Cards stacked more tightly
- Action buttons in one row instead of stacked

---

### ISSUE 7.3: Order Naming System is Broken
**Priority:** CRITICAL | **Impact:** Customer clarity, order identification  
**Owner:** Backend + Frontend | **Estimated Time:** 90 minutes

#### Current State
- Orders show vague names like "Custom Order", "Order #1234"
- No description of what was actually ordered
- Staff must click into order to see what it is
- Confusion when multiple "Custom Orders" exist

#### Exact Fix
**New Order Naming Convention:**

**Format:** `[Quantity] [Products] + [Customizations]`

**Examples:**

| Bad (Current) | Good (New) |
|---|---|
| "Custom Order" | "2 Layer Cookies/Cream Chocolate" |
| "Order #5234" | "3 Cupcakes + CD + Inscription" |
| "Birthday Cake" | "Round 8 in Vanilla + Buttercream + Photo" |
| "Wedding" | "2x Tier 8 Choco + 2x Tier 6 Vanilla + Custom Topper" |

**Order Name Generation Logic:**

\`\`\`javascript
const generateOrderName = (items) => {
  // Get all products from items
  const productNames = items.map(item => 
    `${item.quantity}x ${item.product.name}`
  ).join(' + ');
  
  // Get all add-ons/customizations
  const customizations = items
    .flatMap(item => item.addOns)
    .filter(addon => addon.selected)
    .map(addon => addon.shortName) // e.g., "CD" for "Custom Design"
    .join(' + ');
  
  // Combine
  if (customizations) {
    return `${productNames} + ${customizations}`;
  }
  return productNames;
};

// Examples:
generateOrderName([
  { quantity: 2, product: { name: "Cookies/Cream Choco" }, addOns: [] }
]);
// Returns: "2x Cookies/Cream Choco"

generateOrderName([
  { quantity: 1, product: { name: "Round Cake 8 in" }, addOns: [
    { selected: true, shortName: "Buttercream" },
    { selected: true, shortName: "Photo" }
  ]}
]);
// Returns: "1x Round Cake 8 in + Buttercream + Photo"
\`\`\`

**Implementation in Order Display:**

\`\`\`jsx
// In database schema
{
  id: "order_12345",
  customerName: "Sarah Chen",
  description: "2 Layer Cookies/Cream Chocolate + CD", // Generated name
  items: [...],
  createdAt: "2025-11-17T10:30:00Z",
  // ... other fields
}

// In UI
<h3 className="font-semibold text-sm text-gray-900">
  {order.description} {/* Now shows "2 Layer Cookies/Cream Chocolate + CD" */}
</h3>
\`\`\`

**Customization Abbreviations:**
| Full Name | Short Code |
|---|---|
| Custom Design | CD |
| Inscription | Insc |
| Photo Cake | Photo |
| Fondant Flowers | FF |
| Buttercream | BC |
| Ganache | Gan |
| Delivery | Del |

**Why This Works:**
- Staff immediately knows what the order is
- Reduces need to click into details
- Reduces confusion with duplicate "Custom Orders"
- Professional appearance

---

### ISSUE 7.4: Only Shows 5 Recent Orders - Too Limited
**Priority:** HIGH | **Impact:** Information accessibility  
**Owner:** Frontend Dev | **Estimated Time:** 45 minutes

#### Current State
- Dashboard shows only 5 recent orders
- Staff must click "View All" to see more
- Friction in workflow

#### Exact Fix
**Increase Display + Add Scroll:**

\`\`\`jsx
export function RecentOrdersSection() {
  const [displayCount, setDisplayCount] = useState(10); // Was 5
  const orders = useDashboardOrders().slice(0, displayCount);
  
  return (
    <section id="recent-orders-section" className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock size={18} />
          Recent Orders ({orders.length})
        </h2>
        
        <a href="/admin/order-management" className="text-sm text-[#C44569] hover:underline">
          View All →
        </a>
      </div>
      
      {/* Scrollable Container */}
      <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
      
      {/* Load More Button */}
      {displayCount < totalOrders && (
        <button
          onClick={() => setDisplayCount(prev => prev + 5)}
          className="mt-4 w-full py-2 text-sm font-medium text-[#C44569] hover:bg-gray-50 rounded-lg transition-colors"
        >
          Load More
        </button>
      )}
    </section>
  );
}
\`\`\`

**Improvements:**
- Shows 10 orders instead of 5
- Scrollable area prevents excessive page height
- "Load More" button for additional orders
- Shows current count ("Recent Orders (10)")

---

### ISSUE 7.5: No Visual Urgency Indicators
**Priority:** CRITICAL | **Impact:** Task prioritization  
**Owner:** Frontend Dev | **Estimated Time:** 60 minutes

#### Current State
- All orders look the same
- No visual indication of rush/delayed status
- Staff can't prioritize

#### Exact Fix
**Urgency Indicators Implementation (Addressed in Issue 7.1)**

Visual elements per order card:

1. **Left Border Color** - indicates urgency level
2. **Background Color** - subtle tint matching urgency
3. **Badge** - "RUSH" badge for rush orders (red)
4. **Time Display** - shows "2h 15m left" for urgent orders (in red)
5. **Warning Icon** - for overdue orders

**Complete Order Card:**

\`\`\`jsx
export function OrderCard({ order }) {
  const urgencyLevel = calculateUrgency(order);
  const timeRemaining = getTimeRemaining(order.pickupDateTime);
  
  return (
    <div className={`
      border-l-4 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-all
      ${getUrgencyStyles(urgencyLevel)}
    `}>
      {/* Top Row: Product + Status */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {order.description}
          </h3>
          <p className="text-xs text-gray-600">{order.customerName}</p>
        </div>
        
        {/* Badges */}
        <div className="flex gap-1 flex-shrink-0">
          {order.isRush && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              🚨 RUSH
            </span>
          )}
          
          {urgencyLevel === 'critical' && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1">
              ⚠️ OVERDUE
            </span>
          )}
        </div>
      </div>
      
      {/* Middle Row: Time & Payment */}
      <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className={urgencyLevel === 'critical' ? 'text-red-600 font-bold' : 'text-gray-600'}>
            📅 {formatTime(order.pickupDateTime)}
          </span>
          
          {/* Time remaining if urgent */}
          {urgencyLevel !== 'normal' && (
            <span className={`font-semibold ${
              urgencyLevel === 'critical' ? 'text-red-600' :
              urgencyLevel === 'high' ? 'text-orange-600' :
              'text-yellow-600'
            }`}>
              {timeRemaining}
            </span>
          )}
        </div>
        
        {/* Payment Badge */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
          order.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {order.paymentStatus}
        </span>
      </div>
      
      {/* Bottom Row: Price + Actions */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-gray-900">
          ${order.totalPrice}
        </span>
        
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 hover:bg-gray-100 rounded transition-colors">
            View
          </button>
          <button className="text-xs px-2 py-1 hover:bg-gray-100 rounded transition-colors">
            Update
          </button>
          {order.status === 'READY' && (
            <button className="text-xs px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded transition-colors">
              Mark Picked
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
\`\`\`

---

### ISSUE 7.6: No Sorting Capability
**Priority:** MEDIUM | **Impact:** Workflow flexibility  
**Owner:** Frontend Dev | **Estimated Time:** 60 minutes

#### Current State
- Orders display in fixed order (presumably by creation time)
- Staff can't re-sort by priority, time, etc.
- May need to dig through list

#### Exact Fix
**Sorting Controls:**

\`\`\`jsx
export function RecentOrdersSection() {
  const [sortBy, setSortBy] = useState('pickup-time-asc');
  
  const sortOptions = [
    { value: 'pickup-time-asc', label: 'Pickup Time (Soon First)' },
    { value: 'pickup-time-desc', label: 'Pickup Time (Later First)' },
    { value: 'priority-asc', label: 'Priority (High First)' },
    { value: 'payment-status', label: 'Payment Status' },
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' }
  ];
  
  const sortedOrders = sortOrders(orders, sortBy);
  
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        
        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm px-3 py-1 border border-gray-300 rounded hover:border-gray-400 cursor-pointer"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Render sorted orders */}
      {sortedOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </section>
  );
}

const sortOrders = (orders, sortBy) => {
  const sorted = [...orders];
  
  switch(sortBy) {
    case 'pickup-time-asc':
      return sorted.sort((a, b) => new Date(a.pickupDateTime) - new Date(b.pickupDateTime));
    case 'pickup-time-desc':
      return sorted.sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime));
    case 'priority-asc':
      return sorted.sort((a, b) => {
        const priorityA = a.isRush ? 0 : 1;
        const priorityB = b.isRush ? 0 : 1;
        return priorityA - priorityB;
      });
    case 'payment-status':
      return sorted.sort((a, b) => {
        const statusOrder = { 'PENDING': 0, 'PARTIAL': 1, 'PAID': 2 };
        return statusOrder[a.paymentStatus] - statusOrder[b.paymentStatus];
      });
    case 'created-desc':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'created-asc':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    default:
      return sorted;
  }
};
\`\`\`

**Sorting Options:**
- **Pickup Time (Soon First)** - Default, shows urgent pickups
- **Pickup Time (Later First)** - Show future pickups
- **Priority (High First)** - Rush orders first
- **Payment Status** - Pending → Partial → Paid
- **Newest First** - Recently created orders
- **Oldest First** - Oldest orders

---

### ISSUE 7.7: Missing Key Information Per Order
**Priority:** CRITICAL | **Impact:** Operational clarity  
**Owner:** Frontend Dev | **Estimated Time:** 90 minutes

#### Current State
- Order cards missing critical information
- Staff must click to get details
- Incomplete picture of order status

#### Exact Fix
**Complete Order Card Information Layout**

Addressed comprehensively in Issues 7.1-7.6

Final order card includes:
✅ Order description (what was ordered)
✅ Customer name
✅ Pickup time and date
✅ Status badge
✅ Time remaining (if under 24 hours, in red)
✅ Priority indicator (rush badge)
✅ Payment status (pending, partial, paid)
✅ Total price
✅ Quick action buttons

---

## SECTION 8: RECENT ORDERS - CARD DETAILS SPECIFICATION

### ISSUE 8.1-8.10: Complete Order Card Details
**Priority:** CRITICAL | **Impact:** Operational efficiency  
**Owner:** Frontend Dev | **Estimated Time:** 120 minutes

#### Combined Implementation

All order card details are specified in the component below:

\`\`\`jsx
export function OrderCardDetailed({ order }) {
  const urgencyLevel = calculateUrgency(order);
  const timeRemaining = getTimeRemaining(order.pickupDateTime);
  const isOverdue = timeRemaining < 0;
  
  return (
    <div className={`
      border-l-4 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all
      ${isOverdue ? 'border-l-red-600 bg-red-50' :
        urgencyLevel === 'high' ? 'border-l-orange-500 bg-orange-50' :
        urgencyLevel === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-blue-500 bg-white'}
    `}>
      <div className="p-3">
        {/* Row 1: Product Description + Status Badges */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            {/* Customer Name */}
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {order.customerName}
            </p>
            
            {/* Order Description */}
            <h3 className="font-semibold text-sm text-gray-900 truncate mt-0.5">
              {order.description}
            </h3>
          </div>
          
          {/* Status Badges */}
          <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
            {/* 8.1: Rush Order Badge */}
            {order.isRush && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded whitespace-nowrap">
                🚨 RUSH
              </span>
            )}
            
            {/* 8.2: Status Badge */}
            <span className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${
              order.status === 'READY' ? 'bg-green-100 text-green-800' :
              order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
            
            {/* 8.3: Overdue Badge */}
            {isOverdue && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded whitespace-nowrap">
                ⚠️ OVERDUE
              </span>
            )}
          </div>
        </div>
        
        {/* Row 2: Time & Payment Details */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-200 border-opacity-50 text-xs">
          <div className="flex items-center gap-2">
            {/* 8.4: Pickup Time & Date */}
            <span className="flex items-center gap-1">
              📅
              <span>
                {formatDate(order.pickupDateTime)}
              </span>
            </span>
            
            {/* 8.5: Time Remaining (if under 24 hours, in red) */}
            {!isOverdue && urgencyLevel !== 'normal' && (
              <span className={`font-bold ${
                urgencyLevel === 'high' ? 'text-orange-600' :
                urgencyLevel === 'medium' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                (in {timeRemaining})
              </span>
            )}
            
            {isOverdue && (
              <span className="font-bold text-red-600">
                ({Math.abs(timeRemaining)} overdue)
              </span>
            )}
          </div>
          
          {/* 8.6: Payment Status Badge */}
          <span className={`px-2 py-0.5 rounded font-medium ${
            order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
            order.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {order.paymentStatus === 'PENDING' ? '💸 Pending Deposit' :
             order.paymentStatus === 'PARTIAL' ? '⚠️ Partial' :
             '✅ Paid'}
          </span>
        </div>
        
        {/* Row 3: Price + Priority + Payment Remaining */}
        <div className="flex items-center justify-between gap-3 mb-3 text-sm">
          {/* 8.7: Priority Color Coding */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Priority:</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
              order.isRush ? 'bg-red-100 text-red-800' :
              urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
              urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.isRush ? '🔴 RUSH' :
               urgencyLevel === 'high' ? '🟠 HIGH' :
               urgencyLevel === 'medium' ? '🟡 MEDIUM' :
               '🔵 NORMAL'}
            </span>
          </div>
          
          {/* 8.8: Total Price */}
          <span className="font-bold text-gray-900">
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>
        
        {/* Row 4: Payment Breakdown (if not fully paid) */}
        {order.paymentStatus !== 'PAID' && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs border border-gray-200">
            {/* 8.9: Amount Remaining */}
            <div className="flex justify-between">
              <span>Paid:</span>
              <span className="font-semibold">${order.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-red-600 font-bold">
              <span>Remaining:</span>
              <span>${(order.totalPrice - order.amountPaid).toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {/* Row 5: Quick Action Buttons */}
        <div className="flex gap-2 pt-2">
          {/* 8.10: Action Buttons */}
          <button
            onClick={() => handleViewOrder(order.id)}
            className="text-xs px-2 py-1 hover:bg-gray-200 rounded transition-colors"
            title="View full order details"
          >
            View Details
          </button>
          
          <button
            onClick={() => handleUpdateStatus(order.id)}
            className="text-xs px-2 py-1 hover:bg-gray-200 rounded transition-colors"
            title="Update order status"
          >
            Update Status
          </button>
          
          <button
            onClick={() => handleUpdatePickup(order.id)}
            className="text-xs px-2 py-1 hover:bg-gray-200 rounded transition-colors"
            title="Update pickup status"
          >
            Update Pickup
          </button>
          
          {/* 8.10b: Bonus - Mark Picked Up (if status is READY) */}
          {order.status === 'READY' && (
            <button
              onClick={() => handleMarkPickedUp(order.id)}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors font-medium ml-auto"
              title="Mark this order as picked up"
            >
              ✓ Mark Picked
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
\`\`\`

**Visual Result:**

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ ■■ Sarah Chen                              [🚨 RUSH] [READY] │
│    2 Layer Cookies/Cream Chocolate + CD                 │
├─────────────────────────────────────────────────────────┤
│ 📅 Today 2:30 PM (in 45 min)     ✅ Paid                 │
│                                                          │
│ Priority: 🔴 RUSH                            $42.99      │
├─────────────────────────────────────────────────────────┤
│ [View Details] [Update Status] [Update Pickup]          │
│                                          [✓ Mark Picked] │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

## SECTION 9: SALES DASHBOARD - EMPTY STATES

### ISSUE 9.1-9.3: Empty States - Friendly & Positive
**Priority:** MEDIUM | **Impact:** UX polish, brand personality  
**Owner:** Design Lead + Frontend | **Estimated Time:** 60 minutes

#### Current State
- No empty state messaging
- Generic or sad appearance when no orders
- Feels broken/incomplete

#### Exact Fix
**Friendly Empty State Component:**

\`\`\`jsx
export function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* 9.1: Illustration - Cake with Checkmark */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
          <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* Cake outline */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            
            {/* Checkmark overlay */}
            <g>
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" stroke="white" />
            </g>
          </svg>
        </div>
      </div>
      
      {/* 9.2: Message - Positive & Friendly */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          No recent orders today — all set! 🎉
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Your orders will appear here when customers place them or you create new orders.
        </p>
      </div>
      
      {/* 9.3: Action Button */}
      <a
        href="/admin/order-create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C44569] text-white font-semibold rounded-lg hover:bg-[#A63D54] shadow-md hover:shadow-lg transition-all"
      >
        <Plus size={20} />
        Create a New Order
      </a>
    </div>
  );
}
\`\`\`

**Styling Details:**
- Green circle background (indicates positive/success)
- Cake icon (brand relevant)
- Checkmark overlay (completion/success)
- Friendly messaging (celebratory tone)
- Action CTA button (next step)

**Why This Works:**
- Celebrates empty state as positive (all caught up)
- Uses emoji (friendly, not corporate)
- Cake icon reinforces brand
- Clear next action (Create Order)
- Prevents sense of "something is broken"

---

## SECTION 10: SALES DASHBOARD - FOOTER

### ISSUE 10.1-10.3: Footer - Information & Controls
**Priority:** MEDIUM | **Impact:** Data freshness, accessibility  
**Owner:** Frontend Dev | **Estimated Time:** 45 minutes

#### Current State
- No footer on dashboard
- No indication when data was last updated
- No refresh capability
- No help access

#### Exact Fix
**Dashboard Footer Component:**

\`\`\`jsx
export function DashboardFooter() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { lastUpdated, refresh } = useDashboardMetrics();
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Last Update Time */}
          <div className="text-sm text-gray-600">
            <span>10.1: Last updated: </span>
            <span className="font-semibold text-gray-900">
              {formatTime(lastUpdated)}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              (auto-refreshes every 30 seconds)
            </span>
          </div>
          
          {/* Center: Help Link */}
          <a
            href="/help/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#C44569] hover:underline flex items-center gap-1"
            title="Open dashboard help documentation"
          >
            <HelpCircle size={16} />
            10.3: Help & Documentation
          </a>
          
          {/* Right: Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isRefreshing 
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Manually refresh dashboard data"
          >
            <RotateCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            10.2: Refresh
          </button>
        </div>
      </div>
    </footer>
  );
}
\`\`\`

**Footer Elements:**

| Element | Purpose | Detail |
|---------|---------|--------|
| Last Update Time | Data freshness | Shows "Last updated: 2:45 PM" |
| Auto-refresh Info | Transparency | Notes "(auto-refreshes every 30 seconds)" |
| Help Link | Support | Links to dashboard documentation |
| Refresh Button | Manual control | Allows staff to force refresh |

**Features:**
- 10.1: Last update timestamp
- 10.2: Refresh button with spinner during loading
- 10.3: Help link to documentation

---

## SECTION 11: GENERAL CARD / COMPONENT STYLING

### ISSUE 11.1: Cards Take Up Too Much Wide Space
**Priority:** HIGH | **Impact:** Layout efficiency  
**Owner:** Frontend Dev | **Estimated Time:** 60 minutes

#### Current State
- Cards stretch to full container width
- Excessive whitespace on sides
- Doesn't look professionally designed

#### Exact Fix
**Container Max-Width Constraints:**

\`\`\`jsx
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      {/* Main content with max-width */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* All sections inherit max-width */}
        <KPICardsSection />
        <QuickActionsSection />
        <RecentOrdersSection />
      </main>
      
      <DashboardFooter />
    </div>
  );
}
\`\`\`

**CSS Configuration:**
\`\`\`css
.dashboard-container {
  max-width: 80rem; /* 1280px - standard professional width */
  margin: 0 auto;
  padding: 0 1rem; /* 16px side padding */
}

/* Media queries for smaller screens */
@media (max-width: 1280px) {
  .dashboard-container {
    max-width: 100%;
  }
}
\`\`\`

**Tailwind Implementation:**
\`\`\`
max-w-7xl /* Sets max width to 80rem (1280px) */
mx-auto   /* Centers container */
px-4      /* 16px horizontal padding */
\`\`\`

---

### ISSUE 11.2: Cards Need Professional Enhancement (Not Overdone)
**Priority:** MEDIUM | **Impact:** Visual polish, brand perception  
**Owner:** Design Lead | **Estimated Time:** 45 minutes

#### Current State
- Cards are plain white
- Lack depth/dimension
- Look generic/unfinished

#### Exact Fix
**Subtle Card Enhancement:**

\`\`\`jsx
export function Card({ children, className }) {
  return (
    <div className={`
      bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow
      border border-gray-100
      ${className}
    `}>
      {children}
    </div>
  );
}
\`\`\`

**Card Styling Details:**
\`\`\`css
/* Base Card */
background: white
border: 1px solid #f3f4f6 (very subtle)
border-radius: 8px
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

/* Hover State */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
transition: all 200ms ease-in-out

/* Alternative: Elevated Card */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
\`\`\`

**Why This Works:**
- Subtle shadow creates depth without loudness
- Light border defines edge
- Hover state provides feedback
- Professional but not over-designed

---

### ISSUE 11.3: Add Subtle Left Border Stripe to Cards
**Priority:** MEDIUM | **Impact:** Visual interest, professional appearance  
**Owner:** Design Lead | **Estimated Time:** 30 minutes

#### Current State
- Cards are completely plain
- No visual accent elements
- All the same color

#### Exact Fix
**Left Border Implementation (Already done in ISSUE 7.1)**

\`\`\`jsx
export function CardWithAccent({ order, variant = 'normal' }) {
  return (
    <div className={`
      border-l-4 rounded-lg p-4 bg-white shadow-sm
      ${variant === 'critical' ? 'border-l-red-600' : ''}
      ${variant === 'high' ? 'border-l-orange-500' : ''}
      ${variant === 'medium' ? 'border-l-yellow-500' : ''}
      ${variant === 'normal' ? 'border-l-blue-500' : ''}
    `}>
      {/* Card content */}
    </div>
  );
}
\`\`\`

**Left Border Specification:**
- Width: 4px
- Color: Status/priority dependent
- Always on left side
- Creates visual accent without overwhelming

**Color Mapping:**
| Status | Color | Hex |
|--------|-------|-----|
| Critical/Overdue | Red | #DC2626 |
| High/Urgent | Orange | #F97316 |
| Medium/Soon | Yellow | #EAB308 |
| Normal/Planning | Blue | #3B82F6 |

---

### ISSUE 11.4: Section Headers Need Icons
**Priority:** MEDIUM | **Impact:** Visual organization, scanning  
**Owner:** Frontend Dev | **Estimated Time:** 30 minutes

#### Current State
- Section headers are plain text
- No visual distinction between sections
- Hard to scan page

#### Exact Fix
**Icon + Header Component:**

\`\`\`jsx
export function SectionHeader({ icon: Icon, title, count }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Icon size={20} className="text-[#C44569]" />
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
        {count !== undefined && (
          <span className="text-gray-500 font-normal ml-2">
            ({count})
          </span>
        )}
      </h2>
    </div>
  );
}

// Usage
<SectionHeader 
  icon={Clock} 
  title="Recent Orders"
  count={8}
/>

<SectionHeader 
  icon={BarChart3} 
  title="Today's Metrics"
/>

<SectionHeader 
  icon={Zap} 
  title="Quick Actions"
/>
\`\`\`

**Icon Selection:**
| Section | Icon | Rationale |
|---------|------|-----------|
| KPI Cards | BarChart3 | Represents metrics |
| Recent Orders | Clock | Time-related data |
| Quick Actions | Zap | Speed/actions |
| Pickups | CheckCircle | Task completion |
| Fulfillment | KanbanSquare | Workflow |

**Styling:**
- Icon size: 20px
- Color: Emily Bakes pink (#C44569)
- Next to title
- Subtle but noticeable

---

### ISSUE 11.5: All Important Information Above Fold
**Priority:** CRITICAL | **Impact:** Usability, task completion  
**Owner:** Frontend Dev | **Estimated Time:** 90 minutes

#### Current State
- Requires excessive scrolling to see all critical data
- Users miss important information
- Workflow disrupted

#### Exact Fix
**Fold-Aware Layout:**

**Critical Information (MUST be above fold):**
1. Header with user context
2. Quick Actions (create order, etc.)
3. KPI Cards (today's metrics)
4. First 3-4 recent orders/pickups

**Secondary Information (Below fold is OK):**
- Remaining orders
- Additional metrics
- Reports
- Footer

**Implementation:**

\`\`\`jsx
export function OptimizedDashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - sticky, always visible */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <EnhancedDashboardHeader />
      </header>
      
      {/* Main - takes remaining vertical space efficiently */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Section 1: Quick Actions - COMPACT (50px) */}
        <section className="mb-4">
          <QuickActionsBar />
        </section>
        
        {/* Section 2: KPI Cards - COMPACT (120px) */}
        <section className="mb-4">
          <SectionHeader icon={BarChart3} title="Today's Metrics" />
          <KPICardsCompact />
        </section>
        
        {/* Section 3: Recent Orders - SCROLLABLE (fits above fold with scroll) */}
        <section className="mb-6">
          <SectionHeader icon={Clock} title="Recent Orders" count={8} />
          <RecentOrdersScrollable maxHeight="400px" />
        </section>
      </main>
      
      {/* Footer - only appears on scroll */}
      <footer className="bg-white border-t border-gray-200">
        <DashboardFooter />
      </footer>
    </div>
  );
}
\`\`\`

**Viewport Calculation:**
\`\`\`
Desktop (1280px wide, 720px viewport height):
Header: 80px
Quick Actions: 50px
KPI Cards: 120px
Spacing: 40px
Recent Orders: ~350px (partial view + scroll)
Total above fold: ~640px (fits with room to scroll)

Mobile (375px wide, 667px viewport height):
Header: 60px
Quick Actions: 120px (stacks vertically)
KPI Cards: 240px (2 cols, 2 rows)
Spacing: 30px
Recent Orders: ~200px (with scroll)
Total above fold: ~650px (mostly visible)
\`\`\`

---

## PRIORITY SUMMARY & IMPLEMENTATION ROADMAP

### CRITICAL PRIORITY (Must Fix Before Deadline)
**Estimated: 16-20 hours of development**

1. **Home Page:** Staff Login Button (0.5h)
2. **Sales Dashboard - KPI Cards:** All 6 issues (3h)
3. **Sales Dashboard - Recent Orders:** All 7 issues (4h)
4. **Order Naming System:** Fix broken naming (2h)
5. **Empty States:** Friendly messaging (1h)
6. **Fold-Aware Layout:** All critical info above fold (2h)
7. **Urgency Indicators:** Color-coded visual system (2h)

### HIGH PRIORITY (Should Fix Before Deadline)
**Estimated: 10-14 hours of development**

1. **Sales Login Page:** Demo credentials & UI (2h)
2. **Dashboard Header:** Full enhancements (3h)
3. **Quick Actions Bar:** Prominent placement (2h)
4. **Card Styling:** Professional polish (1h)
5. **Sidebar:** Always visible (1.5h)
6. **Sorting Capability:** Order card sorting (1.5h)

### MEDIUM PRIORITY (Nice to Have)
**Estimated: 5-7 hours of development**

1. **Bakery Personality:** Subtle patterns (1h)
2. **Section Icons:** Header enhancements (0.5h)
3. **Footer:** Last update + refresh (0.5h)
4. **Empty States:** Enhanced illustrations (1h)
5. **Additional Filters:** Advanced sorting (2h)

---

## DEVELOPER ASSIGNMENT MATRIX

| Issue # | Component | Dev Owner | Estimated Time | Status |
|---------|-----------|-----------|---|---|
| 1.1-1.2 | Staff Login Button | Frontend Lead | 0.5h | CRITICAL |
| 2.1-2.7 | Sales Login Page | Frontend Dev | 3h | HIGH |
| 3.1-3.4 | Dashboard Layout | Frontend Lead | 3h | HIGH |
| 4.1-4.8 | Dashboard Header | Frontend Dev | 3h | HIGH |
| 5.1-5.9 | KPI Cards | Frontend + Data | 4h | CRITICAL |
| 6.1-6.5 | Quick Actions | Frontend Dev | 2h | HIGH |
| 7.1-7.7 | Recent Orders | Frontend + UX | 6h | CRITICAL |
| 8.1-8.10 | Order Card Details | Frontend Dev | 3h | CRITICAL |
| 9.1-9.3 | Empty States | Designer + Frontend | 1.5h | MEDIUM |
| 10.1-10.3 | Dashboard Footer | Frontend Dev | 1h | MEDIUM |
| 11.1-11.5 | Card Styling | Designer + Frontend | 3h | HIGH |

**Total Development Time:**
- CRITICAL: 16-20 hours
- HIGH: 10-14 hours
- MEDIUM: 5-7 hours
- **TOTAL: 31-41 hours of development**

---

## TESTING CHECKLIST

Each implementation should be tested against:

- [ ] Desktop (1920px+ width)
- [ ] Tablet (768-1024px width)
- [ ] Mobile (375px width)
- [ ] All browsers (Chrome, Firefox, Safari)
- [ ] Accessibility (keyboard nav, screen readers)
- [ ] Performance (< 3s load time)
- [ ] User workflows (create order, view orders, pickup)
- [ ] Edge cases (no orders, many orders, overdue orders)

---

**Document Complete** | Version 1.0 | Ready for Implementation
