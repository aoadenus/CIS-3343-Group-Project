/**
 * BusinessRuleBanner Component
 * Displays important business rules and requirements prominently
 */

import { ReactNode } from 'react';
import { AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

type BannerType = 'info' | 'warning' | 'error' | 'success';

interface BusinessRuleBannerProps {
  type?: BannerType;
  title: string;
  message: string | ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const bannerStyles: Record<BannerType, {
  background: string;
  border: string;
  iconColor: string;
  textColor: string;
  titleColor: string;
}> = {
  info: {
    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    border: '1px solid #93C5FD',
    iconColor: '#2563EB',
    textColor: '#1E40AF',
    titleColor: '#1E3A8A'
  },
  warning: {
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    border: '1px solid #FCD34D',
    iconColor: '#D97706',
    textColor: '#92400E',
    titleColor: '#78350F'
  },
  error: {
    background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
    border: '1px solid #FCA5A5',
    iconColor: '#DC2626',
    textColor: '#991B1B',
    titleColor: '#7F1D1D'
  },
  success: {
    background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    border: '1px solid #6EE7B7',
    iconColor: '#059669',
    textColor: '#065F46',
    titleColor: '#064E3B'
  }
};

const defaultIcons: Record<BannerType, ReactNode> = {
  info: <Info size={24} />,
  warning: <AlertTriangle size={24} />,
  error: <AlertCircle size={24} />,
  success: <CheckCircle2 size={24} />
};

export function BusinessRuleBanner({
  type = 'info',
  title,
  message,
  icon,
  action,
  className = ''
}: BusinessRuleBannerProps) {
  const styles = bannerStyles[type];
  const displayIcon = icon || defaultIcons[type];

  return (
    <div
      className={`business-rule-banner ${className}`}
      role="alert"
      aria-live="polite"
      style={{
        background: styles.background,
        border: styles.border,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
        {/* Icon */}
        <div
          style={{
            color: styles.iconColor,
            flexShrink: 0,
            marginTop: '2px'
          }}
        >
          {displayIcon}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: styles.titleColor,
              margin: '0 0 6px 0'
            }}
          >
            {title}
          </h4>
          <div
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '14px',
              color: styles.textColor,
              lineHeight: '1.6',
              margin: 0
            }}
          >
            {message}
          </div>
          
          {/* Action button/link */}
          {action && (
            <div style={{ marginTop: '12px' }}>
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Specific banner for Rush Orders
 */
export function RushOrderBanner({
  daysUntil,
  hoursUntil,
  requiresApproval,
  approved,
  onApprovalChange
}: {
  daysUntil: number;
  hoursUntil?: number;
  requiresApproval: boolean;
  approved: boolean;
  onApprovalChange: (checked: boolean) => void;
}) {
  const isSameDay = daysUntil < 1;
  
  return (
    <BusinessRuleBanner
      type="error"
      title="⚠️ Rush Order Detected"
      message={
        <div>
          <p style={{ margin: '0 0 8px 0' }}>
            {isSameDay ? (
              <>
                This is a <strong>same-day order</strong>. Manager approval is required to proceed.
              </>
            ) : (
              <>
                This order is due in <strong>{daysUntil.toFixed(1)} days</strong> (less than the 2-day minimum). 
                Manager approval is required.
              </>
            )}
          </p>
          {hoursUntil !== undefined && hoursUntil < 24 && (
            <p style={{ margin: '0 0 12px 0', fontSize: '13px' }}>
              Only {Math.floor(hoursUntil)} hours until pickup.
            </p>
          )}
          
          {requiresApproval && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '6px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
            >
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => onApprovalChange(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#DC2626'
                }}
              />
              <span style={{ fontWeight: 500, color: '#7F1D1D' }}>
                Manager Approval (Required)
              </span>
            </label>
          )}
        </div>
      }
    />
  );
}

/**
 * Specific banner for Deposit Requirements
 */
export function DepositRequirementBanner({
  totalAmount,
  depositAmount,
  minimumDeposit
}: {
  totalAmount: number;
  depositAmount: number;
  minimumDeposit: number;
}) {
  const meetsRequirement = depositAmount >= minimumDeposit;
  
  return (
    <BusinessRuleBanner
      type={meetsRequirement ? 'success' : 'warning'}
      title={meetsRequirement ? '✓ Deposit Requirement Met' : '⚠️ Minimum Deposit Required'}
      message={
        <div>
          <p style={{ margin: 0 }}>
            {meetsRequirement ? (
              <>
                Deposit of <strong>${(depositAmount / 100).toFixed(2)}</strong> meets the 50% requirement.
              </>
            ) : (
              <>
                A minimum deposit of <strong>${(minimumDeposit / 100).toFixed(2)}</strong> (50% of total) is required.
                Current: ${(depositAmount / 100).toFixed(2)}
              </>
            )}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
            Total Order: ${(totalAmount / 100).toFixed(2)} | 
            Balance Due: ${((totalAmount - depositAmount) / 100).toFixed(2)}
          </p>
        </div>
      }
    />
  );
}
