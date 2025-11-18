import { useState } from 'react';
import { 
  Users, 
  Cake, 
  BarChart3, 
  Settings as SettingsIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Kanban,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Button is not used in AdminLayout; remove to satisfy type-check
import BackToSiteDropdown from './BackToSiteDropdown';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

// Professional OMS Navigation Structure
const navItems = [
  { id: 'analytics-dashboard', label: 'Dashboard', icon: TrendingUp, description: 'Role-Based Dashboard' },
  { id: 'fulfillment-board', label: 'Fulfillment Board', icon: Kanban, description: 'Visual Order Tracking' },
  { id: 'order-management', label: 'Orders', icon: List, description: 'Order Management Center' },
  { id: 'inventory-management', label: 'Product Catalog', icon: Cake, description: 'Product Management' },
  { id: 'customer-accounts', label: 'Customers', icon: Users, description: 'Customer Management' },
  { id: 'business-intelligence', label: 'Reports', icon: BarChart3, description: 'Business Reports' },
  { id: 'system-configuration', label: 'Settings', icon: SettingsIcon, description: 'System Settings' },
];

export function AdminLayout({ children, activePage, onNavigate, onLogout, userName, userRole }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const displayName = userName || 'Emily Baker';
  const displayRole = userRole ? formatRole(userRole) : 'Administrator';
  const initials = getInitials(displayName);

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: '#F8EBD7' }}>
      {/* BACK-END: Charcoal Gray Top Header */}
      <header 
        className="flex-shrink-0 h-16 z-40 flex items-center justify-between px-6 lg:px-8"
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
              <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>{initials}</span>
            </div>
            <div className="hidden lg:block">
              <p style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif'
              }}>
                {displayName}
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                {displayRole}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => onNavigate('order-create')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md"
              style={{
                background: '#C44569',
                color: '#FFFFFF',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)'
              }}
            >
              New Order
            </button>
            <BackToSiteDropdown onLogout={onLogout} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* BACK-END: Fixed Left Sidebar (Collapsible) */}
        <aside
          className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 z-30`}
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

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{ marginTop: '16px' }}>
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

        {/* BACK-END: Main Content Area with Vanilla Cream Background */}
        <main
          className="flex-1 overflow-auto"
          style={{
            padding: '24px',
            background: '#F8EBD7'
          }}
        >
          <div className="h-full" style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
