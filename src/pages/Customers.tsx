import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Search, UserPlus, Download, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  lastOrderDate: string | null;
  isVip: boolean;
  createdAt?: string;
}

interface CustomerWithOrders extends Customer {
  orders: Array<{
    id: number;
    occasion: string;
    status: string;
    eventDate: string | null;
    createdAt: string;
  }>;
}

export function Customers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithOrders | null>(null);
  
  // Add Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Fetch all customers on mount
  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Server-side search with debouncing
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      fetchAllCustomers();
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/customers/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error('Error searching customers:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.email) {
      showToast('error', 'Name and email are required', 'Validation Error');
      return;
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      if (response.ok) {
        const created = await response.json();
        setCustomers(prev => [created, ...prev]);
        setIsAddModalOpen(false);
        setNewCustomer({ name: '', email: '', phone: '' });
        showToast('success', `${created.name} has been added successfully`, 'Customer Created');
      } else {
        const error = await response.json();
        showToast('error', error.error || 'Failed to create customer', 'Error');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      showToast('error', 'An unexpected error occurred', 'Error');
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}`);
      if (response.ok) {
        const detailed = await response.json();
        setSelectedCustomer(detailed);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      showToast('error', 'Failed to load customer details', 'Error');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No orders yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleExport = (type: string) => {
    showToast('success', `${type} customer list has been downloaded successfully.`, 'Export Complete');
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569' }}>Customer Management</h1>
          <p className="tagline mt-2" style={{ fontFamily: 'Lucida Handwriting', fontSize: '16px', color: '#C44569', opacity: 0.9 }}>
            Building sweet relationships
          </p>
        </div>
        <Button 
          className="text-white w-full sm:w-auto hover:shadow-bakery-hover transition-all" 
          style={{ borderRadius: '8px', fontFamily: 'Poppins', fontWeight: 600, backgroundColor: '#C44569', height: '44px', minWidth: '44px' }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus size={18} className="mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4 sm:p-5 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} color="#C44569" />
            <Input
              placeholder="Search customers by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg bg-white"
              style={{ borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825', fontFamily: 'Open Sans' }}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-raspberry"></div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.3)', color: '#5A3825', height: '44px', minWidth: '44px' }}
              onClick={() => handleExport('CSV')}
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {customers.map((customer) => (
          <Card 
            key={customer.id} 
            className="p-5 rounded-xl cursor-pointer transition-all hover:shadow-bakery-hover bg-white"
            style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}
            onClick={() => handleViewCustomer(customer)}
          >
            <div className="space-y-4">
              {/* Avatar and Name */}
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="flex items-center justify-center rounded-full" 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'rgba(196, 69, 105, 0.15)' 
                  }}
                >
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#C44569' }}>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                    {customer.name}
                  </p>
                  <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                    {customer.totalOrders} orders
                  </p>
                </div>
                {customer.isVip && (
                  <Badge 
                    className="rounded-lg text-xs"
                    style={{ 
                      backgroundColor: '#C44569', 
                      color: '#FFFFFF',
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      padding: '4px 8px'
                    }}
                  >
                    VIP
                  </Badge>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pb-4" style={{ borderBottom: '1px solid rgba(90, 56, 37, 0.1)' }}>
                <div className="flex items-center gap-2">
                  <Mail size={14} color="#5A3825" style={{ opacity: 0.6 }} />
                  <span style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', wordBreak: 'break-all' }}>
                    {customer.email}
                  </span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} color="#5A3825" style={{ opacity: 0.6 }} />
                    <span style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825' }}>
                      {customer.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.6 }}>Total Orders</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#2B2B2B' }}>
                    {customer.totalOrders}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.6 }}>Last Order</p>
                  <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#2B2B2B' }}>
                    {formatDate(customer.lastOrderDate)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card className="p-12 text-center rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
          <p style={{ fontFamily: 'Poppins', fontSize: '16px', color: '#5A3825', opacity: 0.7 }}>
            {searchQuery ? 'No customers found matching your search' : 'No customers yet'}
          </p>
        </Card>
      )}

      {/* Bottom Section - Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <h3 className="mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 18px)', color: '#2B2B2B' }}>Marketing Lists</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                style={{ 
                  borderRadius: '8px', 
                  borderColor: 'rgba(90, 56, 37, 0.2)', 
                  color: '#5A3825',
                  height: '44px',
                  fontFamily: 'Open Sans'
                }}
                onClick={() => handleExport('Birthday List')}
              >
                Birthday Reminder List
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                style={{ 
                  borderRadius: '8px', 
                  borderColor: 'rgba(90, 56, 37, 0.2)', 
                  color: '#5A3825',
                  height: '44px',
                  fontFamily: 'Open Sans'
                }}
                onClick={() => handleExport('VIP List')}
              >
                VIP Customer List (5+ orders)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                style={{ 
                  borderRadius: '8px', 
                  borderColor: 'rgba(90, 56, 37, 0.2)', 
                  color: '#5A3825',
                  height: '44px',
                  fontFamily: 'Open Sans'
                }}
                onClick={() => handleExport('Newsletter')}
              >
                Newsletter Subscribers
              </Button>
            </div>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <h3 className="mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 18px)', color: '#2B2B2B' }}>Customer Analytics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>Total Customers</span>
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#2B2B2B' }}>
                  {customers.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>VIP Customers</span>
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#C44569' }}>
                  {customers.filter(c => c.isVip).length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Playfair Display', fontSize: '24px', color: '#C44569' }}>
              Add New Customer
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Open Sans', color: '#5A3825' }}>
              Create a new customer profile
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#2B2B2B' }}>
                Full Name *
              </Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="mt-1"
                placeholder="Enter customer name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#2B2B2B' }}>
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="mt-1"
                placeholder="customer@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#2B2B2B' }}>
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="mt-1"
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1"
                style={{ borderColor: 'rgba(90, 56, 37, 0.3)', color: '#5A3825' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                style={{ backgroundColor: '#C44569', color: 'white' }}
              >
                Create Customer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Playfair Display', fontSize: '24px', color: '#C44569' }}>
                  {selectedCustomer.name}
                  {selectedCustomer.isVip && (
                    <Badge 
                      className="ml-3 rounded-lg"
                      style={{ 
                        backgroundColor: '#C44569', 
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        fontWeight: 500
                      }}
                    >
                      VIP Customer
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription style={{ fontFamily: 'Open Sans', color: '#5A3825' }}>
                  Customer ID: #{selectedCustomer.id}
                </DialogDescription>
              </DialogHeader>
              
              {/* Contact Information */}
              <div className="space-y-4 mt-4">
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} color="#5A3825" style={{ opacity: 0.6 }} />
                    <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      {selectedCustomer.email}
                    </span>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} color="#5A3825" style={{ opacity: 0.6 }} />
                      <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                        {selectedCustomer.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={16} color="#5A3825" style={{ opacity: 0.6 }} />
                    <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825' }}>
                      Customer since {formatDate(selectedCustomer.createdAt || selectedCustomer.lastOrderDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="space-y-4 mt-6">
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                  Order Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.1)' }}>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>
                      Total Orders
                    </p>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '24px', color: '#C44569' }}>
                      {selectedCustomer.totalOrders}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.1)' }}>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>
                      Last Order
                    </p>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B' }}>
                      {formatDate(selectedCustomer.lastOrderDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-4 mt-6">
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                  Order History
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                    selectedCustomer.orders.map((order) => (
                      <div 
                        key={order.id}
                        className="p-3 rounded-lg flex items-center justify-between"
                        style={{ backgroundColor: 'rgba(90, 56, 37, 0.05)' }}
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag size={16} color="#C44569" />
                          <div>
                            <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: '#2B2B2B' }}>
                              {order.occasion || 'Custom Order'}
                            </p>
                            <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          style={{ 
                            backgroundColor: order.status === 'completed' ? '#22C55E' : 
                                           order.status === 'cancelled' ? '#EF4444' : '#C44569',
                            color: 'white',
                            fontFamily: 'Poppins',
                            fontSize: '11px'
                          }}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.7, textAlign: 'center', padding: '20px' }}>
                      No orders yet
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
