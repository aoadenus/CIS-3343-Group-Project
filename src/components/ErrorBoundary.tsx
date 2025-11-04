// Enhancement #17, #48: Error boundary for graceful error handling

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8EBD7' }}>
          <div className="max-w-md w-full">
            <div 
              className="p-8 rounded-2xl text-center"
              style={{ 
                backgroundColor: 'white',
                boxShadow: '0 8px 32px rgba(196, 69, 105, 0.15)',
                border: '2px solid rgba(196, 69, 105, 0.2)'
              }}
            >
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#EF444415' }}
              >
                <AlertCircle size={40} color="#EF4444" />
              </div>
              
              <h1 style={{ 
                fontFamily: 'Playfair Display', 
                fontSize: '28px', 
                color: '#C44569',
                marginBottom: '12px',
                fontWeight: 700
              }}>
                Oops! Something went wrong
              </h1>
              
              <p style={{ 
                fontFamily: 'Open Sans', 
                fontSize: '15px', 
                color: '#5A3825',
                opacity: 0.8,
                lineHeight: 1.6,
                marginBottom: '24px'
              }}>
                We encountered an unexpected error. Don't worry, your data is safe. Please try refreshing the page.
              </p>

              {this.state.error && process.env.NODE_ENV === 'development' && (
                <div 
                  className="p-4 rounded-lg mb-6 text-left overflow-auto max-h-32"
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <p style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '12px', 
                    color: '#EF4444',
                    wordBreak: 'break-word'
                  }}>
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <button
                onClick={this.handleReset}
                className="w-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#C44569',
                  color: 'white',
                  borderRadius: '10px',
                  height: '48px',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={18} />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
