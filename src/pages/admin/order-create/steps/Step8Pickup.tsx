import { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Clock, Info } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { FormField } from '../../../../components/ui/FormField';
import { RushOrderBanner, BusinessRuleBanner } from '../../../../components/ui/BusinessRuleBanner';
import { useWizard } from '../WizardContext';
import { 
  isDateAtLeastDaysAway, 
  daysUntil, 
  isPickupTimeValid,
  isPickupInPast,
  formatHoursUntil,
  getRushOrderStatus
} from '../../../../utils/validation';
import { useToast } from '../../../../components/ToastContext';

export function Step8Pickup() {
  const { formData, updateFormData } = useWizard();
  const [pickupTime, setPickupTime] = useState(formData.pickupTime || '');
  const [eventDateError, setEventDateError] = useState<string | null>(null);
  const [pickupTimeError, setPickupTimeError] = useState<string | null>(null);
  const [timeValidation, setTimeValidation] = useState<{ valid: boolean; error?: string; hoursUntil?: number } | null>(null);
  const { showToast } = useToast();

  // Validate event date - comprehensive validation
  useEffect(() => {
    if (!formData.eventDate) {
      setEventDateError(null);
      updateFormData({ isRushOrder: false, managerApproval: false });
      return;
    }

    // Check if date is in the past
    if (isPickupInPast(formData.eventDate)) {
      setEventDateError('Event date cannot be in the past');
      updateFormData({ isRushOrder: false, managerApproval: false });
      return;
    }

    // Get comprehensive rush order status
    const rushStatus = getRushOrderStatus(formData.eventDate);
    
    if (!isDateAtLeastDaysAway(formData.eventDate, 2)) {
      setEventDateError('Orders require 2-day minimum advance notice');
    } else {
      setEventDateError(null);
    }

    // Update form data with rush order status
    updateFormData({
      isRushOrder: rushStatus.isRush,
      managerApproval: rushStatus.isRush ? formData.managerApproval : false
    });

  }, [formData.eventDate]);

  // Validate pickup time with 4-hour buffer rule
  useEffect(() => {
    if (!formData.eventDate || !pickupTime) {
      setPickupTimeError(null);
      setTimeValidation(null);
      return;
    }

    const validation = isPickupTimeValid(formData.eventDate, pickupTime);
    setTimeValidation(validation);

    if (!validation.valid) {
      setPickupTimeError(validation.error || 'Invalid pickup time');
    } else {
      setPickupTimeError(null);
      
      // Show success message for good buffer
      if (validation.hoursUntil && validation.hoursUntil >= 24) {
        showToast('success', `Good planning! ${formatHoursUntil(validation.hoursUntil)} until pickup`, undefined, 2000);
      }
    }

    // Update form data with pickup time
    updateFormData({ pickupTime });

  }, [formData.eventDate, pickupTime]);

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
          Set the event date, pickup time, and special notes
        </p>
      </div>

      {/* Business Rules Banner */}
      <BusinessRuleBanner
        type="info"
        title="📋 Pickup Requirements"
        message={
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>2-Day Minimum:</strong> Orders must be placed at least 2 days before event</li>
            <li><strong>4-Hour Buffer:</strong> Same-day pickups require 4-hour advance notice</li>
            <li><strong>Rush Orders:</strong> Orders under 2 days require manager approval</li>
          </ul>
        }
      />

      {/* Rush Order Warning - New Component */}
      {formData.isRushOrder && (
        <RushOrderBanner
          daysUntil={daysUntil(formData.eventDate)}
          hoursUntil={timeValidation?.hoursUntil}
          requiresApproval={true}
          approved={formData.managerApproval}
          onApprovalChange={(checked) => updateFormData({ managerApproval: checked })}
        />
      )}

      {/* Event Date */}
      <FormField
        label="Event Date"
        htmlFor="eventDate"
        required
        error={eventDateError || undefined}
        helpText="When is the cake needed? We require 2 days advance notice for standard orders."
      >
        <Input
          id="eventDate"
          type="date"
          value={formData.eventDate}
          onChange={(e) => updateFormData({ eventDate: e.target.value })}
          min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          aria-invalid={!!eventDateError}
          aria-describedby={eventDateError ? 'eventDate-error' : undefined}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: eventDateError ? '2px solid #DC2626' : '1px solid #D1D5DB',
            fontSize: '14px',
            fontFamily: 'Open Sans, sans-serif',
            transition: 'all 0.2s ease'
          }}
        />
      </FormField>

      {/* Pickup Time - NEW with 4-hour buffer validation */}
      <FormField
        label="Pickup Time"
        htmlFor="pickupTime"
        required
        error={pickupTimeError || undefined}
        success={timeValidation?.valid && timeValidation.hoursUntil ? 
          `${formatHoursUntil(timeValidation.hoursUntil)} until pickup` : undefined}
        helpText="What time will the customer pick up? Must be at least 4 hours from now for same-day orders."
      >
        <div style={{ position: 'relative' }}>
          <Clock
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
              pointerEvents: 'none'
            }}
          />
          <Input
            id="pickupTime"
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            aria-invalid={!!pickupTimeError}
            aria-describedby={pickupTimeError ? 'pickupTime-error' : undefined}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: '6px',
              border: pickupTimeError ? '2px solid #DC2626' : '1px solid #D1D5DB',
              fontSize: '14px',
              fontFamily: 'Open Sans, sans-serif',
              transition: 'all 0.2s ease'
            }}
          />
        </div>
      </FormField>

      {/* Servings */}
      <FormField
        label="Number of Servings"
        htmlFor="servings"
        hint="(optional)"
        helpText="Approximately how many people will this cake serve?"
      >
        <Input
          id="servings"
          type="number"
          min="1"
          max="500"
          value={formData.servings}
          onChange={(e) => updateFormData({ servings: e.target.value })}
          placeholder="e.g., 12, 24, 50"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            fontSize: '14px',
            fontFamily: 'Open Sans, sans-serif'
          }}
        />
      </FormField>

      {/* Customer Notes */}
      <FormField
        label="Customer Notes & Special Instructions"
        htmlFor="customerNotes"
        hint="(optional)"
        helpText="Any dietary restrictions, delivery preferences, or special requests from the customer."
      >
        <Textarea
          id="customerNotes"
          value={formData.customerNotes}
          onChange={(e) => updateFormData({ customerNotes: e.target.value })}
          placeholder="e.g., Nut allergies, specific delivery time, setup assistance needed..."
          rows={4}
          maxLength={500}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            fontSize: '14px',
            fontFamily: 'Open Sans, sans-serif',
            resize: 'vertical'
          }}
        />
        <p style={{ fontSize: '12px', color: '#999', marginTop: '4px', textAlign: 'right' }}>
          {formData.customerNotes.length}/500 characters
        </p>
      </FormField>
    </div>
  );
}

// Validation function for Step 8
export function validateStep8(formData: any): boolean {
  // Required: event date and pickup time
  if (!formData.eventDate || !formData.pickupTime) {
    return false;
  }

  // Date must be at least 2 days in future (unless manager approved rush)
  if (!isDateAtLeastDaysAway(formData.eventDate, 2) && !formData.managerApproval) {
    return false;
  }

  // Pickup time must meet 4-hour buffer
  const timeValidation = isPickupTimeValid(formData.eventDate, formData.pickupTime);
  if (!timeValidation.valid) {
    return false;
  }

  // If rush order, manager approval required
  if (formData.isRushOrder && !formData.managerApproval) {
    return false;
  }

  return true;
}
