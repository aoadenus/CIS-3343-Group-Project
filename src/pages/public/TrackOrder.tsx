import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle, Cake, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/card';

const CYCLE_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const UPDATE_INTERVAL_MS = 10 * 1000; // Update UI every 10 seconds

const TRACKING_STAGES = [
  { id: 1, name: 'Order Placed', icon: Package, color: '#C44569' },
  { id: 2, name: 'Design Approved', icon: CheckCircle, color: '#C44569' },
  { id: 3, name: 'Pending Baking', icon: Clock, color: '#5A3825' },
  { id: 4, name: 'Baking in Progress', icon: Cake, color: '#C44569' },
  { id: 5, name: 'Cooling', icon: Clock, color: '#5A3825' },
  { id: 6, name: 'Ready for Decorating', icon: CheckCircle, color: '#C44569' },
  { id: 7, name: 'Decorating', icon: Sparkles, color: '#C44569' },
  { id: 8, name: 'Decorated Complete', icon: CheckCircle, color: '#C44569' },
  { id: 9, name: 'Quality Check', icon: CheckCircle, color: '#5A3825' },
  { id: 10, name: 'Ready for Pickup', icon: Package, color: '#4CAF50' },
  { id: 11, name: 'Picked Up', icon: CheckCircle, color: '#4CAF50' },
];

export function TrackOrder() {
  const [currentStage, setCurrentStage] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const updateStage = () => {
      const elapsed = Date.now() - startTime;
      // Calculate position within current 2-minute cycle (0 to 1)
      const cyclePosition = (elapsed % CYCLE_INTERVAL_MS) / CYCLE_INTERVAL_MS;
      // Convert to stage index (0 to 10)
      const stageIndex = Math.floor(cyclePosition * TRACKING_STAGES.length);
      setCurrentStage(stageIndex);
    };

    // Initial update
    updateStage();

    // Update every 10 seconds
    const interval = setInterval(updateStage, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [startTime]);

  const progress = ((currentStage + 1) / TRACKING_STAGES.length) * 100;
  const currentStageInfo = TRACKING_STAGES[currentStage];
  const Icon = currentStageInfo.icon;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-12" style={{ background: 'linear-gradient(to bottom, #FFF5F7 0%, #FFFFFF 100%)' }}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 700,
            color: '#C44569',
            marginBottom: '16px'
          }}>
            Track Your Order
          </h1>
          <p style={{ 
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '18px',
            color: '#5A3825',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Watch your custom cake come to life
          </p>
        </motion.div>

        {/* Demo Notice */}
        <Card className="mb-8 p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.05) 100%)' }}>
          <p style={{ 
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#5A3825',
            margin: 0
          }}>
            ✨ Demo Mode: This tracking page auto-cycles through all 11 stages every 2 minutes
          </p>
        </Card>

        {/* Current Status Card */}
        <Card className="mb-8 p-8">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: currentStageInfo.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon size={40} color="#FFF" />
            </motion.div>
          </div>
          
          <h2 style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontSize: '28px',
            fontWeight: 600,
            color: currentStageInfo.color,
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {currentStageInfo.name}
          </h2>
          
          <p style={{ 
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '16px',
            color: '#5A3825',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Stage {currentStage + 1} of {TRACKING_STAGES.length}
          </p>

          {/* Progress Bar */}
          <div style={{ 
            width: '100%',
            height: '8px',
            background: '#F0F0F0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #C44569 0%, #E056A0 100%)',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <p style={{ 
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#999',
            textAlign: 'center'
          }}>
            {progress.toFixed(0)}% Complete
          </p>
        </Card>

        {/* Status Timeline */}
        <Card className="p-6">
          <h3 style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            color: '#5A3825',
            marginBottom: '24px'
          }}>
            Order Timeline
          </h3>
          
          <div className="space-y-4">
            {TRACKING_STAGES.map((stage, index) => {
              const isComplete = index < currentStage;
              const isCurrent = index === currentStage;
              const StageIcon = stage.icon;

              return (
                <motion.div
                  key={stage.id}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isCurrent ? stage.color : isComplete ? '#4CAF50' : '#F0F0F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease'
                  }}>
                    <StageIcon 
                      size={20} 
                      color={isCurrent || isComplete ? '#FFF' : '#999'} 
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 style={{ 
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '16px',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? stage.color : isComplete ? '#4CAF50' : '#999',
                      marginBottom: '4px'
                    }}>
                      {stage.name}
                    </h4>
                    
                    {isCurrent && (
                      <p style={{ 
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px',
                        color: '#999'
                      }}>
                        In progress...
                      </p>
                    )}
                    
                    {isComplete && (
                      <p style={{ 
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px',
                        color: '#4CAF50'
                      }}>
                        ✓ Complete
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Order Details (Demo) */}
        <Card className="mt-8 p-6">
          <h3 style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            color: '#5A3825',
            marginBottom: '16px'
          }}>
            Order Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                color: '#999',
                marginBottom: '4px'
              }}>
                Order Number
              </p>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#5A3825'
              }}>
                #DEMO-001
              </p>
            </div>
            
            <div>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                color: '#999',
                marginBottom: '4px'
              }}>
                Estimated Pickup
              </p>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#5A3825'
              }}>
                {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                color: '#999',
                marginBottom: '4px'
              }}>
                Occasion
              </p>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#5A3825'
              }}>
                Demo Celebration
              </p>
            </div>
            
            <div>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                color: '#999',
                marginBottom: '4px'
              }}>
                Servings
              </p>
              <p style={{ 
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#5A3825'
              }}>
                50 people
              </p>
            </div>
          </div>
        </Card>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p style={{ 
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#999'
          }}>
            Questions? Contact us at <span style={{ color: '#C44569', fontWeight: 600 }}>info@emilybakescakes.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
