import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { useWizard } from '../WizardContext';
import { LayerBuilder } from '../../../../components/LayerBuilder';

export function Step3Layers() {
  const { formData, updateFormData } = useWizard();

  const [animNewId, setAnimNewId] = useState<string | null>(null);
  const prevLen = useRef(formData.layers.length);

  useEffect(() => {
    const len = formData.layers.length;
    if (len > prevLen.current) {
      // new layer added - animate the newest layer
      const newest = formData.layers[formData.layers.length - 1];
      if (newest?.id) {
        setAnimNewId(newest.id);
        // clear after animation duration
        const t = setTimeout(() => setAnimNewId(null), 500);
        return () => clearTimeout(t);
      }
    }
    prevLen.current = len;
  }, [formData.layers]);

  const isStandardCake = formData.cakeType === 'standard';

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
          {isStandardCake ? 'Review & Edit Layers' : 'Build Cake Layers'}
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          {isStandardCake
            ? 'Layers have been pre-filled from the standard recipe. You can review and edit them if needed.'
            : 'Design each layer with flavor, filling, and icing (minimum 2 layers required)'}
        </p>
      </div>

      {/* Info Banner for Standard Cakes */}
      {isStandardCake && (
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
              Layers pre-filled from standard recipe
            </p>
            <p style={{ fontSize: '13px', color: '#2E7D32' }}>
              These layers match the selected standard cake recipe. Feel free to make
              adjustments as needed.
            </p>
          </div>
        </div>
      )}

      {/* Visual Cake Preview */}
      <Card className="p-6" style={{ background: 'rgba(196, 69, 105, 0.02)' }}>
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col-reverse items-center gap-1">
            {formData.layers.map((layer, index) => {
              const layerNumber = formData.layers.length - index;
              const isTopLayer = index === formData.layers.length - 1;
              const isBottomLayer = index === 0;

              return (
                <div
                  key={layer.id}
                  className="relative"
                  style={{
                    width: `${140 + (layerNumber * 20)}px`,
                    height: '40px',
                    // animate newly added layer
                    transform: animNewId === layer.id ? 'scale(0.85) translateY(0)' : undefined,
                    opacity: animNewId === layer.id ? 0 : undefined,
                    transition: 'transform 400ms cubic-bezier(.2,.9,.2,1), opacity 300ms ease-out'
                  }}
                >
                  {/* Layer Tier */}
                  <div
                    className="rounded-lg flex items-center justify-center transition-all"
                    style={{
                      width: '100%',
                      height: '100%',
                      background: layer.flavor
                        ? 'linear-gradient(135deg, #C44569 0%, #A3385A 100%)'
                        : 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      Layer {layerNumber}
                    </span>
                  </div>

                  {/* Decorative Icing Top */}
                  {isTopLayer && (
                    <div
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: '60px',
                        height: '20px',
                        background: layer.icing
                          ? 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)'
                          : '#F0F0F0',
                        borderRadius: '50% 50% 0 0',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Cake Plate */}
            <div
              className="mt-2"
              style={{
                width: `${160 + (formData.layers.length * 20)}px`,
                height: '8px',
                background: 'linear-gradient(135deg, #5A3825 0%, #3E2517 100%)',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>
        </div>

        <p
          className="text-center"
          style={{
            fontSize: '12px',
            color: '#999',
            fontStyle: 'italic'
          }}
        >
          {formData.layers.length} {formData.layers.length === 1 ? 'layer' : 'layers'} •
          Layer 1 is the bottom layer
        </p>
      </Card>

      {/* Layer Builder */}
      <Card className="p-6">
        <LayerBuilder
          layers={formData.layers}
          onLayersChange={(layers) => updateFormData({ layers })}
        />
      </Card>

      {/* Help Text */}
      <div
        className="p-4 rounded-lg"
        style={{ background: 'rgba(196, 69, 105, 0.05)', border: '1px dashed #C44569' }}
      >
        <p
          style={{
            fontSize: '13px',
            color: '#5A3825',
            lineHeight: '1.6'
          }}
        >
          <strong>Tips:</strong> Layer 1 is the bottom layer. You can add up to 5 layers
          total. Each layer can have up to 2 different fillings. The icing you select
          will be used between the layers and on top.
        </p>
      </div>
    </div>
  );
}

// Validation function
export function validateStep3(formData: any): boolean {
  // Require minimum 2 layers for all cakes
  if (formData.layers.length < 2) {
    return false;
  }

  // Validate all layers have flavor and icing
  const allValid = formData.layers.every(
    (layer: any) => layer.flavor && layer.icing
  );

  // Check maximum 2 fillings per layer
  const maxFillings = formData.layers.every(
    (layer: any) => layer.fillings.length <= 2
  );

  return allValid && maxFillings;
}
