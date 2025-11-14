import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Star, Info, Sparkles, Phone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { productCategories, cakeFlavors, fillingFlavors } from '../../data/cakeOptions';

import birthdayCake1 from '../../assets/stock_images/birthday_cake_with_c_2320daa1.jpg';
import birthdayCake2 from '../../assets/stock_images/birthday_cake_with_c_7bc0f700.jpg';
import birthdayCake3 from '../../assets/stock_images/birthday_cake_with_c_b605b368.jpg';
import weddingCake1 from '../../assets/stock_images/elegant_white_weddin_adbd196c.jpg';
import weddingCake2 from '../../assets/stock_images/elegant_white_weddin_0d9c00f6.jpg';
import chocolateCake1 from '../../assets/stock_images/chocolate_cake_slice_18c59402.jpg';
import chocolateCake2 from '../../assets/stock_images/chocolate_cake_slice_a38cf8b3.jpg';
import chocolateCake3 from '../../assets/stock_images/chocolate_cake_slice_8bbafa0f.jpg';
import lemonCake1 from '../../assets/stock_images/lemon_cake_cream_che_63f11bbc.jpg';
import lemonCake2 from '../../assets/stock_images/lemon_cake_cream_che_52601daf.jpg';

const categories = productCategories;

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  popular?: boolean;
  isNew?: boolean;
  image?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Birthday Celebration',
    category: 'Cakes',
    description: 'Classic birthday cake with custom decorations and personalized message',
    rating: 5,
    reviews: 127,
    popular: true,
    image: birthdayCake1
  },
  {
    id: 2,
    name: 'Elegant Wedding Tier',
    category: 'Cakes',
    description: 'Multi-tier wedding cake with elegant details and fresh flowers',
    rating: 5,
    reviews: 89,
    popular: true,
    image: weddingCake1
  },
  {
    id: 3,
    name: 'Almond Delight',
    category: 'Cakes',
    description: 'Rich almond flavor with smooth buttercream frosting',
    rating: 5,
    reviews: 156,
    isNew: true,
    image: lemonCake1
  },
  {
    id: 4,
    name: 'Lemon & Cream Cheese',
    category: 'Cakes',
    description: 'Tangy lemon with smooth cream cheese frosting',
    rating: 4.8,
    reviews: 98,
    image: lemonCake2
  },
  {
    id: 5,
    name: 'Black Forest',
    category: 'Cakes',
    description: 'Chocolate cake with cherries and whipped cream',
    rating: 5,
    reviews: 143,
    image: chocolateCake1
  },
  {
    id: 6,
    name: 'German Chocolate',
    category: 'Cakes',
    description: 'Traditional German chocolate with coconut pecan frosting',
    rating: 4.9,
    reviews: 201,
    popular: true,
    image: chocolateCake2
  },
  {
    id: 7,
    name: 'Anniversary Romance',
    category: 'Cakes',
    description: 'Romantic design with edible flowers and gold accents',
    rating: 5,
    reviews: 67,
    image: weddingCake2
  },
  {
    id: 8,
    name: 'Corporate Logo Cake',
    category: 'Cakes',
    description: 'Custom branded cakes for business events and celebrations',
    rating: 4.9,
    reviews: 45,
    image: birthdayCake2
  },
  {
    id: 9,
    name: 'Italian Cream',
    category: 'Cakes',
    description: 'Light cream cake with pecans and coconut',
    rating: 4.8,
    reviews: 112,
    image: birthdayCake3
  },
  {
    id: 10,
    name: 'Lemon Doberge',
    category: 'Cakes',
    description: 'New Orleans style layered lemon cake with custard filling',
    rating: 5,
    reviews: 178,
    popular: true,
    image: chocolateCake3
  },
  {
    id: 11,
    name: 'Chocolate Doberge',
    category: 'Cakes',
    description: 'New Orleans style layered chocolate cake with rich pudding',
    rating: 5,
    reviews: 165,
    image: chocolateCake2
  },
  {
    id: 12,
    name: 'Seasonal Pumpkin Spice',
    category: 'Cakes',
    description: 'Fall-inspired pumpkin spice cake with cream cheese frosting',
    rating: 4.9,
    reviews: 92,
    isNew: true,
    image: lemonCake1
  }
];

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="surface-elevated rounded-2xl overflow-hidden animate-pulse">
        <div className="w-full h-64 bg-gray-200" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="flex justify-between items-center mt-6">
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="h-11 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface ShopProps {
  onNavigate?: (page: string) => void;
}

export function Shop({ onNavigate }: ShopProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredTooltip, setHoveredTooltip] = useState<number | null>(null);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match Product interface (prices excluded per staff-only policy)
          const transformedProducts = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: 'Cakes', // Normalize all products to 'Cakes' category
            description: p.description,
            rating: p.rating || 5,
            reviews: p.reviews || 0,
            popular: p.isPopular,
            isNew: p.isNew,
            image: p.image || products.find((prod) => prod.name === p.name)?.image
          }));
          setApiProducts(transformedProducts.length > 0 ? transformedProducts : products);
        } else {
          // Fallback to hardcoded products if API fails
          setApiProducts(products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setApiProducts(products); // Fallback to hardcoded products
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productsToUse = apiProducts.length > 0 ? apiProducts : products;
  const filteredProducts = productsToUse
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.reviews || 0) - (a.reviews || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name-az') return a.name.localeCompare(b.name);
      if (sortBy === 'name-za') return b.name.localeCompare(a.name);
      return 0;
    });

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleSortChange = (newSort: string) => {
    setIsLoading(true);
    setSortBy(newSort);
    setTimeout(() => setIsLoading(false), 400);
  };

  const getRatingColor = (rating: number) => {
    if (rating === 5) return '#FFD700';
    if (rating >= 4.8) return '#FFA500';
    return '#C44569';
  };

  return (
    <div className="min-h-screen section-padding" style={{ background: 'var(--background)', paddingTop: 'clamp(4px, 2vw, 36px)' }}>
      <div className="container mx-auto">
        {/* Header - Modern Title with Gradient - Moved to Top */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-3xl md:text-4xl font-bold mb-1 relative inline-block"
            style={{
              fontFamily: 'Playfair Display',
              background: 'linear-gradient(to right, #C44569, #8B3A5E, #C44569)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Our Cake Collection
            <span 
              className="absolute -bottom-1 left-0 h-1 rounded-full"
              style={{
                width: '80px',
                background: 'linear-gradient(to right, #C44569, transparent)'
              }}
            />
          </h1>
          <p 
            className="text-base italic mt-3"
            style={{ 
              color: 'var(--text-secondary)', 
              fontFamily: 'Poppins',
              fontWeight: 500
            }}
          >
            Handcrafted perfection, baked fresh daily
          </p>
        </motion.div>

        {/* Call to Order Banner */}
        <motion.div
          className="glass-card p-6 md:p-8 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.05) 100%)',
            border: '2px solid rgba(196, 69, 105, 0.3)',
            borderRadius: '16px'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-full"
                style={{
                  background: '#C44569',
                  boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)'
                }}
              >
                <Phone size={24} color="white" />
              </div>
              <div className="text-left">
                <p 
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '2px'
                  }}
                >
                  Ready to order?
                </p>
                <a 
                  href="tel:713-555-2253"
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#C44569',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#8B3A5E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#C44569'}
                >
                  (713) 555-CAKE
                </a>
              </div>
            </div>
            <div 
              style={{
                width: '1px',
                height: '50px',
                background: 'rgba(196, 69, 105, 0.2)',
                display: 'none'
              }}
              className="md:block"
            />
            <p 
              style={{
                fontFamily: 'Open Sans',
                fontSize: '15px',
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                lineHeight: 1.6
              }}
            >
              <strong style={{ color: '#C44569' }}>Prices available upon consultation.</strong><br />
              Call us today to discuss your custom cake vision!
            </p>
          </div>
        </motion.div>

        {/* Category Filters - Always Visible */}
        <motion.div
          className="glass-card p-4 md:p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-all touch-target"
                style={{
                  background: selectedCategory === category 
                    ? 'linear-gradient(135deg, #C44569 0%, #A03355 100%)' 
                    : 'var(--surface-elevated)',
                  color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                  border: `2px solid ${selectedCategory === category ? '#C44569' : 'var(--border-medium)'}`,
                  fontFamily: 'Poppins',
                  fontWeight: selectedCategory === category ? 600 : 500,
                  fontSize: '14px',
                  minHeight: '44px',
                  transform: selectedCategory === category ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedCategory === category ? '0 4px 12px rgba(196, 69, 105, 0.3)' : 'none'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={selectedCategory === category}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search & Sort Bar - Only for Cakes/All */}
        {(selectedCategory === 'All' || selectedCategory === 'Cakes') && (
          <motion.div
            className="glass-card p-4 md:p-5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                  size={20} 
                  color="var(--text-tertiary)" 
                  aria-hidden="true"
                />
                <Input
                  placeholder="Search cakes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 md:h-13 rounded-xl input-field w-full"
                  style={{ fontSize: '15px' }}
                  aria-label="Search cakes"
                />
              </div>

              {/* Sort Dropdown - Enhanced */}
              <div className="relative" style={{ zIndex: 100 }}>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-12 md:h-13 px-4 pr-11 rounded-xl appearance-none cursor-pointer w-full transition-all duration-200"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '2px solid #C44569',
                    color: 'var(--text-primary)',
                    fontFamily: 'Poppins',
                    fontSize: '15px',
                    fontWeight: 500,
                    minWidth: '200px',
                    boxShadow: '0 2px 4px rgba(196, 69, 105, 0.1)',
                    paddingRight: '44px',
                    position: 'relative',
                    zIndex: 100,
                    textAlign: 'left',
                    direction: 'ltr'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(196, 69, 105, 0.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-elevated)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(196, 69, 105, 0.1)';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(196, 69, 105, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(196, 69, 105, 0.1)';
                  }}
                  aria-label="Sort products"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name-az">Name: A-Z</option>
                  <option value="name-za">Name: Z-A</option>
                </select>
                <ChevronDown 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  size={22}
                  color="#C44569"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Custom Cake CTA - Only for Cakes/All tabs */}
        {(selectedCategory === 'All' || selectedCategory === 'Cakes') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-4 mb-6 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.08) 0%, rgba(248, 235, 215, 0.4) 100%)',
              border: '2px solid rgba(196, 69, 105, 0.2)'
            }}
          >
            <motion.div
              className="absolute top-2 right-2"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <Sparkles size={20} color="#C44569" fill="rgba(196, 69, 105, 0.2)" />
            </motion.div>

            <h2
              className="mb-1 text-lg font-semibold"
              style={{
                fontFamily: 'Playfair Display',
                color: 'var(--text-primary)'
              }}
            >
              Don't See What You're Looking For?
            </h2>
            <p
              className="mb-3 text-sm"
              style={{
                color: 'var(--text-secondary)',
                maxWidth: '500px',
                margin: '0 auto 12px',
                lineHeight: 1.5
              }}
            >
              Call or visit us to discuss your custom cake vision!
            </p>
            <Button
              onClick={() => onNavigate?.('contact')}
              className="btn-primary"
              style={{
                height: '44px',
                fontSize: '14px',
                fontWeight: 600,
                padding: '0 28px',
                fontFamily: 'Poppins'
              }}
            >
              Contact Us
            </Button>
          </motion.div>
        )}

        {/* Flavors Tab - Informational Cards */}
        {selectedCategory === 'Flavors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6 md:p-8 mb-6 text-center">
              <h2
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{
                  fontFamily: 'Playfair Display',
                  background: 'linear-gradient(to right, #C44569, #8B3A5E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Our Cake Flavors
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 16px' }}>
                Choose from our delicious selection of cake flavors to create your perfect custom cake
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Phone size={20} color="#C44569" />
                <a 
                  href="tel:713-555-2253"
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#C44569',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#8B3A5E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#C44569'}
                >
                  Call (713) 555-CAKE to order with these flavors
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {cakeFlavors.map((flavor, index) => (
                  <motion.div
                    key={flavor.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <Card 
                      className="surface-elevated h-full transition-all duration-300 overflow-hidden group"
                      style={{
                        borderRadius: '20px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--surface-elevated)'
                      }}
                    >
                      <div 
                        className="w-full h-48 relative overflow-hidden flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(248, 235, 215, 0.6) 0%, rgba(232, 213, 196, 0.4) 100%)'
                        }}
                      >
                        <motion.div
                          className="text-7xl"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          style={{ filter: 'drop-shadow(0 4px 12px rgba(196, 69, 105, 0.3))' }}
                        >
                          🎂
                        </motion.div>
                      </div>

                      <div className="p-5 md:p-6">
                        <h4 
                          className="mb-3 text-center"
                          style={{ 
                            fontFamily: 'Poppins', 
                            fontWeight: 700, 
                            fontSize: '20px', 
                            color: 'var(--text-primary)'
                          }}
                        >
                          {flavor.name}
                        </h4>
                        <p 
                          className="text-center mb-4"
                          style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: '14px',
                            lineHeight: 1.6
                          }}
                        >
                          Perfect for custom cakes and special occasions
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Fillings Tab - Informational Cards */}
        {selectedCategory === 'Fillings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6 md:p-8 mb-6 text-center">
              <h2
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{
                  fontFamily: 'Playfair Display',
                  background: 'linear-gradient(to right, #C44569, #8B3A5E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Our Filling Options
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 16px' }}>
                Add delicious fillings to your custom cake for extra flavor and texture
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Phone size={20} color="#C44569" />
                <a 
                  href="tel:713-555-2253"
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#C44569',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#8B3A5E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#C44569'}
                >
                  Call (713) 555-CAKE to order with these fillings
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {fillingFlavors.map((filling, index) => (
                  <motion.div
                    key={filling.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <Card 
                      className="surface-elevated h-full transition-all duration-300 overflow-hidden group"
                      style={{
                        borderRadius: '20px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--surface-elevated)'
                      }}
                    >
                      <div 
                        className="w-full h-48 relative overflow-hidden flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(248, 235, 215, 0.3) 100%)'
                        }}
                      >
                        <motion.div
                          className="text-7xl"
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          style={{ filter: 'drop-shadow(0 4px 12px rgba(196, 69, 105, 0.3))' }}
                        >
                          🍰
                        </motion.div>
                      </div>

                      <div className="p-5 md:p-6">
                        <h4 
                          className="mb-3 text-center"
                          style={{ 
                            fontFamily: 'Poppins', 
                            fontWeight: 700, 
                            fontSize: '20px', 
                            color: 'var(--text-primary)'
                          }}
                        >
                          {filling.name}
                        </h4>
                        <p 
                          className="text-center mb-4"
                          style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: '14px',
                            lineHeight: 1.6
                          }}
                        >
                          Delicious filling option for your custom cake layers
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Product Grid - Only for Cakes/All tabs */}
        {(selectedCategory === 'All' || selectedCategory === 'Cakes') && (
        <>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="products"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      delay: index * 0.05, 
                      duration: 0.4,
                      layout: { duration: 0.3 }
                    }}
                  >
                    <Card 
                      className="surface-elevated h-full transition-all duration-300 overflow-hidden group"
                      style={{
                        borderRadius: '20px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--surface-elevated)'
                      }}
                    >
                      {/* Image Section */}
                      <div 
                        className="w-full h-56 md:h-64 relative overflow-hidden"
                        style={{
                          aspectRatio: '4/3'
                        }}
                      >
                        {/* Badges */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                          {product.popular && (
                            <Badge 
                              className="animate-in slide-in-from-right"
                              style={{
                                background: 'linear-gradient(135deg, #C44569 0%, #A03355 100%)',
                                color: 'white',
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                padding: '8px 16px',
                                fontSize: '12px',
                                letterSpacing: '0.5px',
                                boxShadow: '0 4px 12px rgba(196, 69, 105, 0.4)'
                              }}
                            >
                              POPULAR
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge 
                              className="animate-in slide-in-from-right"
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                padding: '8px 16px',
                                fontSize: '12px',
                                letterSpacing: '0.5px',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                              }}
                            >
                              NEW
                            </Badge>
                          )}
                          {product.rating === 5 && (
                            <Badge 
                              className="animate-in slide-in-from-right"
                              style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                color: '#5A3825',
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                padding: '8px 16px',
                                fontSize: '12px',
                                letterSpacing: '0.5px',
                                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                              }}
                            >
                              ⭐ 5-STAR
                            </Badge>
                          )}
                        </div>

                        {/* Image or Fallback */}
                        {product.image ? (
                          <motion.img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, rgba(248, 235, 215, 0.6) 0%, rgba(232, 213, 196, 0.4) 100%)'
                            }}
                          >
                            <motion.div
                              className="text-center"
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <div
                                className="text-6xl mb-2"
                                style={{ filter: 'drop-shadow(0 4px 8px rgba(196, 69, 105, 0.3))' }}
                              >
                                🎂
                              </div>
                              <p
                                style={{
                                  color: '#C44569',
                                  fontFamily: 'Poppins',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                                }}
                              >
                                {product.category}
                              </p>
                            </motion.div>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(196, 69, 105, 0.15) 100%)',
                            opacity: 0
                          }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-6">
                        {/* Title */}
                        <h4 
                          className="mb-3 line-clamp-1"
                          style={{ 
                            fontFamily: 'Poppins', 
                            fontWeight: 700, 
                            fontSize: 'clamp(18px, 3vw, 22px)', 
                            color: 'var(--text-primary)',
                            lineHeight: 1.3
                          }}
                        >
                          {product.name}
                        </h4>

                        {/* Description */}
                        <p 
                          className="mb-4 line-clamp-2"
                          style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: '14px', 
                            lineHeight: 1.6,
                            minHeight: '40px'
                          }}
                        >
                          {product.description}
                        </p>

                        {/* Rating with Tooltip */}
                        <div className="flex items-center gap-2 mb-5 relative">
                          <div className="flex items-center gap-1" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                fill={i < Math.floor(product.rating) ? getRatingColor(product.rating) : 'none'}
                                color={i < product.rating ? getRatingColor(product.rating) : '#D1D5DB'}
                                strokeWidth={2}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {product.rating}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                            ({product.reviews} reviews)
                          </span>
                          
                          {/* Info Tooltip */}
                          <button
                            className="relative"
                            onMouseEnter={() => setHoveredTooltip(product.id)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            aria-label="Rating information"
                          >
                            <Info size={16} color="var(--text-tertiary)" />
                            
                            <AnimatePresence>
                              {hoveredTooltip === product.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg whitespace-nowrap"
                                  style={{
                                    background: 'var(--charcoal)',
                                    color: 'white',
                                    fontSize: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    zIndex: 100
                                  }}
                                >
                                  Based on verified customer reviews
                                  <div
                                    className="absolute top-full left-1/2 transform -translate-x-1/2"
                                    style={{
                                      width: 0,
                                      height: 0,
                                      borderLeft: '6px solid transparent',
                                      borderRight: '6px solid transparent',
                                      borderTop: '6px solid var(--charcoal)'
                                    }}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>

                        {/* Call to Order CTA */}
                        <div 
                          className="flex items-center justify-center pt-4 border-t" 
                          style={{ borderColor: 'var(--border-subtle)' }}
                        >
                          <a 
                            href="tel:713-555-2253"
                            className="flex items-center gap-2 text-center"
                            style={{
                              color: '#C44569',
                              fontFamily: 'Poppins',
                              fontWeight: 600,
                              fontSize: '15px',
                              textDecoration: 'none',
                              padding: '12px',
                              transition: 'all 250ms ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#8B3A5E';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#C44569';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <Phone size={18} />
                            <span>Call us to order</span>
                          </a>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '16px' }}>
                No cakes found matching your criteria.
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
                Try adjusting your filters or search terms.
              </p>
            </motion.div>
          )}
        </>
        )}
      </div>

    </div>
  );
}
