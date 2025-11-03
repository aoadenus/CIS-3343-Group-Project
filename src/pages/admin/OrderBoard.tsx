import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'motion/react';
import { Clock, User, Package, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

// Database Order interface (matches API response from getAllOrdersWithCustomers)
interface Order {
  id: number;
  customerId: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  orderType: string;
  occasion: string;
  flavor: string | null;
  design: string;
  servings: number | null;
  eventDate: string | null;
  message: string | null;
  additionalNotes: string | null;
  inspirationImages: string | null;
  layers: string | null; // JSON string of CakeLayer[]
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const ItemType = 'ORDER';

interface DragItem {
  id: number;
  status: Order['status'];
}

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: order.id, status: order.status } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const priorityColors = {
    low: '#28A745',
    medium: '#FFC107',
    high: '#DC3545'
  };

  return (
    <motion.div
      ref={drag as any}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3"
    >
      <Card 
        style={{ 
          background: 'white', 
          border: 'none',
          boxShadow: '0 2px 8px rgba(90, 56, 37, 0.1)',
          borderLeft: `4px solid ${priorityColors[order.priority]}`
        }}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 600, color: '#2B2B2B', marginBottom: '4px' }}>
                {order.occasion}
                {order.layers ? ` - ${JSON.parse(order.layers).length} Layer${JSON.parse(order.layers).length > 1 ? 's' : ''}` : ` - ${order.flavor}`}
              </h4>
              <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#5A3825' }}>
                Order #{order.id}
              </p>
            </div>
            <span 
              className="px-2 py-1 rounded text-xs font-semibold uppercase"
              style={{ 
                background: `${priorityColors[order.priority]}20`,
                color: priorityColors[order.priority]
              }}
            >
              {order.priority}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" style={{ color: '#5A3825' }} />
              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#2B2B2B' }}>
                {order.customerName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" style={{ color: '#5A3825' }} />
              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#2B2B2B' }}>
                {order.design} • {order.servings ? `${order.servings} servings` : 'Custom size'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#5A3825' }} />
              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#2B2B2B' }}>
                {order.eventDate ? new Date(order.eventDate).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {(order.message || order.additionalNotes) && (
            <div 
              className="p-2 rounded mb-3"
              style={{ background: '#FFF3CD', border: '1px solid #FFC107' }}
            >
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#856404' }} />
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#856404' }}>
                  {order.message || order.additionalNotes}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert(`Edit order ${order.id}`);
              }}
              style={{
                flex: 1,
                padding: '8px',
                background: '#F8EBD7',
                color: '#2B2B2B',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert(`View history for ${order.id}`);
              }}
              style={{
                flex: 1,
                padding: '8px',
                background: '#C44569',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              History
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface DropZoneProps {
  status: Order['status'];
  title: string;
  icon: any;
  orders: Order[];
  moveOrder: (orderId: number, newStatus: Order['status']) => void;
}

function DropZone({ status, title, icon: Icon, orders, moveOrder }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: DragItem) => {
      if (item.status !== status) {
        moveOrder(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div className="flex flex-col h-full">
      <div 
        className="mb-3 p-3 rounded-lg flex-shrink-0"
        style={{ background: 'white', boxShadow: '0 2px 8px rgba(90, 56, 37, 0.1)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" style={{ color: '#C44569' }} />
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: 600, color: '#2B2B2B' }}>
              {title}
            </h3>
          </div>
          <span 
            className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#C4456920', color: '#C44569' }}
          >
            {orders.length}
          </span>
        </div>
      </div>

      <div 
        ref={drop as any}
        className="flex-1 overflow-auto p-3 rounded-lg transition-colors"
        style={{ 
          background: isOver ? '#C4456920' : '#FFFFFF50',
          border: isOver ? '2px dashed #C44569' : '2px dashed transparent'
        }}
      >
        {orders.map(order => (
          <OrderCard 
            key={order.id} 
            order={order}
          />
        ))}
        {orders.length === 0 && (
          <div 
            className="text-center p-6"
            style={{ opacity: 0.5 }}
          >
            <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#5A3825' }}>
              Drop orders here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderBoard() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders from API on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const columns: { id: Order['status']; title: string; icon: any }[] = [
    { id: 'pending', title: 'Pending', icon: Clock },
    { id: 'preparing', title: 'Preparing', icon: Package },
    { id: 'ready', title: 'Ready', icon: Check },
    { id: 'completed', title: 'Completed', icon: Check }
  ];

  const moveOrder = async (orderId: number, newStatus: Order['status']) => {
    // Optimistically update UI
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

    // Update in database
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Revert optimistic update on error
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    }
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col overflow-hidden" style={{ background: '#F8EBD7' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex-shrink-0"
        >
          <h1 
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(22px, 4vw, 32px)',
              fontWeight: 700,
              color: '#2B2B2B',
              marginBottom: '8px'
            }}
          >
            Order Management Board
          </h1>
          <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#5A3825', fontSize: '14px' }}>
            Drag and drop orders to update their status
          </p>
        </motion.div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {columns.map((column) => (
              <DropZone
                key={column.id}
                status={column.id}
                title={column.title}
                icon={column.icon}
                orders={getOrdersByStatus(column.id)}
                moveOrder={moveOrder}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
