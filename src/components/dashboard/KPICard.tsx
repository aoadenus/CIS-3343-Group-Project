import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
  index?: number;
  onClick?: () => void;
}

export function KPICard({ title, value, change, icon: Icon, color, index = 0, onClick }: KPICardProps) {
  const hasPositiveTrend = change && change.startsWith('+');
  const hasNegativeTrend = change && change.startsWith('-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      style={{
        height: '120px',
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={onClick ? {
        y: -4,
        boxShadow: '0 8px 24px rgba(196, 69, 105, 0.2)',
        border: '2px solid rgba(196, 69, 105, 0.3)',
        padding: '19px'
      } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label={onClick ? `View ${title} details` : title}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '100%'
      }}>
        {/* Left Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          height: '100%'
        }}>
          {/* Title */}
          <p style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: '#6B7280',
            margin: 0,
            lineHeight: 1.4
          }}>
            {title}
          </p>

          {/* Value */}
          <div>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '32px',
              fontWeight: 700,
              color: '#2B2B2B',
              margin: '0 0 4px 0',
              lineHeight: 1
            }}>
              {value}
            </p>

            {/* Trend Indicator */}
            {change && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {hasPositiveTrend && <TrendingUp size={14} color="#10B981" />}
                {hasNegativeTrend && <TrendingDown size={14} color="#EF4444" />}
                <span style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: hasPositiveTrend ? '#10B981' : '#EF4444'
                }}>
                  {change}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '100%'
        }}>
          {/* Icon */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={24} color={color} strokeWidth={2.5} />
          </div>

          {/* Action Button */}
          {onClick && (
            <motion.div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(196, 69, 105, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease'
              }}
              whileHover={{
                background: '#C44569'
              }}
            >
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} color="#C44569" className="chevron-icon" />
              </motion.div>
              <style>{`
                .chevron-icon {
                  transition: color 200ms ease;
                }
                div:hover .chevron-icon {
                  color: #FFFFFF;
                }
              `}</style>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
