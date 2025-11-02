import React from 'react';

/**
 * Standardized Button Component
 * Implements consistent button styling across the application
 * 
 * Variants:
 * - Primary: Raspberry Pink bg + White text
 * - Secondary: White bg + Chocolate Brown text with 1px border
 * - Ghost: Transparent bg + Raspberry Pink text
 */

interface StandardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function StandardButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: StandardButtonProps) {
  
  // Base styles - consistent across all variants
  const baseStyles: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 200ms ease-out',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative'
  };

  // Variant-specific styles
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: '#C44569',
      color: 'white',
      border: 'none',
      boxShadow: '0 2px 8px rgba(196, 69, 105, 0.25)'
    },
    secondary: {
      background: 'white',
      color: '#5A3825',
      border: '1px solid #5A3825',
      boxShadow: '0 2px 4px rgba(90, 56, 37, 0.1)'
    },
    ghost: {
      background: 'transparent',
      color: '#C44569',
      border: 'none',
      boxShadow: 'none'
    }
  };

  // Size-specific styles
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      fontSize: '14px',
      padding: '8px 16px',
      borderRadius: '8px',
      minHeight: '36px'
    },
    md: {
      fontSize: '16px',
      padding: '12px 24px',
      borderRadius: '8px',
      minHeight: '44px'
    },
    lg: {
      fontSize: '18px',
      padding: '16px 32px',
      borderRadius: '12px',
      minHeight: '48px'
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size]
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (variant === 'primary') {
      e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.35)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(90, 56, 37, 0.15)';
      e.currentTarget.style.borderColor = '#C44569';
    } else if (variant === 'ghost') {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.color = '#D4567A';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    e.currentTarget.style.transform = 'scale(1) translateY(0)';
    if (variant === 'primary') {
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(196, 69, 105, 0.25)';
    } else if (variant === 'secondary') {
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(90, 56, 37, 0.1)';
      e.currentTarget.style.borderColor = '#5A3825';
    } else if (variant === 'ghost') {
      e.currentTarget.style.color = '#C44569';
    }
  };

  return (
    <button
      style={combinedStyles}
      className={`standard-button ${className}`}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span 
          className="loading-spinner"
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }}
        />
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
}

// Add spinner keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#button-spinner-styles')) {
  style.id = 'button-spinner-styles';
  document.head.appendChild(style);
}
