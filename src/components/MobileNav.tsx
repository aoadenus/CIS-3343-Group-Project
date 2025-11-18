import { motion, AnimatePresence } from 'motion/react';
import { StaffLoginCTA } from './StaffLoginCTA';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  onAdminAccess?: () => void;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
];

export function MobileNav({ isOpen, onClose, activePage, onNavigate, onAdminAccess }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 10000 }}
            onClick={onClose}
            aria-label="Close menu"
          />
          
          {/* Menu Panel - Fits on desktop, scrollable on mobile */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm"
            style={{
              background: 'white',
              boxShadow: '-4px 0 24px rgba(90, 56, 37, 0.15)',
              zIndex: 10000,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem'
            }}
          >
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex justify-end mb-6" style={{ flexShrink: 0 }}>
                <button
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  style={{
                    width: '48px',
                    height: '48px',
                    minWidth: '48px',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    background: '#C44569',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(196, 69, 105, 0.3)',
                    padding: '0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#B03D5E';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#C44569';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.background = '#B03D5E';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.background = '#C44569';
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      display: 'block',
                      flexShrink: 0
                    }}
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Logo */}
              <div className="mb-8">
                <h3 style={{
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  fontSize: '28px',
                  color: '#C44569',
                  textAlign: 'center'
                }}>
                  Emily Bakes Cakes
                </h3>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 mb-6 flex-shrink-0">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className="block w-full text-left rounded-xl transition-all"
                    style={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: activePage === item.id ? '#C44569' : '#5A3825',
                      background: activePage === item.id ? 'rgba(196, 69, 105, 0.1)' : 'transparent',
                      padding: '12px 20px',
                      border: 'none',
                      cursor: 'pointer',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => {
                      if (activePage !== item.id) {
                        e.currentTarget.style.background = 'rgba(90, 56, 37, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activePage !== item.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-6 p-4 rounded-xl flex-shrink-0" style={{ background: 'rgba(248, 235, 215, 0.5)' }}>
                <p style={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#2B2B2B',
                  marginBottom: '8px'
                }}>
                  Contact Us
                </p>
                <div className="space-y-1" style={{ fontSize: '13px', color: '#5A3825' }}>
                  <p>(713) 555-CAKE</p>
                  <p>info@emilybakescakes.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
