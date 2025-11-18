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

    </button>
  );
}
