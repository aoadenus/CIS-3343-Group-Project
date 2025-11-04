import { useState } from 'react';
import { 
  Users, 
  Plus, 
  X, 
  Calendar, 
  DollarSign, 
  FileText,
  Save,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ToastContext';
import { LayerBuilder } from '../../components/LayerBuilder';
import { 
  occasions, 
  designs, 
  calculateTotalPrice, 
  type LayerData 
} from '../../data/cakeOptions';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  isVip: boolean;
}

interface OrderCreateProps {
  onBack?: () => void;
}

export function OrderCreate({ onBack }: OrderCreateProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    customer: true,
    orderDetails: true,
    layers: true,
    design: true,
    eventInfo: true,
    adminSettings: true,
    payment: false
  });

  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Order form data
  const [formData, setFormData] = useState({
    occasion: '',
    design: '',
    servings: '',
    eventDate: '',
    message: '',
    customerNotes: '',
    adminNotes: '',
    status: 'pending',
    priority: 'medium',
    depositAmount: '',
    paymentStatus: 'pending'
  });

  // Layers for custom cake
  const [layers, setLayers] = useState<LayerData[]>([
    { id: 'layer-1', flavor: '', fillings: [], notes: '' }
  ]);

  // Search customers
  const handleSearchCustomers = async () => {
    if (!searchQuery.trim()) {
      showToast('error', 'Please enter a search term');
      return;
    }

    try {
      const response = await fetch(`/api/customers/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search customers');
      const data = await response.json();
      setCustomers(data);
      setShowCustomerSearch(true);
    } catch (error) {
      console.error('Error searching customers:', error);
      showToast('error', 'Failed to search customers');
    }
  };

  // Create new customer
  const handleCreateNewCustomer = async () => {
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
      setSelectedCustomer(customer);
      setShowNewCustomerForm(false);
      setNewCustomer({ name: '', email: '', phone: '' });
      showToast('success', 'Customer created successfully!');
    } catch (error: any) {
      console.error('Error creating customer:', error);
      showToast('error', error.message || 'Failed to create customer');
    }
  };

  // Calculate totals
  const totalAmount = calculateTotalPrice(layers);
  const depositRequired = Math.ceil(totalAmount * 0.5); // 50% deposit

  // Submit order
  const handleSubmit = async () => {
    // Validation
    if (!selectedCustomer) {
      showToast('error', 'Please select or create a customer');
      return;
    }

    if (!formData.occasion) {
      showToast('error', 'Please select an occasion');
      return;
    }

    if (layers.length === 0 || !layers[0].flavor) {
      showToast('error', 'Please add at least one cake layer');
      return;
    }

    if (!formData.design) {
      showToast('error', 'Please select a design style');
      return;
    }

    if (!formData.servings || !formData.eventDate) {
      showToast('error', 'Please provide servings and event date');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone || '',
        occasion: formData.occasion,
        design: formData.design,
        servings: parseInt(formData.servings),
        date: formData.eventDate,
        message: formData.message,
        notes: formData.customerNotes, // Customer notes
        layers: layers,
        adminNotes: formData.adminNotes, // Admin notes (separate)
        status: formData.status,
        priority: formData.priority,
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) * 100 : depositRequired * 100,
        paymentStatus: formData.paymentStatus,
        totalAmount: totalAmount * 100,
        createdBy: 'admin',
        customerId: selectedCustomer.id
      };

      const response = await fetch('/api/orders/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const result = await response.json();
      const order = result.order || result; // Handle both response formats
      showToast('success', `Order #${order.id} created successfully!`);
      
      // Reset form
      setSelectedCustomer(null);
      setLayers([{ id: 'layer-1', flavor: '', fillings: [], notes: '' }]);
      setFormData({
        occasion: '',
        design: '',
        servings: '',
        eventDate: '',
        message: '',
        customerNotes: '',
        adminNotes: '',
        status: 'pending',
        priority: 'medium',
        depositAmount: '',
        paymentStatus: 'pending'
      });

      if (onBack) {
        setTimeout(() => onBack(), 1500);
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      showToast('error', error.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#2B2B2B'
              }}
            >
              Create New Order
            </h1>
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                style={{ 
                  borderColor: '#C44569',
                  color: '#C44569'
                }}
              >
                <X size={18} className="mr-2" />
                Cancel
              </Button>
            )}
          </div>
          <p 
            style={{ 
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '15px',
              color: '#666'
            }}
          >
            Manually create a custom cake order for a customer
          </p>
        </div>

        {/* Customer Selection Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('customer')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Users size={20} color="#C44569" />
              <h2 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2B2B2B'
                }}
              >
                1. Customer Selection
              </h2>
              {selectedCustomer && (
                <span 
                  className="px-3 py-1 rounded-full text-xs"
                  style={{ 
                    background: 'rgba(196, 69, 105, 0.1)',
                    color: '#C44569',
                    fontWeight: 600
                  }}
                >
                  {selectedCustomer.name}
                </span>
              )}
            </div>
            {openSections.customer ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.customer && (
            <div className="space-y-4">
              {!selectedCustomer ? (
                <>
                  {/* Search Existing */}
                  <div>
                    <label 
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#2B2B2B',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Search Existing Customer
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by name, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchCustomers()}
                      />
                      <Button onClick={handleSearchCustomers}>
                        <Search size={18} />
                      </Button>
                    </div>
                  </div>

                  {/* Search Results */}
                  {showCustomerSearch && customers.length > 0 && (
                    <div 
                      className="border rounded-lg p-3 space-y-2"
                      style={{ maxHeight: '300px', overflowY: 'auto' }}
                    >
                      {customers.map(customer => (
                        <button
                          key={customer.id}
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerSearch(false);
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ border: '1px solid #E0E0E0' }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p style={{ fontWeight: 600, color: '#2B2B2B' }}>
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
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              {customer.totalOrders} orders
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Or Create New */}
                  <div className="text-center py-2">
                    <span style={{ color: '#999', fontSize: '14px' }}>or</span>
                  </div>

                  {!showNewCustomerForm ? (
                    <Button
                      onClick={() => setShowNewCustomerForm(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus size={18} className="mr-2" />
                      Create New Customer
                    </Button>
                  ) : (
                    <div 
                      className="border rounded-lg p-4 space-y-3"
                      style={{ background: '#F9F9F9' }}
                    >
                      <h3 
                        style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#2B2B2B'
                        }}
                      >
                        New Customer Details
                      </h3>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 500 }}>
                          Name <span style={{ color: '#C44569' }}>*</span>
                        </label>
                        <Input
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 500 }}>
                          Email <span style={{ color: '#C44569' }}>*</span>
                        </label>
                        <Input
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 500 }}>Phone</label>
                        <Input
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateNewCustomer} className="flex-1">
                          <Plus size={18} className="mr-2" />
                          Create Customer
                        </Button>
                        <Button
                          onClick={() => setShowNewCustomerForm(false)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div 
                  className="border rounded-lg p-4"
                  style={{ background: 'rgba(196, 69, 105, 0.05)', borderColor: '#C44569' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                        {selectedCustomer.name}
                        {selectedCustomer.isVip && (
                          <span 
                            className="ml-2 px-2 py-0.5 rounded text-xs"
                            style={{ background: '#FFD700', color: '#000' }}
                          >
                            VIP
                          </span>
                        )}
                      </p>
                      <p style={{ fontSize: '14px', color: '#666' }}>{selectedCustomer.email}</p>
                      {selectedCustomer.phone && (
                        <p style={{ fontSize: '14px', color: '#666' }}>{selectedCustomer.phone}</p>
                      )}
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        {selectedCustomer.totalOrders} previous orders
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedCustomer(null)}
                      variant="outline"
                      size="sm"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Order Details Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('orderDetails')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <FileText size={20} color="#C44569" />
              <h2 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2B2B2B'
                }}
              >
                2. Order Details
              </h2>
            </div>
            {openSections.orderDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.orderDetails && (
            <div className="space-y-4">
              {/* Occasion Selection */}
              <div>
                <label 
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2B2B2B',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Occasion <span style={{ color: '#C44569' }}>*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {occasions.map(occasion => (
                    <button
                      key={occasion.id}
                      onClick={() => setFormData({ ...formData, occasion: occasion.id })}
                      className="p-3 rounded-lg border-2 transition-all"
                      style={{
                        borderColor: formData.occasion === occasion.id ? '#C44569' : '#E0E0E0',
                        background: formData.occasion === occasion.id 
                          ? 'rgba(196, 69, 105, 0.05)' 
                          : '#FFFFFF'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{occasion.icon}</div>
                      <div 
                        style={{ 
                          fontSize: '14px',
                          fontWeight: formData.occasion === occasion.id ? 600 : 500,
                          color: formData.occasion === occasion.id ? '#C44569' : '#2B2B2B'
                        }}
                      >
                        {occasion.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Layers Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('layers')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <div 
                style={{ 
                  width: '20px',
                  height: '20px',
                  background: '#C44569',
                  borderRadius: '4px'
                }}
              />
              <h2 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2B2B2B'
                }}
              >
                3. Build Cake Layers
              </h2>
              <span 
                className="px-2 py-1 rounded text-xs"
                style={{ background: '#F0F0F0', color: '#666' }}
              >
                {layers.length} {layers.length === 1 ? 'layer' : 'layers'}
              </span>
            </div>
            {openSections.layers ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.layers && (
            <LayerBuilder layers={layers} onLayersChange={setLayers} />
          )}
        </Card>

        {/* Design Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('design')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <div 
                style={{ 
                  width: '20px',
                  height: '20px',
                  background: '#C44569',
                  borderRadius: '50%'
                }}
              />
              <h2 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2B2B2B'
                }}
              >
                4. Design Style
              </h2>
            </div>
            {openSections.design ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.design && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {designs.map(design => (
                <button
                  key={design.id}
                  onClick={() => setFormData({ ...formData, design: design.id })}
                  className="p-4 rounded-lg border-2 text-left transition-all"
                  style={{
                    borderColor: formData.design === design.id ? '#C44569' : '#E0E0E0',
                    background: formData.design === design.id 
                      ? 'rgba(196, 69, 105, 0.05)' 
                      : '#FFFFFF'
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: '16px',
                      fontWeight: formData.design === design.id ? 600 : 500,
                      color: formData.design === design.id ? '#C44569' : '#2B2B2B',
                      marginBottom: '4px'
                    }}
                  >
                    {design.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {design.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Event Info Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('eventInfo')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Calendar size={20} color="#C44569" />
              <h2 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2B2B2B'
                }}
              >
                5. Event Information
              </h2>
            </div>
            {openSections.eventInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.eventInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Event Date <span style={{ color: '#C44569' }}>*</span>
                </label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Servings <span style={{ color: '#C44569' }}>*</span>
                </label>
                <Input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                  placeholder="e.g., 20"
                  min="1"
                />
              </div>
              <div className="md:col-span-2">
                <label 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Cake Message (optional)
                </label>
                <Input
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g., 'Happy Birthday Sarah!'"
                  maxLength={100}
                />
              </div>
              <div className="md:col-span-2">
                <label 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Customer Notes (optional)
                </label>
                <Textarea
                  value={formData.customerNotes}
                  onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                  placeholder="Any special requests or dietary restrictions..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Admin Settings Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFF9F5', border: '2px solid #C44569' }}>
          <button
            onClick={() => toggleSection('adminSettings')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={20} color="#C44569" />
              <h2 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#C44569'
                }}
              >
                6. Admin Management Settings
              </h2>
            </div>
            {openSections.adminSettings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.adminSettings && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    style={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Order Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#E0E0E0' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="baking">Baking</option>
                    <option value="decorating">Decorating</option>
                    <option value="ready">Ready for Pickup</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label 
                    style={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#E0E0E0' }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Internal Management Notes
                </label>
                <Textarea
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  placeholder="Internal notes (not visible to customer)..."
                  rows={3}
                  maxLength={500}
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  These notes are for internal use only and won't be shown to the customer
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Payment Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('payment')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <DollarSign size={20} color="#C44569" />
              <h2 
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2B2B2B'
                }}
              >
                7. Payment Information
              </h2>
            </div>
            {openSections.payment ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.payment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg" style={{ background: '#F9F9F9' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total Amount</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#2B2B2B' }}>
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Deposit Required (50%)</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#C44569' }}>
                    ${depositRequired.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Balance Due</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#666' }}>
                    ${(totalAmount - depositRequired).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    style={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Deposit Amount ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    placeholder={depositRequired.toFixed(2)}
                    min="0"
                    step="0.01"
                  />
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    Leave blank to use default 50% deposit
                  </p>
                </div>
                <div>
                  <label 
                    style={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#E0E0E0' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial (Deposit Paid)</option>
                    <option value="paid">Paid in Full</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedCustomer}
            className="flex-1"
            style={{
              background: isSubmitting || !selectedCustomer ? '#CCC' : '#C44569',
              color: '#FFFFFF',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            <Save size={20} className="mr-2" />
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </Button>
        </div>

        {!selectedCustomer && (
          <p 
            className="text-center mt-4"
            style={{ fontSize: '13px', color: '#C44569' }}
          >
            Please select or create a customer to continue
          </p>
        )}
      </div>
    </div>
  );
}
