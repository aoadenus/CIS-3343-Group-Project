import { Check, User, Cake, DollarSign, Calendar, Settings } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Textarea } from '../../../../components/ui/textarea';
import { useWizard } from '../WizardContext';
import { cakeSizes, standardCakes, calculateSizeBasedPrice } from '../../../../data/cakeOptions';

export function Step9Review() {
  const { formData, updateFormData } = useWizard();

  const calculateTotal = () => {
    if (formData.cakeType === 'standard') {
      const standardCake = standardCakes.find((c) => c.id === formData.standardCakeId);
      const standardCakeBasePrice = standardCake?.basePrice ? standardCake.basePrice * 100 : 0;
      const sizePrice = calculateSizeBasedPrice(formData.cakeSize);
      return standardCakeBasePrice + sizePrice;
    } else {
      return calculateSizeBasedPrice(formData.cakeSize) || 0;
    }
  };

  const totalAmount = calculateTotal();
  const depositRequired = Math.ceil(totalAmount * 0.5);
  const cakeSize = cakeSizes.find((s) => s.id === formData.cakeSize);

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
          Review & Admin Settings
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Review the order details and configure admin settings
        </p>
      </div>

      {/* Order Summary */}
      <Card className="p-6" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: '#10B981' }}>
        <div className="flex items-center gap-2 mb-4">
          <Check size={20} color="#10B981" />
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2B2B2B'
            }}
          >
            Order Summary
          </h3>
        </div>

        <div className="space-y-4">
          {/* Customer */}
          <div className="flex items-start gap-3">
            <User size={18} color="#666" className="mt-1" />
            <div>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '2px' }}>Customer</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2B2B2B' }}>
                {formData.customer?.name}
              </p>
              <p style={{ fontSize: '13px', color: '#666' }}>{formData.customer?.email}</p>
            </div>
          </div>

          {/* Cake Details */}
          <div className="flex items-start gap-3">
            <Cake size={18} color="#666" className="mt-1" />
            <div>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '2px' }}>Cake</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2B2B2B' }}>
                {formData.cakeType === 'standard'
                  ? standardCakes.find((c) => c.id === formData.standardCakeId)?.name
                  : 'Custom Cake'}
              </p>
              <p style={{ fontSize: '13px', color: '#666' }}>
                {cakeSize?.name} - Serves {formData.servings || cakeSize?.servings}
              </p>
              {formData.cakeType === 'custom' && (
                <p style={{ fontSize: '13px', color: '#666' }}>
                  {formData.layers.length} layers
                </p>
              )}
            </div>
          </div>

          {/* Date & Servings */}
          <div className="flex items-start gap-3">
            <Calendar size={18} color="#666" className="mt-1" />
            <div>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '2px' }}>Pickup</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2B2B2B' }}>
                {new Date(formData.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {formData.isRushOrder && (
                <span
                  className="inline-block px-2 py-1 rounded text-xs mt-1"
                  style={{ background: '#DC2626', color: '#FFFFFF', fontWeight: 600 }}
                >
                  RUSH ORDER
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-start gap-3">
            <DollarSign size={18} color="#666" className="mt-1" />
            <div>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '2px' }}>Pricing</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#2B2B2B' }}>
                Total: ${(totalAmount / 100).toFixed(2)}
              </p>
              <p style={{ fontSize: '13px', color: '#666' }}>
                Deposit: ${(depositRequired / 100).toFixed(2)} ({formData.paymentStatus})
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Admin Settings */}
      <Card className="p-6" style={{ background: '#FFF9F5', border: '2px solid #C44569' }}>
        <div className="flex items-center gap-2 mb-4">
          <Settings size={20} color="#C44569" />
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#C44569'
            }}
          >
            Admin Settings
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2B2B2B'
                }}
              >
                Order Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateFormData({ status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E0E0E0', fontSize: '14px' }}
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
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2B2B2B'
                }}
              >
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => updateFormData({ priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E0E0E0', fontSize: '14px' }}
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
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                display: 'block',
                marginBottom: '8px',
                color: '#2B2B2B'
              }}
            >
              Internal Admin Notes
            </label>
            <Textarea
              value={formData.adminNotes}
              onChange={(e) => updateFormData({ adminNotes: e.target.value })}
              placeholder="Internal notes (not visible to customer)..."
              rows={3}
              maxLength={500}
            />
            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              These notes are for internal use only and won't be shown to the customer
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Validation function
export function validateStep9(formData: any): boolean {
  // All required fields should be validated by previous steps
  return true;
}
