import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Premium Dark Mode Theme Toggle for Admin Portal
 * Persists user preference to localStorage
 * Base: #1A1A1A, Cards: #2B2B2B, Accent: #C44569
 */

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.style.setProperty('--bg-base', '#1A1A1A');
      document.documentElement.style.setProperty('--bg-card', '#2B2B2B');
      document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
      document.documentElement.style.setProperty('--text-secondary', '#CCCCCC');
      document.documentElement.style.setProperty('--accent', '#C44569');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.style.setProperty('--bg-base', '#F8EBD7');
      document.documentElement.style.setProperty('--bg-card', '#FFFFFF');
      document.documentElement.style.setProperty('--text-primary', '#2B2B2B');
      document.documentElement.style.setProperty('--text-secondary', '#5A3825');
      document.documentElement.style.setProperty('--accent', '#C44569');
    }

    // Persist to localStorage
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: isDark ? '#2B2B2B' : 'white',
        border: isDark ? '1px solid #3A3A3A' : '1px solid #E0E0E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 200ms ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 0 16px rgba(196, 69, 105, 0.4)'
          : '0 4px 12px rgba(90, 56, 37, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Sun Icon (Light Mode) */}
      <div
        style={{
          position: 'absolute',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
          opacity: isDark ? 0 : 1
        }}
      >
        <Sun size={20} color="#C44569" />
      </div>

      {/* Moon Icon (Dark Mode) */}
      <div
        style={{
          position: 'absolute',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          opacity: isDark ? 1 : 0
        }}
      >
        <Moon size={20} color="#C44569" />
      </div>
    </button>
  );
}
