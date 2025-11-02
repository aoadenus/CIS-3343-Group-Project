import { motion } from 'motion/react';
import { Star, Plus } from 'lucide-react';
import { useState } from 'react';
import { LazyImage } from './Loading/LazyImage';

/**
 * Modern Bento Grid Layout inspired by Apple.com
 * Asymmetric grid where featured products span 2x2 cells
 * Regular products occupy single cells
 * Responsive: Desktop (3 cols) → Tablet (2 cols) → Mobile (1 col)
 */

interface Product {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  description: string;
  rating: number;
  reviews: number;
  popular?: boolean;
  featured?: boolean;
  image?: string;
}

interface BentoGridProps {
  products: Product[];
  onQuickAdd?: (productId: number) => void;
}

export function BentoGrid({ products, onQuickAdd }: BentoGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const categories = ['All', 'Birthday', 'Wedding', 'Anniversary', 'Corporate', 'Seasonal'];

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Determine if product should be featured (2x2)
  const getGridSpan = (index: number, isFeatured?: boolean) => {
    // Featured products or first/every 5th product spans 2x2
    if (isFeatured || index === 0 || (index + 1) % 5 === 0) {
      return 'featured';
    }
    return 'regular';
  };

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div 
        className="flex flex-wrap gap-3 mb-8 justify-center"
        style={{ padding: '0 16px' }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: '24px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms ease-out',
              background: activeCategory === category ? '#C44569' : 'white',
              color: activeCategory === category ? 'white' : '#5A3825',
              boxShadow: activeCategory === category 
                ? '0 4px 12px rgba(196, 69, 105, 0.3)'
                : '0 2px 8px rgba(90, 56, 37, 0.1)',
              minHeight: '44px'
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(90, 56, 37, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(90, 56, 37, 0.1)';
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div 
        className="bento-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          padding: '0 16px'
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .bento-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .bento-grid-item.featured {
              grid-column: span 2;
              grid-row: span 2;
            }
          }
          
          @media (min-width: 1024px) {
            .bento-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .bento-grid-item.featured {
              grid-column: span 2;
              grid-row: span 2;
            }
          }

          .bento-grid-item.regular {
            grid-column: span 1;
            grid-row: span 1;
          }
        `}</style>

        {filteredProducts.map((product, index) => {
          const gridSpan = getGridSpan(index, product.featured);
          const isHovered = hoveredCard === product.id;
          const isFeatured = gridSpan === 'featured';

          return (
            <motion.div
              key={product.id}
              className={`bento-grid-item ${gridSpan}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'white',
                boxShadow: isHovered 
                  ? '0 8px 24px rgba(90, 56, 37, 0.15)'
                  : '0 4px 12px rgba(90, 56, 37, 0.08)',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 300ms ease-out',
                cursor: 'pointer',
                minHeight: isFeatured ? '400px' : '300px'
              }}
            >
              {/* Product Image/Gradient Background */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: product.image 
                    ? `url(${product.image})` 
                    : 'linear-gradient(135deg, #F8EBD7 0%, #E5D4C1 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {product.image && (
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                
                {/* Gradient overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)'
                  }}
                />
              </div>

              {/* Content */}
              <div 
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: isFeatured ? '32px' : '24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                {/* Popular Badge */}
                {product.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: '#C44569',
                      color: 'white',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Popular
                  </div>
                )}

                {/* Category */}
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px'
                  }}
                >
                  {product.category}
                </div>

                {/* Product Name */}
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: isFeatured ? '28px' : '20px',
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '8px',
                    lineHeight: 1.2
                  }}
                >
                  {product.name}
                </h3>

                {/* Description - visible always on featured, on hover for regular */}
                <p
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                    opacity: isFeatured ? 1 : (isHovered ? 1 : 0),
                    maxHeight: isFeatured ? 'none' : (isHovered ? '100px' : '0'),
                    overflow: 'hidden',
                    transition: 'all 300ms ease-out'
                  }}
                >
                  {product.description}
                </p>

                {/* Price and Rating Row */}
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isHovered ? '16px' : '0',
                    transition: 'margin 300ms ease-out'
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: isFeatured ? '24px' : '18px',
                        fontWeight: 700,
                        color: 'white'
                      }}
                    >
                      {product.priceRange}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.floor(product.rating) ? '#FFD700' : 'none'} 
                        color="#FFD700" 
                      />
                    ))}
                    <span
                      style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginLeft: '6px'
                      }}
                    >
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Quick Add Button - fades in on hover */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0, 
                    y: isHovered ? 0 : 10 
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onQuickAdd?.(product.id)}
                  style={{
                    background: '#C44569',
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(196, 69, 105, 0.4)',
                    pointerEvents: isHovered ? 'auto' : 'none'
                  }}
                >
                  <Plus size={16} />
                  Quick Add
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: '#5A3825'
          }}
        >
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px' }}>
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
