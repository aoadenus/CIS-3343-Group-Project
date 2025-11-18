import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderTypeData {
  month: string;
  custom: number;
  standard: number;
}

interface ComplexityData {
  level: string;
  count: number;
  avgPrice: number;
  avgTime: number;
}

// Demo data
const monthlyOrderTypes: OrderTypeData[] = [
  { month: 'Jan', custom: 28, standard: 17 },
  { month: 'Feb', custom: 32, standard: 20 },
  { month: 'Mar', custom: 38, standard: 23 },
  { month: 'Apr', custom: 35, standard: 20 },
  { month: 'May', custom: 42, standard: 26 },
  { month: 'Jun', custom: 48, standard: 30 },
];

const orderTypeDistribution = [
  { name: 'Custom Orders', value: 223, color: '#C44569' },
  { name: 'Standard Orders', value: 136, color: '#5A3825' },
];

const complexityData: ComplexityData[] = [
  { level: 'Simple', count: 85, avgPrice: 120, avgTime: 2.5 },
  { level: 'Moderate', count: 112, avgPrice: 280, avgTime: 4.5 },
  { level: 'Complex', count: 98, avgPrice: 450, avgTime: 6.5 },
  { level: 'Highly Complex', count: 64, avgPrice: 750, avgTime: 10 },
];

const orderDetails = [
  { id: 1001, type: 'Custom', complexity: 'Complex', description: '3-tier Wedding Cake', price: 650, time: 8 },
  { id: 1002, type: 'Standard', complexity: 'Simple', description: 'Round Birthday Cake', price: 85, time: 2 },
  { id: 1003, type: 'Custom', complexity: 'Highly Complex', description: 'Sculpted Character Cake', price: 890, time: 12 },
  { id: 1004, type: 'Custom', complexity: 'Moderate', description: 'Custom Anniversary Cake', price: 320, time: 5 },
  { id: 1005, type: 'Standard', complexity: 'Simple', description: 'Sheet Cake Large', price: 95, time: 2 },
  { id: 1006, type: 'Custom', complexity: 'Complex', description: 'Corporate Logo Cake', price: 480, time: 7 },
  { id: 1007, type: 'Standard', complexity: 'Moderate', description: 'Cupcake Tower (50)', price: 180, time: 4 },
  { id: 1008, type: 'Custom', complexity: 'Moderate', description: 'Baby Shower Theme Cake', price: 350, time: 5 },
];

export function CustomVsStandardReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredOrders = typeFilter === 'all'
    ? orderDetails
    : orderDetails.filter(o => o.type.toLowerCase() === typeFilter);

  const totalCustom = orderTypeDistribution[0].value;
  const totalStandard = orderTypeDistribution[1].value;
  const customRatio = ((totalCustom / (totalCustom + totalStandard)) * 100).toFixed(1);
  const avgCustomPrice = 450;
  const avgStandardPrice = 120;

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Order #', 'Type', 'Complexity', 'Description', 'Price', 'Time (hrs)'];
    const rows = filteredOrders.map(order => [
      order.id,
      order.type,
      order.complexity,
      order.description,
      `$${order.price}`,
      order.time
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-vs-standard-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Custom vs Standard Orders Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Custom Order Ratio: ${customRatio}%`, 14, 35);

      const tableData = filteredOrders.map(order => [
        order.id.toString(),
        order.type,
        order.complexity,
        order.description,
        `$${order.price}`,
        `${order.time} hrs`
      ]);

      autoTable(doc, {
        head: [['Order #', 'Type', 'Complexity', 'Description', 'Price', 'Time']],
        body: tableData,
        startY: 42,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`custom-vs-standard-${new Date().toISOString().split('T')[0]}.pdf`);

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
            <SelectItem value="custom">Custom Orders</SelectItem>
            <SelectItem value="standard">Standard Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Custom vs Standard Orders Report"
      description="Ratio of custom to standard orders with complexity analysis"
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
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Custom Orders</p>
            <p className="text-2xl font-bold" style={{ color: '#C44569' }}>{totalCustom}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Standard Orders</p>
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>{totalStandard}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Custom Ratio</p>
            <p className="text-2xl font-bold" style={{ color: '#2B2B2B' }}>{customRatio}%</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Avg Custom Price</p>
            <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>${avgCustomPrice}</p>
          </Card>
        </div>

        {/* Monthly Trend Chart */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Monthly Order Type Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyOrderTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="custom" fill="#C44569" name="Custom Orders" />
              <Bar dataKey="standard" fill="#5A3825" name="Standard Orders" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Type Distribution */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Order Type Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {orderTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Complexity Analysis */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Orders by Complexity Level</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={complexityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="level" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#C44569" name="Order Count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Complexity Pricing Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Complexity Level Analysis</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complexity Level</TableHead>
                  <TableHead>Order Count</TableHead>
                  <TableHead>Avg Price</TableHead>
                  <TableHead>Avg Time (hrs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complexityData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{data.level}</TableCell>
                    <TableCell>{data.count}</TableCell>
                    <TableCell>${data.avgPrice}</TableCell>
                    <TableCell>{data.avgTime} hrs</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Order Details Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Recent Orders ({filteredOrders.length})</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: order.type === 'Custom' ? 'rgba(196, 69, 105, 0.1)' : 'rgba(90, 56, 37, 0.1)',
                        color: order.type === 'Custom' ? '#C44569' : '#5A3825'
                      }}>
                        {order.type}
                      </span>
                    </TableCell>
                    <TableCell>{order.complexity}</TableCell>
                    <TableCell>{order.description}</TableCell>
                    <TableCell>${order.price}</TableCell>
                    <TableCell>{order.time} hrs</TableCell>
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
