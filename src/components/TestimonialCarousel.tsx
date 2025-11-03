import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Check, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Modern Testimonial Section
 * Horizontally scrolling carousel with snap-scroll behavior
 * Circular avatars, 5-star ratings, verification badges
 * 3 visible on desktop, 1 on mobile
 */

interface Testimonial {
  id: number;
  name: string;
  orderType: string;
  text: string;
  rating: number;
  verified: boolean;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    orderType: 'Wedding Cake',
    text: 'Emily made the most beautiful wedding cake for us. Every guest asked where we got it! The attention to detail was incredible, and it tasted even better than it looked.',
    rating: 5,
    verified: true,
    avatar: '👰'
  },
  {
    id: 2,
    name: 'Michael Chen',
    orderType: 'Birthday Celebration',
    text: 'The German Chocolate cake is absolutely divine. Best I\'ve ever had, hands down. Emily\'s passion for baking really shows in every bite.',
    rating: 5,
    verified: true,
    avatar: '🎂'
  },
  {
    id: 3,
    name: 'Lisa Martinez',
    orderType: 'Corporate Event',
    text: 'Professional, creative, and delicious. Emily exceeded all our expectations for our company\'s anniversary celebration. Highly recommended!',
    rating: 5,
    verified: true,
    avatar: '💼'
  },
  {
    id: 4,
    name: 'David Thompson',
    orderType: 'Anniversary Cake',
    text: 'Emily created a stunning anniversary cake that perfectly captured our love story. The edible flowers were a beautiful touch. Thank you!',
    rating: 5,
    verified: true,
    avatar: '💐'
  },
  {
    id: 5,
    name: 'Jennifer Lee',
    orderType: 'Birthday Cake',
    text: 'My daughter\'s birthday cake was magical! The unicorn design was exactly what she wanted. Emily is a true artist.',
    rating: 5,
    verified: true,
    avatar: '🦄'
  }
];

export function TestimonialCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollButtons);
      return () => scrollContainer.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 350; // Approximate card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{
        padding: '80px 0',
        background: '#F8EBD7',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
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
              fontSize: '18px',
              color: '#5A3825',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            True experiences from memorable celebrations
          </p>
        </motion.div>

        {/* Testimonial Cards - Horizontal Scroll */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingBottom: '16px',
            // Hide scrollbar
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="testimonial-scroll-container"
        >
          <style>{`
            .testimonial-scroll-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                minWidth: '350px',
                maxWidth: '350px',
                scrollSnapAlign: 'start',
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 16px rgba(90, 56, 37, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              {/* Header: Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Circular Avatar - 80px diameter */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    minWidth: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F8EBD7 0%, #E5D4C1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    border: '3px solid #C44569',
                    boxShadow: '0 4px 12px rgba(196, 69, 105, 0.2)'
                  }}
                >
                  {testimonial.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  {/* Name + Verification Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#2B2B2B',
                        margin: 0
                      }}
                    >
                      {testimonial.name}
                    </h4>
                    
                    {/* Instagram-style Verification Badge */}
                    {testimonial.verified && (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#C44569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Verified Customer"
                      >
                        <Check size={12} color="white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Order Type - Poppins 14px Bold */}
                  <p
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#5A3825',
                      margin: 0,
                      opacity: 0.8
                    }}
                  >
                    {testimonial.orderType}
                  </p>
                </div>
              </div>

              {/* 5-Star Rating - Raspberry Pink */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < testimonial.rating ? '#C44569' : 'none'}
                    color="#C44569"
                    strokeWidth={2}
                  />
                ))}
              </div>

              {/* Testimonial Text - Open Sans 16px Italic */}
              <p
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'italic',
                  color: '#5A3825',
                  lineHeight: 1.7,
                  margin: 0,
                  flex: 1
                }}
              >
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}

          {/* "Share Your Experience" CTA Card at End */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: testimonials.length * 0.1 }}
            style={{
              minWidth: '350px',
              maxWidth: '350px',
              scrollSnapAlign: 'start',
              background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 16px rgba(196, 69, 105, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '24px',
              color: 'white'
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageCircle size={40} color="white" />
            </div>

            <h3
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                fontWeight: 600,
                margin: 0
              }}
            >
              Share Your Experience
            </h3>

            <p
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '16px',
                lineHeight: 1.6,
                opacity: 0.95,
                margin: 0
              }}
            >
              We'd love to hear about your celebration! Share your story and photos with us.
            </p>

            <button
              style={{
                background: 'white',
                color: '#C44569',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              Leave a Review
            </button>
          </motion.div>
        </div>

        {/* Navigation Arrows - Enhanced Visibility */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '40px'
          }}
        >
          <motion.button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            whileHover={{ scale: canScrollLeft ? 1.1 : 1 }}
            whileTap={{ scale: canScrollLeft ? 0.95 : 1 }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#C44569',
              border: 'none',
              cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease-out',
              opacity: canScrollLeft ? 1 : 0.4,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)'
            }}
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={24} color="white" strokeWidth={3} />
          </motion.button>

          <motion.button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            whileHover={{ scale: canScrollRight ? 1.1 : 1 }}
            whileTap={{ scale: canScrollRight ? 0.95 : 1 }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#C44569',
              border: 'none',
              cursor: canScrollRight ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease-out',
              opacity: canScrollRight ? 1 : 0.4,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)'
            }}
            aria-label="Next testimonials"
          >
            <ChevronRight size={24} color="white" strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Responsive: Show 1 card at a time */}
      <style>{`
        @media (max-width: 768px) {
          .testimonial-scroll-container > div {
            min-width: calc(100vw - 48px) !important;
            max-width: calc(100vw - 48px) !important;
          }
        }
      `}</style>
    </section>
  );
}
