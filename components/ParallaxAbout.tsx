import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

/**
 * Parallax Scrolling Storytelling About Page
 * 5 full-screen sections with different scroll speeds
 * Uses Intersection Observer-style scroll triggers
 */

export function ParallaxAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [activeSection, setActiveSection] = useState(0);

  // Section 1: Portrait parallax
  const portrait ForegroundY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const portraitBackgroundY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Section 3: Split screen arrow
  const arrowRotation = useTransform(scrollYProgress, [0.4, 0.6], [0, 360]);

  // Timeline milestones
  const milestones = [
    { year: '2018', title: 'Founded in Houston', description: 'Emily begins her journey' },
    { year: '2019', title: 'First Wedding Cake', description: '50+ weddings served' },
    { year: '2021', title: 'Award Winner', description: 'Best Local Bakery' },
    { year: '2023', title: 'Expansion', description: 'New commercial kitchen' },
    { year: '2025', title: 'Innovation', description: 'Custom 3D cake designs' }
  ];

  // Intersection Observer for scroll triggers
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sections = document.querySelectorAll('[data-section]');

    sections.forEach((section, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(index);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div ref={containerRef} style={{ background: '#F8EBD7' }}>
      {/* Section 1: Emily's Portrait with European Landscape Background */}
      <section
        data-section="0"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Background - scrolls slower */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            y: portraitBackgroundY,
            backgroundImage: 'url(https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }}
        />

        {/* Foreground Content - scrolls faster */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 1,
            y: portraitForegroundY,
            textAlign: 'center',
            color: 'white',
            padding: '0 24px'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              margin: '0 auto 32px',
              border: '4px solid white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}
          >
            👩‍🍳
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 700,
              marginBottom: '16px',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            Meet Emily
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(16px, 3vw, 20px)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            From the patisseries of Paris to the heart of Houston, bringing European artistry to every celebration.
          </motion.p>
        </motion.div>
      </section>

      {/* Section 2: Timeline with Scroll-Triggered Milestones */}
      <section
        data-section="1"
        style={{
          position: 'relative',
          minHeight: '100vh',
          padding: '80px 24px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 600,
              color: '#2B2B2B',
              textAlign: 'center',
              marginBottom: '64px'
            }}
          >
            Our Journey
          </motion.h2>

          {/* Vertical Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Center line */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'linear-gradient(to bottom, #C44569 0%, #E5D4C1 100%)',
                transform: 'translateX(-50%)'
              }}
            />

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: index % 2 === 0 ? '1fr auto 1fr' : '1fr auto 1fr',
                  gap: '32px',
                  marginBottom: '48px',
                  alignItems: 'center'
                }}
              >
                {/* Left content (alternating) */}
                <div style={{ textAlign: index % 2 === 0 ? 'right' : 'left', order: index % 2 === 0 ? 1 : 3 }}>
                  {index % 2 === 0 && (
                    <>
                      <div
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '24px',
                          fontWeight: 700,
                          color: '#C44569',
                          marginBottom: '8px'
                        }}
                      >
                        {milestone.year}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '20px',
                          fontWeight: 600,
                          color: '#2B2B2B',
                          marginBottom: '4px'
                        }}
                      >
                        {milestone.title}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Open Sans, sans-serif',
                          fontSize: '16px',
                          color: '#5A3825'
                        }}
                      >
                        {milestone.description}
                      </div>
                    </>
                  )}
                </div>

                {/* Center dot */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#C44569',
                    border: '4px solid white',
                    boxShadow: '0 0 0 2px #C44569',
                    order: 2,
                    zIndex: 1
                  }}
                />

                {/* Right content (alternating) */}
                <div style={{ textAlign: index % 2 === 0 ? 'left' : 'right', order: index % 2 === 0 ? 3 : 1 }}>
                  {index % 2 !== 0 && (
                    <>
                      <div
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '24px',
                          fontWeight: 700,
                          color: '#C44569',
                          marginBottom: '8px'
                        }}
                      >
                        {milestone.year}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '20px',
                          fontWeight: 600,
                          color: '#2B2B2B',
                          marginBottom: '4px'
                        }}
                      >
                        {milestone.title}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Open Sans, sans-serif',
                          fontSize: '16px',
                          color: '#5A3825'
                        }}
                      >
                        {milestone.description}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Split-Screen "From Paris to Houston" */}
      <section
        data-section="2"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
          {/* Left: Paris */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              backgroundImage: 'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(196, 69, 105, 0.7)'
              }}
            />
            <h3
              style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                textShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              From Paris
            </h3>
          </motion.div>

          {/* Right: Houston */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              backgroundImage: 'url(https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2000)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(90, 56, 37, 0.7)'
              }}
            />
            <h3
              style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                textShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              To Houston
            </h3>
          </motion.div>
        </div>

        {/* Center Divider with Animated Arrow */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            rotate: arrowRotation
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <ArrowRight size={32} color="#C44569" />
          </div>
        </motion.div>
      </section>

      {/* Section 4: Team Photos Carousel */}
      <section
        data-section="3"
        style={{
          position: 'relative',
          minHeight: '100vh',
          padding: '80px 24px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 600,
              color: '#2B2B2B',
              marginBottom: '48px'
            }}
          >
            Our Team
          </motion.h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px'
            }}
          >
            {['Emily', 'Sarah', 'Michael', 'Jessica'].map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F8EBD7 0%, #E5D4C1 100%)',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    border: '4px solid #C44569'
                  }}
                >
                  {index === 0 ? '👩‍🍳' : index === 1 ? '👨‍🍳' : index === 2 ? '👩' : '👨'}
                </div>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#2B2B2B'
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '14px',
                    color: '#5A3825'
                  }}
                >
                  {index === 0 ? 'Head Baker' : 'Pastry Chef'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Call-to-Action with Store Location Map */}
      <section
        data-section="4"
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: '#F8EBD7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: '800px',
            width: '100%',
            background: 'white',
            borderRadius: '24px',
            padding: '48px 32px',
            boxShadow: '0 8px 32px rgba(90, 56, 37, 0.15)',
            textAlign: 'center'
          }}
        >
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: '#2B2B2B',
              marginBottom: '16px'
            }}
          >
            Visit Our Kitchen
          </h2>

          <p
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '18px',
              color: '#5A3825',
              marginBottom: '32px',
              lineHeight: 1.6
            }}
          >
            Come taste the magic. Book a consultation or pickup your order at our Houston location.
          </p>

          {/* Map Placeholder */}
          <div
            style={{
              width: '100%',
              height: '300px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #E5D4C1 0%, #F8EBD7 100%)',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid #E5D4C1'
            }}
          >
            <MapPin size={64} color="#C44569" />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  margin: 0
                }}
              >
                123 Baker Street, Houston, TX 77002
              </p>
            </div>
          </div>

          <button
            style={{
              background: '#C44569',
              color: 'white',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              padding: '16px 48px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
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
            Book a Consultation
          </button>
        </motion.div>
      </section>
    </div>
  );
}
