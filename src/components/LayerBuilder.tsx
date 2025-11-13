import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { cakeFlavors, fillingFlavors, icingFlavors, pricingConstants, type LayerData } from '../data/cakeOptions';

interface LayerBuilderProps {
  layers: LayerData[];
  onLayersChange: (layers: LayerData[]) => void;
}

export function LayerBuilder({ layers, onLayersChange }: LayerBuilderProps) {
  const addLayer = () => {
    const newLayer: LayerData = {
      id: `layer-${Date.now()}`,
      flavor: '',
      fillings: [],
      icing: '',
      notes: ''
    };
    onLayersChange([...layers, newLayer]);
  };

  const removeLayer = (id: string) => {
    // Enforce minimum 2 layers per case study requirement
    if (layers.length <= 2) {
      return; // Cannot remove - minimum 2 layers required
    }
    onLayersChange(layers.filter(layer => layer.id !== id));
  };

  const updateLayer = (id: string, updates: Partial<LayerData>) => {
    onLayersChange(layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  };

  const toggleFilling = (layerId: string, fillingId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const currentFillings = layer.fillings || [];
    const hasF = currentFillings.includes(fillingId);

    if (hasF) {
      updateLayer(layerId, { fillings: currentFillings.filter(f => f !== fillingId) });
    } else {
      if (currentFillings.length >= pricingConstants.maxFillingsPerLayer) {
        return;
      }
      updateLayer(layerId, { fillings: [...currentFillings, fillingId] });
    }
  };

  const showWarning = layers.length > pricingConstants.layerWarningThreshold;

  return (
    <div>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <AlertTriangle size={20} color="white" />
          <p style={{ color: 'white', fontSize: '14px', fontWeight: 500, margin: 0 }}>
            You have {layers.length} layers. For best results, we recommend 20 or fewer layers.
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card style={{
                padding: '20px',
                border: '2px solid rgba(196, 69, 105, 0.2)',
                background: 'white'
              }}>
                <div className="flex items-start justify-between mb-4">
                  <h5 style={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#C44569',
                    margin: 0
                  }}>
                    Layer {index + 1}
                  </h5>
                  {layers.length > 2 && (
                    <button
                      onClick={() => removeLayer(layer.id)}
                      style={{
                        background: 'rgba(220, 38, 38, 0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                      }}
                      aria-label="Remove layer"
                    >
                      <Trash2 size={18} color="#DC2626" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#2B2B2B',
                      marginBottom: '8px'
                    }}>
                      Flavor <span style={{ color: '#C44569' }}>*</span>
                    </label>
                    <select
                      value={layer.flavor}
                      onChange={(e) => updateLayer(layer.id, { flavor: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E0E0E0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'Open Sans',
                        color: '#2B2B2B',
                        background: '#F8F8F8',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select a cake flavor</option>
                      {cakeFlavors.map(flavor => (
                        <option key={flavor.id} value={flavor.id}>
                          {flavor.name} {flavor.price > 0 && `(+$${flavor.price})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#2B2B2B',
                      marginBottom: '8px'
                    }}>
                      Fillings (Max 2, $1 each)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                      {fillingFlavors.map(filling => {
                        const isSelected = layer.fillings?.includes(filling.id);
                        const isDisabled = !isSelected && (layer.fillings?.length || 0) >= pricingConstants.maxFillingsPerLayer;
                        
                        return (
                          <button
                            key={filling.id}
                            type="button"
                            onClick={() => toggleFilling(layer.id, filling.id)}
                            disabled={isDisabled}
                            style={{
                              padding: '10px 12px',
                              border: isSelected ? '2px solid #C44569' : '2px solid #E0E0E0',
                              borderRadius: '8px',
                              background: isSelected ? 'rgba(196, 69, 105, 0.1)' : 'white',
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              fontSize: '13px',
                              fontFamily: 'Open Sans',
                              color: isDisabled ? '#999' : '#2B2B2B',
                              fontWeight: isSelected ? 600 : 400,
                              opacity: isDisabled ? 0.5 : 1,
                              textAlign: 'left',
                              transition: 'all 0.2s'
                            }}
                          >
                            {filling.name}
                          </button>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: '12px', color: '#5A3825', opacity: 0.7, marginTop: '8px' }}>
                      Selected: {layer.fillings?.length || 0}/2
                    </p>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#2B2B2B',
                      marginBottom: '8px'
                    }}>
                      Icing Flavor <span style={{ color: '#C44569' }}>*</span>
                    </label>
                    <select
                      value={layer.icing || ''}
                      onChange={(e) => updateLayer(layer.id, { icing: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E0E0E0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'Open Sans',
                        color: '#2B2B2B',
                        background: '#F8F8F8',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select an icing flavor</option>
                      {icingFlavors.map(icing => (
                        <option key={icing.id} value={icing.id}>
                          {icing.name} {icing.price > 0 && `(+$${icing.price})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#2B2B2B',
                      marginBottom: '8px'
                    }}>
                      Special Notes (Optional, 255 characters max)
                    </label>
                    <Textarea
                      value={layer.notes || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 255) {
                          updateLayer(layer.id, { notes: value });
                        }
                      }}
                      placeholder="Any special requests for this layer?"
                      style={{
                        minHeight: '80px',
                        fontSize: '14px',
                        fontFamily: 'Open Sans'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#5A3825', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                      {(layer.notes || '').length}/255
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          onClick={addLayer}
          style={{
            width: '100%',
            height: '52px',
            background: 'linear-gradient(135deg, #C44569 0%, #A03355 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'Poppins',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={20} />
          Add Another Layer
        </Button>
      </div>
    </div>
  );
}
