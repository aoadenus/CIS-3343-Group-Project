/**
 * About Page - Parisian/European Aesthetic
 * Dark mode design with elegant French bakery inspiration
 * Complete Parisian redesign with Eiffel Tower, bokeh lights, gradient text
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Award, Heart, Users, MapPin, Croissant, Coffee } from 'lucide-react';
import { Card } from '../../components/ui/card';

const milestones = [
  { year: '2015', title: 'Parisian Training', description: 'Studied at Le Cordon Bleu, Paris' },
  { year: '2017', title: 'European Tour', description: 'Mastered techniques across France, Italy, and Belgium' },
  { year: '2018', title: 'Houston Opening', description: 'Brought Parisian artistry to Texas' },
  { year: '2020', title: 'Award Recognition', description: 'Best European-Style Bakery' },
  { year: '2023', title: 'Expanded Team', description: '12 artisan bakers from across Europe' },
  { year: '2025', title: 'Digital Innovation', description: 'Custom cake builder with Parisian flair' }
];

const values = [
  {
    icon: Heart,
    title: 'Artisan Craftsmanship',
    description: 'Every cake is handcrafted using traditional European techniques passed down through generations.'
  },
  {
    icon: Award,
    title: 'Premium Ingredients',
    description: 'French butter, Belgian chocolate, Italian vanilla—only the finest ingredients from Europe.'
  },
  {
    icon: Users,
    title: 'Personal Touch',
    description: 'Like a Parisian pâtisserie, we know our customers by name and remember their preferences.'
  },
  {
    icon: Coffee,
    title: 'Café Experience',
    description: 'More than a bakery—a place to savor life\'s sweet moments, European-style.'
  }
];

export function About() {
  const { scrollY } = useScroll();
  
  // Parallax effect for Eiffel Tower
  const eiffelY = useTransform(scrollY, [0, 1000], [0, -200]);
  const eiffelOpacity = useTransform(scrollY, [0, 500], [0.05, 0]);

  return (
    <div className="min-h-screen" style={{ background: '#2B2B2B' }}>
      {/* Hero Section - Dark European Aesthetic */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(120deg, #2B2B2B 0%, #3D2A2A 30%, #C44569 60%, #F8EBD7 100%)'
        }}
      >
        {/* Eiffel Tower Silhouette (Parallax Background) */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            opacity: eiffelOpacity,
            y: eiffelY,
            zIndex: 1
          }}
        >
          <svg width="300" height="600" viewBox="0 0 100 200" fill="none">
            <path
              d="M50 10 L40 50 L20 100 L30 200 L70 200 L80 100 L60 50 Z M35 100 L65 100 M40 120 L60 120 M42 140 L58 140"
              stroke="rgba(248, 235, 215, 0.05)"
              strokeWidth="1"
              fill="rgba(248, 235, 215, 0.03)"
            />
          </svg>
        </motion.div>

        {/* Gold Dust Overlay Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(248, 235, 215, 0.08) 1px, transparent 1px),
              radial-gradient(circle at 60% 70%, rgba(248, 235, 215, 0.08) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(248, 235, 215, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 150px 150px, 120px 120px',
            opacity: 0.6,
            zIndex: 2
          }}
        />

        {/* Bokeh Light Specks */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(248, 235, 215, 0.3) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(8px)',
              pointerEvents: 'none',
              zIndex: 3
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Decorative Icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginBottom: '24px', display: 'inline-block' }}
            >
              <Croissant size={48} color="#F8EBD7" style={{ opacity: 0.8 }} />
            </motion.div>

            {/* Gradient Text Heading */}
            <h1 
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(36px, 8vw, 64px)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #F8EBD7 0%, #C44569 50%, #F8EBD7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 20px rgba(196, 69, 105, 0.3)'
              }}
            >
              From Paris to Houston
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                fontFamily: 'Lucida Handwriting, cursive',
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontStyle: 'italic',
                color: '#F8EBD7',
                marginBottom: '32px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}
            >
              Baked with Love
              
              {/* Animated Underline Stroke */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #C44569, transparent)',
                  borderRadius: '2px'
                }}
              />
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(16px, 3vw, 20px)',
                color: 'rgba(248, 235, 215, 0.85)',
                lineHeight: 1.7,
                maxWidth: '700px',
                margin: '0 auto',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
              }}
            >
              European artistry meets Southern hospitality. Trained in the finest pâtisseries of Paris,
              we bring authentic French techniques and passion to every celebration.
            </motion.p>

            {/* Map Connection Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              style={{
                marginTop: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={24} color="#F8EBD7" />
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#F8EBD7', fontSize: '18px' }}>
                  Paris
                </span>
              </div>

              {/* Dotted Path Animation */}
              <motion.div
                style={{
                  width: '100px',
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, #C44569 0, #C44569 5px, transparent 5px, transparent 10px)',
                  position: 'relative'
                }}
              >
                <motion.div
                  animate={{ x: [0, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#C44569',
                    boxShadow: '0 0 10px rgba(196, 69, 105, 0.8)',
                    top: '-3px'
                  }}
                />
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={24} color="#C44569" />
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#C44569', fontSize: '18px' }}>
                  Houston
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, transparent 0%, #2B2B2B 100%)',
            zIndex: 5
          }}
        />
      </section>

      {/* Emily's Story - Charcoal Section */}
      <section style={{ background: '#2B2B2B', padding: 'clamp(64px, 10vh, 120px) clamp(24px, 5vw, 48px)' }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image with European Border Pattern */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative' }}
            >
              {/* Decorative European Border */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.3) 0%, rgba(233, 233, 233, 0.1) 50%, rgba(196, 69, 105, 0.2) 100%)',
                  padding: '2px',
                  zIndex: 1
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#2B2B2B',
                    borderRadius: '14px'
                  }}
                />
              </div>

              <div
                className="aspect-square rounded-2xl overflow-hidden relative z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.15) 0%, rgba(90, 56, 37, 0.1) 100%)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Heart size={120} color="rgba(196, 69, 105, 0.4)" />
                </div>
              </div>

              {/* Floating Accent Icon */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '-24px',
                  background: 'rgba(196, 69, 105, 0.9)',
                  borderRadius: '50%',
                  padding: '16px',
                  boxShadow: '0 8px 32px rgba(196, 69, 105, 0.4)',
                  zIndex: 20
                }}
              >
                <Award size={32} color="white" />
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(32px, 6vw, 48px)',
                  color: '#F8EBD7',
                  marginBottom: '24px',
                  lineHeight: 1.3
                }}
              >
                The Artisan Behind the Art
              </h2>

              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #C44569, transparent)',
                    borderRadius: '2px',
                    marginBottom: '32px'
                  }}
                />

                <div style={{ color: 'rgba(248, 235, 215, 0.85)', lineHeight: 1.8, fontSize: '17px', fontFamily: 'Open Sans' }}>
                  <p style={{ marginBottom: '20px' }}>
                    Emily's journey began in the cobblestone streets of Paris, where she apprenticed under
                    Master Pâtissier Jean-Claude Dubois at La Maison du Chocolat. There, among the aroma of
                    fresh croissants and handcrafted éclairs, she discovered her calling.
                  </p>
                  <p style={{ marginBottom: '20px' }}>
                    After years perfecting her craft across Europe—from the chocolate workshops of Brussels
                    to the artisan bakeries of Florence—Emily returned to Houston with a mission: to bring
                    authentic European pastry artistry to Texas, one cake at a time.
                  </p>
                  <p>
                    Today, she leads a team of 12 artisan bakers, each trained in traditional European
                    techniques, creating cakes that are not just desserts—they're edible works of art.
                  </p>
                </div>
              </div>

              {/* Stats with Raspberry Pink Accents */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '10+', label: 'Years in Paris' },
                  { value: '2,500+', label: 'Cakes Crafted' },
                  { value: '850+', label: 'Happy Clients' },
                  { value: '5.0★', label: 'Perfect Rating' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: 'rgba(196, 69, 105, 0.08)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(196, 69, 105, 0.2)'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Playfair Display',
                        fontSize: 'clamp(28px, 5vw, 36px)',
                        color: '#C44569',
                        fontWeight: 700,
                        marginBottom: '4px'
                      }}
                    >
                      {stat.value}
                    </p>
                    <p style={{ color: 'rgba(248, 235, 215, 0.7)', fontSize: '14px', fontFamily: 'Open Sans' }}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section - "Visit Paris in Every Bite" */}
      <section
        style={{
          background: 'linear-gradient(135deg, #C44569 0%, #8B3049 100%)',
          padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 48px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Café Window Reflection Effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%),
              linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%)
            `,
            backgroundSize: '100px 100px',
            opacity: 0.3
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.h2
            style={{
              fontFamily: 'Lucida Handwriting, cursive',
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontStyle: 'italic',
              color: 'white',
              marginBottom: '24px',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            "Visit Paris in Every Bite"
            
            {/* Animated Underline Stroke */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: '-12px',
                left: 0,
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '2px',
                transformOrigin: 'left'
              }}
            />
          </motion.h2>

          <p
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: 'clamp(16px, 3vw, 20px)',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.7,
              marginTop: '48px'
            }}
          >
            We don't just bake cakes—we create experiences. Each creation captures the elegance of a Parisian
            pâtisserie, the warmth of a neighborhood boulangerie, and the artistry of European tradition.
          </p>
        </motion.div>
      </section>

      {/* Our Values - Cream Background */}
      <section style={{ background: '#F8EBD7', padding: 'clamp(64px, 10vh, 120px) clamp(24px, 5vw, 48px)' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: 'Playfair Display',
                fontSize: 'clamp(32px, 6vw, 48px)',
                color: '#2B2B2B',
                marginBottom: '16px'
              }}
            >
              European Excellence
            </h2>
            <div
              style={{
                width: '100px',
                height: '3px',
                background: '#C44569',
                margin: '0 auto 24px',
                borderRadius: '2px'
              }}
            />
            <p style={{ color: '#5A3825', maxWidth: '600px', margin: '0 auto', fontSize: '17px' }}>
              The values that guide every creation from our kitchen to your celebration
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  style={{
                    background: 'white',
                    padding: '32px',
                    height: '100%',
                    border: '2px solid rgba(196, 69, 105, 0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px',
                      background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.15) 0%, rgba(196, 69, 105, 0.05) 100%)',
                      border: '2px solid rgba(196, 69, 105, 0.2)'
                    }}
                  >
                    <value.icon size={32} color="#C44569" />
                  </div>
                  <h4
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#2B2B2B',
                      marginBottom: '12px'
                    }}
                  >
                    {value.title}
                  </h4>
                  <p style={{ color: '#5A3825', lineHeight: 1.7, fontSize: '16px' }}>
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Charcoal with Raspberry Borders */}
      <section style={{ background: '#2B2B2B', padding: 'clamp(64px, 10vh, 120px) clamp(24px, 5vw, 48px)' }}>
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: 'Playfair Display',
                fontSize: 'clamp(32px, 6vw, 48px)',
                color: '#F8EBD7',
                marginBottom: '16px'
              }}
            >
              Our Journey
            </h2>
            <p style={{ color: 'rgba(248, 235, 215, 0.7)', fontSize: '17px' }}>
              From Parisian apprentice to Houston artisan
            </p>
          </motion.div>

          <div style={{ position: 'relative' }}>
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                className="relative pl-12 pb-12 last:pb-0"
                style={{
                  borderLeft: '2px solid rgba(196, 69, 105, 0.3)'
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Raspberry Dot */}
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#C44569',
                    transform: 'translateX(-9px)',
                    boxShadow: '0 0 0 4px #2B2B2B, 0 0 20px rgba(196, 69, 105, 0.5)',
                    zIndex: 10
                  }}
                />

                {/* Content Card */}
                <div
                  style={{
                    background: 'rgba(196, 69, 105, 0.08)',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(196, 69, 105, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Poppins',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#C44569',
                      marginBottom: '8px',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {milestone.year}
                  </p>
                  <h5
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#F8EBD7',
                      marginBottom: '8px'
                    }}
                  >
                    {milestone.title}
                  </h5>
                  <p style={{ color: 'rgba(248, 235, 215, 0.7)', fontSize: '15px', lineHeight: 1.6 }}>
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Pastel Gradient */}
      <section
        style={{
          background: 'linear-gradient(135deg, #F8EBD7 0%, #FFD6BA 50%, #F7B1C3 100%)',
          padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 48px)'
        }}
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px)',
              padding: 'clamp(48px, 8vh, 72px)',
              borderRadius: '24px',
              textAlign: 'center',
              border: '2px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)'
            }}
          >
            <h2
              style={{
                fontFamily: 'Playfair Display',
                fontSize: 'clamp(28px, 6vw, 42px)',
                color: '#2B2B2B',
                marginBottom: '20px'
              }}
            >
              Experience Parisian Artistry
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: '#5A3825',
                marginBottom: '32px',
                lineHeight: 1.7,
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}
            >
              Let's create a masterpiece together. From Paris to your celebration—
              handcrafted with European precision and Texas heart.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: '#C44569',
                color: 'white',
                border: 'none',
                padding: '18px 48px',
                borderRadius: '12px',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(196, 69, 105, 0.4)',
                minWidth: '240px',
                minHeight: '56px'
              }}
            >
              Start Your Order
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
