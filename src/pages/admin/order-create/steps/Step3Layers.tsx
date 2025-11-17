import { Card } from '../../../../components/ui/card';
import { useWizard } from '../WizardContext';
import { LayerBuilder } from '../../../../components/LayerBuilder';

export function Step3Layers() {
  const { formData, updateFormData } = useWizard();

  // Only show this step for custom cakes
  if (formData.cakeType !== 'custom') {
    return null;
  }

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
          Build Cake Layers
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Design each layer with flavor, filling, and icing (minimum 2 layers required)
        </p>
      </div>

      <Card className="p-6">
        <LayerBuilder
          layers={formData.layers}
          onLayersChange={(layers) => updateFormData({ layers })}
        />
      </Card>
    </div>
  );
}

// Validation function
export function validateStep3(formData: any): boolean {
  // Skip validation if standard cake
  if (formData.cakeType === 'standard') {
    return true;
  }

  // Require minimum 2 layers
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
