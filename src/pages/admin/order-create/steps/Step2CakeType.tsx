import { Cake, Sparkles, Info } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { useWizard } from '../WizardContext';
import { standardCakes } from '../../../../data/cakeOptions';
import { useToast } from '../../../../components/ToastContext';

export function Step2CakeType() {
  const { formData, updateFormData } = useWizard();
  const { showToast } = useToast();

  const handleCakeTypeChange = (type: 'standard' | 'custom') => {
    updateFormData({
      cakeType: type,
      standardCakeId: '',
      // Reset layers with fresh IDs when switching type
      layers: [
        { id: `layer-${Date.now()}-1`, flavor: '', fillings: [], icing: '', notes: '' },
        { id: `layer-${Date.now()}-2`, flavor: '', fillings: [], icing: '', notes: '' }
      ]
    });
  };

  const handleStandardCakeSelection = (cakeId: string) => {
    const selectedCake = standardCakes.find((cake) => cake.id === cakeId);

    if (selectedCake) {
      // Pre-populate layers from standard cake recipe
      const preFilledLayers = selectedCake.layers.map((layer, index) => ({
        id: `layer-${Date.now()}-${index + 1}`,
        flavor: layer.flavor,
        fillings: layer.fillings,
        icing: layer.icing,
        notes: layer.notes || ''
      }));

      updateFormData({
        standardCakeId: cakeId,
        layers: preFilledLayers
      });

      showToast('success', 'Layers pre-filled from recipe. You can edit them in Step 3.');
    } else {
      updateFormData({ standardCakeId: cakeId });
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
            className="p-6 h-full hover:shadow-lg transition-shadow"
            style={{
              borderColor: formData.cakeType === 'standard' ? '#C44569' : '#E0E0E0',
              borderWidth: formData.cakeType === 'standard' ? '3px' : '1px',
              background:
                formData.cakeType === 'standard'
                  ? 'rgba(196, 69, 105, 0.05)'
                  : '#FFFFFF'
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    formData.cakeType === 'standard'
                      ? '#C44569'
                      : 'rgba(196, 69, 105, 0.1)',
                  color: formData.cakeType === 'standard' ? '#FFFFFF' : '#C44569'
                }}
              >
                <Cake size={28} />
              </div>
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '20px',
                    fontWeight: 700,
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
                  <li style={{ fontSize: '13px', color: '#999' }}>
                    ✓ Faster preparation time
                  </li>
                  <li style={{ fontSize: '13px', color: '#999' }}>
                    ✓ Proven customer favorites
                  </li>
                  <li style={{ fontSize: '13px', color: '#999' }}>
                    ✓ Pre-filled recipe layers
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
            className="p-6 h-full hover:shadow-lg transition-shadow"
            style={{
              borderColor: formData.cakeType === 'custom' ? '#C44569' : '#E0E0E0',
              borderWidth: formData.cakeType === 'custom' ? '3px' : '1px',
              background:
                formData.cakeType === 'custom'
                  ? 'rgba(196, 69, 105, 0.05)'
                  : '#FFFFFF'
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    formData.cakeType === 'custom'
                      ? '#C44569'
                      : 'rgba(196, 69, 105, 0.1)',
                  color: formData.cakeType === 'custom' ? '#FFFFFF' : '#C44569'
                }}
              >
                <Sparkles size={28} />
              </div>
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '20px',
                    fontWeight: 700,
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
                  <li style={{ fontSize: '13px', color: '#999' }}>
                    ✓ Unlimited customization
                  </li>
                  <li style={{ fontSize: '13px', color: '#999' }}>
                    ✓ Choose flavors per layer
                  </li>
                  <li style={{ fontSize: '13px', color: '#999' }}>
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
        <Card className="p-6 animate-in fade-in duration-300">
          <label
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              display: 'block',
              marginBottom: '12px',
              color: '#2B2B2B'
            }}
          >
            Select Standard Cake <span style={{ color: '#C44569' }}>*</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standardCakes.map((cake) => (
              <button
                key={cake.id}
                onClick={() => handleStandardCakeSelection(cake.id)}
                className="text-left transition-all"
                style={{
                  border: formData.standardCakeId === cake.id ? '3px solid #C44569' : '2px solid #E0E0E0',
                  borderRadius: '12px',
                  padding: '12px',
                  background: formData.standardCakeId === cake.id ? 'rgba(196, 69, 105, 0.05)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <img
                  src={cake.image_path || '/images/products/placeholder.svg'}
                  alt={cake.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.svg'; }}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                />
                <h4 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#2B2B2B', marginBottom: '4px' }}>
                  {cake.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>
                  {cake.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#C44569' }}>
                    ${cake.basePrice}
                  </span>
                  <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {cake.category}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {!formData.standardCakeId && (
            <p style={{ fontSize: '12px', color: '#C44569', marginTop: '12px' }}>
              Please select a standard cake to continue
            </p>
          )}

          {/* Selected Cake Details */}
          {formData.standardCakeId && (
            <div className="mt-4 space-y-3 animate-in slide-in-from-top duration-300">
              {standardCakes
                .filter((c) => c.id === formData.standardCakeId)
                .map((cake) => (
                  <div key={cake.id}>
                    {/* Cake Info Card */}
                    <div
                      className="p-4 rounded-lg"
                      style={{ background: 'rgba(196, 69, 105, 0.05)' }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {cake.image_path ? (
                          <img
                            src={cake.image_path}
                            alt={cake.name}
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.svg'; }}
                            style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                          />
                        ) : (
                          <Cake size={24} style={{ color: '#C44569', flexShrink: 0 }} />
                        )}
                        <div className="flex-1">
                          <h4
                            style={{
                              fontWeight: 700,
                              fontSize: '18px',
                              color: '#2B2B2B',
                              marginBottom: '4px'
                            }}
                          >
                            {cake.name}
                          </h4>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#666',
                              marginBottom: '12px'
                            }}
                          >
                            {cake.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p
                                style={{
                                  fontSize: '11px',
                                  color: '#999',
                                  marginBottom: '4px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                Base Price
                              </p>
                              <p
                                style={{
                                  fontSize: '24px',
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
                                    fontSize: '11px',
                                    color: '#999',
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}
                                >
                                  Category
                                </p>
                                <span
                                  className="inline-block px-3 py-1 rounded-full text-sm"
                                  style={{
                                    background: '#C44569',
                                    color: '#FFFFFF',
                                    fontWeight: 600
                                  }}
                                >
                                  {cake.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layers Pre-filled Notice */}
                    <div
                      className="p-4 rounded-lg flex items-start gap-3"
                      style={{ background: '#E8F5E9', border: '1px solid #81C784' }}
                    >
                      <Info size={20} style={{ color: '#2E7D32', flexShrink: 0 }} />
                      <div>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1B5E20',
                            marginBottom: '4px'
                          }}
                        >
                          Layers pre-filled from recipe
                        </p>
                        <p style={{ fontSize: '13px', color: '#2E7D32' }}>
                          This cake comes with {cake.layers.length} pre-configured layers. You
                          can review and edit them in Step 3 if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Card>
      )}

      {/* Custom Cake Notice */}
      {formData.cakeType === 'custom' && (
        <Card
          className="p-5 animate-in fade-in duration-300"
          style={{ background: 'rgba(196, 69, 105, 0.05)', border: '2px dashed #C44569' }}
        >
          <div className="flex items-start gap-3">
            <Sparkles size={24} style={{ color: '#C44569', flexShrink: 0 }} />
            <div>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '6px'
                }}
              >
                Build your cake layer-by-layer in Step 3
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                You'll have complete control to choose cake flavors, fillings, and icing for
                each layer. Minimum 2 layers required.
              </p>
            </div>
          </div>
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
