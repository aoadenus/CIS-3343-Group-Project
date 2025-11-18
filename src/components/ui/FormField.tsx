/**
 * FormField Component - Enterprise-grade form field with validation
 * Provides consistent styling, error states, and accessibility
 */

import { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  helpText?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  success,
  hint,
  helpText,
  children,
  className = ''
}: FormFieldProps) {
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  return (
    <div className={`form-field ${className}`}>
      {/* Label with required indicator */}
      <label
        htmlFor={htmlFor}
        style={{
          display: 'block',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: hasError ? '#DC2626' : '#2B2B2B',
          marginBottom: '8px',
          transition: 'color 0.2s ease'
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#C44569', marginLeft: '4px' }}>*</span>
        )}
        {hint && !hasError && !hasSuccess && (
          <span
            style={{
              fontSize: '12px',
              color: '#999',
              fontWeight: 400,
              marginLeft: '8px'
            }}
          >
            {hint}
          </span>
        )}
      </label>

      {/* Help text (optional info before input) */}
      {helpText && !hasError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            gap: '6px',
            padding: '8px 12px',
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: '6px',
            marginBottom: '8px'
          }}
        >
          <Info size={16} style={{ color: '#0284C7', flexShrink: 0, marginTop: '2px' }} />
          <p
            style={{
              fontSize: '13px',
              color: '#0C4A6E',
              margin: 0,
              lineHeight: '1.5'
            }}
          >
            {helpText}
          </p>
        </div>
      )}

      {/* Input field */}
      <div style={{ position: 'relative' }}>
        {children}
        
        {/* Success icon */}
        {hasSuccess && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#10B981' }} />
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div
          className="validation-error"
          role="alert"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            padding: '8px 12px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '6px',
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          <AlertCircle size={16} style={{ color: '#DC2626', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '13px',
              color: '#DC2626',
              fontWeight: 500
            }}
          >
            {error}
          </span>
        </div>
      )}

      {/* Success message */}
      {hasSuccess && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            padding: '8px 12px',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '6px'
          }}
        >
          <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '13px',
              color: '#15803D',
              fontWeight: 500
            }}
          >
            {success}
          </span>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-field input[aria-invalid="true"],
        .form-field textarea[aria-invalid="true"],
        .form-field select[aria-invalid="true"] {
          border-color: #DC2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }

        .form-field input:focus[aria-invalid="true"],
        .form-field textarea:focus[aria-invalid="true"],
        .form-field select:focus[aria-invalid="true"] {
          outline: none;
          border-color: #DC2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
