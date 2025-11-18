# Emily Bakes Cakes: Frontend Implementation Playbook

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Stack:** React 18+ / TypeScript / Tailwind CSS  
**State Management:** Redux Toolkit or Zustand

---

## Project Structure

\`\`\`
src/
├── pages/
│   ├── Dashboard.tsx
│   ├── Orders/
│   │   ├── OrdersList.tsx
│   │   ├── OrderDetail.tsx
│   │   └── NewOrderWizard.tsx
│   ├── Customers/
│   │   ├── CustomersList.tsx
│   │   ├── CustomerDetail.tsx
│   │   └── NewCustomer.tsx
│   ├── Reports/
│   │   └── Dashboard.tsx
│   └── Login.tsx
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Toast.tsx
│   ├── forms/
│   │   ├── CustomerForm.tsx
│   │   ├── LayerRepeater.tsx
│   │   └── DateRangePicker.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── StatusBadge.tsx
│   │   └── StatCard.tsx
│   └── orders/
│       ├── OrderCard.tsx
│       ├── ProductionSheet.tsx
│       └── PricingBreakdown.tsx
├── hooks/
│   ├── useOrders.ts
│   ├── useCustomers.ts
│   ├── useAuth.ts
│   └── useFetch.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── validation.ts
├── store/
│   ├── store.ts
│   ├── slices/
│   │   ├── orderSlice.ts
│   │   ├── customerSlice.ts
│   │   ├── authSlice.ts
│   │   └── uiSlice.ts
├── types/
│   ├── index.ts
│   ├── orders.ts
│   ├── customers.ts
│   └── api.ts
├── styles/
│   ├── globals.css
│   ├── tailwind.config.js
│   └── design-tokens.css
└── App.tsx
\`\`\`

---

## Layer Repeater Component (Critical)

**Purpose:** Allow staff to add/remove layers with per-layer customization

\`\`\`typescript
// src/components/forms/LayerRepeater.tsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../ui/Button';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import FileUpload from '../ui/FileUpload';

interface Layer {
  layerNumber: number;
  flavorId: string;
  fillingId: string;
  icingId: string;
  writingColorId: string;
  specialNotes: string;
  imageUrl?: string;
}

interface LayerRepeaterProps {
  layers: Layer[];
  onChange: (layers: Layer[]) => void;
  onError: (errors: string[]) => void;
}

export const LayerRepeater: React.FC<LayerRepeaterProps> = ({
  layers,
  onChange,
  onError
}) => {
  // Fetch available options
  const { data: options } = useQuery('product-options', () =>
    fetch('/api/v1/products/1/options').then(r => r.json())
  );

  const addLayer = () => {
    if (layers.length >= 7) {
      onError(['Maximum 7 layers allowed']);
      return;
    }
    
    const newLayer: Layer = {
      layerNumber: layers.length + 1,
      flavorId: '',
      fillingId: '',
      icingId: '',
      writingColorId: '',
      specialNotes: ''
    };
    
    onChange([...layers, newLayer]);
  };

  const deleteLayer = (index: number) => {
    if (layers.length === 1) {
      onError(['At least one layer is required']);
      return;
    }
    
    const updated = layers.filter((_, i) => i !== index);
    // Renumber layers
    updated.forEach((layer, i) => {
      layer.layerNumber = i + 1;
    });
    
    onChange(updated);
  };

  const updateLayer = (index: number, field: keyof Layer, value: any) => {
    const updated = [...layers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {layers.map((layer, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-cream">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">
              Layer {layer.layerNumber} {index === 0 && '(Bottom)'} {index === layers.length - 1 && layers.length > 1 && '(Top)'}
            </h3>
            <Button
              variant="secondary"
              onClick={() => deleteLayer(index)}
              disabled={layers.length === 1}
              aria-label={`Delete layer ${layer.layerNumber}`}
            >
              ×
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Flavor"
              value={layer.flavorId}
              onChange={(e) => updateLayer(index, 'flavorId', e.target.value)}
              options={options?.flavors || []}
              required
            />
            
            <Select
              label="Filling"
              value={layer.fillingId}
              onChange={(e) => updateLayer(index, 'fillingId', e.target.value)}
              options={options?.fillings || []}
              required
            />
            
            <Select
              label="Icing Flavor"
              value={layer.icingId}
              onChange={(e) => updateLayer(index, 'icingId', e.target.value)}
              options={options?.icings || []}
              required
            />
            
            <Select
              label="Writing Color"
              value={layer.writingColorId}
              onChange={(e) => updateLayer(index, 'writingColorId', e.target.value)}
              options={options?.writingColors || []}
              required
            />
          </div>

          <TextArea
            label="Special Notes (optional)"
            value={layer.specialNotes}
            onChange={(e) => updateLayer(index, 'specialNotes', e.target.value)}
            placeholder="e.g., extra filling, specific decorations"
            maxLength={500}
            className="mt-4"
          />

          <FileUpload
            label="Upload Design Image (optional)"
            onFileSelect={(file) => {
              // Handle file upload
              const url = URL.createObjectURL(file);
              updateLayer(index, 'imageUrl', url);
            }}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            className="mt-4"
          />
        </div>
      ))}

      <Button
        onClick={addLayer}
        disabled={layers.length >= 7}
        className="w-full"
      >
        + Add Layer (Max 7)
      </Button>
    </div>
  );
};
\`\`\`

---

## New Order Wizard (Step-by-Step)

\`\`\`typescript
// src/pages/Orders/NewOrderWizard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerStep from './steps/CustomerStep';
import ProductStep from './steps/ProductStep';
import LayersStep from './steps/LayersStep';
import DeliveryStep from './steps/DeliveryStep';
import PricingStep from './steps/PricingStep';
import ReviewStep from './steps/ReviewStep';
import Button from '@/components/ui/Button';

const STEPS = [
  'Customer',
  'Product',
  'Layers',
  'Delivery',
  'Pricing',
  'Review'
];

export const NewOrderWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState({
    customerId: '',
    productId: '',
    cakeSizeId: '',
    layers: [],
    pickupDate: '',
    pickupTime: '',
    firmPrice: 0,
    depositAmount: 0,
    specialRequests: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleNext = async () => {
    // Validate current step
    const stepErrors = validateStep(currentStep, orderData);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      const { orderId } = await response.json();
      navigate(`/orders/${orderId}`, { 
        state: { message: 'Order created successfully!' } 
      });
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const validateStep = (step: number, data: any): string[] => {
    const stepErrors: string[] = [];

    switch (step) {
      case 0: // Customer
        if (!data.customerId) stepErrors.push('Please select a customer');
        break;
      case 1: // Product
        if (!data.productId) stepErrors.push('Please select a product');
        if (!data.cakeSizeId) stepErrors.push('Please select a cake size');
        break;
      case 2: // Layers
        if (!data.layers || data.layers.length === 0) {
          stepErrors.push('At least one layer is required');
        }
        break;
      case 3: // Delivery
        const pickupDate = new Date(data.pickupDate);
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 2);
        if (pickupDate < minDate) {
          stepErrors.push('Pickup date must be at least 2 days in advance');
        }
        break;
      case 4: // Pricing
        if (data.firmPrice <= 0) stepErrors.push('Price must be greater than zero');
        const minDeposit = data.firmPrice * 0.5;
        if (data.depositAmount < minDeposit) {
          stepErrors.push(`Deposit must be at least $${minDeposit.toFixed(2)}`);
        }
        break;
    }

    return stepErrors;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CustomerStep {...orderData} onChange={setOrderData} />;
      case 1:
        return <ProductStep {...orderData} onChange={setOrderData} />;
      case 2:
        return (
          <LayersStep
            {...orderData}
            onChange={setOrderData}
            onError={setErrors}
          />
        );
      case 3:
        return <DeliveryStep {...orderData} onChange={setOrderData} />;
      case 4:
        return <PricingStep {...orderData} onChange={setOrderData} />;
      case 5:
        return <ReviewStep {...orderData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">New Order</h1>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((step, index) => (
          <div
            key={index}
            className={`flex-1 py-2 text-center rounded ${
              index === currentStep
                ? 'bg-raspberry text-white'
                : index < currentStep
                ? 'bg-success text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-error-light border border-error rounded p-4 mb-4">
          <ul>
            {errors.map((error, i) => (
              <li key={i} className="text-error">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          variant="secondary"
          disabled={currentStep === 0}
        >
          Back
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="flex-1"
          >
            Create Order
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewOrderWizard;
\`\`\`

---

## Custom Hook: useOrders

\`\`\`typescript
// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient } from '@/services/api';

export const useOrders = (filters?: any) => {
  return useQuery(
    ['orders', filters],
    () => apiClient.get('/orders', { params: filters }),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

export const useOrder = (orderId: string) => {
  return useQuery(
    ['orders', orderId],
    () => apiClient.get(`/orders/${orderId}`),
    {
      enabled: !!orderId
    }
  );
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (orderData: any) => apiClient.post('/orders', orderData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      }
    }
  );
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ orderId, ...data }: any) =>
      apiClient.patch(`/orders/${orderId}/status`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      }
    }
  );
};
\`\`\`

---

## Production Sheet Component

\`\`\`typescript
// src/components/orders/ProductionSheet.tsx
import React, { useRef } from 'react';
import { Order } from '@/types/orders';
import Button from '@/components/ui/Button';

interface ProductionSheetProps {
  order: Order;
  onPrint?: () => void;
}

export const ProductionSheet: React.FC<ProductionSheetProps> = ({
  order,
  onPrint
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow?.document.write(content);
      printWindow?.document.close();
      printWindow?.print();
      onPrint?.();
    }
  };

  return (
    <div>
      <Button onClick={handlePrint} variant="secondary" className="mb-4">
        🖨️ Print Production Sheet
      </Button>

      <div ref={printRef} className="bg-white p-8" style={{ pageBreakAfter: 'always' }}>
        <h1 className="text-2xl font-bold mb-2">PRODUCTION SHEET</h1>
        <p className="text-gray-600">Order #{order.orderId}</p>

        <div className="grid grid-cols-2 gap-8 my-8">
          <div>
            <h3 className="font-bold mb-2">CUSTOMER</h3>
            <p>{order.customer.firstName} {order.customer.lastName}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.phone}</p>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">DELIVERY</h3>
            <p><strong>Pickup Date:</strong> {order.pickupDate}</p>
            <p><strong>Pickup Time:</strong> {order.pickupTime}</p>
            <p><strong>Special Requests:</strong> {order.specialRequests || 'None'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold mb-4">LAYERS</h3>
          {order.layers.map((layer, index) => (
            <div key={index} className="border-l-4 border-raspberry pl-4 mb-4">
              <p className="font-bold">Layer {layer.layerNumber}</p>
              <p>• Flavor: {layer.flavor}</p>
              <p>• Filling: {layer.filling}</p>
              <p>• Icing: {layer.icing}</p>
              <p>• Writing Color: {layer.writingColor}</p>
              {layer.specialNotes && <p>• Notes: {layer.specialNotes}</p>}
              
              {layer.imageUrl && (
                <img
                  src={layer.imageUrl}
                  alt={`Layer ${layer.layerNumber} reference`}
                  style={{ maxWidth: '200px', marginTop: '8px' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="border-t-2 border-gray-300 pt-4">
          <p><strong>Total Price:</strong> ${order.firmPrice.toFixed(2)}</p>
          <p><strong>Deposit Paid:</strong> ${order.depositPaid?.toFixed(2) || '0.00'}</p>
          <p><strong>Balance Due:</strong> ${(order.firmPrice - (order.depositPaid || 0)).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
\`\`\`

---

## Form Validation Utility

\`\`\`typescript
// src/services/validation.ts
export interface ValidationError {
  field: string;
  message: string;
}

export const validateOrder = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.customerId) {
    errors.push({ field: 'customer', message: 'Customer is required' });
  }

  if (!data.productId) {
    errors.push({ field: 'product', message: 'Product is required' });
  }

  if (!data.cakeSizeId) {
    errors.push({ field: 'cakeSize', message: 'Cake size is required' });
  }

  // Pickup date validation
  if (!data.pickupDate) {
    errors.push({ field: 'pickupDate', message: 'Pickup date is required' });
  } else {
    const pickupDate = new Date(data.pickupDate);
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 2);

    if (pickupDate < minDate) {
      errors.push({
        field: 'pickupDate',
        message: 'Pickup date must be at least 2 days in advance'
      });
    }
  }

  // Price validation
  if (data.firmPrice <= 0) {
    errors.push({ field: 'firmPrice', message: 'Price must be greater than zero' });
  }

  if (data.firmPrice < 20) {
    errors.push({ field: 'firmPrice', message: 'Minimum order is $20' });
  }

  // Deposit validation
  const minDeposit = data.firmPrice * 0.5;
  if (data.depositAmount < minDeposit) {
    errors.push({
      field: 'depositAmount',
      message: `Deposit must be at least ${minDeposit.toFixed(2)}`
    });
  }

  if (data.depositAmount > data.firmPrice) {
    errors.push({
      field: 'depositAmount',
      message: 'Deposit cannot exceed total price'
    });
  }

  return errors;
};
\`\`\`

---

## Accessibility Checklist for Components

- [ ] All interactive elements have focus indicators (visible 2px outline)
- [ ] Form labels associated with inputs (htmlFor/id)
- [ ] Error messages announced to screen readers (role="alert")
- [ ] Modal traps focus (can't Tab outside)
- [ ] Escape key closes modals
- [ ] Dropdowns keyboard accessible (Arrow keys, Enter)
- [ ] Images have descriptive alt text
- [ ] Color contrast 4.5:1 minimum
- [ ] Buttons have aria-label if icon-only

---

## Related Documents

- **02_INFORMATION_ARCHITECTURE.md** - User flows
- **03_UI_STYLE_GUIDE_COMPONENTS.md** - Design system
- **08_API_SPEC_AND_ENDPOINTS.md** - Backend integration

---

**Status:** Production Ready  
**Last Updated:** November 5, 2025
