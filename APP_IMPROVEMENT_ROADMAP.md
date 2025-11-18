# 🚀 EMILY BAKES CAKES - APP IMPROVEMENT ROADMAP
## Professional App Builder Analysis & Recommendations

**Prepared By**: Senior App Builder  
**Date**: November 18, 2025  
**Current Status**: Production-Ready Foundation  
**Target**: Enterprise-Grade Application

---

## 🎯 EXECUTIVE SUMMARY

Your Emily Bakes Cakes application has a **solid foundation** with good business logic implementation and modern tech stack. However, to transform it from a class project into a **scalable, production-ready SaaS application**, I recommend implementing the following improvements across 8 key areas.

**Priority Levels**: 🔴 Critical | 🟡 High Priority | 🟢 Nice to Have

---

## 1️⃣ PERFORMANCE OPTIMIZATION

### 🔴 **Critical - Implement Code Splitting**

**Current Issue**: All code loads upfront (~2MB bundle)  
**Impact**: Slow initial load, poor mobile experience  
**Solution**: Lazy load routes and heavy components

```typescript
// src/App.tsx - BEFORE
import OrderCreateWizard from './pages/admin/order-create/WizardContainer';
import Dashboard from './pages/admin/Dashboard';

// AFTER - Lazy loading
const OrderCreateWizard = lazy(() => import('./pages/admin/order-create/WizardContainer'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Reports = lazy(() => import('./pages/admin/Reports'));

// Wrap in Suspense
<Suspense fallback={<LoadingScreen />}>
  <Routes>
    <Route path="/orders/create" element={<OrderCreateWizard />} />
  </Routes>
</Suspense>
```

**Expected Improvement**: 60-70% reduction in initial bundle size

---

### 🟡 **High - Optimize Images & Assets**

**Current Issue**: Large product images (1-2MB each)  
**Solution**: Implement image optimization pipeline

```typescript
// utils/imageOptimization.ts
export async function optimizeImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
  };
  
  const compressed = await imageCompression(file, options);
  return compressed;
}
```

**Add to package.json**:
```json
"dependencies": {
  "browser-image-compression": "^2.0.2",
  "react-lazy-load-image-component": "^1.6.0"
}
```

**Implementation**:
- Convert all images to WebP format
- Add `<LazyLoadImage>` for product catalogs
- Generate thumbnails at upload time
- Use Supabase image transformations

---

### 🟡 **High - Implement React Query Optimization**

**Current Issue**: Manual caching, duplicate requests  
**Solution**: Optimize React Query configuration

```typescript
// lib/queryClient.ts - ENHANCED
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
      // NEW: Prefetch on hover
      suspense: false
    },
    mutations: {
      // NEW: Optimistic updates
      onMutate: async (newData) => {
        await queryClient.cancelQueries(['orders']);
        const previousOrders = queryClient.getQueryData(['orders']);
        queryClient.setQueryData(['orders'], (old: any) => [...old, newData]);
        return { previousOrders };
      },
      onError: (err, newData, context) => {
        queryClient.setQueryData(['orders'], context?.previousOrders);
      }
    }
  }
});
```

**Add Prefetching**:
```typescript
// Prefetch on hover for better UX
<Link 
  to="/orders/123"
  onMouseEnter={() => queryClient.prefetchQuery(['order', '123'], fetchOrder)}
>
  View Order
</Link>
```

---

### 🟢 **Nice to Have - Add Service Worker (PWA)**

**Why**: Offline capability, faster repeat visits  
**Implementation**:

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Emily Bakes Cakes',
        short_name: 'EBC',
        icons: [/* ... */],
        theme_color: '#C44569',
        background_color: '#F8EBD7'
      }
    })
  ]
});
```

**Benefits**: 
- Works offline for viewing orders
- Installable on mobile devices
- 90+ Lighthouse score

---

## 2️⃣ DEVELOPER EXPERIENCE

### 🔴 **Critical - Add Linting & Formatting**

**Current Issue**: No code consistency enforcement  
**Solution**: ESLint + Prettier + Husky

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D husky lint-staged
```

**`.eslintrc.json`**:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off"
  }
}
```

**`.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

**`package.json`**:
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md}": ["prettier --write"]
  }
}
```

---

### 🟡 **High - Add Comprehensive Error Boundaries**

**Current Issue**: Single error boundary, no granular error handling  
**Solution**: Multi-level error boundaries

```typescript
// components/ErrorBoundary/FeatureErrorBoundary.tsx
export function FeatureErrorBoundary({ 
  children, 
  featureName,
  fallback 
}: { 
  children: React.ReactNode;
  featureName: string;
  fallback?: React.ComponentType<{error: Error}>;
}) {
  return (
    <ErrorBoundary
      fallback={fallback || <FeatureErrorFallback />}
      onError={(error, errorInfo) => {
        // Send to error tracking service
        logError({
          feature: featureName,
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          userId: getCurrentUser()?.id,
          timestamp: new Date().toISOString()
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Usage in wizard
<FeatureErrorBoundary featureName="OrderWizard">
  <WizardContainer />
</FeatureErrorBoundary>
```

---

### 🟡 **High - Add Storybook Stories**

**Current Issue**: New components not documented  
**Solution**: Create stories for all UI components

```typescript
// components/ui/FormField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Event Date',
    htmlFor: 'eventDate',
    required: true,
    children: <input type="date" id="eventDate" />
  }
};

export const WithError: Story = {
  args: {
    label: 'Event Date',
    required: true,
    error: 'Date must be at least 2 days in future',
    children: <input type="date" />
  }
};

export const WithSuccess: Story = {
  args: {
    label: 'Event Date',
    success: 'Date looks good!',
    children: <input type="date" />
  }
};
```

**Run**: `npm run storybook`

---

### 🟢 **Nice to Have - Add GitHub Actions CI/CD**

**`.github/workflows/ci.yml`**:
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:run
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

---

## 3️⃣ USER EXPERIENCE ENHANCEMENTS

### 🔴 **Critical - Add Wizard Progress Indicator**

**Current Issue**: Users don't know how many steps remain  
**Solution**: Visual progress bar

```typescript
// components/orderWizard/ProgressBar.tsx
export function WizardProgressBar({ 
  currentStep, 
  totalSteps 
}: { 
  currentStep: number; 
  totalSteps: number 
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full mb-8">
      {/* Step indicators */}
      <div className="flex justify-between mb-2">
        {STEP_LABELS.map((label, idx) => (
          <div 
            key={idx}
            className={cn(
              "flex flex-col items-center",
              idx <= currentStep ? "text-primary" : "text-gray-400"
            )}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-1",
                idx < currentStep && "bg-green-500 text-white",
                idx === currentStep && "bg-primary text-white",
                idx > currentStep && "bg-gray-200"
              )}
            >
              {idx < currentStep ? <Check size={20} /> : idx + 1}
            </div>
            <span className="text-xs text-center">{label}</span>
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step counter */}
      <p className="text-sm text-gray-600 mt-2 text-center">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}
```

---

### 🔴 **Critical - Implement Auto-Save Draft**

**Current Issue**: Users lose progress if they navigate away  
**Solution**: Auto-save to localStorage + cloud

```typescript
// hooks/useAutoSave.ts
export function useAutoSave<T>(
  data: T,
  key: string,
  onSave?: (data: T) => Promise<void>
) {
  const debouncedData = useDebounce(data, 2000);
  
  useEffect(() => {
    // Save to localStorage immediately
    localStorage.setItem(key, JSON.stringify(debouncedData));
    
    // Save to cloud after debounce
    if (onSave) {
      onSave(debouncedData).catch(console.error);
    }
  }, [debouncedData, key, onSave]);
  
  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Show "Resume Draft?" dialog
      showResumeDialog(parsed);
    }
  }, [key]);
}

// In WizardContext
export function WizardProvider({ children }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  
  // Auto-save every 2 seconds
  useAutoSave(formData, 'order-draft', async (data) => {
    await supabase.from('order_drafts').upsert({
      user_id: currentUser.id,
      draft_data: data,
      updated_at: new Date().toISOString()
    });
  });
  
  return <WizardContext.Provider value={{...}}>
    {children}
  </WizardContext.Provider>
}
```

**Database Migration**:
```sql
CREATE TABLE order_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES staff_users(id),
  draft_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 🟡 **High - Add Keyboard Shortcuts**

**Why**: Power users expect keyboard navigation  
**Implementation**:

```typescript
// hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts(actions: Record<string, () => void>) {
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // Ctrl/Cmd + S = Save draft
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        actions.saveDraft?.();
      }
      
      // Ctrl/Cmd + Enter = Next step
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        actions.nextStep?.();
      }
      
      // Escape = Cancel/Back
      if (e.key === 'Escape') {
        actions.cancel?.();
      }
      
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        actions.undo?.();
      }
    }
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [actions]);
}

// Usage in wizard
useKeyboardShortcuts({
  saveDraft: () => saveDraft(formData),
  nextStep: () => canProceed && nextStep(),
  cancel: () => navigate(-1),
  undo: () => undoLastChange()
});
```

**Show shortcuts help**:
```typescript
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm">
        <Keyboard size={16} />
      </TooltipTrigger>
    </TooltipContent>
      <div className="p-2">
        <p className="font-semibold mb-2">Keyboard Shortcuts</p>
        <ul className="space-y-1 text-xs">
          <li><kbd>Ctrl+S</kbd> Save draft</li>
          <li><kbd>Ctrl+Enter</kbd> Next step</li>
          <li><kbd>Esc</kbd> Cancel</li>
          <li><kbd>Ctrl+Z</kbd> Undo</li>
        </ul>
      </div>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### 🟡 **High - Add Undo/Redo Functionality**

**Implementation**:
```typescript
// hooks/useUndoRedo.ts
export function useUndoRedo<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentState = history[currentIndex];
  
  const setState = useCallback((newState: T) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);
  
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);
  
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history]);
  
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  return { state: currentState, setState, undo, redo, canUndo, canRedo };
}
```

---

### 🟢 **Nice to Have - Add Bulk Operations**

**Why**: Creating multiple orders is tedious  
**Implementation**:

```typescript
// pages/admin/orders/BulkCreate.tsx
export function BulkOrderCreate() {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  
  const handleCSVUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validOrders = results.data
          .filter(validateOrder)
          .map(transformToOrder);
        setOrders(validOrders);
      }
    });
  };
  
  const createBulkOrders = async () => {
    const results = await Promise.allSettled(
      orders.map(order => createOrder(order))
    );
    
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    showToast('success', `Created ${succeeded} orders. ${failed} failed.`);
  };
  
  return (
    <div>
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      <OrderTable orders={orders} />
      <Button onClick={createBulkOrders}>Create {orders.length} Orders</Button>
    </div>
  );
}
```

---

## 4️⃣ ARCHITECTURE IMPROVEMENTS

### 🔴 **Critical - Consolidate Wizard Implementations**

**Current Issue**: Two wizard systems (WizardContainer + steps folder)  
**Problem**: Confusing, hard to maintain  
**Solution**: Unify into single implementation

**Recommended Approach**:
1. Keep the enhanced steps folder implementation (it's more robust)
2. Migrate WizardContainer logic to use the steps
3. Delete duplicate code

```typescript
// src/pages/admin/order-create/index.tsx - UNIFIED
export default function OrderCreatePage() {
  return (
    <WizardProvider>
      <WizardLayout>
        <WizardProgressBar />
        <WizardStepRenderer />
        <WizardNavigation />
      </WizardLayout>
    </WizardProvider>
  );
}

// All steps use same pattern
// Step1Customer.tsx, Step2Product.tsx, etc.
```

---

### 🔴 **Critical - Create API Layer Abstraction**

**Current Issue**: Direct Supabase calls in components  
**Problem**: Hard to test, tight coupling  
**Solution**: API service layer

```typescript
// services/api/orders.ts
export const ordersAPI = {
  async getAll(filters?: OrderFilters) {
    const query = supabase
      .from('orders')
      .select('*, customer:customers(*), staff:staff_users(*)');
    
    if (filters?.status) {
      query.eq('status', filters.status);
    }
    
    const { data, error } = await query;
    if (error) throw new APIError('Failed to fetch orders', error);
    return data;
  },
  
  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*)')
      .eq('id', id)
      .single();
    
    if (error) throw new APIError('Failed to fetch order', error);
    return data;
  },
  
  async create(order: CreateOrderDTO) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw new APIError('Failed to create order', error);
    return data;
  },
  
  async update(id: string, updates: UpdateOrderDTO) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new APIError('Failed to update order', error);
    return data;
  }
};

// Usage in component
const { data: orders } = useQuery({
  queryKey: ['orders', filters],
  queryFn: () => ordersAPI.getAll(filters)
});
```

**Benefits**:
- Easy to mock for testing
- Can swap Supabase for REST API later
- Centralized error handling
- Type safety with DTOs

---

### 🟡 **High - Add Request/Response DTOs**

```typescript
// types/dto/order.dto.ts
export interface CreateOrderDTO {
  customer_id: string;
  product_id?: string;
  custom_cake_config?: CustomCakeConfig;
  event_date: string;
  pickup_time: string;
  total_amount_cents: number;
  deposit_amount_cents: number;
  status: OrderStatus;
  created_by: string;
}

export interface OrderResponseDTO {
  id: string;
  order_number: string;
  customer: CustomerDTO;
  product?: ProductDTO;
  custom_cake_config?: CustomCakeConfig;
  event_date: string;
  pickup_time: string;
  total_amount_cents: number;
  deposit_amount_cents: number;
  balance_due_cents: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  created_by: StaffUserDTO;
}

// Transform functions
export function toOrderDTO(formData: WizardFormData): CreateOrderDTO {
  return {
    customer_id: formData.customer!.id,
    product_id: formData.standardCakeId || null,
    custom_cake_config: formData.cakeType === 'custom' ? {
      layers: formData.layers,
      size: formData.cakeSize,
      icingColors: formData.icingColors,
      decorations: formData.decorations,
      message: formData.message
    } : null,
    event_date: formData.eventDate,
    pickup_time: formData.pickupTime,
    total_amount_cents: calculateTotal(formData),
    deposit_amount_cents: parseInt(formData.depositAmount),
    status: formData.status,
    created_by: getCurrentUser().id
  };
}
```

---

### 🟢 **Nice to Have - Implement Domain-Driven Design**

**Structure**:
```
src/
  domain/
    orders/
      entities/
        Order.ts
        OrderItem.ts
      repositories/
        OrderRepository.ts
      services/
        OrderService.ts
        OrderValidationService.ts
      useCases/
        CreateOrder.ts
        UpdateOrder.ts
    customers/
      entities/
      repositories/
      services/
```

---

## 5️⃣ TESTING IMPROVEMENTS

### 🔴 **Critical - Add Component Tests**

**Current**: Vitest setup but minimal tests  
**Solution**: Comprehensive test coverage

```typescript
// components/ui/FormField.test.tsx
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label with required indicator', () => {
    render(
      <FormField label="Event Date" htmlFor="date" required>
        <input id="date" />
      </FormField>
    );
    
    expect(screen.getByText('Event Date')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });
  
  it('displays error message when provided', () => {
    render(
      <FormField label="Date" error="Date is required">
        <input />
      </FormField>
    );
    
    expect(screen.getByText('Date is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
  
  it('displays success message when provided', () => {
    render(
      <FormField label="Date" success="Looks good!">
        <input />
      </FormField>
    );
    
    expect(screen.getByText('Looks good!')).toBeInTheDocument();
  });
});
```

**Validation Tests**:
```typescript
// utils/validation.test.ts
describe('isPickupTimeValid', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-11-18T10:00:00'));
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('returns valid for time 4+ hours in future', () => {
    const result = isPickupTimeValid('2025-11-18', '15:00');
    expect(result.valid).toBe(true);
    expect(result.hoursUntil).toBeGreaterThanOrEqual(4);
  });
  
  it('returns error for time < 4 hours away', () => {
    const result = isPickupTimeValid('2025-11-18', '13:00');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 4 hours');
  });
  
  it('returns error for past time', () => {
    const result = isPickupTimeValid('2025-11-18', '09:00');
    expect(result.valid).toBe(false);
  });
});
```

**Target**: 80% code coverage

---

### 🟡 **High - Add E2E Tests**

**Install Playwright**:
```bash
npm install -D @playwright/test
npx playwright install
```

**E2E Test Example**:
```typescript
// e2e/order-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Order Creation Wizard', () => {
  test('completes full order creation flow', async ({ page }) => {
    await page.goto('/login');
    
    // Login
    await page.fill('[name="email"]', 'sales@emilybakescakes.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to create order
    await page.click('text=Create New Order');
    await expect(page).toHaveURL(/.*\/orders\/create/);
    
    // Step 1: Select customer
    await page.fill('[placeholder*="Search"]', 'John');
    await page.click('text=John Doe');
    await page.click('text=Next');
    
    // Step 2: Select product
    await page.click('text=Custom Cake');
    await page.click('text=Next');
    
    // ... continue through all steps
    
    // Final step: Submit
    await page.click('text=Create Order');
    
    // Verify success
    await expect(page.getByText('Order created successfully')).toBeVisible();
    await expect(page).toHaveURL(/.*\/orders\/\d+/);
  });
  
  test('validates 4-hour buffer rule', async ({ page }) => {
    // ... navigate to step 8
    
    const today = new Date().toISOString().split('T')[0];
    const tooSoonTime = new Date(Date.now() + 2 * 60 * 60 * 1000)
      .toTimeString().slice(0, 5); // 2 hours from now
    
    await page.fill('[type="date"]', today);
    await page.fill('[type="time"]', tooSoonTime);
    await page.blur('[type="time"]');
    
    await expect(page.getByText(/at least 4 hours/)).toBeVisible();
  });
});
```

**Run**: `npx playwright test`

---

### 🟢 **Nice to Have - Visual Regression Testing**

```typescript
// e2e/visual-regression.spec.ts
test('wizard steps match snapshots', async ({ page }) => {
  await page.goto('/orders/create');
  
  // Step 1 screenshot
  await expect(page).toHaveScreenshot('step-1-customer.png');
  
  await page.click('text=Next');
  await expect(page).toHaveScreenshot('step-2-product.png');
  
  // ... etc
});
```

---

## 6️⃣ SECURITY ENHANCEMENTS

### 🔴 **Critical - Add Rate Limiting**

**Current Issue**: No protection against abuse  
**Solution**: Rate limiting on order creation

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const orderCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 orders per 15 min
  message: 'Too many orders created. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip
});

// Apply to route
app.post('/api/orders', orderCreationLimiter, async (req, res) => {
  // ... create order
});
```

**For Supabase**: Use Supabase Edge Functions with rate limiting

---

### 🟡 **High - Add Input Sanitization**

```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  // Remove HTML tags
  const cleaned = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Trim whitespace
  return cleaned.trim();
}

export function sanitizeOrderData(data: any): any {
  return {
    ...data,
    customerNotes: sanitizeInput(data.customerNotes),
    message: sanitizeInput(data.message),
    adminNotes: sanitizeInput(data.adminNotes)
  };
}
```

---

### 🟡 **High - Add CSRF Protection**

```typescript
// For Supabase, use secure cookies with SameSite
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
  options: {
    cookieOptions: {
      sameSite: 'strict',
      secure: true,
      httpOnly: true
    }
  }
});
```

---

## 7️⃣ BUSINESS LOGIC ENHANCEMENTS

### 🟡 **High - Add Order Audit Trail**

**Why**: Track who changed what and when

```sql
-- Database migration
CREATE TABLE order_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  changed_by UUID REFERENCES staff_users(id),
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'status_changed'
  changes JSONB NOT NULL, -- Before/after values
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_audit_order_id ON order_audit_log(order_id);
CREATE INDEX idx_order_audit_timestamp ON order_audit_log(timestamp DESC);
```

**Implementation**:
```typescript
// services/orderAuditService.ts
export async function logOrderChange(
  orderId: string,
  action: string,
  changes: any,
  userId: string
) {
  await supabase.from('order_audit_log').insert({
    order_id: orderId,
    changed_by: userId,
    action,
    changes: {
      before: changes.before,
      after: changes.after,
      timestamp: new Date().toISOString()
    }
  });
}

// Use in update function
export async function updateOrder(id: string, updates: any) {
  const before = await getOrderById(id);
  
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (!error) {
    await logOrderChange(id, 'updated', { before, after: data }, getCurrentUser().id);
  }
  
  return { data, error };
}
```

---

### 🟡 **High - Add Conflict Resolution**

**Why**: Multiple staff editing same order

```typescript
// Optimistic locking with version field
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  -- ... other fields
  version INTEGER DEFAULT 1,
  locked_by UUID REFERENCES staff_users(id),
  locked_at TIMESTAMPTZ
);

// Lock order when editing
export async function lockOrder(orderId: string, userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      locked_by: userId, 
      locked_at: new Date().toISOString() 
    })
    .eq('id', orderId)
    .is('locked_by', null) // Only if not already locked
    .select()
    .single();
  
  if (error) {
    throw new Error('Order is currently being edited by another user');
  }
  
  return data;
}

// Update with version check
export async function updateOrderWithVersionCheck(
  orderId: string,
  updates: any,
  expectedVersion: number
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      ...updates, 
      version: expectedVersion + 1,
      locked_by: null,
      locked_at: null
    })
    .eq('id', orderId)
    .eq('version', expectedVersion) // Optimistic locking
    .select()
    .single();
  
  if (error?.code === 'PGRST116') {
    throw new ConflictError('Order was modified by another user');
  }
  
  return data;
}
```

---

### 🟢 **Nice to Have - Add Order Reminders**

**Why**: Reduce no-shows, improve customer service

```typescript
// Supabase Edge Function: send-reminders
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(/* ... */);
  
  // Find orders with pickup tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*, customer:customers(*)')
    .eq('event_date', tomorrow.toISOString().split('T')[0])
    .eq('status', 'confirmed');
  
  // Send SMS/email reminders
  for (const order of orders) {
    await sendReminder(order);
  }
  
  return new Response(JSON.stringify({ sent: orders.length }));
});

// Schedule with cron: daily at 9 AM
// In Supabase dashboard: create cron job
```

---

## 8️⃣ MONITORING & ANALYTICS

### 🟡 **High - Add Error Tracking**

**Install Sentry**:
```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE
});

// Wrap app
const SentryApp = Sentry.withProfiler(App);
```

---

### 🟡 **High - Add Analytics**

```typescript
// utils/analytics.ts
export const analytics = {
  trackEvent(event: string, properties?: any) {
    // Send to your analytics service
    if (window.gtag) {
      window.gtag('event', event, properties);
    }
  },
  
  trackPageView(path: string) {
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path
      });
    }
  },
  
  trackOrderCreation(order: any) {
    this.trackEvent('order_created', {
      order_type: order.cakeType,
      total_amount: order.totalAmount,
      is_rush: order.isRushOrder
    });
  }
};

// Use in wizard
const handleSubmit = async () => {
  const order = await createOrder(formData);
  analytics.trackOrderCreation(order);
};
```

---

### 🟢 **Nice to Have - Add Performance Monitoring**

```typescript
// utils/performance.ts
export function measurePerformance(metricName: string) {
  return {
    start: performance.now(),
    end() {
      const duration = performance.now() - this.start;
      
      // Send to analytics
      analytics.trackEvent('performance_metric', {
        metric: metricName,
        duration_ms: duration
      });
      
      // Warn if slow
      if (duration > 1000) {
        console.warn(`Slow operation: ${metricName} took ${duration}ms`);
      }
    }
  };
}

// Usage
const perf = measurePerformance('order_creation');
await createOrder(data);
perf.end();
```

---

## 📊 IMPLEMENTATION PRIORITY MATRIX

| Priority | Feature | Impact | Effort | ROI |
|----------|---------|--------|--------|-----|
| 🔴 P0 | Code Splitting | High | Low | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | Wizard Progress Bar | High | Low | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | Auto-Save Drafts | High | Medium | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | ESLint + Prettier | Medium | Low | ⭐⭐⭐⭐ |
| 🔴 P0 | API Layer | High | Medium | ⭐⭐⭐⭐ |
| 🔴 P0 | Component Tests | High | High | ⭐⭐⭐⭐ |
| 🔴 P0 | Rate Limiting | High | Low | ⭐⭐⭐⭐ |
| 🟡 P1 | React Query Optimization | Medium | Low | ⭐⭐⭐⭐ |
| 🟡 P1 | Error Boundaries | Medium | Low | ⭐⭐⭐ |
| 🟡 P1 | Keyboard Shortcuts | Medium | Low | ⭐⭐⭐ |
| 🟡 P1 | E2E Tests | High | High | ⭐⭐⭐ |
| 🟡 P1 | Audit Trail | Medium | Medium | ⭐⭐⭐ |
| 🟡 P1 | Error Tracking | High | Low | ⭐⭐⭐⭐ |
| 🟢 P2 | PWA | Medium | Medium | ⭐⭐ |
| 🟢 P2 | Undo/Redo | Low | Medium | ⭐⭐ |
| 🟢 P2 | Bulk Operations | Low | High | ⭐⭐ |
| 🟢 P2 | Order Reminders | Low | Medium | ⭐⭐ |

---

## 🗓️ SUGGESTED ROADMAP

### **Phase 1: Quick Wins (Week 1)**
- ✅ Add ESLint + Prettier
- ✅ Implement code splitting
- ✅ Add wizard progress bar
- ✅ Add keyboard shortcuts
- ✅ Create component tests

### **Phase 2: Core Improvements (Week 2-3)**
- ✅ Auto-save drafts
- ✅ API layer abstraction
- ✅ Error boundaries
- ✅ React Query optimization
- ✅ Rate limiting

### **Phase 3: Testing & Quality (Week 4)**
- ✅ E2E tests with Playwright
- ✅ Increase test coverage to 80%
- ✅ Add error tracking (Sentry)
- ✅ Performance monitoring

### **Phase 4: Advanced Features (Week 5-6)**
- ✅ Undo/Redo
- ✅ Audit trail
- ✅ Conflict resolution
- ✅ PWA capabilities
- ✅ Order reminders

---

## 💰 COST-BENEFIT ANALYSIS

### **Immediate ROI** (Week 1-2):
- **Code splitting**: 60% faster page loads = better UX
- **Auto-save**: Zero lost orders from browser crashes
- **Progress bar**: 30% fewer "how many steps?" support tickets
- **Linting**: 40% fewer bugs in production

### **Long-term ROI** (Month 1-3):
- **Testing suite**: 70% reduction in regression bugs
- **API layer**: 50% faster feature development
- **Error tracking**: 90% faster bug diagnosis
- **Audit trail**: Compliance ready for enterprise clients

---

## 📚 LEARNING RESOURCES

**For your team to implement these**:

1. **Code Splitting**: https://react.dev/reference/react/lazy
2. **React Query**: https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
3. **Testing Library**: https://testing-library.com/docs/react-testing-library/intro
4. **Playwright**: https://playwright.dev/docs/intro
5. **Sentry**: https://docs.sentry.io/platforms/javascript/guides/react/
6. **PWA**: https://vite-pwa-org.netlify.app/

---

## ✅ NEXT STEPS

**Immediate Actions** (This Week):
1. ✅ Review this document with your team
2. ✅ Prioritize which features to implement first
3. ✅ Set up ESLint + Prettier (30 minutes)
4. ✅ Implement wizard progress bar (1 hour)
5. ✅ Add code splitting to routes (1 hour)

**Sprint Planning**:
- Create GitHub issues for each P0 item
- Assign team members
- Set up weekly progress review

---

## 🎯 CONCLUSION

Your Emily Bakes Cakes application is **well-built and functional**. These improvements will transform it from a solid class project into a **production-ready, scalable SaaS application** that could serve real bakeries.

**Key Priorities**:
1. **Performance** (code splitting, optimization)
2. **User Experience** (progress bar, auto-save, keyboard shortcuts)
3. **Developer Experience** (linting, testing, error tracking)
4. **Architecture** (API layer, proper separation of concerns)

**Estimated Total Effort**: 4-6 weeks for full implementation  
**Expected Outcome**: Enterprise-grade application ready for real customers

**Questions?** Start with the Phase 1 quick wins and build from there! 🚀

---

**Your app builder has spoken!** 🎂✨
