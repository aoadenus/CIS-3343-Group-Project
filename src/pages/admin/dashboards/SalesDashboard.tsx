import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Package, MessageCircle, Plus, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  KPICardV2,
  DashboardModal,
  DataTable,
  ActivityFeed,
  Button,
  Badge,
} from '../../../components/dashboard-v2';
import { MOCK_DASHBOARD_DATA, SAMPLE_ORDERS, MOCK_ACTIVITY_EVENTS } from '../../../data/presentationData';

interface SalesDashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardMetrics {
  depositCompliance: {
    rate: number;
    count: number;
    total: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  todaysOrders: {
    count: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  returningCustomers: {
    count: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  pickupsToday: {
    count: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
}

interface Order {
  id: number;
  customerName: string;
  cakeType: string;
  pickupDate: string;
  totalAmount: number;
  status: string;
  paidAmount?: number;
  balanceDue?: number;
  orderDate?: string;
  pickupTime?: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
  isRead: boolean;
}

interface ActivityEvent {
  id: string;
  type: 'order_created' | 'status_update' | 'payment' | 'inquiry' | 'staff_action';
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  action: string;
  timestamp: Date | string;
  metadata?: {
    orderId?: number;
    status?: string;
    amount?: number;
  };
}

type ModalContentType = 'todays-orders' | 'pending-deposits' | 'pickups-today' | 'recent-inquiries' | null;

export function SalesDashboard({ onNavigate }: SalesDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();

        const [metricsRes, ordersRes, activitiesRes] = await Promise.all([
          fetch('/api/dashboards/sales', { headers }),
          fetch('/api/orders?limit=10', { headers }),
          fetch('/api/dashboards/activity-feed?limit=20', { headers }),
        ]);

        // Try real API first, fallback to mock data
        if (!metricsRes.ok) {
          console.log('API not available, using mock data');
          // Use mock data from presentationData.ts
          const mockMetrics = MOCK_DASHBOARD_DATA.sales;
          setMetrics({
            depositCompliance: mockMetrics.depositCompliance,
            todaysOrders: mockMetrics.todaysOrders,
            returningCustomers: mockMetrics.returningCustomers,
            pickupsToday: mockMetrics.pickupsToday,
          });
          
          // Transform SAMPLE_ORDERS to match Order interface
          const mockOrders = SAMPLE_ORDERS.slice(0, 7).map(order => ({
            id: parseInt(order.id.replace('ord-', '')),
            customerName: order.customerName,
            cakeType: order.cakeName,
            pickupDate: order.pickupDate,
            totalAmount: Math.round(order.totalAmount * 100), // Convert to cents
            status: order.status,
            paidAmount: Math.round(order.depositAmount * 100),
            balanceDue: Math.round(order.balanceDue * 100),
            orderDate: order.orderDate,
            pickupTime: order.pickupDate,
          }));
          setRecentOrders(mockOrders);
          
          // Use mock activity events
          const mockActivities = MOCK_ACTIVITY_EVENTS.map(event => ({
            id: event.id,
            type: event.type as any,
            user: { name: event.user, role: 'sales', avatar: undefined },
            action: event.message,
            timestamp: event.timestamp,
            metadata: {},
          }));
          setActivities(mockActivities);
        } else {
          // Use real API data
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);

          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 7) : []);
          }

          if (activitiesRes.ok) {
            const activitiesData = await activitiesRes.json();
            setActivities(Array.isArray(activitiesData) ? activitiesData : []);
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        console.log('Error occurred, falling back to mock data');
        
        // Fallback to mock data on error
        const mockMetrics = MOCK_DASHBOARD_DATA.sales;
        setMetrics({
          depositCompliance: mockMetrics.depositCompliance,
          todaysOrders: mockMetrics.todaysOrders,
          returningCustomers: mockMetrics.returningCustomers,
          pickupsToday: mockMetrics.pickupsToday,
        });
        
        const mockOrders = SAMPLE_ORDERS.slice(0, 7).map(order => ({
          id: parseInt(order.id.replace('ord-', '')),
          customerName: order.customerName,
          cakeType: order.cakeName,
          pickupDate: order.pickupDate,
          totalAmount: Math.round(order.totalAmount * 100),
          status: order.status,
          paidAmount: Math.round(order.depositAmount * 100),
          balanceDue: Math.round(order.balanceDue * 100),
          orderDate: order.orderDate,
          pickupTime: order.pickupDate,
        }));
        setRecentOrders(mockOrders);
        
        const mockActivities = MOCK_ACTIVITY_EVENTS.map(event => ({
          id: event.id,
          type: event.type as any,
          user: { name: event.user, role: 'sales', avatar: undefined },
          action: event.message,
          timestamp: event.timestamp,
          metadata: {},
        }));
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openModal = async (type: ModalContentType) => {
    if (!type) return;

    setModalContent(type);
    setModalOpen(true);
    setModalLoading(true);

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/dashboards/sales/${type}`, { headers });
      
      if (!response.ok) throw new Error(`Failed to fetch ${type} data`);
      
      const data = await response.json();
      setModalData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast.error(`Failed to load ${type} details`);
      setModalData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalData([]);
  };

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/admin/${page}`;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      completed: 'success',
      ready: 'success',
      'in-progress': 'info',
      pending: 'warning',
      cancelled: 'error',
      overdue: 'error',
    };
    return statusMap[status.toLowerCase()] || 'neutral';
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const recentOrdersColumns = [
    { header: 'Order ID', accessor: 'id' as const, width: '80px', sortable: true },
    { header: 'Customer', accessor: 'customerName' as const, sortable: true },
    { header: 'Cake Type', accessor: 'cakeType' as const, sortable: true },
    { header: 'Pickup Date', accessor: 'pickupDate' as const, format: 'date' as const, sortable: true },
    { header: 'Total', accessor: 'totalAmount' as const, format: 'currency' as const, sortable: true },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: Order) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const getTodaysOrdersColumns = () => [
    { header: 'Order ID', accessor: 'id' as const, width: '80px', sortable: true },
    { header: 'Customer', accessor: 'customerName' as const, sortable: true },
    { header: 'Cake Type', accessor: 'cakeType' as const, sortable: true },
    { header: 'Total', accessor: 'totalAmount' as const, format: 'currency' as const, sortable: true },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: Order) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const getPendingDepositsColumns = () => [
    { header: 'Customer', accessor: 'customerName' as const, sortable: true },
    { header: 'Order Date', accessor: 'orderDate' as const, format: 'date' as const, sortable: true },
    { header: 'Total', accessor: 'totalAmount' as const, format: 'currency' as const, sortable: true },
    { header: 'Paid', accessor: 'paidAmount' as const, format: 'currency' as const, sortable: true },
    { header: 'Balance Due', accessor: 'balanceDue' as const, format: 'currency' as const, sortable: true },
  ];

  const getPickupsTodayColumns = () => [
    { header: 'Order ID', accessor: 'id' as const, width: '80px', sortable: true },
    { header: 'Customer', accessor: 'customerName' as const, sortable: true },
    { header: 'Cake Type', accessor: 'cakeType' as const, sortable: true },
    { header: 'Pickup Time', accessor: 'pickupTime' as const, format: 'date' as const, sortable: true },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: Order) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const getInquiriesColumns = () => [
    { header: 'Name', accessor: 'name' as const, sortable: true },
    { header: 'Email', accessor: 'email' as const, sortable: true },
    { header: 'Subject', accessor: 'subject' as const, sortable: true },
    { header: 'Date', accessor: 'createdAt' as const, format: 'date' as const, sortable: true },
  ];

  const getModalTitle = (): string => {
    const titles: Record<string, string> = {
      'todays-orders': "Today's Orders",
      'pending-deposits': 'Pending Deposits',
      'pickups-today': "Today's Pickups",
      'recent-inquiries': 'Recent Inquiries',
    };
    return modalContent ? titles[modalContent] : '';
  };

  const getModalColumns = () => {
    switch (modalContent) {
      case 'todays-orders':
        return getTodaysOrdersColumns();
      case 'pending-deposits':
        return getPendingDepositsColumns();
      case 'pickups-today':
        return getPickupsTodayColumns();
      case 'recent-inquiries':
        return getInquiriesColumns();
      default:
        return [];
    }
  };

  if (loading || !metrics) {
    return (
      <div className="sales-dashboard-container">
        <div className="sales-dashboard-header">
          <h1>Sales Dashboard</h1>
          <p>Manage orders and customer relationships</p>
        </div>

        <div className="kpi-grid">
          <KPICardV2
            title="Deposit Compliance"
            value="..."
            icon={DollarSign}
            iconColor="#10B981"
            loading={true}
          />
          <KPICardV2
            title="Today's Orders"
            value="..."
            icon={ShoppingCart}
            iconColor="#C44569"
            loading={true}
          />
          <KPICardV2
            title="Returning Customers"
            value="..."
            icon={Users}
            iconColor="#10B981"
            loading={true}
          />
          <KPICardV2
            title="Pickups Today"
            value="..."
            icon={Package}
            iconColor="#3B82F6"
            loading={true}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sales-dashboard-container">
        <div className="sales-dashboard-header">
          <h1>Sales Dashboard</h1>
          <p>Order creation efficiency and deposit compliance tracking</p>
        </div>

        <div className="kpi-grid">
          <KPICardV2
            title="Deposit Compliance"
            value={`${metrics.depositCompliance.rate}%`}
            icon={DollarSign}
            iconColor={metrics.depositCompliance.rate >= 90 ? "#10B981" : metrics.depositCompliance.rate >= 75 ? "#F59E0B" : "#C44569"}
            trend={metrics.depositCompliance.trend}
            onClick={() => {}}
          />
          <KPICardV2
            title="Today's Orders"
            value={metrics.todaysOrders.count.toString()}
            icon={ShoppingCart}
            iconColor="#C44569"
            trend={metrics.todaysOrders.trend}
            onClick={() => {}}
          />
          <KPICardV2
            title="Returning Customers"
            value={metrics.returningCustomers.count.toString()}
            icon={Users}
            iconColor="#10B981"
            trend={metrics.returningCustomers.trend}
            onClick={() => {}}
          />
          <KPICardV2
            title="Pickups Today"
            value={metrics.pickupsToday.count.toString()}
            icon={Package}
            iconColor="#3B82F6"
            trend={metrics.pickupsToday.trend}
            onClick={() => {}}
          />
        </div>

        <div className="quick-actions">
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => handleNavigation('order-create')}
          >
            Create New Order
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Users size={18} />}
            onClick={() => handleNavigation('customer-accounts')}
          >
            Manage Customers
          </Button>
          <Button
            variant="secondary"
            leftIcon={<FileText size={18} />}
            onClick={() => handleNavigation('order-management')}
          >
            View All Orders
          </Button>
        </div>

        <div className="data-section">
          <div className="recent-orders-card">
            <h3>Recent Orders (Last 7 Days)</h3>
            <DataTable
              columns={recentOrdersColumns}
              data={recentOrders}
              onRowClick={(order: Order) => handleNavigation(`order-management?id=${order.id}`)}
              exportable={true}
              exportFilename="recent-orders"
              emptyMessage="No recent orders"
            />
          </div>

          <ActivityFeed
            events={activities}
            loading={activityLoading}
            maxHeight="calc(100vh - 400px)"
          />
        </div>
      </div>

      <DashboardModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={getModalTitle()}
        size="lg"
      >
        {modalLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading data...</p>
          </div>
        ) : (
          <DataTable
            columns={getModalColumns()}
            data={modalData}
            exportable={true}
            exportFilename={modalContent || 'data'}
            emptyMessage="No data available"
          />
        )}
      </DashboardModal>
    </>
  );
}
