import { useState, useEffect } from 'react';
import { User, Heart } from 'lucide-react';
import { motion } from 'motion/react';
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8EBD7' }}>
      {/* Navigation Bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(196, 69, 105, 0.98)' : '#C44569',
          boxShadow: scrolled ? '0 4px 16px rgba(90, 56, 37, 0.2)' : 'none',
          backdropFilter: scrolled ? 'blur(10px)' : 'none'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <Heart
                size={28}
                fill="white"
                color="white"
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  color: 'white',
                  letterSpacing: '-0.5px'
                }}
              >
                Emily Bakes Cakes
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative px-3 py-2 transition-all"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'white',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    minHeight: '44px',
                    opacity: activePage === item.id ? 1 : 0.9
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = activePage === item.id ? '1' : '0.9';
                  }}
                >
                  {item.label}
                  {activePage === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Section - Icons */}
            <div className="flex items-center gap-2">
              {/* Staff Login Button */}
              <button
                onClick={onAdminAccess}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  minHeight: '44px',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <User size={18} />
                Staff Login
              </button>

              {/* Mobile Menu Button */}
              <HamburgerIcon 
                isOpen={mobileMenuOpen} 
                onClick={() => setMobileMenuOpen(true)}
                color="white"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
        onAdminAccess={onAdminAccess}
      />

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-18">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="mt-auto py-12 px-4 sm:px-6"
        style={{
          background: '#2B2B2B',
          color: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Brand */}
            <div>
              <h4
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  fontSize: '24px',
                  color: '#C44569',
                  marginBottom: '12px'
                }}
              >
                Emily Bakes Cakes
              </h4>
              <p
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.7
                }}
              >
                Handcrafted artisan cakes that transform celebrations into unforgettable moments.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'white',
                  marginBottom: '16px'
                }}
              >
                Quick Links
              </h5>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        background: 'none',
                        border: 'none',
                        padding: '4px 0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        minHeight: '32px',
                        transition: 'color 200ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#C44569';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'white',
                  marginBottom: '16px'
                }}
              >
                Contact Us
              </h5>
              <div className="space-y-3">
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  (555) 123-4567
                </p>
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  hello@emilybakescakes.com
                </p>
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6
                  }}
                >
                  123 Sweet Street
                  <br />
                  Bakery Town, CA 12345
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="mt-12 pt-8"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              © {new Date().getFullYear()} Emily Bakes Cakes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTA */}
      <StickyBottomCTA onOrderClick={() => onNavigate('shop')} />
    </div>
  );
}
