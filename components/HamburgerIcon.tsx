import { motion } from 'motion/react';

interface HamburgerIconProps {
  isOpen: boolean;
  onClick: () => void;
  color?: string;
}

export function HamburgerIcon({ isOpen, onClick, color = '#C44569' }: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      style={{
        width: '44px',
        height: '44px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '8px',
        transition: 'background 200ms ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color === '#FFFFFF' 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(196, 69, 105, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* Top Line */}
      <motion.span
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '24px',
          height: '2.5px',
          background: color,
          borderRadius: '2px',
          display: 'block',
          transformOrigin: 'center'
        }}
      />
      
      {/* Middle Line */}
      <motion.span
        animate={{
          opacity: isOpen ? 0 : 1,
          scale: isOpen ? 0.8 : 1
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '24px',
          height: '2.5px',
          background: color,
          borderRadius: '2px',
          display: 'block'
        }}
      />
      
      {/* Bottom Line */}
      <motion.span
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '24px',
          height: '2.5px',
          background: color,
          borderRadius: '2px',
          display: 'block',
          transformOrigin: 'center'
        }}
      />
    </button>
  );
}
