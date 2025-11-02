import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, X } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  onAdminAccess: () => void;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'builder', label: 'Custom Builder' },
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 overflow-y-auto"
            style={{
              background: 'white',
              boxShadow: '-4px 0 24px rgba(90, 56, 37, 0.15)'
            }}
          >
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={onClose}
                  style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    background: 'rgba(196, 69, 105, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(196, 69, 105, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(196, 69, 105, 0.1)';
                  }}
                >
                  <X size={24} color="#C44569" />
                </button>
              </div>

              {/* Logo */}
              <div className="mb-12">
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
              <nav className="space-y-2 mb-8">
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
                      fontSize: '16px',
                      color: activePage === item.id ? '#C44569' : '#5A3825',
                      background: activePage === item.id ? 'rgba(196, 69, 105, 0.1)' : 'transparent',
                      padding: '16px 20px',
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

              {/* Divider */}
              <div className="border-t mb-6" style={{ borderColor: 'rgba(90, 56, 37, 0.15)' }} />

              {/* Staff Login Button */}
              <button
                onClick={() => {
                  onAdminAccess();
                  onClose();
                }}
                style={{
                  background: '#C44569',
                  color: 'white',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '15px',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(196, 69, 105, 0.3)',
                  minHeight: '56px',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(196, 69, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.3)';
                }}
              >
                <User size={20} />
                Staff Login
              </button>

              {/* Contact Info */}
              <div className="mt-12 p-6 rounded-xl" style={{ background: 'rgba(248, 235, 215, 0.5)' }}>
                <p style={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#2B2B2B',
                  marginBottom: '12px'
                }}>
                  Contact Us
                </p>
                <div className="space-y-2" style={{ fontSize: '14px', color: '#5A3825' }}>
                  <p>(555) 123-4567</p>
                  <p>hello@emilybakescakes.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
