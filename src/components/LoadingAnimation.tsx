/**
 * LoadingAnimation Component
 * A stylish 2-second bakery-themed loading animation using Framer Motion
 * Features: rising logo effect, pastel gradients, confetti sprinkles, smooth text animation
 */

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti after logo animation completes (1.2 seconds)
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, 1200);

    // Auto-complete animation after 2 seconds
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Generate random confetti/sprinkle particles (bakery themed)
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50, // Random horizontal spread
    rotation: Math.random() * 360, // Random rotation
    delay: Math.random() * 0.3, // Stagger animation
    color: ['#FFC2D1', '#FFB5C5', '#C44569', '#F8EBD7', '#E5D4C1'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Pastel gradient background (pinks, creams, soft mauves) - bakery vibe
        background: 'linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 25%, #F8EBD7 50%, #E8D5E8 75%, #FFE5EC 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Animated pastel gradient overlay for depth */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(196, 69, 105, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* Main content container - everything centered */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        
        {/* Logo Animation - Rising effect with fade in and scale (cake baking/rising) */}
        <motion.div
          initial={{ 
            y: 60,        // Start lower (will rise up like a cake baking)
            opacity: 0,   // Start invisible
            scale: 0.7    // Start smaller
          }}
          animate={{ 
            y: 0,         // Rise to final position
            opacity: 1,   // Fade in to full visibility
            scale: 1      // Scale up to full size
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1], // Custom easing for smooth baking/rising effect
            type: 'spring',
            stiffness: 80,
            damping: 15
          }}
          style={{
            marginBottom: '32px',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Logo Image - Using provided logo */}
          <img
            src="/logo.png"
            alt="Emily Bakes Cakes Logo"
            style={{
              width: 'clamp(180px, 40vw, 280px)',
              height: 'auto',
              filter: 'drop-shadow(0 8px 24px rgba(196, 69, 105, 0.2))',
              pointerEvents: 'none'
            }}
          />
        </motion.div>

        {/* Confetti/Sprinkles Animation - Appear after logo rises */}
        <AnimatePresence>
          {showConfetti && confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                y: -20,
                x: 0,
                opacity: 1,
                rotate: 0,
                scale: 0
              }}
              animate={{
                y: [0, 100, 200], // Fall downward
                x: particle.x,     // Spread horizontally
                opacity: [1, 0.8, 0], // Fade out
                rotate: particle.rotation, // Random rotation
                scale: [0, 1, 0.5] // Scale in then out
              }}
              transition={{
                duration: 0.8,
                delay: particle.delay,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '8px',
                height: '8px',
                // Mix of circles (sprinkles) and rectangles (confetti)
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: particle.color,
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          ))}
        </AnimatePresence>

        {/* Title Text Animation - Slide in with letter spacing growth */}
        <motion.h1
          initial={{
            y: 30,
            opacity: 0,
            letterSpacing: '-0.05em' // Start with tight letter spacing
          }}
          animate={{
            y: 0,
            opacity: 1,
            letterSpacing: '0.05em' // Grow to wider letter spacing
          }}
          transition={{
            duration: 1,
            delay: 0.4, // Start slightly after logo begins
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 6vw, 48px)',
            fontWeight: 700,
            color: '#C44569',
            margin: 0,
            textShadow: '0 2px 12px rgba(196, 69, 105, 0.2)',
            position: 'relative',
            zIndex: 2
          }}
        >
          Emily Bakes Cakes
        </motion.h1>

        {/* Subtitle with subtle fade in */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{
            duration: 0.8,
            delay: 0.8
          }}
          style={{
            fontFamily: 'Lucida Handwriting, cursive',
            fontSize: 'clamp(14px, 3vw, 18px)',
            color: '#5A3825',
            fontStyle: 'italic',
            marginTop: '12px',
            position: 'relative',
            zIndex: 2
          }}
        >
          Baked with Love
        </motion.p>

        {/* Pulsing glow effect behind logo - adds modern depth */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196, 69, 105, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Accessibility: Hidden loading text for screen readers */}
      <span
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
        role="status"
        aria-live="polite"
      >
        Loading Emily Bakes Cakes...
      </span>
    </div>
  );
}
