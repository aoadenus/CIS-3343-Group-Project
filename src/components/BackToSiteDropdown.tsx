import React, { useState, useRef, useEffect } from 'react';
import { LogOut, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BackToSiteDropdownProps {
  onLogout: () => void;
}

export function BackToSiteDropdown({ onLogout }: BackToSiteDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setOpen(true);
    }, 200); // 200ms delay before showing dropdown
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Delay closing to allow moving to dropdown
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  const handleSwitchAccounts = () => {
    setOpen(false);
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  const handleLogOut = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div 
      ref={ref} 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        style={{ 
          display: 'flex', 
          gap: 8, 
          alignItems: 'center', 
          color: 'rgba(255,255,255,0.7)', 
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: 6,
          transition: 'color 200ms ease',
          fontFamily: 'Poppins, sans-serif',
          fontSize: 14,
          fontWeight: 500
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.color = '#C44569';
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        }}
      >
        <ArrowLeft size={18} strokeWidth={2} />
        <span>Back to Site</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ 
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              minWidth: 200,
              maxWidth: 280,
              width: 'max-content',
              background: 'rgba(43,43,43,0.95)', 
              backdropFilter: 'blur(12px)', 
              borderRadius: 10, 
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)', 
              padding: 8, 
              zIndex: 100,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <button 
              onClick={() => { setOpen(false); window.location.href = '/'; }} 
              style={{ 
                width: '100%', 
                height: 42, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10, 
                padding: '10px 12px', 
                background: 'transparent', 
                border: 'none', 
                color: '#FFFFFF', 
                borderRadius: 6, 
                cursor: 'pointer',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                fontWeight: 500
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(196, 69, 105, 0.15)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Back to Public Site</span>
            </button>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

            <button 
              onClick={handleSwitchAccounts} 
              style={{ 
                width: '100%', 
                height: 42, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10, 
                padding: '10px 12px', 
                background: 'transparent', 
                border: 'none', 
                color: '#FFFFFF', 
                borderRadius: 6, 
                cursor: 'pointer',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                fontWeight: 500
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(196, 69, 105, 0.15)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <RefreshCw size={16} strokeWidth={2} />
              <span>Switch Accounts</span>
            </button>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

            <button 
              onClick={handleLogOut} 
              style={{ 
                width: '100%', 
                height: 42, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10, 
                padding: '10px 12px', 
                background: 'transparent', 
                border: 'none', 
                color: '#FFFFFF', 
                borderRadius: 6, 
                cursor: 'pointer',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                fontWeight: 500
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(196, 69, 105, 0.15)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <LogOut size={16} strokeWidth={2} />
              <span>Log Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BackToSiteDropdown;
