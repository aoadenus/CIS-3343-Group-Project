import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, TrendingUp, FileText, Package, PieChart, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  KPICardV2,
  DashboardModal,
  DataTable,
  ActivityFeed,
  Button,
  Badge,
} from '../../../components/dashboard-v2';
import { MOCK_DASHBOARD_DATA, SAMPLE_ORDERS } from '../../../data/presentationData';

interface AccountantDashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardMetrics {
  depositShortfalls: {
    count: number;
    totalAmount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  outstandingBalances: {
    total: number;
    buckets: {
      aging30: number;
      aging60: number;
      aging90Plus: number;
    };
    counts: {
      aging30: number;
      aging60: number;
      aging90Plus: number;
    };
    color: string;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  reconciliationAccuracy: {
    percentage: number;
    reconciledCount: number;
    totalCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  depositCompliance: {
    rate: number;
    compliantCount: number;
    totalCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  weekRevenue: {
    amount: number;
    paymentsCount: number;
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
  totalAmount: number;
  depositAmount?: number;
  balanceDue?: number;
  paymentStatus: string;
  eventDate: string;
  createdAt: string;
}

export function AccountantDashboard({ onNavigate }: AccountantDashboardProps) {
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
      const response = await fetch('/api/dashboards/accountant', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        // Fallback to mock data
        console.log('API not available, using mock data for Accountant dashboard');
        const mockData = MOCK_DASHBOARD_DATA.accountant;
        setMetrics({
          depositShortfalls: { count: 1, totalAmount: 2500, trend: { value: '-2 orders', period: 'this week', direction: 'up' } },
          outstandingBalances: {
            total: mockData.outstandingBalance.amount,
            buckets: { aging30: 30000, aging60: 15000, aging90Plus: 7000 },
            counts: { aging30: 5, aging60: 2, aging90Plus: 1 },
            color: '#F59E0B',
            trend: mockData.outstandingBalance.trend,
          },
          reconciliationAccuracy: { percentage: 98, reconciledCount: 98, totalCount: 100, trend: { value: '+2%', period: 'this month', direction: 'up' } },
          depositCompliance: mockData.depositCompliance,
          weekRevenue: {
            amount: mockData.monthlyRevenue.amount,
            paymentsCount: 15,
            trend: mockData.monthlyRevenue.trend,
          },
        });
        
        // Set mock order data for accountant view
        const accountantOrders = SAMPLE_ORDERS.filter(o => parseFloat(o.balanceDue.toString()) > 0).map(order => ({
          id: parseInt(order.id.replace('ord-', '')),
          customerName: order.customerName,
          customerEmail: '',
          totalAmount: Math.round(order.totalAmount * 100),
          depositAmount: Math.round(order.depositAmount * 100),
          balanceDue: Math.round(order.balanceDue * 100),
          paymentStatus: order.balanceDue === 0 ? 'paid' : 'partial',
          eventDate: order.pickupDate,
          createdAt: order.orderDate,
        }));
        setModalData(accountantOrders);
      }
    } catch (error) {
      console.error('Failed to fetch accountant dashboard:', error);
      // Fallback to mock data on error
      const mockData = MOCK_DASHBOARD_DATA.accountant;
      setMetrics({
        depositShortfalls: { count: 1, totalAmount: 2500, trend: { value: '-2 orders', period: 'this week', direction: 'up' } },
        outstandingBalances: {
          total: mockData.outstandingBalance.amount,
          buckets: { aging30: 30000, aging60: 15000, aging90Plus: 7000 },
          counts: { aging30: 5, aging60: 2, aging90Plus: 1 },
          color: '#F59E0B',
          trend: mockData.outstandingBalance.trend,
        },
        reconciliationAccuracy: { percentage: 98, reconciledCount: 98, totalCount: 100, trend: { value: '+2%', period: 'this month', direction: 'up' } },
        depositCompliance: mockData.depositCompliance,
        weekRevenue: {
          amount: mockData.monthlyRevenue.amount,
          paymentsCount: 15,
          trend: mockData.monthlyRevenue.trend,
        },
      });
      
      const accountantOrders = SAMPLE_ORDERS.filter(o => parseFloat(o.balanceDue.toString()) > 0).map(order => ({
        id: parseInt(order.id.replace('ord-', '')),
        customerName: order.customerName,
        customerEmail: '',
        totalAmount: Math.round(order.totalAmount * 100),
        depositAmount: Math.round(order.depositAmount * 100),
        balanceDue: Math.round(order.balanceDue * 100),
        paymentStatus: order.balanceDue === 0 ? 'paid' : 'partial',
        eventDate: order.pickupDate,
        createdAt: order.orderDate,
      }));
      setModalData(accountantOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleKPIClick = async (kpiType: string) => {
    // Placeholder for future detail view implementation
    // For now, just show a toast message
    toast.info(`${kpiType} details - Feature coming soon`);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getPaymentStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      paid: 'success',
      partial: 'warning',
      pending: 'error',
      refunded: 'neutral',
    };
    return statusMap[status.toLowerCase()] || 'neutral';
  };

  const orderColumns = [
    { 
      accessor: 'customerName' as const,
      header: 'Customer',
      sortable: true
    },
    { 
      accessor: 'totalAmount' as const,
      header: 'Total',
      format: 'currency' as const,
      sortable: true
    },
    { 
      accessor: 'depositAmount' as const,
      header: 'Deposit',
      format: 'currency' as const,
      sortable: true
    },
    { 
      accessor: 'balanceDue' as const,
      header: 'Balance Due',
      format: 'currency' as const,
      sortable: true
    },
    { 
      accessor: 'paymentStatus' as const,
      header: 'Payment Status',
      render: (row: Order) => (
        <Badge variant={getPaymentStatusVariant(row.paymentStatus)}>
          {row.paymentStatus}
        </Badge>
      )
    },
    { 
      accessor: 'eventDate' as const,
      header: 'Event Date',
      format: 'date' as const,
      sortable: true
    },
  ];

  if (loading) {
    return (
      <div className="sales-dashboard-container">
        <KPICardV2
          title="Daily Cash-In"
          value="$0.00"
          trend={{ value: 'Loading...', period: '', direction: 'neutral' }}
          icon={DollarSign}
          iconColor="#10B981"
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
          <h1>Accountant Dashboard</h1>
          <p>Cash flow metrics and collection tracking</p>
        </div>

        <div className="kpi-grid">
          <KPICardV2
            title="Deposit Shortfalls"
            value={metrics.depositShortfalls.count}
            trend={metrics.depositShortfalls.trend}
            icon={AlertTriangle}
            iconColor={metrics.depositShortfalls.count === 0 ? '#10B981' : '#EF4444'}
            onClick={() => {}}
          />
          <KPICardV2
            title="Outstanding Balances"
            value={formatCurrency(metrics.outstandingBalances.total)}
            trend={metrics.outstandingBalances.trend}
            icon={DollarSign}
            iconColor={metrics.outstandingBalances.color}
            onClick={() => {}}
          />
          <KPICardV2
            title="Reconciliation Accuracy"
            value={`${metrics.reconciliationAccuracy.percentage}%`}
            trend={metrics.reconciliationAccuracy.trend}
            icon={FileText}
            iconColor={metrics.reconciliationAccuracy.percentage >= 95 ? '#10B981' : metrics.reconciliationAccuracy.percentage >= 85 ? '#FFB84D' : '#EF4444'}
            onClick={() => {}}
          />
          <KPICardV2
            title="Deposit Compliance"
            value={`${metrics.depositCompliance.rate}%`}
            trend={metrics.depositCompliance.trend}
            icon={PieChart}
            iconColor={metrics.depositCompliance.rate >= 90 ? '#10B981' : metrics.depositCompliance.rate >= 75 ? '#FFB84D' : '#EF4444'}
            onClick={() => {}}
          />
          <KPICardV2
            title="Revenue This Week"
            value={formatCurrency(metrics.weekRevenue.amount)}
            trend={metrics.weekRevenue.trend}
            icon={TrendingUp}
            iconColor="#10B981"
            onClick={() => {}}
          />
        </div>

        <div className="quick-actions">
          <Button
            variant="primary"
            leftIcon={<TrendingUp size={18} />}
            onClick={() => onNavigate?.('business-intelligence')}
          >
            Revenue Report
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Package size={18} />}
            onClick={() => onNavigate?.('order-management')}
          >
            View All Orders
          </Button>
          <Button
            variant="secondary"
            leftIcon={<FileText size={18} />}
            onClick={() => onNavigate?.('business-intelligence')}
          >
            Business Intelligence
          </Button>
        </div>

        <div className="data-section">
          <div className="recent-orders-card">
            <h3>Recent Financial Activity</h3>
            <DataTable
              columns={orderColumns}
              data={modalData.length > 0 ? modalData.slice(0, 10) : []}
              onRowClick={(row) => onNavigate?.(`order-details/${row.id}`)}
              exportFilename="financial-activity"
              emptyMessage="No recent financial activity"
            />
          </div>

          <ActivityFeed
            events={[
              {
                id: '1',
                type: 'payment',
                user: { name: 'Sales', role: 'sales' },
                action: 'received deposit payment of $250.00 for order #1234',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              },
              {
                id: '2',
                type: 'payment',
                user: { name: 'Sales', role: 'sales' },
                action: 'received final payment of $500.00 for order #1235',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
              },
              {
                id: '3',
                type: 'staff_action',
                user: { name: 'You', role: 'accountant' },
                action: 'updated payment status for order #1236',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
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
