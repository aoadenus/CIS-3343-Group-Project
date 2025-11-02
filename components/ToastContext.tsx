import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  index: number;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, index }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 5000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onRemove(toast.id);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [toast.id, duration, onRemove]);

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'error':
        return {
          icon: AlertCircle,
          background: '#C44569',        // Raspberry Pink
          textColor: '#FFFFFF',         // White
          iconColor: '#FFFFFF',
          borderColor: '#E36B86',       // 10% lighter Raspberry
          progressColor: '#E36B86',
          ariaLabel: 'Error notification'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          background: '#FFD166',        // Soft Amber
          textColor: '#2B2B2B',         // Charcoal Gray
          iconColor: '#2B2B2B',
          borderColor: '#F6C343',
          progressColor: '#F6C343',
          ariaLabel: 'Warning notification'
        };
      case 'success':
        return {
          icon: CheckCircle,
          background: '#59C9A5',        // Mint Green
          textColor: '#FFFFFF',         // White
          iconColor: '#FFFFFF',
          borderColor: '#4BB491',
          progressColor: '#4BB491',
          ariaLabel: 'Success notification'
        };
      case 'info':
        return {
          icon: Info,
          background: '#F8EBD7',        // Cream Vanilla
          textColor: '#2B2B2B',         // Charcoal Gray
          iconColor: '#C44569',         // Raspberry Pink icon
          borderColor: '#EAD4B8',
          progressColor: '#C44569',     // Raspberry progress
          ariaLabel: 'Information notification'
        };
    }
  };

  const config = getToastConfig(toast.type);
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ 
        duration: 0.25, 
        ease: [0.4, 0, 0.2, 1],
        y: { type: 'spring', stiffness: 300, damping: 25 }
      }}
      role="alert"
      aria-live="polite"
      aria-label={config.ariaLabel}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        minWidth: '320px',
        background: config.background,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '12px',
        padding: '16px 24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${config.borderColor}`,
        overflow: 'hidden',
        marginBottom: index > 0 ? '12px' : '0'
      }}
    >
      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Icon */}
        <div
          style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: toast.title ? '2px' : '0'
          }}
        >
          <Icon size={24} color={config.iconColor} strokeWidth={2} />
        </div>

        {/* Message Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {toast.title && (
            <h6
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '1.4',
                color: config.textColor,
                margin: '0 0 4px 0'
              }}
            >
              {toast.title}
            </h6>
          )}
          <p
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '16px',
              lineHeight: '1.5',
              color: config.textColor,
              margin: 0,
              opacity: toast.title ? 0.9 : 1
            }}
          >
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          aria-label="Dismiss notification"
          tabIndex={0}
          style={{
            flexShrink: 0,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            padding: 0,
            transition: 'opacity 150ms ease, background 150ms ease',
            color: config.textColor,
            opacity: 0.7,
            marginTop: toast.title ? '2px' : '0'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = toast.type === 'error' || toast.type === 'success'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(43, 43, 43, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.background = 'transparent';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = `2px solid ${config.textColor}`;
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: toast.type === 'error' || toast.type === 'success'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(43, 43, 43, 0.1)'
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: config.progressColor,
            transformOrigin: 'left',
            width: `${progress}%`
          }}
          transition={{ duration: 0.016, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const MAX_TOASTS = 3; // Maximum 3 toasts at once

  const showToast = useCallback((
    type: ToastType,
    message: string,
    title?: string,
    duration = 5000
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, type, message, title, duration };
    
    setToasts((prev) => {
      // If we have max toasts, remove the oldest one
      const updatedToasts = prev.length >= MAX_TOASTS ? prev.slice(1) : prev;
      return [...updatedToasts, newToast];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Toast Container - Top Right */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 99999,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column-reverse', // Stack from bottom to top
          alignItems: 'flex-end',
          gap: '0' // Gap handled by individual items
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'flex-end',
            pointerEvents: 'auto'
          }}
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((toast, index) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onRemove={removeToast}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Toast Container - Adjusted for mobile */}
      <style>
        {`
          @media (max-width: 480px) {
            div[style*="top: 24px"][style*="right: 24px"] {
              top: 16px !important;
              right: 16px !important;
              left: 16px !important;
              align-items: stretch !important;
            }
            
            div[style*="top: 24px"][style*="right: 24px"] > div {
              align-items: stretch !important;
            }
            
            div[style*="top: 24px"][style*="right: 24px"] [role="alert"] {
              max-width: 100% !important;
              min-width: 100% !important;
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
};
