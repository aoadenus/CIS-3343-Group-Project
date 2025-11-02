import { motion } from 'motion/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'customer' | 'admin';
  label?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'customer',
  label 
}: LoadingSpinnerProps) {
  const isCustomer = variant === 'customer';
  
  const sizes = {
    sm: 16,
    md: 24,
    lg: 40
  };
  
  const spinnerSize = sizes[size];
  
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}
      role="status"
      aria-label={label || 'Loading'}
    >
      <motion.div
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          border: `${Math.max(2, spinnerSize / 12)}px solid ${isCustomer ? 'rgba(196, 69, 105, 0.2)' : 'rgba(43, 43, 43, 0.2)'}`,
          borderTopColor: isCustomer ? '#C44569' : '#2B2B2B',
          borderRadius: '50%'
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {label && (
        <span
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: size === 'sm' ? '13px' : size === 'md' ? '14px' : '16px',
            color: isCustomer ? 'rgba(90, 56, 37, 0.8)' : 'rgba(43, 43, 43, 0.7)',
            fontWeight: 500
          }}
        >
          {label}
        </span>
      )}
      
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  );
}

// Button loading state
export function ButtonSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 14,
    md: 18,
    lg: 22
  };
  
  const spinnerSize = sizes[size];
  
  return (
    <motion.div
      style={{
        width: `${spinnerSize}px`,
        height: `${spinnerSize}px`,
        border: `${Math.max(2, spinnerSize / 8)}px solid rgba(255, 255, 255, 0.3)`,
        borderTopColor: '#FFFFFF',
        borderRadius: '50%'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: 'linear'
      }}
      aria-hidden="true"
    />
  );
}
