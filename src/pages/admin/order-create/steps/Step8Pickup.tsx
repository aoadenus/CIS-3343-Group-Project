import { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Checkbox } from '../../../../components/ui/checkbox';
import { useWizard } from '../WizardContext';
import { isRushOrder } from '../../../../data/cakeOptions';
import { isDateAtLeastDaysAway, daysUntil } from '../../../../utils/validation';
import { useToast } from '../../../../components/ToastContext';

export function Step8Pickup() {
  const { formData, updateFormData } = useWizard();
  const [isRush, setIsRush] = useState(false);
  const [eventDateError, setEventDateError] = useState<string | null>(null);
  const [showRequestRushSuggestion, setShowRequestRushSuggestion] = useState(false);
  const { showToast } = useToast();

  // Rush order detection
  useEffect(() => {
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const rushStatus = isRushOrder(eventDate);
      setIsRush(rushStatus);
      updateFormData({
        isRushOrder: rushStatus,
        managerApproval: false // Reset approval when date changes
      });

      // Validate at least 2 days away
      if (!isDateAtLeastDaysAway(formData.eventDate, 2)) {
        setEventDateError('Must be 2 days from today');
        setShowRequestRushSuggestion(true);
      } else {
        setEventDateError(null);
        setShowRequestRushSuggestion(false);
      }
    } else {
      setIsRush(false);
      updateFormData({ isRushOrder: false, managerApproval: false });
      setEventDateError(null);
      setShowRequestRushSuggestion(false);
    }
  }, [formData.eventDate]);

  return (
    <div className="space-y-6">
      <div>
        <h2
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '24px',
            fontWeight: 600,
            color: '#2B2B2B',
            marginBottom: '8px'
          }}
        >
          Pickup Details
        </h2>
        <p
          style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Set the event date, servings, and any special notes
        </p>
      </div>

      {/* Rush Order Warning */}
      {isRush && (
        <Card
          className="p-4"
          style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            border: 'none'
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={24} color="white" />
            <div className="flex-1">
              <h3
                style={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '16px',
                  marginBottom: '4px'
                }}
              >
                ⚠️ Rush Order Detected
              </h3>
              <p style={{ color: 'white', fontSize: '14px', marginBottom: '12px' }}>
                This order is due in less than 2 days. Manager approval is required to proceed.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.managerApproval}
                  onCheckedChange={(checked) =>
                    updateFormData({ managerApproval: checked as boolean })
                  }
                  style={{ borderColor: 'white' }}
                />
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
                  Manager Approval Granted
                </span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Event Information */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
                color: '#2B2B2B'
              }}
            >
              Event/Pickup Date <span style={{ color: '#C44569' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => updateFormData({ eventDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                aria-invalid={!!eventDateError}
                aria-describedby={eventDateError ? 'event-date-error' : undefined}
                className={eventDateError ? 'validation-error' : undefined}
                style={{
                  borderColor: !formData.eventDate ? '#C44569' : eventDateError ? '#DC2626' : '#E0E0E0',
                  borderWidth: !formData.eventDate ? '2px' : '1px'
                }}
              />

              {eventDateError ? (
                <p id="event-date-error" role="alert" style={{ fontSize: '12px', color: '#DC2626', marginTop: '8px' }}>
                  {eventDateError}
                </p>
              ) : null}

              {showRequestRushSuggestion && (
                <div style={{ marginTop: '8px' }}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.isRushOrder || false}
                      onCheckedChange={(checked) => {
                        updateFormData({ isRushOrder: checked as boolean });
                        if (checked) showToast('info', 'Rush order requested — provide justification in Customer step');
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#2B2B2B' }}>
                      Request Rush Order (less than 2 days)
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
                color: '#2B2B2B'
              }}
            >
              Servings <span style={{ color: '#C44569' }}>*</span>
            </label>
            <Input
              type="number"
              value={formData.servings}
              onChange={(e) => updateFormData({ servings: e.target.value })}
              placeholder="e.g., 20"
              min="1"
              style={{
                borderColor: !formData.servings ? '#C44569' : '#E0E0E0',
                borderWidth: !formData.servings ? '2px' : '1px'
              }}
            />
          </div>
        </div>
      </Card>

      {/* Customer Notes */}
      <Card className="p-6">
        <label
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            display: 'block',
            marginBottom: '8px',
            color: '#2B2B2B'
          }}
        >
          Customer Notes (optional)
        </label>
        <Textarea
          value={formData.customerNotes}
          onChange={(e) => updateFormData({ customerNotes: e.target.value })}
          placeholder="Any special requests, dietary restrictions, or delivery instructions..."
          rows={4}
          maxLength={500}
        />
        <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          Maximum 500 characters
        </p>
      </Card>
    </div>
  );
}

// Validation function
export function validateStep8(formData: any): boolean {
  if (!formData.eventDate || !formData.servings) {
    return false;
  }

  // Check rush order manager approval
  if (formData.isRushOrder && !formData.managerApproval) {
    return false;
  }

  return true;
}
