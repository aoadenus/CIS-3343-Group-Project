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

    </span>
  );
}
