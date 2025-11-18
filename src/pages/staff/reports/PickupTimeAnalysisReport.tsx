import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface HourlyData {
  hour: string;
  pickups: number;
}

interface DayData {
  day: string;
  pickups: number;
}

interface PickupRecord {
  orderId: number;
  customerName: string;
  scheduledTime: string;
  actualTime: string;
  status: 'on-time' | 'early' | 'late';
  delayMinutes: number;
}

// Demo data - Peak pickup hours
const hourlyData: HourlyData[] = [
  { hour: '8 AM', pickups: 5 },
  { hour: '9 AM', pickups: 8 },
  { hour: '10 AM', pickups: 15 },
  { hour: '11 AM', pickups: 22 },
  { hour: '12 PM', pickups: 28 },
  { hour: '1 PM', pickups: 18 },
  { hour: '2 PM', pickups: 25 },
  { hour: '3 PM', pickups: 32 },
  { hour: '4 PM', pickups: 35 },
  { hour: '5 PM', pickups: 28 },
  { hour: '6 PM', pickups: 15 },
  { hour: '7 PM', pickups: 8 },
];

const dayData: DayData[] = [
  { day: 'Monday', pickups: 25 },
  { day: 'Tuesday', pickups: 28 },
  { day: 'Wednesday', pickups: 32 },
  { day: 'Thursday', pickups: 35 },
  { day: 'Friday', pickups: 48 },
  { day: 'Saturday', pickups: 65 },
  { day: 'Sunday', pickups: 42 },
];

const pickupStatusData = [
  { name: 'On Time', value: 185, color: '#4CAF50' },
  { name: 'Early (5+ min)', value: 45, color: '#2196F3' },
  { name: 'Late (5+ min)', value: 28, color: '#DC3545' },
];

const pickupRecords: PickupRecord[] = [
  { orderId: 1001, customerName: 'Jennifer Smith', scheduledTime: '2:00 PM', actualTime: '2:05 PM', status: 'on-time', delayMinutes: 5 },
  { orderId: 1002, customerName: 'Robert Johnson', scheduledTime: '10:00 AM', actualTime: '9:45 AM', status: 'early', delayMinutes: -15 },
  { orderId: 1003, customerName: 'Maria Garcia', scheduledTime: '4:00 PM', actualTime: '4:25 PM', status: 'late', delayMinutes: 25 },
  { orderId: 1004, customerName: 'David Wilson', scheduledTime: '12:00 PM', actualTime: '12:00 PM', status: 'on-time', delayMinutes: 0 },
  { orderId: 1005, customerName: 'Lisa Chen', scheduledTime: '3:00 PM', actualTime: '2:50 PM', status: 'early', delayMinutes: -10 },
  { orderId: 1006, customerName: 'Michael Brown', scheduledTime: '5:00 PM', actualTime: '5:35 PM', status: 'late', delayMinutes: 35 },
  { orderId: 1007, customerName: 'Emily Rose', scheduledTime: '11:00 AM', actualTime: '11:02 AM', status: 'on-time', delayMinutes: 2 },
  { orderId: 1008, customerName: 'James Lee', scheduledTime: '1:00 PM', actualTime: '1:00 PM', status: 'on-time', delayMinutes: 0 },
];

export function PickupTimeAnalysisReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRecords = statusFilter === 'all'
    ? pickupRecords
    : pickupRecords.filter(r => r.status === statusFilter);

  const totalPickups = pickupStatusData.reduce((sum, d) => sum + d.value, 0);
  const latePickups = pickupStatusData.find(d => d.name.includes('Late'))?.value || 0;
  const latePercentage = ((latePickups / totalPickups) * 100).toFixed(1);
  const peakHour = hourlyData.reduce((max, h) => h.pickups > max.pickups ? h : max).hour;
  const peakDay = dayData.reduce((max, d) => d.pickups > max.pickups ? d : max).day;

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Order #', 'Customer', 'Scheduled Time', 'Actual Time', 'Status', 'Delay (min)'];
    const rows = filteredRecords.map(record => [
      record.orderId,
      record.customerName,
      record.scheduledTime,
      record.actualTime,
      record.status,
      record.delayMinutes
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pickup-time-analysis-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Pickup Time Analysis Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Late Pickup Rate: ${latePercentage}%`, 14, 35);

      const tableData = filteredRecords.map(record => [
        record.orderId.toString(),
        record.customerName,
        record.scheduledTime,
        record.actualTime,
        record.status,
        `${record.delayMinutes} min`
      ]);

      autoTable(doc, {
        head: [['Order #', 'Customer', 'Scheduled', 'Actual', 'Status', 'Delay']],
        body: tableData,
        startY: 42,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`pickup-time-analysis-${new Date().toISOString().split('T')[0]}.pdf`);

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
            <SelectItem value="all">All Pickups</SelectItem>
            <SelectItem value="on-time">On Time</SelectItem>
            <SelectItem value="early">Early</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Pickup Time Analysis Report"
      description="Peak pickup hours and late pickups analysis"
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
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Total Pickups</p>
            <p className="text-2xl font-bold" style={{ color: '#C44569' }}>{totalPickups}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Late Pickup Rate</p>
            <p className="text-2xl font-bold" style={{ color: '#DC3545' }}>{latePercentage}%</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Peak Hour</p>
            <p className="text-2xl font-bold" style={{ color: '#2B2B2B' }}>{peakHour}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Busiest Day</p>
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>{peakDay}</p>
          </Card>
        </div>

        {/* Hourly Heatmap Chart */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Pickups by Hour of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pickups" fill="#C44569" name="Pickups">
                {hourlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pickups > 30 ? '#C44569' : entry.pickups > 20 ? '#E8789E' : '#F5B8CB'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Day of Week Distribution */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Pickups by Day of Week</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pickups" fill="#5A3825" name="Pickups" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pickup Status Distribution */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Pickup Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pickupStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pickupStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Pickup Records Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Pickup Records ({filteredRecords.length})</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Actual Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.orderId}>
                    <TableCell className="font-medium">#{record.orderId}</TableCell>
                    <TableCell>{record.customerName}</TableCell>
                    <TableCell>{record.scheduledTime}</TableCell>
                    <TableCell>{record.actualTime}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: record.status === 'on-time' ? 'rgba(76, 175, 80, 0.1)' :
                                   record.status === 'early' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                        color: record.status === 'on-time' ? '#4CAF50' :
                               record.status === 'early' ? '#2196F3' : '#DC3545'
                      }}>
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell style={{
                      color: record.delayMinutes > 5 ? '#DC3545' : record.delayMinutes < 0 ? '#2196F3' : '#4CAF50'
                    }}>
                      {record.delayMinutes > 0 ? '+' : ''}{record.delayMinutes} min
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
