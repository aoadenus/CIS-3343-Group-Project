import { useState } from 'react';
import { WizardProvider, useWizard } from './WizardContext';
import { ProgressStepper } from './components/ProgressStepper';
import { WizardNavigation } from './components/WizardNavigation';
import { RushBanner } from './components/RushBanner';
import { useToast } from '../../../components/ToastContext';

// Import steps
import { Step1Customer, validateStep1 } from './steps/Step1Customer';
import { Step2CakeType, validateStep2 } from './steps/Step2CakeType';
import { Step3Layers, validateStep3 } from './steps/Step3Layers';
import { Step4SizeAndTiers, validateStep4 } from './steps/Step4SizeAndTiers';
import { Step5Design, validateStep5 } from './steps/Step5Design';
import { Step6Inspiration, validateStep6 } from './steps/Step6Inspiration';
import { Step7Pricing, validateStep7 } from './steps/Step7Pricing';
import { Step8Pickup, validateStep8 } from './steps/Step8Pickup';
import { Step9Review, validateStep9 } from './steps/Step9Review';

interface WizardContainerProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const WIZARD_STEPS = [
  { number: 1, title: 'Customer', subtitle: 'Select or create', component: Step1Customer, validate: validateStep1 },
  { number: 2, title: 'Cake Type', subtitle: 'Standard or custom', component: Step2CakeType, validate: validateStep2 },
  { number: 3, title: 'Layers', subtitle: 'Build custom cake', component: Step3Layers, validate: validateStep3 },
  { number: 4, title: 'Size', subtitle: 'Choose servings', component: Step4SizeAndTiers, validate: validateStep4 },
  { number: 5, title: 'Design', subtitle: 'Colors & decorations', component: Step5Design, validate: validateStep5 },
  { number: 6, title: 'Inspiration', subtitle: 'Upload images', component: Step6Inspiration, validate: validateStep6 },
  { number: 7, title: 'Pricing', subtitle: 'Payment details', component: Step7Pricing, validate: validateStep7 },
  { number: 8, title: 'Pickup', subtitle: 'Date & notes', component: Step8Pickup, validate: validateStep8 },
  { number: 9, title: 'Review', subtitle: 'Final check', component: Step9Review, validate: validateStep9 }
];

function WizardContent({ onBack, onNavigate }: WizardContainerProps) {
  const { formData, currentStep, setCurrentStep, saveDraft, resetForm, clearDraft, updateFormData } = useWizard();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current step configuration
  const currentStepConfig = WIZARD_STEPS[currentStep];
  const CurrentStepComponent = currentStepConfig.component;

  // Check if we can proceed to next step
  const canGoNext = currentStepConfig.validate(formData);

  const handleNext = () => {
    if (!canGoNext) {
      // Find first invalid field in the current step and focus it
      const container = document.querySelector('.my-8');
      const firstError = container?.querySelector<HTMLElement>('.validation-error, [aria-invalid="true"]');
      if (firstError) {
        try {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstError as HTMLElement).focus();
          firstError.classList.add('animate-pulse');
          setTimeout(() => firstError.classList.remove('animate-pulse'), 1500);
        } catch (e) {
          // ignore focus errors
        }
      }
      showToast('error', 'Please fix errors before continuing');
      return;
    }

    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      saveDraft();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
    showToast('success', 'Draft saved successfully!');
  };

  const handleSubmit = async () => {
    if (!canGoNext) {
      const container = document.querySelector('.my-8');
      const firstError = container?.querySelector<HTMLElement>('.validation-error, [aria-invalid="true"]');
      if (firstError) {
        try {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstError as HTMLElement).focus();
          firstError.classList.add('animate-pulse');
          setTimeout(() => firstError.classList.remove('animate-pulse'), 1500);
        } catch (e) {}
      }
      showToast('error', 'Please fix errors before continuing');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        name: formData.customer!.name,
        email: formData.customer!.email,
        phone: formData.customer!.phone || '',
        servings: parseInt(formData.servings),
        date: formData.eventDate,
        message: formData.message,
        notes: formData.customerNotes,
        layers: formData.cakeType === 'custom' ? formData.layers : [],
        cakeType: formData.cakeType,
        standardCakeId: formData.cakeType === 'standard' ? formData.standardCakeId : null,
        cakeSize: formData.cakeSize,
        icingColors: formData.icingColors,
        decorations: formData.decorations,
        isRushOrder: formData.isRushOrder,
        managerApproval: formData.isRushOrder ? formData.managerApproval : null,
        adminNotes: formData.adminNotes,
        status: formData.status,
        priority: formData.priority,
        depositAmount: formData.depositAmount
          ? parseFloat(formData.depositAmount) * 100
          : Math.ceil(
              (formData.cakeType === 'standard'
                ? 0 // Calculate properly
                : 0) * 0.5
            ),
        paymentStatus: formData.paymentStatus,
        totalAmount: 0, // Calculate based on size
        createdBy: 'admin',
        customerId: formData.customer!.id
      };

      const response = await fetch('/api/orders/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const result = await response.json();
      const order = result.order || result;

      showToast('success', `Order #${order.id} created successfully!`);
      clearDraft();
      resetForm();

      if (onBack) {
        setTimeout(() => onBack(), 1500);
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      showToast('error', error.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRushOrder = () => {
    updateFormData({ isRushOrder: false, rushJustification: '' });
    showToast('success', 'Rush order status removed');
  };

  return (
    <div className="h-full overflow-auto p-6" style={{ background: '#F8EBD7' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '32px',
              fontWeight: 700,
              color: '#2B2B2B',
              marginBottom: '8px'
            }}
          >
            Create New Order
          </h1>
          <p
            style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '15px',
              color: '#666'
            }}
          >
            Follow the steps to create a custom or standard cake order
          </p>
        </div>

        {/* Rush Order Banner - Sticky across all steps */}
        {formData.isRushOrder && formData.rushJustification && (
          <RushBanner
            justification={formData.rushJustification}
            onRemove={handleRemoveRushOrder}
          />
        )}

        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} steps={WIZARD_STEPS} />

        {/* Current Step Content */}
        <div className="my-8">
          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={WIZARD_STEPS.length}
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          canGoNext={canGoNext}
          isLastStep={currentStep === WIZARD_STEPS.length - 1}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export function WizardContainer(props: WizardContainerProps) {
  return (
    <WizardProvider>
      <WizardContent {...props} />
    </WizardProvider>
  );
}
