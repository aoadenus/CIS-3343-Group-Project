import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, ShoppingBag, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ToastContext';

const categories = ['All', 'Birthday', 'Wedding', 'Anniversary', 'Corporate', 'Seasonal'];

const products = [
  {
    id: 1,
    name: 'Birthday Celebration',
    category: 'Birthday',
    priceRange: '$45 - $85',
    description: 'Classic birthday cake with custom decorations',
    rating: 5,
    reviews: 127,
    popular: true
  },
  {
    id: 2,
    name: 'Elegant Wedding Tier',
    category: 'Wedding',
    priceRange: '$250 - $450',
    description: 'Multi-tier wedding cake with elegant details',
    rating: 5,
    reviews: 89,
    popular: true
  },
  {
    id: 3,
    name: 'Almond Delight',
    category: 'All',
    priceRange: '$50 - $90',
    description: 'Rich almond flavor with buttercream',
    rating: 5,
    reviews: 156
  },
  {
    id: 4,
    name: 'Lemon & Cream Cheese',
    category: 'All',
    priceRange: '$48 - $88',
    description: 'Tangy lemon with smooth cream cheese frosting',
    rating: 4.8,
    reviews: 98
  },
  {
    id: 5,
    name: 'Black Forest',
    category: 'All',
    priceRange: '$55 - $95',
    description: 'Chocolate cake with cherries and whipped cream',
    rating: 5,
    reviews: 143
  },
  {
    id: 6,
    name: 'German Chocolate',
    category: 'All',
    priceRange: '$52 - $92',
    description: 'Traditional German chocolate with coconut pecan',
    rating: 4.9,
    reviews: 201
  },
  {
    id: 7,
    name: 'Anniversary Romance',
    category: 'Anniversary',
    priceRange: '$65 - $120',
    description: 'Romantic design with edible flowers',
    rating: 5,
    reviews: 67
  },
  {
    id: 8,
    name: 'Corporate Logo Cake',
    category: 'Corporate',
    priceRange: '$85 - $200',
    description: 'Custom branded cakes for business events',
    rating: 4.9,
    reviews: 45
  },
  {
    id: 9,
    name: 'Italian Cream',
    category: 'All',
    priceRange: '$50 - $90',
    description: 'Light cream cake with pecans and coconut',
    rating: 4.8,
    reviews: 112
  },
  {
    id: 10,
    name: 'Lemon Doberge',
    category: 'All',
    priceRange: '$58 - $98',
    description: 'New Orleans style layered lemon cake',
    rating: 5,
    reviews: 178,
    popular: true
  },
  {
    id: 11,
    name: 'Chocolate Doberge',
    category: 'All',
    priceRange: '$58 - $98',
    description: 'New Orleans style layered chocolate cake',
    rating: 5,
    reviews: 165
  },
  {
    id: 12,
    name: 'Seasonal Pumpkin Spice',
    category: 'Seasonal',
    priceRange: '$55 - $95',
    description: 'Fall-inspired pumpkin spice cake with cream cheese frosting',
    rating: 4.9,
    reviews: 92
  }
];

export function Shop() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory || p.category === 'All')
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.reviews || 0) - (a.reviews || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="min-h-screen section-padding">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4">Our Cake Collection</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Explore our signature cakes and custom creations. Every cake is handcrafted with premium ingredients.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          className="glass-card p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                size={20} 
                color="var(--text-tertiary)" 
              />
              <Input
                placeholder="Search cakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-xl input-field w-full"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-14 px-6 pr-12 rounded-xl appearance-none cursor-pointer"
                style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Poppins',
                  fontSize: '15px',
                  minWidth: '200px'
                }}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                size={20}
                color="var(--text-tertiary)"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-3 rounded-xl transition-all"
                style={{
                  background: selectedCategory === category 
                    ? 'linear-gradient(135deg, #C44569 0%, #A03355 100%)' 
                    : 'var(--surface-elevated)',
                  color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCategory === category ? 'transparent' : 'var(--border-medium)'}`,
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '14px'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card className="surface-elevated h-full hover:border-[var(--accent-raspberry)] transition-all duration-300 overflow-hidden group">
                  {/* Image Placeholder */}
                  <div 
                    className="w-full h-64 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.15) 0%, rgba(90, 56, 37, 0.08) 100%)'
                    }}
                  >
                    {product.popular && (
                      <Badge 
                        className="absolute top-4 right-4 z-10"
                        style={{
                          background: '#C44569',
                          color: 'white',
                          fontFamily: 'Poppins',
                          fontWeight: 600,
                          padding: '8px 16px',
                          fontSize: '12px'
                        }}
                      >
                        POPULAR
                      </Badge>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ShoppingBag size={64} color="rgba(196, 69, 105, 0.3)" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: 'var(--text-primary)' }}>
                        {product.name}
                      </h4>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < Math.floor(product.rating) ? '#C44569' : 'none'}
                            color="#C44569"
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                          Price Range
                        </p>
                        <p style={{ 
                          fontFamily: 'Poppins', 
                          fontWeight: 600, 
                          fontSize: '20px', 
                          color: '#C44569' 
                        }}>
                          {product.priceRange}
                        </p>
                      </div>
                      <Button
                        className="btn-primary"
                        style={{ height: '44px', minWidth: '44px' }}
                        onClick={() => showToast('success', `${product.name} added to your inquiry list!`, 'Added to Inquiry')}
                      >
                        Inquire
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              No cakes found matching your criteria. Try adjusting your filters.
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="glass-card p-12 text-center mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="mb-4">Don't See What You're Looking For?</h3>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 32px' }}>
            Every cake can be customized to your exact specifications. Let's create something unique together.
          </p>
          <Button className="btn-primary" style={{ minWidth: '240px', height: '56px' }}>
            Start Custom Builder
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
