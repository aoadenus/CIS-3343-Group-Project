import React, { useState, useRef, useEffect } from 'react';
import { LogOut, RefreshCw, ChevronDown, ArrowLeft } from 'lucide-react';

interface BackToSiteDropdownProps {
  onLogout: () => void;
  onSwitchAccount?: () => void;
}

export function BackToSiteDropdown({ onLogout, onSwitchAccount }: BackToSiteDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((v) => !v)} style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'rgba(255,255,255,0.8)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={18} />
        <span style={{ fontFamily: 'Poppins', fontSize: 14 }}>Back to Site</span>
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms' }} />
      </button>

      {open && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          marginTop: 8,
          width: 220, 
          background: 'rgba(43,43,43,0.98)', 
          backdropFilter: 'blur(12px)', 
          borderRadius: 10, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)', 
          padding: 8, 
          zIndex: 9999,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button 
            onClick={() => { setOpen(false); window.location.href = '/'; }} 
            style={{ 
              width: '100%', 
              height: 44, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '10px 12px', 
              background: 'transparent', 
              border: 'none', 
              color: '#FFFFFF', 
              borderRadius: 6, 
              cursor: 'pointer',
              transition: 'background 200ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(196, 69, 105, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ArrowLeft size={16} />
            <span style={{ fontFamily: 'Poppins', fontSize: 14 }}>Back to Public Site</span>
          </button>

          <button 
            onClick={() => { setOpen(false); onSwitchAccount?.(); }} 
            style={{ 
              width: '100%', 
              height: 44, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '10px 12px', 
              background: 'transparent', 
              border: 'none', 
              color: '#FFFFFF', 
              borderRadius: 6, 
              cursor: 'pointer',
              transition: 'background 200ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(196, 69, 105, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <RefreshCw size={16} />
            <span style={{ fontFamily: 'Poppins', fontSize: 14 }}>Switch Accounts</span>
          </button>

          <button 
            onClick={() => { setOpen(false); onLogout(); }} 
            style={{ 
              width: '100%', 
              height: 44, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '10px 12px', 
              background: 'transparent', 
              border: 'none', 
              color: '#FF5555', 
              borderRadius: 6, 
              cursor: 'pointer',
              transition: 'background 200ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 85, 85, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={16} />
            <span style={{ fontFamily: 'Poppins', fontSize: 14 }}>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default BackToSiteDropdown;
