import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PreferredCustomer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  memberSince: string;
  preferredStatus: boolean;
  lastOrder: string;
}

// Demo data
const preferredCustomers: PreferredCustomer[] = [
  { id: 1, name: 'Sarah Thompson', email: 'sarah.t@email.com', totalOrders: 24, totalSpent: 8500, avgOrderValue: 354, memberSince: '2022-03-15', preferredStatus: true, lastOrder: '2024-01-10' },
  { id: 2, name: 'Corporate Events LLC', email: 'orders@corpevents.com', totalOrders: 18, totalSpent: 12800, avgOrderValue: 711, memberSince: '2022-06-20', preferredStatus: true, lastOrder: '2024-01-08' },
  { id: 3, name: 'Maria Rodriguez', email: 'maria.r@email.com', totalOrders: 15, totalSpent: 4200, avgOrderValue: 280, memberSince: '2022-09-10', preferredStatus: true, lastOrder: '2024-01-12' },
  { id: 4, name: 'James Wilson', email: 'jwilson@email.com', totalOrders: 12, totalSpent: 3600, avgOrderValue: 300, memberSince: '2023-01-05', preferredStatus: true, lastOrder: '2024-01-05' },
  { id: 5, name: 'Emily Chen', email: 'echen@email.com', totalOrders: 10, totalSpent: 2800, avgOrderValue: 280, memberSince: '2023-04-18', preferredStatus: true, lastOrder: '2024-01-14' },
  { id: 6, name: 'Michael Brown', email: 'mbrown@email.com', totalOrders: 8, totalSpent: 1900, avgOrderValue: 238, memberSince: '2023-06-22', preferredStatus: false, lastOrder: '2024-01-02' },
  { id: 7, name: 'Lisa Park', email: 'lpark@email.com', totalOrders: 6, totalSpent: 1650, avgOrderValue: 275, memberSince: '2023-08-30', preferredStatus: false, lastOrder: '2024-01-11' },
  { id: 8, name: 'David Lee', email: 'dlee@email.com', totalOrders: 5, totalSpent: 1200, avgOrderValue: 240, memberSince: '2023-10-15', preferredStatus: false, lastOrder: '2024-01-09' },
];

const revenueComparison = [
  { category: 'Preferred', revenue: 31900, orders: 79, percentage: 72 },
  { category: 'Regular', revenue: 12250, orders: 52, percentage: 28 },
];

const monthlyTrend = [
  { month: 'Aug', preferred: 4200, regular: 1800 },
  { month: 'Sep', preferred: 4800, regular: 2100 },
  { month: 'Oct', preferred: 5200, regular: 2400 },
  { month: 'Nov', preferred: 5800, regular: 2200 },
  { month: 'Dec', preferred: 6500, regular: 2800 },
  { month: 'Jan', preferred: 5400, regular: 2050 },
];

const customerDistribution = [
  { name: 'Preferred (10+ orders)', value: 5, color: '#C44569' },
  { name: 'Regular (5-9 orders)', value: 2, color: '#5A3825' },
  { name: 'New (< 5 orders)', value: 1, color: '#FFC107' },
];

export function PreferredCustomerReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = statusFilter === 'all'
    ? preferredCustomers
    : statusFilter === 'preferred'
      ? preferredCustomers.filter(c => c.preferredStatus)
      : preferredCustomers.filter(c => !c.preferredStatus);

  const totalPreferredRevenue = revenueComparison[0].revenue;
  const totalRegularRevenue = revenueComparison[1].revenue;
  const preferredCount = preferredCustomers.filter(c => c.preferredStatus).length;
  const avgPreferredValue = (totalPreferredRevenue / revenueComparison[0].orders).toFixed(0);
  const revenuePercentage = ((totalPreferredRevenue / (totalPreferredRevenue + totalRegularRevenue)) * 100).toFixed(0);

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Customer Name', 'Email', 'Total Orders', 'Total Spent', 'Avg Order Value', 'Status', 'Last Order'];
    const rows = filteredCustomers.map(customer => [
      customer.name,
      customer.email,
      customer.totalOrders,
      `$${customer.totalSpent}`,
      `$${customer.avgOrderValue}`,
      customer.preferredStatus ? 'Preferred' : 'Regular',
      customer.lastOrder
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preferred-customers-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Preferred Customer Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Preferred Customer Revenue: ${revenuePercentage}% of total`, 14, 35);

      const tableData = filteredCustomers.map(customer => [
        customer.name,
        customer.totalOrders.toString(),
        `$${customer.totalSpent}`,
        `$${customer.avgOrderValue}`,
        customer.preferredStatus ? 'Preferred' : 'Regular'
      ]);

      autoTable(doc, {
        head: [['Name', 'Orders', 'Total Spent', 'Avg Value', 'Status']],
        body: tableData,
        startY: 42,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`preferred-customers-${new Date().toISOString().split('T')[0]}.pdf`);

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
          Filter by Status
        </label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="preferred">Preferred Only</SelectItem>
            <SelectItem value="regular">Regular Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Preferred Customer Report"
      description="Preferred customer analysis with revenue comparison"
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
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Preferred Customers</p>
            <p className="text-2xl font-bold" style={{ color: '#C44569' }}>{preferredCount}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Preferred Revenue</p>
            <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>${totalPreferredRevenue.toLocaleString()}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Revenue Share</p>
            <p className="text-2xl font-bold" style={{ color: '#2B2B2B' }}>{revenuePercentage}%</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Avg Preferred Value</p>
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>${avgPreferredValue}</p>
          </Card>
        </div>

        {/* Revenue Trend Chart */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Revenue Trend by Customer Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="preferred" stroke="#C44569" strokeWidth={3} name="Preferred Customers" />
              <Line type="monotone" dataKey="regular" stroke="#5A3825" strokeWidth={3} name="Regular Customers" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Comparison */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Revenue by Customer Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#C44569" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Customer Distribution */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Customer Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={customerDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {customerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Customer Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Customer Details ({filteredCustomers.length})</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>${customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>${customer.avgOrderValue}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: customer.preferredStatus ? 'rgba(196, 69, 105, 0.1)' : 'rgba(90, 56, 37, 0.1)',
                        color: customer.preferredStatus ? '#C44569' : '#5A3825'
                      }}>
                        {customer.preferredStatus ? 'Preferred' : 'Regular'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
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
