import { Palette, Sparkles } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Checkbox } from '../../../../components/ui/checkbox';
import { useWizard } from '../WizardContext';
import { icingColors, decorations } from '../../../../data/cakeOptions';

export function Step5Design() {
  const { formData, updateFormData } = useWizard();

  const toggleIcingColor = (colorId: string) => {
    const newColors = formData.icingColors.includes(colorId)
      ? formData.icingColors.filter((c) => c !== colorId)
      : [...formData.icingColors, colorId];
    updateFormData({ icingColors: newColors });
  };

  const toggleDecoration = (decorationId: string) => {
    const newDecorations = formData.decorations.includes(decorationId)
      ? formData.decorations.filter((d) => d !== decorationId)
      : [...formData.decorations, decorationId];
    updateFormData({ decorations: newDecorations });
  };

  const CATEGORY_LABELS: Record<string, string> = {
    primary: 'Primary',
    pastel: 'Pastel',
    neon: 'Neon',
    fall: 'Fall',
    extra: 'Extra'
  };

  // Walkthrough removals
  const bannedByCategory: Record<string, Set<string>> = {
    primary: new Set(['pink']),
    pastel: new Set(['peach']),
    neon: new Set(['lime'])
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
          Design & Decorations
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Add colors, decorations, and cake messages (all optional)
        </p>
      </div>

      {/* Cake Message */}
      <Card className="p-6">
        <label
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            display: 'block',
            marginBottom: '8px',
            color: '#2B2B2B'
          }}
        >
          Cake Message (optional)
        </label>
        <Input
          value={formData.message}
          onChange={(e) => updateFormData({ message: e.target.value })}
          placeholder="e.g., 'Happy Birthday Sarah!'"
          maxLength={100}
        />
        <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          Maximum 100 characters
        </p>
      </Card>

      {/* Icing Colors */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} color="#C44569" />
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2B2B2B'
            }}
          >
            Icing & Writing Colors
          </h3>
          {formData.icingColors.length > 0 && (
            <span
              className="px-2 py-1 rounded text-xs"
              style={{ background: '#F0F0F0', color: '#666' }}
            >
              {formData.icingColors.length} selected
            </span>
          )}
        </div>

        <div className="space-y-4">
          {['primary', 'pastel', 'neon', 'fall', 'extra'].map((category) => {
            const categoryColors = icingColors.filter((c) => c.category === category && !bannedByCategory[category]?.has(c.id));
            return (
              <div key={category}>
                <h4
                  style={{
                    fontWeight: 600,
                    fontSize: '13px',
                    marginBottom: '8px',
                    textTransform: 'capitalize',
                    color: '#2B2B2B'
                  }}
                >
                  {CATEGORY_LABELS[category] ?? category} Colors
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {categoryColors.map((color) => {
                    const isSelected = formData.icingColors.includes(color.id);
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
                        <span
                          style={{
                            fontSize: '10px',
                            textAlign: 'center',
                            lineHeight: '1.2',
                            color: '#666'
                          }}
                        >
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
      </Card>

      {/* Decorations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} color="#C44569" />
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2B2B2B'
            }}
          >
            Decorations
          </h3>
          {formData.decorations.length > 0 && (
            <span
              className="px-2 py-1 rounded text-xs"
              style={{ background: '#F0F0F0', color: '#666' }}
            >
              {formData.decorations.length} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {decorations.map((decoration) => {
            const isSelected = formData.decorations.includes(decoration.id);
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
                <span style={{ fontSize: '13px', color: '#2B2B2B' }}>
                  {decoration.name}
                </span>
              </label>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// Validation function
export function validateStep5(formData: any): boolean {
  // All fields are optional
  return true;
}
