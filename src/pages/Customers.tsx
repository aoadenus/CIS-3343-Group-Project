import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Search, UserPlus, Download, Mail, Phone, Calendar, ShoppingBag, Loader2, X, UserCheck } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { exportCustomersToCSV, formatDate as formatDateUtil } from '../utils/csvExport';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  lastOrderDate: string | null;
  isVip: boolean;
  createdAt?: string;
  adminNotes?: string | null; // Enhancement #35
  isGuest?: boolean; // Enhancement #39
  lastModifiedBy?: string | null; // Enhancement #12
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithOrders | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Enhancement #6: Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  
  // Paginated customers
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast('error', 'Failed to load customers. Please try again.', 'Connection Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      fetchAllCustomers();
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
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

  const validateForm = () => {
    const errors = { name: '', email: '', phone: '' };
    let isValid = true;

    if (!newCustomer.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!newCustomer.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (newCustomer.phone && !/^[\d\s()+\-]+$/.test(newCustomer.phone)) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
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
        setFormErrors({ name: '', email: '', phone: '' });
        showToast('success', `${created.name} has been added successfully`, 'Customer Created');
      } else {
        const error = await response.json();
        if (error.error?.includes('already exists')) {
          setFormErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else {
          showToast('error', error.error || 'Failed to create customer', 'Error');
        }
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      showToast('error', 'An unexpected error occurred. Please try again.', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    try {
      setIsDetailLoading(true);
      setSelectedCustomer(null);
      setIsDetailModalOpen(true);
      
      const response = await fetch(`/api/customers/${customer.id}`);
      if (response.ok) {
        const detailed = await response.json();
        setSelectedCustomer(detailed);
      } else {
        showToast('error', 'Failed to load customer details', 'Error');
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      showToast('error', 'Failed to load customer details', 'Error');
      setIsDetailModalOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Enhancement #47: Consistent MM/DD/YYYY date formatting
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No orders yet';
    return formatDateUtil(dateString) || 'No orders yet';
  };

  // Enhancement #25: CSV Export with filtering
  const handleExport = (type: string) => {
    let filteredCustomers = customers;
    
    if (type === 'VIP List') {
      filteredCustomers = customers.filter(c => c.isVip);
    } else if (type === 'Birthday List') {
      // Filter customers with upcoming birthdays (would need birthday field in real app)
      filteredCustomers = customers;
    }
    
    exportCustomersToCSV(filteredCustomers);
    showToast('success', `${type} exported successfully as CSV`, 'Export Complete');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setNewCustomer({ name: '', email: '', phone: '' });
    setFormErrors({ name: '', email: '', phone: '' });
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
            Customer Management
          </h1>
          <p style={{ 
            fontFamily: 'Lucida Handwriting', 
            fontSize: 'clamp(14px, 3vw, 16px)', 
            color: '#C44569', 
            opacity: 0.85,
            marginTop: '8px',
            letterSpacing: '0.01em'
          }}>
            Building sweet relationships
          </p>
        </div>
        <Button 
          className="text-white w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-200" 
          style={{ 
            borderRadius: '10px', 
            fontFamily: 'Poppins', 
            fontWeight: 600, 
            background: 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
            boxShadow: '0 4px 12px rgba(196, 69, 105, 0.3)',
            height: '48px',
            minWidth: '48px',
            paddingLeft: '24px',
            paddingRight: '24px'
          }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus size={18} className="mr-2" />
          Add New Customer
        </Button>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-4 sm:p-5 rounded-xl bg-white border-0" style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors" size={18} color={searchQuery ? '#C44569' : '#5A3825'} style={{ opacity: searchQuery ? 1 : 0.5 }} />
              <Input
                placeholder="Search customers by name, email, or ID..."
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
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="animate-spin" size={18} color="#C44569" />
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="sm:flex-none hover:scale-105 active:scale-95 transition-all duration-200"
              style={{ 
                borderRadius: '10px', 
                borderWidth: '2px',
                borderColor: 'rgba(90, 56, 37, 0.2)', 
                color: '#5A3825', 
                height: '48px',
                minWidth: '48px',
                paddingLeft: '20px',
                paddingRight: '20px',
                fontFamily: 'Poppins',
                fontWeight: 500
              }}
              onClick={() => handleExport('CSV')}
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Customer Cards Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="p-5 rounded-xl bg-white border-0" style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}>
                  <div className="space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : customers.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {paginatedCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="p-5 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-white border-0 group"
                  style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}
                  onClick={() => handleViewCustomer(customer)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleViewCustomer(customer);
                    }
                  }}
                  aria-label={`View details for ${customer.name}`}
                >
                  <div className="space-y-4">
                    {/* Avatar and Name */}
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110" 
                        style={{ 
                          width: '52px', 
                          height: '52px', 
                          background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.15) 0%, rgba(196, 69, 105, 0.25) 100%)'
                        }}
                      >
                        <span style={{ 
                          fontFamily: 'Poppins', 
                          fontWeight: 700, 
                          fontSize: '19px', 
                          color: '#C44569',
                          letterSpacing: '-0.02em'
                        }}>
                          {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p style={{ 
                            fontFamily: 'Poppins', 
                            fontWeight: 600, 
                            fontSize: '16px', 
                            color: '#2B2B2B',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {customer.name}
                          </p>
                          {/* Enhancement #39: Guest customer badge */}
                          {customer.isGuest && (
                            <Badge
                              style={{
                                backgroundColor: '#F59E0B20',
                                color: '#F59E0B',
                                fontFamily: 'Poppins',
                                fontSize: '10px',
                                fontWeight: 500,
                                border: 'none',
                                padding: '2px 6px'
                              }}
                            >
                              Guest
                            </Badge>
                          )}
                        </div>
                        <p style={{ 
                          fontFamily: 'Open Sans', 
                          fontSize: '13px', 
                          color: '#5A3825', 
                          opacity: 0.7,
                          marginTop: '2px'
                        }}>
                          {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                        </p>
                      </div>
                      {customer.isVip && (
                        <Badge 
                          className="rounded-lg text-xs px-2 py-1 animate-pulse"
                          style={{ 
                            background: 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
                            color: '#FFFFFF',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(196, 69, 105, 0.3)'
                          }}
                        >
                          VIP
                        </Badge>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2.5 pb-4" style={{ borderBottom: '1px solid rgba(90, 56, 37, 0.08)' }}>
                      <div className="flex items-center gap-2.5">
                        <Mail size={14} color="#C44569" style={{ opacity: 0.7, flexShrink: 0 }} />
                        <span style={{ 
                          fontFamily: 'Open Sans', 
                          fontSize: '13px', 
                          color: '#5A3825',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.5
                        }}>
                          {customer.email}
                        </span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2.5">
                          <Phone size={14} color="#C44569" style={{ opacity: 0.7, flexShrink: 0 }} />
                          <span style={{ 
                            fontFamily: 'Open Sans', 
                            fontSize: '13px', 
                            color: '#5A3825',
                            lineHeight: 1.5
                          }}>
                            {customer.phone}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ 
                          fontFamily: 'Open Sans', 
                          fontSize: '11px', 
                          color: '#5A3825', 
                          opacity: 0.6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '4px'
                        }}>
                          Total Orders
                        </p>
                        <p style={{ 
                          fontFamily: 'Poppins', 
                          fontWeight: 700, 
                          fontSize: '20px', 
                          color: '#2B2B2B',
                          lineHeight: 1
                        }}>
                          {customer.totalOrders}
                        </p>
                      </div>
                      <div className="text-right">
                        <p style={{ 
                          fontFamily: 'Open Sans', 
                          fontSize: '11px', 
                          color: '#5A3825', 
                          opacity: 0.6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '4px'
                        }}>
                          Last Order
                        </p>
                        <p style={{ 
                          fontFamily: 'Open Sans', 
                          fontSize: '13px', 
                          color: '#2B2B2B',
                          fontWeight: 500,
                          lineHeight: 1.3
                        }}>
                          {formatDate(customer.lastOrderDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-16 text-center rounded-xl bg-white border-0" style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}>
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.2) 100%)' }}>
                  <Search size={32} color="#C44569" style={{ opacity: 0.5 }} />
                </div>
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#2B2B2B', marginBottom: '8px' }}>
                  {searchQuery ? 'No customers found' : 'No customers yet'}
                </h3>
                <p style={{ fontFamily: 'Open Sans', fontSize: '15px', color: '#5A3825', opacity: 0.7, lineHeight: 1.6 }}>
                  {searchQuery 
                    ? `No results match "${searchQuery}". Try a different search term.`
                    : 'Start building your customer base by adding your first customer.'}
                </p>
                {!searchQuery && (
                  <Button
                    className="mt-6"
                    style={{ 
                      background: 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
                      color: 'white',
                      borderRadius: '10px',
                      height: '44px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      fontFamily: 'Poppins',
                      fontWeight: 600
                    }}
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add Your First Customer
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      {!isLoading && customers.length > itemsPerPage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{
              borderRadius: '10px',
              borderColor: 'rgba(196, 69, 105, 0.2)',
              color: currentPage === 1 ? '#CCC' : '#C44569',
              fontFamily: 'Poppins',
              fontWeight: 500
            }}
          >
            ← Previous
          </Button>
          <span style={{ 
            fontFamily: 'Poppins', 
            fontSize: '14px', 
            color: '#2B2B2B',
            padding: '0 16px'
          }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{
              borderRadius: '10px',
              borderColor: 'rgba(196, 69, 105, 0.2)',
              color: currentPage === totalPages ? '#CCC' : '#C44569',
              fontFamily: 'Poppins',
              fontWeight: 500
            }}
          >
            Next →
          </Button>
        </motion.div>
      )}

      {/* Bottom Section - Analytics */}
      {!isLoading && customers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <div className="col-span-1 lg:col-span-2">
            <Card className="p-6 rounded-xl bg-white border-0" style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}>
              <h3 className="mb-5" style={{ 
                fontFamily: 'Poppins', 
                fontWeight: 600, 
                fontSize: '18px', 
                color: '#2B2B2B',
                letterSpacing: '-0.01em'
              }}>
                Marketing Lists
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Birthday Reminder List', type: 'Birthday List' },
                  { label: 'VIP Customer List (5+ orders)', type: 'VIP List' },
                  { label: 'Newsletter Subscribers', type: 'Newsletter' }
                ].map((item) => (
                  <Button 
                    key={item.type}
                    variant="outline" 
                    className="w-full justify-start text-left hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                    style={{ 
                      borderRadius: '10px', 
                      borderWidth: '2px',
                      borderColor: 'rgba(90, 56, 37, 0.15)', 
                      color: '#5A3825',
                      height: '52px',
                      fontFamily: 'Open Sans',
                      fontSize: '15px',
                      paddingLeft: '20px'
                    }}
                    onClick={() => handleExport(item.type)}
                  >
                    <Download size={16} className="mr-3" color="#C44569" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          <div className="col-span-1">
            <Card className="p-6 rounded-xl bg-white border-0" style={{ boxShadow: '0px 4px 16px rgba(90, 56, 37, 0.08)' }}>
              <h3 className="mb-5" style={{ 
                fontFamily: 'Poppins', 
                fontWeight: 600, 
                fontSize: '18px', 
                color: '#2B2B2B',
                letterSpacing: '-0.01em'
              }}>
                Customer Analytics
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>
                    Total Customers
                  </span>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '24px', color: '#2B2B2B' }}>
                    {customers.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>
                    VIP Customers
                  </span>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '24px', color: '#C44569' }}>
                    {customers.filter(c => c.isVip).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Add Customer Modal - TO BE CONTINUED IN NEXT PART */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-0" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)' }}>
          <DialogHeader>
            <DialogTitle style={{ 
              fontFamily: 'Playfair Display', 
              fontSize: '28px', 
              color: '#C44569',
              letterSpacing: '-0.02em',
              lineHeight: 1.3
            }}>
              Add New Customer
            </DialogTitle>
            <DialogDescription style={{ 
              fontFamily: 'Open Sans', 
              color: '#5A3825',
              fontSize: '15px',
              lineHeight: 1.6,
              marginTop: '8px'
            }}>
              Create a new customer profile to start tracking their orders
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-5 mt-2">
            <div>
              <Label htmlFor="name" style={{ 
                fontFamily: 'Poppins', 
                fontSize: '14px', 
                color: '#2B2B2B',
                fontWeight: 500,
                display: 'block',
                marginBottom: '8px'
              }}>
                Full Name *
              </Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                }}
                className={`rounded-lg border-2 transition-all ${formErrors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#C44569]'}`}
                style={{ height: '48px', fontSize: '15px', fontFamily: 'Open Sans' }}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {formErrors.name && (
                <p className="mt-1.5 text-sm text-red-600" style={{ fontFamily: 'Open Sans' }}>
                  {formErrors.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" style={{ 
                fontFamily: 'Poppins', 
                fontSize: '14px', 
                color: '#2B2B2B',
                fontWeight: 500,
                display: 'block',
                marginBottom: '8px'
              }}>
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, email: e.target.value });
                  if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                }}
                className={`rounded-lg border-2 transition-all ${formErrors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#C44569]'}`}
                style={{ height: '48px', fontSize: '15px', fontFamily: 'Open Sans' }}
                placeholder="john.doe@example.com"
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="mt-1.5 text-sm text-red-600" style={{ fontFamily: 'Open Sans' }}>
                  {formErrors.email}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" style={{ 
                fontFamily: 'Poppins', 
                fontSize: '14px', 
                color: '#2B2B2B',
                fontWeight: 500,
                display: 'block',
                marginBottom: '8px'
              }}>
                Phone Number <span style={{ opacity: 0.6 }}>(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, phone: e.target.value });
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                }}
                className={`rounded-lg border-2 transition-all ${formErrors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#C44569]'}`}
                style={{ height: '48px', fontSize: '15px', fontFamily: 'Open Sans' }}
                placeholder="(555) 123-4567"
                disabled={isSubmitting}
              />
              {formErrors.phone && (
                <p className="mt-1.5 text-sm text-red-600" style={{ fontFamily: 'Open Sans' }}>
                  {formErrors.phone}
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                disabled={isSubmitting}
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{ 
                  background: isSubmitting ? '#94A3B8' : 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
                  color: 'white',
                  borderRadius: '10px',
                  height: '48px',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(196, 69, 105, 0.3)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Create Customer
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Modal - CENTERED & SCROLLABLE */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent 
          className="bg-white rounded-2xl border-2 p-0 gap-0 max-h-[85vh] flex flex-col w-[95vw] sm:max-w-[600px]" 
          style={{ 
            boxShadow: '0 20px 60px rgba(196, 69, 105, 0.3)', 
            borderColor: 'rgba(196, 69, 105, 0.2)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '600px'
          }}
        >
          {isDetailLoading ? (
            <div className="p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin" size={40} color="#C44569" />
                <p style={{ fontFamily: 'Poppins', fontSize: '15px', color: '#5A3825', opacity: 0.7 }}>
                  Loading customer details...
                </p>
              </div>
            </div>
          ) : selectedCustomer ? (
            <>
              {/* Fixed Header with DialogHeader wrapper */}
              <DialogHeader className="flex-shrink-0 px-6 py-5 border-b" style={{ borderColor: 'rgba(196, 69, 105, 0.1)' }}>
                <DialogTitle style={{ 
                  fontFamily: 'Playfair Display', 
                  fontSize: '24px', 
                  fontWeight: 700,
                  color: '#C44569',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  margin: 0,
                  paddingRight: '40px'
                }}>
                  {selectedCustomer.name}
                  {selectedCustomer.isVip && (
                    <Badge 
                      className="rounded-lg px-3 py-1.5"
                      style={{ 
                        background: 'linear-gradient(135deg, #C44569 0%, #B23A5A 100%)',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '11px',
                        boxShadow: '0 2px 8px rgba(196, 69, 105, 0.3)'
                      }}
                    >
                      ⭐ VIP
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription style={{ 
                  fontFamily: 'Open Sans', 
                  color: '#5A3825',
                  fontSize: '12px',
                  opacity: 0.7,
                  marginTop: '4px'
                }}>
                  Customer ID: #{selectedCustomer.id}
                </DialogDescription>
              </DialogHeader>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C44569 #F5F5F5' }}>
                <div className="space-y-6">
                  {/* Customer ID Badge */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.05)', border: '1px dashed rgba(196, 69, 105, 0.3)' }}>
                    <UserCheck size={18} color="#C44569" />
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7 }}>
                        Customer ID
                      </p>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', color: '#C44569' }}>
                        #{selectedCustomer.id}
                      </p>
                    </div>
                    {selectedCustomer.isGuest && (
                      <Badge style={{ backgroundColor: '#F59E0B20', color: '#F59E0B', fontFamily: 'Poppins', fontSize: '11px', fontWeight: 600 }}>
                        GUEST
                      </Badge>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '13px', 
                      color: '#2B2B2B', 
                      marginBottom: '8px',
                      letterSpacing: '-0.01em'
                    }}>
                      Contact Information
                    </h3>
                    <div className="space-y-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.04)' }}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.1)' }}>
                          <Mail size={14} color="#C44569" />
                        </div>
                        <a 
                          href={`mailto:${selectedCustomer.email}`}
                          className="flex-1 hover:underline transition-all text-xs"
                          style={{ fontFamily: 'Open Sans', color: '#C44569', fontWeight: 500 }}
                        >
                          {selectedCustomer.email}
                        </a>
                      </div>
                      {selectedCustomer.phone && (
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.1)' }}>
                            <Phone size={14} color="#C44569" />
                          </div>
                          <a 
                            href={`tel:${selectedCustomer.phone}`}
                            className="flex-1 hover:underline transition-all text-xs"
                            style={{ fontFamily: 'Open Sans', color: '#C44569', fontWeight: 500 }}
                          >
                            {selectedCustomer.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.1)' }}>
                          <Calendar size={14} color="#C44569" />
                        </div>
                        <span style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#2B2B2B', flex: 1 }}>
                          Customer since {formatDate(selectedCustomer.createdAt || selectedCustomer.lastOrderDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Statistics */}
                  <div>
                    <h3 style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '17px', 
                      color: '#2B2B2B', 
                      marginBottom: '16px',
                      letterSpacing: '-0.01em'
                    }}>
                      Order Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.15) 100%)' }}>
                        <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                          Total Orders
                        </p>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '32px', color: '#C44569', lineHeight: 1 }}>
                          {selectedCustomer.totalOrders}
                        </p>
                      </div>
                      <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.15) 100%)' }}>
                        <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                          Last Order
                        </p>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#2B2B2B', lineHeight: 1.3 }}>
                          {formatDate(selectedCustomer.lastOrderDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order History */}
                  <div>
                    <h3 style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '17px', 
                      color: '#2B2B2B', 
                      marginBottom: '16px',
                      letterSpacing: '-0.01em'
                    }}>
                      Order History
                    </h3>
                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C44569 #F5F5F5' }}>
                      {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                        selectedCustomer.orders.map((order) => (
                          <div 
                            key={order.id}
                            className="p-4 rounded-lg flex items-center justify-between transition-all hover:shadow-md"
                            style={{ backgroundColor: 'rgba(90, 56, 37, 0.04)', border: '1px solid rgba(90, 56, 37, 0.08)' }}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.1)' }}>
                                <ShoppingBag size={16} color="#C44569" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p style={{ 
                                  fontFamily: 'Poppins', 
                                  fontWeight: 500, 
                                  fontSize: '14px', 
                                  color: '#2B2B2B',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {order.occasion || 'Custom Order'}
                                </p>
                                <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.7, marginTop: '2px' }}>
                                  {formatDate(order.createdAt)} · Order #{order.id}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              style={{ 
                                backgroundColor: order.status === 'completed' ? '#22C55E20' : 
                                               order.status === 'cancelled' ? '#EF444420' : 
                                               order.status === 'ready' ? '#10B98120' :
                                               order.status === 'preparing' ? '#3B82F620' : '#F59E0B20',
                                color: order.status === 'completed' ? '#22C55E' :
                                      order.status === 'cancelled' ? '#EF4444' :
                                      order.status === 'ready' ? '#10B981' :
                                      order.status === 'preparing' ? '#3B82F6' : '#F59E0B',
                                fontFamily: 'Poppins',
                                fontSize: '11px',
                                fontWeight: 600,
                                border: 'none',
                                textTransform: 'capitalize'
                              }}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(196, 69, 105, 0.1)' }}>
                            <ShoppingBag size={24} color="#C44569" style={{ opacity: 0.5 }} />
                          </div>
                          <p style={{ fontFamily: 'Poppins', fontSize: '15px', color: '#5A3825', opacity: 0.7 }}>
                            No orders yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhancement #35: Admin Notes */}
                  <div>
                    <h3 style={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 600, 
                      fontSize: '15px', 
                      color: '#2B2B2B', 
                      marginBottom: '12px',
                      letterSpacing: '-0.01em'
                    }}>
                      📝 Internal Notes
                    </h3>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(196, 69, 105, 0.05)', border: '1px solid rgba(196, 69, 105, 0.1)' }}>
                      {selectedCustomer.adminNotes ? (
                        <p style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#2B2B2B', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {selectedCustomer.adminNotes}
                        </p>
                      ) : (
                        <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.5, fontStyle: 'italic' }}>
                          No admin notes for this customer
                        </p>
                      )}
                    </div>
                    {selectedCustomer.lastModifiedBy && (
                      <p style={{ fontFamily: 'Open Sans', fontSize: '11px', color: '#5A3825', opacity: 0.6, marginTop: '8px' }}>
                        Last modified by: {selectedCustomer.lastModifiedBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
