import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { exportOrdersToCSV, formatDate as formatDateUtil } from '../../utils/csvExport';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Ban,
  ChevronDown,
  Layers,
  Loader2,
  X,
  PackageSearch,
  Clock,
  Plus
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import type { CakeLayer } from '../../../shared/schema';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../components/ui/tooltip';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  orderType: string;
  occasion: string | null;
  flavor: string | null;
  layers: string | null;
  design: string | null;
  servings: number | null;
  eventDate: string | null;
  status: string;
  totalAmount: number | null;
  depositAmount: number | null;
  balanceDue: number | null;
  paymentStatus: string;
  depositRequired: number | null; // Enhancement #32
  depositMet: boolean; // Enhancement #32
  createdAt: string;
  cancellationReason: string | null;
  cancelledAt: string | null;
}

interface OrderListProps {
  onNavigate?: (page: string) => void;
}

export function OrderList({ onNavigate }: OrderListProps = {}) {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'customer' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Cancel order modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Detail modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Payment tracking
  const [payments, setPayments] = useState<Array<{
    id: number;
    paymentType: string;
    amount: number;
    paymentDate: string;
    paymentStatus: string;
    notes: string | null;
    recordedBy: string;
  }>>([]);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentType: 'cash',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'completed',
    notes: ''
  });
  
  // Enhancement #6: Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('error', 'Failed to load orders. Please try again.', 'Connection Error');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(query) ||
        order.customerEmail?.toLowerCase().includes(query) ||
        order.id.toString().includes(query) ||
        order.occasion?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'customer':
          comparison = (a.customerName || '').localeCompare(b.customerName || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

  const handleCancelOrder = async () => {
    if (!orderToCancel || !cancellationReason.trim()) {
      showToast('error', 'Please provide a cancellation reason', 'Validation Error');
      return;
    }

    try {
      setIsCancelling(true);
      const response = await fetch(`/api/orders/${orderToCancel.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: cancellationReason,
          cancelledBy: 'Admin'
        })
      });

      if (response.ok) {
        await fetchOrders();
        setIsCancelModalOpen(false);
        setCancellationReason('');
        setOrderToCancel(null);
        showToast('success', `Order #${orderToCancel.id} has been cancelled`, 'Order Cancelled');
      } else {
        const error = await response.json();
        showToast('error', error.error || 'Failed to cancel order', 'Error');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast('error', 'An unexpected error occurred. Please try again.', 'Error');
    } finally {
      setIsCancelling(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const fetchPayments = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/payments`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    fetchPayments(order.id);
  };

  const handleRecordPayment = async () => {
    if (!selectedOrder) return;
    
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      showToast('error', 'Please enter a valid payment amount', 'Validation Error');
      return;
    }

    try {
      setIsRecordingPayment(true);
      const amountInCents = Math.round(parseFloat(paymentForm.amount) * 100);
      
      const response = await fetch(`/api/orders/${selectedOrder.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: paymentForm.paymentType,
          amount: amountInCents,
          paymentDate: paymentForm.paymentDate,
          paymentStatus: paymentForm.paymentStatus,
          notes: paymentForm.notes || null,
          recordedBy: 'Admin' // In a real app, this would be the logged-in user
        })
      });

      if (response.ok) {
        await fetchPayments(selectedOrder.id);
        await fetchOrders(); // Refresh orders to update payment status
        setPaymentForm({
          paymentType: 'cash',
          amount: '',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentStatus: 'completed',
          notes: ''
        });
        showToast('success', 'Payment recorded successfully', 'Payment Recorded');
      } else {
        const error = await response.json();
        showToast('error', error.error || 'Failed to record payment', 'Error');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      showToast('error', 'An unexpected error occurred', 'Error');
    } finally {
      setIsRecordingPayment(false);
    }
  };

  // Enhancement #47: Consistent MM/DD/YYYY date formatting
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return formatDateUtil(dateString) || 'N/A';
  };
  
  // Enhancement #25: CSV Export for filtered orders
  const handleExportOrders = () => {
    exportOrdersToCSV(filteredOrders);
    showToast('success', `${filteredOrders.length} orders exported as CSV`, 'Export Complete');
  };

  const formatCurrency = (cents: number | null) => {
    if (cents === null) return 'N/A';
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'preparing': return '#3B82F6';
      case 'ready': return '#10B981';
      case 'completed': return '#22C55E';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const parseLayers = (layersJson: string | null): CakeLayer[] => {
    if (!layersJson) return [];
    try {
      return JSON.parse(layersJson);
    } catch {
      return [];
    }
  };
  
  // Enhancement #46: Order aging indicator (7+ days pending)
  const getOrderAge = (createdAt: string): number => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const isOrderAging = (order: Order): boolean => {
    return order.status === 'pending' && getOrderAge(order.createdAt) >= 7;
  };
  
  // Enhancement #6: Pagination helpers
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);
  
  // Enhancement #5, #22, #36: Check if order can be edited (locked after preparing/baking)
  const canEditOrder = (status: string): boolean => {
    return status === 'pending';
  };
  
  const getEditLockReason = (status: string): string => {
    if (status === 'preparing') return 'Order is currently being prepared and cannot be modified';
    if (status === 'ready') return 'Order is ready for pickup and cannot be modified';
    if (status === 'completed') return 'Completed orders cannot be modified';
    if (status === 'cancelled') return 'Cancelled orders cannot be modified';
    return 'This order is locked from editing';
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 style={{ 
            fontFamily: 'Playfair Display', 
            fontWeight: 700, 
            fontSize: 'clamp(28px, 5vw, 36px)',
            color: '#C44569',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            Order Management
          </h1>
          <p style={{ 
            fontFamily: 'Lucida Handwriting', 
            fontSize: 'clamp(14px, 3vw, 16px)', 
            color: '#C44569', 
            opacity: 0.85,
            marginTop: '8px',
            letterSpacing: '0.01em'
          }}>
            Complete order list and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onNavigate && onNavigate('order-create')}
            className="hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ 
              borderRadius: '10px', 
              background: '#C44569',
              color: '#FFFFFF',
              height: '48px',
              paddingLeft: '20px',
              paddingRight: '20px',
              fontFamily: 'Poppins',
              fontWeight: 600
            }}
          >
            <Plus size={18} className="mr-2" />
            Create Order
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportOrders}
            className="hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ 
              borderRadius: '10px', 
              borderWidth: '2px',
              borderColor: 'rgba(90, 56, 37, 0.2)', 
              color: '#5A3825',
              height: '48px',
              paddingLeft: '20px',
              paddingRight: '20px',
              fontFamily: 'Poppins',
              fontWeight: 500
            }}
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-4 sm:p-5 rounded-xl bg-white border-0" style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors" 
                size={18} 
                color={searchQuery ? '#C44569' : '#5A3825'}
                style={{ opacity: searchQuery ? 1 : 0.5 }}
              />
              <Input
                placeholder="Search by customer, ID, or occasion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 rounded-lg bg-white border-2 transition-all focus:border-[#C44569] focus:shadow-[0_0_0_3px_rgba(196,69,105,0.1)]"
                style={{ 
                  borderColor: searchQuery ? '#C44569' : 'rgba(90, 56, 37, 0.15)', 
                  color: '#2B2B2B', 
                  fontFamily: 'Open Sans',
                  height: '48px',
                  fontSize: '15px'
                }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} color="#5A3825" style={{ opacity: 0.6 }} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} color="#C44569" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 rounded-lg border-2 bg-white transition-all focus:border-[#C44569] focus:shadow-[0_0_0_3px_rgba(196,69,105,0.1)]"
                style={{ 
                  borderColor: 'rgba(90, 56, 37, 0.15)',
                  fontFamily: 'Open Sans',
                  color: '#2B2B2B',
                  height: '48px',
                  fontSize: '15px'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={18} color="#C44569" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full px-4 rounded-lg border-2 bg-white transition-all focus:border-[#C44569] focus:shadow-[0_0_0_3px_rgba(196,69,105,0.1)]"
                style={{ 
                  borderColor: 'rgba(90, 56, 37, 0.15)',
                  fontFamily: 'Open Sans',
                  color: '#2B2B2B',
                  height: '48px',
                  fontSize: '15px'
                }}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="customer-asc">Customer A-Z</option>
                <option value="customer-desc">Customer Z-A</option>
                <option value="status-asc">Status A-Z</option>
                <option value="status-desc">Status Z-A</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-xl bg-white overflow-hidden border-0" style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="h-12 bg-gray-200 rounded w-16"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: 'rgba(90, 56, 37, 0.1)' }}>
                    <TableHead style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Order ID
                    </TableHead>
                    <TableHead style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Customer
                    </TableHead>
                    <TableHead style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Occasion
                    </TableHead>
                    <TableHead style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Event Date
                    </TableHead>
                    <TableHead style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Status
                    </TableHead>
                    <TableHead style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Payment
                    </TableHead>
                    <TableHead style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Created
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#2B2B2B', fontSize: '14px' }}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  style={{ borderColor: 'rgba(90, 56, 37, 0.1)' }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#C44569' }}>
                    <div className="flex items-center gap-2">
                      #{order.id}
                      {/* Enhancement #46: Aging indicator for old pending orders */}
                      {isOrderAging(order) && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: '#F59E0B20', border: '1px solid #F59E0B40' }} title={`Order is ${getOrderAge(order.createdAt)} days old`}>
                          <Clock size={12} color="#F59E0B" />
                          <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 500 }}>{getOrderAge(order.createdAt)}d</span>
                        </div>
                      )}
                      {/* Enhancement #32: Deposit status indicator */}
                      {order.depositRequired && !order.depositMet && (
                        <div className="px-2 py-0.5 rounded-full" style={{ background: '#EF444420', border: '1px solid #EF444440' }} title="Deposit not met">
                          <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 500 }}>Deposit Pending</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#2B2B2B' }}>
                        {order.customerName}
                      </p>
                      <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>
                        {order.customerEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.layers && parseLayers(order.layers).length > 0 && (
                        <Layers size={14} color="#C44569" />
                      )}
                      <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#2B2B2B' }}>
                        {order.occasion || 'Custom'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                    {formatDate(order.eventDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        border: 'none'
                      }}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#2B2B2B' }}>
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: order.paymentStatus === 'paid' ? '#22C55E20' : 
                                          order.paymentStatus === 'partial' ? '#F59E0B20' : '#EF444420',
                          color: order.paymentStatus === 'paid' ? '#22C55E' :
                                order.paymentStatus === 'partial' ? '#F59E0B' : '#EF4444',
                          border: 'none',
                          fontFamily: 'Poppins'
                        }}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOrderDetails(order)}
                        className="hover:scale-105 active:scale-95 transition-all duration-200"
                        style={{ 
                          borderColor: 'rgba(90, 56, 37, 0.3)',
                          color: '#5A3825',
                          height: '32px',
                          padding: '0 12px',
                          borderRadius: '6px'
                        }}
                      >
                        <Eye size={14} />
                      </Button>
                      {/* Enhancement #5, #22, #36: Disabled states with tooltips */}
                      {canEditOrder(order.status) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setOrderToCancel(order);
                            setIsCancelModalOpen(true);
                          }}
                          className="hover:scale-105 active:scale-95 transition-all duration-200"
                          style={{ 
                            borderColor: '#EF444430',
                            color: '#EF4444',
                            height: '32px',
                            padding: '0 12px',
                            borderRadius: '6px'
                          }}
                        >
                          <Ban size={14} />
                        </Button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="cursor-not-allowed"
                                style={{ 
                                  borderColor: '#D1D5DB',
                                  color: '#9CA3AF',
                                  height: '32px',
                                  padding: '0 12px',
                                  borderRadius: '6px',
                                  opacity: 0.5
                                }}
                              >
                                <Ban size={14} />
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent style={{ backgroundColor: '#2B2B2B', color: 'white', padding: '8px 12px', borderRadius: '6px', fontFamily: 'Open Sans', fontSize: '12px' }}>
                            {getEditLockReason(order.status)}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {!isLoading && filteredOrders.length === 0 && (
            <div className="p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.2) 100%)' }}>
                  <PackageSearch size={32} color="#C44569" style={{ opacity: 0.5 }} />
                </div>
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#2B2B2B', marginBottom: '8px' }}>
                  {searchQuery || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
                </h3>
                <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825', opacity: 0.7, lineHeight: 1.6 }}>
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Orders will appear here once customers place them.'}
                </p>
              </div>
            </div>
          )}
          
          {/* Enhancement #6: Pagination Controls */}
          {!isLoading && filteredOrders.length > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: 'rgba(90, 56, 37, 0.1)' }}>
              <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.7 }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    borderRadius: '8px',
                    borderColor: 'rgba(90, 56, 37, 0.2)',
                    color: '#5A3825',
                    fontFamily: 'Poppins',
                    fontWeight: 500
                  }}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span style={{ color: '#5A3825', opacity: 0.5 }}>...</span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          style={{
                            borderRadius: '8px',
                            backgroundColor: currentPage === page ? '#C44569' : 'transparent',
                            borderColor: currentPage === page ? '#C44569' : 'rgba(90, 56, 37, 0.2)',
                            color: currentPage === page ? 'white' : '#5A3825',
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            minWidth: '36px'
                          }}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    borderRadius: '8px',
                    borderColor: 'rgba(90, 56, 37, 0.2)',
                    color: '#5A3825',
                    fontFamily: 'Poppins',
                    fontWeight: 500
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.7 }}>
            Total Orders
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '32px', color: '#C44569' }}>
            {orders.length}
          </p>
        </Card>
        <Card className="p-5 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.7 }}>
            Pending
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '32px', color: '#F59E0B' }}>
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </Card>
        <Card className="p-5 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.7 }}>
            Completed
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '32px', color: '#22C55E' }}>
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </Card>
        <Card className="p-5 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.7 }}>
            Cancelled
          </p>
          <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '32px', color: '#EF4444' }}>
            {orders.filter(o => o.status === 'cancelled').length}
          </p>
        </Card>
      </div>

      {/* Cancel Order Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-0" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)' }}>
          <DialogHeader>
            <DialogTitle style={{ 
              fontFamily: 'Playfair Display', 
              fontSize: '28px', 
              color: '#EF4444',
              letterSpacing: '-0.02em',
              lineHeight: 1.3
            }}>
              Cancel Order #{orderToCancel?.id}
            </DialogTitle>
            <DialogDescription style={{ 
              fontFamily: 'Open Sans', 
              color: '#5A3825',
              fontSize: '15px',
              lineHeight: 1.6,
              marginTop: '8px'
            }}>
              This order can only be cancelled because it's still pending. Please provide a reason for the cancellation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="reason" style={{ 
                fontFamily: 'Poppins', 
                fontSize: '14px', 
                color: '#2B2B2B',
                fontWeight: 500,
                display: 'block',
                marginBottom: '8px'
              }}>
                Cancellation Reason *
              </Label>
              <Textarea
                id="reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g., Customer requested cancellation, Ingredients unavailable..."
                maxLength={500}
                className="min-h-[120px] rounded-lg border-2 transition-all focus:border-[#C44569]"
                style={{ fontSize: '15px', fontFamily: 'Open Sans' }}
                required
                disabled={isCancelling}
              />
              {/* Enhancement #15: Character counter */}
              <p style={{ 
                fontFamily: 'Open Sans', 
                fontSize: '12px', 
                color: cancellationReason.length > 450 ? '#EF4444' : '#5A3825',
                opacity: 0.7,
                marginTop: '4px',
                textAlign: 'right'
              }}>
                {cancellationReason.length} / 500 characters
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setCancellationReason('');
                  setOrderToCancel(null);
                }}
                disabled={isCancelling}
                className="flex-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{ 
                  borderWidth: '2px',
                  borderColor: 'rgba(90, 56, 37, 0.2)', 
                  color: '#5A3825',
                  borderRadius: '10px',
                  height: '48px',
                  fontFamily: 'Poppins',
                  fontWeight: 500
                }}
              >
                Keep Order
              </Button>
              <Button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{ 
                  backgroundColor: isCancelling ? '#94A3B8' : '#EF4444', 
                  color: 'white',
                  borderRadius: '10px',
                  height: '48px',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  boxShadow: isCancelling ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Ban size={16} className="mr-2" />
                    Cancel Order
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white max-h-[70vh] overflow-y-auto rounded-xl border-2" style={{ boxShadow: '0 8px 32px rgba(196, 69, 105, 0.25)', borderColor: 'rgba(196, 69, 105, 0.2)', position: 'relative' }}>
          {/* Clear Close Button */}
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="absolute top-3 right-3 z-50 rounded-full p-2 hover:bg-gray-100 transition-all"
            style={{ 
              backgroundColor: 'rgba(196, 69, 105, 0.1)',
              border: '2px solid #C44569'
            }}
          >
            <X size={20} color="#C44569" strokeWidth={3} />
          </button>
          
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Playfair Display', fontSize: '18px', color: '#C44569' }}>
                  Order #{selectedOrder.id}
                </DialogTitle>
                <DialogDescription style={{ fontFamily: 'Open Sans', color: '#5A3825', fontSize: '12px' }}>
                  {selectedOrder.occasion || 'Custom Order'} · {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-3">
                {/* Customer Info */}
                <div>
                  <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#2B2B2B', marginBottom: '8px' }}>
                    Customer Information
                  </h3>
                  <div className="space-y-1">
                    <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825' }}>
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </p>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </p>
                    {selectedOrder.customerPhone && (
                      <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                        <strong>Phone:</strong> {selectedOrder.customerPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cake Details */}
                <div>
                  <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#2B2B2B', marginBottom: '8px' }}>
                    Cake Details
                  </h3>
                  {selectedOrder.layers && parseLayers(selectedOrder.layers).length > 0 ? (
                    <div className="space-y-2">
                      <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                        <strong>Layers:</strong> {parseLayers(selectedOrder.layers).length}
                      </p>
                      {parseLayers(selectedOrder.layers).map((layer, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: 'rgba(196, 69, 105, 0.05)' }}
                        >
                          <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '13px', color: '#2B2B2B' }}>
                            Layer {idx + 1}: {layer.flavor}
                          </p>
                          {layer.fillings && layer.fillings.length > 0 && (
                            <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825' }}>
                              Fillings: {layer.fillings.join(', ')}
                            </p>
                          )}
                          {layer.notes && (
                            <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', fontStyle: 'italic' }}>
                              "{layer.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                        <strong>Flavor:</strong> {selectedOrder.flavor || 'N/A'}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2 mt-3">
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Design:</strong> {selectedOrder.design || 'N/A'}
                    </p>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Servings:</strong> {selectedOrder.servings || 'N/A'}
                    </p>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Event Date:</strong> {formatDate(selectedOrder.eventDate)}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#2B2B2B', marginBottom: '8px' }}>
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Total:</strong> {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Deposit:</strong> {formatCurrency(selectedOrder.depositAmount)}
                    </p>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Status:</strong>{' '}
                      <Badge
                        style={{
                          backgroundColor: selectedOrder.paymentStatus === 'paid' ? '#22C55E20' : '#EF444420',
                          color: selectedOrder.paymentStatus === 'paid' ? '#22C55E' : '#EF4444',
                          marginLeft: '8px'
                        }}
                      >
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </p>
                  </div>
                </div>

                {/* Payment Tracking */}
                {selectedOrder.status !== 'cancelled' && (
                  <div className="space-y-4">
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#2B2B2B', marginBottom: '8px' }}>
                      Payment Tracker
                    </h3>
                    
                    {/* Payment Summary */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.05)' }}>
                        <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>Total Paid</p>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#22C55E' }}>
                          {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.05)' }}>
                        <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>Balance Due</p>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#EF4444' }}>
                          {formatCurrency((selectedOrder.totalAmount || 0) - payments.reduce((sum, p) => sum + p.amount, 0))}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.05)' }}>
                        <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>Payment Count</p>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#C44569' }}>
                          {payments.length}
                        </p>
                      </div>
                    </div>

                    {/* Record Payment Form */}
                    <div className="p-4 rounded-lg border-2" style={{ borderColor: 'rgba(196, 69, 105, 0.15)', backgroundColor: 'rgba(196, 69, 105, 0.02)' }}>
                      <h4 style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#2B2B2B', marginBottom: '12px' }}>
                        Record New Payment
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', display: 'block', marginBottom: '6px' }}>
                            Payment Type
                          </label>
                          <select
                            value={paymentForm.paymentType}
                            onChange={(e) => setPaymentForm({ ...paymentForm, paymentType: e.target.value })}
                            className="w-full rounded-lg border-2 px-3 py-2"
                            style={{ borderColor: 'rgba(90, 56, 37, 0.2)', fontFamily: 'Open Sans', fontSize: '14px' }}
                          >
                            <option value="cash">Cash</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="check">Check</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', display: 'block', marginBottom: '6px' }}>
                            Amount ($)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                            placeholder="0.00"
                            className="rounded-lg border-2"
                            style={{ borderColor: 'rgba(90, 56, 37, 0.2)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', display: 'block', marginBottom: '6px' }}>
                            Payment Date
                          </label>
                          <Input
                            type="date"
                            value={paymentForm.paymentDate}
                            onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                            className="rounded-lg border-2"
                            style={{ borderColor: 'rgba(90, 56, 37, 0.2)' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', display: 'block', marginBottom: '6px' }}>
                            Status
                          </label>
                          <select
                            value={paymentForm.paymentStatus}
                            onChange={(e) => setPaymentForm({ ...paymentForm, paymentStatus: e.target.value })}
                            className="w-full rounded-lg border-2 px-3 py-2"
                            style={{ borderColor: 'rgba(90, 56, 37, 0.2)', fontFamily: 'Open Sans', fontSize: '14px' }}
                          >
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', display: 'block', marginBottom: '6px' }}>
                          Notes (optional)
                        </label>
                        <Input
                          value={paymentForm.notes}
                          onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                          placeholder="Additional payment details..."
                          className="rounded-lg border-2"
                          style={{ borderColor: 'rgba(90, 56, 37, 0.2)' }}
                        />
                      </div>
                      <Button
                        onClick={handleRecordPayment}
                        disabled={isRecordingPayment}
                        className="w-full mt-3"
                        style={{
                          background: isRecordingPayment ? '#94A3B8' : 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
                          color: 'white',
                          borderRadius: '10px',
                          height: '44px',
                          fontFamily: 'Poppins',
                          fontWeight: 600
                        }}
                      >
                        {isRecordingPayment ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Recording...
                          </>
                        ) : (
                          'Record Payment'
                        )}
                      </Button>
                    </div>

                    {/* Payment History */}
                    {payments.length > 0 && (
                      <div>
                        <h4 style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#2B2B2B', marginBottom: '12px' }}>
                          Payment History ({payments.length})
                        </h4>
                        <div className="space-y-2">
                          {payments.map((payment) => (
                            <div key={payment.id} className="p-3 rounded-lg border" style={{ borderColor: 'rgba(90, 56, 37, 0.15)' }}>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge style={{
                                      backgroundColor: payment.paymentType === 'cash' ? '#22C55E20' : payment.paymentType === 'credit_card' ? '#3B82F620' : '#F59E0B20',
                                      color: payment.paymentType === 'cash' ? '#22C55E' : payment.paymentType === 'credit_card' ? '#3B82F6' : '#F59E0B'
                                    }}>
                                      {payment.paymentType.replace('_', ' ')}
                                    </Badge>
                                    <Badge style={{
                                      backgroundColor: payment.paymentStatus === 'completed' ? '#22C55E20' : '#EF444420',
                                      color: payment.paymentStatus === 'completed' ? '#22C55E' : '#EF4444'
                                    }}>
                                      {payment.paymentStatus}
                                    </Badge>
                                  </div>
                                  <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>
                                    {formatDate(payment.paymentDate)} · By {payment.recordedBy}
                                  </p>
                                  {payment.notes && (
                                    <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', fontStyle: 'italic', marginTop: '4px' }}>
                                      "{payment.notes}"
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#22C55E' }}>
                                    {formatCurrency(payment.amount)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cancellation Info */}
                {selectedOrder.status === 'cancelled' && selectedOrder.cancellationReason && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#EF444410', border: '1px solid #EF444430' }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#EF4444', marginBottom: '8px' }}>
                      Cancelled
                    </h3>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      <strong>Reason:</strong> {selectedOrder.cancellationReason}
                    </p>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7, marginTop: '4px' }}>
                      {formatDate(selectedOrder.cancelledAt)}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
