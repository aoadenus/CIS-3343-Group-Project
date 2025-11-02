import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Download, Mail, Loader2, Calendar } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { StandardButton } from '../components/StandardButton';

const monthlyRevenue = [
  { month: 'Jan', revenue: 6800 },
  { month: 'Feb', revenue: 7200 },
  { month: 'Mar', revenue: 6500 },
  { month: 'Apr', revenue: 7800 },
  { month: 'May', revenue: 7400 },
  { month: 'Jun', revenue: 8200 },
];

const topSellingCakes = [
  { name: 'Birthday Celebration', sales: 45 },
  { name: 'Lemon Doberge', sales: 38 },
  { name: 'German Chocolate', sales: 35 },
  { name: 'Black Forest', sales: 30 },
  { name: 'Almond Delight', sales: 28 },
];

const customerReturnData = [
  { name: 'New Customers', value: 35, color: '#C44569' },
  { name: 'Returning', value: 45, color: '#5A3825' },
  { name: 'VIP Regulars', value: 20, color: '#2B2B2B' },
];

const completionTime = [
  { day: 'Mon', hours: 24 },
  { day: 'Tue', hours: 28 },
  { day: 'Wed', hours: 22 },
  { day: 'Thu', hours: 26 },
  { day: 'Fri', hours: 30 },
  { day: 'Sat', hours: 25 },
  { day: 'Sun', hours: 20 },
];

export function Reports() {
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [dateRange, setDateRange] = useState('Last 6 Months');

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('success', 'Your PDF report has been saved to downloads.', 'Report Downloaded');
    setIsDownloading(false);
  };

  const handleEmail = async () => {
    setIsEmailing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('success', 'Monthly report sent to your email address.', 'Report Emailed');
    setIsEmailing(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569' }}>Reports & Analytics</h1>
          <p className="tagline mt-2" style={{ fontFamily: 'Lucida Handwriting', fontSize: '16px', color: '#C44569', opacity: 0.9 }}>
            Insights for sweet success
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleEmail}
            disabled={isEmailing}
            variant="outline"
            className="w-full sm:w-auto"
            style={{ 
              borderRadius: '8px', 
              fontFamily: 'Poppins', 
              fontWeight: 600,
              borderColor: 'rgba(90, 56, 37, 0.3)',
              color: '#5A3825',
              height: '44px',
              minWidth: '44px'
            }}
          >
            {isEmailing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={18} className="mr-2" />
                Email Report
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-white w-full sm:w-auto hover:shadow-bakery-hover transition-all"
            style={{ 
              borderRadius: '8px', 
              fontFamily: 'Poppins', 
              fontWeight: 600,
              backgroundColor: '#C44569',
              height: '44px',
              minWidth: '44px'
            }}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Download PDF
              </>
            )}
          </Button>
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
              <Bar dataKey="sales" fill="#5A3825" radius={[0, 8, 8, 0]} />
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
              dataKey="hours" 
              stroke="#C44569" 
              strokeWidth={3}
              dot={{ fill: '#C44569', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
            Total Revenue (YTD)
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', color: '#C44569' }}>
            $44,900
          </p>
        </Card>
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
            Total Orders
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', color: '#2B2B2B' }}>
            176
          </p>
        </Card>
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
            Avg Order Value
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', color: '#5A3825' }}>
            $255
          </p>
        </Card>
        <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
            Customer Satisfaction
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', color: '#C44569' }}>
            98%
          </p>
        </Card>
      </div>
    </div>
  );
}
