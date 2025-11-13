import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileDown, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { OrderSummaryResponse, OrderSummaryFilters } from '../../types/reports';

const ORDER_STATUSES = ['all', 'pending', 'confirmed', 'baking', 'decorating', 'ready', 'completed', 'cancelled'];

export function OrderSummaryReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [data, setData] = useState<OrderSummaryResponse | null>(null);
  
  // Default to last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const [filters, setFilters] = useState<OrderSummaryFilters>({
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
    status: 'all'
  });

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      const response = await fetch(`/api/reports/order-summary?${params}`);
      if (!response.ok) throw new Error('Failed to fetch report data');
      
      const reportData = await response.json();
      setData(reportData);
    } catch (error) {
      console.error('Error fetching report:', error);
      showToast('error', 'Failed to load report data. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const handleExportCSV = () => {
    if (!data) return;
    
    setExportingCSV(true);
    
    // Create CSV content
    const headers = ['Order #', 'Customer Name', 'Email', 'Phone', 'Pickup Date', 'Status', 'Total Price', 'Balance Due'];
    const rows = data.orders.map(order => [
      order.id,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      new Date(order.eventDate).toLocaleDateString(),
      order.status,
      order.totalAmount ? `$${order.totalAmount.toLocaleString()}` : 'N/A',
      order.balanceDue ? `$${order.balanceDue.toLocaleString()}` : 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-summary-${filters.startDate}-to-${filters.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setExportingCSV(false);
      showToast('success', 'CSV file downloaded successfully', 'Export Complete');
    }, 800);
  };

  const handleExportPDF = () => {
    setExportingPDF(true);
    setTimeout(() => {
      setExportingPDF(false);
      showToast('info', 'PDF export will be available in a future update', 'Coming Soon');
    }, 1000);
  };

  const formatChartDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      baking: 'bg-purple-100 text-purple-800',
      decorating: 'bg-pink-100 text-pink-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569', fontSize: 'clamp(28px, 5vw, 36px)' }}>
            Order Summary Report
          </h1>
          <p className="mt-2" style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825', opacity: 0.8 }}>
            Comprehensive order analytics and trends
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleExportCSV}
            disabled={exportingCSV || !data}
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
            {exportingCSV ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown size={18} className="mr-2" />
                Export CSV
              </>
            )}
          </Button>
          <Button
            onClick={handleExportPDF}
            disabled={exportingPDF || !data}
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
            {exportingPDF ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
              Start Date
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}
            />
          </div>
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
              End Date
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}
            />
          </div>
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
              Status Filter
            </label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map(status => (
                  <SelectItem key={status} value={status} style={{ fontFamily: 'Open Sans' }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
                Total Orders
              </p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '36px', color: '#2B2B2B' }}>
                {data.totals.count}
              </p>
            </Card>
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
                Total Revenue
              </p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '36px', color: '#C44569' }}>
                ${data.totals.revenue.toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
                Orders by Day
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
                {new Date(filters.startDate).toLocaleDateString()} - {new Date(filters.endDate).toLocaleDateString()}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 56, 37, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#5A3825" 
                  style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }}
                  tickFormatter={formatChartDate}
                />
                <YAxis 
                  stroke="#5A3825" 
                  style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }}
                  allowDecimals={false}
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
                  formatter={(value: any) => [value, 'Orders']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  labelStyle={{ fontWeight: 600, color: '#2B2B2B', marginBottom: '4px' }}
                />
                <Bar dataKey="count" fill="#C44569" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Orders Table */}
          <Card className="p-6 lg:p-8 rounded-xl bg-white overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <h2 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
              Order Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontFamily: 'Open Sans' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(90, 56, 37, 0.15)' }}>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Order #</th>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Customer</th>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Pickup Date</th>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Status</th>
                    <th className="text-right py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Price</th>
                    <th className="text-right py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(90, 56, 37, 0.08)' }}>
                      <td className="py-4 px-2" style={{ fontSize: '14px', color: '#2B2B2B', fontWeight: 600 }}>
                        #{order.id}
                      </td>
                      <td className="py-4 px-2" style={{ fontSize: '14px', color: '#2B2B2B' }}>
                        {order.customerName}
                      </td>
                      <td className="py-4 px-2" style={{ fontSize: '14px', color: '#5A3825' }}>
                        {new Date(order.eventDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        <span 
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right" style={{ fontSize: '14px', color: '#2B2B2B', fontWeight: 600 }}>
                        {order.totalAmount ? `$${order.totalAmount.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="py-4 px-2 text-right" style={{ fontSize: '14px', color: order.balanceDue && order.balanceDue > 0 ? '#C44569' : '#2B2B2B', fontWeight: 600 }}>
                        {order.balanceDue ? `$${order.balanceDue.toLocaleString()}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr style={{ borderTop: '2px solid rgba(90, 56, 37, 0.15)', backgroundColor: 'rgba(196, 69, 105, 0.05)' }}>
                    <td colSpan={4} className="py-4 px-2" style={{ fontSize: '15px', color: '#2B2B2B', fontWeight: 700 }}>
                      TOTALS
                    </td>
                    <td className="py-4 px-2 text-right" style={{ fontSize: '15px', color: '#2B2B2B', fontWeight: 700 }}>
                      ${data.totals.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-2 text-right" style={{ fontSize: '14px', color: '#5A3825', fontWeight: 600 }}>
                      {data.totals.count} orders
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825' }}>
            No data available for the selected filters
          </p>
        </Card>
      )}
    </div>
  );
}
