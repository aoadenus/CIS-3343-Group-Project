# Emily Bakes Cakes - Component Library
## Standardized Design System

**Last Updated:** November 2, 2025  
**Version:** 1.0

---

## 📦 Component Inventory

| Component | Variants | Sizes | Status |
|-----------|----------|-------|--------|
| StandardButton | 3 | 3 | ✅ Complete |
| StandardInput | 4 states | 1 | ✅ Complete |
| StandardBadge | 5 statuses | 3 | ✅ Complete |
| EmptyState | 5 types | 1 | ✅ Complete |
| SkipLink | 1 | 1 | ✅ Complete |
| NotFound | 1 | 1 | ✅ Complete |

---

## 🔘 StandardButton

### Import
\`\`\`tsx
import { StandardButton } from './components/StandardButton';
\`\`\`

### Variants

#### Primary
\`\`\`tsx
<StandardButton variant="primary">
  Order Now
</StandardButton>
\`\`\`
**Style:**
- Background: #C44569 (Raspberry Pink)
- Text: White
- Hover: Scale 1.05 + shadow

#### Secondary
\`\`\`tsx
<StandardButton variant="secondary">
  Learn More
</StandardButton>
\`\`\`
**Style:**
- Background: White
- Text: #5A3825 (Chocolate Brown)
- Border: 1px solid
- Hover: Lift + border → Raspberry Pink

#### Ghost
\`\`\`tsx
<StandardButton variant="ghost">
  Cancel
</StandardButton>
\`\`\`
**Style:**
- Background: Transparent
- Text: #C44569 (Raspberry Pink)
- Hover: Scale 1.05

---

### Sizes

\`\`\`tsx
<StandardButton size="sm">Small</StandardButton>
<StandardButton size="md">Medium</StandardButton>
<StandardButton size="lg">Large</StandardButton>
\`\`\`

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 36px | 8px 16px | 14px |
| md | 44px | 12px 24px | 16px |
| lg | 48px | 16px 32px | 18px |

---

### With Icons

\`\`\`tsx
import { ArrowRight } from 'lucide-react';

<StandardButton 
  variant="primary"
  icon={<ArrowRight size={20} />}
>
  Continue
</StandardButton>
\`\`\`

---

### States

\`\`\`tsx
// Loading
<StandardButton loading={true}>
  Processing...
</StandardButton>

// Disabled
<StandardButton disabled>
  Unavailable
</StandardButton>

// Full Width
<StandardButton fullWidth>
  Submit Order
</StandardButton>
\`\`\`

---

## 📝 StandardInput

### Import
\`\`\`tsx
import { StandardInput } from './components/StandardInput';
\`\`\`

### Basic Usage

\`\`\`tsx
<StandardInput
  label="Customer Name"
  placeholder="Enter name"
  required
/>
\`\`\`

**Specs:**
- Height: 48px
- Padding: 12px
- Border: 1px solid #2B2B2B
- Radius: 8px
- Focus: Raspberry Pink border + glow

---

### With Icon

\`\`\`tsx
import { Mail } from 'lucide-react';

<StandardInput
  label="Email"
  icon={<Mail size={20} />}
  placeholder="your@email.com"
/>
\`\`\`

---

### With Error

\`\`\`tsx
<StandardInput
  label="Phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  error="Please enter a valid phone number"
/>
\`\`\`

**Error Display:**
- Red border
- Red glow
- Alert icon
- Error message below

---

### With Helper Text

\`\`\`tsx
<StandardInput
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>
\`\`\`

---

### Full Width

\`\`\`tsx
<StandardInput
  label="Message"
  fullWidth
  placeholder="Enter your message..."
/>
\`\`\`

---

## 🏷️ StandardBadge

### Import
\`\`\`tsx
import { StandardBadge, CustomBadge } from './components/StandardBadge';
\`\`\`

### Status Variants

#### Pending
\`\`\`tsx
<StandardBadge status="pending" />
\`\`\`
- Background: #FEF3C7 (Yellow)
- Text: #92400E (Brown)

#### In Progress
\`\`\`tsx
<StandardBadge status="inProgress" />
\`\`\`
- Background: #3B82F6 (Blue)
- Text: White

#### Completed
\`\`\`tsx
<StandardBadge status="completed" />
\`\`\`
- Background: #10B981 (Green)
- Text: White

#### Ready
\`\`\`tsx
<StandardBadge status="ready" />
\`\`\`
- Background: #C44569 (Raspberry Pink)
- Text: White

#### Cancelled
\`\`\`tsx
<StandardBadge status="cancelled" />
\`\`\`
- Background: #6B7280 (Gray)
- Text: White

---

### Sizes

\`\`\`tsx
<StandardBadge status="pending" size="sm" />
<StandardBadge status="pending" size="md" />
<StandardBadge status="pending" size="lg" />
\`\`\`

| Size | Font | Padding | Radius |
|------|------|---------|--------|
| sm | 11px | 2px 8px | 4px |
| md | 12px | 4px 12px | 6px |
| lg | 14px | 6px 16px | 8px |

---

### Custom Badge

\`\`\`tsx
<CustomBadge
  backgroundColor="#8B5CF6"
  textColor="white"
>
  Premium
</CustomBadge>
\`\`\`

---

## 🎭 EmptyState

### Import
\`\`\`tsx
import { EmptyState } from './components/EmptyState';
\`\`\`

### Pre-defined Types

#### Orders
\`\`\`tsx
<EmptyState 
  type="orders"
  onAction={() => navigate('/builder')}
/>
\`\`\`
**Display:**
- Icon: Cake with question mark
- Title: "No orders yet"
- CTA: "Create Order"

#### Products
\`\`\`tsx
<EmptyState 
  type="products"
  onAction={() => setShowAddProduct(true)}
/>
\`\`\`

#### Customers
\`\`\`tsx
<EmptyState 
  type="customers"
  onAction={() => navigate('/orders')}
/>
\`\`\`

#### Gallery
\`\`\`tsx
<EmptyState 
  type="gallery"
  onAction={() => setShowUpload(true)}
/>
\`\`\`

#### Custom
\`\`\`tsx
<EmptyState 
  type="custom"
  title="No reviews yet"
  description="Customers can leave reviews after pickup."
  actionLabel="View Orders"
  onAction={() => navigate('/orders')}
/>
\`\`\`

---

## 🔗 SkipLink

### Import
\`\`\`tsx
import { SkipLink } from './components/SkipLink';
\`\`\`

### Usage

\`\`\`tsx
function App() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">
        {/* Your content */}
      </main>
    </>
  );
}
\`\`\`

**Features:**
- Hidden until keyboard focus
- Jumps to #main-content
- Raspberry Pink background
- Smooth animation

---

## ❌ NotFound (404 Page)

### Import
\`\`\`tsx
import NotFound from './pages/NotFound';
\`\`\`

### Usage

\`\`\`tsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/shop" element={<Shop />} />
  {/* ... other routes */}
  <Route path="*" element={<NotFound />} />
</Routes>
\`\`\`

**Features:**
- Playful copy: "This page got eaten! 🍰"
- Two CTAs (Home, Back)
- Brand-consistent design
- Responsive

---

## 📏 Spacing Scale

### CSS Variables

\`\`\`css
:root {
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  --spacing-2xl: 64px;
}
\`\`\`

### Usage

\`\`\`tsx
// Inline styles
<div style={{ padding: '24px', marginBottom: '16px' }}>
  {/* Content */}
</div>

// Tailwind
<div className="p-6 mb-4">
  {/* 24px padding, 16px margin */}
</div>
\`\`\`

### Application Guide

| Value | Usage |
|-------|-------|
| 8px | Icon gaps, tight spacing |
| 16px | Form field spacing, small margins |
| 24px | Card padding, section gaps |
| 32px | Large section padding |
| 48px | Hero padding, major sections |
| 64px | Page sections, extra large spacing |

---

## 🎨 Color System

### Primary Colors

\`\`\`tsx
const colors = {
  raspberry: '#C44569',
  cream: '#F8EBD7',
  chocolate: '#5A3825',
  charcoal: '#2B2B2B'
};
\`\`\`

### Status Colors

\`\`\`tsx
const statusColors = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  inProgress: { bg: '#3B82F6', text: '#FFFFFF' },
  completed: { bg: '#10B981', text: '#FFFFFF' },
  ready: { bg: '#C44569', text: '#FFFFFF' },
  cancelled: { bg: '#6B7280', text: '#FFFFFF' },
  error: { bg: '#EF4444', text: '#FFFFFF' }
};
\`\`\`

### 60-30-10 Rule

- **60%** Backgrounds: #F8EBD7 (Cream Vanilla)
- **30%** Text: #5A3825 (Chocolate Brown)
- **10%** Accents: #C44569 (Raspberry Pink)

---

## 🔤 Typography Scale

### Font Families

\`\`\`css
--font-heading: 'Playfair Display', serif;
--font-subheading: 'Poppins', sans-serif;
--font-body: 'Open Sans', sans-serif;
--font-accent: 'Lucida Handwriting', cursive;
\`\`\`

### Semantic Headings

\`\`\`tsx
<h1>Page Title</h1>          {/* 28px - 48px */}
<h2>Section Heading</h2>     {/* 24px - 36px */}
<h3>Subsection</h3>          {/* 20px - 28px */}
<h4>Card Title</h4>          {/* 18px - 24px */}
<h5>Minor Heading</h5>       {/* 16px - 20px */}
<h6>Small Heading</h6>       {/* 14px - 18px */}
\`\`\`

### Body Text

\`\`\`tsx
<p>Body text</p>             {/* 16px, Open Sans */}
<span>Small text</span>      {/* 14px, Open Sans */}
<small>Caption</small>       {/* 13px, Open Sans */}
\`\`\`

---

## 🎯 Usage Examples

### Login Form

\`\`\`tsx
import { StandardButton, StandardInput } from './components/...';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={handleSubmit}>
      <StandardInput
        label="Email"
        type="email"
        icon={<Mail size={20} />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
        fullWidth
      />

      <StandardInput
        label="Password"
        type="password"
        icon={<Lock size={20} />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        helperText="Must be at least 8 characters"
        required
        fullWidth
      />

      <StandardButton
        variant="primary"
        size="lg"
        fullWidth
        type="submit"
      >
        Sign In
      </StandardButton>

      <StandardButton
        variant="ghost"
        fullWidth
        onClick={() => navigate('/forgot-password')}
      >
        Forgot Password?
      </StandardButton>
    </form>
  );
}
\`\`\`

---

### Order Status Display

\`\`\`tsx
import { StandardBadge } from './components/StandardBadge';

function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-header">
        <h4>Order #{order.id}</h4>
        <StandardBadge status={order.status} size="md" />
      </div>
      
      <div className="order-details">
        <p>{order.cake}</p>
        <p>Pickup: {order.pickupDate}</p>
      </div>
      
      <StandardButton
        variant="secondary"
        size="sm"
        onClick={() => viewOrder(order.id)}
      >
        View Details
      </StandardButton>
    </div>
  );
}
\`\`\`

---

### Empty Orders List

\`\`\`tsx
import { EmptyState } from './components/EmptyState';

function OrdersList() {
  const orders = useOrders();

  if (orders.length === 0) {
    return (
      <EmptyState
        type="orders"
        onAction={() => navigate('/builder')}
      />
    );
  }

  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
\`\`\`

---

## ♿ Accessibility Features

### Focus Indicators

All components include:
- ✅ 2px Raspberry Pink outline
- ✅ 2px offset
- ✅ Visible on keyboard focus
- ✅ Hidden for mouse users

### ARIA Labels

\`\`\`tsx
// Buttons with icons only
<button aria-label="Edit order">
  <EditIcon aria-hidden="true" />
</button>

// Status badges
<StandardBadge 
  status="pending" 
  role="status"
  aria-label="Status: Pending"
/>

// Form errors
<input 
  aria-invalid={!!error}
  aria-describedby="field-error"
/>
<div id="field-error" role="alert">
  {error}
</div>
\`\`\`

### Keyboard Navigation

All components are keyboard accessible:
- Tab to navigate
- Enter/Space to activate
- Escape to close (modals, dropdowns)
- Arrow keys (where appropriate)

---

## 📱 Responsive Behavior

### Breakpoints

\`\`\`css
/* Mobile */
@media (max-width: 767px) {
  .button-group {
    flex-direction: column;
  }
  
  .standard-button {
    width: 100%;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Optimized for tablet */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full desktop experience */
}
\`\`\`

### Touch Targets

All interactive elements:
- Minimum 44x44px
- Adequate spacing (8px+)
- Touch-friendly hover states

---

## 🧪 Testing Checklist

### Component Testing

- [ ] All variants render correctly
- [ ] All sizes display properly
- [ ] Icons align correctly
- [ ] Loading states work
- [ ] Disabled states are clear
- [ ] Error states are visible
- [ ] Hover effects are smooth
- [ ] Focus indicators appear

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Error messages announced
- [ ] Form validation works

### Responsive Testing

- [ ] Mobile (375px) works
- [ ] Tablet (768px) works
- [ ] Desktop (1024px+) works
- [ ] Touch targets adequate
- [ ] Text remains legible
- [ ] Buttons don't overflow

---

## 📚 Related Documentation

- [REFINEMENTS_5-10_COMPLETE.md](./REFINEMENTS_5-10_COMPLETE.md) - Full implementation details
- [UNIFIED_DESIGN_SYSTEM.md](./UNIFIED_DESIGN_SYSTEM.md) - Design system overview
- [MOBILE_RESPONSIVE_DESIGN.md](./MOBILE_RESPONSIVE_DESIGN.md) - Mobile guidelines
- [REFINEMENT_COMPLETE.md](./REFINEMENT_COMPLETE.md) - Previous refinements

---

## 🚀 Quick Start

### 1. Install Components

Components are located in:
\`\`\`
/components/
├── StandardButton.tsx
├── StandardInput.tsx
├── StandardBadge.tsx
├── EmptyState.tsx
├── SkipLink.tsx
└── ...
\`\`\`

### 2. Import and Use

\`\`\`tsx
import { 
  StandardButton, 
  StandardInput, 
  StandardBadge 
} from './components/...';

function MyComponent() {
  return (
    <div>
      <StandardInput label="Name" />
      <StandardButton variant="primary">
        Submit
      </StandardButton>
    </div>
  );
}
\`\`\`

### 3. Apply Spacing

Use the standardized spacing scale:
\`\`\`tsx
<div style={{ padding: '24px', marginBottom: '16px' }}>
  {/* Content */}
</div>
\`\`\`

### 4. Test Accessibility

\`\`\`tsx
// Always include proper labels
<button aria-label="Close menu">
  <X />
</button>

// Test keyboard navigation
// Test with screen reader
// Verify color contrast
\`\`\`

---

**Version:** 1.0  
**Components:** 6  
**Variants:** 15+  
**Status:** ✅ Production Ready

**Created:** November 2, 2025
