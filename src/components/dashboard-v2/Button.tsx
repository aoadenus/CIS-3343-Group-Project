import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button'
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`db-button db-button-${variant} db-button-${size} ${fullWidth ? 'db-button-full-width' : ''} ${isDisabled ? 'db-button-disabled' : ''}`}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
    >
      {loading ? (
        <span className="db-button-icon db-button-spinner">
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        </span>
      ) : leftIcon ? (
        <span className="db-button-icon db-button-left-icon">
          {leftIcon}
        </span>
      ) : null}
      
      <span className="db-button-content">{children}</span>
      
      {rightIcon && !loading && (
        <span className="db-button-icon db-button-right-icon">
          {rightIcon}
        </span>
      )}

      <style jsx>{`
        .db-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--db-space-2);
          font-family: var(--db-font-sans);
          font-weight: var(--db-weight-semibold);
          border-radius: var(--db-radius-sm);
          border: var(--db-border-width) solid transparent;
          cursor: pointer;
          transition: all var(--db-transition-base);
          outline: none;
          white-space: nowrap;
          user-select: none;
          position: relative;
        }

        .db-button-sm {
          height: 32px;
          padding: 12px 16px;
          font-size: 14px;
          line-height: 1;
        }

        .db-button-md {
          height: 40px;
          padding: 14px 20px;
          font-size: 16px;
          line-height: 1;
        }

        .db-button-lg {
          height: 48px;
          padding: 16px 24px;
          font-size: 18px;
          line-height: 1;
        }

        .db-button-full-width {
          width: 100%;
        }

        .db-button-primary {
          background: var(--db-color-raspberry);
          color: var(--db-color-white);
          border-color: var(--db-color-raspberry);
        }

        .db-button-primary:hover:not(.db-button-disabled) {
          background: var(--db-color-raspberry-hover);
          border-color: var(--db-color-raspberry-hover);
          box-shadow: var(--db-shadow-raspberry);
        }

        .db-button-primary:active:not(.db-button-disabled) {
          transform: scale(0.98);
        }

        .db-button-secondary {
          background: var(--db-color-white);
          color: var(--db-color-charcoal);
          border-color: var(--db-color-charcoal);
        }

        .db-button-secondary:hover:not(.db-button-disabled) {
          background: var(--db-color-gray-50);
          border-color: var(--db-color-gray-700);
        }

        .db-button-secondary:active:not(.db-button-disabled) {
          transform: scale(0.98);
        }

        .db-button-ghost {
          background: transparent;
          color: var(--db-color-charcoal);
          border-color: transparent;
        }

        .db-button-ghost:hover:not(.db-button-disabled) {
          background: var(--db-color-gray-100);
        }

        .db-button-ghost:active:not(.db-button-disabled) {
          transform: scale(0.98);
        }

        .db-button-danger {
          background: var(--db-color-error);
          color: var(--db-color-white);
          border-color: var(--db-color-error);
        }

        .db-button-danger:hover:not(.db-button-disabled) {
          background: var(--db-color-error-border);
          border-color: var(--db-color-error-border);
          box-shadow: var(--db-shadow-error);
        }

        .db-button-danger:active:not(.db-button-disabled) {
          transform: scale(0.98);
        }

        .db-button:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: 2px;
        }

        .db-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .db-button-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .db-button-spinner {
          animation: spin 1s linear infinite;
        }

        .db-button-content {
          display: inline-flex;
          align-items: center;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 639px) {
          .db-button-sm {
            padding: 10px 14px;
            font-size: 13px;
          }

          .db-button-md {
            padding: 12px 18px;
            font-size: 15px;
          }

          .db-button-lg {
            padding: 14px 22px;
            font-size: 17px;
          }
        }
      `}</style>
    </button>
  );
}
