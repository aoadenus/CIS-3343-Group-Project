# Emily Bakes Cakes - Presentation-Ready Build Plan
## CIS 3343 Class Project - Due Nov 21, 2025

## Current State Analysis ✅

### What Already Exists:
1. ✅ 6 Role-Based Dashboards (Owner, Manager, Sales, Baker, Decorator, Accountant)
2. ✅ Orders Management Page
3. ✅ Customers Management Page
4. ✅ Products Catalog Page
5. ✅ Reports/Business Intelligence Page
6. ✅ Fulfillment Board (Kanban)
7. ✅ Brand Colors in Tailwind Config
8. ✅ Modern UI Components

### What Needs Enhancement for Presentation:

#### 1. Dashboards - Add Mock Data Fallbacks
Each dashboard currently tries to fetch from API. For presentation, need:
- **Add mock data** that displays when API isn't available
- **Visual differentiation** - each role sees different priorities
- **Professional polish** - ensure Emily Bakes Cakes branding

#### 2. Product Catalog - Show 14 Cakes
Current state: Only 3 products defined
Need: Expand to 14 signature cakes from case study

#### 3. Mock Data for Demo
- Sample orders with realistic data
- Sample customers (retail + corporate, preferred flags)
- Sample metrics/KPIs

## Build Strategy

### Phase 1: Enhanced Mock Data System ✅
Create `src/data/presentationData.ts` with:
- 14 signature cakes
- 20+ sample orders with various statuses
- 15+ sample customers (mix of retail/corporate)
- Mock KPIs for each role

### Phase 2: Dashboard Enhancements
Update each dashboard to use mock data when API fails:
- **Owner Dashboard**: Business metrics, approval queue
- **Manager Dashboard**: Team performance, SLA metrics
- **Sales Dashboard**: Today's orders, deposit compliance
- **Baker Dashboard**: Production queue, timing metrics
- **Decorator Dashboard**: Decoration queue, handoff tracking
- **Accountant Dashboard**: Revenue, outstanding balances

### Phase 3: Visual Polish
- Ensure consistent Emily Bakes Cakes branding
- Add loading states with mock data
- Professional typography and spacing
- Responsive layouts

## Emily Bakes Cakes - Brand Identity

### Colors (from Case Study):
- **Primary**: #C44569 (Raspberry Pink)
- **Background**: #F8EBD7 (Cream)
- **Text**: #5A3825 (Brown)
- **Secondary**: #2B2B2B (Charcoal)

### 14 Signature Cakes (from Case Study):
1. Birthday Celebration
2. Chocolate Doberge
3. Lemon Doberge
4. German Chocolate
5. Italian Cream
6. Black Forest
7. Strawberry Delight
8. Almond Delight
9. Red Velvet
10. Carrot Cake
11. Pineapple Upside Down
12. Coconut Cream
13. Hummingbird Cake
14. Texas Sheet Cake

### 6 Staff Roles:
1. **Owner** - Strategic overview, approvals
2. **Manager** - Operations, team management
3. **Sales** - Order entry, customer service
4. **Baker** - Production queue, baking tasks
5. **Decorator** - Decoration queue, finishing
6. **Accountant** - Financial tracking, payments

### Business Problem (from Case Study):
- Losing $4,800/year on cancelled orders
- Wasting 20hrs/week on paper-based processes
- Need for deposit tracking (50% upfront policy)
- Need for retail vs corporate customer management

## Implementation Checklist

### Immediate Actions:
- [ ] Create comprehensive mock data file
- [ ] Update product catalog to show 14 cakes
- [ ] Add mock data fallbacks to all dashboards
- [ ] Ensure visual distinction between role dashboards
- [ ] Test presentation mode with no backend

### Success Criteria:
- ✅ All 6 dashboards display unique content
- ✅ 14 cakes visible in product catalog
- ✅ Orders page shows variety of statuses
- ✅ Customers page shows retail/corporate distinction
- ✅ Fulfillment board has cards in all columns
- ✅ Professional visual polish throughout
- ✅ Works without backend (mock data)
