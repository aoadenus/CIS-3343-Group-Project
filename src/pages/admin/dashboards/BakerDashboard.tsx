import { useState, useEffect } from 'react';
import { Gauge, CheckCircle, AlertTriangle, Clock, Package, Plus, Users, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import {
  KPICardV2,
  DashboardModal,
  DataTable,
  ActivityFeed,
  Button,
  Badge,
} from '../../../components/dashboard-v2';
import { MOCK_DASHBOARD_DATA, SAMPLE_ORDERS, getOrdersByStatus } from '../../../data/presentationData';

interface BakerDashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardMetrics {
  prepTimePerOrder: {
    minutes: number;
    completedCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  onTimeHandoff: {
    percentage: number;
    onTimeCount: number;
    totalHandoffs: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  currentWorkload: {
    count: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  ordersInProduction: {
    count: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  overdueOrders: {
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
  customerEmail?: string;
  customerPhone?: string;
  orderType: string;
  flavor?: string;
  servings?: number;
  eventDate: string;
  status: string;
  priority: string;
  additionalNotes?: string;
  adminNotes?: string;
  createdAt: string;
  layers?: any;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export function BakerDashboard({ onNavigate }: BakerDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboards/baker', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        // Fallback to mock data
        console.log('API not available, using mock data for Baker dashboard');
        const mockData = MOCK_DASHBOARD_DATA.baker;
        setMetrics({
          prepTimePerOrder: mockData.prepTimePerOrder,
          onTimeHandoff: mockData.onTimeHandoff,
          currentWorkload: mockData.currentWorkload,
          ordersInProduction: mockData.ordersInProduction,
          overdueOrders: { count: 0, trend: { value: 'On track', period: 'today', direction: 'neutral' } },
        });
        
        // Set mock orders for baker queue (in_prep status)
        const bakerOrders = getOrdersByStatus('in_prep').map(order => ({
          id: parseInt(order.id.replace('ord-', '')),
          customerName: order.customerName,
          customerEmail: '',
          customerPhone: '',
          orderType: order.cakeName,
          flavor: order.cakeName,
          servings: 8,
          eventDate: order.pickupDate,
          status: order.status,
          priority: 'medium',
          additionalNotes: order.specialInstructions,
          adminNotes: '',
          createdAt: order.orderDate,
          layers: null,
        }));
        setModalData(bakerOrders);
      }
    } catch (error) {
      console.error('Failed to fetch baker dashboard:', error);
      // Fallback to mock data on error
      const mockData = MOCK_DASHBOARD_DATA.baker;
      setMetrics({
        prepTimePerOrder: mockData.prepTimePerOrder,
        onTimeHandoff: mockData.onTimeHandoff,
        currentWorkload: mockData.currentWorkload,
        ordersInProduction: mockData.ordersInProduction,
        overdueOrders: { count: 0, trend: { value: 'On track', period: 'today', direction: 'neutral' } },
      });
      
      const bakerOrders = getOrdersByStatus('in_prep').map(order => ({
        id: parseInt(order.id.replace('ord-', '')),
        customerName: order.customerName,
        customerEmail: '',
        customerPhone: '',
        orderType: order.cakeName,
        flavor: order.cakeName,
        servings: 8,
        eventDate: order.pickupDate,
        status: order.status,
        priority: 'medium',
        additionalNotes: order.specialInstructions,
        adminNotes: '',
        createdAt: order.orderDate,
        layers: null,
      }));
      setModalData(bakerOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleKPIClick = async (kpiType: string) => {
    setModalOpen(true);
    setModalContent(kpiType);
    setModalLoading(true);

    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      switch (kpiType) {
        case 'My Queue':
          endpoint = '/api/dashboards/baker/my-queue';
          break;
        case 'Due Today':
          endpoint = '/api/dashboards/baker/due-today';
          break;
        case "Tomorrow's Schedule":
          endpoint = '/api/dashboards/baker/tomorrows-schedule';
          break;
        default:
          setModalLoading(false);
          return;
      }

      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setModalData(data);
      } else {
        toast.error('Failed to load details');
      }
    } catch (error) {
      console.error('Failed to fetch modal data:', error);
      toast.error('Failed to load data');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="sales-dashboard-container">
        <KPICardV2
          title="Prep Time Per Order"
          value={0}
          trend={{ value: 'Loading...', period: '', direction: 'neutral' }}
          icon={Clock}
          iconColor="#C44569"
          loading={true}
        />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="sales-dashboard-container">
        <p>Failed to load dashboard</p>
      </div>
    );
  }

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      completed: 'success',
      ready: 'success',
      in_baking: 'info',
      cooling: 'info',
      pending: 'warning',
      cancelled: 'error',
    };
    return statusMap[status.toLowerCase()] || 'neutral';
  };

  const getPriorityVariant = (priority: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    const priorityMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    };
    return priorityMap[priority.toLowerCase()] || 'neutral';
  };

  const orderColumns = [
    { 
      accessor: 'customerName' as const,
      header: 'Customer',
      render: (row: Order) => (
        <div>
          <div className="font-medium">{row.customerName || 'Unknown'}</div>
          {row.customerEmail && (
            <div className="text-sm text-gray-500">{row.customerEmail}</div>
          )}
        </div>
      )
    },
    { 
      accessor: 'orderType' as const,
      header: 'Cake Type',
      render: (row: Order) => row.orderType || row.flavor || 'Custom'
    },
    { 
      accessor: 'servings' as const,
      header: 'Servings',
      render: (row: Order) => row.servings ? `${row.servings} servings` : 'N/A'
    },
    { 
      accessor: 'eventDate' as const,
      header: 'Event Date',
      format: 'date' as const,
      sortable: true
    },
    { 
      accessor: 'status' as const,
      header: 'Status',
      render: (row: Order) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
        </Badge>
      )
    },
    { 
      accessor: 'priority' as const,
      header: 'Priority',
      render: (row: Order) => (
        <Badge variant={getPriorityVariant(row.priority)}>
          {row.priority}
        </Badge>
      )
    },
  ];

  return (
    <>
      <div className="sales-dashboard-container">
        <div className="sales-dashboard-header">
          <h1>Baker Dashboard</h1>
          <p>Production capacity, prep readiness, and efficiency metrics</p>
        </div>

        <div className="kpi-grid">
          <KPICardV2
            title="Prep Time Per Order"
            value={`${metrics.prepTimePerOrder.minutes} min`}
            trend={metrics.prepTimePerOrder.trend}
            icon={Clock}
            iconColor={metrics.prepTimePerOrder.minutes <= 120 ? '#4CAF50' : metrics.prepTimePerOrder.minutes <= 180 ? '#FFB84D' : '#FF6B6B'}
            onClick={() => {}}
          />
          <KPICardV2
            title="On-Time Handoff"
            value={`${metrics.onTimeHandoff.percentage}%`}
            trend={metrics.onTimeHandoff.trend}
            icon={CheckCircle}
            iconColor={metrics.onTimeHandoff.percentage >= 90 ? '#4CAF50' : metrics.onTimeHandoff.percentage >= 75 ? '#FFB84D' : '#FF6B6B'}
            onClick={() => {}}
          />
          <KPICardV2
            title="Current Workload"
            value={metrics.currentWorkload.count}
            trend={metrics.currentWorkload.trend}
            icon={Package}
            iconColor={metrics.currentWorkload.count <= 5 ? '#4CAF50' : metrics.currentWorkload.count <= 10 ? '#FFB84D' : '#FF6B6B'}
            onClick={() => {}}
          />
          <KPICardV2
            title="Orders In Production"
            value={metrics.ordersInProduction.count}
            trend={metrics.ordersInProduction.trend}
            icon={Gauge}
            iconColor="#6A89CC"
            onClick={() => {}}
          />
          <KPICardV2
            title="Overdue Orders"
            value={metrics.overdueOrders.count}
            trend={metrics.overdueOrders.trend}
            icon={AlertTriangle}
            iconColor={metrics.overdueOrders.count === 0 ? '#4CAF50' : '#FF6B6B'}
            onClick={() => {}}
          />
        </div>

        <div className="quick-actions">
          <Button
            variant="primary"
            leftIcon={<Package size={18} />}
            onClick={() => onNavigate?.('order-management')}
          >
            View All Orders
          </Button>
          <Button
            variant="secondary"
            leftIcon={<ClipboardList size={18} />}
            onClick={() => onNavigate?.('fulfillment-board')}
          >
            Fulfillment Board
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Plus size={18} />}
            onClick={() => onNavigate?.('order-create')}
          >
            Create Order (Sales)
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Users size={18} />}
            onClick={() => onNavigate?.('customer-accounts')}
          >
            Manage Customers (Sales)
          </Button>
        </div>

        <div className="data-section">
          <div className="recent-orders-card">
            <h3>My Baking Queue</h3>
            <DataTable
              columns={orderColumns}
              data={modalData.length > 0 ? modalData.slice(0, 10) : []}
              onRowClick={(row) => onNavigate?.(`order-details/${row.id}`)}
              exportFilename="baking-queue"
              emptyMessage="No orders in your baking queue"
            />
          </div>

          <ActivityFeed
            events={[
              {
                id: '1',
                type: 'staff_action',
                user: { name: 'Manager', role: 'manager' },
                action: 'assigned new wedding cake order for Johnson - 3 tiers',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              },
              {
                id: '2',
                type: 'staff_action',
                user: { name: 'You', role: 'baker' },
                action: 'completed birthday cake for Smith family',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
              },
              {
                id: '3',
                type: 'status_update',
                user: { name: 'You', role: 'baker' },
                action: 'moved anniversary cake to cooling',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              },
            ]}
            loading={false}
            maxHeight="calc(100vh - 400px)"
          />
        </div>
      </div>

      <DashboardModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalContent(null);
          setModalData([]);
        }}
        title={modalContent || ''}
      >
        {modalLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#5A3825' }}>
            Loading...
          </div>
        ) : (
          <DataTable
            columns={orderColumns}
            data={modalData}
            onRowClick={(row) => {
              setModalOpen(false);
              onNavigate?.(`order-details/${row.id}`);
            }}
            exportFilename={modalContent || 'data'}
            emptyMessage="No data available"
          />
        )}
      </DashboardModal>
    </>
  );
}
