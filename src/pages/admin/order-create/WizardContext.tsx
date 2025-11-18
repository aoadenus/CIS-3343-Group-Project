import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type LayerData } from '../../../data/cakeOptions';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  isVip: boolean;
}

export interface WizardFormData {
  // Step 1: Customer
  customer: Customer | null;
  isRushOrder: boolean;
  rushJustification: string;

  // Step 2: Cake Type
  cakeType: 'standard' | 'custom';
  standardCakeId: string;

  // Step 3: Layers (Custom only)
  layers: LayerData[];

  // Step 4: Size and Tiers
  cakeSize: string;

  // Step 5: Design (Colors, decorations, fonts)
  icingColors: string[];
  decorations: string[];
  message: string;

  // Step 6: Inspiration (Images)
  inspirationImages: string[];

  // Step 7: Pricing
  depositAmount: string;
  paymentStatus: 'pending' | 'partial' | 'paid';

  // Step 8: Pickup
  eventDate: string;
  pickupTime: string; // NEW: Added pickup time field
  servings: string;
  customerNotes: string;

  // Step 9: Review (Admin settings)
  status: string;
  priority: string;
  adminNotes: string;
  managerApproval: boolean;
}

interface WizardContextType {
  formData: WizardFormData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<WizardFormData>) => void;
  resetForm: () => void;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
}

const INITIAL_FORM_DATA: WizardFormData = {
  customer: null,
  isRushOrder: false,
  rushJustification: '',
  cakeType: 'custom',
  standardCakeId: '',
  layers: [
    { id: 'layer-1', flavor: '', fillings: [], icing: '', notes: '' },
    { id: 'layer-2', flavor: '', fillings: [], icing: '', notes: '' }
  ],
  cakeSize: '',
  icingColors: [],
  decorations: [],
  message: '',
  inspirationImages: [],
  depositAmount: '',
  paymentStatus: 'pending',
  eventDate: '',
  pickupTime: '', // NEW: Initialize pickup time
  servings: '',
  customerNotes: '',
  status: 'pending',
  priority: 'medium',
  adminNotes: '',
  managerApproval: false
};

const STORAGE_KEY = 'emily-bakes-order-wizard-draft';

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);

  // Autosave to localStorage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  const updateFormData = (data: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
    clearDraft();
  };

  const saveDraft = () => {
    try {
      const draft = {
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = () => {
    try {
      const draftStr = localStorage.getItem(STORAGE_KEY);
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        // Only load if draft is less than 24 hours old
        const draftAge = Date.now() - new Date(draft.timestamp).getTime();
        if (draftAge < 24 * 60 * 60 * 1000) {
          setFormData(draft.formData);
          setCurrentStep(draft.currentStep);
        } else {
          clearDraft();
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  return (
    <WizardContext.Provider
      value={{
        formData,
        currentStep,
        setCurrentStep,
        updateFormData,
        resetForm,
        saveDraft,
        loadDraft,
        clearDraft
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
}
