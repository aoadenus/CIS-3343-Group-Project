import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';
import { ToastProvider } from './components/ToastContext';

// Public Pages
import { PublicHome } from './pages/public/Home';
import { Shop } from './pages/public/Shop';
import { Builder } from './pages/public/Builder';
import { Gallery } from './pages/public/Gallery';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/admin/Login';

// Admin Pages
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

type AppMode = 'public' | 'login' | 'admin';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [appMode, setAppMode] = useState<AppMode>('public');
  const [activePage, setActivePage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500); // 2.5s to match loading animation duration

    return () => clearTimeout(timer);
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
  const handleLogin = (username: string, password: string) => {
    // In a real app, validate credentials
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
        return <PublicHome />;
      case 'shop':
        return <Shop />;
      case 'builder':
        return <Builder />;
      case 'gallery':
        return <Gallery />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <PublicHome />;
    }
  };

  // Render admin pages
  const renderAdminPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'products':
        return <Products />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        {showWelcome && <WelcomeScreen key="welcome" />}
      </AnimatePresence>
      
      {!showWelcome && (
        <AnimatePresence mode="wait">
          {/* Public Interface */}
          {appMode === 'public' && (
            <motion.div
              key="public"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
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
            </motion.div>
          )}

          {/* Login Page */}
          {appMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Login 
                onLogin={handleLogin}
                onBackToPublic={handleBackToPublic}
              />
            </motion.div>
          )}

          {/* Admin Interface */}
          {appMode === 'admin' && isAuthenticated && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </ToastProvider>
  );
}
