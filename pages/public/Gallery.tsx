import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Share2, Calendar, Layers, Tag } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import Masonry from 'react-responsive-masonry';

type Category = 'All' | 'Weddings' | 'Birthdays' | 'Corporate' | 'Seasonal';

interface GalleryImage {
  id: number;
  category: Exclude<Category, 'All'>;
  title: string;
  image: string;
  occasion: string;
  tiers: number;
  date: string;
  aspectRatio: number; // For masonry layout
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    category: 'Weddings',
    title: 'Elegant Three-Tier Wedding',
    image: 'https://images.unsplash.com/photo-1584158531319-96912adae663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxOTc0Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Wedding',
    tiers: 3,
    date: '2024-10-15',
    aspectRatio: 1.3
  },
  {
    id: 2,
    category: 'Birthdays',
    title: 'Rainbow Birthday Celebration',
    image: 'https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE5ODk0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Birthday',
    tiers: 2,
    date: '2024-09-22',
    aspectRatio: 0.8
  },
  {
    id: 3,
    category: 'Weddings',
    title: 'Floral Garden Wedding',
    image: 'https://images.unsplash.com/photo-1647296020390-8b621d1d5713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGZsb3JhbHxlbnwxfHx8fDE3NjIwMzg2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Wedding',
    tiers: 4,
    date: '2024-10-28',
    aspectRatio: 1.5
  },
  {
    id: 4,
    category: 'Corporate',
    title: 'Professional Logo Cake',
    image: 'https://images.unsplash.com/photo-1741965134280-9094486efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjYWtlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjAzODYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Corporate Event',
    tiers: 1,
    date: '2024-09-05',
    aspectRatio: 1.0
  },
  {
    id: 5,
    category: 'Birthdays',
    title: 'Colorful Birthday Surprise',
    image: 'https://images.unsplash.com/photo-1753742731319-70f5c9908b6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjIwMzg2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Birthday',
    tiers: 2,
    date: '2024-10-10',
    aspectRatio: 0.9
  },
  {
    id: 6,
    category: 'Seasonal',
    title: 'Autumn Harvest Delight',
    image: 'https://images.unsplash.com/photo-1759556765729-c4d96e54726c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFzb25hbCUyMGNha2UlMjBhdXR1bW58ZW58MXx8fHwxNzYyMDM4NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Seasonal',
    tiers: 3,
    date: '2024-10-01',
    aspectRatio: 1.2
  },
  {
    id: 7,
    category: 'Seasonal',
    title: 'Chocolate Decadence',
    image: 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjE5OTgzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Seasonal',
    tiers: 1,
    date: '2024-09-18',
    aspectRatio: 1.1
  },
  {
    id: 8,
    category: 'Birthdays',
    title: 'Princess Castle Dreams',
    image: 'https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE5ODk0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Birthday',
    tiers: 3,
    date: '2024-10-20',
    aspectRatio: 0.75
  },
  {
    id: 9,
    category: 'Corporate',
    title: 'Anniversary Milestone',
    image: 'https://images.unsplash.com/photo-1761671613315-53157f91d0f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNha2UlMjByb21hbnRpY3xlbnwxfHx8fDE3NjIwMzg2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Corporate Anniversary',
    tiers: 2,
    date: '2024-09-30',
    aspectRatio: 1.4
  },
  {
    id: 10,
    category: 'Weddings',
    title: 'Romantic Rose Wedding',
    image: 'https://images.unsplash.com/photo-1584158531319-96912adae663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxOTc0Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Wedding',
    tiers: 3,
    date: '2024-10-05',
    aspectRatio: 1.25
  },
  {
    id: 11,
    category: 'Birthdays',
    title: 'Unicorn Fantasy',
    image: 'https://images.unsplash.com/photo-1753742731319-70f5c9908b6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjIwMzg2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Birthday',
    tiers: 2,
    date: '2024-09-12',
    aspectRatio: 0.85
  },
  {
    id: 12,
    category: 'Corporate',
    title: 'Product Launch Celebration',
    image: 'https://images.unsplash.com/photo-1741965134280-9094486efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjYWtlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjAzODYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Corporate Event',
    tiers: 2,
    date: '2024-10-18',
    aspectRatio: 1.0
  },
  {
    id: 13,
    category: 'Weddings',
    title: 'Minimalist Modern Wedding',
    image: 'https://images.unsplash.com/photo-1647296020390-8b621d1d5713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGZsb3JhbHxlbnwxfHx8fDE3NjIwMzg2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Wedding',
    tiers: 3,
    date: '2024-09-25',
    aspectRatio: 1.35
  },
  {
    id: 14,
    category: 'Seasonal',
    title: 'Winter Wonderland',
    image: 'https://images.unsplash.com/photo-1759556765729-c4d96e54726c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFzb25hbCUyMGNha2UlMjBhdXR1bW58ZW58MXx8fHwxNzYyMDM4NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Seasonal',
    tiers: 2,
    date: '2024-10-25',
    aspectRatio: 1.15
  },
  {
    id: 15,
    category: 'Birthdays',
    title: 'Superhero Adventure',
    image: 'https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE5ODk0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Birthday',
    tiers: 2,
    date: '2024-09-08',
    aspectRatio: 0.95
  },
  {
    id: 16,
    category: 'Weddings',
    title: 'Classic Elegance',
    image: 'https://images.unsplash.com/photo-1584158531319-96912adae663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxOTc0Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Wedding',
    tiers: 4,
    date: '2024-10-12',
    aspectRatio: 1.5
  },
  {
    id: 17,
    category: 'Corporate',
    title: 'Team Achievement',
    image: 'https://images.unsplash.com/photo-1741965134280-9094486efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjYWtlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjAzODYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Corporate Event',
    tiers: 1,
    date: '2024-09-15',
    aspectRatio: 1.0
  },
  {
    id: 18,
    category: 'Birthdays',
    title: 'Sweet 16 Glamour',
    image: 'https://images.unsplash.com/photo-1753742731319-70f5c9908b6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjIwMzg2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Birthday',
    tiers: 3,
    date: '2024-10-22',
    aspectRatio: 0.8
  },
  {
    id: 19,
    category: 'Seasonal',
    title: 'Spring Blossom',
    image: 'https://images.unsplash.com/photo-1759556765729-c4d96e54726c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFzb25hbCUyMGNha2UlMjBhdXR1bW58ZW58MXx8fHwxNzYyMDM4NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Seasonal',
    tiers: 2,
    date: '2024-09-20',
    aspectRatio: 1.2
  },
  {
    id: 20,
    category: 'Weddings',
    title: 'Rustic Charm',
    image: 'https://images.unsplash.com/photo-1647296020390-8b621d1d5713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGZsb3JhbHxlbnwxfHx8fDE3NjIwMzg2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Wedding',
    tiers: 3,
    date: '2024-10-08',
    aspectRatio: 1.4
  },
  {
    id: 21,
    category: 'Birthdays',
    title: 'Tropical Paradise',
    image: 'https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE5ODk0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Birthday',
    tiers: 2,
    date: '2024-09-28',
    aspectRatio: 0.9
  },
  {
    id: 22,
    category: 'Corporate',
    title: 'Grand Opening',
    image: 'https://images.unsplash.com/photo-1761671613315-53157f91d0f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNha2UlMjByb21hbnRpY3xlbnwxfHx8fDE3NjIwMzg2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Corporate Event',
    tiers: 2,
    date: '2024-10-03',
    aspectRatio: 1.3
  },
  {
    id: 23,
    category: 'Seasonal',
    title: 'Halloween Spooktacular',
    image: 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjE5OTgzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Seasonal',
    tiers: 3,
    date: '2024-10-26',
    aspectRatio: 1.0
  },
  {
    id: 24,
    category: 'Weddings',
    title: 'Bohemian Beauty',
    image: 'https://images.unsplash.com/photo-1584158531319-96912adae663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxOTc0Mjk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    occasion: 'Wedding',
    tiers: 3,
    date: '2024-09-10',
    aspectRatio: 1.25
  }
];

const categories: Category[] = ['All', 'Weddings', 'Birthdays', 'Corporate', 'Seasonal'];

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  // Filter images based on selected category
  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
        setScale(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredImages]);

  const handlePrevious = useCallback(() => {
    if (selectedImageIndex === null) return;
    const newIndex = selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(newIndex);
    setScale(1);
  }, [selectedImageIndex, filteredImages]);

  const handleNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    const newIndex = selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(newIndex);
    setScale(1);
  }, [selectedImageIndex, filteredImages]);

  const handleShare = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this beautiful ${image.occasion} cake from Emily Bakes Cakes!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    }
  };

  const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-full min-h-screen" style={{ background: '#F8EBD7' }}>
      {/* Header */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(32px, 6vw, 48px)',
                color: '#2B2B2B',
                marginBottom: '16px'
              }}
            >
              Our Gallery
            </h1>
            <p
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(15px, 3.5vw, 18px)',
                color: '#5A3825',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              Explore our collection of handcrafted masterpieces. Each creation tells a unique story.
            </p>
          </motion.div>

          {/* Filter Tabs with Raspberry Pink Underline */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedImageIndex(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  color: selectedCategory === category ? '#C44569' : '#5A3825',
                  padding: '8px 4px',
                  position: 'relative',
                  transition: 'color 200ms ease',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.color = '#C44569';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.color = '#5A3825';
                  }
                }}
              >
                {category}
                {selectedCategory === category && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: '#C44569',
                      borderRadius: '2px'
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Masonry Gallery Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Masonry columnsCount={4} gutter="16px" className="masonry-grid">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    background: 'white',
                    boxShadow: hoveredImage === image.id 
                      ? '0 8px 24px rgba(90, 56, 37, 0.16)' 
                      : '0 4px 8px rgba(90, 56, 37, 0.12)',
                    transition: 'all 300ms ease'
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                  onMouseEnter={() => setHoveredImage(image.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: hoveredImage === image.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={image.image}
                        alt={image.title}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          aspectRatio: image.aspectRatio.toString()
                        }}
                      />
                    </motion.div>

                    {/* EXIF-style Details on Hover */}
                    <AnimatePresence>
                      {hoveredImage === image.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                            padding: '24px 16px 16px',
                            color: 'white'
                          }}
                        >
                          <h4
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 600,
                              fontSize: '15px',
                              marginBottom: '8px'
                            }}
                          >
                            {image.title}
                          </h4>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', opacity: 0.9 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Tag size={14} />
                              <span>{image.occasion}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Layers size={14} />
                              <span>{image.tiers} tier{image.tiers > 1 ? 's' : ''}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={14} />
                              <span>{new Date(image.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          </motion.div>

          {/* Show count */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                color: '#5A3825',
                opacity: 0.7
              }}
            >
              Showing {filteredImages.length} of {galleryImages.length} cakes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0'
            }}
            onClick={() => {
              setSelectedImageIndex(null);
              setScale(1);
            }}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(null);
                setScale(1);
              }}
              style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                zIndex: 10001
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <X size={24} color="white" />
            </button>

            {/* Image Counter */}
            <div
              style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: 'white',
                padding: '12px 24px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '24px',
                zIndex: 10001
              }}
            >
              {selectedImageIndex + 1} / {filteredImages.length}
            </div>

            {/* Share Button */}
            {navigator.share && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(selectedImage);
                }}
                style={{
                  position: 'fixed',
                  top: '24px',
                  left: '24px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  zIndex: 10001
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(196, 69, 105, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <Share2 size={20} color="white" />
              </button>
            )}

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              style={{
                position: 'fixed',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                zIndex: 10001
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(196, 69, 105, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={28} color="white" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{
                position: 'fixed',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                zIndex: 10001
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(196, 69, 105, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={28} color="white" />
            </button>

            {/* Image Container with Pinch-to-Zoom Support */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                position: 'relative',
                touchAction: 'pinch-zoom'
              }}
            >
              <motion.div
                animate={{ scale }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  transformOrigin: 'center',
                  cursor: scale > 1 ? 'zoom-out' : 'zoom-in'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(scale === 1 ? 2 : 1);
                }}
              >
                <ImageWithFallback
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '85vh',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '8px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}
                />
              </motion.div>

              {/* Image Details Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: 'clamp(18px, 4vw, 24px)',
                    marginBottom: '12px'
                  }}
                >
                  {selectedImage.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap',
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '14px',
                    opacity: 0.9
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={16} />
                    <span>{selectedImage.occasion}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} />
                    <span>{selectedImage.tiers} tier{selectedImage.tiers > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} />
                    <span>{formatDate(selectedImage.date)}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: 'clamp(32px, 6vw, 48px) clamp(20px, 4vw, 32px)',
              boxShadow: '0 4px 8px rgba(90, 56, 37, 0.12)',
              textAlign: 'center'
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
                marginBottom: '16px'
              }}
            >
              Love What You See?
            </h2>
            <p
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#5A3825',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}
            >
              These are just a few examples of our work. Let's create something unique for your special occasion.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <button
                style={{
                  background: '#C44569',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '16px 40px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)',
                  transition: 'all 250ms ease',
                  minWidth: '240px',
                  minHeight: '48px'
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
                Start Custom Builder
              </button>
              <button
                style={{
                  background: 'transparent',
                  color: '#C44569',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '16px 40px',
                  borderRadius: '12px',
                  border: '2px solid #C44569',
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                  minWidth: '240px',
                  minHeight: '48px'
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

      {/* Add CSS for responsive masonry */}
      <style>{`
        @media (max-width: 1200px) {
          .masonry-grid {
            column-count: 3 !important;
          }
        }
        @media (max-width: 768px) {
          .masonry-grid {
            column-count: 2 !important;
          }
        }
        @media (max-width: 480px) {
          .masonry-grid {
            column-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
