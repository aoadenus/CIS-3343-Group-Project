import { useMemo } from 'react';
import { CustomizationData, Customer } from '../stores/orderWizardStore';
import { validateBusinessRules } from '../lib/orderWizardSchemas';

interface PricingResult {
  basePrice: number;
  sizeUpcharge: number;
  tierUpcharge: number;
  decorationCost: number;
  discount: number;
  subtotal: number;
  depositAmount: number;
  balanceDue: number;
  total: number;
}

interface Product {
  id: string;
  name: string;
  base_price: number;
  category: string;
}

export const useOrderPricing = (
  basePrice: number,
  customization: Partial<CustomizationData>,
  customer?: Customer | null
): PricingResult => {
  return useMemo(() => {
    const {
      size,
      tiers = 1,
      colors = [],
      decorations = [],
      fillings = []
    } = customization;

    let totalPrice = basePrice;

    // Size upcharges
    const sizeUpcharges: Record<string, number> = {
      '6-inch': 0,
      '8-inch': 15,
      '10-inch': 30,
      '12-inch': 50,
      '14-inch': 75,
      '16-inch': 100,
      'quarter-sheet': 60,
      'half-sheet': 100,
      'full-sheet': 180,
    };
    const sizeUpcharge = sizeUpcharges[size || '8-inch'] || 15;

    // Tier upcharges (each additional tier beyond 1)
    const tierUpcharge = Math.max(0, tiers - 1) * 20;

    // Decoration costs
    const decorationBaseCost = decorations.length * 5; // $5 per decoration
    const colorCost = Math.max(0, colors.length - 2) * 3; // First 2 colors free
    const fillingCost = Math.max(0, fillings.length - 1) * 2; // First filling free

    const decorationCost = decorationBaseCost + colorCost + fillingCost;

    // Preferred customer discount
    const isPreferredCustomer = customer?.is_preferred ?? false;
    const subtotal = totalPrice + sizeUpcharge + tierUpcharge + decorationCost;
    const discount = isPreferredCustomer ? subtotal * validateBusinessRules.preferredCustomerDiscount : 0;

    // Final calculations
    const discountedSubtotal = subtotal - discount;
    const depositAmount = validateBusinessRules.depositRequired(discountedSubtotal);
    const balanceDue = discountedSubtotal - depositAmount;
    const total = discountedSubtotal;

    return {
      basePrice: totalPrice,
      sizeUpcharge,
      tierUpcharge,
      decorationCost,
      discount,
      subtotal: discountedSubtotal,
      depositAmount,
      balanceDue,
      total,
    };
  }, [basePrice, customization, customer]);
};

// Hook for available pickup times
export const useAvailableTimeSlots = (date: Date | undefined) => {
  return useMemo(() => {
    if (!date) return [];

    const dayOfWeek = date.getDay();

    // Weekend hours (Saturday)
    if (dayOfWeek === 6) {
      return [
        { value: '9:00 AM', label: '9:00 AM - 10:00 AM', requiresBuffer: false, completionTime: '7:00 AM' },
        { value: '10:00 AM', label: '10:00 AM - 11:00 AM', requiresBuffer: false, completionTime: '8:00 AM' },
        { value: '11:00 AM', label: '11:00 AM - 12:00 PM', requiresBuffer: false, completionTime: '9:00 AM' },
        { value: '1:00 PM', label: '1:00 PM - 2:00 PM', requiresBuffer: true, completionTime: '11:00 AM' },
        { value: '2:00 PM', label: '2:00 PM - 3:00 PM', requiresBuffer: true, completionTime: '12:00 PM' },
      ];
    }

    // Weekday hours
    return [
      { value: '8:00 AM', label: '8:00 AM - 9:00 AM', requiresBuffer: false, completionTime: '6:00 AM' },
      { value: '9:00 AM', label: '9:00 AM - 10:00 AM', requiresBuffer: false, completionTime: '7:00 AM' },
      { value: '10:00 AM', label: '10:00 AM - 11:00 AM', requiresBuffer: false, completionTime: '8:00 AM' },
      { value: '11:00 AM', label: '11:00 AM - 12:00 PM', requiresBuffer: false, completionTime: '9:00 AM' },
      { value: '1:00 PM', label: '1:00 PM - 2:00 PM', requiresBuffer: true, completionTime: '11:00 AM' },
      { value: '2:00 PM', label: '2:00 PM - 3:00 PM', requiresBuffer: true, completionTime: '12:00 PM' },
      { value: '3:00 PM', label: '3:00 PM - 4:00 PM', requiresBuffer: true, completionTime: '1:00 PM' },
    ];
  }, [date]);
};

// Hook for date validation
export const useDateValidation = () => {
  const minDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + validateBusinessRules.minAdvanceNoticeDays);
    return date;
  }, []);

  const isDateDisabled = (date: Date, isRushOrder: boolean = false) => {
    // Always disable past dates
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;

    // Disable Sundays (closed)
    if (date.getDay() === 0) return true;

    // Disable before minimum notice unless rush order
    if (!isRushOrder && date < minDate) return true;

    return false;
  };

  const getDateError = (date: Date, isRushOrder: boolean = false) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return 'Pickup date cannot be in the past';
    }
    if (date.getDay() === 0) {
      return 'Sorry, we are closed on Sundays';
    }
    if (!isRushOrder && date < minDate) {
      return `Orders require ${validateBusinessRules.minAdvanceNoticeDays} days notice`;
    }
    return null;
  };

  return { minDate, isDateDisabled, getDateError };
};
