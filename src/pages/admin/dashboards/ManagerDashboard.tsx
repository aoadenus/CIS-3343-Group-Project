import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, ShoppingCart, Users, TrendingUp, Package, Calendar, 
  Settings, FileText, Clock, CheckCircle, AlertCircle, ArrowRight 
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateDemoOrders, generateDemoRevenueTrend, generateDemoActivity, shouldUseDemoMode } from '../../../data/demoData';

interface ManagerDashboardProps {
  onNavigate?: (page: string) => void;
}

export function ManagerDashboard({ onNavigate }: ManagerDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

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
        
        // Enable demo mode if no real orders exist
        if (shouldUseDemoMode(data)) {
          setOrders(generateDemoOrders());
          setIsDemoMode(true);
        } else {
          setOrders(data);
          setIsDemoMode(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Fall back to demo mode on error
      setOrders(generateDemoOrders());
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  // Manager-level analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status || '')).length;
  
  // Today's pickups
  const todayPickups = orders.filter(o => {
    const today = new Date().toDateString();
    return o.eventDate && new Date(o.eventDate).toDateString() === today;
  }).length;
  
  // Unique customers
  const uniqueCustomers = new Set(orders.map(o => o.customerId)).size;

  // Revenue trend data
  const revenueTrend = isDemoMode ? generateDemoRevenueTrend() : [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 5100 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6200 },
    { month: 'May', revenue: 7100 },
    { month: 'Jun', revenue: 6800 }
  ];

  // Order status distribution
  const statusData = [
    { status: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { status: 'Preparing', count: orders.filter(o => ['baking', 'decorating'].includes(o.status || '')).length },
    { status: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { status: 'Completed', count: completedOrders }
  ];
  
  // Recent activity
  const recentActivity = isDemoMode ? generateDemoActivity() : [];
  
  // Ready for pickup
  const readyForPickup = orders
    .filter(o => o.status === 'ready')
    .slice(0, 5);

  // Brand colors (locked in from design system)
  const brandColors = {
    raspberry: '#C14B78',
    darkChocolate: '#3C2B2F',
    creamyVanilla: '#F7EAD9',
    softPeach: '#F3D8C1',
    latteBeige: '#EDD8C3',
    blackCoffee: '#2C2224'
  };

  // Tier 1 KPI Card Component
  const Tier1KPICard = ({ title, value, change, icon: Icon, color, emptyMessage }: any) => (
    <Card style={{ 
      background: 'white', 
      border: 'none', 
      boxShadow: '0 4px 12px rgba(60, 43, 47, 0.08)',
      transition: 'all 0.2s ease'
    }}
    className="hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={32} color={color} />
          </div>
          {change && (
            <Badge 
              variant={change.startsWith('+') ? "default" : "secondary"}
              style={{ 
                background: change.startsWith('+') ? '#10B98115' : '#DC354515',
                color: change.startsWith('+') ? '#10B981' : '#DC3545',
                border: 'none'
              }}
            >
              {change}
            </Badge>
          )}
        </div>
        
        <p style={{ 
          fontFamily: 'Open Sans, sans-serif', 
          fontSize: '13px', 
          color: '#999', 
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </p>
        
        {value === 0 || value === '$0' ? (
          <div>
            <p style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '36px', 
              fontWeight: 700, 
              color: '#E5E7EB',
              marginBottom: '4px' 
            }}>
              {value}
            </p>
            <p style={{ 
              fontFamily: 'Open Sans, sans-serif', 
              fontSize: '12px', 
              color: '#999',
              fontStyle: 'italic'
            }}>
              {emptyMessage}
            </p>
          </div>
        ) : (
          <p style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontSize: '36px', 
            fontWeight: 700, 
            color: brandColors.darkChocolate,
            marginBottom: '4px' 
          }}>
            {value}
          </p>
        )}
      </div>
    </Card>
  );

  // Tier 2 KPI Card Component (smaller)
  const Tier2KPICard = ({ title, value, icon: Icon, color }: any) => (
    <Card style={{ 
      background: 'white', 
      border: 'none', 
      boxShadow: '0 2px 8px rgba(60, 43, 47, 0.06)',
      transition: 'all 0.2s ease'
    }}
    className="hover:-translate-y-0.5"
    >
      <div className="p-4 flex items-center gap-3">
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}10`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={24} color={color} />
        </div>
        <div className="flex-1">
          <p style={{ 
            fontFamily: 'Open Sans, sans-serif', 
            fontSize: '11px', 
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '2px'
          }}>
            {title}
          </p>
          <p style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontSize: '20px', 
            fontWeight: 600, 
            color: brandColors.darkChocolate
          }}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: brandColors.creamyVanilla }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full" style={{ background: `${brandColors.raspberry}20` }}>
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-raspberry animate-spin" style={{ borderTopColor: brandColors.raspberry }}></div>
          </div>
          <p style={{ fontFamily: 'Open Sans, sans-serif', color: brandColors.blackCoffee }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto" style={{ background: brandColors.creamyVanilla, padding: 'clamp(20px, 4vw, 40px)' }}>
      {/* Demo Mode Badge */}
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Badge style={{ 
            background: '#3B82F615', 
            color: '#3B82F6', 
            border: '1px solid #3B82F630',
            padding: '6px 12px'
          }}>
            <AlertCircle size={14} className="inline mr-2" />
            Demo Mode Active - Showing sample data
          </Badge>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 700,
          color: brandColors.darkChocolate,
          marginBottom: '8px'
        }}>
          Manager Dashboard
        </h1>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: brandColors.blackCoffee }}>
          {isDemoMode 
            ? 'Welcome! Create your first order to see real business data.' 
            : 'Complete business overview and system management'
          }
        </p>
      </motion.div>

      {/* Quick Actions - Above the Fold */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => onNavigate?.('order-create')}
            style={{
              background: brandColors.raspberry,
              color: 'white',
              borderRadius: '24px',
              padding: '12px 24px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: `0 4px 12px ${brandColors.raspberry}30`
            }}
            className="hover:scale-105 transition-transform"
          >
            <Package size={18} className="mr-2" />
            Create Order
          </Button>
          
          <Button
            onClick={() => onNavigate?.('order-management')}
            variant="outline"
            style={{
              borderRadius: '24px',
              padding: '12px 24px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              borderColor: brandColors.darkChocolate,
              color: brandColors.darkChocolate
            }}
            className="hover:bg-gray-50"
          >
            <ShoppingCart size={18} className="mr-2" />
            View All Orders
          </Button>
          
          <Button
            onClick={() => onNavigate?.('business-intelligence')}
            variant="outline"
            style={{
              borderRadius: '24px',
              padding: '12px 24px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              borderColor: '#3B82F6',
              color: '#3B82F6'
            }}
            className="hover:bg-blue-50"
          >
            <FileText size={18} className="mr-2" />
            Business Intelligence
          </Button>
        </div>
      </motion.div>

      {/* Tier 1 KPIs - Larger, Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Tier1KPICard
          title="Total Revenue"
          value={`$${(totalRevenue / 100).toFixed(0)}`}
          change="+18.2%"
          icon={DollarSign}
          color="#10B981"
          emptyMessage="Create orders to track revenue"
        />
        <Tier1KPICard
          title="Active Orders"
          value={activeOrders}
          icon={ShoppingCart}
          color={brandColors.raspberry}
          emptyMessage="No active orders yet"
        />
        <Tier1KPICard
          title="Today's Pickups"
          value={todayPickups}
          icon={Clock}
          color="#F59E0B"
          emptyMessage="No pickups scheduled today"
        />
        <Tier1KPICard
          title="Completed Today"
          value={completedOrders}
          change="+12%"
          icon={CheckCircle}
          color={brandColors.darkChocolate}
          emptyMessage="Complete your first order"
        />
      </div>

      {/* Tier 2 KPIs - Smaller, Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Tier2KPICard
          title="Avg Order Value"
          value={`$${(avgOrderValue / 100).toFixed(0)}`}
          icon={TrendingUp}
          color={brandColors.raspberry}
        />
        <Tier2KPICard
          title="Total Customers"
          value={uniqueCustomers}
          icon={Users}
          color={brandColors.blackCoffee}
        />
        <Tier2KPICard
          title="Pending Orders"
          value={orders.filter(o => o.status === 'pending').length}
          icon={Package}
          color="#F59E0B"
        />
        <Tier2KPICard
          title="Ready to Ship"
          value={orders.filter(o => o.status === 'ready').length}
          icon={CheckCircle}
          color="#10B981"
        />
      </div>

      {/* Charts & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(60, 43, 47, 0.08)' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: brandColors.darkChocolate
              }}>
                Revenue Trend
              </h3>
              <Badge variant="outline" style={{ borderColor: brandColors.raspberry, color: brandColors.raspberry }}>
                Last 6 Months
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={brandColors.raspberry} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={brandColors.raspberry} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  style={{ fontSize: '12px', fontFamily: 'Open Sans, sans-serif', fill: '#999' }}
                  stroke="#E5E7EB"
                />
                <YAxis 
                  style={{ fontSize: '12px', fontFamily: 'Open Sans, sans-serif', fill: '#999' }}
                  stroke="#E5E7EB"
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white',
                    border: `2px solid ${brandColors.raspberry}`,
                    borderRadius: '12px',
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={brandColors.raspberry} 
                  strokeWidth={3}
                  dot={{ fill: brandColors.raspberry, r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Revenue ($)" 
                  fill="url(#revenueGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(60, 43, 47, 0.08)' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: brandColors.darkChocolate
              }}>
                Order Status Distribution
              </h3>
            </div>
            {statusData.every(s => s.count === 0) ? (
              <div className="flex flex-col items-center justify-center h-[280px] text-center">
                <Package size={64} color="#E5E7EB" className="mb-4" />
                <p style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#999',
                  marginBottom: '8px'
                }}>
                  No orders yet
                </p>
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#999' }}>
                  Create your first order to see status breakdown
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="status" 
                    style={{ fontSize: '12px', fontFamily: 'Open Sans, sans-serif', fill: '#999' }}
                    stroke="#E5E7EB"
                  />
                  <YAxis 
                    style={{ fontSize: '12px', fontFamily: 'Open Sans, sans-serif', fill: '#999' }}
                    stroke="#E5E7EB"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white',
                      border: `2px solid ${brandColors.raspberry}`,
                      borderRadius: '12px',
                      fontFamily: 'Open Sans, sans-serif'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }} />
                  <Bar 
                    dataKey="count" 
                    fill={brandColors.raspberry} 
                    name="Orders"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Ready for Pickup & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ready for Pickup */}
        <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(60, 43, 47, 0.08)' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: brandColors.darkChocolate
              }}>
                Ready for Pickup
              </h3>
              <Badge style={{ background: '#10B98115', color: '#10B981', border: 'none' }}>
                {readyForPickup.length} Orders
              </Badge>
            </div>
            
            {readyForPickup.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={48} color="#E5E7EB" className="mx-auto mb-3" />
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#999' }}>
                  No orders ready for pickup
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {readyForPickup.map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: brandColors.darkChocolate }}>
                        {order.customerName || 'Customer'}
                      </p>
                      <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#999' }}>
                        {order.cakeType} • {new Date(order.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge style={{ background: '#10B98115', color: '#10B981', border: 'none' }}>
                      Ready
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(60, 43, 47, 0.08)' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: brandColors.darkChocolate
              }}>
                Recent Activity
              </h3>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle size={48} color="#E5E7EB" className="mx-auto mb-3" />
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#999' }}>
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 mt-0.5"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${brandColors.raspberry}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ArrowRight size={16} color={brandColors.raspberry} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: brandColors.darkChocolate }}>
                        {activity.message}
                      </p>
                      <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#999' }}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
