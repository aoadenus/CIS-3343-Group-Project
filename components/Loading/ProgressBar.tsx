import { motion } from 'motion/react';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'customer' | 'admin';
  showPercentage?: boolean;
}

export function ProgressBar({ 
  progress, 
  variant = 'customer',
  showPercentage = false 
}: ProgressBarProps) {
  const isCustomer = variant === 'customer';
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '3px',
        background: isCustomer 
          ? 'rgba(248, 235, 215, 0.3)' 
          : 'rgba(240, 240, 240, 0.5)'
      }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        style={{
          height: '100%',
          background: isCustomer
            ? 'linear-gradient(90deg, #C44569 0%, #D4567A 50%, #C44569 100%)'
            : 'linear-gradient(90deg, #C44569 0%, #B33D5E 100%)',
          boxShadow: isCustomer
            ? '0 0 10px rgba(196, 69, 105, 0.5), 0 0 20px rgba(196, 69, 105, 0.3)'
            : '0 0 8px rgba(196, 69, 105, 0.4)',
          borderRadius: '0 2px 2px 0',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite'
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ 
          duration: 0.3,
          ease: 'easeOut'
        }}
      />
      
      {showPercentage && (
        <motion.div
          style={{
            position: 'absolute',
            top: '6px',
            right: '16px',
            background: isCustomer ? '#C44569' : '#2B2B2B',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
}

// Indeterminate loading bar (for unknown duration)
export function IndeterminateProgressBar({ variant = 'customer' }: { variant?: 'customer' | 'admin' }) {
  const isCustomer = variant === 'customer';
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '3px',
        background: isCustomer 
          ? 'rgba(248, 235, 215, 0.3)' 
          : 'rgba(240, 240, 240, 0.5)',
        overflow: 'hidden'
      }}
      role="progressbar"
      aria-label="Loading"
    >
      <motion.div
        style={{
          position: 'absolute',
          height: '100%',
          width: '30%',
          background: isCustomer
            ? 'linear-gradient(90deg, transparent 0%, #C44569 50%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, #C44569 50%, transparent 100%)',
          boxShadow: '0 0 10px rgba(196, 69, 105, 0.5)'
        }}
        animate={{
          left: ['-30%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
}
