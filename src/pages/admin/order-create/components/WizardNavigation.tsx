import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  canGoNext: boolean;
  isLastStep: boolean;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSaveDraft,
  canGoNext,
  isLastStep,
  onSubmit,
  isSubmitting = false
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;

  return (
    <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E0E0E0' }}>
      <div className="flex items-center justify-between gap-4">
        {/* Back Button */}
        <Button
          onClick={onBack}
          disabled={isFirstStep}
          variant="outline"
          style={{
            borderColor: isFirstStep ? '#E0E0E0' : '#C44569',
            color: isFirstStep ? '#999' : '#C44569',
            opacity: isFirstStep ? 0.5 : 1,
            cursor: isFirstStep ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronLeft size={18} className="mr-2" />
          Back
        </Button>

        {/* Save Draft Button */}
        <Button
          onClick={onSaveDraft}
          variant="outline"
          style={{
            borderColor: '#5A3825',
            color: '#5A3825'
          }}
        >
          <Save size={18} className="mr-2" />
          Save Draft
        </Button>

        {/* Next/Submit Button */}
        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={!canGoNext || isSubmitting}
            style={{
              background: !canGoNext || isSubmitting ? '#CCC' : '#C44569',
              color: '#FFFFFF',
              padding: '12px 24px',
              fontWeight: 600,
              cursor: !canGoNext || isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
            <ChevronRight size={18} className="ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            style={{
              background: !canGoNext ? '#CCC' : '#C44569',
              color: '#FFFFFF',
              padding: '12px 24px',
              fontWeight: 600,
              cursor: !canGoNext ? 'not-allowed' : 'pointer'
            }}
          >
            Next Step
            <ChevronRight size={18} className="ml-2" />
          </Button>
        )}
      </div>

      {/* Helper Text */}
      {!canGoNext && !isLastStep && (
        <p
          className="text-center mt-4"
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '13px',
            color: '#C44569'
          }}
        >
          Please complete all required fields to continue
        </p>
      )}
    </div>
  );
}
