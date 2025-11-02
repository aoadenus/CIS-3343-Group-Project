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

/**
 * Dark Mode Styles (inject into globals.css or use CSS-in-JS)
 */
export const darkModeStyles = `
  /* Dark Mode Theme */
  .dark-mode {
    --bg-base: #1A1A1A;
    --bg-card: #2B2B2B;
    --bg-elevated: #333333;
    --text-primary: #FFFFFF;
    --text-secondary: #CCCCCC;
    --text-muted: #999999;
    --accent: #C44569;
    --border: #3A3A3A;
  }

  .dark-mode body {
    background: var(--bg-base);
    color: var(--text-primary);
  }

  /* Cards with elevation shadows */
  .dark-mode .card,
  .dark-mode [class*="Card"] {
    background: var(--bg-card) !important;
    border-color: var(--border) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
  }

  /* Neon-style glow on hover */
  .dark-mode button:hover,
  .dark-mode .card:hover {
    box-shadow: 0 0 16px rgba(196, 69, 105, 0.6) !important;
  }

  /* Accent remains Raspberry Pink */
  .dark-mode .accent-text {
    color: #C44569 !important;
  }

  .dark-mode .accent-bg {
    background: #C44569 !important;
  }

  /* Charts - vibrant colors against dark */
  .dark-mode .recharts-cartesian-grid-horizontal line,
  .dark-mode .recharts-cartesian-grid-vertical line {
    stroke: #3A3A3A !important;
  }

  .dark-mode .recharts-text {
    fill: #CCCCCC !important;
  }

  /* Input fields */
  .dark-mode input,
  .dark-mode textarea,
  .dark-mode select {
    background: var(--bg-elevated) !important;
    border-color: var(--border) !important;
    color: var(--text-primary) !important;
  }

  .dark-mode input:focus,
  .dark-mode textarea:focus,
  .dark-mode select:focus {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px rgba(196, 69, 105, 0.2) !important;
  }

  /* Sidebar */
  .dark-mode aside,
  .dark-mode nav {
    background: var(--bg-card) !important;
    border-color: var(--border) !important;
  }

  /* Tables */
  .dark-mode table {
    background: var(--bg-card) !important;
  }

  .dark-mode tr {
    border-color: var(--border) !important;
  }

  .dark-mode tr:hover {
    background: var(--bg-elevated) !important;
  }

  /* Smooth transition on theme change */
  .dark-mode * {
    transition: background-color 200ms ease-out, 
                border-color 200ms ease-out,
                color 200ms ease-out;
  }
`;
