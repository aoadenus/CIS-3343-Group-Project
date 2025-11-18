import React, { useEffect, useState } from 'react';
import {
  X,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useToast } from '../ToastContext';

import { useOrderWizard } from '../../stores/orderWizardStore';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { CustomerSelectionStep } from './CustomerSelectionStep';
import { ProductSelectionStep } from './ProductSelectionStep';
import { CustomizationStep } from './CustomizationStep';
import { PricingStep } from './PricingStep';
import { SchedulingStep } from './SchedulingStep';
import { ReviewStep } from './ReviewStep';

import { useWizardKeyboard } from './WizardNavigation';

interface OrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (orderId: string) => void;
}

export const OrderWizardDialog: React.FC<OrderWizardProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { showToast } = useToast();
  const {
    currentStep,
    canGoNext,
    canGoPrev,
    isStepValid,
    updateStepCompletion,
    nextStep,
    prevStep,
    data,
    isSubmitting,
    resetWizard,
  } = useOrderWizard();

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Keyboard navigation
  useWizardKeyboard(handleNext, handleBack, canGoNext, canGoPrev);

  // Track step changes for completion
  useEffect(() => {
    const stepCompleted = isStepValid(currentStep);
    updateStepCompletion(currentStep, stepCompleted);
  }, [currentStep, data, isStepValid, updateStepCompletion]);

  function handleNext() {
    if (canGoNext) {
      nextStep();
      setIsDirty(true);
    }
  }

  function handleBack() {
    if (canGoPrev) {
      prevStep();
    }
  }

  function handleClose() {
    if (isDirty) {
      setShowExitDialog(true);
    } else {
      handleConfirmClose();
    }
  }

  function handleConfirmClose() {
    resetWizard();
    setIsDirty(false);
    onClose();
  }

  function handleComplete() {
    // Final submission logic here
    console.log('Completing order:', data);
    showToast('success', 'Order created successfully!');

    const mockOrderId = 'ORD-' + Date.now();
    onComplete?.(mockOrderId);
    handleConfirmClose();
  }

  const renderCurrentStep = () => {
    const stepProps = { className: "space-y-6" };

    switch (currentStep) {
      case 1:
        return <CustomerSelectionStep {...stepProps} />;
      case 2:
        return <ProductSelectionStep {...stepProps} />;
      case 3:
        return <CustomizationStep {...stepProps} />;
      case 4:
        return <PricingStep {...stepProps} />;
      case 5:
        return <SchedulingStep {...stepProps} />;
      case 6:
        return <ReviewStep {...stepProps} />;
      default:
        return <CustomerSelectionStep {...stepProps} />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => handleClose()}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          aria-labelledby="wizard-title"
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle id="wizard-title" className="text-2xl font-bold text-primary">
                Create New Order
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
                aria-label="Close wizard"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <WizardProgress currentStep={currentStep} totalSteps={6} />
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="pb-6">
              {renderCurrentStep()}
            </div>
          </div>

          <WizardNavigation
            onNext={currentStep === 6 ? handleComplete : handleNext}
            onBack={currentStep > 1 ? handleBack : undefined}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            nextLabel={currentStep === 6 ? "Complete Order" : "Continue"}
            submitLabel="Creating Order..."
            isSubmitting={isSubmitting}
            variant="split"
            className="border-t bg-muted/50 -mx-6 -mb-6 px-6 py-4"
          />

          {/* Accessibility hints */}
          <div className="sr-only" aria-live="polite">
            Step {currentStep} of 6: {
              currentStep === 1 ? 'Customer selection' :
              currentStep === 2 ? 'Product selection' :
              currentStep === 3 ? 'Customization' :
              currentStep === 4 ? 'Pricing review' :
              currentStep === 5 ? 'Scheduling' :
              'Order review'
            }
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit confirmation dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Exit Order Wizard?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in your order. Are you sure you want to exit?
              All progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-destructive hover:bg-destructive/90"
            >
              Exit Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
