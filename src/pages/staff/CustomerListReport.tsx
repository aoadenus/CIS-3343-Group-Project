import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileDown, Loader2, Users, FileText } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { CustomerListResponse, CustomerListFilters } from '../../types/reports';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CUSTOMER_TYPES = ['all', 'retail', 'corporate'];

export function CustomerListReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [data, setData] = useState<CustomerListResponse | null>(null);
  
  const [filters, setFilters] = useState<CustomerListFilters>({
    customerType: 'all',
    minSpending: '',
    maxSpending: ''
  });

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.customerType !== 'all') {
        params.append('customerType', filters.customerType);
      }
      if (filters.minSpending) {
        params.append('minSpending', filters.minSpending);
      }
      if (filters.maxSpending) {
        params.append('maxSpending', filters.maxSpending);
      }
      
      const response = await fetch(`/api/reports/customer-list?${params}`);
      if (!response.ok) throw new Error('Failed to fetch report data');
      
      const reportData = await response.json();
      setData(reportData);
    } catch (error) {
      console.error('Error fetching report:', error);
      showToast('error', 'Failed to load report data. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [filters]);

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
    
    // Create CSV content with proper escaping
    const headers = ['Name', 'Email', 'Phone'];
    const rows = data.customers.map(customer => [
      escapeCSVField(customer.name),
      escapeCSVField(customer.email),
      escapeCSVField(customer.phone || '')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-list-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setExportingCSV(false);
      showToast('success', 'CSV file with customer contact information downloaded successfully', 'Export Complete');
    }, 800);
  };

  const handleExportPDF = () => {
    if (!data) return;
    
    setExportingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.setTextColor(196, 69, 105);
      doc.text('Customer List Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Customers: ${data.totals.customers}`, 14, 34);
      doc.text(`Total Revenue: $${data.totals.revenue.toLocaleString()}`, 14, 40);
      
      const tableData = data.customers.map(customer => [
        customer.name,
        customer.email,
        customer.phone || 'N/A'
      ]);
      
      autoTable(doc, {
        head: [['Name', 'Email', 'Phone']],
        body: tableData,
        startY: 48,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      });
      
      doc.save(`customer-list-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setTimeout(() => {
        setExportingPDF(false);
        showToast('success', 'PDF file with customer contact information downloaded successfully', 'Export Complete');
      }, 800);
    } catch (error) {
      setExportingPDF(false);
      showToast('error', 'Failed to export PDF. Please try again.', 'Error');
    }
  };

  const formatChartMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'Corporate' 
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569', fontSize: 'clamp(28px, 5vw, 36px)' }}>
            Customer List Report
          </h1>
          <p className="mt-2" style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825', opacity: 0.8 }}>
            Customer acquisition trends and contact information
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button
            onClick={handleExportPDF}
            disabled={exportingPDF || !data}
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
            {exportingPDF ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileText size={18} className="mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
              Customer Type
            </label>
            <Select value={filters.customerType} onValueChange={(value) => setFilters({ ...filters, customerType: value })}>
              <SelectTrigger style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMER_TYPES.map(type => (
                  <SelectItem key={type} value={type} style={{ fontFamily: 'Open Sans' }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
              Min Spending ($)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minSpending}
              onChange={(e) => setFilters({ ...filters, minSpending: e.target.value })}
              style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}
            />
          </div>
          <div>
            <label className="block mb-2" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
              Max Spending ($)
            </label>
            <Input
              type="number"
              placeholder="No limit"
              value={filters.maxSpending}
              onChange={(e) => setFilters({ ...filters, maxSpending: e.target.value })}
              style={{ fontFamily: 'Open Sans', borderRadius: '8px', height: '44px' }}
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
                Total Customers
              </p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '36px', color: '#2B2B2B' }}>
                {data.totals.customers}
              </p>
            </Card>
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
                Total Revenue
              </p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '36px', color: '#C44569' }}>
                ${data.totals.revenue.toLocaleString()}
              </p>
            </Card>
            <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
              <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7, marginBottom: '8px' }}>
                Total Orders
              </p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '36px', color: '#5A3825' }}>
                {data.totals.orders}
              </p>
            </Card>
          </div>

          {/* Line Chart - Customer Acquisition Trend */}
          <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
                Customer Acquisition Trend
              </h2>
              <div className="flex items-center gap-2" style={{
                padding: '8px 12px',
                background: 'rgba(196, 69, 105, 0.08)',
                borderRadius: '8px',
                fontFamily: 'Open Sans',
                fontSize: '13px',
                color: '#5A3825'
              }}>
                <Users size={16} color="#C44569" />
                {data.totals.customers} customers
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 56, 37, 0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#5A3825" 
                  style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }}
                  tickFormatter={formatChartMonth}
                />
                <YAxis 
                  stroke="#5A3825" 
                  style={{ fontFamily: 'Open Sans', fontSize: 'clamp(11px, 2vw, 13px)' }}
                  allowDecimals={false}
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
                  formatter={(value: any) => [value, 'New Customers']}
                  labelFormatter={(label) => formatChartMonth(label)}
                  labelStyle={{ fontWeight: 600, color: '#2B2B2B', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#C44569" 
                  strokeWidth={3}
                  dot={{ fill: '#C44569', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Customers Table */}
          <Card className="p-6 lg:p-8 rounded-xl bg-white overflow-hidden" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <h2 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>
              Customer Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontFamily: 'Open Sans' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(90, 56, 37, 0.15)' }}>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Name</th>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Email</th>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Phone</th>
                    <th className="text-left py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Type</th>
                    <th className="text-right py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Orders</th>
                    <th className="text-right py-3 px-2" style={{ fontWeight: 600, color: '#5A3825', fontSize: '13px' }}>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.customers.map((customer) => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid rgba(90, 56, 37, 0.08)' }}>
                      <td className="py-4 px-2" style={{ fontSize: '14px', color: '#2B2B2B', fontWeight: 600 }}>
                        {customer.name}
                      </td>
                      <td className="py-4 px-2" style={{ fontSize: '14px', color: '#5A3825' }}>
                        {customer.email}
                      </td>
                      <td className="py-4 px-2" style={{ fontSize: '14px', color: '#5A3825' }}>
                        {customer.phone || 'N/A'}
                      </td>
                      <td className="py-4 px-2">
                        <span 
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(customer.type)}`}
                        >
                          {customer.type}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right" style={{ fontSize: '14px', color: '#2B2B2B', fontWeight: 600 }}>
                        {customer.orderCount}
                      </td>
                      <td className="py-4 px-2 text-right" style={{ fontSize: '14px', color: '#C44569', fontWeight: 600 }}>
                        ${customer.totalSpent.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825' }}>
            No customers match the selected filters
          </p>
        </Card>
      )}
    </div>
  );
}
