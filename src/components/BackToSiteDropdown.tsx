import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, ArrowLeft } from 'lucide-react';

interface BackToSiteDropdownProps {
  onLogout: () => void;
}

export function BackToSiteDropdown({ onLogout }: BackToSiteDropdownProps) {
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
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setOpen((v) => !v)} 
        style={{ 
          display: 'flex', 
          gap: 8, 
          alignItems: 'center', 
          color: 'rgba(255,255,255,0.8)', 
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: 6,
          transition: 'background 200ms ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontFamily: 'Poppins', fontSize: 14 }}>Back to Site</span>
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms' }} />
      </button>

      {open && (
        <div style={{ 
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: 200,
          maxWidth: 280,
          width: 'max-content',
          background: 'rgba(43,43,43,0.98)', 
          backdropFilter: 'blur(12px)', 
          borderRadius: 10, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)', 
          padding: 8, 
          zIndex: 99999,
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
              transition: 'background 200ms ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(196, 69, 105, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ArrowLeft size={16} />
            <span style={{ fontFamily: 'Poppins', fontSize: 14 }}>Back to Public Site</span>
          </button>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

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
              transition: 'background 200ms ease',
              whiteSpace: 'nowrap'
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
