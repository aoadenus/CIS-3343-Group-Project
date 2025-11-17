import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Users, Clock, Package, DollarSign } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/KPICard';
import { OrderQueueCard } from '../../../components/dashboard/OrderQueueCard';
import { QuickActionCard } from '../../../components/dashboard/QuickActionCard';
import { PickupSearchSection } from '../../../components/dashboard/PickupSearchSection';

interface SalesDashboardProps {
  onNavigate?: (page: string) => void;
}

export function SalesDashboard({ onNavigate }: SalesDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const today = new Date().toDateString();
  const todayPickups = orders.filter(o => 
    o.eventDate && new Date(o.eventDate).toDateString() === today && o.status === 'ready'
  );
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const thisWeekOrders = orders.filter(o => {
    const created = new Date(o.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  });

  // Recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(o => ({
      id: o.id,
      customerName: o.customerName || 'Unknown',
      occasion: o.occasion || 'Custom Order',
      eventDate: o.eventDate,
      status: o.status,
      priority: o.priority || 'medium'
    }));

  const quickActions = [
    {
      label: 'Create New Order',
      icon: Plus,
      color: '#C44569',
      onClick: () => onNavigate?.('order-create')
    },
    {
      label: 'View All Orders',
      icon: Package,
      color: '#5A3825',
      onClick: () => onNavigate?.('order-management')
    },
    {
      label: 'Manage Customers',
      icon: Users,
      color: '#C44569',
      onClick: () => onNavigate?.('customer-accounts')
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: '#F8EBD7' }}>
        <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#5A3825' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto" style={{ background: '#F8EBD7', padding: 'clamp(20px, 4vw, 40px)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: 700,
          color: '#2B2B2B',
          marginBottom: '8px'
        }}>
          Sales Dashboard
        </h1>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#5A3825' }}>
          Manage orders and customer relationships
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Today's Pickups"
          value={todayPickups.length}
          icon={Clock}
          color="#C44569"
          index={0}
          onClick={() => {
            const pickupsSection = document.getElementById('todays-pickups');
            pickupsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
        <KPICard
          title="Pending Orders"
          value={pendingOrders.length}
          icon={Package}
          color="#F59E0B"
          index={1}
          onClick={() => onNavigate?.('order-management')}
        />
        <KPICard
          title="This Week"
          value={thisWeekOrders.length}
          change="+12%"
          icon={DollarSign}
          color="#10B981"
          index={2}
          onClick={() => onNavigate?.('order-management')}
        />
        <KPICard
          title="Total Orders"
          value={orders.length}
          icon={Package}
          color="#5A3825"
          index={3}
          onClick={() => onNavigate?.('order-management')}
        />
      </div>

      {/* Order Pickup Search */}
      <PickupSearchSection 
        orders={orders}
        onOrderClick={() => onNavigate?.('order-management')}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActionCard title="Quick Actions" actions={quickActions} />
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <OrderQueueCard
            title="Recent Orders"
            orders={recentOrders}
            emptyMessage="No recent orders"
            onOrderClick={() => onNavigate?.('order-management')}
          />
        </div>
      </div>

      {/* Today's Pickups */}
      {todayPickups.length > 0 && (
        <div className="mt-6" id="todays-pickups">
          <OrderQueueCard
            title="🎯 Today's Pickups - Priority"
            orders={todayPickups.slice(0, 5).map(o => ({
              id: o.id,
              customerName: o.customerName || 'Unknown',
              occasion: o.occasion || 'Custom Order',
              eventDate: o.eventDate,
              status: o.status,
              priority: 'high'
            }))}
            emptyMessage="No pickups today"
            onOrderClick={() => onNavigate?.('order-management')}
          />
        </div>
      )}
    </div>
  );
}
