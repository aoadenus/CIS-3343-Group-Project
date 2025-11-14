import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Loader2, Calendar } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface ReportsProps {
  onNavigate?: (page: string) => void;
  userRole?: string;
}

interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

interface TopSellingCake {
  name: string;
  count: number;
}

interface CustomerDistributionData {
  name: string;
  value: number;
  color: string;
}

interface CompletionTimeData {
  day: string;
  avgHours: number;
}

const ALLOWED_FINANCIAL_ROLES = ['accountant', 'manager', 'owner'];

export function Reports({ onNavigate, userRole }: ReportsProps = { onNavigate: undefined, userRole: undefined }) {
  const canViewFinancialReports = userRole && ALLOWED_FINANCIAL_ROLES.includes(userRole);
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueData[]>([]);
  const [topSellingCakes, setTopSellingCakes] = useState<TopSellingCake[]>([]);
  const [customerReturnData, setCustomerReturnData] = useState<CustomerDistributionData[]>([]);
  const [completionTime, setCompletionTime] = useState<CompletionTimeData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(0);
  const [dateRange] = useState('Last 6 Months');

  useEffect(() => {
    const fetchReportsData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        // Guard against missing token
        if (!token) {
          showToast('error', 'Authentication required. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/reports/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();

        setMonthlyRevenue(data.monthlyRevenue);
        setTopSellingCakes(data.topSellingCakes);
        
        setCustomerReturnData([
          { name: 'New Customers', value: data.customerDistribution.new, color: '#C44569' },
          { name: 'Returning', value: data.customerDistribution.returning, color: '#5A3825' },
          { name: 'VIP Regulars', value: data.customerDistribution.vip, color: '#2B2B2B' },
        ]);

        setCompletionTime(data.completionTimeByDay);
        setTotalRevenue(data.kpis.totalRevenue);
        setTotalOrders(data.kpis.totalOrders);
        setAvgOrderValue(data.kpis.avgOrderValue);

      } catch (error) {
        console.error('Error fetching reports data:', error);
        showToast('error', 'Failed to load reports data. Please try again.', 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* General Reports - Sales, Baker, Decorator, Accountant, Manager, Owner */}
      {onNavigate && (
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <h2 className="mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 22px)', color: '#2B2B2B' }}>
            General Reports
          </h2>
          <p className="mb-4" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>
            Available to Sales, Baker, Decorator, Accountant, Manager, and Owner roles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              onClick={() => onNavigate('order-summary-report')}
              variant="outline"
              className="justify-start h-auto py-4 px-4"
              style={{ 
                borderRadius: '8px', 
                fontFamily: 'Open Sans',
                borderColor: 'rgba(90, 56, 37, 0.3)',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#2B2B2B', fontSize: '15px' }}>Order Summary</div>
                <div style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '2px' }}>View order trends and analytics</div>
              </div>
            </Button>
            <Button
              onClick={() => onNavigate('customer-list-report')}
              variant="outline"
              className="justify-start h-auto py-4 px-4"
              style={{ 
                borderRadius: '8px', 
                fontFamily: 'Open Sans',
                borderColor: 'rgba(90, 56, 37, 0.3)',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#2B2B2B', fontSize: '15px' }}>Customer List</div>
                <div style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '2px' }}>Customer acquisition and contact info</div>
              </div>
            </Button>
            <Button
              onClick={() => onNavigate('pending-orders-report')}
              variant="outline"
              className="justify-start h-auto py-4 px-4"
              style={{ 
                borderRadius: '8px', 
                fontFamily: 'Open Sans',
                borderColor: 'rgba(90, 56, 37, 0.3)',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#2B2B2B', fontSize: '15px' }}>Pending Orders</div>
                <div style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '2px' }}>Track orders by status with urgency</div>
              </div>
            </Button>
            <Button
              onClick={() => onNavigate('completed-orders-report')}
              variant="outline"
              className="justify-start h-auto py-4 px-4"
              style={{ 
                borderRadius: '8px', 
                fontFamily: 'Open Sans',
                borderColor: 'rgba(90, 56, 37, 0.3)',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#2B2B2B', fontSize: '15px' }}>Completed Orders</div>
                <div style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '2px' }}>Completion times and performance</div>
              </div>
            </Button>
          </div>
        </Card>
      )}

      {/* Inventory Reports - Accountant, Manager & Owner */}
      {onNavigate && userRole && ['accountant', 'manager', 'owner'].includes(userRole) && (
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)', border: '2px solid rgba(90, 56, 37, 0.2)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5A3825' }}></div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 22px)', color: '#5A3825' }}>
              Inventory Reports
            </h2>
          </div>
          <p className="mb-4" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>
            Available to Accountant, Manager, and Owner roles (Financial & Inventory Data)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              onClick={() => onNavigate('product-inventory-report')}
              variant="outline"
              className="justify-start h-auto py-4 px-4"
              style={{ 
                borderRadius: '8px', 
                fontFamily: 'Open Sans',
                borderColor: 'rgba(90, 56, 37, 0.4)',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#5A3825', fontSize: '15px' }}>Product Inventory</div>
                <div style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '2px' }}>Top products by revenue and frequency</div>
              </div>
            </Button>
          </div>
        </Card>
      )}

      {/* Financial Reports - Accountant & Manager Access */}
      {onNavigate && canViewFinancialReports && (
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)', border: '2px solid rgba(196, 69, 105, 0.2)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C44569' }}></div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 22px)', color: '#C44569' }}>
              Financial Reports
            </h2>
          </div>
          <p className="mb-4" style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>
            Restricted to Accountant and Manager roles only
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              onClick={() => onNavigate('revenue-report')}
              variant="outline"
              className="justify-start h-auto py-4 px-4"
              style={{ 
                borderRadius: '8px', 
                fontFamily: 'Open Sans',
                borderColor: 'rgba(196, 69, 105, 0.4)',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#C44569', fontSize: '15px' }}>Revenue Report</div>
                <div style={{ fontSize: '13px', color: '#5A3825', opacity: 0.7, marginTop: '2px' }}>Financial analytics and collection tracking</div>
              </div>
            </Button>
          </div>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569' }}>Reports & Analytics</h1>
          <p className="tagline mt-2" style={{ fontFamily: 'Lucida Handwriting', fontSize: '16px', color: '#C44569', opacity: 0.9 }}>
            Insights for sweet success
          </p>
        </div>
      </div>

      {/* Revenue Overview - Line Chart with Gradient Fill */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
            Monthly Revenue Trend
          </h2>
          <div className="flex items-center gap-2" style={{
            padding: '8px 12px',
            background: 'rgba(196, 69, 105, 0.08)',
            borderRadius: '8px',
            fontFamily: 'Open Sans',
            fontSize: '13px',
            color: '#5A3825'
          }}>
            <Calendar size={16} color="#C44569" />
            {dateRange}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C44569" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#C44569" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 56, 37, 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#5A3825" 
              style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }} 
            />
            <YAxis 
              stroke="#5A3825" 
              style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }} 
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '2px solid #C44569', 
                borderRadius: '8px',
                fontFamily: 'Open Sans',
                boxShadow: '0px 4px 16px rgba(196, 69, 105, 0.2)',
                padding: '12px'
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              labelStyle={{ fontWeight: 600, color: '#2B2B2B', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#C44569" 
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={{ fill: '#C44569', r: 5, strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Selling Cakes */}
        <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <h3 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>
            Top Selling Cakes
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topSellingCakes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 56, 37, 0.1)" />
              <XAxis type="number" stroke="#5A3825" style={{ fontFamily: 'Open Sans', fontSize: '12px' }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#5A3825" 
                width={120}
                style={{ fontFamily: 'Open Sans', fontSize: '12px' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #C44569', 
                  borderRadius: '8px',
                  fontFamily: 'Open Sans',
                  boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)'
                }} 
              />
              <Bar dataKey="count" fill="#5A3825" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Customer Distribution */}
        <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <h3 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#2B2B2B' }}>
            Customer Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={customerReturnData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerReturnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #C44569', 
                  borderRadius: '8px',
                  fontFamily: 'Open Sans',
                  boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2">
            {customerReturnData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Order Completion Time */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <h2 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
          Average Order Completion Time
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={completionTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 56, 37, 0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="#5A3825" 
              style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }} 
            />
            <YAxis 
              stroke="#5A3825" 
              style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: '#5A3825', fontFamily: 'Open Sans' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #C44569', 
                borderRadius: '8px',
                fontFamily: 'Open Sans',
                boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="avgHours" 
              stroke="#C44569" 
              strokeWidth={3}
              dot={{ fill: '#C44569', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
            Total Revenue (Last 6 Months)
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', color: '#C44569' }}>
            ${totalRevenue.toLocaleString()}
          </p>
        </Card>
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
            Total Orders
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', color: '#2B2B2B' }}>
            {totalOrders}
          </p>
        </Card>
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
            Avg Order Value
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', color: '#5A3825' }}>
            ${avgOrderValue.toLocaleString()}
          </p>
        </Card>
      </div>
    </div>
  );
}
