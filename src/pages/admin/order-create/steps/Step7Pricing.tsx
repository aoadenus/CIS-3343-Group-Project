import { DollarSign } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { useWizard } from '../WizardContext';
import { cakeSizes, standardCakes, calculateSizeBasedPrice } from '../../../../data/cakeOptions';

export function Step7Pricing() {
  const { formData, updateFormData } = useWizard();

  // Calculate total based on cake type
  const calculateTotal = () => {
    if (formData.cakeType === 'standard') {
      const standardCake = standardCakes.find((c) => c.id === formData.standardCakeId);
      const standardCakeBasePrice = standardCake?.basePrice ? standardCake.basePrice * 100 : 0;
      const sizePrice = calculateSizeBasedPrice(formData.cakeSize);
      return standardCakeBasePrice + sizePrice;
    } else {
      const sizePrice = calculateSizeBasedPrice(formData.cakeSize);
      return sizePrice || 0;
    }
  };

  const totalAmount = calculateTotal(); // In cents
  const depositRequired = Math.ceil(totalAmount * 0.5); // 50% deposit
  const balanceDue = totalAmount - depositRequired;

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
          Pricing & Payment
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Review pricing breakdown and deposit details
        </p>
      </div>

      {/* Price Breakdown */}
      <Card className="p-6" style={{ background: '#F9F9F9' }}>
        <h3
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            color: '#2B2B2B',
            marginBottom: '16px'
          }}
        >
          Price Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p
              style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Total Amount
            </p>
            <p
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#2B2B2B',
                fontFamily: 'Playfair Display, serif'
              }}
            >
              ${(totalAmount / 100).toFixed(2)}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Deposit Required (50%)
            </p>
            <p
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#C44569',
                fontFamily: 'Playfair Display, serif'
              }}
            >
              ${(depositRequired / 100).toFixed(2)}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Balance Due at Pickup
            </p>
            <p
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#5A3825',
                fontFamily: 'Playfair Display, serif'
              }}
            >
              ${(balanceDue / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Details */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
                color: '#2B2B2B'
              }}
            >
              Custom Deposit Amount ($)
            </label>
            <Input
              type="number"
              value={formData.depositAmount}
              onChange={(e) => updateFormData({ depositAmount: e.target.value })}
              placeholder={(depositRequired / 100).toFixed(2)}
              min="0"
              step="0.01"
            />
            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              Leave blank to use default 50% deposit (${(depositRequired / 100).toFixed(2)})
            </p>
          </div>

          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
                color: '#2B2B2B'
              }}
            >
              Payment Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) =>
                updateFormData({
                  paymentStatus: e.target.value as 'pending' | 'partial' | 'paid'
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: '#E0E0E0', fontSize: '14px' }}
            >
              <option value="pending">Pending</option>
              <option value="partial">Partial (Deposit Paid)</option>
              <option value="paid">Paid in Full</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Pricing Details */}
      <Card className="p-4" style={{ background: 'rgba(90, 56, 37, 0.05)' }}>
        <div className="flex items-start gap-3">
          <DollarSign size={20} color="#5A3825" className="mt-1" />
          <div>
            <p style={{ fontSize: '14px', color: '#5A3825', fontWeight: 600 }}>
              Pricing Details
            </p>
            <ul className="mt-2 space-y-1" style={{ fontSize: '13px', color: '#666' }}>
              {formData.cakeType === 'standard' && (
                <li>
                  • Standard Cake Base:{' '}
                  $
                  {(
                    (standardCakes.find((c) => c.id === formData.standardCakeId)?.basePrice || 0) *
                    100 /
                    100
                  ).toFixed(2)}
                </li>
              )}
              <li>
                • Size ({cakeSizes.find((s) => s.id === formData.cakeSize)?.name}):{' '}
                ${(calculateSizeBasedPrice(formData.cakeSize) / 100).toFixed(2)}
              </li>
              <li>• 50% deposit required to confirm order</li>
              <li>• Final balance due at pickup</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Validation function
export function validateStep7(formData: any): boolean {
  // All fields have defaults, so always valid
  return true;
}
