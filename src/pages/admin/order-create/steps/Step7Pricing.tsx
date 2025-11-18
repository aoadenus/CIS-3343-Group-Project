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
  const depositRequired = Math.ceil(totalAmount * 0.5); // 50% deposit (in cents)
  const balanceDue = totalAmount - depositRequired;

  // Payment statuses simplified: 'partial_deposit' | 'paid_in_full'
  const paymentStatus = formData.paymentStatus || 'partial';

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

      {/* Payment Details: simplified to 2 options with auto-calculated 50% deposit */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
              Minimum deposit is auto-calculated at 50% of total and applied below.
            </p>

            <div className="w-full bg-gray-200 rounded-full h-4 my-2">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${((depositRequired) / (totalAmount || 1)) * 100}%` }}
              />
            </div>
            <p style={{ fontSize: '13px', color: '#333' }}>
              ${ (depositRequired / 100).toFixed(2) } paid / ${ (totalAmount / 100).toFixed(2) } total
            </p>
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Payment Selection</label>
            <div className="flex flex-col gap-2" role="radiogroup" aria-invalid={!formData.paymentStatus} aria-describedby={!formData.paymentStatus ? 'payment-status-error' : undefined}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  checked={paymentStatus === 'partial'}
                  onChange={() => updateFormData({ paymentStatus: 'partial' })}
                />
                <span style={{ marginLeft: 8 }}>Partial Deposit (${(depositRequired / 100).toFixed(2)})</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  checked={paymentStatus === 'paid'}
                  onChange={() => updateFormData({ paymentStatus: 'paid' })}
                />
                <span style={{ marginLeft: 8 }}>Paid in Full (${(totalAmount / 100).toFixed(2)})</span>
              </label>
              {!formData.paymentStatus && (
                <p id="payment-status-error" role="alert" style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>*Required</p>
              )}
            </div>
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
  // Require payment status to be selected
  if (!formData.paymentStatus) return false;
  // deposit amount should be present (calculated elsewhere)
  return true;
}
