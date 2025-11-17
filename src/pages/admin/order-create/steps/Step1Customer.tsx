import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, User, X, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Textarea } from '../../../../components/ui/textarea';
import { useWizard } from '../WizardContext';
import { useToast } from '../../../../components/ToastContext';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { isValidEmail } from '../../../../utils/validation';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  isVip: boolean;
  isPreferred?: boolean;
  lastOrderDate?: string;
}

export function Step1Customer() {
  const { formData, updateFormData } = useWizard();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showRushModal, setShowRushModal] = useState(false);
  const [rushJustification, setRushJustification] = useState('');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    isPreferred: false
  });

  const [newCustomerErrors, setNewCustomerErrors] = useState<{ name?: string; email?: string }>({});
  const debouncedEmail = useDebouncedValue(newCustomer.email, 500);

  useEffect(() => {
    if (!debouncedEmail) {
      setNewCustomerErrors((e) => ({ ...e, email: undefined }));
      return;
    }

    if (!isValidEmail(debouncedEmail)) {
      setNewCustomerErrors((e) => ({ ...e, email: 'Not a valid email' }));
    } else {
      setNewCustomerErrors((e) => ({ ...e, email: undefined }));
    }
  }, [debouncedEmail]);

  // Load recent customers on mount
  useEffect(() => {
    loadRecentCustomers();
  }, []);

  const loadRecentCustomers = async () => {
    try {
      const response = await fetch('/api/customers/recent?limit=10');
      if (!response.ok) throw new Error('Failed to load recent customers');
      const data = await response.json();
      setRecentCustomers(data);
    } catch (error) {
      console.error('Error loading recent customers:', error);
    }
  };

  // Debounced search - 300ms
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        if (!query.trim()) {
          setShowResults(false);
          setCustomers([]);
          return;
        }

        setIsSearching(true);
        timeoutId = setTimeout(async () => {
          try {
            const response = await fetch(`/api/customers/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search customers');
            const data = await response.json();
            setCustomers(data);
            setShowResults(true);
          } catch (error) {
            console.error('Error searching customers:', error);
            showToast('error', 'Failed to search customers');
          } finally {
            setIsSearching(false);
          }
        }, 300);
      };
    })(),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSelectCustomer = (customer: Customer) => {
    updateFormData({ customer });
    setShowResults(false);
    setSearchQuery('');
    showToast('success', `Selected ${customer.name}`);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      showToast('error', 'Name and email are required');
      return;
    }

    // Email validation
      if (!isValidEmail(newCustomer.email)) {
        showToast('error', 'Please enter a valid email address');
        setNewCustomerErrors((e) => ({ ...e, email: 'Not a valid email' }));
        return;
      }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create customer');
      }

      const customer = await response.json();
      updateFormData({ customer });
      setShowNewCustomerForm(false);
      setNewCustomer({ name: '', email: '', phone: '', isPreferred: false });
      showToast('success', 'Customer created successfully!');
      loadRecentCustomers(); // Refresh recent list
    } catch (error: any) {
      console.error('Error creating customer:', error);
      showToast('error', error.message || 'Failed to create customer');
    }
  };

  const handleRushOrderChange = (checked: boolean) => {
    if (checked) {
      setShowRushModal(true);
    } else {
      updateFormData({ isRushOrder: false, rushJustification: '' });
      setRushJustification('');
    }
  };

  const handleRushConfirm = () => {
    if (!rushJustification.trim()) {
      showToast('error', 'Rush order justification is required');
      return;
    }
    updateFormData({
      isRushOrder: true,
      rushJustification: rushJustification
    });
    setShowRushModal(false);
    showToast('success', 'Rush order enabled - Manager approval required');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No previous orders';
    const date = new Date(dateString);
    return `Last order: ${date.toLocaleDateString()}`;
  };

  const CustomerCard = ({ customer, onClick }: { customer: Customer; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border-2 hover:border-raspberry-pink hover:bg-raspberry-pink/5 transition-all"
      style={{ borderColor: '#E0E0E0' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p style={{ fontWeight: 600, color: '#2B2B2B', fontSize: '15px' }}>
              {customer.name}
            </p>
            {customer.totalOrders > 10 && (
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: '#FFD700', color: '#000', fontWeight: 700 }}
              >
                VIP
              </span>
            )}
            {customer.isPreferred && (
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: '#C44569', color: '#FFFFFF', fontWeight: 600 }}
              >
                Preferred
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: '#666' }}>{customer.email}</p>
          {customer.phone && (
            <p style={{ fontSize: '13px', color: '#666' }}>{customer.phone}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span style={{ fontSize: '12px', color: '#999' }}>
              {customer.totalOrders} orders
            </span>
            <span style={{ fontSize: '12px', color: '#999' }} className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(customer.lastOrderDate)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '24px',
            fontWeight: 600,
            color: '#2B2B2B',
            marginBottom: '8px'
          }}
        >
          Select Customer
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Search for an existing customer or create a new one
        </p>
      </div>

      {formData.customer ? (
        /* Selected Customer Display */
        <>
          <Card
            className="p-6"
            style={{
              background: 'rgba(196, 69, 105, 0.05)',
              borderColor: '#C44569',
              border: '2px solid'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: '#C44569', color: '#FFFFFF' }}
                >
                  <User size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 600, fontSize: '18px', color: '#2B2B2B' }}>
                      {formData.customer.name}
                    </p>
                    {formData.customer.totalOrders > 10 && (
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: '#FFD700', color: '#000', fontWeight: 700 }}
                      >
                        VIP
                      </span>
                    )}
                    {(formData.customer as any)?.isPreferred && (
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: '#C44569', color: '#FFFFFF', fontWeight: 600 }}
                      >
                        Preferred
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                    {formData.customer.email}
                  </p>
                  {formData.customer.phone && (
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {formData.customer.phone}
                    </p>
                  )}
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                    {formData.customer.totalOrders} previous orders
                  </p>
                </div>
              </div>
              <Button
                onClick={() => updateFormData({ customer: null })}
                variant="outline"
                size="sm"
                style={{ borderColor: '#C44569', color: '#C44569' }}
              >
                Change
              </Button>
            </div>
          </Card>

          {/* Rush Order Section */}
          <Card className="p-6" style={{ border: '2px dashed #E0E0E0' }}>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={formData.isRushOrder || false}
                onCheckedChange={handleRushOrderChange}
                style={{ marginTop: '2px' }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#2B2B2B' }}>
                    🔥 Rush Order (Less than 2 day turnaround)
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#666' }}>
                  Requires manager approval for orders needed in less than 2 days
                </p>
                {formData.isRushOrder && (
                  <div
                    className="mt-3 p-3 rounded-lg"
                    style={{ background: 'rgba(220, 38, 38, 0.1)' }}
                  >
                    <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500 }}>
                      ⚠️ Rush order active - Manager approval required
                    </p>
                  </div>
                )}
              </div>
            </label>
          </Card>
        </>
      ) : (
        <>
          {/* Search Existing Customer */}
          <Card className="p-6">
            <h3
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '16px'
              }}
            >
              Search Existing Customer
            </h3>
            <div className="relative">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '14px', paddingLeft: '40px' }}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: '#999' }}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-raspberry-pink border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Search Results */}
            {showResults && (
              <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <CustomerCard
                      key={customer.id}
                      customer={customer}
                      onClick={() => handleSelectCustomer(customer)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>
                      No customers found matching "{searchQuery}"
                    </p>
                    <Button
                      onClick={() => {
                        setShowNewCustomerForm(true);
                        setShowResults(false);
                      }}
                      style={{ background: '#C44569', color: '#FFFFFF' }}
                    >
                      <Plus size={18} className="mr-2" />
                      Create New Customer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Recent Customers */}
          {!showResults && !showNewCustomerForm && recentCustomers.length > 0 && (
            <Card className="p-6">
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '16px'
                }}
              >
                Recent Customers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onClick={() => handleSelectCustomer(customer)}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Divider */}
          {!showNewCustomerForm && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#E0E0E0' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-4"
                  style={{ background: '#F8EBD7', color: '#999' }}
                >
                  or
                </span>
              </div>
            </div>
          )}

          {/* Create New Customer */}
          {!showNewCustomerForm ? (
            <Button
              onClick={() => setShowNewCustomerForm(true)}
              variant="outline"
              className="w-full"
              style={{ borderColor: '#5A3825', color: '#5A3825' }}
            >
              <Plus size={18} className="mr-2" />
              Create New Customer
            </Button>
          ) : (
            <Card className="p-6" style={{ background: '#F9F9F9' }}>
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#2B2B2B'
                  }}
                >
                  New Customer Details
                </h3>
                <Button
                  onClick={() => setShowNewCustomerForm(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X size={18} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Name <span style={{ color: '#C44569' }}>*</span>
                  </label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    placeholder="Full name"
                    style={{
                      borderColor: !newCustomer.name ? '#C44569' : '#E0E0E0',
                      borderWidth: !newCustomer.name ? '2px' : '1px'
                    }}
                  />
                  {!newCustomer.name && (
                    <p style={{ fontSize: '12px', color: '#C44569', marginTop: '4px' }}>
                      Name is required
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Email <span style={{ color: '#C44569' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => {
                        setNewCustomer({ ...newCustomer, email: e.target.value });
                        // clear immediate errors while typing
                        setNewCustomerErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="email@example.com"
                      aria-invalid={!!newCustomerErrors.email}
                      aria-describedby={newCustomerErrors.email ? 'new-customer-email-error' : undefined}
                      style={{
                        borderColor: !newCustomer.email ? '#C44569' : newCustomerErrors.email ? '#DC2626' : isValidEmail(newCustomer.email) ? '#10B981' : '#E0E0E0',
                        borderWidth: !newCustomer.email ? '2px' : '1px',
                        paddingRight: '36px'
                      }}
                      className={newCustomerErrors.email ? 'validation-error' : undefined}
                    />

                    {/* validation icon */}
                    <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                      {newCustomer.email ? (
                        isValidEmail(debouncedEmail) ? (
                          <span style={{ color: '#10B981', fontWeight: 700 }} aria-hidden>✓</span>
                        ) : (
                          <span style={{ color: '#DC2626', fontWeight: 700 }} aria-hidden>✕</span>
                        )
                      ) : (
                        <span style={{ color: '#999' }} aria-hidden>*</span>
                      )}
                    </div>

                  </div>
                  {newCustomerErrors.email ? (
                    <p id="new-customer-email-error" role="alert" style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>
                      Not a valid email
                    </p>
                  ) : !newCustomer.email ? (
                    <p style={{ fontSize: '12px', color: '#C44569', marginTop: '4px' }}>
                      Email is required
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Phone (optional)
                  </label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={newCustomer.isPreferred}
                    onCheckedChange={(checked) =>
                      setNewCustomer({ ...newCustomer, isPreferred: checked as boolean })
                    }
                  />
                  <span style={{ fontSize: '14px', color: '#2B2B2B' }}>
                    Mark as Preferred Customer (10% discount)
                  </span>
                </label>

                <Button
                  onClick={handleCreateCustomer}
                  className="w-full"
                  disabled={!newCustomer.name || !newCustomer.email}
                  style={{
                    background: (!newCustomer.name || !newCustomer.email) ? '#CCC' : '#C44569',
                    color: '#FFFFFF',
                    cursor: (!newCustomer.name || !newCustomer.email) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Plus size={18} className="mr-2" />
                  Create Customer
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Rush Order Modal */}
      {showRushModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => {
            setShowRushModal(false);
            updateFormData({ isRushOrder: false });
          }}
        >
          <Card
            className="p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FFFFFF' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(220, 38, 38, 0.1)' }}
              >
                <AlertCircle size={20} style={{ color: '#DC2626' }} />
              </div>
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#2B2B2B',
                    marginBottom: '4px'
                  }}
                >
                  Rush Order Justification Required
                </h3>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Please provide a reason for this rush order (less than 2 day turnaround)
                </p>
              </div>
            </div>

            <Textarea
              value={rushJustification}
              onChange={(e) => setRushJustification(e.target.value)}
              placeholder="e.g., Customer needs cake for emergency event, late customer request, etc."
              rows={4}
              style={{
                marginBottom: '16px',
                borderColor: !rushJustification.trim() ? '#C44569' : '#E0E0E0',
                borderWidth: !rushJustification.trim() ? '2px' : '1px'
              }}
            />

            <div
              className="mb-4 p-3 rounded-lg"
              style={{ background: 'rgba(196, 69, 105, 0.1)' }}
            >
              <p style={{ fontSize: '13px', color: '#C44569', fontWeight: 500 }}>
                ⚠️ Manager approval will be required before proceeding with this order
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowRushModal(false);
                  setRushJustification('');
                  updateFormData({ isRushOrder: false });
                }}
                variant="outline"
                className="flex-1"
                style={{ borderColor: '#E0E0E0', color: '#666' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRushConfirm}
                disabled={!rushJustification.trim()}
                className="flex-1"
                style={{
                  background: !rushJustification.trim() ? '#CCC' : '#C44569',
                  color: '#FFFFFF',
                  cursor: !rushJustification.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Confirm Rush Order
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Validation function
export function validateStep1(formData: any): boolean {
  return formData.customer !== null;
}
