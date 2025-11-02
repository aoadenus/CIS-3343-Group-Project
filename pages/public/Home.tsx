import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { ArrowRight, Heart, Award, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { LazyImage } from '../../components/Loading/LazyImage';
import { SkeletonCard } from '../../components/Loading/SkeletonCard';

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

export function PublicHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const x = useMotionValue(0);

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set([...prev, id]));
  };

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    if (isDragging) return; // Don't auto-rotate while dragging
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spotlightCakes.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isDragging]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spotlightCakes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + spotlightCakes.length) % spotlightCakes.length);
  };

  // Handle swipe gestures
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
      {/* Hero Section - 85vh Full-Bleed Lifestyle Image */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          height: '85vh',
          minHeight: '500px'
        }}
      >
        {/* Full-Bleed Lifestyle Cake Image */}
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1736959574670-a8ace9856e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwY2FrZSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MjAzNjA2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Elegant celebration cake lifestyle"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>

        {/* Overlay Gradient: transparent to rgba(248,235,215,0.3) */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(248, 235, 215, 0.3) 100%)'
          }}
        />

        {/* Hero Content - Center Aligned */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-4xl">
            {/* H1: Lucida Handwriting 28px Raspberry Pink */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontFamily: 'Lucida Handwriting, cursive',
                fontSize: '28px',
                color: '#C44569',
                marginBottom: '24px',
                textShadow: '0 2px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              Sweetness from the Heart
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(15px, 3.5vw, 18px)',
                color: '#5A3825',
                lineHeight: 1.6,
                maxWidth: '600px',
                margin: '0 auto 32px auto',
                textShadow: '0 1px 4px rgba(255, 255, 255, 0.8)',
                padding: '0 16px'
              }}
            >
              Premium custom cakes handcrafted with passion and precision. 
              Making your celebrations unforgettable since 2018.
            </motion.p>

            {/* Prominent CTA: Raspberry Pink #C44569, White text, 16px padding, 12px radius, subtle shadow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                className="group cta-button-hover"
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
                  boxShadow: '0 4px 16px rgba(196, 69, 105, 0.35)',
                  transition: 'all 200ms ease-out',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  minHeight: '48px',
                  minWidth: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(196, 69, 105, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.35)';
                }}
              >
                Order Custom Cake
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
            </motion.div>
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
                fontSize: 'clamp(24px, 5vw, 36px)',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '12px'
              }}
            >
              Weekly Spotlight
            </h2>
            <p 
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#5A3825',
                lineHeight: 1.6
              }}
            >
              This week's featured cakes, handpicked by Emily
            </p>
          </motion.div>

          {/* Swipeable Carousel */}
          <div className="relative overflow-hidden">
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
                transition={{ duration: 0.5 }}
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
                        onLoad={() => handleImageLoad(spotlightCakes[currentSlide].id)}
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                      <div className="mb-3 sm:mb-4">
                        <span 
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: 'clamp(10px, 2.5vw, 12px)',
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
                          fontSize: 'clamp(20px, 4.5vw, 32px)',
                          fontWeight: 600,
                          color: '#2B2B2B',
                          marginBottom: '12px'
                        }}
                      >
                        {spotlightCakes[currentSlide].title}
                      </h3>

                      <p 
                        style={{
                          fontFamily: 'Open Sans, sans-serif',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                          color: '#5A3825',
                          lineHeight: 1.7,
                          marginBottom: '20px'
                        }}
                      >
                        {spotlightCakes[currentSlide].description}
                      </p>

                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div>
                          <p 
                            style={{
                              fontFamily: 'Open Sans, sans-serif',
                              fontSize: 'clamp(12px, 2.5vw, 14px)',
                              color: '#5A3825',
                              marginBottom: '4px'
                            }}
                          >
                            Starting at
                          </p>
                          <p 
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: 'clamp(24px, 5vw, 28px)',
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
                        style={{
                          background: '#C44569',
                          color: 'white',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 600,
                          fontSize: 'clamp(14px, 3vw, 15px)',
                          padding: '14px 32px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(196, 69, 105, 0.25)',
                          transition: 'all 250ms ease',
                          width: '100%',
                          minHeight: '48px'
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
                        Order Now
                      </button>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Navigation */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid #C44569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                  boxShadow: '0 2px 8px rgba(90, 56, 37, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#C44569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <ChevronLeft size={24} color="#C44569" />
              </button>

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

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid #C44569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                  boxShadow: '0 2px 8px rgba(90, 56, 37, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#C44569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <ChevronRight size={24} color="#C44569" />
              </button>
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
              Real stories from real celebrations
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

      {/* Final CTA Section - Mobile-First */}
      <section 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6"
        style={{ background: '#F8EBD7' }}
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center"
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: 'clamp(32px, 6vw, 48px) clamp(20px, 4vw, 32px)',
              boxShadow: '0 4px 8px rgba(90, 56, 37, 0.12)'
            }}
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
              Ready to Create Something Delicious?
            </h2>
            <p 
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#5A3825',
                lineHeight: 1.6,
                marginBottom: 'clamp(24px, 5vw, 32px)',
                maxWidth: '600px',
                margin: '0 auto',
                marginBottom: 'clamp(24px, 5vw, 32px)'
              }}
            >
              Let's design your perfect cake together. Start our custom cake builder or get in touch with Emily directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                style={{
                  background: '#C44569',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  padding: 'clamp(14px, 3vw, 16px) clamp(32px, 6vw, 40px)',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)',
                  transition: 'all 250ms ease',
                  minWidth: '200px',
                  minHeight: '48px',
                  width: '100%',
                  maxWidth: '300px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(196, 69, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.3)';
                }}
              >
                Start Building
              </button>
              <button
                style={{
                  background: 'transparent',
                  color: '#C44569',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  padding: 'clamp(14px, 3vw, 16px) clamp(32px, 6vw, 40px)',
                  borderRadius: '12px',
                  border: '2px solid #C44569',
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                  minWidth: '200px',
                  minHeight: '48px',
                  width: '100%',
                  maxWidth: '300px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(196, 69, 105, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Contact Emily
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
