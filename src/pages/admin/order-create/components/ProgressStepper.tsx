import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  subtitle: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: '#10B981',
          border: '#10B981',
          text: '#FFFFFF'
        };
      case 'current':
        return {
          bg: '#C44569',
          border: '#C44569',
          text: '#FFFFFF'
        };
      default:
        return {
          bg: '#FFFFFF',
          border: '#E0E0E0',
          text: '#999999'
        };
    }
  };

  return (
    <div className="mb-8">
      {/* Desktop: Horizontal Stepper */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const colors = getStepColor(status);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300"
                    style={{
                      background: colors.bg,
                      border: `2px solid ${colors.border}`,
                      color: colors.text
                    }}
                  >
                    {status === 'completed' ? (
                      <Check size={24} />
                    ) : (
                      <span style={{ fontFamily: 'Poppins, sans-serif' }}>{step.number}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '13px',
                        fontWeight: status === 'current' ? 600 : 500,
                        color: status === 'current' ? '#C44569' : '#2B2B2B'
                      }}
                    >
                      {step.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '11px',
                        color: '#999'
                      }}
                    >
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className="flex-1 h-1 mx-4"
                    style={{
                      background: index < currentStep ? '#10B981' : '#E0E0E0',
                      transition: 'background 0.3s ease'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet: Compact Progress Bar */}
      <div className="lg:hidden">
        <div className="mb-4">
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#2B2B2B',
              marginBottom: '4px'
            }}
          >
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
          <p
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '12px',
              color: '#666'
            }}
          >
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              background: '#C44569'
            }}
          />
        </div>

        {/* Step Count */}
        <div className="mt-2 flex justify-between items-center">
          <span style={{ fontSize: '11px', color: '#999' }}>
            {currentStep + 1} / {steps.length} completed
          </span>
          <span style={{ fontSize: '11px', color: '#C44569', fontWeight: 600 }}>
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
