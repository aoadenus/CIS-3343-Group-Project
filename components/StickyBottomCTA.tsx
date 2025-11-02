import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface StickyBottomCTAProps {
  onOrderClick: () => void;
  showCartIcon?: boolean;
}

export function StickyBottomCTA({ onOrderClick, showCartIcon = true }: StickyBottomCTAProps) {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind CTA */}
      <div className="md:hidden" style={{ height: '60px' }} />
      
      {/* Sticky Bottom CTA Bar - Only on Mobile */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          height: '60px',
          background: '#C44569',
          boxShadow: '0 -4px 16px rgba(90, 56, 37, 0.2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="h-full px-6 flex items-center justify-center">
          <button
            onClick={onOrderClick}
            style={{
              background: 'white',
              color: '#C44569',
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: '16px',
              padding: '0 32px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 200ms ease',
              minHeight: '48px'
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {showCartIcon && <ShoppingCart size={20} strokeWidth={2.5} />}
            <span>Order Now</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </>
  );
}
