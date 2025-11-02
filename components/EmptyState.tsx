import React from 'react';
import { StandardButton } from './StandardButton';
import { Cake, ShoppingBag, Users, FileText, Image as ImageIcon } from 'lucide-react';

/**
 * Empty State Component
 * Displays friendly, branded empty states with illustrations and CTAs
 */

interface EmptyStateProps {
  type: 'orders' | 'products' | 'customers' | 'gallery' | 'custom';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  illustration
}: EmptyStateProps) {
  
  // Pre-defined configurations for common empty states
  const configs = {
    orders: {
      title: 'No orders yet',
      description: 'Your first custom cake awaits! Start creating delicious memories.',
      actionLabel: 'Create Order',
      icon: Cake
    },
    products: {
      title: 'No products yet',
      description: 'Add your first delicious creation to the menu.',
      actionLabel: 'Add Product',
      icon: ShoppingBag
    },
    customers: {
      title: 'No customers yet',
      description: 'Your customer base will grow as orders come in.',
      actionLabel: 'View Orders',
      icon: Users
    },
    gallery: {
      title: 'Gallery is empty',
      description: 'Upload beautiful photos of your cakes to inspire customers.',
      actionLabel: 'Upload Photos',
      icon: ImageIcon
    },
    custom: {
      title: title || 'Nothing here yet',
      description: description || 'Get started by adding new content.',
      actionLabel: actionLabel || 'Get Started',
      icon: FileText
    }
  };

  const config = type === 'custom' ? configs.custom : configs[type];
  const Icon = config.icon;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    textAlign: 'center',
    minHeight: '400px'
  };

  const illustrationStyle: React.CSSProperties = {
    marginBottom: '32px',
    opacity: 0.9
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '24px',
    fontWeight: 600,
    color: '#2B2B2B',
    marginBottom: '12px'
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '16px',
    color: '#5A3825',
    maxWidth: '400px',
    marginBottom: '32px',
    lineHeight: 1.6
  };

  return (
    <div style={containerStyle}>
      {/* Illustration */}
      <div style={illustrationStyle}>
        {illustration || (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(196, 69, 105, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <Icon size={56} color="#C44569" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <h3 style={titleStyle}>
        {title || config.title}
      </h3>
      
      <p style={descriptionStyle}>
        {description || config.description}
      </p>

      {/* CTA */}
      {onAction && (
        <StandardButton
          variant="primary"
          size="lg"
          onClick={onAction}
        >
          {actionLabel || config.actionLabel}
        </StandardButton>
      )}
    </div>
  );
}

/**
 * Cake Question Mark Illustration
 * Simple line art for "No orders" empty state
 */
export function CakeQuestionIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cake layers */}
      <rect
        x="30"
        y="70"
        width="60"
        height="20"
        rx="2"
        stroke="#C44569"
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="35"
        y="50"
        width="50"
        height="20"
        rx="2"
        stroke="#C44569"
        strokeWidth="2"
        fill="none"
      />
      <rect
        x="40"
        y="30"
        width="40"
        height="20"
        rx="2"
        stroke="#C44569"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Candle */}
      <line
        x1="60"
        y1="30"
        x2="60"
        y2="20"
        stroke="#C44569"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="60"
        cy="17"
        rx="3"
        ry="4"
        fill="#FEF3C7"
        stroke="#C44569"
        strokeWidth="1"
      />
      
      {/* Question mark */}
      <g transform="translate(85, 40)">
        <path
          d="M 8 2 Q 8 0 10 0 Q 12 0 12 2 Q 12 4 10 6 L 10 10"
          stroke="#5A3825"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="10"
          cy="14"
          r="1.5"
          fill="#5A3825"
        />
      </g>
    </svg>
  );
}
