import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from 'figma:asset/208dd57666cc04d301e0ec0f70d0f9c9a2c8b203.png';

/**
 * Enhanced Hero Section with Parallax Scrolling
 * - Smooth parallax effect (0.5x scroll speed)
 * - Gradient overlay for text readability
 * - Glassmorphism card for headline
 * - Text shadow for improved legibility
 * - Accessible contrast (4.5:1 minimum)
 */

export function EnhancedHero() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Parallax scroll effect
  const { scrollY } = useScroll();
  
  // Image scrolls at 0.5x speed (slower than foreground)
  // Limited to 60px total movement to prevent dizziness
  const imageY = useTransform(scrollY, [0, 600], [0, -60]);
  
  // Content fades slightly on scroll for depth
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <section 
      style={{
        position: 'relative',
        height: '90vh',
        minHeight: '600px',
        maxHeight: '900px',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '120%', // Extended for parallax movement
          y: imageY,
          willChange: 'transform'
        }}
      >
        <img
          src={heroImage}
          alt="Elegant custom wedding cake with pink flowers"
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: imageLoaded ? 'none' : 'blur(10px)',
            transition: 'filter 0.4s ease-in'
          }}
        />
      </motion.div>

      {/* Dark Gradient Overlay (top to bottom) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(43, 43, 43, 0.45) 100%)',
          zIndex: 1
        }}
      />

      {/* Cream Tone Bottom Gradient (brand warmth) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(to top, rgba(248, 235, 215, 0.25) 0%, transparent 100%)',
          zIndex: 1
        }}
      />

      {/* Content Container */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          opacity: contentOpacity
        }}
      >
        {/* Glassmorphism Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '48px 64px',
            maxWidth: '800px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Main Headline */}
          <h1
            style={{
              fontFamily: 'Lucida Handwriting, cursive',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontStyle: 'italic',
              color: '#C44569',
              marginBottom: '24px',
              lineHeight: 1.3,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.02em'
            }}
          >
            Sweetness from the Heart
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: '#FFFFFF',
              opacity: 0.95,
              lineHeight: 1.6,
              marginBottom: '32px',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
              maxWidth: '600px',
              margin: '0 auto 32px'
            }}
          >
            Handcrafted custom cakes for weddings, birthdays, and every celebration.
            From Paris to Houston, we bring European artistry to your special moments.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <motion.button
              onClick={() => navigate('/builder')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: '#C44569',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(196, 69, 105, 0.3)',
                transition: 'all 200ms ease-out',
                minHeight: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D15577';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(196, 69, 105, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#C44569';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.3)';
              }}
            >
              Order Custom Cake
              <ArrowRight size={20} />
            </motion.button>

            <motion.button
              onClick={() => navigate('/shop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                padding: '16px 32px',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 200ms ease-out',
                minHeight: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              Browse Gallery
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{
              width: '30px',
              height: '50px',
              border: '2px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '20px',
              position: 'relative',
              backdropFilter: 'blur(4px)',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{
                width: '6px',
                height: '10px',
                background: 'white',
                borderRadius: '3px',
                position: 'absolute',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          section > div > div {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
