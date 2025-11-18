import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RevenueData {
  name: string;
  revenue: number;
  color: string;
}

interface MonthlyTrendData {
  month: string;
  corporate: number;
  retail: number;
}

interface CustomerRecord {
  id: number;
  name: string;
  type: 'Corporate' | 'Retail';
  orders: number;
  revenue: number;
  avgOrderValue: number;
  lastOrder: string;
}

// Demo data
const revenueSplit: RevenueData[] = [
  { name: 'Corporate', revenue: 42500, color: '#C44569' },
  { name: 'Retail', revenue: 56800, color: '#5A3825' },
];

const monthlyTrend: MonthlyTrendData[] = [
  { month: 'Jan', corporate: 5200, retail: 8500 },
  { month: 'Feb', corporate: 6100, retail: 9200 },
  { month: 'Mar', corporate: 7800, retail: 9800 },
  { month: 'Apr', corporate: 6900, retail: 9100 },
  { month: 'May', corporate: 8200, retail: 10500 },
  { month: 'Jun', corporate: 8300, retail: 9700 },
];

const customerMetrics = [
  { metric: 'Avg Order Value', corporate: '$485', retail: '$142' },
  { metric: 'Orders/Month', corporate: '12', retail: '68' },
  { metric: 'Repeat Rate', corporate: '85%', retail: '42%' },
  { metric: 'Growth Rate', corporate: '+18%', retail: '+8%' },
];

const customerRecords: CustomerRecord[] = [
  { id: 1, name: 'Tech Solutions Inc', type: 'Corporate', orders: 24, revenue: 12800, avgOrderValue: 533, lastOrder: '2024-01-15' },
  { id: 2, name: 'Global Events Co', type: 'Corporate', orders: 18, revenue: 9500, avgOrderValue: 528, lastOrder: '2024-01-12' },
  { id: 3, name: 'City Law Firm', type: 'Corporate', orders: 15, revenue: 7200, avgOrderValue: 480, lastOrder: '2024-01-14' },
  { id: 4, name: 'Jennifer Smith', type: 'Retail', orders: 8, revenue: 1850, avgOrderValue: 231, lastOrder: '2024-01-15' },
  { id: 5, name: 'Metro Hospital', type: 'Corporate', orders: 22, revenue: 13000, avgOrderValue: 591, lastOrder: '2024-01-13' },
  { id: 6, name: 'Robert Johnson', type: 'Retail', orders: 5, revenue: 680, avgOrderValue: 136, lastOrder: '2024-01-10' },
  { id: 7, name: 'Maria Garcia', type: 'Retail', orders: 12, revenue: 2400, avgOrderValue: 200, lastOrder: '2024-01-14' },
  { id: 8, name: 'StartUp Hub', type: 'Corporate', orders: 10, revenue: 4200, avgOrderValue: 420, lastOrder: '2024-01-11' },
];

export function CorporateRetailReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredCustomers = typeFilter === 'all'
    ? customerRecords
    : customerRecords.filter(c => c.type.toLowerCase() === typeFilter);

  const totalRevenue = revenueSplit.reduce((sum, r) => sum + r.revenue, 0);
  const corporateRevenue = revenueSplit.find(r => r.name === 'Corporate')?.revenue || 0;
  const retailRevenue = revenueSplit.find(r => r.name === 'Retail')?.revenue || 0;
  const corporatePercentage = ((corporateRevenue / totalRevenue) * 100).toFixed(1);
  const retailPercentage = ((retailRevenue / totalRevenue) * 100).toFixed(1);

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Customer Name', 'Type', 'Orders', 'Revenue', 'Avg Order Value', 'Last Order'];
    const rows = filteredCustomers.map(customer => [
      customer.name,
      customer.type,
      customer.orders,
      `$${customer.revenue}`,
      `$${customer.avgOrderValue}`,
      customer.lastOrder
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corporate-retail-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setTimeout(() => {
      setExportingCSV(false);
      showToast('success', 'CSV file downloaded', 'Export Complete');
    }, 800);
  };

  const handleExportPDF = () => {
    setExportingPDF(true);

    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setTextColor(196, 69, 105);
      doc.text('Corporate vs Retail Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Corporate: ${corporatePercentage}% | Retail: ${retailPercentage}%`, 14, 35);

      const tableData = filteredCustomers.map(customer => [
        customer.name,
        customer.type,
        customer.orders.toString(),
        `$${customer.revenue}`,
        `$${customer.avgOrderValue}`,
        customer.lastOrder
      ]);

      autoTable(doc, {
        head: [['Name', 'Type', 'Orders', 'Revenue', 'Avg Value', 'Last Order']],
        body: tableData,
        startY: 42,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`corporate-retail-report-${new Date().toISOString().split('T')[0]}.pdf`);

      setTimeout(() => {
        setExportingPDF(false);
        showToast('success', 'PDF file downloaded', 'Export Complete');
      }, 800);
    } catch (error) {
      setExportingPDF(false);
      showToast('error', 'Failed to export PDF', 'Error');
    }
  };

  const filters = (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2" style={{ color: '#2B2B2B' }}>
          Filter by Type
        </label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Corporate vs Retail Report"
      description="Revenue split analysis and growth trends by customer type"
      onExportCSV={handleExportCSV}
      onExportPDF={handleExportPDF}
      exportingCSV={exportingCSV}
      exportingPDF={exportingPDF}
      filters={filters}
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Total Revenue</p>
            <p className="text-2xl font-bold" style={{ color: '#C44569' }}>${totalRevenue.toLocaleString()}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Corporate Revenue</p>
            <p className="text-2xl font-bold" style={{ color: '#2B2B2B' }}>${corporateRevenue.toLocaleString()}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Retail Revenue</p>
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>${retailRevenue.toLocaleString()}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Corporate Share</p>
            <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>{corporatePercentage}%</p>
          </Card>
        </div>

        {/* Growth Trends Line Chart */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Revenue Growth Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="corporate" stroke="#C44569" strokeWidth={3} name="Corporate" />
              <Line type="monotone" dataKey="retail" stroke="#5A3825" strokeWidth={3} name="Retail" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Split Pie Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Revenue Split</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueSplit}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="revenue"
                >
                  {revenueSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Comparison Bar Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueSplit}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#C44569">
                  {revenueSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Key Metrics Comparison */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Key Metrics Comparison</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Corporate</TableHead>
                  <TableHead>Retail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerMetrics.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{metric.metric}</TableCell>
                    <TableCell style={{ color: '#C44569' }}>{metric.corporate}</TableCell>
                    <TableCell style={{ color: '#5A3825' }}>{metric.retail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Customer Records Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Customer Details ({filteredCustomers.length})</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: customer.type === 'Corporate' ? 'rgba(196, 69, 105, 0.1)' : 'rgba(90, 56, 37, 0.1)',
                        color: customer.type === 'Corporate' ? '#C44569' : '#5A3825'
                      }}>
                        {customer.type}
                      </span>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${customer.revenue.toLocaleString()}</TableCell>
                    <TableCell>${customer.avgOrderValue}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </ReportLayout>
  );
}
