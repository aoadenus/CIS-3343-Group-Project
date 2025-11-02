import { motion } from 'motion/react';

interface SkeletonCardProps {
  variant?: 'customer' | 'admin';
  type?: 'product' | 'kpi' | 'table' | 'chart';
}

export function SkeletonCard({ variant = 'customer', type = 'product' }: SkeletonCardProps) {
  const isCustomer = variant === 'customer';
  
  // Customer site shimmer colors
  const customerShimmer = `
    linear-gradient(
      90deg,
      rgba(248, 235, 215, 0.3) 0%,
      rgba(196, 69, 105, 0.1) 50%,
      rgba(248, 235, 215, 0.3) 100%
    )
  `;
  
  // Admin shimmer colors
  const adminShimmer = `
    linear-gradient(
      90deg,
      rgba(240, 240, 240, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(240, 240, 240, 0.15) 100%
    )
  `;

  if (type === 'product') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="skeleton-card"
        style={{
          background: isCustomer ? '#FFFFFF' : '#F5F5F5',
          borderRadius: '12px',
          padding: '16px',
          border: isCustomer ? '1px solid #E0E0E0' : '1px solid #D0D0D0'
        }}
        aria-hidden="true"
      >
        {/* Image Placeholder */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '100%',
            height: '200px',
            borderRadius: '8px',
            background: isCustomer 
              ? 'linear-gradient(to right, #F8EBD7 0%, #E9DCC8 50%, #F8EBD7 100%)'
              : 'linear-gradient(to right, #E0E0E0 0%, #D0D0D0 50%, #E0E0E0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            marginBottom: '16px'
          }}
        />
        
        {/* Title Placeholder - Two Lines */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '90%',
            height: '16px',
            borderRadius: '4px',
            background: isCustomer 
              ? 'linear-gradient(to right, #F8EBD7 0%, #E9DCC8 50%, #F8EBD7 100%)'
              : 'linear-gradient(to right, #E0E0E0 0%, #D0D0D0 50%, #E0E0E0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            marginBottom: '8px'
          }}
        />
        
        <div
          className="skeleton-shimmer"
          style={{
            width: '70%',
            height: '16px',
            borderRadius: '4px',
            background: isCustomer 
              ? 'linear-gradient(to right, #F8EBD7 0%, #E9DCC8 50%, #F8EBD7 100%)'
              : 'linear-gradient(to right, #E0E0E0 0%, #D0D0D0 50%, #E0E0E0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            marginBottom: '12px'
          }}
        />
        
        {/* Price Placeholder */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '30%',
            height: '20px',
            borderRadius: '4px',
            background: isCustomer 
              ? 'linear-gradient(to right, rgba(196, 69, 105, 0.2) 0%, rgba(196, 69, 105, 0.1) 50%, rgba(196, 69, 105, 0.2) 100%)'
              : 'linear-gradient(to right, #E0E0E0 0%, #D0D0D0 50%, #E0E0E0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite'
          }}
        />
      </motion.div>
    );
  }

  if (type === 'kpi') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="skeleton-card"
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #E0E0E0'
        }}
        aria-hidden="true"
      >
        {/* Label */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '50%',
            height: '14px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #F0F0F0 0%, #E0E0E0 50%, #F0F0F0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            marginBottom: '16px'
          }}
        />
        
        {/* Value */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '40%',
            height: '36px',
            borderRadius: '6px',
            background: 'linear-gradient(to right, #F0F0F0 0%, #E0E0E0 50%, #F0F0F0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            marginBottom: '12px'
          }}
        />
        
        {/* Mini chart */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '100%',
            height: '40px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #F0F0F0 0%, #E0E0E0 50%, #F0F0F0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite'
          }}
        />
      </motion.div>
    );
  }

  if (type === 'table') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="skeleton-card"
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #E0E0E0'
        }}
        aria-hidden="true"
      >
        {/* Header Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer"
              style={{
                flex: 1,
                height: '12px',
                borderRadius: '4px',
                background: 'linear-gradient(to right, #F0F0F0 0%, #E0E0E0 50%, #F0F0F0 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite'
              }}
            />
          ))}
        </div>
        
        {/* Data Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            {[1, 2, 3, 4].map((col) => (
              <div
                key={col}
                className="skeleton-shimmer"
                style={{
                  flex: 1,
                  height: '14px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to right, #F5F5F5 0%, #E5E5E5 50%, #F5F5F5 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s linear infinite',
                  animationDelay: `${row * 0.1}s`
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>
    );
  }

  if (type === 'chart') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="skeleton-card skeleton-pulse-chart"
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid transparent',
          position: 'relative'
        }}
        aria-hidden="true"
      >
        {/* Title */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '40%',
            height: '18px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #F0F0F0 0%, #E0E0E0 50%, #F0F0F0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            marginBottom: '24px'
          }}
        />
        
        {/* Chart Area */}
        <div
          style={{
            width: '100%',
            height: '200px',
            borderRadius: '8px',
            background: 'linear-gradient(to right, #F5F5F5 0%, #E5E5E5 50%, #F5F5F5 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            padding: '16px'
          }}
        >
          {/* Simulated chart bars */}
          {[60, 80, 45, 90, 70, 85, 65].map((height, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${height}%`,
                background: 'rgba(196, 69, 105, 0.1)',
                borderRadius: '4px 4px 0 0'
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
}
