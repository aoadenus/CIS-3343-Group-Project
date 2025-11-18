import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Wizard state types
export interface Customer {
  id: string
  full_name: string
  email: string
  phone?: string
  address?: string
  customer_type: 'retail' | 'corporate'
  is_preferred: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  base_price: number
  is_active: boolean
  image_url?: string
}

export interface CustomizationData {
  size: '6-inch' | '8-inch' | '10-inch' | '12-inch' | '14-inch' | '16-inch' | 'quarter-sheet' | 'half-sheet' | 'full-sheet'
  tiers: number
  flavor: string
  icingFlavor: string
  fillings: string[]
  specialInstructions?: string
  colors: string[]
  decorations: string[]
}

export interface PriceCalculation {
  basePrice: number
  sizeUpcharge: number
  tierUpcharge: number
  decorationCost: number
  discount: number
  subtotal: number
  depositAmount: number
  balanceDue: number
  total: number
}

export interface ScheduleData {
  pickupDate: Date
  pickupTime: string
  isRush: boolean
}

export interface OrderWizardData {
  customerId?: string
  productId?: string
  customization: Partial<CustomizationData>
  pricing?: PriceCalculation
  schedule?: ScheduleData
}

export interface WizardStep {
  id: number
  title: string
  description: string
  isComplete: boolean
  isOptional?: boolean
}

interface OrderWizardState {
  // Current state
  currentStep: number
  data: OrderWizardData
  isSubmitting: boolean
  isDirty: boolean

  // Step completion tracking
  steps: WizardStep[]

  // Actions
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateStepCompletion: (stepId: number, complete: boolean) => void
  setWizardData: (updater: Partial<OrderWizardData> | ((prev: OrderWizardData) => Partial<OrderWizardData>)) => void
  setSubmitting: (submitting: boolean) => void
  resetWizard: () => void
  saveProgress: () => void
  loadProgress: () => void

  // Computed properties
  isStepValid: (stepId: number) => boolean
  canGoNext: boolean
  canGoPrev: boolean
  isComplete: boolean
}

const initialSteps: WizardStep[] = [
  { id: 1, title: 'Customer', description: 'Select or create customer', isComplete: false },
  { id: 2, title: 'Product', description: 'Choose base product', isComplete: false },
  { id: 3, title: 'Customize', description: 'Size, flavors, decorations', isComplete: false },
  { id: 4, title: 'Pricing', description: 'Calculate total & deposit', isComplete: false },
  { id: 5, title: 'Schedule', description: 'Pickup date & time', isComplete: false },
  { id: 6, title: 'Review', description: 'Confirm order details', isComplete: false },
]

const initialData: OrderWizardData = {
  customization: {
    tiers: 1,
    colors: [],
    decorations: [],
    fillings: []
  }
}

export const useOrderWizard = create<OrderWizardState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      data: initialData,
      isSubmitting: false,
      isDirty: false,
      steps: initialSteps,

      // Actions
      goToStep: (step: number) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 6) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },

      updateStepCompletion: (stepId: number, complete: boolean) =>
        set(state => ({
          steps: state.steps.map(step =>
            step.id === stepId ? { ...step, isComplete: complete } : step
          )
        })),

      setWizardData: (updater) =>
        set(state => ({
          data: typeof updater === 'function'
            ? { ...state.data, ...updater(state.data) }
            : { ...state.data, ...updater },
          isDirty: true
        })),

      setSubmitting: (submitting: boolean) => set({ isSubmitting: submitting }),

      resetWizard: () => set({
        currentStep: 1,
        data: initialData,
        isSubmitting: false,
        isDirty: false,
        steps: initialSteps
      }),

      saveProgress: () => {
        // Implementation for saving to localStorage or backend
        localStorage.setItem('order-wizard-progress', JSON.stringify(get()))
      },

      loadProgress: () => {
        const saved = localStorage.getItem('order-wizard-progress')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            set(parsed)
          } catch (error) {
            console.error('Failed to load wizard progress:', error)
          }
        }
      },

      // Computed properties
      isStepValid: (stepId: number) => {
        const { data, steps } = get()
        const step = steps.find(s => s.id === stepId)

        switch (stepId) {
          case 1:
            return !!data.customerId
          case 2:
            return !!data.productId
          case 3:
            return !!data.customization.size && !!data.customization.flavor && !!data.customization.icingFlavor
          case 4:
            return !!data.pricing && data.pricing.total > 0
          case 5:
            return !!data.schedule?.pickupDate && !!data.schedule.pickupTime
          case 6:
            return step?.isComplete ?? false
          default:
            return false
        }
      },

      get canGoNext() {
        const { currentStep, isStepValid } = get()
        return currentStep < 6 && isStepValid(currentStep)
      },

      get canGoPrev() {
        const { currentStep } = get()
        return currentStep > 1
      },

      get isComplete() {
        const { steps } = get()
        return steps.every(step => step.isComplete || step.isOptional)
      },
    }),
    {
      name: 'order-wizard-storage',
      // Only persist certain data
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
        steps: state.steps,
      }),
    }
  )
)
