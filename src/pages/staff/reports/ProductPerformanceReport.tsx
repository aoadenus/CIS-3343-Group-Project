import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProductData {
  name: string;
  orders: number;
  revenue: number;
  category: string;
  avgPrice: number;
}

interface CategoryData {
  name: string;
  revenue: number;
  color: string;
}

// Demo data
const productData: ProductData[] = [
  { name: 'Wedding Cake (3-tier)', orders: 38, revenue: 28500, category: 'Wedding', avgPrice: 750 },
  { name: 'Birthday Cake Custom', orders: 91, revenue: 18200, category: 'Birthday', avgPrice: 200 },
  { name: 'Anniversary Cake', orders: 42, revenue: 12800, category: 'Special Occasion', avgPrice: 305 },
  { name: 'Corporate Event Cake', orders: 23, revenue: 11500, category: 'Corporate', avgPrice: 500 },
  { name: 'Cupcake Dozen', orders: 148, revenue: 8900, category: 'Cupcakes', avgPrice: 60 },
  { name: 'Sheet Cake Large', orders: 49, revenue: 7400, category: 'Standard', avgPrice: 151 },
  { name: 'Baby Shower Cake', orders: 31, revenue: 6100, category: 'Special Occasion', avgPrice: 197 },
  { name: 'Graduation Cake', orders: 29, revenue: 5800, category: 'Special Occasion', avgPrice: 200 },
];

const categoryRevenue: CategoryData[] = [
  { name: 'Wedding', revenue: 28500, color: '#C44569' },
  { name: 'Birthday', revenue: 18200, color: '#5A3825' },
  { name: 'Special Occasion', revenue: 24700, color: '#4CAF50' },
  { name: 'Corporate', revenue: 11500, color: '#2196F3' },
  { name: 'Cupcakes', revenue: 8900, color: '#FFC107' },
  { name: 'Standard', revenue: 7400, color: '#9C27B0' },
];

const topOrderedProducts = [
  { name: 'Cupcake Dozen', orders: 148 },
  { name: 'Birthday Cake Custom', orders: 91 },
  { name: 'Sheet Cake Large', orders: 49 },
  { name: 'Anniversary Cake', orders: 42 },
  { name: 'Wedding Cake (3-tier)', orders: 38 },
  { name: 'Baby Shower Cake', orders: 31 },
];

export function ProductPerformanceReport() {
  const { showToast } = useToast();
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = categoryFilter === 'all'
    ? productData
    : productData.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());

  const totalRevenue = productData.reduce((sum, p) => sum + p.revenue, 0);
  const totalOrders = productData.reduce((sum, p) => sum + p.orders, 0);
  const avgOrderValue = (totalRevenue / totalOrders).toFixed(0);
  const topProduct = productData.reduce((max, p) => p.revenue > max.revenue ? p : max);

  const handleExportCSV = () => {
    setExportingCSV(true);

    const headers = ['Product Name', 'Category', 'Orders', 'Revenue', 'Avg Price'];
    const rows = filteredProducts.map(product => [
      product.name,
      product.category,
      product.orders,
      `$${product.revenue}`,
      `$${product.avgPrice}`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-performance-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Product Performance Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 56, 37);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Revenue: $${totalRevenue.toLocaleString()} | Total Orders: ${totalOrders}`, 14, 35);

      const tableData = filteredProducts.map(product => [
        product.name,
        product.category,
        product.orders.toString(),
        `$${product.revenue.toLocaleString()}`,
        `$${product.avgPrice}`
      ]);

      autoTable(doc, {
        head: [['Product', 'Category', 'Orders', 'Revenue', 'Avg Price']],
        body: tableData,
        startY: 42,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });

      doc.save(`product-performance-${new Date().toISOString().split('T')[0]}.pdf`);

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
          Filter by Category
        </label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="wedding">Wedding</SelectItem>
            <SelectItem value="birthday">Birthday</SelectItem>
            <SelectItem value="special occasion">Special Occasion</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="cupcakes">Cupcakes</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <ReportLayout
      title="Product Performance Report"
      description="Orders per product and revenue by category analysis"
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
            <p className="text-2xl font-bold" style={{ color: '#5A3825' }}>${avgOrderValue}</p>
          </Card>
          <Card className="p-4" style={{ background: 'white' }}>
            <p className="text-sm" style={{ color: '#5A3825', opacity: 0.7 }}>Top Product</p>
            <p className="text-lg font-bold" style={{ color: '#4CAF50' }}>{topProduct.name.split(' ')[0]}</p>
          </Card>
        </div>

        {/* Orders per Product Bar Chart */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Top Products by Order Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topOrderedProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="orders" fill="#C44569" name="Orders" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Category Pie Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="revenue"
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Revenue Bar Chart */}
          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">Revenue Comparison by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#5A3825" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Product Performance Table */}
        <Card className="p-6" style={{ background: 'white' }}>
          <h3 className="text-lg font-semibold mb-4">Product Details ({filteredProducts.length})</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Avg Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                        background: 'rgba(196, 69, 105, 0.1)',
                        color: '#C44569'
                      }}>
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell>{product.orders}</TableCell>
                    <TableCell>${product.revenue.toLocaleString()}</TableCell>
                    <TableCell>${product.avgPrice}</TableCell>
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
