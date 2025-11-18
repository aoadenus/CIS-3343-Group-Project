import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { HamburgerIcon } from './HamburgerIcon';
import { MobileNav } from './MobileNav';
import { StaffLoginCTA } from './StaffLoginCTA';

interface PublicLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onAdminAccess: () => void;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
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
        className="fixed top-0 left-0 right-0 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(196, 69, 105, 0.98)' : '#C44569',
          boxShadow: scrolled ? '0 4px 16px rgba(90, 56, 37, 0.2)' : 'none',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          zIndex: 9999,
          height: '60px'
        }}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo - Always navigates to top of home page */}
            <button
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ background: 'none', border: 'none', padding: 0 }}
              aria-label="Emily Bakes Cakes - Go to home page"
            >
              <Heart size={32} fill="#F8EBD7" color="#F8EBD7" className="flex-shrink-0" />
              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  fontSize: 'clamp(16px, 3.5vw, 22px)',
                  color: 'white',
                  letterSpacing: '-0.3px',
                  whiteSpace: 'nowrap'
                }}
              >
                Emily Bakes Cakes
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative px-3 py-2 transition-all"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: 'white',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: activePage === item.id ? 1 : 0.9,
                    whiteSpace: 'nowrap'
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
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mobile Menu Button - Only show when menu is closed */}
              {!mobileMenuOpen && (
                <HamburgerIcon 
                  isOpen={false} 
                  onClick={() => setMobileMenuOpen(true)}
                  color="white"
                />
              )}
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
      <main className="flex-1" style={{ paddingTop: '60px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        className="mt-auto px-4 sm:px-6"
        style={{
          background: '#2B2B2B',
          color: 'rgba(255, 255, 255, 0.9)',
          paddingTop: '2.5rem',
          paddingBottom: '2.5rem'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h5
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: 'white',
                  marginBottom: '12px',
                  letterSpacing: '0.5px'
                }}
              >
                Emily Bakes Cakes
              </h5>
              <p
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                Handcrafted artisan cakes for Houston's special moments.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: 'white',
                  marginBottom: '12px',
                  letterSpacing: '0.5px'
                }}
              >
                Quick Links
              </h5>
              <ul className="space-y-1.5">
                {navItems.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        background: 'none',
                        border: 'none',
                        padding: '2px 0',
                        cursor: 'pointer',
                        textAlign: 'left',
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

            {/* Learn More */}
            <div>
              <h5
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: 'white',
                  marginBottom: '12px',
                  letterSpacing: '0.5px'
                }}
              >
                Learn More
              </h5>
              <ul className="space-y-1.5">
                {navItems.slice(3).map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        background: 'none',
                        border: 'none',
                        padding: '2px 0',
                        cursor: 'pointer',
                        textAlign: 'left',
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
                  fontSize: '15px',
                  color: 'white',
                  marginBottom: '12px',
                  letterSpacing: '0.5px'
                }}
              >
                Contact
              </h5>
              <div className="space-y-2">
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  2847 Westheimer Road<br />
                  Houston, TX 77098
                </p>
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0
                  }}
                >
                  (713) 555-CAKE
                </p>
                <a
                  href="mailto:info@emilybakescakes.com"
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '13px',
                    color: '#C44569',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'opacity 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  info@emilybakescakes.com
                </a>
              </div>
            </div>
          </div>

          {/* Copyright & Staff Login */}
          <div
            className="mt-8 pt-5"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <p
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0
              }}
            >
              © {new Date().getFullYear()} Emily Bakes Cakes. All rights reserved.
            </p>
            
            {/* Staff Login Button - Footer */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StaffLoginCTA onClick={onAdminAccess} variant="desktop" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
