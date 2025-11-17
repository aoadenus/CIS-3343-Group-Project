import { Card } from '../../../../components/ui/card';
import { useWizard } from '../WizardContext';
import { cakeSizes } from '../../../../data/cakeOptions';
import { Check } from 'lucide-react';

export function Step4SizeAndTiers() {
  const { formData, updateFormData } = useWizard();

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
          Select Cake Size
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Choose the size based on servings needed
        </p>
      </div>

      {/* Size Selection Dropdown (Primary) */}
      <Card className="p-6">
        <label
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            display: 'block',
            marginBottom: '12px',
            color: '#2B2B2B'
          }}
        >
          Cake Size <span style={{ color: '#C44569' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={formData.cakeSize}
            onChange={(e) => updateFormData({ cakeSize: e.target.value })}
            className="w-full p-3 border-2 rounded-lg"
            style={{
              borderColor: !formData.cakeSize ? '#999' : '#E0E0E0',
              fontSize: '14px',
              fontFamily: 'Open Sans, sans-serif',
              appearance: 'none'
            }}
            aria-invalid={false}
          >
          <option value="">Choose a size...</option>
          {cakeSizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.name} - Serves {size.servings} - ${(size.price / 100).toFixed(2)}
            </option>
          ))}
        </select>
          {formData.cakeSize ? (
            <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#10B981', fontWeight: 700 }} aria-hidden>
              ✓
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>*Required</p>
          )}
        </div>
      </Card>

      {/* Visual Size Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cakeSizes.map((size) => {
          const isSelected = formData.cakeSize === size.id;
          return (
            <button
              key={size.id}
              onClick={() => updateFormData({ cakeSize: size.id })}
              className="text-left transition-all"
            >
              <Card
                className="p-4 h-full relative"
                style={{
                  borderColor: isSelected ? '#C44569' : '#E0E0E0',
                  borderWidth: isSelected ? '2px' : '1px',
                  background: isSelected ? 'rgba(196, 69, 105, 0.05)' : '#FFFFFF'
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: '#C44569' }}
                  >
                    <Check size={16} color="#FFFFFF" />
                  </div>
                )}
                <h4
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#2B2B2B',
                    marginBottom: '4px'
                  }}
                >
                  {size.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  Serves {size.servings}
                </p>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#C44569'
                  }}
                >
                  ${(size.price / 100).toFixed(2)}
                </p>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Validation function
export function validateStep4(formData: any): boolean {
  return formData.cakeSize !== '';
}
