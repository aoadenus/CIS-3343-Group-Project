import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ArrowRight, Heart, Award, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { LazyImage } from '../../components/Loading/LazyImage';
import heroImage from '../../assets/hero-image.jpeg';

// Weekly Spotlight Cakes
const spotlightCakes = [
  {
    id: 1,
    title: 'Elegant Wedding Tier',
    description: 'Three-tier masterpiece with handcrafted sugar flowers',
    price: '$350',
    image: 'https://images.unsplash.com/photo-1584158531319-96912adae663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxOTc0Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 2,
    title: 'Birthday Celebration',
    description: 'Custom-decorated cake with your choice of flavors',
    price: '$85',
    image: 'https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE5ODk0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    title: 'German Chocolate',
    description: 'Rich chocolate layers with coconut pecan frosting',
    price: '$75',
    image: 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjE5OTgzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

const features = [
  {
    icon: Heart,
    title: 'Handcrafted with Love',
    description: 'Every cake is made from scratch using premium ingredients and traditional techniques.'
  },
  {
    icon: Award,
    title: 'Award-Winning Recipes',
    description: 'Recognized for excellence in taste, design, and customer satisfaction.'
  },
  {
    icon: Clock,
    title: 'Custom & Timely',
    description: 'Personalized designs delivered exactly when you need them, guaranteed fresh.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Emily made the most beautiful wedding cake for us. Every guest asked where we got it!'
  },
  {
    name: 'Michael Chen',
    rating: 5,
    text: 'The German Chocolate cake is absolutely divine. Best I\'ve ever had, hands down.'
  },
  {
    name: 'Lisa Martinez',
    rating: 5,
    text: 'Professional, creative, and delicious. Emily exceeded all our expectations!'
  }
];

interface PublicHomeProps {
  onNavigate?: (page: string) => void;
}

export function PublicHome({ onNavigate }: PublicHomeProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-rotate carousel every 10 seconds
  useEffect(() => {
    if (isDragging) return; // Don't auto-rotate while dragging
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spotlightCakes.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isDragging]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spotlightCakes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + spotlightCakes.length) % spotlightCakes.length);
  };

  // Handle swipe gestures
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold) {
      prevSlide();
    } else if (info.offset.x < -swipeThreshold) {
      nextSlide();
    }
  };

  return (
    <div className="w-full" style={{ background: '#F8EBD7' }}>
      {/* HERO SECTION with ANIMATED MESH GRADIENT
          - Uses global.css animated-gradient-hero class for smooth mesh gradients
          - Animated layers (gradient-layer-1/2/3) create depth and movement
          - WCAG AA compliant contrast ratios for text readability
          - Micro-interactions on CTA button (hover, scale, shadow)
      */}
      <section 
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden'
        }}
      >
        {/* Background Image */}
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}>
          <img
            src={heroImage}
            alt="Emily Bakes Cakes hero"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.5
            }}
          />
        </div>

        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(43, 43, 43, 0.5) 0%, rgba(43, 43, 43, 0.7) 100%)',
          zIndex: 2
        }} />

        {/* Text Content */}
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '1000px' }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '72px',
              fontWeight: 800,
              color: 'white',
              marginBottom: '20px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              Emily Bakes Cakes
            </h1>
            
            <div style={{
              width: '200px',
              height: '4px',
              background: '#C44569',
              margin: '0 auto 30px auto'
            }} />
            
            <h2 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '36px',
              fontWeight: 600,
              color: '#F8EBD7',
              marginBottom: '30px',
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)'
            }}>
              Custom Cakes Crafted with<br />
              <span style={{ color: '#C44569' }}>Love and Tradition</span>
            </h2>
            
            <p style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#F8EBD7',
              marginBottom: '40px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              maxWidth: '700px',
              margin: '0 auto 40px'
            }}>
              We work exclusively by phone, visit, or email to ensure every cake is perfect for your special day.
            </p>
            
            <a
              href="tel:713-555-2253"
              style={{
                background: '#C44569',
                color: 'white',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                padding: '20px 64px',
                borderRadius: '16px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(196, 69, 105, 0.6)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                textDecoration: 'none'
              }}
            >
              📞 Call to Order
              <ArrowRight size={26} strokeWidth={3} />
            </a>
          </div>
        </div>
      </section>

      {/* Weekly Spotlight Carousel - Swipeable with Gradient Divider */}
      <section 
        className="py-12 sm:py-16 px-4 sm:px-6 gradient-divider"
        style={{ background: '#F8EBD7' }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(28px, 5.5vw, 42px)',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '16px'
              }}
            >
              Weekly Spotlight
            </h2>
            <p 
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(16px, 3.5vw, 20px)',
                color: '#5A3825',
                lineHeight: 1.7,
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              Emily's handpicked cake highlights for this week — fresh inspiration for your next celebration
            </p>
          </motion.div>

          {/* Swipeable Carousel */}
          <div className="relative overflow-hidden" style={{ touchAction: 'pan-y' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                <Card 
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(90, 56, 37, 0.12)',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image with Lazy Loading */}
                    <div className="aspect-square md:aspect-auto">
                      <LazyImage
                        src={spotlightCakes[currentSlide].image}
                        alt={spotlightCakes[currentSlide].title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                      <div className="mb-3 sm:mb-4">
                        <span 
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: 'clamp(12px, 3vw, 14px)',
                            fontWeight: 600,
                            color: '#C44569',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                          }}
                        >
                          Featured This Week
                        </span>
                      </div>

                      <h3 
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: 'clamp(24px, 5vw, 36px)',
                          fontWeight: 600,
                          color: '#2B2B2B',
                          marginBottom: '16px'
                        }}
                      >
                        {spotlightCakes[currentSlide].title}
                      </h3>

                      <p 
                        style={{
                          fontFamily: 'Open Sans, sans-serif',
                          fontSize: 'clamp(16px, 3.5vw, 18px)',
                          color: '#5A3825',
                          lineHeight: 1.8,
                          marginBottom: '24px'
                        }}
                      >
                        {spotlightCakes[currentSlide].description}
                      </p>

                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div>
                          <p 
                            style={{
                              fontFamily: 'Open Sans, sans-serif',
                              fontSize: 'clamp(14px, 3vw, 16px)',
                              color: '#5A3825',
                              marginBottom: '6px'
                            }}
                          >
                            Starting at
                          </p>
                          <p 
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: 'clamp(28px, 6vw, 32px)',
                              fontWeight: 700,
                              color: '#C44569'
                            }}
                          >
                            {spotlightCakes[currentSlide].price}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="#C44569" color="#C44569" />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate?.('contact')}
                        style={{
                          background: '#C44569',
                          color: 'white',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: 'clamp(16px, 3.5vw, 18px)',
                          padding: '16px 40px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(196, 69, 105, 0.25)',
                          transition: 'all 250ms ease',
                          width: '100%',
                          minHeight: '56px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(196, 69, 105, 0.25)';
                        }}
                      >
                        Contact Us
                      </button>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Navigation */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous slide"
                style={{
                  width: '52px',
                  height: '52px',
                  minWidth: '52px',
                  minHeight: '52px',
                  borderRadius: '50%',
                  background: '#C44569',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                <ChevronLeft size={28} color="white" strokeWidth={3} />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-2">
                {spotlightCakes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    style={{
                      width: currentSlide === index ? '32px' : '12px',
                      height: '12px',
                      minWidth: currentSlide === index ? '32px' : '12px',
                      minHeight: '12px',
                      borderRadius: '6px',
                      background: currentSlide === index ? '#C44569' : '#E5D4C1',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 300ms ease'
                    }}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next slide"
                style={{
                  width: '52px',
                  height: '52px',
                  minWidth: '52px',
                  minHeight: '52px',
                  borderRadius: '50%',
                  background: '#C44569',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                <ChevronRight size={28} color="white" strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile-First Grid with Gradient Divider */}
      <section 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 gradient-divider"
        style={{ background: '#F8EBD7' }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '12px'
              }}
            >
              Why Choose Emily Bakes Cakes
            </h2>
            <p 
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#5A3825',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              We're not just bakers—we're artisans dedicated to making every celebration extraordinary.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Card 
                  className="card-with-gradient-depth"
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #E0E0E0',
                    padding: 'clamp(24px, 5vw, 32px)',
                    height: '100%',
                    transition: 'all 250ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(90, 56, 37, 0.16)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(90, 56, 37, 0.12)';
                  }}
                >
                  <div 
                    style={{
                      width: 'clamp(56px, 12vw, 64px)',
                      height: 'clamp(56px, 12vw, 64px)',
                      borderRadius: '50%',
                      background: 'rgba(196, 69, 105, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}
                  >
                    <feature.icon size={32} color="#C44569" />
                  </div>
                  <h4 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 'clamp(17px, 3.5vw, 20px)',
                      fontWeight: 600,
                      color: '#2B2B2B',
                      marginBottom: '12px'
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p 
                    style={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: 'clamp(14px, 3vw, 15px)',
                      color: '#5A3825',
                      lineHeight: 1.7
                    }}
                  >
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Explore Our Story Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              textAlign: 'center',
              marginTop: '48px'
            }}
          >
            <motion.button
              onClick={() => onNavigate?.('about')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: '#C44569',
                color: 'white',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(16px, 3vw, 18px)',
                padding: '16px 48px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(196, 69, 105, 0.3)',
                transition: 'all 250ms ease'
              }}
            >
              Explore Our Story
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Mobile-First Grid with Gradient Divider */}
      <section 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 gradient-divider"
        style={{ 
          background: 'linear-gradient(to bottom, white 0%, rgba(248, 235, 215, 0.3) 100%)'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '12px'
              }}
            >
              What Our Clients Say
            </h2>
            <p 
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#5A3825'
              }}
            >
              True experiences from memorable celebrations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Card 
                  style={{
                    background: '#F8EBD7',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(90, 56, 37, 0.12)',
                    border: 'none',
                    padding: 'clamp(24px, 5vw, 32px)',
                    height: '100%'
                  }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#C44569" color="#C44569" />
                    ))}
                  </div>
                  <p 
                    className="mb-6"
                    style={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: 'clamp(14px, 3vw, 15px)',
                      color: '#5A3825',
                      lineHeight: 1.7,
                      fontStyle: 'italic'
                    }}
                  >
                    "{testimonial.text}"
                  </p>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 'clamp(14px, 3vw, 15px)',
                      fontWeight: 600,
                      color: '#C44569'
                    }}
                  >
                    — {testimonial.name}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION - Full-Width Modern Card
          - Primary and secondary button styles (btn-primary, btn-secondary from global.css)
          - Responsive flex layout for mobile and desktop
          - Animated entrance on scroll (whileInView)
      */}
      <section 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 mb-8"
        style={{ background: '#F8EBD7' }}
      >
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center relative overflow-hidden"
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: 'clamp(48px, 8vw, 72px) clamp(32px, 6vw, 56px)',
              boxShadow: '0 12px 40px rgba(90, 56, 37, 0.18)',
              border: '2px solid rgba(196, 69, 105, 0.12)',
              position: 'relative',
              zIndex: 10
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Subtle background decoration */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 opacity-10"
              style={{
                background: 'radial-gradient(circle, rgba(196, 69, 105, 0.3) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <h2 
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(28px, 6vw, 48px)',
                fontWeight: 700,
                color: '#2B2B2B',
                marginBottom: '16px',
                lineHeight: 1.2
              }}
            >
              Ready to Create Something
              <br />
              <span style={{ color: '#C44569' }}>Extraordinary?</span>
            </h2>
            
            <p 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(16px, 3.5vw, 20px)',
                color: '#5A3825',
                lineHeight: 1.7,
                maxWidth: '700px',
                margin: '0 auto',
                marginBottom: 'clamp(32px, 6vw, 48px)'
              }}
            >
              Emily creates beautiful, personalized cakes for every occasion. Call us today to discuss your vision and bring your celebration to life!
            </p>

            {/* Primary and Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary Button - "Call to Order" */}
              <a
                href="tel:713-555-2253"
                className="group"
                style={{
                  background: '#C44569',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '17px',
                  padding: '18px 48px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(196, 69, 105, 0.35)',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: '56px',
                  minWidth: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(196, 69, 105, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(196, 69, 105, 0.35)';
                }}
                aria-label="Call to order your custom cake"
              >
                📞 Call to Order
              </a>

              {/* Secondary Button - "Visit Us" */}
              <button
                onClick={() => onNavigate?.('contact')}
                className="group"
                style={{
                  background: 'transparent',
                  color: '#C44569',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '17px',
                  padding: '18px 48px',
                  borderRadius: '12px',
                  border: '2px solid #C44569',
                  cursor: 'pointer',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: '56px',
                  minWidth: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(196, 69, 105, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                aria-label="Visit us or send a message"
              >
                📍 Visit Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
