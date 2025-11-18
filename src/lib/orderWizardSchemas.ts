import { z } from 'zod';

// Customer selection schemas
export const customerSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  customer_type: z.enum(['retail', 'corporate']),
  is_preferred: z.boolean().default(false),
  address: z.string().optional(),
});

export const inlineCustomerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  customer_type: z.enum(['retail', 'corporate']),
  address: z.string().optional(),
});

// Product selection schema
export const productSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
});

// Customization schemas
export const flavorSchema = z.object({
  flavor: z.string().min(1, 'Please select a flavor'),
  icingFlavor: z.string().min(1, 'Please select an icing flavor'),
  fillings: z.array(z.string()).min(0).max(3, 'Maximum 3 fillings allowed'),
});

export const customizationSchema = z.object({
  size: z.enum(['6-inch', '8-inch', '10-inch', '12-inch', '14-inch', '16-inch', 'quarter-sheet', 'half-sheet', 'full-sheet']),
  tiers: z.number().min(1).max(5),
  flavor: z.string().min(1, 'Please select a flavor'),
  icingFlavor: z.string().min(1, 'Please select an icing flavor'),
  fillings: z.array(z.string()).max(3, 'Maximum 3 fillings allowed'),
  specialInstructions: z.string().max(500, 'Instructions must be less than 500 characters').optional(),
  colors: z.array(z.string()).min(0).max(4, 'Maximum 4 colors allowed'),
  decorations: z.array(z.string()).min(0).max(10, 'Maximum 10 decorations allowed'),
});

// Pricing schema
export const pricingSchema = z.object({
  total: z.number().positive(),
  depositAmount: z.number().positive(),
  balanceDue: z.number().positive(),
  paymentMethod: z.enum(['cash', 'card']),
});

// Scheduling schema
export const schedulingSchema = z.object({
  pickupDate: z.date(),
  pickupTime: z.string().min(1, 'Please select a pickup time'),
  isRush: z.boolean().default(false),
});

// Complete review schema
export const reviewSchema = z.object({
  confirmDeposit: z.boolean().refine((val) => val === true, {
    message: 'Please confirm deposit acceptance'
  }),
});

// Main wizard data schema
export const orderWizardSchema = z.object({
  customerId: z.string().optional(),
  inlineCustomer: inlineCustomerSchema.optional(),
  productId: z.string(),
  customization: customizationSchema,
  pricing: pricingSchema,
  schedule: schedulingSchema,
  review: reviewSchema,
});

// Search and filter schemas
export const customerSearchSchema = z.object({
  query: z.string().min(0).max(100),
  type: z.enum(['all', 'retail', 'corporate']).optional(),
  preferred: z.boolean().optional(),
});

export const productFilterSchema = z.object({
  category: z.enum(['all', 'classic', 'premium', 'specialty', 'seasonal']),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

// Business rules validation
export const validateBusinessRules = {
  depositRequired: (total: number) => total * 0.5,
  minAdvanceNoticeDays: 2,
  completionBufferHours: 4,
  maxCakesPerOrder: 1,
  preferredCustomerDiscount: 0.10,
  rushOrderFee: 25.00,
};
