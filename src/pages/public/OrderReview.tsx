import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Calendar, Cake, Mail, Phone, User, MessageSquare, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useToast } from '../../components/ToastContext';
import { calculateTotalPrice, flavors, fillings, designs, occasions, type LayerData } from '../../data/cakeOptions';

interface OrderReviewProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface OrderData {
  occasion: string;
  layers: LayerData[];
  design: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  servings: string;
  message: string;
  notes: string;
  imageCount: number;
}

export function OrderReview({ onNavigate, onBack }: OrderReviewProps) {
  const { showToast } = useToast();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get order data from sessionStorage
    const storedData = sessionStorage.getItem('pendingCakeOrder');
    if (storedData) {
      setOrderData(JSON.parse(storedData));
    } else {
      // No data, redirect back to builder
      showToast('error', 'No order data found. Please start from the builder.');
      if (onNavigate) {
        onNavigate('builder');
      }
    }
  }, [onNavigate, showToast]);

  const handleConfirmOrder = async () => {
    if (!orderData) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          occasion: orderData.occasion,
          layers: orderData.layers,
          design: orderData.design,
          servings: orderData.servings,
          date: orderData.date,
          message: orderData.message,
          notes: orderData.notes,
          inspirationImages: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await response.json();
      console.log('Order created:', data);
      
      showToast('success', 'Custom order confirmed! Emily will reach out within 24 hours to finalize details.');
      
      // Clear stored order data
      sessionStorage.removeItem('pendingCakeOrder');
      
      // Navigate to home
      if (onNavigate) {
        onNavigate('home');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      showToast('error', 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToBuilder = () => {
    if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('builder');
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p style={{ fontSize: '16px', color: '#5A3825', marginBottom: '20px' }}>
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice(orderData.layers);
  const occasionObj = occasions.find(o => o.id === orderData.occasion);
  const designObj = designs.find(d => d.id === orderData.design);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-12" style={{ background: 'linear-gradient(to bottom, #FFF5F7 0%, #FFFFFF 100%)' }}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={handleBackToBuilder}
            style={{
              background: 'transparent',
              border: '2px solid rgba(196, 69, 105, 0.2)',
              color: '#C44569',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontFamily: 'Poppins',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={20} />
            Back to Builder
          </Button>

          <h1 style={{ 
            fontSize: 'clamp(32px, 6vw, 48px)',
            marginBottom: '16px',
            fontFamily: 'Playfair Display',
            color: '#2B2B2B'
          }}>
            Review Your Order
          </h1>
          <p style={{ 
            fontSize: 'clamp(15px, 3vw, 18px)',
            color: '#5A3825', 
            maxWidth: '700px',
            lineHeight: 1.6
          }}>
            Please review your custom cake details before confirming your order. Emily will contact you within 24 hours to discuss final details and pricing.
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card style={{ 
            padding: 'clamp(20px, 5vw, 32px)',
            border: '2px solid rgba(196, 69, 105, 0.15)',
            marginBottom: '24px'
          }}>
            {/* Occasion & Design */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Cake size={20} color="#C44569" />
                  <h3 style={{ 
                    fontFamily: 'Poppins', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    color: '#2B2B2B'
                  }}>
                    Occasion
                  </h3>
                </div>
                <div style={{
                  padding: '16px',
                  background: 'rgba(196, 69, 105, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(196, 69, 105, 0.1)'
                }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '32px' }}>{occasionObj?.icon}</span>
                    <span style={{ 
                      fontFamily: 'Poppins', 
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#2B2B2B'
                    }}>
                      {occasionObj?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={20} color="#C44569" />
                  <h3 style={{ 
                    fontFamily: 'Poppins', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    color: '#2B2B2B'
                  }}>
                    Design Style
                  </h3>
                </div>
                <div style={{
                  padding: '16px',
                  background: 'rgba(196, 69, 105, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(196, 69, 105, 0.1)'
                }}>
                  <p style={{ 
                    fontFamily: 'Poppins', 
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#2B2B2B',
                    marginBottom: '4px'
                  }}>
                    {designObj?.name}
                  </p>
                  <p style={{ 
                    fontSize: '14px',
                    color: '#5A3825',
                    opacity: 0.8
                  }}>
                    {designObj?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Cake Layers */}
            <div className="mb-8">
              <h3 style={{ 
                fontFamily: 'Poppins', 
                fontSize: '18px', 
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '16px'
              }}>
                Cake Layers ({orderData.layers.length} {orderData.layers.length === 1 ? 'Layer' : 'Layers'})
              </h3>
              <div className="space-y-3">
                {orderData.layers.map((layer, index) => {
                  const flavorObj = flavors.find(f => f.id === layer.flavor);
                  const layerFillings = layer.fillings
                    .map(fid => fillings.find(f => f.id === fid)?.name)
                    .filter(Boolean);

                  return (
                    <div
                      key={layer.id}
                      style={{
                        padding: '16px',
                        background: 'rgba(90, 56, 37, 0.04)',
                        borderRadius: '12px',
                        border: '1px solid rgba(90, 56, 37, 0.1)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p style={{ 
                          fontFamily: 'Poppins', 
                          fontWeight: 600, 
                          fontSize: '15px', 
                          color: '#C44569' 
                        }}>
                          Layer {index + 1}
                        </p>
                        <p style={{ 
                          fontFamily: 'Poppins', 
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#2B2B2B'
                        }}>
                          {flavorObj?.name}
                        </p>
                      </div>
                      {layerFillings.length > 0 && (
                        <p style={{
                          fontSize: '14px',
                          color: '#5A3825',
                          marginBottom: layer.notes ? '8px' : 0
                        }}>
                          <strong>Fillings:</strong> {layerFillings.join(', ')}
                        </p>
                      )}
                      {layer.notes && (
                        <p style={{
                          fontSize: '13px',
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

            {/* Contact & Event Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 style={{ 
                  fontFamily: 'Poppins', 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '16px'
                }}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={18} color="#C44569" />
                    <span style={{ fontSize: '15px', color: '#2B2B2B' }}>{orderData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} color="#C44569" />
                    <span style={{ fontSize: '15px', color: '#2B2B2B' }}>{orderData.email}</span>
                  </div>
                  {orderData.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={18} color="#C44569" />
                      <span style={{ fontSize: '15px', color: '#2B2B2B' }}>{orderData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ 
                  fontFamily: 'Poppins', 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '16px'
                }}>
                  Event Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} color="#C44569" />
                    <span style={{ fontSize: '15px', color: '#2B2B2B' }}>
                      {new Date(orderData.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cake size={18} color="#C44569" />
                    <span style={{ fontSize: '15px', color: '#2B2B2B' }}>
                      {orderData.servings} servings
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Messages */}
            {(orderData.message || orderData.notes) && (
              <div className="mb-8">
                <h3 style={{ 
                  fontFamily: 'Poppins', 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '16px'
                }}>
                  Additional Details
                </h3>
                {orderData.message && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} color="#C44569" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#5A3825' }}>
                        Message for Cake
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#2B2B2B',
                      padding: '12px',
                      background: 'rgba(196, 69, 105, 0.05)',
                      borderRadius: '8px'
                    }}>
                      {orderData.message}
                    </p>
                  </div>
                )}
                {orderData.notes && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} color="#C44569" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#5A3825' }}>
                        Special Notes
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#2B2B2B',
                      padding: '12px',
                      background: 'rgba(196, 69, 105, 0.05)',
                      borderRadius: '8px'
                    }}>
                      {orderData.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Inspiration Images */}
            {orderData.imageCount > 0 && (
              <div className="mb-8">
                <h3 style={{ 
                  fontFamily: 'Poppins', 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '16px'
                }}>
                  Inspiration Images ({orderData.imageCount})
                </h3>
                <p style={{ fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>
                  {orderData.imageCount} image{orderData.imageCount !== 1 ? 's' : ''} uploaded
                </p>
              </div>
            )}

            {/* Price Summary */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.08) 0%, rgba(196, 69, 105, 0.04) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(196, 69, 105, 0.2)'
            }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ 
                  fontFamily: 'Poppins',
                  fontWeight: 600, 
                  fontSize: '18px',
                  color: '#2B2B2B'
                }}>
                  Estimated Starting Price:
                </span>
                <span style={{ 
                  fontFamily: 'Poppins', 
                  fontWeight: 700, 
                  fontSize: '32px', 
                  color: '#C44569' 
                }}>
                  ${totalPrice}+
                </span>
              </div>
              <p style={{ 
                fontSize: '13px', 
                color: '#5A3825',
                opacity: 0.8,
                marginTop: '8px' 
              }}>
                Final price will be confirmed by Emily based on design complexity and customization details. This is an estimated starting price.
              </p>
            </div>
          </Card>

          {/* Confirm Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleBackToBuilder}
              disabled={isSubmitting}
              style={{
                flex: 1,
                minHeight: '56px',
                background: 'white',
                color: '#C44569',
                border: '2px solid #C44569',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '16px',
                borderRadius: '12px',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              <ArrowLeft size={20} />
              Edit Order
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              style={{
                flex: 2,
                minHeight: '56px',
                background: isSubmitting ? '#888' : '#C44569',
                color: 'white',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(196, 69, 105, 0.3)'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Order'}
              {!isSubmitting && <Check size={20} strokeWidth={2.5} />}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
