import React from 'react';

/**
 * Standardized Badge Component
 * Implements consistent badge styling across the application
 * 
 * Variants:
 * - Pending: Yellow bg + Brown text
 * - In Progress: Blue bg + White text
 * - Completed: Green bg + White text
 * - Ready: Raspberry Pink bg + White text
 */

export type BadgeStatus = 'pending' | 'inProgress' | 'completed' | 'ready' | 'cancelled';

interface StandardBadgeProps {
  status: BadgeStatus;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StandardBadge({ 
  status, 
  children, 
  size = 'md',
  className = '' 
}: StandardBadgeProps) {
  
  // Status-specific configurations
  const statusConfig: Record<BadgeStatus, { bg: string; color: string; label: string }> = {
    pending: {
      bg: '#FEF3C7',
      color: '#92400E',
      label: 'Pending'
    },
    inProgress: {
      bg: '#3B82F6',
      color: 'white',
      label: 'In Progress'
    },
    completed: {
      bg: '#10B981',
      color: 'white',
      label: 'Completed'
    },
    ready: {
      bg: '#C44569',
      color: 'white',
      label: 'Ready'
    },
    cancelled: {
      bg: '#6B7280',
      color: 'white',
      label: 'Cancelled'
    }
  };

  const config = statusConfig[status];

  // Size-specific styles
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '4px'
    },
    md: {
      fontSize: '12px',
      padding: '4px 12px',
      borderRadius: '6px'
    },
    lg: {
      fontSize: '14px',
      padding: '6px 16px',
      borderRadius: '8px'
    }
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize',
    letterSpacing: '0.02em',
    backgroundColor: config.bg,
    color: config.color,
    whiteSpace: 'nowrap',
    transition: 'all 150ms ease-out',
    ...sizeStyles[size]
  };

  return (
    <span 
      style={badgeStyle} 
      className={`standard-badge ${className}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {children || config.label}
    </span>
  );
}

/**
 * Custom Badge - for custom colors/text
 */
interface CustomBadgeProps {
  backgroundColor: string;
  textColor: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CustomBadge({
  backgroundColor,
  textColor,
  children,
  size = 'md',
  className = ''
}: CustomBadgeProps) {
  
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '4px'
    },
    md: {
      fontSize: '12px',
      padding: '4px 12px',
      borderRadius: '6px'
    },
    lg: {
      fontSize: '14px',
      padding: '6px 16px',
      borderRadius: '8px'
    }
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.02em',
    backgroundColor,
    color: textColor,
    whiteSpace: 'nowrap',
    transition: 'all 150ms ease-out',
    ...sizeStyles[size]
  };

  return (
    <span style={badgeStyle} className={`custom-badge ${className}`}>
      {children}
    </span>
  );
}
