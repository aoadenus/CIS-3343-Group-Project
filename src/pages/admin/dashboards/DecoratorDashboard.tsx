import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, Users, Package, Palette } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/KPICard';
import { OrderQueueCard } from '../../../components/dashboard/OrderQueueCard';
import { QuickActionCard } from '../../../components/dashboard/QuickActionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface DecoratorDashboardProps {
  onNavigate?: (page: string) => void;
}

export function DecoratorDashboard({ onNavigate }: DecoratorDashboardProps) {
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

  // Decorator-specific: orders ready for decorating
  const decoratingQueue = orders
    .filter(o => ['ready', 'decorating'].includes(o.status?.toLowerCase() || ''))
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      return ((priorityOrder as any)[b.priority] || 0) - ((priorityOrder as any)[a.priority] || 0);
    })
    .slice(0, 10)
    .map(o => ({
      id: o.id,
      customerName: o.customerName || 'Unknown',
      occasion: o.occasion || 'Custom Order',
      eventDate: o.eventDate,
      status: o.status || 'ready',
      priority: o.priority || 'medium'
    }));

  // Sales view: recent orders
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

  const decoratingActions = [
    {
      label: 'View All Orders',
      icon: Package,
      color: '#5A3825',
      onClick: () => onNavigate?.('order-management')
    },
    {
      label: 'Fulfillment Board',
      icon: Sparkles,
      color: '#C44569',
      onClick: () => onNavigate?.('fulfillment-board')
    }
  ];

  const salesActions = [
    {
      label: 'Create New Order',
      icon: Plus,
      color: '#C44569',
      onClick: () => onNavigate?.('order-create')
    },
    {
      label: 'Manage Customers',
      icon: Users,
      color: '#5A3825',
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
          Decorator Dashboard
        </h1>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#5A3825' }}>
          Your decoration queue + sales support when available
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard
          title="In Decoration Queue"
          value={decoratingQueue.length}
          icon={Palette}
          color="#C44569"
          index={0}
        />
        <KPICard
          title="High Priority"
          value={decoratingQueue.filter(o => o.priority === 'high').length}
          icon={Sparkles}
          color="#DC3545"
          index={1}
        />
        <KPICard
          title="Total Orders"
          value={orders.length}
          icon={Package}
          color="#5A3825"
          index={2}
        />
      </div>

      {/* Tabbed Interface: Decorating + Sales */}
      <Tabs defaultValue="decorating" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="decorating" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            ✨ Decoration Queue
          </TabsTrigger>
          <TabsTrigger value="sales" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            💼 Sales Support
          </TabsTrigger>
        </TabsList>

        {/* Decoration Queue Tab */}
        <TabsContent value="decorating">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <QuickActionCard title="Decorating Actions" actions={decoratingActions} />
            </div>
            <div className="lg:col-span-2">
              <OrderQueueCard
                title="My Decoration Queue"
                orders={decoratingQueue}
                emptyMessage="No orders ready for decoration"
                onOrderClick={() => onNavigate?.('fulfillment-board')}
              />
            </div>
          </div>
        </TabsContent>

        {/* Sales Support Tab */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <QuickActionCard title="Sales Actions" actions={salesActions} />
            </div>
            <div className="lg:col-span-2">
              <OrderQueueCard
                title="Recent Orders"
                orders={recentOrders}
                emptyMessage="No recent orders"
                onOrderClick={() => onNavigate?.('order-management')}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
