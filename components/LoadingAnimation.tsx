import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import logoImage from 'figma:asset/208dd57666cc04d301e0ec0f70d0f9c9a2c8b203.png';

/**
 * Emily Bakes Cakes - Light Pastel Loading Animation
 * Duration: 2.5 seconds
 * Style: Soft morning light, baking warmth, handcrafted elegance
 * 
 * Phase 1 (0-0.8s): Logo entrance with bloom
 * Phase 2 (0.8-1.8s): Whisk swirl + flour dust particles
 * Phase 3 (1.8-2.5s): Hold and fade exit
 */

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [phase, setPhase] = useState<'entrance' | 'accent' | 'exit'>('entrance');

  useEffect(() => {
    // Phase 1 → 2
    const timer1 = setTimeout(() => setPhase('accent'), 800);
    
    // Phase 2 → 3
    const timer2 = setTimeout(() => setPhase('exit'), 1800);
    
    // Complete animation
    const timer3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: phase === 'exit' ? 0.7 : 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        background: 'linear-gradient(135deg, #F8EBD7 0%, #FFD6BA 50%, #F7B1C3 100%)',
        backgroundSize: '200% 200%',
        overflow: 'hidden'
      }}
    >
      {/* Animated Gradient Mesh */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #F8EBD7 0%, #FFD6BA 50%, #F7B1C3 100%)',
          backgroundSize: '200% 200%'
        }}
      />

      {/* Radial Glow Behind Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: phase === 'exit' ? 0 : 0.25,
          scale: phase === 'exit' ? 1.5 : 1
        }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 69, 105, 0.25) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Soft Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.1) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Center Content Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          zIndex: 1
        }}
      >
        {/* Logo with Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            scale: phase === 'exit' ? 1.1 : 1
          }}
          transition={{
            duration: phase === 'entrance' ? 0.8 : 0.7,
            ease: 'easeOut'
          }}
          style={{
            position: 'relative',
            width: '200px',
            height: '200px'
          }}
        >
          <img
            src={logoImage}
            alt="Emily Bakes Cakes Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(196, 69, 105, 0.15))'
            }}
          />

          {/* Shimmer Highlight */}
          {phase === 'entrance' && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: [0, 0.15, 0] }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(196, 69, 105, 0.3), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />
          )}
        </motion.div>

        {/* Whisk Swirl Animation */}
        {phase === 'accent' && (
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{
              position: 'absolute',
              bottom: '-60px'
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M 60 60 Q ${40 + i * 10} ${30 - i * 5}, ${60 + i * 15} 10`}
                stroke="#C44569"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </motion.svg>
        )}

        {/* Flour Dust Particles */}
        {phase === 'accent' && (
          <>
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100 - 50,
                  y: 20,
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{
                  x: Math.random() * 120 - 60,
                  y: -80,
                  opacity: [0, 0.3, 0],
                  scale: [0.5, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  ease: 'easeOut'
                }}
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  width: `${Math.random() * 3 + 2}px`,
                  height: `${Math.random() * 3 + 2}px`,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.4)',
                  pointerEvents: 'none'
                }}
              />
            ))}
          </>
        )}

        {/* Tagline "Baked with Love" */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: phase === 'accent' ? 1 : phase === 'exit' ? 0 : 0,
            y: phase === 'accent' ? 0 : phase === 'exit' ? -10 : 10
          }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: 'Lucida Handwriting, cursive',
            fontSize: '20px',
            fontStyle: 'italic',
            color: '#C44569',
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            letterSpacing: '0.05em',
            marginTop: '32px'
          }}
        >
          Baked with Love
        </motion.p>
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
    </motion.div>
  );
}
