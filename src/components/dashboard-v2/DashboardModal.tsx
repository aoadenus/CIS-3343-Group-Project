import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  disableBackdropClose?: boolean;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  disableBackdropClose = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      document.body.style.overflow = 'hidden';
      
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    } else {
      document.body.style.overflow = '';
      
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: 'modal-container-sm',
    md: 'modal-container-md',
    lg: 'modal-container-lg',
    xl: 'modal-container-xl',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !disableBackdropClose) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        className={`modal-container ${sizeClasses[size]}`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
      >
        <div className="modal-header">
          <h2 id={titleId.current}>{title}</h2>
          <button 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Close modal"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--db-z-modal-backdrop);
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--db-color-white);
          border-radius: var(--db-radius-xl);
          box-shadow: var(--db-shadow-modal);
          z-index: var(--db-z-modal);
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: calc(100% - 40px);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .modal-container-sm {
          max-width: 400px;
        }

        .modal-container-md {
          max-width: 600px;
        }

        .modal-container-lg {
          max-width: 800px;
        }

        .modal-container-xl {
          max-width: 1000px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #E5E7EB;
          flex-shrink: 0;
        }

        .modal-header h2 {
          font-family: var(--db-font-heading);
          font-size: 24px;
          font-weight: 600;
          color: var(--db-color-charcoal);
          margin: 0;
          line-height: 1.3;
        }

        .modal-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--db-color-gray-600);
          border-radius: var(--db-radius-sm);
          cursor: pointer;
          transition: all var(--db-transition-fast);
          flex-shrink: 0;
        }

        .modal-close:hover {
          background: var(--db-color-gray-100);
          color: var(--db-color-raspberry);
        }

        .modal-close:focus {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: 2px;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: var(--db-color-gray-100);
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: var(--db-color-gray-400);
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: var(--db-color-gray-500);
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #E5E7EB;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .modal-backdrop {
            padding: 0;
          }

          .modal-container {
            width: 100%;
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
            transform: translate(-50%, -50%) scale(1);
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(1);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          .modal-header {
            padding: 20px;
          }

          .modal-header h2 {
            font-size: 20px;
          }

          .modal-body {
            padding: 20px;
          }

          .modal-footer {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
};
