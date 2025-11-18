import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, DollarSign, Users, Award, FileText, Package, ClipboardList, Settings } from 'lucide-react';
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

interface OwnerDashboardProps {
  onNavigate?: (page: string) => void;
}

interface DashboardMetrics {
  timeSaved: {
    currentHours: number;
    baselineHours: number;
    targetHours: number;
    savedPercentage: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  lostOrdersCost: {
    currentCost: number;
    baselineCost: number;
    targetCost: number;
    reductionPercentage: number;
    cancelledCount: number;
    atRiskCount: number;
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
  retentionGrowth: {
    currentReturning: number;
    baselineReturning: number;
    targetReturning: number;
    growthPercentage: number;
    totalCustomers: number;
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
  businessHealth: {
    score: number;
    breakdown: {
      timeTarget: boolean;
      lostOrdersTarget: boolean;
      retentionTarget: boolean;
      depositTarget: boolean;
    };
    trend: {
      value: string;
      period: string;
      direction: 'up' | 'down' | 'neutral';
    };
  };
}

export function OwnerDashboard({ onNavigate }: OwnerDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activityEvents, setActivityEvents] = useState<any[]>([]);
  const [approvalQueue, setApprovalQueue] = useState<any[]>([]);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = (window as any).__APP_AUTH__ ?? { user: null };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [metricsRes, activityRes] = await Promise.all([
        fetch('/api/dashboards/owner', { headers }),
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
        console.log('API not available, using mock data for Owner dashboard');
        const mockData = MOCK_DASHBOARD_DATA.owner;
        setMetrics(mockData);
        
        const mockActivities = MOCK_ACTIVITY_EVENTS.map(event => ({
          id: event.id,
          type: event.type,
          user: { name: event.user, role: 'owner', avatar: undefined },
          action: event.message,
          timestamp: event.timestamp,
          metadata: {},
        }));
        setActivityEvents(mockActivities);
      }
    } catch (error) {
      console.error('Failed to fetch owner dashboard:', error);
      // Fallback to mock data on error
      const mockData = MOCK_DASHBOARD_DATA.owner;
      setMetrics(mockData);
      
      const mockActivities = MOCK_ACTIVITY_EVENTS.map(event => ({
        id: event.id,
        type: event.type,
        user: { name: event.user, role: 'owner', avatar: undefined },
        action: event.message,
        timestamp: event.timestamp,
        metadata: {},
      }));
      setActivityEvents(mockActivities);
    } finally {
      setLoading(false);
      // load approval queue after metrics
      await loadApprovalQueue();
    }
  };

  async function loadApprovalQueue() {
    try {
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, pickup_date, status, total_amount, customer_id, customers(full_name, phone)')
        .in('status', ['pending_approval', 'awaiting_approval', 'completed'])
        .order('pickup_date', { ascending: true })
        .limit(100);

      setApprovalQueue(data || []);
    } catch (err) {
      console.error('Failed to load approval queue', err);
      setApprovalQueue([]);
    }
  }

  async function approveOrder(orderId: string) {
    // role check - only owner or manager can do final approval (owner preferred)
    try {
      const storedUser = getCurrentUser();
      if (!storedUser || !['owner', 'manager'].includes(storedUser.role)) {
        toast.error('Permission denied: only Manager or Owner can approve orders');
        return;
      }

      setApprovingId(orderId);

      const payload: any = { status: 'ready', approved: true, approved_at: new Date().toISOString() };
      if (storedUser?.id) payload.approved_by = storedUser.id;

      const { error } = await supabase.from('orders').update(payload).eq('id', orderId);
      if (error) {
        throw error;
      }

      // optimistic UI update
      setApprovalQueue(prev => prev.filter(o => o.id !== orderId));
      toast.success('Order approved');
    } catch (err) {
      console.error('Approve failed', err);
      toast.error('Failed to approve order');
    } finally {
      setApprovingId(null);
    }
  }

  function getCurrentUser() {
    // Prefer useAuth if available; fall back to window-scoped user
    try {
      // try to import useAuth dynamically to avoid circular deps
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const auth = require('../../../context/AuthContext');
      if (auth && typeof auth.useAuth === 'function') {
        const a = auth.useAuth();
        return a.user ?? (window as any).__APP_AUTH__?.user ?? null;
      }
    } catch (e) {
      // ignore
    }
    return (window as any).__APP_AUTH__?.user ?? null;
  }

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="sales-dashboard-container">
        <KPICardV2
          title="Total Orders"
          value={0}
          trend={{ value: 'Loading...', period: '', direction: 'neutral' }}
          icon={BarChart3}
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

  return (
    <div className="sales-dashboard-container">
      <div className="sales-dashboard-header">
        <h1>Owner Dashboard</h1>
        <p>Business intelligence and strategic overview</p>
      </div>

      <div className="kpi-grid">
        <KPICardV2
          title="Time Saved"
          value={`${metrics.timeSaved.currentHours}hrs/wk`}
          subtitle={`Target: ${metrics.timeSaved.targetHours}hrs (${metrics.timeSaved.savedPercentage}% saved)`}
          trend={metrics.timeSaved.trend}
          icon={BarChart3}
          iconColor={metrics.timeSaved.currentHours <= metrics.timeSaved.targetHours ? '#10B981' : '#F59E0B'}
          onClick={() => {}}
        />
        <KPICardV2
          title="Lost Orders Cost"
          value={formatCurrency(metrics.lostOrdersCost.currentCost)}
          subtitle={`Target: ${formatCurrency(metrics.lostOrdersCost.targetCost)} (${metrics.lostOrdersCost.reductionPercentage}% reduced)`}
          trend={metrics.lostOrdersCost.trend}
          icon={DollarSign}
          iconColor={metrics.lostOrdersCost.currentCost <= metrics.lostOrdersCost.targetCost ? '#10B981' : '#F59E0B'}
          onClick={() => {}}
        />
        <KPICardV2
          title="Retention Growth"
          value={metrics.retentionGrowth.currentReturning}
          subtitle={`Target: ${metrics.retentionGrowth.targetReturning} (${metrics.retentionGrowth.growthPercentage}% growth)`}
          trend={metrics.retentionGrowth.trend}
          icon={Users}
          iconColor={metrics.retentionGrowth.currentReturning >= metrics.retentionGrowth.targetReturning ? '#10B981' : '#F59E0B'}
          onClick={() => {}}
        />
        <KPICardV2
          title="Deposit Compliance"
          value={`${metrics.depositCompliance.rate}%`}
          subtitle={`${metrics.depositCompliance.compliantCount}/${metrics.depositCompliance.totalCount} compliant`}
          trend={metrics.depositCompliance.trend}
          icon={DollarSign}
          iconColor={metrics.depositCompliance.rate >= 90 ? '#10B981' : metrics.depositCompliance.rate >= 75 ? '#F59E0B' : '#EF4444'}
          onClick={() => {}}
        />
        <KPICardV2
          title="Business Health"
          value={`${metrics.businessHealth.score}/100`}
          trend={metrics.businessHealth.trend}
          icon={Award}
          iconColor={metrics.businessHealth.score >= 85 ? '#10B981' : metrics.businessHealth.score >= 70 ? '#F59E0B' : '#EF4444'}
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
        <Button
          variant="secondary"
          leftIcon={<Settings size={18} />}
          onClick={() => onNavigate?.('system-configuration')}
        >
          System Configuration
        </Button>
      </div>

      <div className="data-section">
        <div className="recent-orders-card">
          <h3>Strategic Overview</h3>
          <p style={{ padding: '20px', color: '#5A3825' }}>
            Complete access to all business operations, team management, and strategic planning tools.
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
