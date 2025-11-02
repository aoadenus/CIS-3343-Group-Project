import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Enhanced Navigation with Dropdown Animations
 * - Animated chevron rotation (180deg)
 * - Fade + slide-down dropdowns (200ms)
 * - Mobile hamburger morph to X (300ms)
 * - Dynamic scroll behavior (transparent → solid)
 * - Active page highlight with underline animation
 */

interface NavLink {
  label: string;
  path: string;
  dropdown?: { label: string; path: string }[];
}

const navLinks: NavLink[] = [
  { label: 'Home', path: '/' },
  { 
    label: 'Shop', 
    path: '/shop',
    dropdown: [
      { label: 'Wedding Cakes', path: '/shop?category=wedding' },
      { label: 'Birthday Cakes', path: '/shop?category=birthday' },
      { label: 'Custom Orders', path: '/shop?category=custom' }
    ]
  },
  { label: 'Gallery', path: '/gallery' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

export function EnhancedNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Scroll behavior - transparent over hero, solid after 60px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? '#F8EBD7' : 'rgba(248, 235, 215, 0.95)',
          backdropFilter: scrolled ? 'none' : 'blur(10px)',
          borderBottom: scrolled ? '1px solid rgba(90, 56, 37, 0.1)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
          transition: 'all 300ms ease-out',
          padding: '16px 48px'
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              fontWeight: 700,
              color: '#C44569',
              textDecoration: 'none',
              transition: 'opacity 200ms ease-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Emily Bakes Cakes
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}
            className="hidden lg:flex"
          >
            {navLinks.map((link) => (
              <div
                key={link.path}
                style={{ position: 'relative' }}
                onClick={(e) => {
                  if (link.dropdown) {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === link.label ? null : link.label);
                  }
                }}
              >
                <motion.div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!link.dropdown) {
                      e.currentTarget.style.opacity = '0.8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onClick={() => {
                    if (!link.dropdown) {
                      navigate(link.path);
                    }
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: isActivePath(link.path) ? '#C44569' : '#2B2B2B',
                      transition: 'color 200ms ease-out'
                    }}
                  >
                    {link.label}
                  </span>

                  {/* Dropdown Indicator */}
                  {link.dropdown && (
                    <motion.div
                      animate={{ rotate: activeDropdown === link.label ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <ChevronDown size={16} color="#C44569" />
                    </motion.div>
                  )}

                  {/* Active Underline */}
                  {isActivePath(link.path) && !link.dropdown && (
                    <motion.div
                      layoutId="activeUnderline"
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: '#C44569',
                        borderRadius: '2px'
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '16px',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                        padding: '8px',
                        minWidth: '200px',
                        border: '1px solid rgba(196, 69, 105, 0.1)'
                      }}
                    >
                      {link.dropdown.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => navigate(item.path)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 150ms ease-out'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(196, 69, 105, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Open Sans, sans-serif',
                              fontSize: '14px',
                              color: '#2B2B2B'
                            }}
                          >
                            {item.label}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* CTA Button */}
            <motion.button
              onClick={() => navigate('/builder')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: '#C44569',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(196, 69, 105, 0.25)',
                transition: 'all 200ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D15577';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#C44569';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(196, 69, 105, 0.25)';
              }}
            >
              Order Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <X size={28} color="#C44569" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu size={28} color="#C44569" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '80px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(248, 235, 215, 0.98)',
              backdropFilter: 'blur(16px)',
              zIndex: 999,
              padding: '24px',
              overflowY: 'auto'
            }}
            className="lg:hidden"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  marginBottom: '8px'
                }}
              >
                <div
                  onClick={() => {
                    if (link.dropdown) {
                      setActiveDropdown(activeDropdown === link.label ? null : link.label);
                    } else {
                      navigate(link.path);
                    }
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: isActivePath(link.path) ? 'rgba(196, 69, 105, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: isActivePath(link.path) ? '#C44569' : '#2B2B2B'
                    }}
                  >
                    {link.label}
                  </span>

                  {link.dropdown && (
                    <motion.div
                      animate={{ rotate: activeDropdown === link.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} color="#C44569" />
                    </motion.div>
                  )}
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        overflow: 'hidden',
                        paddingLeft: '16px'
                      }}
                    >
                      {link.dropdown.map((item) => (
                        <div
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          style={{
                            padding: '12px 16px',
                            marginTop: '4px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer'
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Open Sans, sans-serif',
                              fontSize: '16px',
                              color: '#2B2B2B'
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Mobile CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.05 }}
              onClick={() => navigate('/builder')}
              style={{
                width: '100%',
                background: '#C44569',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '24px',
                boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)'
              }}
            >
              Order Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
