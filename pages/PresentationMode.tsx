import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Play } from 'lucide-react';

/**
 * Emily Bakes Cakes - Presentation Mode
 * Professional 4-frame presentation for CIS 3343 submission
 * 
 * Frame 1: Intro Screen (Logo + Loading Animation)
 * Frame 2: Front-End Overview (Customer Journey)
 * Frame 3: Back-End Overview (Admin Portal)
 * Frame 4: Closing Slide (Credits + Tagline)
 */

export function PresentationMode() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPresentation, setShowPresentation] = useState(false);

  // Loading animation duration: 1.75s
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1750);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Auto-advance from Frame 0 (intro) after loading
  useEffect(() => {
    if (!isLoading && currentFrame === 0 && !showPresentation) {
      const timer = setTimeout(() => {
        setShowPresentation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentFrame, showPresentation]);

  const frames = [
    {
      id: 0,
      type: 'intro',
      background: '#F8EBD7',
      content: 'intro'
    },
    {
      id: 1,
      type: 'frontend',
      background: '#F8EBD7',
      title: 'Customer Experience',
      content: 'frontend'
    },
    {
      id: 2,
      type: 'backend',
      background: '#2B2B2B',
      title: 'Admin Portal',
      content: 'backend'
    },
    {
      id: 3,
      type: 'closing',
      background: 'linear-gradient(135deg, #F8EBD7 0%, #C44569 100%)',
      content: 'closing'
    }
  ];

  const nextFrame = () => {
    if (currentFrame < frames.length - 1) {
      setCurrentFrame(currentFrame + 1);
    }
  };

  const prevFrame = () => {
    if (currentFrame > 0) {
      setCurrentFrame(currentFrame - 1);
    }
  };

  const goToFrame = (index: number) => {
    setCurrentFrame(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextFrame();
      } else if (e.key === 'ArrowLeft') {
        prevFrame();
      } else if (e.key === 'Escape') {
        setCurrentFrame(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentFrame]);

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Open Sans, sans-serif'
      }}
    >
      <AnimatePresence mode="wait">
        {/* Frame 0: Intro Screen */}
        {currentFrame === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              background: frames[0].background,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                textAlign: 'center',
                marginBottom: '48px'
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  boxShadow: '0 8px 32px rgba(196, 69, 105, 0.3)'
                }}
              >
                🍰
              </div>
              
              <h1
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '56px',
                  fontWeight: 700,
                  color: '#2B2B2B',
                  marginBottom: '16px',
                  lineHeight: 1.2
                }}
              >
                Emily Bakes Cakes
              </h1>
              
              <p
                style={{
                  fontFamily: 'Lucida Handwriting, cursive',
                  fontSize: '24px',
                  color: '#C44569',
                  fontStyle: 'italic'
                }}
              >
                Sweetness from the Heart
              </p>
            </motion.div>

            {/* Loading Animation */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  bottom: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '8px'
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#C44569'
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#5A3825',
                    opacity: 0.7
                  }}
                >
                  Loading presentation...
                </p>
              </motion.div>
            )}

            {/* Start Button (appears after loading) */}
            {!isLoading && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setCurrentFrame(1)}
                style={{
                  position: 'absolute',
                  bottom: '80px',
                  background: '#C44569',
                  color: 'white',
                  border: 'none',
                  padding: '16px 48px',
                  borderRadius: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 16px rgba(196, 69, 105, 0.3)',
                  transition: 'all 200ms ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(196, 69, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.3)';
                }}
              >
                <Play size={20} />
                Start Presentation
              </motion.button>
            )}

            {/* Presentation Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                position: 'absolute',
                bottom: '24px',
                fontSize: '12px',
                color: '#5A3825',
                opacity: 0.7,
                textAlign: 'center'
              }}
            >
              CIS 3343 Final Project | Design System Presentation
            </motion.div>
          </motion.div>
        )}

        {/* Frame 1: Front-End Overview */}
        {currentFrame === 1 && (
          <motion.div
            key="frontend"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              background: frames[1].background
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              background: frames[1].background,
              padding: '48px',
              overflow: 'hidden'
            }}
          >
            {/* Title */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: '40px', textAlign: 'center' }}
            >
              <h2
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '48px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '12px'
                }}
              >
                Customer Experience
              </h2>
              <p
                style={{
                  fontSize: '18px',
                  color: '#5A3825',
                  opacity: 0.8
                }}
              >
                Warm, welcoming, emotional shopping journey
              </p>
            </motion.div>

            {/* Front-End Sections Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '32px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}
            >
              {[
                {
                  title: 'Hero Experience',
                  label: 'Customer Journey',
                  description: 'Full viewport video hero with glassmorphism',
                  icon: '🎬',
                  delay: 0.3
                },
                {
                  title: 'Custom Cake Builder',
                  label: 'Order Builder',
                  description: 'Multi-step wizard with real-time preview',
                  icon: '🎨',
                  delay: 0.4
                },
                {
                  title: 'Gallery Showcase',
                  label: 'Visual Portfolio',
                  description: 'Masonry layout with lightbox functionality',
                  icon: '🖼️',
                  delay: 0.5
                },
                {
                  title: 'Contact & Location',
                  label: 'Customer Support',
                  description: 'Easy booking and consultation requests',
                  icon: '📍',
                  delay: 0.6
                }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: section.delay }}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 16px rgba(90, 56, 37, 0.12)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Annotation Label */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '12px',
                      color: '#5A3825',
                      opacity: 0.7,
                      background: 'rgba(248, 235, 215, 0.8)',
                      padding: '4px 12px',
                      borderRadius: '6px'
                    }}
                  >
                    {section.label}
                  </div>

                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px'
                    }}
                  >
                    {section.icon}
                  </div>
                  
                  <h3
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '24px',
                      fontWeight: 600,
                      color: '#2B2B2B',
                      marginBottom: '12px'
                    }}
                  >
                    {section.title}
                  </h3>
                  
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#5A3825',
                      lineHeight: 1.6,
                      opacity: 0.9
                    }}
                  >
                    {section.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '40px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                flexWrap: 'wrap'
              }}
            >
              {[
                '🎨 2025 Design Trends',
                '📱 Mobile-First',
                '♿ WCAG AA Compliant',
                '⚡ Performance Optimized'
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '14px',
                    color: '#5A3825',
                    fontWeight: 500,
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '8px'
                  }}
                >
                  {feature}
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Frame 2: Back-End Overview */}
        {currentFrame === 2 && (
          <motion.div
            key="backend"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              background: frames[2].background
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              background: frames[2].background,
              padding: '48px',
              overflow: 'hidden'
            }}
          >
            {/* Title */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: '40px', textAlign: 'center' }}
            >
              <h2
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '48px',
                  fontWeight: 600,
                  color: 'white',
                  marginBottom: '12px'
                }}
              >
                Admin Portal
              </h2>
              <p
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                Professional, efficient staff management dashboard
              </p>
            </motion.div>

            {/* Back-End Sections Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '32px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}
            >
              {[
                {
                  title: 'Secure Login',
                  label: 'Authentication',
                  description: 'Role-based access control with session management',
                  icon: '🔐',
                  delay: 0.3
                },
                {
                  title: 'Live Dashboard',
                  label: 'Admin Metrics',
                  description: 'Real-time KPIs with interactive data visualizations',
                  icon: '📊',
                  delay: 0.4
                },
                {
                  title: 'Order Management',
                  label: 'Workflow Control',
                  description: 'Kanban-style order tracking and status updates',
                  icon: '📋',
                  delay: 0.5
                },
                {
                  title: 'Analytics & Reports',
                  label: 'Reports & Insights',
                  description: 'Chart.js visualizations with export capabilities',
                  icon: '📈',
                  delay: 0.6
                }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: section.delay }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Annotation Label */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '12px',
                      color: 'white',
                      opacity: 0.7,
                      background: 'rgba(196, 69, 105, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '6px'
                    }}
                  >
                    {section.label}
                  </div>

                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px'
                    }}
                  >
                    {section.icon}
                  </div>
                  
                  <h3
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '24px',
                      fontWeight: 600,
                      color: 'white',
                      marginBottom: '12px'
                    }}
                  >
                    {section.title}
                  </h3>
                  
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.6
                    }}
                  >
                    {section.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '40px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                flexWrap: 'wrap'
              }}
            >
              {[
                '🌙 Dark Mode',
                '📊 Data Visualizations',
                '🔒 Secure Authentication',
                '⚡ Real-Time Updates'
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '14px',
                    color: 'white',
                    fontWeight: 500,
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {feature}
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Frame 3: Closing Slide */}
        {currentFrame === 3 && (
          <motion.div
            key="closing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              background: frames[3].background,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              position: 'relative'
            }}
          >
            {/* Tagline */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                textAlign: 'center',
                marginBottom: '64px'
              }}
            >
              <div
                style={{
                  fontSize: '72px',
                  marginBottom: '24px'
                }}
              >
                🍰
              </div>
              
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '56px',
                  fontWeight: 700,
                  color: '#2B2B2B',
                  marginBottom: '24px',
                  lineHeight: 1.2
                }}
              >
                Emily Bakes Cakes
              </h2>
              
              <p
                style={{
                  fontFamily: 'Lucida Handwriting, cursive',
                  fontSize: '32px',
                  color: 'white',
                  fontStyle: 'italic',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                "Sweetness from the Heart"
              </p>
            </motion.div>

            {/* Project Summary */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '48px',
                maxWidth: '800px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '24px'
                }}
              >
                Design System Achievements
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px',
                  marginBottom: '32px'
                }}
              >
                {[
                  { label: 'Components', value: '87' },
                  { label: 'Pages', value: '15' },
                  { label: 'Quality Score', value: '96/100' },
                  { label: 'WCAG AA', value: '100%' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#C44569',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#5A3825',
                        opacity: 0.8
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  fontSize: '14px',
                  color: '#5A3825',
                  lineHeight: 1.8,
                  opacity: 0.9
                }}
              >
                A comprehensive dual-interface design system featuring modern 2025 web trends,
                complete WCAG AA accessibility compliance, and production-ready components
                for both customer-facing and administrative experiences.
              </div>
            </motion.div>

            {/* Team Credits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                marginTop: '48px',
                textAlign: 'center'
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: '#2B2B2B',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}
              >
                CIS 3343 - Web-Based Application Development
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: '#5A3825',
                  opacity: 0.8
                }}
              >
                Final Project | Design System & Dual Interface Application
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: '#5A3825',
                  opacity: 0.8,
                  marginTop: '16px'
                }}
              >
                Built with React, TypeScript, Tailwind CSS & Motion
              </p>
            </motion.div>

            {/* Restart Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => setCurrentFrame(0)}
              style={{
                position: 'absolute',
                bottom: '32px',
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                color: '#2B2B2B',
                border: '2px solid rgba(43, 43, 43, 0.2)',
                padding: '12px 32px',
                borderRadius: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 200ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Restart Presentation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      {currentFrame > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            zIndex: 1000,
            background: currentFrame === 2 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(43, 43, 43, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '12px 24px',
            borderRadius: '24px',
            border: currentFrame === 2 ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(43, 43, 43, 0.1)'
          }}
        >
          {/* Previous Button */}
          <button
            onClick={prevFrame}
            disabled={currentFrame === 0}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentFrame === 2 ? 'rgba(255, 255, 255, 0.2)' : 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentFrame === 0 ? 'not-allowed' : 'pointer',
              opacity: currentFrame === 0 ? 0.3 : 1,
              transition: 'all 200ms ease-out'
            }}
            onMouseEnter={(e) => {
              if (currentFrame > 0) {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ChevronLeft size={20} color={currentFrame === 2 ? 'white' : '#2B2B2B'} />
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {frames.slice(1).map((_, index) => (
              <button
                key={index}
                onClick={() => goToFrame(index + 1)}
                style={{
                  width: currentFrame === index + 1 ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentFrame === index + 1 
                    ? '#C44569' 
                    : currentFrame === 2 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(43, 43, 43, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms ease-out'
                }}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextFrame}
            disabled={currentFrame === frames.length - 1}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentFrame === 2 ? 'rgba(255, 255, 255, 0.2)' : 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentFrame === frames.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentFrame === frames.length - 1 ? 0.3 : 1,
              transition: 'all 200ms ease-out'
            }}
            onMouseEnter={(e) => {
              if (currentFrame < frames.length - 1) {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ChevronRight size={20} color={currentFrame === 2 ? 'white' : '#2B2B2B'} />
          </button>
        </div>
      )}

      {/* Keyboard Hints */}
      {currentFrame > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            fontSize: '12px',
            color: currentFrame === 2 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(43, 43, 43, 0.6)',
            fontFamily: 'Open Sans, sans-serif',
            background: currentFrame === 2 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
            padding: '8px 16px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}
        >
          Use arrow keys or click to navigate • ESC to restart
        </div>
      )}
    </div>
  );
}
