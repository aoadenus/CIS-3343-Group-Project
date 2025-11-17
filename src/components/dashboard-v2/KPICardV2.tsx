import { LucideIcon, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface KPICardV2Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: string;
    period: string;
    direction: 'up' | 'down' | 'neutral';
  };
  onClick?: () => void;
  loading?: boolean;
}

export function KPICardV2({
  title,
  value,
  icon: Icon,
  iconColor,
  trend,
  onClick,
  loading = false
}: KPICardV2Props) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <ArrowUp size={16} />;
      case 'down':
        return <ArrowDown size={16} />;
      case 'neutral':
        return <Minus size={16} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'var(--db-color-success)';
      case 'down':
        return 'var(--db-color-error)';
      case 'neutral':
        return 'var(--db-color-gray-500)';
      default:
        return '';
    }
  };

  const ariaLabel = `${title}: ${value}${trend ? `, ${trend.value} ${trend.period}` : ''}. Click to view details.`;

  if (loading) {
    return (
      <div className="kpi-card-v2 kpi-card-v2-loading">
        <div className="kpi-header">
          <div className="kpi-skeleton kpi-skeleton-icon" />
          <div className="kpi-skeleton kpi-skeleton-title" />
        </div>
        
        <div className="kpi-skeleton kpi-skeleton-value" />
        
        <div className="kpi-skeleton kpi-skeleton-trend" />
        
        <div className="kpi-skeleton kpi-skeleton-button" />

        <style jsx>{`
          .kpi-card-v2-loading {
            cursor: default;
            pointer-events: none;
          }

          .kpi-skeleton {
            background: linear-gradient(
              90deg,
              var(--db-color-gray-100) 0%,
              var(--db-color-gray-200) 50%,
              var(--db-color-gray-100) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
            border-radius: var(--db-radius-sm);
          }

          .kpi-skeleton-icon {
            width: 24px;
            height: 24px;
            border-radius: var(--db-radius-sm);
          }

          .kpi-skeleton-title {
            width: 120px;
            height: 14px;
          }

          .kpi-skeleton-value {
            width: 140px;
            height: 36px;
            margin: 12px 0;
          }

          .kpi-skeleton-trend {
            width: 180px;
            height: 12px;
            margin-bottom: 16px;
          }

          .kpi-skeleton-button {
            width: 100%;
            height: 36px;
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="kpi-card-v2"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={onClick ? 0 : -1}
      aria-label={onClick ? ariaLabel : undefined}
    >
      <div className="kpi-header">
        <Icon size={24} color={iconColor} />
        <h3 className="kpi-title">{title}</h3>
      </div>
      
      <div className="kpi-value">{value}</div>
      
      {trend && (
        <div className="kpi-trend" style={{ color: getTrendColor() }}>
          <span className="kpi-trend-icon">{getTrendIcon()}</span>
          <span className="kpi-trend-value">{trend.value}</span>
          <span className="kpi-period">{trend.period}</span>
        </div>
      )}
      
      {onClick && (
        <button 
          className="kpi-action"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClick();
          }}
          tabIndex={-1}
        >
          View Details →
        </button>
      )}

      <style jsx>{`
        .kpi-card-v2 {
          background: var(--db-color-white);
          border: 1px solid #E5E7EB;
          border-radius: var(--db-radius-lg);
          padding: var(--db-space-6);
          box-shadow: var(--db-shadow-card);
          cursor: ${onClick ? 'pointer' : 'default'};
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: var(--db-space-2);
          position: relative;
          outline: none;
        }

        .kpi-card-v2:hover {
          ${onClick ? `
            box-shadow: var(--db-shadow-card-hover);
            border-color: var(--db-color-raspberry);
            transform: translateY(-2px);
          ` : ''}
        }

        .kpi-card-v2:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: 2px;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: var(--db-space-3);
        }

        .kpi-title {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-chocolate);
          margin: 0;
          line-height: var(--db-text-sm-line-height);
        }

        .kpi-value {
          font-family: var(--db-font-heading);
          font-size: var(--db-text-h1);
          font-weight: var(--db-weight-bold);
          color: var(--db-color-charcoal);
          line-height: var(--db-text-h1-line-height);
          margin: 12px 0;
        }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: var(--db-space-2);
          font-family: var(--db-font-sans);
          font-size: var(--db-text-tiny);
          font-weight: var(--db-weight-medium);
          line-height: var(--db-text-tiny-line-height);
        }

        .kpi-trend-icon {
          display: flex;
          align-items: center;
        }

        .kpi-trend-value {
          font-weight: var(--db-weight-semibold);
        }

        .kpi-period {
          color: var(--db-color-gray-500);
          font-weight: var(--db-weight-regular);
        }

        .kpi-action {
          margin-top: var(--db-space-4);
          padding: var(--db-space-3) var(--db-space-4);
          background: transparent;
          border: 1px solid var(--db-color-gray-200);
          border-radius: var(--db-radius-sm);
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-raspberry);
          cursor: pointer;
          transition: all var(--db-transition-base);
          width: 100%;
          text-align: center;
        }

        .kpi-action:hover {
          background: var(--db-color-raspberry-light);
          border-color: var(--db-color-raspberry);
        }

        .kpi-action:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: 2px;
        }

        .kpi-action:active {
          transform: scale(0.98);
        }

        @media (max-width: 639px) {
          .kpi-card-v2 {
            padding: var(--db-space-5);
          }

          .kpi-value {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
