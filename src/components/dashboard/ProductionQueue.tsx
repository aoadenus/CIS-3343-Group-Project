import React, { useState } from 'react';
import { Clock, ChefHat, AlertCircle, CheckCircle, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';

interface ProductionOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  productName: string;
  sizeDescription: string;
  eventDate: string;
  eventTime: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  startTime?: string;
  estimatedCompletionTime?: string;
  hoursRemaining?: number;
  notes?: string;
}

interface ProductionQueueProps {
  orders: ProductionOrder[];
  role: 'baker' | 'decorator';
  onStartOrder: (orderId: number) => void;
  onCompleteOrder: (orderId: number) => void;
  loading?: boolean;
}

export function ProductionQueue({ 
  orders, 
  role, 
  onStartOrder, 
  onCompleteOrder,
  loading = false 
}: ProductionQueueProps) {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const roleTitle = role === 'baker' ? 'Baking Queue' : 'Decoration Queue';
  const roleIcon = role === 'baker' ? ChefHat : '🎨';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FFF3CD', text: '#856404', border: '#FFEAA7' };
      case 'in_progress': return { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' };
      case 'completed': return { bg: '#D4EDDA', text: '#155724', border: '#C3E6CB' };
      case 'overdue': return { bg: '#F8D7DA', text: '#721C24', border: '#F5C6CB' };
      default: return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ 
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          height: '400px',
          backgroundColor: '#F3F4F6',
          borderRadius: '12px'
        }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.15) 0%, rgba(196, 69, 105, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {typeof roleIcon === 'string' ? (
              <span style={{ fontSize: '24px' }}>{roleIcon}</span>
            ) : (
              <ChefHat size={24} color="#C44569" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#2B2B2B',
              margin: 0,
              lineHeight: 1.2
            }}>
              {roleTitle}
            </h2>
            <p style={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              color: '#6B7280',
              margin: '4px 0 0 0'
            }}>
              {orders.length} orders in your queue
            </p>
          </div>
        </div>
      </div>

      {/* Queue Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Clock size={16} color="#F59E0B" />
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              textTransform: 'uppercase'
            }}>
              Pending
            </span>
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '32px',
            fontWeight: 700,
            color: '#2B2B2B'
          }}>
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Play size={16} color="#3B82F6" />
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              textTransform: 'uppercase'
            }}>
              In Progress
            </span>
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '32px',
            fontWeight: 700,
            color: '#2B2B2B'
          }}>
            {orders.filter(o => o.status === 'in_progress').length}
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <AlertCircle size={16} color="#EF4444" />
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              textTransform: 'uppercase'
            }}>
              Overdue
            </span>
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '32px',
            fontWeight: 700,
            color: '#EF4444'
          }}>
            {orders.filter(o => o.status === 'overdue').length}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: '#FAFBFC',
          border: '2px dashed #E5E7EB',
          borderRadius: '12px'
        }}>
          <CheckCircle size={48} color="#10B981" style={{ opacity: 0.5, marginBottom: '16px' }} />
          <h4 style={{ 
            fontFamily: "'Poppins', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: '#2B2B2B',
            margin: '0 0 8px 0'
          }}>
            All caught up! 🎉
          </h4>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            No orders in your queue right now
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const statusStyle = getStatusColor(order.status);
            const priorityColor = getPriorityColor(order.priority);

            return (
              <div
                key={order.id}
                style={{
                  position: 'relative',
                  background: '#FFFFFF',
                  border: selectedOrder === order.id ? '2px solid #C44569' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '20px',
                  paddingLeft: '24px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedOrder(order.id)}
                onMouseEnter={(e) => {
                  if (selectedOrder !== order.id) {
                    e.currentTarget.style.borderColor = 'rgba(196, 69, 105, 0.3)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOrder !== order.id) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }
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

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  {/* Left Section */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <h3 style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#2B2B2B',
                        margin: 0
                      }}>
                        {order.customerName}
                      </h3>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`
                      }}>
                        {order.status.replace('_', ' ')}
                      </span>
                      {order.priority === 'high' && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          border: '2px solid #EF4444'
                        }}>
                          🔥 RUSH
                        </span>
                      )}
                    </div>

                    <div style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '14px',
                      color: '#5A3825',
                      marginBottom: '12px'
                    }}>
                      <strong>{order.productName}</strong> • {order.sizeDescription}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#6B7280',
                          textTransform: 'uppercase',
                          marginBottom: '4px'
                        }}>
                          Event Date
                        </div>
                        <div style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#2B2B2B'
                        }}>
                          {order.eventDate} at {order.eventTime}
                        </div>
                      </div>

                      {order.estimatedCompletionTime && (
                        <div>
                          <div style={{
                            fontFamily: "'Open Sans', sans-serif",
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            marginBottom: '4px'
                          }}>
                            Est. Completion
                          </div>
                          <div style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#2B2B2B'
                          }}>
                            {order.estimatedCompletionTime}
                          </div>
                        </div>
                      )}
                    </div>

                    {order.notes && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: '#F8EBD7',
                        borderRadius: '8px',
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '13px',
                        color: '#5A3825'
                      }}>
                        <strong>Notes:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                    {order.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartOrder(order.id);
                        }}
                        style={{
                          height: '40px',
                          padding: '0 20px',
                          background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.03)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 69, 105, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Play size={16} />
                        Start {role === 'baker' ? 'Baking' : 'Decorating'}
                      </button>
                    )}

                    {order.status === 'in_progress' && (
                      <>
                        {order.hoursRemaining !== undefined && (
                          <div style={{
                            padding: '8px 12px',
                            background: order.hoursRemaining < 2 ? '#FEE2E2' : '#DBEAFE',
                            border: `1px solid ${order.hoursRemaining < 2 ? '#EF4444' : '#3B82F6'}`,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <Clock size={14} color={order.hoursRemaining < 2 ? '#991B1B' : '#1E40AF'} />
                            <span style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '12px',
                              fontWeight: 600,
                              color: order.hoursRemaining < 2 ? '#991B1B' : '#1E40AF'
                            }}>
                              {order.hoursRemaining}h remaining
                            </span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompleteOrder(order.id);
                          }}
                          style={{
                            height: '40px',
                            padding: '0 20px',
                            background: '#10B981',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <CheckCircle size={16} />
                          Mark Complete
                        </button>
                      </>
                    )}

                    {order.status === 'overdue' && (
                      <div style={{
                        padding: '12px',
                        background: '#FEE2E2',
                        border: '2px solid #EF4444',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <AlertCircle size={20} color="#991B1B" style={{ marginBottom: '4px' }} />
                        <div style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#991B1B'
                        }}>
                          OVERDUE
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
