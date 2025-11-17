interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  dot = false
}: BadgeProps) {
  return (
    <span 
      className={`db-badge db-badge-${variant} db-badge-${size}`}
      role="status"
      aria-label={`${variant} status: ${children}`}
    >
      {dot && <span className="db-badge-dot" aria-hidden="true" />}
      <span className="db-badge-content">{children}</span>

      <style jsx>{`
        .db-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--db-space-2);
          font-family: var(--db-font-sans);
          font-weight: var(--db-weight-medium);
          border-radius: 12px;
          white-space: nowrap;
          line-height: 1;
        }

        .db-badge-sm {
          height: 20px;
          padding: 0 8px;
          font-size: 12px;
        }

        .db-badge-md {
          height: 24px;
          padding: 0 10px;
          font-size: 14px;
        }

        .db-badge-success {
          background: var(--db-color-success-light);
          color: var(--db-color-success-border);
        }

        .db-badge-success .db-badge-dot {
          background: var(--db-color-success-border);
        }

        .db-badge-warning {
          background: var(--db-color-warning-light);
          color: var(--db-color-warning-border);
        }

        .db-badge-warning .db-badge-dot {
          background: var(--db-color-warning-border);
        }

        .db-badge-error {
          background: var(--db-color-error-light);
          color: var(--db-color-error-border);
        }

        .db-badge-error .db-badge-dot {
          background: var(--db-color-error-border);
        }

        .db-badge-info {
          background: var(--db-color-info-light);
          color: var(--db-color-info-border);
        }

        .db-badge-info .db-badge-dot {
          background: var(--db-color-info-border);
        }

        .db-badge-neutral {
          background: var(--db-color-gray-100);
          color: var(--db-color-charcoal);
        }

        .db-badge-neutral .db-badge-dot {
          background: var(--db-color-gray-500);
        }

        .db-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .db-badge-content {
          display: inline-flex;
          align-items: center;
        }

        @media (max-width: 639px) {
          .db-badge-sm {
            height: 18px;
            padding: 0 7px;
            font-size: 11px;
          }

          .db-badge-md {
            height: 22px;
            padding: 0 9px;
            font-size: 13px;
          }
        }
      `}</style>
    </span>
  );
}
