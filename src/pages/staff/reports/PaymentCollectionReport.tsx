import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PaymentRecord {
  orderId: number;
  customerName: string;
  totalAmount: number;
  depositPaid: number;
  balance: number;
  paymentMethod: string;
  status: string;
  dueDate: string;
}

// Demo data
const paymentData: PaymentRecord[] = [
  { orderId: 1001, customerName: 'Jennifer Smith', totalAmount: 450, depositPaid: 225, balance: 225, paymentMethod: 'Credit Card', status: 'Partial', dueDate: '2024-01-20' },
  { orderId: 1002, customerName: 'Robert Johnson', totalAmount: 280, depositPaid: 280, balance: 0, paymentMethod: 'Cash', status: 'Paid', dueDate: '2024-01-18' },
  { orderId: 1003, customerName: 'Maria Garcia', totalAmount: 650, depositPaid: 325, balance: 325, paymentMethod: 'Credit Card', status: 'Partial', dueDate: '2024-01-22' },
  { orderId: 1004, customerName: 'Corporate Events Inc', totalAmount: 1200, depositPaid: 600, balance: 600, paymentMethod: 'Bank Transfer', status: 'Partial', dueDate: '2024-01-25' },
  { orderId: 1005, customerName: 'Lisa Chen', totalAmount: 180, depositPaid: 180, balance: 0, paymentMethod: 'Venmo', status: 'Paid', dueDate: '2024-01-15' },
  { orderId: 1006, customerName: 'David Wilson', totalAmount: 520, depositPaid: 260, balance: 260, paymentMethod: 'Credit Card', status: 'Partial', dueDate: '2024-01-28' },
  { orderId: 1007, customerName: 'Emily Brown', totalAmount: 340, depositPaid: 0, balance: 340, paymentMethod: 'Pending', status: 'Unpaid', dueDate: '2024-01-30' },
  { orderId: 1008, customerName: 'Michael Lee', totalAmount: 890, depositPaid: 890, balance: 0, paymentMethod: 'Credit Card', status: 'Paid', dueDate: '2024-01-12' },
];

const paymentMethodData = [
  { method: 'Credit Card', amount: 2100, count: 4, color: '#C44569' },
  { method: 'Cash', amount: 280, count: 1, color: '#5A3825' },
  { method: 'Bank Transfer', amount: 600, count: 1, color: '#4CAF50' },
  { method: 'Venmo', amount: 180, count: 1, color: '#2196F3' },
  { method: 'Pending', amount: 0, count: 1, color: '#FFC107' },
];

const depositComplianceData = [
  { name: 'Paid in Full', value: 3, color: '#4CAF50' },
  { name: 'Deposit Paid', value: 4, color: '#FFC107' },
  { name: 'No Payment', value: 1, color: '#DC3545' },
];

export function PaymentCollectionReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = statusFilter === 'all'
    ? paymentData
    : paymentData.filter(p => p.status.toLowerCase() === statusFilter);

  const totalRevenue = paymentData.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalCollected = paymentData.reduce((sum, p) => sum + p.depositPaid, 0);
  const totalOutstanding = paymentData.reduce((sum, p) => sum + p.balance, 0);
  const collectionRate = ((totalCollected / totalRevenue) * 100).toFixed(1);
  const depositCompliance = ((paymentData.filter(p => p.depositPaid > 0).length / paymentData.length) * 100).toFixed(0);

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Order #', 'Customer', 'Total Amount', 'Deposit Paid', 'Balance', 'Payment Method', 'Status', 'Due Date'];
    const rows = filteredPayments.map(payment => [
      payment.orderId,
      payment.customerName,
      `$${payment.totalAmount}`,
      `$${payment.depositPaid}`,
      `$${payment.balance}`,
      payment.paymentMethod,
      payment.status,
      payment.dueDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-collection-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Payment Collection Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Outstanding: $${totalOutstanding.toLocaleString()}`, 14, 35);

      const tableData = filteredPayments.map(payment => [
        payment.orderId.toString(),
        payment.customerName,
        `$${payment.totalAmount}`,
        `$${payment.depositPaid}`,
        `$${payment.balance}`,
        payment.status
      ]);

      autoTable(doc, {
        head: [['Order #', 'Customer', 'Total', 'Deposit', 'Balance', 'Status']],
        body: tableData,
        startY: 42,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`payment-collection-${new Date().toISOString().split('T')[0]}.pdf`);

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
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Payment Collection Report"
      description="Deposit compliance, outstanding balances, and payment methods analysis"
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
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Total Collected</p>
            <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>${totalCollected.toLocaleString()}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Outstanding Balance</p>
            <p className="text-2xl font-bold" style={{ color: '#DC3545' }}>${totalOutstanding.toLocaleString()}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Deposit Compliance</p>
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>{depositCompliance}%</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Revenue by Payment Method</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={paymentMethodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => [`$${value}`, 'Amount']} />
                <Bar dataKey="amount" fill="#C44569" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Deposit Compliance Pie Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Deposit Compliance Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={depositComplianceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {depositComplianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Collection Rate Progress */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Collection Rate</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#5A3825' }}>Progress</span>
              <span style={{ color: '#C44569', fontWeight: 600 }}>{collectionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${collectionRate}%`,
                  background: 'linear-gradient(90deg, #C44569, #5A3825)'
                }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: '#5A3825', opacity: 0.7 }}>
              <span>Collected: ${totalCollected.toLocaleString()}</span>
              <span>Target: ${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Payment Records Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Payment Records ({filteredPayments.length})</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Deposit Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.orderId}>
                    <TableCell className="font-medium">#{payment.orderId}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>${payment.totalAmount}</TableCell>
                    <TableCell>${payment.depositPaid}</TableCell>
                    <TableCell style={{ color: payment.balance > 0 ? '#DC3545' : '#4CAF50' }}>
                      ${payment.balance}
                    </TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: payment.status === 'Paid' ? 'rgba(76, 175, 80, 0.1)' :
                                   payment.status === 'Partial' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                        color: payment.status === 'Paid' ? '#4CAF50' :
                               payment.status === 'Partial' ? '#FFC107' : '#DC3545'
                      }}>
                        {payment.status}
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
