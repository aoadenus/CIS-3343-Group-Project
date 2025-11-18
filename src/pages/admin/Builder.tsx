import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ToastContext';
import { LayerBuilder } from '../../components/LayerBuilder';
import { flavors, fillings, calculateTotalPrice, type LayerData } from '../../data/cakeOptions';

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: 'Build Layers', description: 'Create your custom cake layers' },
  { id: 2, title: 'Details', description: 'Finalize your order' },
  { id: 3, title: 'Review', description: 'Confirm and submit' }
];

export function Builder() {
  const { showToast } = useToast();
  const [openStep, setOpenStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [layers, setLayers] = useState<LayerData[]>([
    { id: 'layer-1', flavor: '', fillings: [], notes: '', icing: '' },
    { id: 'layer-2', flavor: '', fillings: [], notes: '', icing: '' }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    servings: '',
    message: '',
    notes: '',
    inspirationImages: [] as File[]
  });

  const handleStepClick = (stepId: number) => {
    // Can only open a step if all previous steps are completed
    const canOpen = stepId === 1 || completedSteps.includes(stepId - 1);
    if (canOpen) {
      setOpenStep(openStep === stepId ? 0 : stepId);
    }
  };

  const handleCompleteStep = (stepId: number) => {
    // Validate step before marking complete
    if (stepId === 1) {
      if (layers.length < 2) {
        showToast('error', 'Please add at least two layers to continue');
        return;
      }
      for (const layer of layers) {
        if (!layer.flavor) {
          showToast('error', 'Please select a flavor for all layers');
          return;
        }
      }
    }
    if (stepId === 2 && (!formData.name || !formData.email || !formData.date || !formData.servings)) {
      showToast('error', 'Please fill in all required fields to continue');
      return;
    }

    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    // Auto-open next step
    if (stepId < 3) {
      setOpenStep(stepId + 1);
    }
  };

  const handleSubmit = () => {
    showToast('success', 'Design preview complete! Use "Create Order" to save this design.');
  };

  const totalPrice = calculateTotalPrice(layers);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ 
            fontSize: 'clamp(28px, 6vw, 48px)',
            marginBottom: '16px'
          }}>
            Design Sandbox
          </h1>
          <p style={{ 
            fontSize: 'clamp(15px, 3vw, 18px)',
            color: '#5A3825', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Staff-only tool to visualize custom cake designs. Use "Create Order" to save actual orders.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-6 lg:mb-8">
          <div className="flex justify-between items-center mb-3">
            <span style={{ 
              fontFamily: 'Poppins', 
              fontSize: 'clamp(13px, 2.5vw, 14px)', 
              fontWeight: 600,
              color: '#5A3825' 
            }}>
              Progress: {completedSteps.length} of {steps.length} completed
            </span>
            <span style={{ 
              fontFamily: 'Poppins', 
              fontSize: 'clamp(13px, 2.5vw, 14px)', 
              fontWeight: 600,
              color: '#C44569' 
            }}>
              {Math.round((completedSteps.length / steps.length) * 100)}%
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: 'rgba(196, 69, 105, 0.15)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #C44569 0%, #A03355 100%)',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>

        {/* Accordion Steps */}
        <div className="space-y-4">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isOpen = openStep === step.id;
            const isLocked = step.id > 1 && !completedSteps.includes(step.id - 1);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step.id * 0.1 }}
              >
                <Card style={{
                  border: isCompleted 
                    ? '2px solid #22c55e' 
                    : isOpen 
                      ? '2px solid #C44569' 
                      : '2px solid rgba(90, 56, 37, 0.15)',
                  background: isLocked ? 'rgba(90, 56, 37, 0.03)' : 'white',
                  overflow: 'hidden',
                  opacity: isLocked ? 0.6 : 1
                }}>
                  {/* Accordion Header */}
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={isLocked}
                    style={{
                      width: '100%',
                      padding: 'clamp(16px, 4vw, 20px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      minHeight: '72px'
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      {/* Step Number/Check */}
                      <div style={{
                        width: 'clamp(44px, 10vw, 52px)',
                        height: 'clamp(44px, 10vw, 52px)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isCompleted 
                          ? '#22c55e' 
                          : isOpen 
                            ? '#C44569' 
                            : 'rgba(90, 56, 37, 0.1)',
                        color: isCompleted || isOpen ? 'white' : '#5A3825',
                        flexShrink: 0
                      }}>
                        {isCompleted ? (
                          <Check size={24} strokeWidth={2.5} />
                        ) : (
                          <span style={{ 
                            fontFamily: 'Poppins', 
                            fontWeight: 700,
                            fontSize: 'clamp(18px, 4vw, 20px)'
                          }}>
                            {step.id}
                          </span>
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 style={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: 'clamp(15px, 3.5vw, 18px)',
                            color: isCompleted ? '#22c55e' : isOpen ? '#C44569' : '#2B2B2B'
                          }}>
                            {step.title}
                          </h4>
                          <span style={{
                            fontFamily: 'Poppins',
                            fontSize: 'clamp(11px, 2.5vw, 12px)',
                            fontWeight: 600,
                            color: '#5A3825',
                            opacity: 0.6
                          }}>
                            {step.id}/3
                          </span>
                        </div>
                        <p style={{
                          fontSize: 'clamp(13px, 2.5vw, 14px)',
                          color: '#5A3825',
                          opacity: 0.8
                        }}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    {!isLocked && (
                      <div style={{ 
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isOpen ? (
                          <ChevronUp size={24} color="#C44569" />
                        ) : (
                          <ChevronDown size={24} color="#5A3825" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ 
                          padding: 'clamp(16px, 4vw, 24px)',
                          borderTop: '1px solid rgba(90, 56, 37, 0.1)'
                        }}>
                          {/* Step 1: Build Layers */}
                          {step.id === 1 && (
                            <div>
                              <div style={{
                                marginBottom: '20px',
                                padding: '16px',
                                background: 'rgba(196, 69, 105, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(196, 69, 105, 0.2)'
                              }}>
                                <p style={{
                                  fontFamily: 'Poppins',
                                  fontSize: '14px',
                                  color: '#2B2B2B',
                                  margin: '0 0 8px 0',
                                  fontWeight: 600
                                }}>
                                  Build your perfect cake layer by layer!
                                </p>
                                <p style={{
                                  fontFamily: 'Open Sans',
                                  fontSize: '13px',
                                  color: '#5A3825',
                                  margin: 0
                                }}>
                                  Add unlimited layers (minimum 2 required), each with its own flavor, up to 2 fillings ($1 each), and special notes.
                                </p>
                              </div>
                              <LayerBuilder layers={layers} onLayersChange={setLayers} />
                            </div>
                          )}

                          {/* Step 2: Details */}
                          {step.id === 2 && (
                            <div className="space-y-4 sm:space-y-5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                  <label className="block mb-2" style={{ 
                                    fontSize: 'clamp(13px, 2.5vw, 14px)', 
                                    fontWeight: 500, 
                                    color: '#5A3825' 
                                  }}>
                                    Your Name *
                                  </label>
                                  <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    style={{ minHeight: '48px' }}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2" style={{ 
                                    fontSize: 'clamp(13px, 2.5vw, 14px)', 
                                    fontWeight: 500, 
                                    color: '#5A3825' 
                                  }}>
                                    Email Address *
                                  </label>
                                  <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    style={{ minHeight: '48px' }}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2" style={{ 
                                    fontSize: 'clamp(13px, 2.5vw, 14px)', 
                                    fontWeight: 500, 
                                    color: '#5A3825' 
                                  }}>
                                    Phone Number
                                  </label>
                                  <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="(555) 123-4567"
                                    style={{ minHeight: '48px' }}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2" style={{ 
                                    fontSize: 'clamp(13px, 2.5vw, 14px)', 
                                    fontWeight: 500, 
                                    color: '#5A3825' 
                                  }}>
                                    Event Date *
                                  </label>
                                  <div className="relative">
                                    <Calendar 
                                      className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" 
                                      size={18} 
                                      color="#5A3825" 
                                      style={{ opacity: 0.6 }}
                                    />
                                    <Input
                                      type="date"
                                      value={formData.date}
                                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                      style={{ minHeight: '48px', paddingLeft: '48px' }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block mb-2" style={{ 
                                    fontSize: 'clamp(13px, 2.5vw, 14px)', 
                                    fontWeight: 500, 
                                    color: '#5A3825' 
                                  }}>
                                    Number of Servings *
                                  </label>
                                  <Input
                                    type="number"
                                    value={formData.servings}
                                    onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                                    placeholder="e.g., 30"
                                    style={{ minHeight: '48px' }}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2" style={{ 
                                    fontSize: 'clamp(13px, 2.5vw, 14px)', 
                                    fontWeight: 500, 
                                    color: '#5A3825' 
                                  }}>
                                    Cake Message (Optional)
                                  </label>
                                  <Input
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Happy Birthday!"
                                    style={{ minHeight: '48px' }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block mb-2" style={{ 
                                  fontSize: 'clamp(13px, 2.5vw, 14px)', 
                                  fontWeight: 500, 
                                  color: '#5A3825' 
                                }}>
                                  Additional Notes
                                </label>
                                <Textarea
                                  value={formData.notes}
                                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                  placeholder="Any special requests, dietary restrictions, or design preferences..."
                                  rows={4}
                                  style={{ minHeight: '100px' }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Step 3: Review */}
                          {step.id === 3 && (
                            <div className="space-y-6">
                              <div className="p-4 sm:p-6 rounded-xl" style={{ background: 'rgba(248, 235, 215, 0.6)' }}>
                                <h5 className="mb-4" style={{ 
                                  fontFamily: 'Poppins',
                                  fontSize: 'clamp(16px, 3.5vw, 18px)',
                                  fontWeight: 600
                                }}>
                                  Order Summary
                                </h5>
                                <div className="space-y-3">
                                  <div>
                                    <h6 style={{
                                      color: '#2B2B2B',
                                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                                      fontWeight: 600,
                                      marginBottom: '12px',
                                      fontFamily: 'Poppins'
                                    }}>
                                      Cake Layers ({layers.length}):
                                    </h6>
                                    <div className="space-y-3">
                                      {layers.map((layer, index) => {
                                        const flavorData = flavors.find(f => f.id === layer.flavor);
                                        const layerFillings = layer.fillings.map(fid => 
                                          fillings.find(f => f.id === fid)?.name
                                        ).filter(Boolean);
                                        
                                        return (
                                          <div
                                            key={layer.id}
                                            style={{
                                              padding: '12px',
                                              background: 'rgba(196, 69, 105, 0.05)',
                                              borderRadius: '8px',
                                              border: '1px solid rgba(196, 69, 105, 0.15)'
                                            }}
                                          >
                                            <p style={{
                                              fontSize: 'clamp(13px, 2.5vw, 14px)',
                                              fontWeight: 600,
                                              color: '#C44569',
                                              marginBottom: '4px'
                                            }}>
                                              Layer {index + 1}
                                            </p>
                                            <p style={{
                                              fontSize: 'clamp(13px, 2.5vw, 14px)',
                                              color: '#2B2B2B',
                                              marginBottom: layerFillings.length > 0 || layer.notes ? '4px' : 0
                                            }}>
                                              <strong>Flavor:</strong> {flavorData?.name || 'Unknown'}
                                              {flavorData && flavorData.price > 0 && ` (+$${flavorData.price})`}
                                            </p>
                                            {layerFillings.length > 0 && (
                                              <p style={{
                                                fontSize: 'clamp(12px, 2.5vw, 13px)',
                                                color: '#5A3825',
                                                marginBottom: layer.notes ? '4px' : 0
                                              }}>
                                                <strong>Fillings:</strong> {layerFillings.join(', ')}
                                              </p>
                                            )}
                                            {layer.notes && (
                                              <p style={{
                                                fontSize: 'clamp(12px, 2.5vw, 13px)',
                                                color: '#5A3825',
                                                fontStyle: 'italic'
                                              }}>
                                                <strong>Notes:</strong> {layer.notes}
                                              </p>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-start">
                                    <span style={{ 
                                      color: '#5A3825',
                                      fontSize: 'clamp(14px, 2.5vw, 15px)'
                                    }}>
                                      Contact:
                                    </span>
                                    <span style={{ 
                                      fontWeight: 600,
                                      fontSize: 'clamp(14px, 2.5vw, 15px)',
                                      textAlign: 'right'
                                    }}>
                                      {formData.name || '—'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-start">
                                    <span style={{ 
                                      color: '#5A3825',
                                      fontSize: 'clamp(14px, 2.5vw, 15px)'
                                    }}>
                                      Servings:
                                    </span>
                                    <span style={{ 
                                      fontWeight: 600,
                                      fontSize: 'clamp(14px, 2.5vw, 15px)'
                                    }}>
                                      {formData.servings || '—'} people
                                    </span>
                                  </div>
                                  <div className="border-t pt-4 mt-4" style={{ borderColor: 'rgba(90, 56, 37, 0.15)' }}>
                                    <div className="flex justify-between items-center">
                                      <span style={{ 
                                        fontWeight: 600, 
                                        fontSize: 'clamp(15px, 3vw, 16px)' 
                                      }}>
                                        Estimated Starting Price:
                                      </span>
                                      <span style={{ 
                                        fontFamily: 'Poppins', 
                                        fontWeight: 700, 
                                        fontSize: 'clamp(20px, 4vw, 24px)', 
                                        color: '#C44569' 
                                      }}>
                                        ${totalPrice}+
                                      </span>
                                    </div>
                                    <p style={{ 
                                      fontSize: 'clamp(12px, 2.5vw, 13px)', 
                                      color: '#5A3825',
                                      opacity: 0.7,
                                      marginTop: '8px' 
                                    }}>
                                      Final price depends on servings and design complexity
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Button
                                onClick={handleSubmit}
                                style={{
                                  width: '100%',
                                  minHeight: '56px',
                                  background: '#C44569',
                                  color: 'white',
                                  fontFamily: 'Poppins',
                                  fontWeight: 600,
                                  fontSize: 'clamp(15px, 3vw, 16px)',
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '10px',
                                  boxShadow: '0 4px 16px rgba(196, 69, 105, 0.3)'
                                }}
                              >
                                Submit Order Request
                                <Check size={20} strokeWidth={2.5} />
                              </Button>
                            </div>
                          )}

                          {/* Continue Button for Steps 1-2 */}
                          {step.id < 3 && (
                            <div className="mt-6">
                              <Button
                                onClick={() => handleCompleteStep(step.id)}
                                style={{
                                  width: '100%',
                                  minHeight: '52px',
                                  background: '#C44569',
                                  color: 'white',
                                  fontFamily: 'Poppins',
                                  fontWeight: 600,
                                  fontSize: 'clamp(14px, 3vw, 15px)',
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px'
                                }}
                              >
                                Continue to Next Step
                                <ArrowRight size={20} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
