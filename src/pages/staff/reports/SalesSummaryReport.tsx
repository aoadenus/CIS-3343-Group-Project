import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

interface TopProduct {
  name: string;
  revenue: number;
  quantity: number;
  percentage: number;
}

// Demo data
const monthlyData: SalesData[] = [
  { period: 'Jan', revenue: 12500, orders: 45, avgOrderValue: 278 },
  { period: 'Feb', revenue: 14200, orders: 52, avgOrderValue: 273 },
  { period: 'Mar', revenue: 16800, orders: 61, avgOrderValue: 275 },
  { period: 'Apr', revenue: 15300, orders: 55, avgOrderValue: 278 },
  { period: 'May', revenue: 18900, orders: 68, avgOrderValue: 278 },
  { period: 'Jun', revenue: 21500, orders: 78, avgOrderValue: 276 },
];

const weeklyData: SalesData[] = [
  { period: 'Week 1', revenue: 4800, orders: 17, avgOrderValue: 282 },
  { period: 'Week 2', revenue: 5200, orders: 19, avgOrderValue: 274 },
  { period: 'Week 3', revenue: 5800, orders: 21, avgOrderValue: 276 },
  { period: 'Week 4', revenue: 5700, orders: 21, avgOrderValue: 271 },
];

const topProducts: TopProduct[] = [
  { name: 'Wedding Cake (3-tier)', revenue: 28500, quantity: 38, percentage: 28.7 },
  { name: 'Birthday Cake Custom', revenue: 18200, quantity: 91, percentage: 18.3 },
  { name: 'Anniversary Cake', revenue: 12800, quantity: 42, percentage: 12.9 },
  { name: 'Corporate Event Cake', revenue: 11500, quantity: 23, percentage: 11.6 },
  { name: 'Cupcake Dozen', revenue: 8900, quantity: 148, percentage: 8.9 },
  { name: 'Sheet Cake Large', revenue: 7400, quantity: 49, percentage: 7.4 },
  { name: 'Baby Shower Cake', revenue: 6100, quantity: 31, percentage: 6.1 },
  { name: 'Graduation Cake', revenue: 5800, quantity: 29, percentage: 5.8 },
];

export function SalesSummaryReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('monthly');

  const salesData = periodFilter === 'monthly' ? monthlyData : weeklyData;
  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const growthRate = ((salesData[salesData.length - 1].revenue - salesData[0].revenue) / salesData[0].revenue * 100).toFixed(1);

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Period', 'Revenue', 'Orders', 'Avg Order Value'];
    const rows = salesData.map(data => [
      data.period,
      `$${data.revenue.toLocaleString()}`,
      data.orders,
      `$${data.avgOrderValue}`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-summary-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Sales Summary Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 14, 35);
      doc.text(`Total Orders: ${totalOrders}`, 14, 42);

      const tableData = salesData.map(data => [
        data.period,
        `$${data.revenue.toLocaleString()}`,
        data.orders.toString(),
        `$${data.avgOrderValue}`
      ]);

      autoTable(doc, {
        head: [['Period', 'Revenue', 'Orders', 'Avg Order Value']],
        body: tableData,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`sales-summary-${new Date().toISOString().split('T')[0]}.pdf`);

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
          Time Period
        </label>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Sales Summary Report"
      description="Total revenue by period with top products analysis"
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
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Total Orders</p>
            <p className="text-2xl font-bold" style={{ color: '#2B2B2B' }}>{totalOrders}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Avg Order Value</p>
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>${avgOrderValue.toFixed(0)}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Growth Rate</p>
            <p className="text-2xl font-bold" style={{ color: parseFloat(growthRate) > 0 ? '#4CAF50' : '#DC3545' }}>
              {parseFloat(growthRate) > 0 ? '+' : ''}{growthRate}%
            </p>
          </Card>
        </div>

        {/* Revenue Trend Line Chart */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#C44569" strokeWidth={3} dot={{ fill: '#C44569', r: 5 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products by Revenue */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts.slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#5A3825" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Product Revenue Breakdown</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Quantity Sold</TableHead>
                  <TableHead>% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.revenue.toLocaleString()}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.percentage}%</TableCell>
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
