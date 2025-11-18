// ============================================================================
// VALIDATION UTILITIES - Emily Bakes Cakes
// Business rule validation for order creation
// ============================================================================

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[\d\s\-\(\)]+$/;

// ============================================================================
// EMAIL VALIDATION
// ============================================================================
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return cleaned.length >= 10 && phoneRegex.test(phone);
}

// ============================================================================
// DATE & TIME VALIDATION (Business Rules)
// ============================================================================

/**
 * Returns true if date is at least `minDays` in the future (relative to today)
 * Business Rule: Orders require 2-day minimum advance notice
 */
export function isDateAtLeastDaysAway(dateString: string | undefined, minDays = 2): boolean {
  if (!dateString) return false;
  const target = new Date(dateString);
  const now = new Date();
  // Normalize to local midnight for day-based calculation
  const diffMs = target.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= minDays - 0.0001; // slight tolerance
}

/**
 * Returns number of days until target date
 */
export function daysUntil(dateString: string | undefined): number {
  if (!dateString) return Infinity;
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

/**
 * Business Rule: 4-Hour Buffer for Same-Day Pickups
 * Returns true if pickup time is at least 4 hours from now
 */
export function isPickupTimeValid(pickupDate: string, pickupTime: string): {
  valid: boolean;
  error?: string;
  hoursUntil?: number;
} {
  if (!pickupDate || !pickupTime) {
    return { valid: false, error: 'Date and time required' };
  }

  try {
    // Combine date and time into single datetime
    const [hours, minutes] = pickupTime.split(':').map(Number);
    const pickupDateTime = new Date(pickupDate);
    pickupDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffMs = pickupDateTime.getTime() - now.getTime();
    const hoursUntil = diffMs / (1000 * 60 * 60);

    // Business Rule: Minimum 4-hour buffer
    const MINIMUM_HOURS = 4;

    if (hoursUntil < MINIMUM_HOURS) {
      return {
        valid: false,
        error: `Pickup must be at least ${MINIMUM_HOURS} hours from now`,
        hoursUntil: Math.max(0, hoursUntil)
      };
    }

    return { valid: true, hoursUntil };
  } catch (error) {
    return { valid: false, error: 'Invalid date or time format' };
  }
}

/**
 * Checks if pickup date/time is in the past
 */
export function isPickupInPast(pickupDate: string, pickupTime?: string): boolean {
  if (!pickupDate) return false;

  try {
    let pickupDateTime = new Date(pickupDate);
    
    if (pickupTime) {
      const [hours, minutes] = pickupTime.split(':').map(Number);
      pickupDateTime.setHours(hours, minutes, 0, 0);
    } else {
      // If no time specified, use end of day
      pickupDateTime.setHours(23, 59, 59, 999);
    }

    return pickupDateTime.getTime() < Date.now();
  } catch (error) {
    return false;
  }
}

/**
 * Format hours until pickup for display
 */
export function formatHoursUntil(hours: number): string {
  if (hours < 1) {
    const minutes = Math.floor(hours * 60);
    return `${minutes} minutes`;
  }
  if (hours < 24) {
    return `${Math.floor(hours)} hours`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  return remainingHours > 0 
    ? `${days} days, ${remainingHours} hours`
    : `${days} days`;
}

// ============================================================================
// DEPOSIT & PRICING VALIDATION
// ============================================================================

/**
 * Business Rule: 50% Deposit Required
 * Validates deposit amount meets minimum requirement
 */
export function validateDeposit(depositAmount: number, totalAmount: number): {
  valid: boolean;
  error?: string;
  minimumDeposit?: number;
} {
  const minimumDeposit = Math.ceil(totalAmount * 0.5);

  if (depositAmount < minimumDeposit) {
    return {
      valid: false,
      error: `Minimum deposit is $${(minimumDeposit / 100).toFixed(2)} (50% of total)`,
      minimumDeposit
    };
  }

  if (depositAmount > totalAmount) {
    return {
      valid: false,
      error: 'Deposit cannot exceed total amount'
    };
  }

  return { valid: true, minimumDeposit };
}

/**
 * Format currency for display
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ============================================================================
// RUSH ORDER DETECTION
// ============================================================================

/**
 * Determines if order qualifies as "rush"
 * Business Rule: Rush = less than 2 days advance notice
 */
export function isRushOrder(eventDate: string | Date): boolean {
  const target = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays < 2;
}

/**
 * Get rush order status with details
 */
export function getRushOrderStatus(eventDate: string): {
  isRush: boolean;
  daysUntil: number;
  requiresApproval: boolean;
  message: string;
} {
  const days = daysUntil(eventDate);
  const isRush = days < 2;

  if (days < 0) {
    return {
      isRush: true,
      daysUntil: days,
      requiresApproval: true,
      message: 'Date is in the past'
    };
  }

  if (days < 1) {
    return {
      isRush: true,
      daysUntil: days,
      requiresApproval: true,
      message: 'Same-day order requires manager approval'
    };
  }

  if (days < 2) {
    return {
      isRush: true,
      daysUntil: days,
      requiresApproval: true,
      message: 'Less than 2 days - rush order requires manager approval'
    };
  }

  return {
    isRush: false,
    daysUntil: days,
    requiresApproval: false,
    message: 'Standard order timeline'
  };
}

// ============================================================================
// FORM VALIDATION HELPERS
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequiredField(
  value: any,
  fieldName: string
): ValidationError | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      field: fieldName,
      message: `${fieldName} is required`
    };
  }
  return null;
}

export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): ValidationError | null {
  if (value && value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters`
    };
  }
  return null;
}

export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationError | null {
  if (value && value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must not exceed ${maxLength} characters`
    };
  }
  return null;
}
