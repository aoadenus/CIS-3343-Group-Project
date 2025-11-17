import { useState } from 'react';
import { RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface DashboardFooterProps {
  onRefresh?: () => void | Promise<void>;
}

export function DashboardFooter({ onRefresh }: DashboardFooterProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshHovered, setIsRefreshHovered] = useState(false);
  const [isHelpHovered, setIsHelpHovered] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <footer style={{
      position: 'sticky',
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'white',
      borderTop: '1px solid #E5E7EB',
      zIndex: 10
    }}>
      {/* Left - Last Updated */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '13px',
          color: '#6B7280'
        }}>
          Last updated:
        </span>
        <span style={{
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          color: '#1F2937'
        }}>
          {formatTime(lastUpdated)}
        </span>
      </div>

      {/* Center - Refresh Button */}
      <Button
        onClick={handleRefresh}
        disabled={isRefreshing}
        variant="outline"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          height: '36px',
          border: `1px solid ${!isRefreshing && isRefreshHovered ? '#C44569' : '#E5E7EB'}`,
          borderRadius: '6px',
          background: 'white',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: !isRefreshing && isRefreshHovered ? '#C44569' : '#4B5563',
          cursor: isRefreshing ? 'wait' : 'pointer',
          transition: 'all 200ms ease-out',
          opacity: isRefreshing ? 0.6 : 1
        }}
        onMouseEnter={() => setIsRefreshHovered(true)}
        onMouseLeave={() => setIsRefreshHovered(false)}
        onFocus={() => setIsRefreshHovered(true)}
        onBlur={() => setIsRefreshHovered(false)}
        aria-label="Refresh dashboard data"
      >
        <RefreshCw 
          size={16} 
          strokeWidth={2}
          style={{
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
          }}
          aria-hidden="true"
        />
        Refresh Data
      </Button>

      {/* Right - Help Link */}
      <a
        href="/help"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: '#C44569',
          textDecoration: isHelpHovered ? 'underline' : 'none',
          transition: 'text-decoration 150ms ease-out'
        }}
        onMouseEnter={() => setIsHelpHovered(true)}
        onMouseLeave={() => setIsHelpHovered(false)}
        onFocus={() => setIsHelpHovered(true)}
        onBlur={() => setIsHelpHovered(false)}
        aria-label="Get help and support"
      >
        <HelpCircle size={16} strokeWidth={2} aria-hidden="true" />
        Help & Support
      </a>

      {/* CSS for RefreshCw spin animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </footer>
  );
}
