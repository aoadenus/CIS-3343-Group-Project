import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ReportLayout } from './ReportLayout';
import { useToast } from '../../../components/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  timesOrdered: number;
  revenue: number;
  trending: boolean;
}

export function ProductInventoryReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [top10Data, setTop10Data] = useState<Array<{ name: string; revenue: number }>>([]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);
      
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
      
      const allProducts = await productsResponse.json();
      const allOrders = await ordersResponse.json();
      
      const productNameMap = new Map<string, number>();
      allProducts.forEach((p: any) => {
        productNameMap.set(p.name.toLowerCase(), p.id);
      });
      
      const productStats = new Map<number, { timesOrdered: number; revenue: number }>();
      
      allOrders.forEach((order: any) => {
        if (order.orderType !== 'shop' || !order.productName) {
          return;
        }
        
        const productId = productNameMap.get(order.productName.toLowerCase());
        if (!productId) {
          return;
        }
        
        const stats = productStats.get(productId) || { timesOrdered: 0, revenue: 0 };
        stats.timesOrdered += 1;
        stats.revenue += (order.totalAmount || 0) / 100;
        productStats.set(productId, stats);
      });
      
      const productsWithStats = allProducts.map((product: any) => {
        const stats = productStats.get(product.id) || { timesOrdered: 0, revenue: 0 };
        return {
          id: product.id,
          name: product.name,
          category: product.category || 'Uncategorized',
          price: product.price / 100,
          timesOrdered: stats.timesOrdered,
          revenue: stats.revenue,
          trending: stats.timesOrdered > 5 && stats.revenue > 500
        };
      });

      setProducts(productsWithStats);

      const top10 = [...productsWithStats]
        .filter(p => p.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
        .map(p => ({ name: p.name, revenue: p.revenue }));

      setTop10Data(top10);
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

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  const handleExportCSV = () => {
    setExportingCSV(true);
    
    const headers = ['Product', 'Category', 'Price', 'Times Ordered', 'Revenue', 'Trending'];
    const rows = filteredProducts.map(product => [
      product.name,
      product.category,
      `$${product.price.toFixed(2)}`,
      product.timesOrdered,
      `$${product.revenue.toFixed(2)}`,
      product.trending ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-inventory-${new Date().toISOString().split('T')[0]}.csv`;
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
      doc.text('Product Inventory Report', 14, 20);
      
      const tableData = filteredProducts.map(product => [
        product.name,
        product.category,
        `$${product.price.toFixed(2)}`,
        product.timesOrdered.toString(),
        `$${product.revenue.toFixed(2)}`
      ]);
      
      autoTable(doc, {
        head: [['Product', 'Category', 'Price', 'Times Ordered', 'Revenue']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [196, 69, 105] }
      });
      
      doc.save(`product-inventory-${new Date().toISOString().split('T')[0]}.pdf`);
      
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
            <SelectItem value="Cakes">Cakes</SelectItem>
            <SelectItem value="Cupcakes">Cupcakes</SelectItem>
            <SelectItem value="Pastries">Pastries</SelectItem>
            <SelectItem value="Cookies">Cookies</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const hasShopOrders = products.some(p => p.timesOrdered > 0);

  return (
    <ReportLayout
      title="Product Inventory Report"
      description="Catalog products with order statistics from shop purchases (Manager Only)"
      onExportCSV={handleExportCSV}
      onExportPDF={handleExportPDF}
      exportingCSV={exportingCSV}
      exportingPDF={exportingPDF}
      filters={filters}
    >
      {loading ? (
        <Card className="p-8 text-center">Loading...</Card>
      ) : (
        <div className="space-y-6">
          {!hasShopOrders && (
            <Card className="p-6" style={{ background: '#FFF3E0', border: '1px solid #FFB300' }}>
              <div className="flex items-start gap-3">
                <span style={{ color: '#FFB300', fontSize: '20px' }}>ℹ️</span>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#2B2B2B', marginBottom: '8px' }}>
                    No Shop Orders Yet
                  </h4>
                  <p style={{ color: '#5D5D5D', fontSize: '14px', lineHeight: '1.5' }}>
                    Products listed below are catalog items available for purchase. Currently, all orders in the system are custom orders. 
                    Shop order statistics will appear here once customers place orders for standard catalog products.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {top10Data.length > 0 && (
            <Card className="p-6" style={{ background: 'white' }}>
              <h3 className="text-lg font-semibold mb-4">Top 10 Products by Revenue</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={top10Data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'Revenue ($)', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#C44569" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          <Card className="p-6" style={{ background: 'white' }}>
            <h3 className="text-lg font-semibold mb-4">All Products ({filteredProducts.length})</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Times Ordered</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Trending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.timesOrdered}</TableCell>
                      <TableCell>${product.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.trending && (
                          <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: '#4CAF5020', color: '#4CAF50' }}>
                            Trending
                          </span>
                        )}
                      </TableCell>
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
