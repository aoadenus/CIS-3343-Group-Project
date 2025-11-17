import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Users, Clock, Package, DollarSign, Zap, ListOrdered, Target } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/KPICard';
import { OrderQueueCard } from '../../../components/dashboard/OrderQueueCard';
import { QuickActionCard } from '../../../components/dashboard/QuickActionCard';
import { PickupSearchSection } from '../../../components/dashboard/PickupSearchSection';
import { SectionHeader } from '../../../components/dashboard/SectionHeader';
import { BakeryPattern } from '../../../components/dashboard/BakeryPattern';

interface SalesDashboardProps {
  onNavigate?: (page: string) => void;
}

export function SalesDashboard({ onNavigate }: SalesDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today_paid' | 'partial_deposit' | 'ready_pickup' | 'overdue'>('all');
  const [recentLimit, setRecentLimit] = useState(5);

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Primary orders list
        const ordersRes = await fetch('/api/orders?status=all&role=sales', { signal: abort.signal, headers });
        if (!ordersRes.ok) throw new Error('Failed to load orders');
        const ordersData = await ordersRes.json();

        // optional stats endpoints (best-effort)
        const [statsTodayRes, overdueRes, pickupsTodayRes] = await Promise.all([
          fetch('/api/orders/stats/today', { signal: abort.signal, headers }).catch(() => null),
          fetch('/api/orders/overdue', { signal: abort.signal, headers }).catch(() => null),
          fetch('/api/orders/pickups-today', { signal: abort.signal, headers }).catch(() => null)
        ]);

        const statsToday = statsTodayRes && statsTodayRes.ok ? await statsTodayRes.json() : null;
        const overdueData = overdueRes && overdueRes.ok ? await overdueRes.json() : null;
        const pickupsToday = pickupsTodayRes && pickupsTodayRes.ok ? await pickupsTodayRes.json() : null;

        // Prefer server-provided lists when available, otherwise derive from ordersData
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        // We could store stats separately if needed, but KPIs will be derived below
      } catch (err: any) {
        console.error('Failed to fetch orders:', err);
        setError(err?.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => abort.abort();
  }, []);

  // Calculate KPIs
  const today = useMemo(() => new Date().toDateString(), []);

  const todayPickups = orders.filter(o =>
    o.pickupDate && new Date(o.pickupDate).toDateString() === today && o.status === 'ready'
  );

  const pendingDeposits = orders.filter(o => o.paymentStatus === 'partial_deposit');

  const readyForPickup = orders.filter(o => o.status === 'ready' && o.pickupDate && new Date(o.pickupDate).toDateString() === today);

  const overdueOrders = orders.filter(o => o.pickupDate && new Date(o.pickupDate) < new Date() && o.status !== 'completed');

  const todaysRevenue = orders
    .filter(o => o.paymentStatus === 'paid_in_full' && o.createdAt && new Date(o.createdAt).toDateString() === today)
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Recent orders with pagination
  const sortedOrders = orders.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentOrders = sortedOrders.slice(0, recentLimit).map(o => ({
    id: o.id,
    customerName: (o.customer && (o.customer.name || `${o.customer.firstName} ${o.customer.lastName}`)) || o.customerName || 'Unknown',
    occasion: o.occasion || (o.cakeType === 'standard' ? `${o.standardCakeName || 'Standard Cake'}` : 'Custom Order'),
    eventDate: o.pickupDate || o.eventDate,
    status: o.status,
    priority: o.priority || computePriority(o)
  }));

  function computePriority(o: any) {
    if (!o.pickupDate) return 'low';
    const hours = (new Date(o.pickupDate).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hours < 0) return 'overdue';
    if (hours < 6) return 'high';
    if (hours < 24) return 'urgent';
    if (hours < 48) return 'warning';
    return 'normal';
  }

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

  if (error) {
    return (
      <div className="h-full flex items-center justify-center flex-col" style={{ background: '#F8EBD7' }}>
        <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#B00020', marginBottom: 12 }}>Unable to load orders</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded"
          style={{ background: '#C44569', color: 'white' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto" style={{ background: '#F8EBD7', padding: 'clamp(20px, 4vw, 40px)', position: 'relative' }}>
      {/* Bakery Pattern Overlay */}
      <BakeryPattern />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
        style={{ position: 'relative', zIndex: 2 }}
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
          title="Today's Revenue"
          value={`$${(todaysRevenue / 100).toFixed(2)}`}
          icon={DollarSign}
          color="#C44569"
          index={0}
          onClick={() => setFilter('today_paid')}
        />
        <KPICard
          title="Pending Deposits"
          value={pendingDeposits.length}
          icon={Package}
          color="#F59E0B"
          index={1}
          onClick={() => setFilter('partial_deposit')}
        />
        <KPICard
          title="Ready for Pickup"
          value={readyForPickup.length}
          icon={Clock}
          color="#10B981"
          index={2}
          onClick={() => setFilter('ready_pickup')}
        />
        <KPICard
          title="Overdue Orders"
          value={overdueOrders.length}
          icon={Target}
          color="#5A3825"
          index={3}
          onClick={() => setFilter('overdue')}
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
          <SectionHeader 
            icon={Zap} 
            title="Quick Actions" 
            count={quickActions.length}
          />
          <QuickActionCard title="Quick Actions" actions={quickActions} />
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <SectionHeader 
            icon={ListOrdered} 
            title="Recent Orders" 
            count={recentOrders.length}
          />
          <OrderQueueCard
            title={filter === 'all' ? 'Recent Orders' : filter === 'today_paid' ? "Today's Paid Orders" : filter === 'partial_deposit' ? 'Pending Deposits' : filter === 'ready_pickup' ? 'Ready for Pickup' : 'Overdue Orders'}
            orders={recentOrders}
            emptyMessage="No recent orders"
            onOrderClick={() => onNavigate?.('order-management')}
          />
          {sortedOrders.length > recentLimit && (
            <div className="mt-3 text-center">
              <button
                onClick={() => setRecentLimit((p) => p + 5)}
                className="px-4 py-2 rounded"
                style={{ background: '#C44569', color: 'white' }}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Today's Pickups */}
      {todayPickups.length > 0 && (
        <div className="mt-6" id="todays-pickups">
          <SectionHeader 
            icon={Target} 
            title="Today's Pickups - Priority" 
            count={todayPickups.length}
          />
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
