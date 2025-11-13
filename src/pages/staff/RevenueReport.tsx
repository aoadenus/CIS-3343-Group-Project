import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileDown, Loader2, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { RevenueReportResponse } from '../../types/reports';

const TIME_PERIODS = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' }
];

const PIE_COLORS = ['#C44569', '#5A3825', '#F0E5D8', '#E8B4BC', '#8B6F47'];

export function RevenueReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [data, setData] = useState<RevenueReportResponse | null>(null);
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('period', selectedPeriod);
      
      if (selectedPeriod === 'custom') {
        if (customStartDate) params.append('startDate', customStartDate);
        if (customEndDate) params.append('endDate', customEndDate);
      }
      
      const response = await fetch(`/api/reports/revenue?${params}`);
      if (!response.ok) throw new Error('Failed to fetch report data');
      
      const reportData = await response.json();
      setData(reportData);
    } catch (error) {
      console.error('Error fetching report:', error);
      showToast('error', 'Failed to load revenue report. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, customStartDate, customEndDate]);

  const escapeCSVField = (field: string | number | null): string => {
    if (field === null) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const handleExportCSV = () => {
    if (!data) return;
    
    setExportingCSV(true);
    
    // Create comprehensive CSV with KPIs and trend data
    const headers = ['Period', 'Revenue'];
    const rows = data.trendChart.data.map(item => [
      escapeCSVField(formatPeriodLabel(item.period, data.trendChart.bucketFormat)),
      escapeCSVField((item.revenue / 100).toFixed(2))
    ]);
    
    const kpiSection = [
      ['Revenue Report'],
      [''],
      ['KPIs'],
      ['Total Revenue', `$${(data.kpis.totalRevenue / 100).toFixed(2)}`],
      ['Total Deposits', `$${(data.kpis.totalDeposits / 100).toFixed(2)}`],
      ['Outstanding', `$${(data.kpis.totalOutstanding / 100).toFixed(2)}`],
      ['Collection Rate', `${data.kpis.collectionRate}%`],
      [''],
      ['Revenue Trend']
    ];
    
    const csvContent = [
      ...kpiSection.map(row => row.join(',')),
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setExportingCSV(false);
      showToast('success', 'Revenue report exported successfully', 'Export Complete');
    }, 800);
  };

  const formatPeriodLabel = (period: string, format: string) => {
    if (format === 'hour') {
      const date = new Date(period);
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', hour12: true });
    } else if (format === 'day') {
      const date = new Date(period);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (format === 'week') {
      const date = new Date(period);
      return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      const [year, month] = period.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString()}`;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569', fontSize: 'clamp(28px, 5vw, 36px)' }}>
            Revenue Report
          </h1>
          <p className="mt-2" style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825', opacity: 0.8 }}>
            Financial analytics and collection tracking
          </p>
        </div>
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
      </div>

      {/* Time Period Selector */}
      <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
              Time Period
            </label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIODS.map(period => (
                  <SelectItem key={period.value} value={period.value} style={{ fontFamily: 'Open Sans' }}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedPeriod === 'custom' && (
            <>
              <div>
                <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
                  Start Date
                </label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}
                />
              </div>
              <div>
                <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
                  End Date
                </label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                  Total Revenue
                </p>
                <DollarSign size={20} color="#C44569" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '32px', color: '#C44569' }}>
                {formatCurrency(data.kpis.totalRevenue)}
              </p>
            </Card>
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                  Deposits
                </p>
                <TrendingUp size={20} color="#5A3825" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '32px', color: '#5A3825' }}>
                {formatCurrency(data.kpis.totalDeposits)}
              </p>
            </Card>
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                  Outstanding
                </p>
                <AlertCircle size={20} color="#E67E22" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '32px', color: '#E67E22' }}>
                {formatCurrency(data.kpis.totalOutstanding)}
              </p>
            </Card>
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                  Collection Rate
                </p>
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '32px', color: '#2B2B2B' }}>
                {data.kpis.collectionRate}%
              </p>
            </Card>
          </div>

          {/* Line Chart - Revenue Trend */}
          <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <h2 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
              Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.trendChart.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 56, 37, 0.1)" />
                <XAxis 
                  dataKey="period" 
                  stroke="#5A3825" 
                  style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }}
                  tickFormatter={(value) => formatPeriodLabel(value, data.trendChart.bucketFormat)}
                />
                <YAxis 
                  stroke="#5A3825" 
                  style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }}
                  tickFormatter={(value) => formatCurrency(value)}
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
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => formatPeriodLabel(label, data.trendChart.bucketFormat)}
                  labelStyle={{ fontWeight: 600, color: '#2B2B2B', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C44569" 
                  strokeWidth={3}
                  dot={{ fill: '#C44569', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart - Revenue by Product Type */}
            <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <h2 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
                Revenue by Product Type
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.pieChart}
                    dataKey="revenue"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ type, revenue }) => `${type}: ${formatCurrency(revenue)}`}
                  >
                    {data.pieChart.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #C44569', 
                      borderRadius: '8px',
                      fontFamily: 'Open Sans',
                      padding: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar Chart - Monthly Comparison */}
            <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <h2 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
                Monthly Comparison
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.barChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 56, 37, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#5A3825" 
                    style={{ fontFamily: 'Open Sans', fontSize: 'clamp(10px, 2vw, 12px)' }}
                    tickFormatter={formatMonthLabel}
                  />
                  <YAxis 
                    stroke="#5A3825" 
                    style={{ fontFamily: 'Open Sans', fontSize: 'clamp(10px, 2vw, 12px)' }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                    labelFormatter={formatMonthLabel}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #C44569', 
                      borderRadius: '8px',
                      fontFamily: 'Open Sans',
                      padding: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#5A3825" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-12 text-center rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825' }}>
            No revenue data available for the selected period
          </p>
        </Card>
      )}
    </div>
  );
}
