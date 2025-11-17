import { LucideIcon } from 'lucide-react';

interface QuickActionTileProps {
  label: string;
  description?: string;
  icon: LucideIcon;
  iconColor: string;
  onClick: () => void;
  disabled?: boolean;
}

export function QuickActionTile({
  label,
  description,
  icon: Icon,
  iconColor,
  onClick,
  disabled = false
}: QuickActionTileProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  const ariaLabel = description 
    ? `${label}. ${description}` 
    : label;

  return (
    <div
      className={`quick-action-tile ${disabled ? 'quick-action-tile-disabled' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      <div className="tile-icon" aria-hidden="true">
        <Icon size={32} color={disabled ? 'var(--db-color-gray-400)' : iconColor} />
      </div>
      
      <h4 className="tile-label">{label}</h4>
      
      {description && (
        <p className="tile-description">{description}</p>
      )}

      <style jsx>{`
        .quick-action-tile {
          background: var(--db-color-white);
          border: 1px solid #E5E7EB;
          border-radius: var(--db-radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--db-space-3);
          cursor: pointer;
          transition: all var(--db-transition-base);
          outline: none;
          position: relative;
        }

        .quick-action-tile:hover:not(.quick-action-tile-disabled) {
          transform: translateY(-2px);
          box-shadow: var(--db-shadow-raspberry);
          border-color: var(--db-color-raspberry);
        }

        .quick-action-tile:active:not(.quick-action-tile-disabled) {
          transform: translateY(-2px) scale(0.98);
        }

        .quick-action-tile:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: 2px;
        }

        .quick-action-tile-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .tile-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--db-space-2);
        }

        .tile-label {
          font-family: var(--db-font-heading);
          font-size: 16px;
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
          margin: 0;
          line-height: 1.3;
        }

        .tile-description {
          font-family: var(--db-font-sans);
          font-size: 14px;
          font-weight: var(--db-weight-regular);
          color: var(--db-color-gray-600);
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 639px) {
          .quick-action-tile {
            padding: 20px;
          }

          .tile-icon {
            margin-bottom: var(--db-space-1);
          }

          .tile-label {
            font-size: 15px;
          }

          .tile-description {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
