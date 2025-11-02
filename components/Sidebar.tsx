import { useState } from 'react';
import { LayoutDashboard, ClipboardList, Users, Cake, BarChart3, Star, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const mainMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'products', label: 'Products', icon: Cake },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback', icon: Star },
];

const bottomMenuItem = { id: 'settings', label: 'Settings', icon: Settings };

export function Sidebar({ activePage, onNavigate, onCollapsedChange, mobileOpen, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const renderMenuItem = (item: typeof mainMenuItems[0]) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => handleNavigate(item.id)}
        className={cn(
          "w-full flex items-center relative transition-all duration-300",
          isCollapsed ? "justify-center" : "",
          isActive ? "bg-[#C44569]" : "hover:bg-[#5A3825]/10"
        )}
        style={{
          height: '60px',
          paddingLeft: isCollapsed ? '0' : '24px',
          paddingRight: isCollapsed ? '0' : '24px',
          borderRadius: '8px',
        }}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={cn("flex items-center", isCollapsed ? "" : "gap-3")}>
          <Icon size={24} color={isActive ? "#FFFFFF" : "#2B2B2B"} strokeWidth={1.5} />
          {!isCollapsed && (
            <span 
              style={{ 
                fontFamily: 'Open Sans', 
                fontSize: '15px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FFFFFF' : '#5A3825',
              }}
            >
              {item.label}
            </span>
          )}
        </div>
      </button>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside 
      className={cn(
        "hidden lg:flex h-full fixed left-0 top-[88px] transition-all duration-300 flex-col",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}
      style={{
        background: '#FFFFFF',
        height: 'calc(100vh - 88px)',
        borderRight: '1px solid rgba(90, 56, 37, 0.15)',
        boxShadow: '2px 0 8px rgba(90, 56, 37, 0.08)',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-[#C44569] rounded-full flex items-center justify-center hover:bg-[#A63555] transition-colors shadow-bakery z-10"
      >
        {isCollapsed ? (
          <ChevronRight size={14} color="white" />
        ) : (
          <ChevronLeft size={14} color="white" />
        )}
      </button>

      {/* Main Menu Items */}
      <nav className="flex-1 px-4" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mainMenuItems.map(renderMenuItem)}
        </div>
      </nav>

      {/* Settings at Bottom */}
      <div style={{ marginBottom: '24px', paddingLeft: '16px', paddingRight: '16px' }}>
        {renderMenuItem(bottomMenuItem)}
      </div>
    </aside>
  );

  // Mobile Drawer Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="lg:hidden fixed inset-0 bg-black/40 z-50"
            style={{ top: '88px' }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 z-50 flex flex-col w-[280px] sm:w-[320px]"
            style={{
              top: '88px',
              height: 'calc(100vh - 88px)',
              background: '#FFFFFF',
              boxShadow: '4px 0 24px rgba(90, 56, 37, 0.15)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onMobileClose}
              className="absolute right-4 top-4 p-2 hover:bg-[#F8EBD7] rounded-lg transition-colors"
            >
              <X size={24} color="#C44569" />
            </button>

            {/* Main Menu Items */}
            <nav className="flex-1 px-4" style={{ marginTop: '60px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center relative transition-all duration-300 gap-4",
                        isActive ? "bg-[#C44569]" : "hover:bg-[#5A3825]/10"
                      )}
                      style={{
                        height: '56px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        borderRadius: '8px',
                      }}
                    >
                      <Icon size={24} color={isActive ? "#FFFFFF" : "#2B2B2B"} strokeWidth={1.5} />
                      <span 
                        style={{ 
                          fontFamily: 'Open Sans', 
                          fontSize: '15px',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#FFFFFF' : '#5A3825',
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Settings at Bottom */}
            <div style={{ marginBottom: '24px', paddingLeft: '16px', paddingRight: '16px' }}>
              {(() => {
                const Icon = bottomMenuItem.icon;
                const isActive = activePage === bottomMenuItem.id;
                
                return (
                  <button
                    onClick={() => handleNavigate(bottomMenuItem.id)}
                    className={cn(
                      "w-full flex items-center relative transition-all duration-300 gap-4",
                      isActive ? "bg-[#C44569]" : "hover:bg-[#5A3825]/10"
                    )}
                    style={{
                      height: '56px',
                      paddingLeft: '20px',
                      paddingRight: '20px',
                      borderRadius: '8px',
                    }}
                  >
                    <Icon size={24} color={isActive ? "#FFFFFF" : "#2B2B2B"} strokeWidth={1.5} />
                    <span 
                      style={{ 
                        fontFamily: 'Open Sans', 
                        fontSize: '15px',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#FFFFFF' : '#5A3825',
                      }}
                    >
                      {bottomMenuItem.label}
                    </span>
                  </button>
                );
              })()}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
