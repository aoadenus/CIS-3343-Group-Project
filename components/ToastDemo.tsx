import { useToast } from './ToastContext';

export function ToastDemo() {
  const { showToast } = useToast();

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      <h3
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '24px',
          fontWeight: 600,
          color: '#2B2B2B',
          marginBottom: '8px'
        }}
      >
        Toast Notifications Demo
      </h3>
      <p
        style={{
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '16px',
          color: 'rgba(43, 43, 43, 0.65)',
          marginBottom: '24px',
          lineHeight: 1.6
        }}
      >
        Premium toast notifications with glassmorphism effect, slide-in animations, and auto-dismiss functionality. Maximum 3 toasts stack in top-right corner.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* Error Toasts */}
        <button
          onClick={() =>
            showToast('error', 'Failed to process payment. Please check your card details.')
          }
          className="btn-primary"
          style={{
            background: '#C44569',
            color: 'white'
          }}
        >
          Error Toast
        </button>

        <button
          onClick={() =>
            showToast('error', 'Your session has expired. Please log in again.', 'Session Expired')
          }
          className="btn-primary"
          style={{
            background: '#C44569',
            color: 'white'
          }}
        >
          Error with Title
        </button>

        {/* Warning Toasts */}
        <button
          onClick={() =>
            showToast('warning', 'Custom cake orders require 48 hours advance notice.')
          }
          style={{
            background: '#FFD166',
            color: '#2B2B2B',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            padding: '14px 32px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 209, 102, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Warning Toast
        </button>

        <button
          onClick={() =>
            showToast('warning', 'Rush fees may apply for orders within 24 hours.', 'Rush Order Warning')
          }
          style={{
            background: '#FFD166',
            color: '#2B2B2B',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            padding: '14px 32px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 209, 102, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Warning with Title
        </button>

        {/* Success Toasts */}
        <button
          onClick={() =>
            showToast('success', 'Your custom cake order has been successfully placed!')
          }
          style={{
            background: '#59C9A5',
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            padding: '14px 32px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(89, 201, 165, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Success Toast
        </button>

        <button
          onClick={() =>
            showToast('success', 'Your order #259 is ready for pickup today at 2:00 PM.', 'Order Ready!')
          }
          style={{
            background: '#59C9A5',
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            padding: '14px 32px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(89, 201, 165, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Success with Title
        </button>

        {/* Info Toasts */}
        <button
          onClick={() =>
            showToast('info', 'We\'re closed on Sundays. Please visit us Monday-Saturday.')
          }
          style={{
            background: '#F8EBD7',
            color: '#2B2B2B',
            border: '2px solid #C44569',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            padding: '14px 32px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Info Toast
        </button>

        <button
          onClick={() =>
            showToast('info', 'Your order is scheduled for pickup on Saturday, Nov 2nd.', 'Pickup Schedule')
          }
          style={{
            background: '#F8EBD7',
            color: '#2B2B2B',
            border: '2px solid #C44569',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            padding: '14px 32px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 250ms ease',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Info with Title
        </button>
      </div>

      {/* Stacking Demo */}
      <button
        onClick={() => {
          showToast('success', 'First notification added to queue');
          setTimeout(() => showToast('info', 'Second notification added', 'Stacking Demo'), 300);
          setTimeout(() => showToast('warning', 'Third notification added'), 600);
          setTimeout(() => showToast('error', 'Fourth replaces oldest (max 3)', 'Max Stack'), 900);
        }}
        style={{
          background: 'linear-gradient(135deg, #C44569 0%, #A03355 100%)',
          color: 'white',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          padding: '14px 32px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 250ms ease',
          minHeight: '48px',
          width: '100%',
          marginBottom: '24px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.12)';
        }}
      >
        Demo Stacking (Max 3 Toasts)
      </button>

      {/* Feature List */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.05) 0%, rgba(248, 235, 215, 0.3) 100%)',
          borderRadius: '12px',
          padding: '20px',
          borderLeft: '4px solid #C44569'
        }}
      >
        <h4
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            color: '#2B2B2B',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ color: '#C44569' }}>✨</span>
          Premium Features
        </h4>
        <ul
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '15px',
            color: 'rgba(43, 43, 43, 0.8)',
            lineHeight: 1.8,
            marginLeft: '20px',
            marginBottom: 0
          }}
        >
          <li><strong>Glassmorphism Effect:</strong> Subtle blur background with 12px border radius</li>
          <li><strong>Brand Colors:</strong> Raspberry Pink error, Mint Green success, Soft Amber warning, Cream Vanilla info</li>
          <li><strong>Auto-Dismiss:</strong> 5-second countdown with animated progress bar</li>
          <li><strong>Smart Stacking:</strong> Maximum 3 toasts; newest replaces oldest</li>
          <li><strong>Slide Animation:</strong> 250ms ease-out from top-right with subtle bounce</li>
          <li><strong>Accessibility:</strong> ARIA labels, keyboard navigation (Tab), WCAG AA contrast</li>
          <li><strong>Manual Dismiss:</strong> Close icon with hover states and focus indicators</li>
          <li><strong>Responsive:</strong> Adapts to mobile screens automatically</li>
        </ul>
      </div>
    </div>
  );
}
