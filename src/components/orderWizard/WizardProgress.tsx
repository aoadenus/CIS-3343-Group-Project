import React from 'react';
import { Progress } from '../ui/progress';
import { cn } from '../ui/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  className
}) => {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { id: 1, title: 'Customer', description: 'Select customer', isActive: currentStep === 1, isCompleted: currentStep > 1 },
    { id: 2, title: 'Product', description: 'Choose cake', isActive: currentStep === 2, isCompleted: currentStep > 2 },
    { id: 3, title: 'Customize', description: 'Size & details', isActive: currentStep === 3, isCompleted: currentStep > 3 },
    { id: 4, title: 'Pricing', description: 'Review costs', isActive: currentStep === 4, isCompleted: currentStep > 4 },
    { id: 5, title: 'Schedule', description: 'Pickup date', isActive: currentStep === 5, isCompleted: currentStep > 5 },
    { id: 6, title: 'Review', description: 'Confirm order', isActive: currentStep === 6, isCompleted: currentStep > 6 },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="font-medium text-primary">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step indicators */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border-2 transition-all",
                  step.isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.isActive
                    ? "bg-background border-primary text-primary"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {step.isCompleted ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-xs font-medium",
                  step.isActive || step.isCompleted ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground hidden lg:block">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-12 mx-4 transition-colors",
                  step.isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile step title only */}
      <div className="md:hidden text-center">
        <h2 className="text-lg font-semibold text-primary">
          {steps[currentStep - 1]?.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
};

// Simple check icon component
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);
