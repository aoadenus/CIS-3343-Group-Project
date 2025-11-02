import { useState, useEffect } from 'react';
import { ShoppingBag, User, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { HamburgerIcon } from './HamburgerIcon';
import { MobileNav } from './MobileNav';
import { StickyBottomCTA } from './StickyBottomCTA';

interface PublicLayoutProps {
  children: React.ReactNode;
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

export function PublicLayout({ children, activePage, onNavigate, onAdminAccess }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderClick = () => {
    onNavigate('builder');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8EBD7' }}>
      {/* FRONT-END: Raspberry Pink Navigation Bar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled 
            ? '#C44569'  // Solid Raspberry Pink when scrolled
            : 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)', // Gradient when at top
          boxShadow: scrolled 
            ? '0 2px 12px rgba(196, 69, 105, 0.3)' 
            : '0 4px 16px rgba(196, 69, 105, 0.25)'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-24">
          <div className="flex items-center justify-between" style={{ height: '72px' }}>
            {/* Logo with Heart Icon */}
            <motion.div
              className="cursor-pointer flex items-center gap-2"
              onClick={() => onNavigate('home')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart size={24} color="#FFFFFF" fill="#FFFFFF" style={{ opacity: 0.9 }} />
              <h3 
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  color: '#FFFFFF',
                  letterSpacing: '0.5px'
                }}
              >
                <span className="hidden sm:inline">Emily Bakes Cakes</span>
                <span className="sm:hidden">Emily Bakes</span>
              </h3>
            </motion.div>

            {/* Desktop Navigation - Hidden on Mobile/Tablet */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative group"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: activePage === item.id ? 600 : 500,
                    fontSize: '15px',
                    color: '#FFFFFF',
                    letterSpacing: '0.3px',
                    transition: 'all 200ms ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    minHeight: '44px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    opacity: activePage === item.id ? 1 : 0.9
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.opacity = activePage === item.id ? '1' : '0.9';
                  }}
                >
                  {item.label}
                  {activePage === item.id && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: '#FFFFFF' }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Desktop Actions - Hidden on Mobile/Tablet */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                className="p-2 hover:bg-white/15"
                style={{ 
                  color: '#FFFFFF',
                  minWidth: '44px',
                  minHeight: '44px',
                  borderRadius: '8px'
                }}
              >
                <ShoppingBag size={22} />
              </Button>
              <button
                onClick={onAdminAccess}
                style={{
                  background: '#FFFFFF',
                  color: '#C44569',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'all 200ms ease',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                }}
              >
                <User size={18} />
                Staff Login
              </button>
            </div>

            {/* Mobile/Tablet Actions */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Shopping Cart - Hidden on smallest mobile */}
              <button
                className="hidden sm:flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              >
                <ShoppingBag size={22} />
              </button>
              
              {/* Hamburger Menu */}
              <HamburgerIcon 
                isOpen={mobileMenuOpen} 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                color="#FFFFFF"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
        onAdminAccess={onAdminAccess}
      />

      {/* Main Content */}
      <main style={{ paddingTop: '72px', minHeight: 'calc(100vh - 72px)' }}>
        {children}
      </main>

      {/* Sticky Bottom CTA - Only on Mobile */}
      <StickyBottomCTA onOrderClick={handleOrderClick} />

      {/* FRONT-END: Warm, Inviting Footer */}
      <footer 
        className="py-12 px-4 sm:px-6 lg:px-24 border-t"
        style={{ 
          borderColor: 'rgba(196, 69, 105, 0.15)',
          background: '#FFFFFF'
        }}
      >
        <div className="container mx-auto">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={20} color="#C44569" fill="#C44569" />
                <h4 style={{ 
                  fontFamily: 'Playfair Display, serif', 
                  color: '#C44569', 
                  fontSize: 'clamp(20px, 4vw, 24px)',
                  fontWeight: 700
                }}>
                  Emily Bakes Cakes
                </h4>
              </div>
              <p style={{ 
                color: 'rgba(43, 43, 43, 0.75)', 
                lineHeight: 1.7, 
                marginBottom: '16px', 
                fontSize: '15px' 
              }}>
                Premium custom cakes handcrafted with passion and precision. 
                Making your celebrations unforgettable since 2018.
              </p>
            </div>
            
            <div>
              <h5 style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#2B2B2B',
                marginBottom: '16px'
              }}>
                Quick Links
              </h5>
              <div className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="block text-left hover:text-[#C44569] transition-colors"
                    style={{ 
                      color: 'rgba(43, 43, 43, 0.7)', 
                      fontSize: '14px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 0',
                      minHeight: '32px',
                      width: '100%'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h5 style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#2B2B2B',
                marginBottom: '16px'
              }}>
                Hours
              </h5>
              <div className="space-y-2" style={{ 
                color: 'rgba(43, 43, 43, 0.7)', 
                fontSize: '14px' 
              }}>
                <p>Mon-Fri: 9am - 6pm</p>
                <p>Saturday: 10am - 4pm</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            
            <div>
              <h5 style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#2B2B2B',
                marginBottom: '16px'
              }}>
                Contact
              </h5>
              <div className="space-y-2" style={{ 
                color: 'rgba(43, 43, 43, 0.7)', 
                fontSize: '14px' 
              }}>
                <p>New Orleans, LA</p>
                <p>(555) 123-4567</p>
                <p>hello@emilybakescakes.com</p>
              </div>
            </div>
          </div>
          
          <div 
            className="pt-8 border-t text-center"
            style={{ borderColor: 'rgba(196, 69, 105, 0.15)' }}
          >
            <p style={{ 
              color: 'rgba(43, 43, 43, 0.6)', 
              fontSize: '14px' 
            }}>
              © 2025 Emily Bakes Cakes. All rights reserved. • Made with <Heart size={12} style={{ display: 'inline', color: '#C44569', fill: '#C44569' }} /> in New Orleans
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
