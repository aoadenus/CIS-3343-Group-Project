import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';
import { ToastProvider } from './components/ToastContext';
import { InquiriesProvider } from './contexts/InquiriesContext';

// Public Pages
import { PublicHome } from './pages/public/Home';
import { Shop } from './pages/public/Shop';
import { Builder } from './pages/public/Builder';
import { Gallery } from './pages/public/Gallery';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/admin/Login';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { OrderBoard } from './pages/admin/OrderBoard';
import { OrderList } from './pages/admin/OrderList';
import { AdminProducts } from './pages/admin/Products';
import { Inquiries } from './pages/admin/Inquiries';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

type AppMode = 'public' | 'login' | 'admin';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    const welcomeDone = sessionStorage.getItem('welcomeDone');
    return welcomeDone !== 'true';
  });
  const [appMode, setAppMode] = useState<AppMode>('public');
  const [activePage, setActivePage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isReplitExternal = window.location.hostname.includes('replit.dev') || 
                             window.location.hostname.includes('repl.co');
    const isReplitPreview = window.location !== window.parent.location;
    
    console.log('🌐 Emily Bakes Cakes - Environment Detection');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('URL:', window.location.href);
    console.log('Hostname:', window.location.hostname);
    console.log('Protocol:', window.location.protocol);
    console.log('Is Replit External:', isReplitExternal);
    console.log('Is Preview (iframe):', isReplitPreview);
    console.log('Screen Size:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('welcomeDone', 'true');
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

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
    setActivePage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAppMode('public');
    setActivePage('home');
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
      case 'shop':
        return <Shop onNavigate={handlePublicNavigate} />;
      case 'builder':
        return <Builder />;
      case 'gallery':
        return <Gallery />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <PublicHome onNavigate={handlePublicNavigate} />;
    }
  };

  // Render admin pages
  const renderAdminPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'analytics':
        return <AdminDashboard />;
      case 'order-board':
        return <OrderBoard />;
      case 'order-list':
        return <OrderList />;
      case 'inquiries':
        return <Inquiries />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'products-new':
        return <AdminProducts />;
      case 'products':
        return <Products />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <InquiriesProvider>
      <ToastProvider>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeScreen key="welcome" />
        ) : (
          <motion.div
            key={appMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
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
              />
            )}

            {appMode === 'admin' && isAuthenticated && (
              <AdminLayout
                activePage={activePage}
                onNavigate={setActivePage}
                onLogout={handleLogout}
              >
                <div className="light-theme">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
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
    </InquiriesProvider>
  );
}
