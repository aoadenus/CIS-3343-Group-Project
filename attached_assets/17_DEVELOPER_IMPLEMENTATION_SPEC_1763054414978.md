# Emily Bakes Cakes: Developer Implementation Specification
## Frontend Architecture, Component Structure & Technical Specifications

**Document:** 18_DEVELOPER_IMPLEMENTATION_SPEC.md  
**Project:** Emily Bakes Cakes - CIS 3343 Group 4  
**Date:** November 6, 2025  
**Deadline:** November 21, 2025 (15 days)  
**Audience:** Frontend Developers  
**Status:** Ready for Sprint Planning

---

## Table of Contents

1. [Overview & Setup](#overview--setup)
2. [Folder Structure](#folder-structure)
3. [Shared Components](#shared-components)
4. [Sales Dashboard (Development Guide)](#1-sales-dashboard-development-guide)
5. [Baker Dashboard (Development Guide)](#2-baker-dashboard-development-guide)
6. [Decorator Dashboard (Development Guide)](#3-decorator-dashboard-development-guide)
7. [Accountant Dashboard (Development Guide)](#4-accountant-dashboard-development-guide)
8. [Manager Dashboard (Development Guide)](#5-manager-dashboard-development-guide)
9. [API Integration Points](#api-integration-points)
10. [Database Queries](#database-queries)
11. [Testing Checklist](#testing-checklist)

---

## OVERVIEW & SETUP

### Technology Stack (Confirmed)
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Chart.js or Recharts
- **State Management:** Context API or Redux
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **Notifications:** Socket.io for real-time updates

### Development Environment Setup

\`\`\`bash
# Project initialization
npx create-react-app emily-bakes-dashboard --template typescript
cd emily-bakes-dashboard

# Install dependencies
npm install tailwindcss postcss autoprefixer chart.js recharts axios react-router-dom react-hook-form socket.io-client

# Configure Tailwind
npx tailwindcss init -p

# Directory structure created (see below)
\`\`\`

### Environment Variables (.env)

\`\`\`
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_JWT_SECRET=your_jwt_secret_here
REACT_APP_ENV=development
\`\`\`

---

## FOLDER STRUCTURE

\`\`\`
src/
├── components/
│   ├── shared/
│   │   ├── NavigationSidebar.tsx
│   │   ├── TopNotificationBanner.tsx
│   │   ├── KPISummary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Modal.tsx
│   │
│   ├── sales/
│   │   ├── SalesDashboard.tsx
│   │   ├── NewOrderWizard.tsx
│   │   ├── OrderWizardStep1Customer.tsx
│   │   ├── OrderWizardStep2Cake.tsx
│   │   ├── OrderWizardStep3Layers.tsx
│   │   ├── OrderWizardStep4Colors.tsx
│   │   ├── OrderWizardStep5Decorations.tsx
│   │   ├── OrderWizardStep6Size.tsx
│   │   ├── OrderWizardStep7Instructions.tsx
│   │   ├── OrderWizardStep8Review.tsx
│   │   ├── RushOrderInquiry.tsx
│   │   ├── TodaysPickups.tsx
│   │   ├── RecentCustomers.tsx
│   │   ├── OrderStatusTracker.tsx
│   │   └── SalesKPI.tsx
│   │
│   ├── baker/
│   │   ├── BakerDashboard.tsx
│   │   ├── OrdersToBakeQueue.tsx
│   │   ├── LayerDetailsExpander.tsx
│   │   ├── LayerStatusUpdater.tsx
│   │   ├── SpecialNotesAlerts.tsx
│   │   ├── FlavorBreakdownSummary.tsx
│   │   ├── ReadyForDecoratorQueue.tsx
│   │   └── BakerKPI.tsx
│   │
│   ├── decorator/
│   │   ├── DecoratorDashboard.tsx
│   │   ├── ReadyForDecorationQueue.tsx
│   │   ├── CakeDesignSpec.tsx
│   │   ├── LayerChecklist.tsx
│   │   ├── IcingColorSwatch.tsx
│   │   ├── SuppliesPrepList.tsx
│   │   ├── LastMinuteAlerts.tsx
│   │   ├── CompletedGallery.tsx
│   │   └── DecoratorKPI.tsx
│   │
│   ├── accountant/
│   │   ├── AccountantDashboard.tsx
│   │   ├── DailyRevenueBreakdown.tsx
│   │   ├── PaymentReconciliation.tsx
│   │   ├── CustomerPaymentStatus.tsx
│   │   ├── MonthlySummaryReports.tsx
│   │   ├── FlagConcernForm.tsx
│   │   └── AccountantKPI.tsx
│   │
│   └── manager/
│       ├── ManagerDashboard.tsx
│       ├── StaffActivityOverview.tsx
│       ├── BusinessMetricsDashboard.tsx
│       ├── OrderWorkflowKanban.tsx
│       ├── StaffWorkloadHeatmap.tsx
│       ├── CriticalAlertsQueue.tsx
│       ├── EmergencyDownload.tsx
│       └── ManagerKPI.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   ├── useOrderWizard.ts
│   ├── useAPI.ts
│   ├── useNotifications.ts
│   └── useRealTimeUpdates.ts
│
├── services/
│   ├── authService.ts
│   ├── orderService.ts
│   ├── customerService.ts
│   ├── employeeService.ts
│   ├── revenueService.ts
│   ├── notificationService.ts
│   └── socketService.ts
│
├── types/
│   ├── auth.types.ts
│   ├── order.types.ts
│   ├── customer.types.ts
│   ├── employee.types.ts
│   ├── dashboard.types.ts
│   └── common.types.ts
│
├── context/
│   ├── AuthContext.tsx
│   ├── DashboardContext.tsx
│   └── NotificationContext.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── SalesDashboardPage.tsx
│   ├── BakerDashboardPage.tsx
│   ├── DecoratorDashboardPage.tsx
│   ├── AccountantDashboardPage.tsx
│   ├── ManagerDashboardPage.tsx
│   └── NotFound.tsx
│
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── colors.ts
│
├── styles/
│   ├── tailwind.css
│   └── globals.css
│
├── App.tsx
├── App.css
└── index.tsx

public/
├── index.html
└── favicon.ico

tests/
├── components/
├── hooks/
├── services/
└── utils/

.env
.env.local
package.json
tsconfig.json
tailwind.config.js
postcss.config.js
README.md
\`\`\`

---

## SHARED COMPONENTS

### 1. NavigationSidebar.tsx

\`\`\`typescript
interface NavigationSidebarProps {
  role: 'sales' | 'baker' | 'decorator' | 'accountant' | 'manager';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  onLogout,
}) => {
  // Role-specific navigation items
  const navigationItems = getNavigationByRole(role);

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-8">Emily Bakes</h2>
      <nav className="space-y-4">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full mt-8 px-4 py-2 bg-red-600 rounded">
        Logout
      </button>
    </aside>
  );
};
\`\`\`

### 2. TopNotificationBanner.tsx

\`\`\`typescript
interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'success' | 'error';
  message: string;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
}

const TopNotificationBanner: React.FC<{ notifications: Notification[] }> = ({
  notifications,
}) => {
  const [visible, setVisible] = React.useState(notifications);

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4 space-y-2">
      {visible.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center justify-between p-3 rounded ${
            notif.type === 'alert' ? 'bg-red-900/50 border border-red-700' :
            notif.type === 'warning' ? 'bg-yellow-900/50 border border-yellow-700' :
            'bg-green-900/50 border border-green-700'
          }`}
        >
          <span>{notif.message}</span>
          {notif.action && (
            <button onClick={notif.action.onClick} className="font-bold">
              {notif.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
\`\`\`

### 3. KPISummary.tsx

\`\`\`typescript
interface KPICard {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: string;
  color?: 'green' | 'blue' | 'red' | 'yellow';
}

const KPISummary: React.FC<{ kpis: KPICard[] }> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">{kpi.label}</p>
          <p className="text-3xl font-bold mt-2">{kpi.value}</p>
          {kpi.trend && (
            <p className={`text-sm mt-2 ${
              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.trend === 'up' ? '↑' : '↓'} {kpi.trendValue}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
\`\`\`

### 4. Modal.tsx

\`\`\`typescript
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-96',
    md: 'w-[500px]',
    lg: 'w-[700px]',
    xl: 'w-[900px]',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${sizeClasses[size]} bg-white rounded-lg shadow-xl`}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        <div className="flex justify-end gap-4 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
\`\`\`

---

# 1. SALES DASHBOARD DEVELOPMENT GUIDE

## Component Hierarchy

\`\`\`
SalesDashboardPage
├── TopNotificationBanner (rush orders, confirmations)
├── SalesDashboard (main container)
│   ├── NavigationSidebar
│   ├── MainPanel
│   │   ├── NewOrderWizard (default view)
│   │   │   ├── OrderWizardStep1Customer
│   │   │   ├── OrderWizardStep2Cake
│   │   │   ├── OrderWizardStep3Layers
│   │   │   ├── OrderWizardStep4Colors
│   │   │   ├── OrderWizardStep5Decorations
│   │   │   ├── OrderWizardStep6Size
│   │   │   ├── OrderWizardStep7Instructions
│   │   │   └── OrderWizardStep8Review
│   │   ├── TodaysPickups
│   │   ├── RecentCustomers
│   │   └── OrderStatusTracker
│   └── RightSidebar
│       └── SalesKPI
\`\`\`

## Component Specifications

### SalesDashboard.tsx

\`\`\`typescript
interface SalesDashboardState {
  activeView: 'wizard' | 'pickups' | 'customers' | 'status';
  currentOrder: Order | null;
  wizardStep: number;
  rushOrders: RushOrder[];
  todaysPickups: Pickup[];
}

export const SalesDashboard: React.FC = () => {
  const [state, setState] = React.useState<SalesDashboardState>({
    activeView: 'wizard',
    currentOrder: null,
    wizardStep: 1,
    rushOrders: [],
    todaysPickups: [],
  });

  const { user } = useAuth();
  const { getOrdersForToday, createOrder } = useOrderService();

  React.useEffect(() => {
    // Fetch today's pickups
    fetchTodaysData();
  }, []);

  const handleOrderSubmit = async (orderData: OrderFormData) => {
    try {
      await createOrder(orderData);
      // Reset wizard
      setState((prev) => ({ ...prev, wizardStep: 1, currentOrder: null }));
      showNotification('Order created successfully!', 'success');
    } catch (error) {
      showNotification('Failed to create order', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavigationSidebar role="sales" />
      <div className="flex-1 flex flex-col">
        <TopNotificationBanner notifications={rushOrders} />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            {state.activeView === 'wizard' && <NewOrderWizard onSubmit={handleOrderSubmit} />}
            {state.activeView === 'pickups' && <TodaysPickups />}
            {state.activeView === 'customers' && <RecentCustomers />}
            {state.activeView === 'status' && <OrderStatusTracker />}
          </div>
          <SalesKPI />
        </div>
      </div>
    </div>
  );
};
\`\`\`

### NewOrderWizard.tsx (Multi-Step Form)

\`\`\`typescript
interface OrderFormData {
  customerId: number;
  cakeTypeId: number;
  sizeId: number;
  layers: LayerData[];
  specialInstructions: string;
  pickupDate: Date;
  pickupTime: string;
  totalPrice: number;
  depositAmount: number;
  isRush: boolean;
}

interface LayerData {
  layerNumber: number;
  flavorId: number;
  fillingId: number;
  icingId: number;
  colorId: number;
  decorations: number[];
  notes: string;
}

export const NewOrderWizard: React.FC<{ onSubmit: (data: OrderFormData) => void }> = ({
  onSubmit,
}) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<OrderFormData>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <OrderWizardStep1Customer onDataChange={(data) => setFormData((prev) => ({ ...prev, ...data }))} />;
      case 2:
        return <OrderWizardStep2Cake data={formData} onDataChange={(data) => setFormData((prev) => ({ ...prev, ...data }))} />;
      case 3:
        return <OrderWizardStep3Layers data={formData} onDataChange={(data) => setFormData((prev) => ({ ...prev, ...data }))} />;
      // ... other steps
      case 8:
        return <OrderWizardStep8Review data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">New Order Wizard</h2>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">Step {step} of 8</p>
      </div>

      <div className="mb-8">{renderStep()}</div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        {step < 8 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => onSubmit(formData as OrderFormData)}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Order
          </button>
        )}
      </div>
    </div>
  );
};
\`\`\`

### RushOrderInquiry.tsx

\`\`\`typescript
interface RushOrderRequest {
  customerId: number;
  orderId?: number;
  justification: string;
  requestedCompletionDate: Date;
}

export const RushOrderInquiry: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RushOrderRequest) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, watch } = useForm<RushOrderRequest>();

  const onSubmitForm = (data: RushOrderRequest) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Rush Order Request" onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Justification</label>
          <textarea
            {...register('justification', { required: 'Required' })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Requested Completion Date</label>
          <input
            type="date"
            {...register('requestedCompletionDate', { required: 'Required' })}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-sm text-yellow-800">
            This request will be sent to the manager for approval. You'll be notified once approved or denied.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
};
\`\`\`

## API Endpoints for Sales Dashboard

\`\`\`typescript
// orderService.ts
export const orderServiceAPI = {
  createOrder: (data: OrderFormData) =>
    axios.post('/orders', data),
  
  updateOrderStatus: (orderId: number, status: string) =>
    axios.patch(`/orders/${orderId}/status`, { status }),
  
  getOrdersByCustomer: (customerId: number) =>
    axios.get(`/customers/${customerId}/orders`),
  
  getTodaysPickups: () =>
    axios.get('/orders/pickups/today'),
  
  getRecentCustomers: (limit: number = 10) =>
    axios.get(`/customers/recent?limit=${limit}`),
  
  submitRushOrderRequest: (data: RushOrderRequest) =>
    axios.post('/orders/rush-request', data),

  searchOrders: (query: string) =>
    axios.get(`/orders/search?q=${query}`),
};
\`\`\`

---

# 2. BAKER DASHBOARD DEVELOPMENT GUIDE

## Component Hierarchy

\`\`\`
BakerDashboardPage
├── TopNotificationBanner (allergies, rush alerts)
├── BakerDashboard
│   ├── NavigationSidebar
│   ├── MainPanel
│   │   ├── SpecialNotesAlerts
│   │   ├── OrdersToBakeQueue
│   │   │   └── OrderRow (expandable)
│   │   │       └── LayerDetailsExpander
│   │   │           ├── LayerStatusUpdater
│   │   │           └── LayerNotes
│   │   └── ReadyForDecoratorQueue
│   └── RightSidebar
│       ├── FlavorBreakdownSummary
│       └── BakerKPI
\`\`\`

## OrdersToBakeQueue.tsx

\`\`\`typescript
interface OrderRow {
  orderId: number;
  customerId: number;
  customerName: string;
  pickupDate: Date;
  pickupTime: string;
  layerCount: number;
  status: 'not_started' | 'baking' | 'cooling' | 'ready_for_decorator';
  urgency: 'red' | 'yellow' | 'green';
  layers: LayerDetail[];
  notes: string;
}

export const OrdersToBakeQueue: React.FC = () => {
  const [orders, setOrders] = React.useState<OrderRow[]>([]);
  const [expandedOrder, setExpandedOrder] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [sortBy, setSortBy] = React.useState<'due_time' | 'complexity'>('due_time');

  const { getOrdersToBake } = useOrderService();

  React.useEffect(() => {
    loadOrders();
  }, [filter, sortBy]);

  const loadOrders = async () => {
    const data = await getOrdersToBake({ filter, sortBy });
    setOrders(data);
  };

  const urgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'red':
        return 'border-l-4 border-red-600 bg-red-50';
      case 'yellow':
        return 'border-l-4 border-yellow-600 bg-yellow-50';
      case 'green':
        return 'border-l-4 border-green-600 bg-green-50';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="all">All Urgencies</option>
          <option value="red">🔴 Today (RED)</option>
          <option value="yellow">🟡 Tomorrow (YELLOW)</option>
          <option value="green">🟢 Future (GREEN)</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="due_time">Sort by Due Time</option>
          <option value="complexity">Sort by Complexity</option>
        </select>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order.orderId} className={`rounded-lg shadow p-4 ${urgencyColor(order.urgency)}`}>
            <div
              onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
              className="cursor-pointer flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{order.customerName}</h3>
                <p className="text-sm text-gray-600">
                  Order #{order.orderId} | {order.layerCount} Layers | Due: {format(order.pickupDate, 'MMM dd')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{order.status}</p>
                <p className="text-sm text-gray-600">{order.pickupTime}</p>
              </div>
              <span className="text-xl">{expandedOrder === order.orderId ? '▲' : '▼'}</span>
            </div>

            {expandedOrder === order.orderId && (
              <LayerDetailsExpander order={order} onOrderUpdate={loadOrders} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
\`\`\`

## LayerDetailsExpander.tsx

\`\`\`typescript
export const LayerDetailsExpander: React.FC<{
  order: OrderRow;
  onOrderUpdate: () => void;
}> = ({ order, onOrderUpdate }) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-300 space-y-4">
      {order.layers.map((layer, idx) => (
        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">
              Layer {layer.layerNumber} {layer.layerNumber === 1 ? '(Bottom)' : layer.layerNumber === order.layerCount ? '(Top)' : '(Middle)'}
            </h4>
            <LayerStatusUpdater
              layer={layer}
              orderId={order.orderId}
              onUpdate={onOrderUpdate}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-600">Flavor</p>
              <p className="font-semibold">{layer.flavorName}</p>
            </div>
            <div>
              <p className="text-gray-600">Filling</p>
              <p className="font-semibold">{layer.fillingName}</p>
            </div>
          </div>

          {layer.notes && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
              <p className="font-semibold text-yellow-900">Notes:</p>
              <p>{layer.notes}</p>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs text-gray-600">
              Started: {layer.startTime ? format(layer.startTime, 'HH:mm') : 'Not started'}
              {' | '}
              Baking: {layer.bakingTimeMinutes ? layer.bakingTimeMinutes + ' min' : 'TBD'}
            </p>
          </div>
        </div>
      ))}

      <div className="mt-6">
        {order.notes && (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <p className="font-bold text-red-900 mb-2">⚠️ Special Notes:</p>
            <p className="text-red-900">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Mark All Complete & Notify Decorator
        </button>
      </div>
    </div>
  );
};
\`\`\`

## API Endpoints for Baker Dashboard

\`\`\`typescript
export const bakerServiceAPI = {
  getOrdersToBake: (filters: { filter: string; sortBy: string }) =>
    axios.get('/baker/orders-to-bake', { params: filters }),
  
  updateLayerStatus: (orderId: number, layerNumber: number, status: string) =>
    axios.patch(`/orders/${orderId}/layers/${layerNumber}/status`, { status }),
  
  getFlavorBreakdown: (date: Date) =>
    axios.get('/baker/flavor-breakdown', { params: { date } }),
  
  markReadyForDecorator: (orderId: number) =>
    axios.post(`/orders/${orderId}/ready-for-decorator`),

  getBakerKPIs: () =>
    axios.get('/baker/kpis'),
};
\`\`\`

---

# 3. DECORATOR DASHBOARD DEVELOPMENT GUIDE

## Component Hierarchy

\`\`\`
DecoratorDashboardPage
├── TopNotificationBanner (design changes, rush alerts)
├── DecoratorDashboard
│   ├── NavigationSidebar
│   ├── MainPanel
│   │   ├── ReadyForDecorationQueue
│   │   │   └── QueueItem (clickable)
│   │   ├── CakeDesignSpec (modal)
│   │   │   ├── DesignImage
│   │   │   └── DecorationRequirements
│   │   ├── LayerChecklist
│   │   └── LastMinuteAlerts
│   └── RightSidebar
│       ├── SuppliesPrepList (Icing colors, decorations)
│       └── DecoratorKPI
\`\`\`

## LayerChecklist.tsx

\`\`\`typescript
interface ChecklistItem {
  id: string;
  stepNumber: number;
  description: string;
  layerNumber?: number;
  completed: boolean;
  assignedTo: string;
  startTime?: Date;
  endTime?: Date;
}

export const LayerChecklist: React.FC<{
  orderId: number;
  onChecklistUpdate: () => void;
}> = ({ orderId, onChecklistUpdate }) => {
  const [checklist, setChecklist] = React.useState<ChecklistItem[]>([]);
  const { getDecorationChecklist, updateChecklistItem } = useOrderService();

  React.useEffect(() => {
    loadChecklist();
  }, [orderId]);

  const loadChecklist = async () => {
    const items = await getDecorationChecklist(orderId);
    setChecklist(items);
  };

  const handleCheckItem = async (itemId: string) => {
    const item = checklist.find((c) => c.id === itemId);
    if (item) {
      const updatedItem = {
        ...item,
        completed: !item.completed,
        endTime: !item.completed ? new Date() : undefined,
      };
      await updateChecklistItem(orderId, updatedItem);
      loadChecklist();
      onChecklistUpdate();
    }
  };

  const completionPercentage = (checklist.filter((c) => c.completed).length / checklist.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Decoration Checklist</h3>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">Overall Progress</span>
          <span className="text-sm text-gray-600">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => handleCheckItem(item.id)}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => {}}
              className="w-6 h-6 accent-green-600"
            />
            <div className="flex-1">
              <p className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                {item.stepNumber}. {item.description}
              </p>
              {item.layerNumber && (
                <p className="text-xs text-gray-600">Layer {item.layerNumber}</p>
              )}
            </div>
            {item.completed && item.endTime && (
              <span className="text-xs text-gray-600">✓ {format(item.endTime, 'HH:mm')}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Click each step to mark as complete. All steps must be done before marking cake ready for delivery.
        </p>
      </div>
    </div>
  );
};
\`\`\`

## IcingColorSwatch.tsx

\`\`\`typescript
export const IcingColorSwatch: React.FC<{
  orderId: number;
}> = ({ orderId }) => {
  const [colorsNeeded, setColorsNeeded] = React.useState<ColorSwatch[]>([]);
  const { getColorsForOrder } = useOrderService();

  React.useEffect(() => {
    loadColors();
  }, [orderId]);

  const loadColors = async () => {
    const colors = await getColorsForOrder(orderId);
    setColorsNeeded(colors);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Colors to Prepare</h3>

      <div className="grid grid-cols-2 gap-4">
        {colorsNeeded.map((color) => (
          <div key={color.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded">
            <div
              className="w-12 h-12 rounded border-2 border-gray-300"
              style={{ backgroundColor: color.hexCode }}
            />
            <div>
              <p className="font-semibold text-sm">{color.name}</p>
              <p className="text-xs text-gray-600">Qty: {color.quantity} portions</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="font-bold mb-3">Decorations Needed</h4>
        <ul className="space-y-2">
          {/* Populate from order data */}
          <li className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            Silk Roses (qty: 8)
          </li>
          <li className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            Butterfly Topper
          </li>
          <li className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            Gold Ribbons
          </li>
        </ul>
      </div>
    </div>
  );
};
\`\`\`

## API Endpoints for Decorator Dashboard

\`\`\`typescript
export const decoratorServiceAPI = {
  getReadyForDecoration: () =>
    axios.get('/decorator/ready-queue'),
  
  getDecorationChecklist: (orderId: number) =>
    axios.get(`/orders/${orderId}/decoration-checklist`),
  
  updateChecklistItem: (orderId: number, item: ChecklistItem) =>
    axios.patch(`/orders/${orderId}/checklist-item`, item),
  
  getColorsForOrder: (orderId: number) =>
    axios.get(`/orders/${orderId}/colors-needed`),
  
  getCakeDesignSpec: (orderId: number) =>
    axios.get(`/orders/${orderId}/design-spec`),
  
  markReadyForDelivery: (orderId: number) =>
    axios.post(`/orders/${orderId}/ready-for-delivery`),

  getDecoratorKPIs: () =>
    axios.get('/decorator/kpis'),

  getLastMinuteAlerts: () =>
    axios.get('/decorator/alerts'),
};
\`\`\`

---

# 4. ACCOUNTANT DASHBOARD DEVELOPMENT GUIDE

## DailyRevenueBreakdown.tsx

\`\`\`typescript
export const DailyRevenueBreakdown: React.FC = () => {
  const [dateRange, setDateRange] = React.useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [revenueData, setRevenueData] = React.useState<RevenueEntry[]>([]);
  const { getDailyRevenue } = useRevenueService();

  React.useEffect(() => {
    loadRevenueData();
  }, [dateRange]);

  const loadRevenueData = async () => {
    const data = await getDailyRevenue(dateRange);
    setRevenueData(data);
  };

  const chartData = {
    labels: revenueData.map((r) => format(r.time, 'ha')),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map((r) => r.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
    ],
  };

  const paymentMethodBreakdown = revenueData.reduce(
    (acc, r) => {
      acc[r.paymentMethod] = (acc[r.paymentMethod] || 0) + r.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Daily Revenue</h3>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      <Bar data={chartData} options={{ responsive: true }} />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">Total Revenue</p>
          <p className="text-3xl font-bold text-green-900">
            ${revenueData.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">Transaction Count</p>
          <p className="text-3xl font-bold text-blue-900">{revenueData.length}</p>
        </div>
      </div>

      <div>
        <h4 className="font-bold mb-3">Payment Method Breakdown</h4>
        <div className="space-y-2">
          {Object.entries(paymentMethodBreakdown).map(([method, amount]) => (
            <div key={method} className="flex justify-between p-2 border-b">
              <span className="capitalize">{method}</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
\`\`\`

## PaymentReconciliation.tsx

\`\`\`typescript
export const PaymentReconciliation: React.FC = () => {
  const [reconciliation, setReconciliation] = React.useState<PaymentReconciliationData>();
  const { getPaymentReconciliation } = useRevenueService();

  React.useEffect(() => {
    loadReconciliation();
  }, []);

  const loadReconciliation = async () => {
    const data = await getPaymentReconciliation();
    setReconciliation(data);
  };

  if (!reconciliation) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-600">
        <h4 className="font-bold text-lg mb-4">💵 Collected Today</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Cash:</span>
            <span className="font-semibold">${reconciliation.cash.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Debit:</span>
            <span className="font-semibold">${reconciliation.debit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Credit Cards:</span>
            <span className="font-semibold">${reconciliation.creditCards.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>TOTAL COLLECTED:</span>
            <span className="text-lg">${reconciliation.totalCollected.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-600">
        <h4 className="font-bold text-lg mb-4">⏳ Outstanding</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Pending Deposits:</span>
            <span className="font-semibold">${reconciliation.pendingDeposits.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pending Balance:</span>
            <span className="font-semibold">${reconciliation.pendingBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-yellow-700">
            <span>🔴 Overdue:</span>
            <span className="font-semibold">${reconciliation.overdueAmount.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>TOTAL OUTSTANDING:</span>
            <span className="text-lg">${reconciliation.totalOutstanding.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
\`\`\`

## API Endpoints for Accountant Dashboard

\`\`\`typescript
export const accountantServiceAPI = {
  getDailyRevenue: (range: 'today' | 'week' | 'month' | 'custom') =>
    axios.get('/accountant/revenue', { params: { range } }),
  
  getPaymentReconciliation: () =>
    axios.get('/accountant/reconciliation'),
  
  getCustomerPaymentStatus: (filters: { status?: string; sortBy?: string }) =>
    axios.get('/accountant/customer-payments', { params: filters }),
  
  generateMonthlyReport: (reportType: string) =>
    axios.get(`/accountant/reports/${reportType}`),
  
  exportReport: (format: 'pdf' | 'csv' | 'excel') =>
    axios.get(`/accountant/export`, { params: { format }, responseType: 'blob' }),
  
  flagConcern: (concern: ConcernData) =>
    axios.post('/accountant/flag-concern', concern),

  getAccountantKPIs: () =>
    axios.get('/accountant/kpis'),
};
\`\`\`

---

# 5. MANAGER DASHBOARD DEVELOPMENT GUIDE

## StaffActivityOverview.tsx

\`\`\`typescript
export const StaffActivityOverview: React.FC = () => {
  const [activities, setActivities] = React.useState<StaffActivity[]>([]);
  const [timeRange, setTimeRange] = React.useState<'hour' | 'day' | 'week'>('day');
  const { getStaffActivities } = useEmployeeService();

  React.useEffect(() => {
    loadActivities();
  }, [timeRange]);

  const loadActivities = async () => {
    const data = await getStaffActivities(timeRange);
    setActivities(data);
  };

  const activityByRole = activities.reduce(
    (acc, a) => {
      if (!acc[a.role]) acc[a.role] = [];
      acc[a.role].push(a);
      return acc;
    },
    {} as Record<string, StaffActivity[]>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Staff Activity Overview</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="hour">Last Hour</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
        </select>
      </div>

      <div className="space-y-4">
        {Object.entries(activityByRole).map(([role, roleActivities]) => (
          <div key={role} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-3 capitalize">{role}</h4>
            <ul className="space-y-2 text-sm">
              {roleActivities.slice(0, 3).map((activity, idx) => (
                <li key={idx} className="text-gray-700">
                  {activity.staffName}: {activity.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
\`\`\`

## BusinessMetricsDashboard.tsx

\`\`\`typescript
export const BusinessMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = React.useState<BusinessMetrics>();
  const { getBusinessMetrics } = useManagerService();

  React.useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const data = await getBusinessMetrics();
    setMetrics(data);
  };

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-bold mb-4">Revenue Trend</h4>
        <Line data={metrics.revenueTrendChart} options={{ responsive: true }} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-bold mb-4">Order Status Distribution</h4>
        <Doughnut data={metrics.orderStatusChart} options={{ responsive: true }} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-bold mb-4">Staff Utilization</h4>
        <Bar data={metrics.staffUtilizationChart} options={{ responsive: true }} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-bold mb-4">Customer Satisfaction</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Repeat Orders</span>
              <span className="font-bold">{metrics.repeatOrderPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${metrics.repeatOrderPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>On-Time Delivery</span>
              <span className="font-bold">{metrics.onTimePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${metrics.onTimePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
\`\`\`

## StaffWorkloadHeatmap.tsx

\`\`\`typescript
export const StaffWorkloadHeatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = React.useState<WorkloadEntry[]>([]);
  const { getStaffWorkload } = useManagerService();

  React.useEffect(() => {
    loadWorkload();
  }, []);

  const loadWorkload = async () => {
    const data = await getStaffWorkload();
    setHeatmapData(data);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-600 text-white';
    if (percentage > 70) return 'bg-yellow-600 text-white';
    if (percentage > 50) return 'bg-blue-600 text-white';
    return 'bg-green-600 text-white';
  };

  const getStatusLabel = (percentage: number) => {
    if (percentage > 90) return '🔴 At Capacity';
    if (percentage > 70) return '🟡 Busy';
    if (percentage > 50) return '🟢 Busy';
    return '🟢 Available';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-6">Staff Workload Heatmap</h3>

      <div className="space-y-4">
        {heatmapData.map((entry) => (
          <div key={entry.staffId} className="flex items-center gap-4">
            <div className="w-40">
              <p className="font-semibold">{entry.staffName}</p>
              <p className="text-xs text-gray-600 capitalize">{entry.role}</p>
            </div>

            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all`}
                    style={{
                      width: `${entry.utilizationPercentage}%`,
                      backgroundColor:
                        entry.utilizationPercentage > 90
                          ? 'rgb(220, 38, 38)'
                          : entry.utilizationPercentage > 70
                          ? 'rgb(202, 138, 4)'
                          : entry.utilizationPercentage > 50
                          ? 'rgb(37, 99, 235)'
                          : 'rgb(34, 197, 94)',
                    }}
                  >
                    {entry.utilizationPercentage > 20 && `${entry.utilizationPercentage}%`}
                  </div>
                </div>
                <span className="w-24 text-right text-sm font-semibold">
                  {getStatusLabel(entry.utilizationPercentage)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{entry.currentTasks} tasks assigned</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
\`\`\`

## EmergencyDownload.tsx

\`\`\`typescript
export const EmergencyDownload: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const { downloadEmergencyBackup } = useManagerService();

  const handleDownload = async (format: 'pdf' | 'csv' | 'zip') => {
    setLoading(true);
    try {
      const blob = await downloadEmergencyBackup(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emily-bakes-backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}.${format}`;
      a.click();
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadOptions = [
    {
      format: 'pdf',
      label: 'PDF: Today\'s Orders',
      description: 'Printable summary of all orders for today',
      icon: '📄',
    },
    {
      format: 'pdf',
      label: 'PDF: Customer List',
      description: 'Contact information for all customers',
      icon: '👥',
    },
    {
      format: 'csv',
      label: 'CSV: All Transactions',
      description: 'Financial data in spreadsheet format',
      icon: '💾',
    },
    {
      format: 'zip',
      label: 'ZIP: Complete Backup',
      description: 'All critical business data',
      icon: '📦',
    },
  ];

  return (
    <Modal
      isOpen={true}
      title="Emergency Data Download"
      onClose={() => {}}
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-gray-700 mb-6">
          Download critical business data for backup or offline access. All files are timestamped.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {downloadOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleDownload(option.format as any)}
              disabled={loading}
              className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="text-3xl">{option.icon}</span>
              <div className="text-left">
                <p className="font-bold">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <span className="ml-auto">→</span>
            </button>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm">
          <p className="text-blue-900">
            <strong>💾 Emergency Backup:</strong> Automatically generated timestamps help you identify the correct backup file.
          </p>
        </div>
      </div>
    </Modal>
  );
};
\`\`\`

## API Endpoints for Manager Dashboard

\`\`\`typescript
export const managerServiceAPI = {
  getStaffActivities: (timeRange: 'hour' | 'day' | 'week') =>
    axios.get('/manager/staff-activities', { params: { timeRange } }),
  
  getBusinessMetrics: () =>
    axios.get('/manager/metrics'),
  
  getOrderWorkflow: () =>
    axios.get('/manager/orders/workflow'),
  
  getStaffWorkload: () =>
    axios.get('/manager/staff/workload'),
  
  getCriticalAlerts: () =>
    axios.get('/manager/alerts/critical'),
  
  approveRushOrder: (orderId: number, approved: boolean) =>
    axios.post(`/manager/rush-orders/${orderId}/approve`, { approved }),
  
  downloadEmergencyBackup: (format: 'pdf' | 'csv' | 'zip') =>
    axios.get('/manager/emergency-download', { params: { format }, responseType: 'blob' }),

  getManagerKPIs: () =>
    axios.get('/manager/kpis'),

  flagConcern: (concern: ConcernData) =>
    axios.post('/manager/concerns', concern),
};
\`\`\`

---

# API INTEGRATION POINTS

## Authentication Endpoints

\`\`\`typescript
export const authAPI = {
  login: (email: string, password: string) =>
    axios.post('/auth/login', { email, password }),
  
  logout: () =>
    axios.post('/auth/logout'),
  
  refreshToken: () =>
    axios.post('/auth/refresh'),
  
  getCurrentUser: () =>
    axios.get('/auth/me'),
};
\`\`\`

## Real-Time WebSocket Events

\`\`\`typescript
// socketService.ts
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

// Listen for real-time updates
socket.on('order:created', (order) => {
  // Notify relevant dashboards
});

socket.on('order:status-changed', (orderId, newStatus) => {
  // Update all dashboards
});

socket.on('rush-order:approved', (orderId) => {
  // Notify sales staff
});

socket.on('layer:completed', (orderId, layerNumber) => {
  // Notify decorator
});

socket.on('urgent-alert', (message) => {
  // Show top banner notification
});
\`\`\`

---

# DATABASE QUERIES

## Sample Queries for Dashboard Population

\`\`\`sql
-- Get Orders to Bake (Baker Dashboard)
SELECT 
  o.Order_ID,
  c.Customer_Name,
  o.Pickup_Date,
  o.Pickup_Time,
  COUNT(DISTINCT ol.Layer_Number) as Layer_Count,
  CASE 
    WHEN DATEDIFF(o.Pickup_Date, CURDATE()) = 0 THEN 'red'
    WHEN DATEDIFF(o.Pickup_Date, CURDATE()) = 1 THEN 'yellow'
    ELSE 'green'
  END as Urgency,
  o.Order_Status
FROM CUSTOM_ORDER o
JOIN CUSTOMER c ON o.Cust_ID = c.Cust_ID
JOIN ORDER_LAYER ol ON o.Order_ID = ol.Order_ID
WHERE o.Order_Status IN ('Pending Baking', 'In Baking', 'Cooling')
GROUP BY o.Order_ID
ORDER BY o.Pickup_Date, o.Pickup_Time;

-- Daily Revenue (Accountant Dashboard)
SELECT 
  SUM(o.Firm_Price) as Total_Revenue,
  SUM(CASE WHEN p.Payment_Method = 'Cash' THEN o.Firm_Price ELSE 0 END) as Cash_Revenue,
  SUM(CASE WHEN p.Payment_Method = 'Debit' THEN o.Firm_Price ELSE 0 END) as Debit_Revenue,
  SUM(CASE WHEN p.Payment_Method IN ('Visa', 'Mastercard', 'Amex') THEN o.Firm_Price ELSE 0 END) as Credit_Revenue,
  COUNT(DISTINCT o.Order_ID) as Order_Count
FROM CUSTOM_ORDER o
LEFT JOIN PAYMENT_TRANSACTION p ON o.Order_ID = p.Order_ID
WHERE DATE(o.Order_Date) = CURDATE();

-- Staff Workload (Manager Dashboard)
SELECT 
  e.Employee_ID,
  e.First_Name,
  e.Last_Name,
  e.Role_ID,
  COUNT(DISTINCT o.Order_ID) as Current_Orders,
  ROUND((COUNT(DISTINCT o.Order_ID) / MAX_CAPACITY.limit) * 100, 0) as Utilization_Percentage
FROM EMPLOYEE e
LEFT JOIN CUSTOM_ORDER o ON (
  (e.Role_ID = 1 AND o.Entered_By = e.Employee_ID) OR
  (e.Role_ID = 2 AND o.Order_Status IN ('Pending Baking', 'In Baking')) OR
  (e.Role_ID = 3 AND o.Order_Status IN ('Ready For Decoration', 'In Decoration'))
)
CROSS JOIN (SELECT CASE WHEN Role_ID = 1 THEN 10 WHEN Role_ID = 2 THEN 5 ELSE 3 END as limit FROM ROLE) MAX_CAPACITY
GROUP BY e.Employee_ID;
\`\`\`

---

# TESTING CHECKLIST

## Unit Testing

- [ ] Customer selector autocomplete
- [ ] Order wizard form validation
- [ ] Layer status updater
- [ ] Checklist item toggle
- [ ] Color swatch display
- [ ] Revenue calculations
- [ ] Discount application (preferred customers)
- [ ] Payment reconciliation logic
- [ ] Date range filtering
- [ ] Notifications display

## Integration Testing

- [ ] Login → Dashboard redirect
- [ ] Order creation → Database save → Notification
- [ ] Layer status update → Real-time sync
- [ ] Rush order submission → Manager notification
- [ ] Role-based access (sales can't see accountant data)
- [ ] Real-time socket updates
- [ ] Emergency download functionality
- [ ] Export CSV/PDF

## E2E Testing (Cypress)

\`\`\`typescript
describe('Sales Staff - New Order Wizard', () => {
  it('should complete 8-step wizard and create order', () => {
    cy.login('sales@emilybakes.com', 'DemoPass123!');
    cy.visit('/dashboard');
    cy.get('[data-testid="new-order-btn"]').click();
    
    // Step 1: Customer
    cy.get('[data-testid="customer-search"]').type('Jane Doe');
    cy.get('[data-testid="customer-option-0"]').click();
    cy.get('[data-testid="wizard-next"]').click();
    
    // Step 2: Cake
    cy.get('[data-testid="cake-dropdown"]').select('Birthday Celebration');
    cy.get('[data-testid="wizard-next"]').click();
    
    // ... continue for all 8 steps
    
    cy.get('[data-testid="wizard-submit"]').click();
    cy.get('[data-testid="success-message"]').should('contain', 'Order created');
  });
});

describe('Baker Dashboard - Order Queue', () => {
  it('should expand order and update layer status', () => {
    cy.login('baker@emilybakes.com', 'DemoPass123!');
    cy.visit('/dashboard/baker');
    
    cy.get('[data-testid="order-row-1001"]').click();
    cy.get('[data-testid="layer-status-dropdown-1"]').select('Baking');
    cy.get('[data-testid="layer-status-dropdown-1"]').should('have.value', 'Baking');
  });
});
\`\`\`

## Performance Testing

- [ ] Dashboard load time < 2 seconds
- [ ] Wizard form responsiveness
- [ ] Chart rendering performance (10,000+ data points)
- [ ] Real-time notification latency < 500ms
- [ ] Emergency download generation < 5 seconds

## Security Testing

- [ ] JWT token validation
- [ ] Role-based access enforcement
- [ ] SQL injection prevention
- [ ] XSS attack prevention
- [ ] CORS headers validation
- [ ] Password hashing (bcrypt)
- [ ] Rate limiting

---

## DEPLOYMENT CHECKLIST

Before November 21 Launch:

- [ ] All 5 dashboard components built and tested
- [ ] Database migrations executed
- [ ] Demo accounts created (5 users with correct roles)
- [ ] API endpoints implemented and tested
- [ ] Real-time WebSocket connections working
- [ ] Emergency download feature tested
- [ ] All forms validated
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsiveness checked
- [ ] Accessibility (a11y) tested
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Team training completed
- [ ] Backup & disaster recovery tested

---

**Document Status:** COMPLETE & READY FOR DEVELOPMENT  
**Last Updated:** November 6, 2025  
**Sprint Ready:** YES - Distribute to frontend team immediately
