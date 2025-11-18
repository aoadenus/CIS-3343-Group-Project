import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StaffPerformance {
  name: string;
  role: string;
  ordersCompleted: number;
  avgCompletionTime: number;
  rating: number;
  efficiency: number;
}

// Demo data
const staffData: StaffPerformance[] = [
  { name: 'Maria Santos', role: 'Baker', ordersCompleted: 45, avgCompletionTime: 4.2, rating: 4.8, efficiency: 95 },
  { name: 'James Chen', role: 'Baker', ordersCompleted: 42, avgCompletionTime: 4.5, rating: 4.6, efficiency: 92 },
  { name: 'Emily Rose', role: 'Decorator', ordersCompleted: 38, avgCompletionTime: 3.8, rating: 4.9, efficiency: 98 },
  { name: 'Michael Brown', role: 'Decorator', ordersCompleted: 35, avgCompletionTime: 4.1, rating: 4.7, efficiency: 94 },
  { name: 'Sarah Wilson', role: 'Baker', ordersCompleted: 40, avgCompletionTime: 4.3, rating: 4.5, efficiency: 90 },
  { name: 'David Lee', role: 'Decorator', ordersCompleted: 32, avgCompletionTime: 3.9, rating: 4.8, efficiency: 96 },
];

const completionByRole = [
  { role: 'Bakers', avgHours: 4.3, orders: 127 },
  { role: 'Decorators', avgHours: 3.9, orders: 105 },
];

const efficiencyDistribution = [
  { name: 'Excellent (95%+)', value: 3, color: '#4CAF50' },
  { name: 'Good (90-94%)', value: 2, color: '#FFC107' },
  { name: 'Needs Improvement', value: 1, color: '#FF9800' },
];

export function StaffPerformanceReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredStaff = roleFilter === 'all'
    ? staffData
    : staffData.filter(s => s.role.toLowerCase() === roleFilter);

  const avgCompletionTime = (filteredStaff.reduce((sum, s) => sum + s.avgCompletionTime, 0) / filteredStaff.length).toFixed(1);
  const avgEfficiency = (filteredStaff.reduce((sum, s) => sum + s.efficiency, 0) / filteredStaff.length).toFixed(0);
  const totalOrders = filteredStaff.reduce((sum, s) => sum + s.ordersCompleted, 0);
  const avgRating = (filteredStaff.reduce((sum, s) => sum + s.rating, 0) / filteredStaff.length).toFixed(1);

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Staff Name', 'Role', 'Orders Completed', 'Avg Completion Time (hrs)', 'Rating', 'Efficiency %'];
    const rows = filteredStaff.map(staff => [
      staff.name,
      staff.role,
      staff.ordersCompleted,
      staff.avgCompletionTime,
      staff.rating,
      `${staff.efficiency}%`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-performance-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Staff Performance Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

      const tableData = filteredStaff.map(staff => [
        staff.name,
        staff.role,
        staff.ordersCompleted.toString(),
        `${staff.avgCompletionTime} hrs`,
        staff.rating.toString(),
        `${staff.efficiency}%`
      ]);

      autoTable(doc, {
        head: [['Name', 'Role', 'Orders', 'Avg Time', 'Rating', 'Efficiency']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`staff-performance-${new Date().toISOString().split('T')[0]}.pdf`);

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
          Filter by Role
        </label>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="baker">Bakers</SelectItem>
            <SelectItem value="decorator">Decorators</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Staff Performance Report"
      description="Orders per staff member and completion time analysis"
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
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Avg Completion Time</p>
            <p className="text-2xl font-bold" style={{ color: '#2B2B2B' }}>{avgCompletionTime} hrs</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Avg Efficiency</p>
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>{avgEfficiency}%</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Avg Rating</p>
            <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>{avgRating}/5</p>
          </Card>
        </div>

        {/* Orders per Staff Member */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Orders Completed per Staff Member</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredStaff}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ordersCompleted" fill="#C44569" name="Orders Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Time by Role */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Avg Completion Time by Role</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={completionByRole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="avgHours" fill="#5A3825" name="Avg Hours" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Efficiency Distribution */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Efficiency Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={efficiencyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {efficiencyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Staff Performance Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Staff Performance Details</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders Completed</TableHead>
                  <TableHead>Avg Completion Time</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Efficiency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: staff.role === 'Baker' ? 'rgba(196, 69, 105, 0.1)' : 'rgba(90, 56, 37, 0.1)',
                        color: staff.role === 'Baker' ? '#C44569' : '#5A3825'
                      }}>
                        {staff.role}
                      </span>
                    </TableCell>
                    <TableCell>{staff.ordersCompleted}</TableCell>
                    <TableCell>{staff.avgCompletionTime} hrs</TableCell>
                    <TableCell>{staff.rating}/5</TableCell>
                    <TableCell>
                      <span style={{
                        color: staff.efficiency >= 95 ? '#4CAF50' : staff.efficiency >= 90 ? '#FFC107' : '#FF9800'
                      }}>
                        {staff.efficiency}%
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
