import { Cake, Sparkles } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { useWizard } from '../WizardContext';
import { standardCakes } from '../../../../data/cakeOptions';

export function Step2CakeType() {
  const { formData, updateFormData } = useWizard();

  const handleCakeTypeChange = (type: 'standard' | 'custom') => {
    updateFormData({
      cakeType: type,
      standardCakeId: type === 'standard' ? '' : formData.standardCakeId,
      // Reset layers with fresh IDs when switching type
      layers: [
        { id: `layer-${Date.now()}-1`, flavor: '', fillings: [], icing: '', notes: '' },
        { id: `layer-${Date.now()}-2`, flavor: '', fillings: [], icing: '', notes: '' }
      ]
    });
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
          Choose Cake Type
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Select a standard cake or build a custom design
        </p>
      </div>

      {/* Cake Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => handleCakeTypeChange('standard')}
          className="text-left transition-all"
        >
          <Card
            className="p-6 h-full"
            style={{
              borderColor: formData.cakeType === 'standard' ? '#C44569' : '#E0E0E0',
              borderWidth: formData.cakeType === 'standard' ? '2px' : '1px',
              background:
                formData.cakeType === 'standard'
                  ? 'rgba(196, 69, 105, 0.05)'
                  : '#FFFFFF'
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    formData.cakeType === 'standard'
                      ? '#C44569'
                      : 'rgba(196, 69, 105, 0.1)',
                  color: formData.cakeType === 'standard' ? '#FFFFFF' : '#C44569'
                }}
              >
                <Cake size={24} />
              </div>
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#2B2B2B',
                    marginBottom: '8px'
                  }}
                >
                  Standard Cake
                </h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Choose from our pre-designed signature cakes
                </p>
                <ul className="space-y-1">
                  <li style={{ fontSize: '12px', color: '#999' }}>
                    ✓ Faster preparation time
                  </li>
                  <li style={{ fontSize: '12px', color: '#999' }}>
                    ✓ Proven customer favorites
                  </li>
                  <li style={{ fontSize: '12px', color: '#999' }}>
                    ✓ Fixed pricing
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </button>

        <button
          onClick={() => handleCakeTypeChange('custom')}
          className="text-left transition-all"
        >
          <Card
            className="p-6 h-full"
            style={{
              borderColor: formData.cakeType === 'custom' ? '#C44569' : '#E0E0E0',
              borderWidth: formData.cakeType === 'custom' ? '2px' : '1px',
              background:
                formData.cakeType === 'custom'
                  ? 'rgba(196, 69, 105, 0.05)'
                  : '#FFFFFF'
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    formData.cakeType === 'custom'
                      ? '#C44569'
                      : 'rgba(196, 69, 105, 0.1)',
                  color: formData.cakeType === 'custom' ? '#FFFFFF' : '#C44569'
                }}
              >
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#2B2B2B',
                    marginBottom: '8px'
                  }}
                >
                  Custom Build
                </h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Design a completely unique cake layer by layer
                </p>
                <ul className="space-y-1">
                  <li style={{ fontSize: '12px', color: '#999' }}>
                    ✓ Unlimited customization
                  </li>
                  <li style={{ fontSize: '12px', color: '#999' }}>
                    ✓ Choose flavors per layer
                  </li>
                  <li style={{ fontSize: '12px', color: '#999' }}>
                    ✓ Personalized designs
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </button>
      </div>

      {/* Standard Cake Selection */}
      {formData.cakeType === 'standard' && (
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
            Select Standard Cake <span style={{ color: '#C44569' }}>*</span>
          </label>
          <select
            value={formData.standardCakeId}
            onChange={(e) => updateFormData({ standardCakeId: e.target.value })}
            className="w-full p-3 border-2 rounded-lg"
            style={{
              borderColor: !formData.standardCakeId ? '#C44569' : '#E0E0E0',
              fontSize: '14px',
              fontFamily: 'Open Sans, sans-serif'
            }}
          >
            <option value="">Choose a cake...</option>
            {standardCakes.map((cake) => (
              <option key={cake.id} value={cake.id}>
                {cake.name} (Base Price: ${cake.basePrice})
              </option>
            ))}
          </select>

          {formData.standardCakeId && (
            <div className="mt-4 p-4 rounded-lg" style={{ background: '#F9F9F9' }}>
              {standardCakes
                .filter((c) => c.id === formData.standardCakeId)
                .map((cake) => (
                  <div key={cake.id}>
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#2B2B2B',
                        marginBottom: '8px'
                      }}
                    >
                      {cake.name}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      {cake.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#999',
                            marginBottom: '4px'
                          }}
                        >
                          Base Price
                        </p>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#C44569'
                          }}
                        >
                          ${cake.basePrice}
                        </p>
                      </div>
                      {cake.category && (
                        <div>
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#999',
                              marginBottom: '4px'
                            }}
                          >
                            Category
                          </p>
                          <p
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#2B2B2B'
                            }}
                          >
                            {cake.category}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      )}

      {/* Custom Cake Notice */}
      {formData.cakeType === 'custom' && (
        <Card className="p-4" style={{ background: 'rgba(196, 69, 105, 0.05)' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            You'll design your custom cake layer by layer in the next step. Minimum 2 layers
            required.
          </p>
        </Card>
      )}
    </div>
  );
}

// Validation function
export function validateStep2(formData: any): boolean {
  if (formData.cakeType === 'standard') {
    return formData.standardCakeId !== '';
  }
  return true; // Custom cakes validate in layer step
}
