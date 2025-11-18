import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

interface WizardNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  nextLabel?: string;
  backLabel?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  className?: string;
  variant?: 'default' | 'split';
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onNext,
  onBack,
  canGoNext = true,
  canGoPrev = true,
  nextLabel = 'Continue',
  backLabel = 'Back',
  isSubmitting = false,
  submitLabel = 'Complete Order',
  className,
  variant = 'default'
}) => {
  const isFirstStep = !onBack;
  const isLastStep = !onNext || isSubmitting;

  if (variant === 'split') {
    return (
      <div className={cn(
        "flex items-center justify-between pt-6 border-t",
        className
      )}>
        <div>
          {!isFirstStep && onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={!canGoPrev || isSubmitting}
              className="min-w-[100px]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Button>
          )}
        </div>

        <div>
          {isLastStep ? (
            <Button
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {submitLabel}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          ) : onNext ? (
            <Button
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
              className="min-w-[100px]"
            >
              {nextLabel}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  // Default stacked layout
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3 pt-6", className)}>
      {!isFirstStep && onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoPrev || isSubmitting}
          className="flex-1 order-2 sm:order-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      )}

      {isLastStep ? (
        <Button
          onClick={onNext}
          disabled={!canGoNext || isSubmitting}
          className="flex-1 order-1 sm:order-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      ) : onNext ? (
        <Button
          onClick={onNext}
          disabled={!canGoNext || isSubmitting}
          className="flex-1 order-1 sm:order-2"
        >
          {nextLabel}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
};

// Keyboard navigation hook
export const useWizardKeyboard = (
  onNext?: () => void,
  onBack?: () => void,
  canGoNext?: boolean,
  canGoPrev?: boolean
) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Enter key for next/continue
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (canGoNext && onNext) {
          onNext();
        }
      }

      // Ctrl/Cmd + Enter or Shift + Enter for back
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        if (canGoPrev && onBack) {
          onBack();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onBack, canGoNext, canGoPrev]);
};
