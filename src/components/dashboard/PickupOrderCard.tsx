import { Clock, Eye, Edit2, CheckCircle2, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { RushBadge } from './RushBadge';
import { getBorderStripeStyle } from '../../utils/orderColors';

interface PickupOrderCardProps {
  order: {
    id: number;
    customerName: string;
    orderDescription?: string;
    cakeDetails: {
      flavor: string;
      size: string;
      layers: number;
    };
    pickupTime: string;
    pickupDate?: string;
    status: 'pending' | 'baking' | 'decorating' | 'ready' | 'completed';
    priority: 'high' | 'medium' | 'low' | 'rush';
    payment: {
      total: number;
      paid: number;
      balance: number;
      status?: 'pending_deposit' | 'partial' | 'paid_in_full';
    };
  };
  onViewDetails?: () => void;
  onUpdateStatus?: () => void;
  onMarkPickedUp?: () => void;
}

export function PickupOrderCard({ order, onViewDetails, onUpdateStatus, onMarkPickedUp }: PickupOrderCardProps) {
  // Guard against division by zero
  const paymentProgress = order.payment.total > 0 
    ? Math.min(100, Math.max(0, (order.payment.paid / order.payment.total) * 100))
    : 0;
  const isRush = order.priority === 'rush' || order.priority === 'high';
  
  // Determine payment status
  const paymentStatus = order.payment.status || 
    (order.payment.balance === 0 ? 'paid_in_full' : 
     order.payment.paid === 0 ? 'pending_deposit' : 'partial');

  // Calculate time remaining (mock calculation - replace with real logic)
  const hoursRemaining = 6; // This should be calculated from pickupTime
  const isUrgent = hoursRemaining < 24;

  // Get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    const styles = {
      ready: { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB' },
      pending: { bg: '#FFF3CD', text: '#856404', border: '#FFEAA7' },
      baking: { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB' },
      decorating: { bg: '#E2D3F3', text: '#6A1B9A', border: '#D1B3ED' },
      completed: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' }
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const statusStyle = getStatusBadgeStyle(order.status);

  // Get payment badge styling
  const getPaymentBadgeStyle = () => {
    if (paymentStatus === 'pending_deposit') {
      return {
        bg: '#FEF3C7',
        border: '2px solid #F59E0B',
        color: '#92400E',
        fontWeight: 700,
        animation: 'pulse 2s ease-in-out infinite'
      };
    } else if (paymentStatus === 'partial') {
      return {
        bg: '#DBEAFE',
        border: '1px solid #3B82F6',
        color: '#1E40AF',
        fontWeight: 600
      };
    } else {
      return {
        bg: '#D1FAE5',
        border: '1px solid #10B981',
        color: '#065F46',
        fontWeight: 600
      };
    }
  };

  const paymentBadgeStyle = getPaymentBadgeStyle();
  const orderDescription = order.orderDescription || 
    `${order.cakeDetails.layers}-Layer ${order.cakeDetails.flavor}`;

  return (
    <div 
      style={{
        position: 'relative',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        minHeight: '140px',
        maxHeight: '180px',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Priority Stripe - Left Border */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '4px',
        height: '100%',
        borderRadius: '12px 0 0 12px',
        background: isRush || order.priority === 'high' ? '#EF4444' : 
                    order.priority === 'medium' ? '#F59E0B' : '#9CA3AF'
      }} />

      {/* Card Content */}
      <div style={{ padding: '16px', paddingLeft: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
          {/* Customer Info */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              color: '#2B2B2B',
              marginBottom: '4px',
              lineHeight: 1.2
            }}>
              {order.customerName}
            </h3>
            <p style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              color: '#5A3825',
              maxWidth: '280px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {orderDescription}
            </p>
          </div>

          {/* Badges */}
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            {/* Status Badge */}
            <span style={{
              height: '24px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: statusStyle.bg,
              color: statusStyle.text,
              border: `1px solid ${statusStyle.border}`,
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              {order.status.replace('_', ' ')}
            </span>
            
            {/* Rush Badge */}
            {isRush && <RushBadge />}
          </div>
        </div>

        {/* Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '12px'
        }}>
          {/* Pickup Time Section */}
          <div>
            <p style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px'
            }}>
              PICKUP TIME
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Clock size={14} color="#C44569" strokeWidth={2.5} />
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#2B2B2B'
              }}>
                {order.pickupTime}
              </span>
            </div>
            
            {/* Time Remaining Indicator */}
            {isUrgent && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
                padding: '4px 8px',
                background: '#FEE2E2',
                border: '1px solid #EF4444',
                borderRadius: '4px'
              }}>
                <AlertCircle size={12} color="#991B1B" />
                <span style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#991B1B'
                }}>
                  {hoursRemaining} hrs remaining
                </span>
              </div>
            )}
          </div>

          {/* Payment Status Section */}
          <div>
            <p style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px'
            }}>
              PAYMENT STATUS
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: paymentBadgeStyle.bg,
              border: paymentBadgeStyle.border as string,
              borderRadius: '6px'
            }}>
              {paymentStatus === 'paid_in_full' ? (
                <CheckCircle2 size={14} color={paymentBadgeStyle.color} strokeWidth={2.5} />
              ) : (
                <DollarSign size={14} color={paymentBadgeStyle.color} strokeWidth={2.5} />
              )}
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: paymentBadgeStyle.fontWeight as number,
                color: paymentBadgeStyle.color
              }}>
                {paymentStatus === 'pending_deposit' ? 'Pending Deposit' :
                 paymentStatus === 'partial' ? 'Partial Payment' : 'Paid in Full'}
              </span>
            </div>

            {/* Payment Details */}
            <div style={{ marginTop: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'Open Sans', fontWeight: 500, color: '#6B7280' }}>Total:</span>
                <span style={{ fontFamily: 'Open Sans', fontWeight: 600, color: '#2B2B2B' }}>
                  ${order.payment.total.toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'Open Sans', fontWeight: 500, color: '#6B7280' }}>Paid:</span>
                <span style={{ fontFamily: 'Open Sans', fontWeight: 600, color: '#10B981' }}>
                  ${order.payment.paid.toFixed(2)}
                </span>
              </div>
              {order.payment.balance > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Open Sans', fontWeight: 500, color: '#6B7280' }}>Balance:</span>
                  <span style={{ fontFamily: 'Open Sans', fontWeight: 700, fontSize: '13px', color: '#EF4444' }}>
                    ${order.payment.balance.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-start',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #E5E7EB'
        }}>
          {/* View Button */}
          <button
            onClick={onViewDetails}
            style={{
              height: '32px',
              padding: '6px 12px',
              background: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E5E7EB';
              e.currentTarget.style.borderColor = '#9CA3AF';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
              e.currentTarget.style.borderColor = '#D1D5DB';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Eye size={14} />
            <span>View</span>
          </button>

          {/* Update Status Button */}
          <button
            onClick={onUpdateStatus}
            style={{
              height: '32px',
              padding: '6px 12px',
              background: 'rgba(196, 69, 105, 0.08)',
              border: '1px solid rgba(196, 69, 105, 0.3)',
              borderRadius: '6px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: '#C44569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(196, 69, 105, 0.15)';
              e.currentTarget.style.borderColor = '#C44569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(196, 69, 105, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(196, 69, 105, 0.3)';
            }}
          >
            <Edit2 size={14} />
            <span>Update Status</span>
          </button>

          {/* Mark Picked Up Button */}
          <button
            onClick={onMarkPickedUp}
            style={{
              height: '32px',
              padding: '6px 12px',
              background: '#D4EDDA',
              border: '1px solid #10B981',
              borderRadius: '6px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: '#065F46',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#10B981';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#D4EDDA';
              e.currentTarget.style.color = '#065F46';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <CheckCircle2 size={14} />
            <span>Picked Up</span>
          </button>
        </div>
      </div>

      {/* Pulse animation for pending deposit */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
