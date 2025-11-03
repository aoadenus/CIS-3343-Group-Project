import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, Download, Calendar } from 'lucide-react';
import { dataSets } from '../../data/mockData';
import { Card, CardContent } from '../../components/ui/card';

export function AdminDashboard() {
  const [selectedDataSet, setSelectedDataSet] = useState('current');
  const [printMode, setPrintMode] = useState(false);

  // Get active dataset
  const activeDataSet = dataSets.find(ds => ds.id === selectedDataSet) || dataSets[0];
  const salesData = activeDataSet.salesData;
  const topProducts = activeDataSet.topProducts;
  const segments = activeDataSet.customerSegments;

  // KPI Calculations from active dataset
  const totalRevenue = salesData.reduce((sum, month) => sum + month.revenue, 0);
  const totalOrders = salesData.reduce((sum, month) => sum + month.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const revenueGrowth = ((salesData[salesData.length - 1].revenue - salesData[0].revenue) / salesData[0].revenue * 100).toFixed(1);

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(1)}k`,
      change: `+${revenueGrowth}%`,
      icon: DollarSign,
      color: '#C44569'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '+12.5%',
      icon: ShoppingCart,
      color: '#5A3825'
    },
    {
      title: 'Avg Order Value',
      value: `$${avgOrderValue.toFixed(0)}`,
      change: '+5.2%',
      icon: TrendingUp,
      color: '#C44569'
    },
    {
      title: 'Active Customers',
      value: '2,847',
      change: '+8.3%',
      icon: Users,
      color: '#5A3825'
    }
  ];

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  return (
    <>
    <div 
      className={`h-full flex flex-col overflow-hidden ${printMode ? 'print-mode' : ''}`}
      style={{ background: '#F8EBD7' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 mb-4"
      >
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 700,
                color: '#2B2B2B',
                marginBottom: '4px'
              }}
            >
              Analytics Dashboard
            </h1>
            <p style={{ fontFamily: 'Open Sans, sans-serif', color: '#5A3825', fontSize: '14px' }}>
              Real-time insights and performance metrics
            </p>
          </div>

          <div className="flex gap-3">
            {/* Demo Data Toggle */}
            <div className="flex gap-2">
              {dataSets.map(dataset => (
                <button
                  key={dataset.id}
                  onClick={() => setSelectedDataSet(dataset.id)}
                  style={{
                    padding: '10px 16px',
                    background: selectedDataSet === dataset.id ? '#C44569' : 'white',
                    color: selectedDataSet === dataset.id ? 'white' : '#2B2B2B',
                    border: selectedDataSet === dataset.id ? 'none' : '2px solid #E9E9E9',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  aria-label={`Switch to ${dataset.name} data`}
                  title={dataset.description}
                >
                  <Calendar className="inline-block w-4 h-4 mr-2" />
                  {dataset.name}
                </button>
              ))}
            </div>

            {/* Print Mode Toggle */}
            <button
              onClick={() => setPrintMode(!printMode)}
              style={{
                padding: '10px 16px',
                background: printMode ? '#C44569' : 'white',
                color: printMode ? 'white' : '#2B2B2B',
                border: printMode ? 'none' : '2px solid #E9E9E9',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              aria-label="Toggle print mode"
            >
              Print View
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 flex-shrink-0">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(90, 56, 37, 0.1)' }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ background: `${kpi.color}15` }}
                  >
                    <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <span 
                    className="px-2 py-1 rounded text-sm font-semibold"
                    style={{ 
                      background: kpi.change.startsWith('+') ? '#D4EDDA' : '#F8D7DA',
                      color: kpi.change.startsWith('+') ? '#155724' : '#721C24'
                    }}
                  >
                    {kpi.change}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#5A3825', marginBottom: '8px' }}>
                  {kpi.title}
                </h3>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '32px', fontWeight: 700, color: '#2B2B2B' }}>
                  {kpi.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(90, 56, 37, 0.1)' }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 600, color: '#2B2B2B' }}>
                  Revenue Trend
                </h3>
                <button
                  onClick={() => exportToCSV(salesData, `revenue-trend-${selectedDataSet}`)}
                  style={{
                    padding: '8px 12px',
                    background: '#F8EBD7',
                    color: '#2B2B2B',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  aria-label="Export revenue data to CSV"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9E9E9" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#5A3825"
                    style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#5A3825"
                    style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #E9E9E9',
                      borderRadius: '8px',
                      fontFamily: 'Open Sans, sans-serif'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '14px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#C44569" 
                    strokeWidth={3}
                    dot={{ fill: '#C44569', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(90, 56, 37, 0.1)' }}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 600, color: '#2B2B2B' }}>
                  Top Product Categories
                </h3>
                <button
                  onClick={() => exportToCSV(topProducts, `top-products-${selectedDataSet}`)}
                  style={{
                    padding: '8px 12px',
                    background: '#F8EBD7',
                    color: '#2B2B2B',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  aria-label="Export product data to CSV"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9E9E9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#5A3825"
                    style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#5A3825"
                    style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #E9E9E9',
                      borderRadius: '8px',
                      fontFamily: 'Open Sans, sans-serif'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '14px'
                    }}
                  />
                  <Bar dataKey="sales" fill="#C44569" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

        {/* Customer Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card style={{ background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(90, 56, 37, 0.1)' }}>
            <CardContent className="p-4">
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 600, color: '#2B2B2B', marginBottom: '16px' }}>
                Customer Segments
              </h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={segments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {segments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>

    {/* Print Styles */}
    <style>{`
      @media print {
        .print-mode {
          background: white !important;
        }
        .print-mode button {
          display: none !important;
        }
        .print-mode .recharts-legend {
          display: none !important;
        }
      }
    `}</style>
    </>
  );
}
