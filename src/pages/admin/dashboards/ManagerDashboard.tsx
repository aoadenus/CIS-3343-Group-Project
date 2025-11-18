import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Clock, UserCheck, FileText, Package, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import {
  KPICardV2,
  DashboardModal,
  DataTable,
  ActivityFeed,
  Button,
  Badge,
} from '../../../components/dashboard-v2';
import { MOCK_DASHBOARD_DATA, MOCK_ACTIVITY_EVENTS } from '../../../data/presentationData';

interface ManagerDashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardMetrics {
  lostOrderRisk: {
    count: number;
    value: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  staffUtilization: {
    avgBakerWorkload: number;
    avgDecoratorWorkload: number;
    totalBakers: number;
    totalDecorators: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  slaAdherence: {
    rate: number;
    onTimeCount: number;
    lateCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
    health: 'green' | 'yellow' | 'red';
  };
  criticalActionItems: {
    count: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  teamPerformance: {
    rate: number;
    completedCount: number;
    totalCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
}

export function ManagerDashboard({ onNavigate }: ManagerDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activityEvents, setActivityEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [metricsRes, activityRes] = await Promise.all([
        fetch('/api/dashboards/manager', { headers }),
        fetch('/api/dashboards/activity-feed?limit=20', { headers }),
      ]);

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data);
        
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivityEvents(activityData);
        }
      } else {
        // Fallback to mock data
        console.log('API not available, using mock data for Manager dashboard');
        const mockData = MOCK_DASHBOARD_DATA.manager;
        setMetrics(mockData);
        
        const mockActivities = MOCK_ACTIVITY_EVENTS.map(event => ({
          id: event.id,
          type: event.type,
          user: { name: event.user, role: 'manager', avatar: undefined },
          action: event.message,
          timestamp: event.timestamp,
          metadata: {},
        }));
        setActivityEvents(mockActivities);
      }
    } catch (error) {
      console.error('Failed to fetch manager dashboard:', error);
      // Fallback to mock data on error
      const mockData = MOCK_DASHBOARD_DATA.manager;
      setMetrics(mockData);
      
      const mockActivities = MOCK_ACTIVITY_EVENTS.map(event => ({
        id: event.id,
        type: event.type,
        user: { name: event.user, role: 'manager', avatar: undefined },
        action: event.message,
        timestamp: event.timestamp,
        metadata: {},
      }));
      setActivityEvents(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: 'green' | 'yellow' | 'red') => {
    return health === 'green' ? '#10B981' : health === 'yellow' ? '#F59E0B' : '#EF4444';
  };

  if (loading) {
    return (
      <div className="sales-dashboard-container">
        <KPICardV2
          title="Team Utilization"
          value={0}
          trend={{ value: 'Loading...', period: '', direction: 'neutral' }}
          icon={Users}
          iconColor="#3B82F6"
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
    <div className="sales-dashboard-container">
      <div className="sales-dashboard-header">
        <h1>Manager Dashboard</h1>
        <p>Operational control and team efficiency metrics</p>
      </div>

      <div className="kpi-grid">
        <KPICardV2
          title="Lost Order Risk"
          value={metrics.lostOrderRisk.count}
          subtitle={`$${(metrics.lostOrderRisk.value / 100).toFixed(2)} at risk`}
          trend={metrics.lostOrderRisk.trend}
          icon={AlertTriangle}
          iconColor={metrics.lostOrderRisk.count === 0 ? '#10B981' : '#EF4444'}
          onClick={() => {}}
        />
        <KPICardV2
          title="Staff Utilization"
          subtitle={`${metrics.staffUtilization.avgBakerWorkload} baker / ${metrics.staffUtilization.avgDecoratorWorkload} decorator avg`}
          value={`${metrics.staffUtilization.totalBakers}B + ${metrics.staffUtilization.totalDecorators}D`}
          trend={metrics.staffUtilization.trend}
          icon={Users}
          iconColor="#3B82F6"
          onClick={() => {}}
        />
        <KPICardV2
          title="SLA Adherence"
          value={`${metrics.slaAdherence.rate}%`}
          subtitle={`${metrics.slaAdherence.onTimeCount} on-time, ${metrics.slaAdherence.lateCount} late`}
          trend={metrics.slaAdherence.trend}
          icon={Clock}
          iconColor={getHealthColor(metrics.slaAdherence.health)}
          onClick={() => {}}
        />
        <KPICardV2
          title="Critical Action Items"
          value={metrics.criticalActionItems.count}
          trend={metrics.criticalActionItems.trend}
          icon={AlertTriangle}
          iconColor={metrics.criticalActionItems.count === 0 ? '#10B981' : '#EF4444'}
          onClick={() => {}}
        />
        <KPICardV2
          title="Team Performance"
          value={`${metrics.teamPerformance.rate}%`}
          subtitle={`${metrics.teamPerformance.completedCount}/${metrics.teamPerformance.totalCount} completed this week`}
          trend={metrics.teamPerformance.trend}
          icon={UserCheck}
          iconColor={metrics.teamPerformance.rate >= 80 ? '#10B981' : metrics.teamPerformance.rate >= 60 ? '#F59E0B' : '#EF4444'}
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
          leftIcon={<FileText size={18} />}
          onClick={() => onNavigate?.('business-intelligence')}
        >
          Business Intelligence
        </Button>
        <Button
          variant="secondary"
          leftIcon={<Users size={18} />}
          onClick={() => onNavigate?.('staff-management')}
        >
          Staff Management
        </Button>
      </div>

      <div className="data-section">
        <div className="recent-orders-card">
          <h3>Team Overview</h3>
          <p style={{ padding: '20px', color: '#5A3825' }}>
            Manage your team's performance and track operational metrics across all departments.
          </p>
        </div>

        <ActivityFeed
          events={activityEvents}
          loading={loading}
          maxHeight="calc(100vh - 400px)"
        />
      </div>
    </div>
  );
}
