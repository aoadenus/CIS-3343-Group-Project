import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  thumbnail?: string; // Optional low-res thumbnail for blur-up
  onLoad?: () => void;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  thumbnail,
  onLoad 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setTimeout(() => {
      setShowFullImage(true);
      onLoad?.();
    }, 50);
  };

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#F8EBD7',
        ...style
      }}
    >
      {/* Blur-up thumbnail (if provided) */}
      {thumbnail && !showFullImage && (
        <motion.img
          src={thumbnail}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            opacity: 0.6
          }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: showFullImage ? 0 : 0.6 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Skeleton placeholder (when no thumbnail) */}
      {!thumbnail && !showFullImage && (
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, #F8EBD7 0%, #E9DCC8 50%, #F8EBD7 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite'
          }}
        />
      )}

      {/* Full resolution image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 1
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showFullImage ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeIn' }}
        />
      )}
    </div>
  );
}
