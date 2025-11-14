import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  X, 
  Calendar, 
  DollarSign, 
  Save,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Palette,
  Sparkles,
  Cake
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { useToast } from '../../components/ToastContext';
import { LayerBuilder } from '../../components/LayerBuilder';
import { AdminBreadcrumbs } from '../../components/AdminBreadcrumbs';
import { 
  standardCakes,
  cakeSizes,
  icingColors,
  decorations,
  isRushOrder,
  calculateSizeBasedPrice,
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
  onNavigate?: (page: string) => void;
}

export function OrderCreate({ onBack, onNavigate }: OrderCreateProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Cake type selection
  const [cakeType, setCakeType] = useState<'standard' | 'custom'>('custom');
  const [selectedStandardCake, setSelectedStandardCake] = useState('');
  const [selectedCakeSize, setSelectedCakeSize] = useState('');
  const [selectedIcingColors, setSelectedIcingColors] = useState<string[]>([]);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  
  // Rush order detection
  const [isRush, setIsRush] = useState(false);
  const [managerApproval, setManagerApproval] = useState(false);
  
  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    customer: true,
    cakeType: true,
    size: true,
    layers: true,
    icingColors: false,
    decorations: false,
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

  // Layers for custom cake - MINIMUM 2 LAYERS per case study
  const [layers, setLayers] = useState<LayerData[]>([
    { id: 'layer-1', flavor: '', fillings: [], icing: '', notes: '' },
    { id: 'layer-2', flavor: '', fillings: [], icing: '', notes: '' }
  ]);
  
  // Rush order detection effect - recomputes on EVERY eventDate change
  useEffect(() => {
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const rushStatus = isRushOrder(eventDate);
      setIsRush(rushStatus);
      // Always reset manager approval when date changes to require re-approval
      setManagerApproval(false);
    } else {
      // Reset rush flags when eventDate is cleared
      setIsRush(false);
      setManagerApproval(false);
    }
  }, [formData.eventDate]);

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

  // Calculate totals based on cake size (returns cents)
  const calculateTotal = () => {
    if (cakeType === 'standard') {
      // For standard cakes, ADD base cake price + size price
      const standardCake = standardCakes.find(c => c.id === selectedStandardCake);
      const standardCakeBasePrice = standardCake?.basePrice ? standardCake.basePrice * 100 : 0;
      const sizePrice = calculateSizeBasedPrice(selectedCakeSize);
      return standardCakeBasePrice + sizePrice;
    } else {
      // For custom cakes, use size as base price
      const sizePrice = calculateSizeBasedPrice(selectedCakeSize);
      return sizePrice || 0;
    }
  };
  
  const totalAmount = calculateTotal(); // In cents
  const depositRequired = Math.ceil(totalAmount * 0.5); // 50% deposit in cents

  // Toggle icing color selection
  const toggleIcingColor = (colorId: string) => {
    if (selectedIcingColors.includes(colorId)) {
      setSelectedIcingColors(selectedIcingColors.filter(c => c !== colorId));
    } else {
      setSelectedIcingColors([...selectedIcingColors, colorId]);
    }
  };
  
  // Toggle decoration selection
  const toggleDecoration = (decorationId: string) => {
    if (selectedDecorations.includes(decorationId)) {
      setSelectedDecorations(selectedDecorations.filter(d => d !== decorationId));
    } else {
      setSelectedDecorations([...selectedDecorations, decorationId]);
    }
  };

  // Submit order
  const handleSubmit = async () => {
    // Validation
    if (!selectedCustomer) {
      showToast('error', 'Please select or create a customer');
      return;
    }
    
    if (!selectedCakeSize) {
      showToast('error', 'Please select a cake size');
      return;
    }

    if (cakeType === 'custom') {
      // Ensure at least 2 layers
      if (layers.length < 2) {
        showToast('error', 'Custom cakes must have at least 2 layers');
        return;
      }
      
      // Validate ALL layers have flavor (not just first 2)
      const missingFlavor = layers.some(layer => !layer.flavor);
      if (missingFlavor) {
        showToast('error', 'Please select a flavor for all layers');
        return;
      }
      
      // Validate ALL layers have icing (not just first 2)
      const missingIcing = layers.some(layer => !layer.icing);
      if (missingIcing) {
        showToast('error', 'Please select icing flavor for all layers');
        return;
      }
      
      // Check maximum 2 fillings per layer (per case study)
      const tooManyFillings = layers.some(layer => layer.fillings.length > 2);
      if (tooManyFillings) {
        showToast('error', 'Each layer can have a maximum of 2 fillings (per case study)');
        return;
      }
    } else {
      if (!selectedStandardCake) {
        showToast('error', 'Please select a standard cake');
        return;
      }
    }

    if (!formData.eventDate) {
      showToast('error', 'Please provide event date');
      return;
    }
    
    // Check rush order manager approval
    if (isRush && !managerApproval) {
      showToast('error', 'Rush orders require manager approval');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get cake size details for servings
      const cakeSizeData = cakeSizes.find(s => s.id === selectedCakeSize);
      
      const orderPayload = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone || '',
        servings: formData.servings ? parseInt(formData.servings) : (cakeSizeData ? parseInt(cakeSizeData.servings.split('-')[0]) : 0),
        date: formData.eventDate,
        message: formData.message,
        notes: formData.customerNotes,
        layers: cakeType === 'custom' ? layers : [],
        cakeType,
        standardCakeId: cakeType === 'standard' ? selectedStandardCake : null,
        cakeSize: selectedCakeSize,
        icingColors: selectedIcingColors,
        decorations: selectedDecorations,
        isRushOrder: isRush,
        managerApproval: isRush ? managerApproval : null,
        adminNotes: formData.adminNotes,
        status: formData.status,
        priority: formData.priority,
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) * 100 : depositRequired,
        paymentStatus: formData.paymentStatus,
        totalAmount: totalAmount,
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
      const order = result.order || result;
      showToast('success', `Order #${order.id} created successfully!`);
      
      // Reset form
      setSelectedCustomer(null);
      setCakeType('custom');
      setSelectedStandardCake('');
      setSelectedCakeSize('');
      setSelectedIcingColors([]);
      setSelectedDecorations([]);
      setIsRush(false);
      setManagerApproval(false);
      setLayers([
        { id: 'layer-1', flavor: '', fillings: [], icing: '', notes: '' },
        { id: 'layer-2', flavor: '', fillings: [], icing: '', notes: '' }
      ]);
      setFormData({
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

  // Handle cake type change with state reset to prevent pollution
  const handleCakeTypeChange = (type: 'standard' | 'custom') => {
    setCakeType(type);
    
    if (type === 'standard') {
      // Clear custom cake data
      setSelectedStandardCake('');
      // Reset to 2 blank layers with fresh IDs
      setLayers([
        { id: `layer-${Date.now()}-1`, flavor: '', fillings: [], icing: '', notes: '' },
        { id: `layer-${Date.now()}-2`, flavor: '', fillings: [], icing: '', notes: '' }
      ]);
    } else {
      // Switching TO custom - also reset with FRESH IDs
      setSelectedStandardCake('');
      setLayers([
        { id: `layer-${Date.now()}-1`, flavor: '', fillings: [], icing: '', notes: '' },
        { id: `layer-${Date.now()}-2`, flavor: '', fillings: [], icing: '', notes: '' }
      ]);
    }
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <AdminBreadcrumbs 
          items={[
            { label: 'Orders', page: 'order-management' },
            { label: 'Create New Order' }
          ]} 
          onNavigate={onNavigate}
        />
        
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

        {/* Cake Type Selection */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('cakeType')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Cake size={20} color="#C44569" />
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px', fontWeight: 600, color: '#2B2B2B' }}>
                2. Cake Type
              </h2>
            </div>
            {openSections.cakeType ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.cakeType && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => handleCakeTypeChange('standard')}
                  className="flex-1 p-4 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: cakeType === 'standard' ? '#C44569' : '#E0E0E0',
                    background: cakeType === 'standard' ? 'rgba(196, 69, 105, 0.1)' : 'white'
                  }}
                >
                  <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Standard Cake</h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>Choose from our pre-designed cakes</p>
                </button>
                <button
                  onClick={() => handleCakeTypeChange('custom')}
                  className="flex-1 p-4 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: cakeType === 'custom' ? '#C44569' : '#E0E0E0',
                    background: cakeType === 'custom' ? 'rgba(196, 69, 105, 0.1)' : 'white'
                  }}
                >
                  <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Custom Build</h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>Design your own layer by layer</p>
                </button>
              </div>

              {cakeType === 'standard' && (
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '8px' }}>
                    Select Standard Cake <span style={{ color: '#C44569' }}>*</span>
                  </label>
                  <select
                    value={selectedStandardCake}
                    onChange={(e) => setSelectedStandardCake(e.target.value)}
                    className="w-full p-3 border-2 rounded-lg"
                    style={{ borderColor: '#E0E0E0', fontSize: '14px' }}
                  >
                    <option value="">Choose a cake...</option>
                    {standardCakes.map(cake => (
                      <option key={cake.id} value={cake.id}>
                        {cake.name} (Base: ${cake.basePrice})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Cake Size Selection */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <DollarSign size={20} color="#C44569" />
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px', fontWeight: 600, color: '#2B2B2B' }}>
                3. Cake Size <span style={{ color: '#C44569' }}>*</span>
              </h2>
              {selectedCakeSize && (
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(196, 69, 105, 0.1)', color: '#C44569', fontWeight: 600 }}>
                  {cakeSizes.find(s => s.id === selectedCakeSize)?.name}
                </span>
              )}
            </div>
            {openSections.size ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.size && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cakeSizes.map(size => {
                const isSelected = selectedCakeSize === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedCakeSize(size.id)}
                    className="p-4 rounded-lg border-2 transition-all text-left"
                    style={{
                      borderColor: isSelected ? '#C44569' : '#E0E0E0',
                      background: isSelected ? 'rgba(196, 69, 105, 0.1)' : 'white'
                    }}
                  >
                    <h4 style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{size.name}</h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>Serves {size.servings}</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#C44569', marginTop: '4px' }}>
                      ${(size.price / 100).toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Layers Section (Custom Only) */}
        {cakeType === 'custom' && (
          <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
            <button
              onClick={() => toggleSection('layers')}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-2">
                <div style={{ width: '20px', height: '20px', background: '#C44569', borderRadius: '4px' }} />
                <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px', fontWeight: 600, color: '#2B2B2B' }}>
                  4. Build Cake Layers
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
                <LayerBuilder key={cakeType} layers={layers} onLayersChange={setLayers} />
              )}
            </Card>
          )}

        {/* Icing Colors Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('icingColors')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Palette size={20} color="#C44569" />
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px', fontWeight: 600, color: '#2B2B2B' }}>
                5. Icing & Writing Colors (Optional)
              </h2>
              {selectedIcingColors.length > 0 && (
                <span className="px-2 py-1 rounded text-xs" style={{ background: '#F0F0F0', color: '#666' }}>
                  {selectedIcingColors.length} selected
                </span>
              )}
            </div>
            {openSections.icingColors ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.icingColors && (
            <div className="space-y-4">
              {['primary', 'pastel', 'neon', 'fall', 'extra'].map(category => {
                const categoryColors = icingColors.filter(c => c.category === category);
                return (
                  <div key={category}>
                    <h4 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', textTransform: 'capitalize' }}>
                      {category} Colors
                    </h4>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {categoryColors.map(color => {
                        const isSelected = selectedIcingColors.includes(color.id);
                        return (
                          <button
                            key={color.id}
                            onClick={() => toggleIcingColor(color.id)}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg border transition-all"
                            style={{
                              borderColor: isSelected ? '#C44569' : '#E0E0E0',
                              borderWidth: isSelected ? '2px' : '1px'
                            }}
                            title={color.name}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                background: color.hex,
                                borderRadius: '6px',
                                border: '1px solid rgba(0,0,0,0.1)'
                              }}
                            />
                            <span style={{ fontSize: '10px', textAlign: 'center', lineHeight: '1.2' }}>
                              {color.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Decorations Section */}
        <Card className="mb-6 p-6" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0' }}>
          <button
            onClick={() => toggleSection('decorations')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={20} color="#C44569" />
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px', fontWeight: 600, color: '#2B2B2B' }}>
                6. Decorations (Optional)
              </h2>
              {selectedDecorations.length > 0 && (
                <span className="px-2 py-1 rounded text-xs" style={{ background: '#F0F0F0', color: '#666' }}>
                  {selectedDecorations.length} selected
                </span>
              )}
            </div>
            {openSections.decorations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {openSections.decorations && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {decorations.map(decoration => {
                const isSelected = selectedDecorations.includes(decoration.id);
                return (
                  <label
                    key={decoration.id}
                    className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all"
                    style={{
                      borderColor: isSelected ? '#C44569' : '#E0E0E0',
                      background: isSelected ? 'rgba(196, 69, 105, 0.05)' : 'white'
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleDecoration(decoration.id)}
                    />
                    <span style={{ fontSize: '13px' }}>{decoration.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </Card>

        {/* Rush Order Warning Banner */}
        {isRush && (
          <Card className="mb-6 p-4" style={{ background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', border: 'none' }}>
            <div className="flex items-start gap-3">
              <AlertCircle size={24} color="white" />
              <div className="flex-1">
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                  ⚠️ Rush Order Detected
                </h3>
                <p style={{ color: 'white', fontSize: '14px', marginBottom: '12px' }}>
                  This order is due in less than 2 days. Manager approval is required to proceed.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={managerApproval}
                    onCheckedChange={(checked) => setManagerApproval(checked as boolean)}
                    style={{ borderColor: 'white' }}
                  />
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                    Manager Approval Granted
                  </span>
                </label>
              </div>
            </div>
          </Card>
        )}

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
                7. Event Information
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
                8. Admin Management Settings
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
                5. Payment Information
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
                    ${(totalAmount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Deposit Required (50%)</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#C44569' }}>
                    ${(depositRequired / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Balance Due</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#666' }}>
                    ${((totalAmount - depositRequired) / 100).toFixed(2)}
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
                    placeholder={(depositRequired / 100).toFixed(2)}
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
