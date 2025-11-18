import { AlertCircle, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface RushBannerProps {
  justification: string;
  onRemove: () => void;
}

export function RushBanner({ justification, onRemove }: RushBannerProps) {
  return (
    <div
      className="sticky top-0 z-40 mb-6 animate-in slide-in-from-top duration-300"
      style={{
        background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <AlertCircle size={20} color="#FFFFFF" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#FFFFFF'
                }}
              >
                🔥 RUSH ORDER ACTIVE
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                &lt; 2 Days
              </span>
            </div>

            <p
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '8px'
              }}
            >
              Manager approval required before order can be finalized
            </p>

            <div
              className="p-2 rounded"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <p
                style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  fontStyle: 'italic'
                }}
              >
                <strong>Justification:</strong> {justification}
              </p>
            </div>
          </div>

          <Button
            onClick={onRemove}
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
            style={{ color: '#FFFFFF' }}
            title="Remove rush order status"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
