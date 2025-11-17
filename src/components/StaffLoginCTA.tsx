import { Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface StaffLoginCTAProps {
  onClick: () => void;
  variant?: 'desktop' | 'mobile';
}

export function StaffLoginCTA({ onClick, variant = 'desktop' }: StaffLoginCTAProps) {
  if (variant === 'mobile') {
    return (
      <motion.button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2"
        style={{
          height: '48px',
          background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '10px',
          color: '#FFFFFF',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '15px',
          fontWeight: 600,
          letterSpacing: '0.3px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(196, 69, 105, 0.25)',
          marginBottom: '16px'
        }}
        whileHover={{ 
          background: 'linear-gradient(135deg, #D4567A 0%, #E06389 100%)',
          boxShadow: '0 6px 20px rgba(196, 69, 105, 0.35)'
        }}
        whileTap={{ scale: 0.98 }}
        aria-label="Access staff portal login"
        role="button"
        tabIndex={0}
      >
        <Lock size={16} strokeWidth={2.5} />
        <span>Staff Login</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2"
      style={{
        height: '40px',
        minWidth: '120px',
        maxWidth: '160px',
        paddingLeft: '16px',
        paddingRight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
        background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        color: '#FFFFFF',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.3px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(196, 69, 105, 0.25)',
        whiteSpace: 'nowrap'
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ 
        scale: 1.03,
        background: 'linear-gradient(135deg, #D4567A 0%, #E06389 100%)',
        boxShadow: '0 6px 20px rgba(196, 69, 105, 0.35)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      aria-label="Access staff portal login"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Lock size={14} strokeWidth={2.5} />
      <span>Staff Login</span>
    </motion.button>
  );
}
