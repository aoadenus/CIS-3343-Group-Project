import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderStatusData {
  status: string;
  count: number;
  color: string;
}

interface DailyOrderData {
  day: string;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

interface OrderRecord {
  orderId: number;
  customerName: string;
  orderDate: string;
  status: string;
  total: number;
  priority: string;
}

// Demo data
const orderStatusData: OrderStatusData[] = [
  { status: 'Pending', count: 24, color: '#FFC107' },
  { status: 'In Progress', count: 18, color: '#2196F3' },
  { status: 'Completed', count: 156, color: '#4CAF50' },
  { status: 'Cancelled', count: 8, color: '#DC3545' },
];

const dailyOrdersData: DailyOrderData[] = [
  { day: 'Mon', pending: 4, inProgress: 3, completed: 22, cancelled: 1 },
  { day: 'Tue', pending: 5, inProgress: 4, completed: 25, cancelled: 2 },
  { day: 'Wed', pending: 3, inProgress: 2, completed: 28, cancelled: 1 },
  { day: 'Thu', pending: 4, inProgress: 3, completed: 24, cancelled: 1 },
  { day: 'Fri', pending: 6, inProgress: 4, completed: 32, cancelled: 2 },
  { day: 'Sat', pending: 2, inProgress: 2, completed: 25, cancelled: 1 },
];

const orderRecords: OrderRecord[] = [
  { orderId: 1001, customerName: 'Jennifer Smith', orderDate: '2024-01-15', status: 'Pending', total: 450, priority: 'High' },
  { orderId: 1002, customerName: 'Robert Johnson', orderDate: '2024-01-14', status: 'In Progress', total: 280, priority: 'Normal' },
  { orderId: 1003, customerName: 'Maria Garcia', orderDate: '2024-01-14', status: 'Completed', total: 650, priority: 'High' },
  { orderId: 1004, customerName: 'David Wilson', orderDate: '2024-01-13', status: 'Completed', total: 320, priority: 'Normal' },
  { orderId: 1005, customerName: 'Lisa Chen', orderDate: '2024-01-13', status: 'Pending', total: 180, priority: 'Low' },
  { orderId: 1006, customerName: 'Michael Brown', orderDate: '2024-01-12', status: 'Cancelled', total: 520, priority: 'Normal' },
  { orderId: 1007, customerName: 'Emily Rose', orderDate: '2024-01-12', status: 'Completed', total: 890, priority: 'High' },
  { orderId: 1008, customerName: 'James Lee', orderDate: '2024-01-11', status: 'In Progress', total: 340, priority: 'Normal' },
];

export function OrderStatusDashboard() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = statusFilter === 'all'
    ? orderRecords
    : orderRecords.filter(o => o.status.toLowerCase().replace(' ', '-') === statusFilter);

  const totalOrders = orderStatusData.reduce((sum, d) => sum + d.count, 0);
  const pendingOrders = orderStatusData.find(d => d.status === 'Pending')?.count || 0;
  const completedOrders = orderStatusData.find(d => d.status === 'Completed')?.count || 0;
  const completionRate = ((completedOrders / totalOrders) * 100).toFixed(1);
  const cancellationRate = (((orderStatusData.find(d => d.status === 'Cancelled')?.count || 0) / totalOrders) * 100).toFixed(1);

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Order #', 'Customer', 'Order Date', 'Status', 'Total', 'Priority'];
    const rows = filteredOrders.map(order => [
      order.orderId,
      order.customerName,
      order.orderDate,
      order.status,
      `$${order.total}`,
      order.priority
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-status-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Order Status Dashboard', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Orders: ${totalOrders} | Completion Rate: ${completionRate}%`, 14, 35);

      const tableData = filteredOrders.map(order => [
        order.orderId.toString(),
        order.customerName,
        order.orderDate,
        order.status,
        `$${order.total}`,
        order.priority
      ]);

      autoTable(doc, {
        head: [['Order #', 'Customer', 'Date', 'Status', 'Total', 'Priority']],
        body: tableData,
        startY: 42,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`order-status-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);

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
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Order Status Dashboard"
      description="Real-time order status tracking and daily trends analysis"
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
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Total Orders</p>
            <p className="text-2xl font-bold" style={{ color: '#C44569' }}>{totalOrders}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Pending Orders</p>
            <p className="text-2xl font-bold" style={{ color: '#FFC107' }}>{pendingOrders}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Completion Rate</p>
            <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>{completionRate}%</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Cancellation Rate</p>
            <p className="text-2xl font-bold" style={{ color: '#DC3545' }}>{cancellationRate}%</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Pie Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="count"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Daily Orders Bar Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Orders per Day by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" stackId="a" fill="#FFC107" name="Pending" />
                <Bar dataKey="inProgress" stackId="a" fill="#2196F3" name="In Progress" />
                <Bar dataKey="completed" stackId="a" fill="#4CAF50" name="Completed" />
                <Bar dataKey="cancelled" stackId="a" fill="#DC3545" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Order Records Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Recent Orders ({filteredOrders.length})</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium">#{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: order.status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' :
                                   order.status === 'Pending' ? 'rgba(255, 193, 7, 0.1)' :
                                   order.status === 'In Progress' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                        color: order.status === 'Completed' ? '#4CAF50' :
                               order.status === 'Pending' ? '#FFC107' :
                               order.status === 'In Progress' ? '#2196F3' : '#DC3545'
                      }}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <span style={{
                        color: order.priority === 'High' ? '#DC3545' :
                               order.priority === 'Normal' ? '#5A3825' : '#4CAF50'
                      }}>
                        {order.priority}
                      </span>
                    </TableCell>
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
