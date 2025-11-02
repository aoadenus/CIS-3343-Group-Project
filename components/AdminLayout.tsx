import { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Cake, 
  BarChart3, 
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'products', label: 'Products', icon: Cake },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function AdminLayout({ children, activePage, onNavigate, onLogout }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>
      {/* BACK-END: Charcoal Gray Top Header */}
      <header 
        className="fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-6 lg:px-8"
        style={{
          background: '#2B2B2B',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Menu size={24} color="#FFFFFF" />
          </button>

          <h3 
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: 'clamp(18px, 4vw, 22px)',
              color: '#FFFFFF',
              letterSpacing: '0.3px'
            }}
          >
            Emily Bakes Cakes
          </h3>
          <span 
            className="hidden sm:inline-block px-3 py-1 rounded-full text-xs"
            style={{
              background: 'rgba(196, 69, 105, 0.2)',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.5px',
              border: '1px solid rgba(196, 69, 105, 0.3)'
            }}
          >
            ADMIN PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>EB</span>
            </div>
            <div className="hidden lg:block">
              <p style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif'
              }}>
                Emily Baker
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                Administrator
              </p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="p-2 hover:bg-white/10"
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              minWidth: '44px',
              minHeight: '44px'
            }}
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      {/* BACK-END: Fixed Left Sidebar (Collapsible) */}
      <aside
        className={`hidden lg:block fixed left-0 top-16 bottom-0 transition-all duration-300 z-30`}
        style={{
          width: sidebarCollapsed ? '80px' : '260px',
          background: '#FFFFFF',
          borderRight: '1px solid #E0E0E0',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: '#C44569',
            boxShadow: '0 2px 6px rgba(196, 69, 105, 0.3)',
            border: '2px solid #FFFFFF'
          }}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={14} color="white" strokeWidth={2.5} />
          ) : (
            <ChevronLeft size={14} color="white" strokeWidth={2.5} />
          )}
        </button>

        <nav className="p-3 space-y-1" style={{ marginTop: '16px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.05) 100%)' 
                    : 'transparent',
                  color: isActive ? '#C44569' : '#2B2B2B',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '15px',
                  border: isActive ? '1px solid rgba(196, 69, 105, 0.2)' : '1px solid transparent'
                }}
                whileHover={{
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(196, 69, 105, 0.15) 0%, rgba(196, 69, 105, 0.08) 100%)' 
                    : 'rgba(43, 43, 43, 0.03)',
                  scale: 1.01
                }}
                whileTap={{ scale: 0.98 }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={20} strokeWidth={2} />
                {!sidebarCollapsed && (
                  <span>{item.label}</span>
                )}
                {!sidebarCollapsed && isActive && (
                  <div 
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ background: '#C44569' }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50"
              style={{
                background: '#FFFFFF',
                boxShadow: '4px 0 16px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '20px',
                      color: '#2B2B2B'
                    }}
                  >
                    Admin Menu
                  </h3>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={24} color="#2B2B2B" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                        style={{
                          background: isActive 
                            ? 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.05) 100%)' 
                            : 'transparent',
                          color: isActive ? '#C44569' : '#2B2B2B',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '15px',
                          border: isActive ? '1px solid rgba(196, 69, 105, 0.2)' : '1px solid transparent'
                        }}
                      >
                        <Icon size={20} strokeWidth={2} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* BACK-END: Main Content Area with Subtle Gradient */}
      <main
        className="pt-16 transition-all duration-300"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? (sidebarCollapsed ? '80px' : '260px') 
            : '0',
          minHeight: 'calc(100vh - 64px)',
          padding: '32px',
          background: 'linear-gradient(135deg, #F5F5F5 0%, #EBEBEB 50%, #F5F5F5 100%)'
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
