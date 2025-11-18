import { LucideIcon, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface KPICardV2Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  subtitle?: string;
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
  subtitle,
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

      </div>
    );
  }

  return (
    <div
      className={`kpi-card-v2${onClick ? ' kpi-card-clickable' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={onClick ? 0 : -1}
      aria-label={onClick ? ariaLabel : undefined}
    >
      <div className="kpi-header">
        <Icon size={24} color={iconColor} />
        <div>
          <h3 className="kpi-title">{title}</h3>
          {subtitle && <div className="kpi-subtitle text-xs text-gray-500">{subtitle}</div>}
        </div>
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
    </div>
  );
}
