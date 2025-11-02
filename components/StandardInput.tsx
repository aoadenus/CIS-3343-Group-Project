import React, { forwardRef } from 'react';

/**
 * Standardized Input Component
 * Implements consistent form input styling across the application
 * 
 * Specifications:
 * - Height: 48px
 * - Padding: 12px
 * - Border radius: 8px
 * - Border: Charcoal Gray 1px
 * - Focus state: Raspberry Pink
 */

interface StandardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const StandardInput = forwardRef<HTMLInputElement, StandardInputProps>(
  ({ label, error, helperText, icon, fullWidth = false, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const containerStyle: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      marginBottom: '16px'
    };

    const labelStyle: React.CSSProperties = {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      color: '#2B2B2B',
      marginBottom: '8px',
      display: 'block'
    };

    const inputWrapperStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    };

    const inputStyle: React.CSSProperties = {
      fontFamily: 'Open Sans, sans-serif',
      fontSize: '16px',
      height: '48px',
      padding: icon ? '12px 12px 12px 44px' : '12px',
      borderRadius: '8px',
      border: error ? '1px solid #EF4444' : '1px solid #2B2B2B',
      width: '100%',
      outline: 'none',
      transition: 'all 200ms ease-out',
      boxShadow: isFocused 
        ? error 
          ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
          : '0 0 0 3px rgba(196, 69, 105, 0.1)'
        : 'none',
      borderColor: isFocused 
        ? error 
          ? '#EF4444' 
          : '#C44569'
        : error
          ? '#EF4444'
          : '#2B2B2B'
    };

    const iconStyle: React.CSSProperties = {
      position: 'absolute',
      left: '12px',
      color: error ? '#EF4444' : isFocused ? '#C44569' : '#5A3825',
      pointerEvents: 'none',
      transition: 'color 200ms ease-out'
    };

    const helperStyle: React.CSSProperties = {
      fontFamily: 'Open Sans, sans-serif',
      fontSize: '13px',
      marginTop: '4px',
      color: error ? '#EF4444' : '#5A3825',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      opacity: 0.8
    };

    return (
      <div style={containerStyle} className={className}>
        {label && (
          <label style={labelStyle}>
            {label}
            {props.required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
          </label>
        )}
        
        <div style={inputWrapperStyle}>
          {icon && <div style={iconStyle}>{icon}</div>}
          
          <input
            ref={ref}
            style={inputStyle}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />
        </div>

        {error && (
          <div 
            id={`${props.id}-error`} 
            style={helperStyle} 
            role="alert"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
            </svg>
            {error}
          </div>
        )}

        {helperText && !error && (
          <div id={`${props.id}-helper`} style={helperStyle}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

StandardInput.displayName = 'StandardInput';
