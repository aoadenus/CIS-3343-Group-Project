import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Cake, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Package,
  User,
  ShoppingCart,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SkeletonCard } from '../components/Loading/SkeletonCard';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useToast } from '../components/ToastContext';
import { motion } from 'motion/react';

// Sparkline data for KPIs
const todaySparkline = [
  { value: 8 }, { value: 12 }, { value: 10 }, { value: 15 }, { value: 13 }, { value: 18 }, { value: 22 }
];
const progressSparkline = [
  { value: 12 }, { value: 10 }, { value: 8 }, { value: 9 }, { value: 11 }, { value: 10 }, { value: 8 }
];
const pickupSparkline = [
  { value: 5 }, { value: 7 }, { value: 9 }, { value: 8 }, { value: 10 }, { value: 11 }, { value: 12 }
];
const revenueSparkline = [
  { value: 4200 }, { value: 4800 }, { value: 4500 }, { value: 5200 }, { value: 5600 }, { value: 5300 }, { value: 6400 }
];

// Kanban order data
interface Order {
  id: string;
  customer: string;
  cake: string;
  pickup: string;
  priority: 'high' | 'medium' | 'low';
  value: number;
}

const initialOrders: Record<string, Order[]> = {
  new: [
    { id: '#248', customer: 'Sarah Johnson', cake: 'Birthday Celebration', pickup: 'Nov 5', priority: 'high', value: 120 },
    { id: '#249', customer: 'Robert Smith', cake: 'Anniversary Tier', pickup: 'Nov 6', priority: 'medium', value: 200 }
  ],
  inProgress: [
    { id: '#246', customer: 'Emily Rodriguez', cake: 'Strawberry Delight', pickup: 'Nov 4', priority: 'high', value: 95 },
    { id: '#245', customer: 'David Kim', cake: 'Lemon Doberge', pickup: 'Nov 5', priority: 'medium', value: 85 }
  ],
  decorating: [
    { id: '#244', customer: 'Lisa Martinez', cake: 'German Chocolate', pickup: 'Nov 4', priority: 'high', value: 110 }
  ],
  ready: [
    { id: '#247', customer: 'Michael Chen', cake: 'Wedding Cake Tier', pickup: 'Nov 3', priority: 'medium', value: 350 },
    { id: '#243', customer: 'Anna Thompson', cake: 'Red Velvet', pickup: 'Nov 3', priority: 'low', value: 75 }
  ]
};

// Activity feed data
const activityFeed = [
  { 
    id: 1, 
    action: 'New order received', 
    details: 'Order #248 from Sarah Johnson',
    timestamp: new Date(Date.now() - 5 * 60000),
    icon: ShoppingCart,
    color: '#C44569'
  },
  { 
    id: 2, 
    action: 'Order completed', 
    details: 'Order #247 ready for pickup',
    timestamp: new Date(Date.now() - 15 * 60000),
    icon: CheckCircle,
    color: '#5A3825'
  },
  { 
    id: 3, 
    action: 'Customer added', 
    details: 'Robert Smith registered',
    timestamp: new Date(Date.now() - 32 * 60000),
    icon: User,
    color: '#2B2B2B'
  },
  { 
    id: 4, 
    action: 'Order updated', 
    details: 'Order #246 moved to decorating',
    timestamp: new Date(Date.now() - 48 * 60000),
    icon: Edit,
    color: '#C44569'
  },
  { 
    id: 5, 
    action: 'Payment received', 
    details: '$350 from Michael Chen',
    timestamp: new Date(Date.now() - 72 * 60000),
    icon: DollarSign,
    color: '#5A3825'
  },
  { 
    id: 6, 
    action: 'Reminder sent', 
    details: 'Pickup reminder to Anna Thompson',
    timestamp: new Date(Date.now() - 95 * 60000),
    icon: Clock,
    color: '#2B2B2B'
  }
];

// Format timestamp helper
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

// Drag and Drop Types
const ItemTypes = {
  ORDER: 'order'
};

interface DraggableOrderProps {
  order: Order;
  columnId: string;
}

function DraggableOrder({ order, columnId }: DraggableOrderProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ORDER,
    item: { order, fromColumn: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const priorityColors = {
    high: '#C44569',
    medium: '#5A3825',
    low: '#2B2B2B'
  };

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '24px', // Updated to match design system standard
        background: 'white',
        borderRadius: '12px', // Updated to match design system
        marginBottom: '12px',
        border: '1px solid rgba(90, 56, 37, 0.15)',
        boxShadow: '0 2px 4px rgba(90, 56, 37, 0.08)',
        transition: 'all 300ms ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(90, 56, 37, 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(90, 56, 37, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span style={{ 
          fontFamily: 'Poppins', 
          fontWeight: 600, 
          fontSize: '14px', 
          color: '#2B2B2B' 
        }}>
          {order.id}
        </span>
        <Badge 
          style={{ 
            backgroundColor: `${priorityColors[order.priority]}20`,
            color: priorityColors[order.priority],
            border: `1px solid ${priorityColors[order.priority]}40`,
            fontSize: '10px',
            textTransform: 'uppercase',
            padding: '2px 8px'
          }}
        >
          {order.priority}
        </Badge>
      </div>
      <p style={{ 
        fontFamily: 'Poppins', 
        fontWeight: 500, 
        fontSize: '15px', 
        color: '#2B2B2B',
        marginBottom: '8px'
      }}>
        {order.cake}
      </p>
      <div className="flex items-center justify-between" style={{ fontSize: '13px' }}>
        <span style={{ fontFamily: 'Open Sans', color: '#5A3825', opacity: 0.8 }}>
          {order.customer}
        </span>
        <span style={{ 
          fontFamily: 'Poppins', 
          fontWeight: 600, 
          color: '#C44569',
          fontSize: '14px'
        }}>
          ${order.value}
        </span>
      </div>
      <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(90, 56, 37, 0.1)' }}>
        <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>
          <Calendar size={12} />
          <span style={{ fontFamily: 'Open Sans' }}>Pickup: {order.pickup}</span>
        </div>
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  columnId: string;
  title: string;
  orders: Order[];
  onDrop: (order: Order, fromColumn: string, toColumn: string) => void;
  color: string;
}

function DroppableColumn({ columnId, title, orders, onDrop, color }: DroppableColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ORDER,
    drop: (item: { order: Order; fromColumn: string }) => {
      if (item.fromColumn !== columnId) {
        onDrop(item.order, item.fromColumn, columnId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div
      ref={drop}
      className={isOver ? 'kanban-column-hover drag-over' : 'kanban-column-hover'}
      style={{
        background: isOver ? 'rgba(196, 69, 105, 0.08)' : '#F8EBD7',
        borderRadius: '12px',
        padding: '16px',
        minHeight: '400px',
        border: isOver ? '2px dashed #C44569' : '2px solid transparent',
        transition: 'all 300ms ease',
        boxShadow: isOver ? '0 4px 16px rgba(196, 69, 105, 0.2)' : 'none'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 style={{ 
          fontFamily: 'Poppins', 
          fontWeight: 600, 
          fontSize: '16px', 
          color: '#2B2B2B'
        }}>
          {title}
        </h4>
        <Badge style={{ 
          backgroundColor: color,
          color: 'white',
          fontSize: '12px',
          padding: '4px 10px'
        }}>
          {orders.length}
        </Badge>
      </div>
      <div>
        {orders.map((order) => (
          <DraggableOrder key={order.id} order={order} columnId={columnId} />
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [newOrdersCount, setNewOrdersCount] = useState(22);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate totals
  const ordersInProgress = orders.inProgress.length + orders.decorating.length;
  const ordersReady = orders.ready.length;
  const weekRevenue = 6400;

  const handleDrop = (order: Order, fromColumn: string, toColumn: string) => {
    setOrders((prev) => {
      const newOrders = { ...prev };
      newOrders[fromColumn] = prev[fromColumn].filter((o) => o.id !== order.id);
      newOrders[toColumn] = [...prev[toColumn], order];
      return newOrders;
    });

    showToast('success', `${order.id} moved to ${toColumn.replace(/([A-Z])/g, ' $1').trim()}`, 2000);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="tagline" style={{ marginTop: '8px' }}>
          Real-time operational intelligence
        </p>
      </div>

      {/* KPI Cards - Top Row with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard variant="admin" type="kpi" />
            <SkeletonCard variant="admin" type="kpi" />
            <SkeletonCard variant="admin" type="kpi" />
            <SkeletonCard variant="admin" type="kpi" />
          </>
        ) : (
          <>
        {/* Today's Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fade-in-content"
        >
          <Card 
            className="admin-widget-active"
            style={{ 
              padding: '24px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #E0E0E0',
              transition: 'all 200ms ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.classList.add('is-focused');
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(196, 69, 105, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.remove('is-focused');
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = '#E0E0E0';
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p style={{ 
                  fontFamily: 'Open Sans', 
                  fontSize: '13px', 
                  color: '#5A3825', 
                  opacity: 0.8,
                  marginBottom: '8px'
                }}>
                  Today's Orders
                </p>
                <div className="flex items-baseline gap-3">
                  <motion.p 
                    key={newOrdersCount}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 700, 
                      fontSize: '36px', 
                      color: '#2B2B2B',
                      lineHeight: 1
                    }}
                  >
                    {newOrdersCount}
                  </motion.p>
                  <div className="flex items-center gap-1" style={{ color: '#22c55e' }}>
                    <TrendingUp size={16} />
                    <span style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '14px' 
                    }}>
                      ↑3
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ 
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(196, 69, 105, 0.1)'
              }}>
                <Cake size={24} color="#C44569" />
              </div>
            </div>
            {/* Sparkline */}
            <div style={{ height: '40px', marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={todaySparkline}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#C44569" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Orders in Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card 
            className="admin-widget-active"
            style={{ 
              padding: '24px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #E0E0E0',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.classList.add('is-focused');
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(196, 69, 105, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(196, 69, 105, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.remove('is-focused');
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = '#E0E0E0';
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p style={{ 
                  fontFamily: 'Open Sans', 
                  fontSize: '13px', 
                  color: '#5A3825', 
                  opacity: 0.8,
                  marginBottom: '8px'
                }}>
                  Orders in Progress
                </p>
                <div className="flex items-baseline gap-3">
                  <p style={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 700, 
                    fontSize: '36px', 
                    color: '#2B2B2B',
                    lineHeight: 1
                  }}>
                    {ordersInProgress}
                  </p>
                  <div className="flex items-center gap-1" style={{ color: '#ef4444' }}>
                    <TrendingDown size={16} />
                    <span style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '14px' 
                    }}>
                      ↓2
                    </span>
                  </div>
                </div>
              </div>
              <motion.div 
                style={{ 
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(90, 56, 37, 0.1)'
                }}
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Clock size={24} color="#5A3825" />
              </motion.div>
            </div>
            <div style={{ height: '40px', marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressSparkline}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#5A3825" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Ready for Pickup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card style={{ 
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(90, 56, 37, 0.12)',
            border: '1px solid rgba(90, 56, 37, 0.08)',
            transition: 'all 300ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(90, 56, 37, 0.18)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(90, 56, 37, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p style={{ 
                  fontFamily: 'Open Sans', 
                  fontSize: '13px', 
                  color: '#5A3825', 
                  opacity: 0.8,
                  marginBottom: '8px'
                }}>
                  Ready for Pickup
                </p>
                <div className="flex items-baseline gap-3">
                  <p style={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 700, 
                    fontSize: '36px', 
                    color: '#2B2B2B',
                    lineHeight: 1
                  }}>
                    {ordersReady}
                  </p>
                  <div className="flex items-center gap-1" style={{ color: '#22c55e' }}>
                    <TrendingUp size={16} />
                    <span style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '14px' 
                    }}>
                      ↑1
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ 
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(43, 43, 43, 0.08)'
              }}>
                <CheckCircle size={24} color="#2B2B2B" />
              </div>
            </div>
            <div style={{ height: '40px', marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pickupSparkline}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2B2B2B" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* This Week's Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card style={{ 
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(90, 56, 37, 0.12)',
            border: '1px solid rgba(90, 56, 37, 0.08)',
            transition: 'all 300ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(90, 56, 37, 0.18)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(90, 56, 37, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p style={{ 
                  fontFamily: 'Open Sans', 
                  fontSize: '13px', 
                  color: '#5A3825', 
                  opacity: 0.8,
                  marginBottom: '8px'
                }}>
                  This Week's Revenue
                </p>
                <div className="flex items-baseline gap-3">
                  <p style={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 700, 
                    fontSize: '36px', 
                    color: '#2B2B2B',
                    lineHeight: 1
                  }}>
                    ${(weekRevenue / 1000).toFixed(1)}k
                  </p>
                  <div className="flex items-center gap-1" style={{ color: '#22c55e' }}>
                    <TrendingUp size={16} />
                    <span style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '14px' 
                    }}>
                      ↑12%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ 
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)'
              }}>
                <DollarSign size={24} color="#22c55e" />
              </div>
            </div>
            <div style={{ height: '40px', marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueSparkline}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
          </>
        )}
      </div>

      {/* Kanban Board */}
      <DndProvider backend={HTML5Backend}>
        {isLoading ? (
          <SkeletonCard variant="admin" type="table" />
        ) : (
          <Card style={{ 
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(90, 56, 37, 0.12)',
            border: '1px solid rgba(90, 56, 37, 0.08)'
          }}>
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ 
                fontFamily: 'Poppins', 
                fontWeight: 600, 
                fontSize: '20px', 
                color: '#2B2B2B' 
              }}>
                Order Pipeline
              </h3>
              <Badge style={{ 
                backgroundColor: 'rgba(196, 69, 105, 0.1)',
                color: '#C44569',
                border: '1px solid rgba(196, 69, 105, 0.3)',
                fontSize: '12px',
                padding: '6px 12px'
              }}>
                Drag & Drop to Update
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DroppableColumn
                columnId="new"
                title="New Orders"
                orders={orders.new}
                onDrop={handleDrop}
                color="#C44569"
              />
              <DroppableColumn
                columnId="inProgress"
                title="In Progress"
                orders={orders.inProgress}
                onDrop={handleDrop}
                color="#5A3825"
              />
              <DroppableColumn
                columnId="decorating"
                title="Decorating"
                orders={orders.decorating}
                onDrop={handleDrop}
                color="#2B2B2B"
              />
              <DroppableColumn
                columnId="ready"
                title="Ready"
                orders={orders.ready}
                onDrop={handleDrop}
                color="#22c55e"
              />
            </div>
          </Card>
        )}
      </DndProvider>

      {/* Activity Feed */}
      <Card style={{ 
        padding: '24px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(90, 56, 37, 0.12)',
        border: '1px solid rgba(90, 56, 37, 0.08)'
      }}>
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ 
            fontFamily: 'Poppins', 
            fontWeight: 600, 
            fontSize: '20px', 
            color: '#2B2B2B' 
          }}>
            Recent Activity
          </h3>
          <button style={{
            fontFamily: 'Open Sans',
            fontSize: '13px',
            color: '#C44569',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}>
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {activityFeed.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-start gap-4 pb-4"
              style={{ 
                borderBottom: index < activityFeed.length - 1 ? '1px solid rgba(90, 56, 37, 0.1)' : 'none'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: `${activity.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <activity.icon 
                  size={24} 
                  color={activity.color} 
                  strokeWidth={1.5} 
                  className="icon-scale"
                  aria-label={activity.action}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p style={{
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#2B2B2B',
                  marginBottom: '4px'
                }}>
                  {activity.action}
                </p>
                <p style={{
                  fontFamily: 'Open Sans',
                  fontSize: '13px',
                  color: '#5A3825',
                  opacity: 0.8,
                  marginBottom: '6px'
                }}>
                  {activity.details}
                </p>
                <p style={{
                  fontFamily: 'Open Sans',
                  fontSize: '12px',
                  color: '#2B2B2B',
                  opacity: 0.7
                }}>
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
