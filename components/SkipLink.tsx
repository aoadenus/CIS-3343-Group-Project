import React from 'react';

/**
 * Skip to Main Content Link
 * WCAG 2.1 Level A requirement for keyboard navigation
 * Allows users to skip repetitive navigation and jump directly to main content
 */

export function SkipLink() {
  const skipLinkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-100px',
    left: '8px',
    zIndex: 9999,
    background: '#C44569',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(196, 69, 105, 0.4)',
    border: '2px solid white',
    transition: 'top 200ms ease-out'
  };

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.top = '8px';
  };

  const handleBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.top = '-100px';
  };

  return (
    <a
      href="#main-content"
      style={skipLinkStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="skip-link"
    >
      Skip to main content
    </a>
  );
}
