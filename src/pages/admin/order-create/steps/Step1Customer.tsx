import { useState } from 'react';
import { Search, Plus, User, X } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { useWizard } from '../WizardContext';
import { useToast } from '../../../../components/ToastContext';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  isVip: boolean;
}

export function Step1Customer() {
  const { formData, updateFormData } = useWizard();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast('error', 'Please enter a search term');
      return;
    }

    try {
      const response = await fetch(`/api/customers/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search customers');
      const data = await response.json();
      setCustomers(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching customers:', error);
      showToast('error', 'Failed to search customers');
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    updateFormData({ customer });
    setShowResults(false);
    showToast('success', `Selected ${customer.name}`);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      showToast('error', 'Name and email are required');
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
      setNewCustomer({ name: '', email: '', phone: '' });
      showToast('success', 'Customer created successfully!');
    } catch (error: any) {
      console.error('Error creating customer:', error);
      showToast('error', error.message || 'Failed to create customer');
    }
  };

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
                <p style={{ fontWeight: 600, fontSize: '18px', color: '#2B2B2B' }}>
                  {formData.customer.name}
                  {formData.customer.isVip && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded text-xs"
                      style={{ background: '#FFD700', color: '#000', fontWeight: 700 }}
                    >
                      VIP
                    </span>
                  )}
                </p>
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
            <div className="flex gap-2">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{ fontSize: '14px' }}
              />
              <Button
                onClick={handleSearch}
                style={{ background: '#C44569', color: '#FFFFFF' }}
              >
                <Search size={18} />
              </Button>
            </div>

            {/* Search Results */}
            {showResults && customers.length > 0 && (
              <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="w-full text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E0E0E0' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ fontWeight: 600, color: '#2B2B2B', fontSize: '15px' }}>
                          {customer.name}
                          {customer.isVip && (
                            <span
                              className="ml-2 px-2 py-0.5 rounded text-xs"
                              style={{ background: '#FFD700', color: '#000' }}
                            >
                              VIP
                            </span>
                          )}
                        </p>
                        <p style={{ fontSize: '13px', color: '#666' }}>{customer.email}</p>
                        {customer.phone && (
                          <p style={{ fontSize: '13px', color: '#666' }}>{customer.phone}</p>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        {customer.totalOrders} orders
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showResults && customers.length === 0 && (
              <p
                className="text-center py-4"
                style={{ fontSize: '14px', color: '#999' }}
              >
                No customers found
              </p>
            )}
          </Card>

          {/* Divider */}
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
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    style={{
                      borderColor: !newCustomer.email ? '#C44569' : '#E0E0E0',
                      borderWidth: !newCustomer.email ? '2px' : '1px'
                    }}
                  />
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

                <Button
                  onClick={handleCreateCustomer}
                  className="w-full"
                  style={{ background: '#C44569', color: '#FFFFFF' }}
                >
                  <Plus size={18} className="mr-2" />
                  Create Customer
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// Validation function
export function validateStep1(formData: any): boolean {
  return formData.customer !== null;
}
