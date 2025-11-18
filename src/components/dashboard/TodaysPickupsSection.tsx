import React, { useState } from 'react';
import { Clock, DollarSign, AlertCircle, Eye, Edit2, CheckCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

interface PickupOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  productName: string;
  sizeDescription: string;
  pickupTime: string;
  pickupDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'pending_deposit' | 'partial' | 'paid';
  status: 'ready' | 'pending' | 'baking' | 'decorating';
  priority: 'high' | 'medium' | 'low';
  hoursUntilPickup?: number;
}

interface TodaysPickupsSectionProps {
  orders: PickupOrder[];
  onViewOrder: (orderId: number) => void;
  onUpdateStatus: (orderId: number) => void;
  onMarkPickedUp: (orderId: number) => void;
  loading?: boolean;
}

export function TodaysPickupsSection({ 
  orders, 
  onViewOrder, 
  onUpdateStatus, 
  onMarkPickedUp,
  loading = false 
}: TodaysPickupsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const styles = {
      ready: { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB' },
      pending: { bg: '#FFF3CD', text: '#856404', border: '#FFEAA7' },
      baking: { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB' },
      decorating: { bg: '#E2D3F3', text: '#6A1B9A', border: '#D1B3ED' },
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getPaymentBadgeStyle = (paymentStatus: string) => {
    const styles = {
      pending_deposit: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B', bold: true, pulse: true },
      partial: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6', bold: false, pulse: false },
      paid: { bg: '#D1FAE5', text: '#065F46', border: '#10B981', bold: false, pulse: false },
    };
    return styles[paymentStatus as keyof typeof styles] || styles.partial;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ 
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          height: '200px',
          backgroundColor: '#F3F4F6',
          borderRadius: '12px'
        }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(196, 69, 105, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={20} color="#C44569" strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              fontWeight: 700,
              color: '#2B2B2B',
              margin: 0,
              lineHeight: 1.2
            }}>
              Today's Pickups
            </h3>
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              backgroundColor: '#F3F4F6',
              padding: '4px 10px',
              borderRadius: '6px',
              marginLeft: '8px'
            }}>
              {filteredOrders.length} orders
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search 
            size={18} 
            color="#9CA3AF" 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            placeholder="Search by last name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '40px',
              paddingRight: '16px',
              border: '2px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: "'Open Sans', sans-serif",
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#C44569';
              e.target.style.boxShadow = '0 0 0 4px rgba(196, 69, 105, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: '#FAFBFC',
          border: '2px dashed #E5E7EB',
          borderRadius: '12px'
        }}>
          <Clock size={48} color="#C44569" style={{ opacity: 0.5, marginBottom: '16px' }} />
          <h4 style={{ 
            fontFamily: "'Poppins', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: '#2B2B2B',
            margin: '0 0 8px 0'
          }}>
            No pickups found
          </h4>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            {searchQuery ? `No results for "${searchQuery}"` : 'No pickups scheduled for today'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '16px'
        }}>
          {filteredOrders.slice(0, 5).map((order) => {
            const statusStyle = getStatusBadgeStyle(order.status);
            const paymentStyle = getPaymentBadgeStyle(order.paymentStatus);
            const priorityColor = getPriorityColor(order.priority);

            return (
              <div
                key={order.id}
                style={{
                  position: 'relative',
                  background: '#FFFFFF',
                  border: '1px solid #E0E0E0',
                  borderRadius: '12px',
                  padding: '16px',
                  paddingLeft: '20px',
                  minHeight: '140px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(196, 69, 105, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E0E0E0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Priority Stripe */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: priorityColor,
                  borderRadius: '12px 0 0 12px'
                }} />

                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#2B2B2B',
                      marginBottom: '4px',
                      lineHeight: 1.2
                    }}>
                      {order.customerName}
                    </div>
                    <div style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '13px',
                      color: '#5A3825',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '280px'
                    }}>
                      {order.productName} • {order.sizeDescription}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span style={{
                      height: '24px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase',
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.border}`
                    }}>
                      {order.status}
                    </span>
                    {order.priority === 'high' && (
                      <span style={{
                        height: '24px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        border: '2px solid #EF4444',
                        animation: paymentStyle.pulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                      }}>
                        🔥 RUSH
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  {/* Pickup Time */}
                  <div>
                    <div style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      PICKUP TIME
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#C44569" strokeWidth={2.5} />
                      <span style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#2B2B2B'
                      }}>
                        Today, {order.pickupTime}
                      </span>
                    </div>
                    {order.hoursUntilPickup !== undefined && order.hoursUntilPickup < 24 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#FEE2E2',
                        border: '1px solid #EF4444',
                        borderRadius: '4px'
                      }}>
                        <AlertCircle size={12} color="#991B1B" />
                        <span style={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#991B1B'
                        }}>
                          {order.hoursUntilPickup} hrs remaining
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Payment Status */}
                  <div>
                    <div style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      PAYMENT STATUS
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      backgroundColor: paymentStyle.bg,
                      border: `${paymentStyle.bold ? '2px' : '1px'} solid ${paymentStyle.border}`,
                      borderRadius: '6px',
                      animation: paymentStyle.pulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                    }}>
                      <DollarSign size={14} color={paymentStyle.text} />
                      <span style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '12px',
                        fontWeight: paymentStyle.bold ? 700 : 600,
                        color: paymentStyle.text
                      }}>
                        {order.paymentStatus === 'pending_deposit' ? 'Pending Deposit' : 
                         order.paymentStatus === 'partial' ? 'Partial Payment' : 
                         'Paid in Full'}
                      </span>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '12px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '2px'
                      }}>
                        <span style={{ 
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#6B7280',
                          fontWeight: 500
                        }}>
                          Total:
                        </span>
                        <span style={{ 
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#2B2B2B',
                          fontWeight: 600
                        }}>
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '2px'
                      }}>
                        <span style={{ 
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#6B7280',
                          fontWeight: 500
                        }}>
                          Paid:
                        </span>
                        <span style={{ 
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#2B2B2B',
                          fontWeight: 600
                        }}>
                          ${order.paidAmount.toFixed(2)}
                        </span>
                      </div>
                      {order.balanceDue > 0 && (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between'
                        }}>
                          <span style={{ 
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#6B7280',
                            fontWeight: 500
                          }}>
                            Balance:
                          </span>
                          <span style={{ 
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#EF4444',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}>
                            ${order.balanceDue.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'flex-start',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #E5E7EB'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrder(order.id);
                    }}
                    style={{
                      height: '32px',
                      padding: '6px 12px',
                      background: '#F3F4F6',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
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
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(order.id);
                    }}
                    style={{
                      height: '32px',
                      padding: '6px 12px',
                      background: 'rgba(196, 69, 105, 0.08)',
                      border: '1px solid rgba(196, 69, 105, 0.3)',
                      borderRadius: '6px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#C44569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
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
                    Update Status
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkPickedUp(order.id);
                    }}
                    style={{
                      height: '32px',
                      padding: '6px 12px',
                      background: '#D4EDDA',
                      border: '1px solid #10B981',
                      borderRadius: '6px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#065F46',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
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
                    <CheckCircle size={14} />
                    Picked Up
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
