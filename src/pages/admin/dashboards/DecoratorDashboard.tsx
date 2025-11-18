import { useState, useEffect } from 'react';
import { Sparkles, Camera, Clock, AlertCircle, Plus, Users, Package, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import {
  KPICardV2,
  DashboardModal,
  DataTable,
  ActivityFeed,
  Button,
  Badge,
} from '../../../components/dashboard-v2';
import { MOCK_DASHBOARD_DATA, getOrdersByStatus } from '../../../data/presentationData';

interface DecoratorDashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardMetrics {
  designQueueAge: {
    avgDays: number;
    oldestDays: number;
    queueCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  rushOrdersReady: {
    count: number;
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
  weekCompletionRate: {
    percentage: number;
    completedCount: number;
    totalCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  overdueDecorations: {
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
  designDetails?: string;
  eventDate: string;
  status: string;
  priority: string;
  createdAt: string;
}

export function DecoratorDashboard({ onNavigate }: DecoratorDashboardProps) {
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
      const response = await fetch('/api/dashboards/decorator', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        // Fallback to mock data
        console.log('API not available, using mock data for Decorator dashboard');
        const mockData = MOCK_DASHBOARD_DATA.decorator;
        setMetrics({
          designQueueAge: { avgDays: 2, oldestDays: 5, queueCount: 4, trend: mockData.activeQueue.trend },
          rushOrdersReady: { count: 0, trend: { value: 'All clear', period: 'today', direction: 'neutral' } },
          currentWorkload: mockData.activeQueue,
          weekCompletionRate: { percentage: 85, completedCount: 17, totalCount: 20, trend: { value: '+5%', period: 'vs. last week', direction: 'up' } },
          overdueDecorations: { count: 0, trend: { value: 'On schedule', period: 'today', direction: 'neutral' } },
        });
        
        // Set mock orders for decorator queue (in_decoration status)
        const decoratorOrders = getOrdersByStatus('in_decoration').map(order => ({
          id: parseInt(order.id.replace('ord-', '')),
          customerName: order.customerName,
          customerEmail: '',
          customerPhone: '',
          orderType: order.cakeName,
          designDetails: order.specialInstructions,
          eventDate: order.pickupDate,
          status: order.status,
          priority: 'medium',
          createdAt: order.orderDate,
        }));
        setModalData(decoratorOrders);
      }
    } catch (error) {
      console.error('Failed to fetch decorator dashboard:', error);
      // Fallback to mock data on error
      const mockData = MOCK_DASHBOARD_DATA.decorator;
      setMetrics({
        designQueueAge: { avgDays: 2, oldestDays: 5, queueCount: 4, trend: mockData.activeQueue.trend },
        rushOrdersReady: { count: 0, trend: { value: 'All clear', period: 'today', direction: 'neutral' } },
        currentWorkload: mockData.activeQueue,
        weekCompletionRate: { percentage: 85, completedCount: 17, totalCount: 20, trend: { value: '+5%', period: 'vs. last week', direction: 'up' } },
        overdueDecorations: { count: 0, trend: { value: 'On schedule', period: 'today', direction: 'neutral' } },
      });
      
      const decoratorOrders = getOrdersByStatus('in_decoration').map(order => ({
        id: parseInt(order.id.replace('ord-', '')),
        customerName: order.customerName,
        customerEmail: '',
        customerPhone: '',
        orderType: order.cakeName,
        designDetails: order.specialInstructions,
        eventDate: order.pickupDate,
        status: order.status,
        priority: 'medium',
        createdAt: order.orderDate,
      }));
      setModalData(decoratorOrders);
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
        case 'Awaiting Photos':
          endpoint = '/api/dashboards/decorator/awaiting-photos';
          break;
        case 'Rush Orders':
          endpoint = '/api/dashboards/decorator/urgent-orders';
          break;
        case 'QC Issues':
          endpoint = '/api/dashboards/decorator/qc-issues';
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

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      completed: 'success',
      ready: 'success',
      in_decoration: 'info',
      awaiting_decoration: 'warning',
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
      header: 'Design',
      render: (row: Order) => row.orderType || row.designDetails || 'Custom'
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

  if (loading) {
    return (
      <div className="sales-dashboard-container">
        <KPICardV2
          title="Design Queue Age"
          value={0}
          trend={{ value: 'Loading...', period: '', direction: 'neutral' }}
          icon={Clock}
          iconColor="#8B5CF6"
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

  return (
    <>
      <div className="sales-dashboard-container">
        <div className="sales-dashboard-header">
          <h1>Decorator Dashboard</h1>
          <p>Design readiness bottlenecks and quality control</p>
        </div>

        <div className="kpi-grid">
          <KPICardV2
            title="Design Queue Age"
            value={`${metrics.designQueueAge.avgDays} days`}
            trend={metrics.designQueueAge.trend}
            icon={Clock}
            iconColor={metrics.designQueueAge.avgDays <= 2 ? '#4CAF50' : metrics.designQueueAge.avgDays <= 5 ? '#FFB84D' : '#FF6B6B'}
            onClick={() => {}}
          />
          <KPICardV2
            title="Rush Orders Ready"
            value={metrics.rushOrdersReady.count}
            trend={metrics.rushOrdersReady.trend}
            icon={AlertCircle}
            iconColor={metrics.rushOrdersReady.count === 0 ? '#4CAF50' : '#FF6B6B'}
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
            title="Week Completion Rate"
            value={`${metrics.weekCompletionRate.percentage}%`}
            trend={metrics.weekCompletionRate.trend}
            icon={Sparkles}
            iconColor={metrics.weekCompletionRate.percentage >= 80 ? '#4CAF50' : metrics.weekCompletionRate.percentage >= 60 ? '#FFB84D' : '#FF6B6B'}
            onClick={() => {}}
          />
          <KPICardV2
            title="Overdue Decorations"
            value={metrics.overdueDecorations.count}
            trend={metrics.overdueDecorations.trend}
            icon={AlertCircle}
            iconColor={metrics.overdueDecorations.count === 0 ? '#4CAF50' : '#FF6B6B'}
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
            <h3>Design Readiness Queue</h3>
            <DataTable
              columns={orderColumns}
              data={modalData.length > 0 ? modalData.slice(0, 10) : []}
              onRowClick={(row) => onNavigate?.(`order-details/${row.id}`)}
              exportFilename="design-readiness-queue"
              emptyMessage="No orders requiring attention"
            />
          </div>

          <ActivityFeed
            events={[
              {
                id: '1',
                type: 'staff_action',
                user: { name: 'Baker', role: 'baker' },
                action: 'completed baking for wedding cake - ready for decoration',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              },
              {
                id: '2',
                type: 'staff_action',
                user: { name: 'You', role: 'decorator' },
                action: 'finished decorating birthday cake for Johnson',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
              },
              {
                id: '3',
                type: 'status_update',
                user: { name: 'You', role: 'decorator' },
                action: 'uploaded photos for anniversary cake',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
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
