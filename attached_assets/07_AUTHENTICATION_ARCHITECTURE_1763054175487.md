# Emily Bakes Cakes - Staff Authentication & Portal Architecture Analysis
## Strategic Recommendations for Design & Development

**Date:** November 5, 2025  
**Status:** Architecture Decision Document  
**Purpose:** Evaluate authentication strategy, website/app separation, and role-based portal design

---

## Executive Summary

Your current implementation embeds staff authentication within the customer-facing site through a "Staff Login" button. This document evaluates whether this approach aligns with project requirements and proposes architectural alternatives based on your business needs, development constraints, and the CIS 3343 case study requirements.

### Key Decisions to Make

1. **Should you maintain the integrated staff login button on the public site?**
2. **Should the website and staff app be completely separated (different domains/deployments)?**
3. **Should you create role-based home pages for Bakers, Decorators, Accountants, and Sales Staff?**

---

## 1. Staff Login Button on Customer Site: Strategic Assessment

### Current Architecture
- Staff login button exists on public-facing website
- Routes authenticated staff to admin portal
- Same deployment, shared infrastructure

### Assessment: Should You Keep It?

**✅ PROS:**

| Advantage | Business Impact | Technical Impact |
|-----------|-----------------|-----------------|
| **Single URL for staff** | Easy to remember; no confusion about multiple portals | Simpler deployment; unified domain |
| **Security through obscurity (minor)** | Staff don't advertise the admin area | Login route less visible to casual site visitors |
| **Unified deployment** | One application to manage | Simpler DevOps; single server instance |
| **Brand consistency** | Professional appearance; matches business identity | Consistent design system across entry points |
| **Real-world practice** | Many small businesses use this model | Proven pattern; low risk |

**❌ CONS:**

| Disadvantage | Business Impact | Technical Impact |
|-------------|-----------------|-----------------|
| **Confuses customers** | Customers see "Staff Login" button; reduces UX clarity | Visual clutter on public site |
| **Security risk (low)** | Staff portal URL might be discovered by customers | Potential for credential guessing attacks |
| **Scalability issue** | If bakery grows, shared infrastructure becomes bottleneck | Single-server model doesn't scale well |
| **Feature bloat** | Public site code gets entangled with staff-only code | Larger bundle size; slower page loads |
| **Development friction** | Team working on public site can break staff features | Harder to maintain separation of concerns |

### Recommendation: **KEEP THE STAFF LOGIN BUTTON** (For This Project)

**Rationale:**
1. **Project Timeline**: You're on a CIS 3343 deadline (May 18, 2026). Separating into two applications would double deployment complexity.
2. **Case Study Scope**: The requirement focuses on "custom cake order tracking"—staff portal is supporting functionality, not primary deliverable.
3. **Current Investment**: You've already spent significant time on the customer-facing site. Refactoring now to separate it would be wasteful.
4. **Business Reality**: Emily Bakes Cakes is a small bakery. Integrated auth is appropriate for their scale (currently ~10-15 staff members).

**BUT**: Consider adding strategic hiding:
\`\`\`typescript
// Only show staff login button if user agent suggests employee access
// Or: Add button only on internal network IP ranges
// Or: Move button to footer with small "Staff Portal" text

// Example: Conditional rendering
{process.env.REACT_APP_SHOW_STAFF_LOGIN === 'true' && (
  <StaffLoginButton />
)}
\`\`\`

---

## 2. Website vs. App Separation: Technical Feasibility Assessment

### Question: Given Your Current Codebase, Is Separation Possible Now?

**Answer: Yes, but requires refactoring.**

### Current State (Based on Your Codebase)

Your application structure:
\`\`\`
App.tsx (routing hub)
├── pages/public/
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── Builder.tsx
│   ├── Gallery.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── pages/admin/
│   ├── Dashboard.tsx
│   ├── Orders.tsx
│   ├── Customers.tsx
│   ├── Products.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── components/
│   ├── PublicLayout.tsx
│   └── AdminLayout.tsx
└── styles/
    └── globals.css (shared)
\`\`\`

**This is "monolithic" but "feature-isolated"** — you can extract it with effort.

### Separation Path A: Extract to Separate Deployments (Advanced)

**Cost-Benefit:**

| Aspect | Cost | Benefit | ROI |
|--------|------|--------|-----|
| **Refactoring effort** | 40-60 hours | Cleaner codebase | Medium |
| **Deployment complexity** | +200% | Independent scaling | Low for bakery |
| **Security isolation** | 10 hours | Staff data segregated | Low (local app) |
| **Development speed** | -15% (initially) | +20% faster after setup | High long-term |

### Separation Path B: Keep Monolith, Add Feature Flags (Recommended)

**Current best practice**: Use feature flags to logically separate public/admin without physical separation.

\`\`\`typescript
// src/config/features.ts
export const FEATURES = {
  SHOW_PUBLIC_SITE: true,
  SHOW_ADMIN_PORTAL: true,
  SHOW_STAFF_LOGIN: process.env.NODE_ENV === 'production',
};

// src/App.tsx
function App() {
  return (
    <Routes>
      {FEATURES.SHOW_PUBLIC_SITE && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          {/* ... other public routes ... */}
        </>
      )}
      
      {FEATURES.SHOW_ADMIN_PORTAL && (
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminPortal />
          </ProtectedRoute>
        } />
      )}
    </Routes>
  );
}
\`\`\`

**Advantages:**
- ✅ Zero refactoring required NOW
- ✅ Can deploy single bundle OR separate bundles later
- ✅ Toggle features without code changes (environment variables)
- ✅ Perfect for CIS 3343 submission (single, unified codebase)

### My Recommendation: **DO NOT SEPARATE NOW**

**Reasoning:**
1. **Time Investment**: You've spent "so much time working on customer facing site"—don't waste it refactoring at this stage.
2. **Submission Requirements**: CIS 3343 likely expects ONE unified application, not microservices.
3. **Database**: Your shared database works for both public and admin—separation gains nothing.
4. **Future-Proof**: Feature flags allow FUTURE separation without current pain.

**Action Items:**
- ✅ Document why monolith is appropriate for this project size
- ✅ Use feature flags to logically separate code (shows architectural awareness)
- ✅ Add this to your project documentation as "Technical Decision Record"

---

## 3. Role-Based Home Pages: Yes, Implement This

### Current Reality

According to the Emily Bakes Cakes case study, you have **five distinct staff roles**:

| Role | Primary Responsibility | Portal Needs |
|------|------------------------|--------------|
| **Sales Staff** | Taking orders, processing payments, handing off cakes | Quick order entry, payment processing, order lookup |
| **Bakers** | Baking, assembling, notifying decorators | Order queue view, ingredient tracking, status updates |
| **Decorators** | Decorating, consulting on custom designs | Design details, layer status, before/after gallery |
| **Accountant (Dan)** | Financial reporting, receipts, banking | Reports, dashboards, transaction history |
| **Manager (James)** | Overall oversight, approvals | Complete visibility, all reports, staff management |

### Current Problem

Your audit documentation shows:
- ✅ Public site: Beautiful, production-ready
- ✅ Admin portal: Dashboard, Orders, Customers, Products, Reports
- ❌ **BUT**: All staff see the SAME dashboard

**When Sales staff logs in → they see KPI charts about revenue**  
**When Bakers log in → they see profit/loss reports (irrelevant)**  
**When Dan (Accountant) logs in → he sees order management (not his job)**

This is a **UX problem** and a **security problem**.

### Solution: Role-Based Dashboards (High Priority)

#### Step 1: Define Roles in Database

\`\`\`sql
CREATE TABLE Role (
  RoleID INT PRIMARY KEY,
  RoleName VARCHAR(50) NOT NULL,
  Description VARCHAR(255)
);

INSERT INTO Role VALUES
  (1, 'Sales', 'Customer-facing order entry and payment'),
  (2, 'Baker', 'Production: baking and assembly'),
  (3, 'Decorator', 'Decoration and design consultation'),
  (4, 'Accountant', 'Financial reporting and reconciliation'),
  (5, 'Manager', 'Overall oversight and approvals');

CREATE TABLE Employee (
  EmployeeID INT PRIMARY KEY,
  FirstName VARCHAR(50),
  LastName VARCHAR(50),
  Email VARCHAR(100) UNIQUE,
  RoleID INT,
  FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);
\`\`\`

#### Step 2: Create Role-Based Dashboard Components

\`\`\`typescript
// src/pages/admin/Dashboard.tsx
import { useDashboard } from '../../hooks/useDashboard';
import SalesDashboard from './dashboards/SalesDashboard';
import BakerDashboard from './dashboards/BakerDashboard';
import DecoratorDashboard from './dashboards/DecoratorDashboard';
import AccountantDashboard from './dashboards/AccountantDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';

export function Dashboard() {
  const { user } = useDashboard();

  const dashboards = {
    sales: <SalesDashboard />,
    baker: <BakerDashboard />,
    decorator: <DecoratorDashboard />,
    accountant: <AccountantDashboard />,
    manager: <ManagerDashboard />,
  };

  return dashboards[user.role] || <NotAuthorized />;
}
\`\`\`

#### Step 3: Implement Each Dashboard

**Sales Dashboard:**
- Quick order entry form (prominent)
- Today's pickups queue
- Payment processing interface
- Recent orders search
- Customer quick-lookup

**Baker Dashboard:**
- "Orders to Bake" queue (sorted by delivery date)
- Ingredient checklist per order
- Layer-by-layer tracking (from your ERD!)
- Status: "Ready for decorator" button
- Calendar view of upcoming bakes

**Decorator Dashboard:**
- "Ready for Decoration" queue (sorted by delivery date)
- Cake design specifications
- Layer-by-layer decoration tracker
- "Mark layer complete" buttons
- Status: "Ready for final approval" button
- Photo gallery of past decorations (inspiration)

**Accountant Dashboard:**
- Revenue reports (daily, weekly, monthly)
- Payment reconciliation
- Order profitability analysis
- Customer acquisition cost
- Preferred customer discount tracking
- Export to accounting software

**Manager Dashboard:**
- All of the above (unified view)
- Staff performance metrics
- Order approval queue
- Exception handling (delays, cancellations)
- Business KPIs summary
- Staff schedule/availability

#### Step 4: Add Role-Based Access Control (RBAC)

\`\`\`typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);

  return {
    user,
    hasRole: (role: string) => user?.role === role,
    hasAnyRole: (roles: string[]) => roles.includes(user?.role),
    canAccess: (feature: string) => {
      const rolePermissions = {
        sales: ['orders', 'customers', 'payments'],
        baker: ['orders', 'dashboard'],
        decorator: ['orders', 'designs'],
        accountant: ['reports', 'settings'],
        manager: ['*'], // all permissions
      };
      return rolePermissions[user?.role]?.includes(feature) || 
             rolePermissions[user?.role]?.includes('*');
    }
  };
}
\`\`\`

#### Step 5: Protect Routes

\`\`\`typescript
// src/pages/admin/AccountantPortal.tsx
export function AccountantPortal() {
  const { user, hasRole } = useAuth();

  if (!hasRole('accountant') && !hasRole('manager')) {
    return <AccessDenied />;
  }

  return (
    <>
      <h1>Financial Reports</h1>
      <RevenueChart />
      <PaymentReconciliation />
    </>
  );
}
\`\`\`

### Why This Matters for Your Project

1. **Aligns with case study**: The case study specifically mentions Bakers, Decorators, Sales Staff, and Accountant—showing different workflows.

2. **ERD implementation**: Your layer tracking (from the professor's notes) is ONLY useful if decorators see it in their dashboard.

3. **Demonstration value**: Showing "role-based access control" in your CIS 3343 presentation proves you understand security principles.

4. **Database utilization**: You've designed a sophisticated ERD; now use it to serve different user needs.

### Effort Assessment

| Task | Hours | Priority |
|------|-------|----------|
| Database: Add Role and Employee tables | 2 | High |
| Auth: Update login to return user role | 2 | High |
| Component: Create 5 dashboard variants | 8-10 | High |
| Route protection: Add role checking | 2 | High |
| Testing: Verify each role's access | 4 | Medium |
| Documentation: Update system design doc | 2 | Medium |
| **TOTAL** | **20-23 hours** | |

**This is achievable and worth the investment.**

---

## 4. Accountant Page: Special Considerations

Dan (the accountant) is a **part-time, external resource** (CPA, Emily's cousin). This requires special design:

### Accountant Access Model

**Option A: Full Portal Access** (Current implied model)
- Dan logs into staff portal
- Sees financial reports, reconciliation, data export
- Can approve transactions
- ❌ But: Dan doesn't need to see baker queues, order details, etc.

**Option B: Restricted Dashboard Only** (Recommended)
- Dan logs into "Finance Portal" (separate subdomain or route)
- Only sees financial reports, reconciliation, export
- No access to customer PII (GDPR-friendly)
- ✅ Better security posture

**Option C: Export-Only (Simplest)**
- Dan gets CSV/PDF exports on a schedule (daily, weekly)
- No portal access required
- Sent via secure email
- ✅ Minimal security risk

### Recommendation: **Option B - Restricted Financial Dashboard**

\`\`\`typescript
// src/pages/admin/dashboards/AccountantDashboard.tsx
import { useAuth } from '../../../hooks/useAuth';

export function AccountantDashboard() {
  const { user, canAccess } = useAuth();

  if (!canAccess('reports')) {
    return <AccessDenied />;
  }

  return (
    <div className="accountant-dashboard">
      <h1>Financial Reports - {new Date().toLocaleDateString()}</h1>
      
      <section>
        <h2>Daily Revenue</h2>
        <RevenueByPaymentMethod />
        <RevenueByProductCategory />
      </section>

      <section>
        <h2>Payment Reconciliation</h2>
        <PaymentReconciliation />
        <DiscrepancyReport />
      </section>

      <section>
        <h2>Exports</h2>
        <ExportButton format="CSV" type="transactions" />
        <ExportButton format="PDF" type="report" />
        <ExportButton format="XLSX" type="reconciliation" />
      </section>
    </div>
  );
}
\`\`\`

---

## 5. Implementation Roadmap

### Phase 1: Minimal Addition (Best for CIS 3343) - 2 weeks
1. Add Employee.Role column to your existing database
2. Update login endpoint to return user role
3. Create basic role-based dashboard routing
4. Implement 2-3 simplified dashboards (Sales, Baker, Manager)

### Phase 2: Full Implementation - 4-6 weeks (Optional post-project)
1. Complete all five role dashboards with full features
2. Add RBAC (role-based access control) on all routes
3. Implement Accountant restricted dashboard
4. Add audit logging for all financial actions

### Phase 3: Security Hardening - 2 weeks (Optional)
1. Add two-factor authentication for staff
2. Implement session timeouts for security
3. Add role-based data encryption
4. Implement comprehensive audit trails

---

## 6. Documentation to Add to Your Project

### Create New File: `AUTHENTICATION_ARCHITECTURE.md`

Include:
- ✅ Decisions you made and WHY
- ✅ Authentication flow diagram
- ✅ Role definitions and permissions matrix
- ✅ Security considerations
- ✅ Future scalability notes

**Excerpt from your doc:**
\`\`\`
## Authentication Strategy

### Decision: Keep Integrated Staff Login
- Rationale: Project timeline, case study scope, business scale
- URL: www.emilybaes.com/admin/login
- Hidden from prominent UX (small button)

### Decision: Role-Based Dashboards
- 5 distinct roles: Sales, Baker, Decorator, Accountant, Manager
- Each role sees only relevant information
- Aligns with case study business workflows
- Improves UX and security

### Decision: Monolithic Architecture (For Now)
- Rationale: CIS 3343 project scope, development timeline
- Feature flags enable future separation
- Shared database is appropriate
- Single deployment simplifies DevOps
\`\`\`

---

## 7. Answers to Your Specific Questions

### Q1: Should you have staff login button on public site?

**Answer: YES, KEEP IT**
- Project timeline demands it
- Business scale supports it
- Consider adding subtle hiding for production
- Document the decision

### Q2: Is it possible to completely separate website from app?

**Answer: YES, but DON'T DO IT NOW**
- Possible: Yes (refactoring effort ~40-60 hours)
- Recommended: No (timeline pressure, wasted effort)
- Alternative: Use feature flags for logical separation
- Future consideration: OK to separate after project submission

### Q3: Should you create different home pages for Bakers, Decorators, Accountant?

**Answer: YES, DO THIS IMMEDIATELY**
- Aligns with case study requirements ✓
- Enables ERD implementation ✓
- Improves UX and security ✓
- Achievable in 2-3 weeks ✓
- Worth 10+ points in CIS 3343 rubric ✓

---

## 8. Rubric Alignment

Based on CIS-3343-Group-Project-Rubric-as-of-October-12th-2025.xlsx:

| Rubric Category | How This Helps | Evidence |
|-----------------|----------------|----------|
| **System Design** | Role-based architecture demonstrates sophisticated design thinking | Role matrix, access control rules |
| **Database Implementation** | Role and Employee tables extend existing design | Updated ERD with new relationships |
| **User Interface** | Multiple dashboards = responsive, role-appropriate UX | Screenshots of each dashboard |
| **Security** | RBAC implementation shows security awareness | Authentication flow, access control documentation |
| **Project Organization** | Decision documentation = professional project management | Architecture decision records |

---

## Conclusion

Your three architectural questions have clear answers:

1. **Keep the staff login button** → Practical for project timeline
2. **Don't separate website/app now** → Use feature flags instead
3. **Implement role-based dashboards** → High value, achievable, rubric-aligned

This approach balances **pragmatism** (CIS 3343 deadline) with **best practices** (RBAC, feature flags) while **maximizing your grade** through demonstrated security and UX expertise.

---

## Next Steps

1. ✅ Review this document with your team
2. ✅ Add Role and Employee tables to your database
3. ✅ Create 5 dashboard mock-ups
4. ✅ Implement role-based routing
5. ✅ Update documentation and ERD
6. ✅ Demo in project presentation

---

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Ready for Implementation  
**Estimated Effort:** 20-23 hours (Phase 1)
