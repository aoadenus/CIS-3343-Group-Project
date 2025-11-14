import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PendingOrder {
  id: number;
  customerName: string;
  pickupDate: string;
  status: string;
  assignedStaff: string | null;
  totalAmount: number;
  daysUntilDue: number;
  urgency: 'low' | 'medium' | 'high';
}

const STATUS_COLORS = {
  pending: '#FFC107',
  confirmed: '#2196F3',
  baking: '#FF9800',
  decorating: '#9C27B0',
  ready: '#4CAF50'
};

export function PendingOrdersReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [funnelData, setFunnelData] = useState<Array<{ status: string; count: number; fill: string }>>([]);

  const calculateDaysUntilDue = (pickupDate: string): number => {
    const pickup = new Date(pickupDate);
    const today = new Date();
    pickup.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = pickup.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUrgency = (days: number): 'low' | 'medium' | 'high' => {
    if (days < 1) return 'high';
    if (days <= 2) return 'medium';
    return 'low';
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const allOrders = await response.json();
      
      // Filter to pending orders only (not completed/cancelled)
      const pendingOrders = allOrders
        .filter((order: any) => !['completed', 'cancelled'].includes(order.status))
        .map((order: any) => {
          const days = order.eventDate ? calculateDaysUntilDue(order.eventDate) : 999;
          return {
            id: order.id,
            customerName: order.customerName || 'Unknown',
            pickupDate: order.eventDate || 'TBD',
            status: order.status,
            assignedStaff: order.assignedBaker || order.assignedDecorator || null,
            totalAmount: order.totalAmount ? order.totalAmount / 100 : 0,
            daysUntilDue: days,
            urgency: getUrgency(days)
          };
        });

      setOrders(pendingOrders);

      // Calculate funnel data
      const statusCounts = pendingOrders.reduce((acc: any, order: PendingOrder) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const funnel = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count: count as number,
        fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#999'
      }));

      setFunnelData(funnel);
    } catch (error) {
      console.error('Error fetching report:', error);
      showToast('error', 'Failed to load report data', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const handleExportCSV = () => {
    setExportingCSV(true);
    
    const headers = ['Order #', 'Customer', 'Pickup Date', 'Days Until Due', 'Status', 'Assigned Staff', 'Urgency'];
    const rows = filteredOrders.map(order => [
      order.id,
      order.customerName,
      new Date(order.pickupDate).toLocaleDateString(),
      order.daysUntilDue,
      order.status,
      order.assignedStaff || 'Unassigned',
      order.urgency
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-orders-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Pending Orders Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      
      const tableData = filteredOrders.map(order => [
        order.id.toString(),
        order.customerName,
        new Date(order.pickupDate).toLocaleDateString(),
        order.daysUntilDue.toString(),
        order.status,
        order.assignedStaff || 'Unassigned'
      ]);
      
      autoTable(doc, {
        head: [['Order #', 'Customer', 'Pickup Date', 'Days Until Due', 'Status', 'Assigned Staff']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      });
      
      doc.save(`pending-orders-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setTimeout(() => {
        setExportingPDF(false);
        showToast('success', 'PDF file downloaded', 'Export Complete');
      }, 800);
    } catch (error) {
      setExportingPDF(false);
      showToast('error', 'Failed to export PDF', 'Error');
    }
  };

  const getUrgencyBadge = (urgency: 'low' | 'medium' | 'high', days: number) => {
    const colors = {
      low: { bg: '#4CAF50', text: 'white', icon: '🟢' },
      medium: { bg: '#FFC107', text: '#000', icon: '🟡' },
      high: { bg: '#DC3545', text: 'white', icon: '🔴' }
    };
    
    const config = colors[urgency];
    
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2"
        style={{ background: config.bg, color: config.text }}
        role="status"
        aria-label={`${urgency} urgency - ${days} days until due`}
      >
        <span aria-hidden="true">{config.icon}</span>
        <span>{days}d</span>
      </span>
    );
  };

  const filters = (
    <div className="flex flex-col md:flex-row gap-4">
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
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="baking">In Baking</SelectItem>
            <SelectItem value="decorating">In Decorating</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Pending Orders Report"
      description="Track orders by status with urgency indicators"
      onExportCSV={handleExportCSV}
      onExportPDF={handleExportPDF}
      exportingCSV={exportingCSV}
      exportingPDF={exportingPDF}
      filters={filters}
    >
      {loading ? (
        <Card className="p-8 text-center">
          <p>Loading report data...</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Funnel Chart */}
          <Card className="p-6" style={{ background: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#2B2B2B' }}>
              Orders by Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="count" data={funnelData} isAnimationActive>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList position="right" fill="#000" stroke="none" dataKey="status" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </Card>

          {/* Orders Table */}
          <Card className="p-6" style={{ background: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#2B2B2B' }}>
              Pending Orders ({filteredOrders.length})
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Pickup Date</TableHead>
                    <TableHead>Days Until Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{new Date(order.pickupDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {getUrgencyBadge(order.urgency, order.daysUntilDue)}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                          background: `${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}20`,
                          color: STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]
                        }}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.assignedStaff || 'Unassigned'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}
    </ReportLayout>
  );
}
