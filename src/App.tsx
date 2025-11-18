import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';
import { ToastProvider } from './components/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public pages - direct imports
import { PublicHome } from './pages/public/Home';
import Menu from './pages/public/Menu';
import { Gallery } from './pages/public/Gallery';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { TrackOrder } from './pages/public/TrackOrder';

// Admin pages - direct imports
import Login from './pages/admin/Login';
import { OrderBoard } from './pages/admin/OrderBoard';
import { OrderList } from './pages/admin/OrderList';
import { WizardContainer } from './pages/admin/order-create/WizardContainer';
import { Builder } from './pages/admin/Builder';
import { AdminProducts } from './pages/admin/Products';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { StaffManagement } from './pages/StaffManagement';

// Role-based dashboards
import { SalesDashboard } from './pages/admin/dashboards/SalesDashboard';
import { BakerDashboard } from './pages/admin/dashboards/BakerDashboard';
import { DecoratorDashboard } from './pages/admin/dashboards/DecoratorDashboard';
import { AccountantDashboard } from './pages/admin/dashboards/AccountantDashboard';
import { ManagerDashboard } from './pages/admin/dashboards/ManagerDashboard';

// Staff Reports
import { OrderSummaryReport } from './pages/staff/OrderSummaryReport';
import { CustomerListReport } from './pages/staff/CustomerListReport';
import { RevenueReport } from './pages/staff/RevenueReport';
import { PendingOrdersReport } from './pages/staff/reports/PendingOrdersReport';
import { CompletedOrdersReport } from './pages/staff/reports/CompletedOrdersReport';
import { ProductInventoryReport } from './pages/staff/reports/ProductInventoryReport';

type AppMode = 'public' | 'login' | 'admin';

export default function App() {
  // Disable welcome screen entirely to fix freezing issues
  const [showWelcome] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('public');
  const [activePage, setActivePage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Decode JWT to get user role
  const getUserRole = (): string => {
    const token = localStorage.getItem('token');
    if (!token) return 'sales';
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'sales';
    } catch {
      return 'sales';
    }
  };

  // Decode JWT to get user name
  const getUserName = (): string => {
    const token = localStorage.getItem('token');
    if (!token) return 'Guest User';
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name || 'Guest User';
    } catch {
      return 'Guest User';
    }
  };

  useEffect(() => {
    console.log('🌐 Emily Bakes Cakes - Loaded');
    
    // Initialize userRole from JWT on page load/refresh
    const token = localStorage.getItem('token');
    if (token) {
      const role = getUserRole();
      setUserRole(role);
      setIsAuthenticated(true);
      setAppMode('admin');
      setActivePage('analytics-dashboard');
    } else {
      setUserRole('sales'); // Default for non-authenticated users
    }
    setIsInitializing(false);
  }, []);

  // Scroll to top instantly on page change (Y:0 reset)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activePage, appMode]);

  // Handle navigation for public pages
  const handlePublicNavigate = (page: string) => {
    setActivePage(page);
  };

  // Handle admin access
  const handleAdminAccess = () => {
    setAppMode('login');
  };

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    setAppMode('admin');
    const role = getUserRole();
    setUserRole(role);
    // Set default page based on role
    setActivePage('analytics-dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT token
    setIsAuthenticated(false);
    setUserRole('sales');
    setAppMode('login');
  };

  // Handle back to public from login
  const handleBackToPublic = () => {
    setAppMode('public');
    setActivePage('home');
  };

  // Render public pages
  const renderPublicPage = () => {
    switch (activePage) {
      case 'home':
        return <PublicHome onNavigate={handlePublicNavigate} />;
      case 'menu':
        return <Menu />;
      case 'gallery':
        return <Gallery />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'track':
        return <TrackOrder />;
      default:
        return <PublicHome onNavigate={handlePublicNavigate} />;
    }
  };

  // Render admin pages - Professional OMS naming
  const renderAdminPage = () => {
    // Show loading state while role is being determined
    if (isInitializing || userRole === null) {
      return (
        <div className="h-screen flex items-center justify-center" style={{ background: '#F8EBD7' }}>
          <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#5A3825' }}>Loading...</p>
        </div>
      );
    }

    // Role-based dashboard routing
    const getRoleDashboard = () => {
      switch (userRole) {
        case 'sales':
          return <SalesDashboard onNavigate={setActivePage} />;
        case 'baker':
          return <BakerDashboard onNavigate={setActivePage} />;
        case 'decorator':
          return <DecoratorDashboard onNavigate={setActivePage} />;
        case 'accountant':
          return <AccountantDashboard onNavigate={setActivePage} />;
        case 'manager':
        case 'owner':
          return <ManagerDashboard onNavigate={setActivePage} />;
        default:
          return <SalesDashboard onNavigate={setActivePage} />;
      }
    };

    switch (activePage) {
      // Modern OMS Pages
      case 'analytics-dashboard':
        return getRoleDashboard();
      case 'fulfillment-board':
        return <OrderBoard />;
      case 'order-management':
        return <OrderList onNavigate={setActivePage} />;
      case 'order-create':
        return <WizardContainer onBack={() => setActivePage('order-management')} onNavigate={setActivePage} />;
      case 'design-sandbox':
        return <Builder />;
      case 'inventory-management':
        return <AdminProducts />;
      case 'customer-accounts':
        return <Customers />;
      case 'business-intelligence':
        return <Reports onNavigate={setActivePage} userRole={userRole || undefined} />;
      case 'order-summary-report':
        // RBAC: Sales, Baker, Decorator, Accountant, Manager, Owner
        if (['sales', 'baker', 'decorator', 'accountant', 'manager', 'owner'].includes(userRole || '')) {
          return <OrderSummaryReport />;
        }
        return getRoleDashboard(); // Redirect unauthorized users to their dashboard
      case 'customer-list-report':
        // RBAC: Sales, Baker, Decorator, Accountant, Manager, Owner
        if (['sales', 'baker', 'decorator', 'accountant', 'manager', 'owner'].includes(userRole || '')) {
          return <CustomerListReport />;
        }
        return getRoleDashboard(); // Redirect unauthorized users to their dashboard
      case 'revenue-report':
        // RBAC: Accountant, Manager, Owner (Financial Report)
        if (['accountant', 'manager', 'owner'].includes(userRole || '')) {
          return <RevenueReport />;
        }
        return getRoleDashboard(); // Redirect unauthorized users to their dashboard
      case 'pending-orders-report':
        // RBAC: Sales, Baker, Decorator, Accountant, Manager, Owner
        if (['sales', 'baker', 'decorator', 'accountant', 'manager', 'owner'].includes(userRole || '')) {
          return <PendingOrdersReport />;
        }
        return getRoleDashboard(); // Redirect unauthorized users to their dashboard
      case 'completed-orders-report':
        // RBAC: Sales, Baker, Decorator, Accountant, Manager, Owner
        if (['sales', 'baker', 'decorator', 'accountant', 'manager', 'owner'].includes(userRole || '')) {
          return <CompletedOrdersReport />;
        }
        return getRoleDashboard(); // Redirect unauthorized users to their dashboard
      case 'product-inventory-report':
        // RBAC: Accountant, Manager, Owner (Inventory & Financial Data)
        if (['accountant', 'manager', 'owner'].includes(userRole || '')) {
          return <ProductInventoryReport />;
        }
        return getRoleDashboard(); // Redirect unauthorized users to their dashboard
      case 'system-configuration':
        return <Settings />;
      case 'staff-management':
        // RBAC: Manager/Owner ONLY
        if (['manager', 'owner'].includes(userRole || '')) {
          return <StaffManagement />;
        }
        return getRoleDashboard(); // Redirect unauthorized users to their dashboard
      
      // Legacy routes (backward compatibility)
      case 'dashboard':
      case 'analytics':
        return getRoleDashboard();
      case 'order-board':
        return <OrderBoard />;
      case 'order-list':
        return <OrderList onNavigate={setActivePage} />;
      case 'products-new':
        return <AdminProducts />;
      case 'customers':
        return <Customers />;
      case 'reports':
        return <Reports userRole={userRole || undefined} />;
      case 'settings':
        return <Settings />;
      
      // Deprecated legacy pages
      case 'orders':
        return <Orders />;
      case 'products':
        return <Products />;
      
      default:
        return getRoleDashboard();
    }
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AnimatePresence>
          {showWelcome ? (
            <WelcomeScreen key="welcome" />
          ) : (
          <motion.div
            key={appMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ minHeight: '100vh' }}
          >
            {appMode === 'public' && (
              <PublicLayout 
                activePage={activePage} 
                onNavigate={handlePublicNavigate}
                onAdminAccess={handleAdminAccess}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderPublicPage()}
                  </motion.div>
                </AnimatePresence>
              </PublicLayout>
            )}

            {appMode === 'login' && (
              <Login 
                onLogin={handleLogin}
                onBackToPublic={handleBackToPublic}
                onLogout={handleLogout}
              />
            )}

            {appMode === 'admin' && isAuthenticated && (
              <AdminLayout
                activePage={activePage}
                onNavigate={setActivePage}
                onLogout={handleLogout}
                userName={getUserName()}
                userRole={getUserRole()}
              >
                <div className="light-theme">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderAdminPage()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </AdminLayout>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </ToastProvider>
    </ErrorBoundary>
  );
}
