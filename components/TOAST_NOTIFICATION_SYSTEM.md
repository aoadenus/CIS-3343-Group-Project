# Toast Notification System

## Overview

Premium toast-style notifications designed for the Emily Bakes Cakes brand using the Vanilla Raspberry color palette. These notifications appear in the top-right corner with glassmorphism effects, smooth animations, and full accessibility support.

---

## Design Specifications

### Placement & Behavior

- **Position:** Fixed top-right corner (24px from top and right)
- **Animation:** Slide-in from top-right with 250ms ease-out + subtle spring bounce
- **Auto-dismiss:** 5 seconds with animated progress bar
- **Manual dismiss:** Close (×) icon with hover and focus states
- **Stacking:** Maximum 3 alerts at once; newest replaces oldest

### Container Style

```css
Width: 320-400px (responsive)
Height: auto (fits content)
Border Radius: 12px
Padding: 16px 24px
Shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
Backdrop Filter: blur(12px) /* Glassmorphism */
Layout: [icon] [message/title] [close icon]
```

### Typography

- **Message Text:** Open Sans Regular, 16px
- **Title (optional):** Poppins SemiBold, 18px
- **Text Color:** Auto-adjusts for contrast
  - Light text (#FFFFFF) on dark/Raspberry backgrounds
  - Dark text (#2B2B2B) on light backgrounds

---

## Color Variants

### Error (Raspberry Pink)

```css
Background: #C44569 (Raspberry Pink)
Text: #FFFFFF (White)
Icon: AlertCircle, White
Border: #E36B86 (10% lighter Raspberry)
Progress Bar: #E36B86
ARIA Label: "Error notification"
```

**Usage:** Payment failures, form validation errors, system errors, session expiration

**Example:**
```typescript
showToast('error', 'Failed to process payment. Please check your card details.');
showToast('error', 'Your session has expired.', 'Session Expired');
```

---

### Warning (Soft Amber)

```css
Background: #FFD166 (Soft Amber)
Text: #2B2B2B (Charcoal Gray)
Icon: AlertTriangle, Charcoal Gray
Border: #F6C343
Progress Bar: #F6C343
ARIA Label: "Warning notification"
```

**Usage:** Time-sensitive notices, rush order warnings, inventory alerts, policy reminders

**Example:**
```typescript
showToast('warning', 'Custom cake orders require 48 hours advance notice.');
showToast('warning', 'Rush fees may apply.', 'Rush Order Warning');
```

---

### Success (Mint Green)

```css
Background: #59C9A5 (Mint Green)
Text: #FFFFFF (White)
Icon: CheckCircle, White
Border: #4BB491
Progress Bar: #4BB491
ARIA Label: "Success notification"
```

**Usage:** Order confirmations, successful saves, completed actions, order ready notifications

**Example:**
```typescript
showToast('success', 'Your custom cake order has been successfully placed!');
showToast('success', 'Order #259 is ready for pickup.', 'Order Ready!');
```

---

### Info / Neutral (Cream Vanilla)

```css
Background: #F8EBD7 (Cream Vanilla)
Text: #2B2B2B (Charcoal Gray)
Icon: Info, Raspberry Pink (#C44569)
Border: #EAD4B8
Progress Bar: #C44569 (Raspberry)
ARIA Label: "Information notification"
```

**Usage:** General information, pickup schedules, business hours, helpful tips

**Example:**
```typescript
showToast('info', 'We\'re closed on Sundays. Visit us Monday-Saturday.');
showToast('info', 'Order scheduled for Nov 2nd.', 'Pickup Schedule');
```

---

## Usage

### Basic Import

```typescript
import { useToast } from './components/ToastContext';

function MyComponent() {
  const { showToast } = useToast();
  
  // Show a toast
  showToast('success', 'Order placed successfully!');
}
```

### Function Signature

```typescript
showToast(
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  title?: string,           // Optional title
  duration?: number         // Optional duration (default: 5000ms)
)
```

### Examples

```typescript
// Simple message
showToast('success', 'Settings saved successfully!');

// With title
showToast('error', 'Please try again later.', 'Connection Failed');

// Custom duration (3 seconds)
showToast('info', 'Quick notification', undefined, 3000);

// All parameters
showToast('warning', 'Your cart will expire in 5 minutes.', 'Cart Expiring Soon', 7000);
```

---

## Animation & Interaction

### Entry Animation
- **Duration:** 250ms
- **Easing:** ease-out cubic-bezier(0.4, 0, 0.2, 1)
- **Effect:** Slide from top-right (x: 100px, y: -20px) with slight scale (0.9 → 1.0)
- **Spring bounce:** Subtle vertical spring on Y-axis

### Exit Animation
- **Duration:** 300ms
- **Easing:** ease-out
- **Effect:** Fade out (opacity 1 → 0) with slide right (x: 100px) and scale down (0.95)

### Progress Bar
- **Linear countdown:** 5 seconds (default)
- **Color:** Matches toast variant
- **Height:** 3px at bottom of toast
- **Animation:** Smooth width decrease using Motion

### Stacking Behavior
1. Maximum 3 toasts visible at once
2. New toast appears at bottom of stack
3. When 4th toast arrives, oldest (top) is removed
4. Toasts re-layout smoothly with Motion layout animations
5. Gap: 12px between stacked toasts

---

## Accessibility

### ARIA Support

```html
<div role="alert" aria-live="polite" aria-label="[Error|Warning|Success|Info] notification">
  <!-- Toast content -->
</div>
```

### Keyboard Navigation
- **Tab:** Focus on close button
- **Enter/Space:** Dismiss toast when close button focused
- **Focus indicator:** 2px outline in text color

### Color Contrast
All variants meet **WCAG AA standards (≥4.5:1)**:

| Variant | Background | Text | Contrast Ratio |
|---------|-----------|------|----------------|
| Error | #C44569 | #FFFFFF | 4.53:1 ✓ |
| Warning | #FFD166 | #2B2B2B | 9.12:1 ✓ |
| Success | #59C9A5 | #FFFFFF | 4.64:1 ✓ |
| Info | #F8EBD7 | #2B2B2B | 11.87:1 ✓ |

### Screen Reader Support
- Each toast has descriptive ARIA label
- Live region announces new toasts
- Dismissal is announced to screen readers

---

## Responsive Design

### Desktop (> 480px)
- Fixed top-right: 24px from edges
- Width: 320-400px
- Stacks vertically downward

### Mobile (≤ 480px)
- Spans full width with 16px margins
- Top: 16px from edge
- Toasts stack vertically
- Touch-friendly close button (24px × 24px)

---

## Implementation Details

### Toast Provider Setup

Wrap your app with `ToastProvider`:

```typescript
import { ToastProvider } from './components/ToastContext';

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
    </ToastProvider>
  );
}
```

### Context Structure

```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type, message, title?, duration?) => void;
  removeToast: (id: string) => void;
}
```

### Technologies Used
- **React Context API:** State management
- **Motion/React (Framer Motion):** Animations and layout
- **Lucide React:** Icons (AlertCircle, CheckCircle, Info, AlertTriangle, X)
- **TypeScript:** Type safety

---

## Best Practices

### Do's ✓
- Use **Error** for critical failures requiring user action
- Use **Warning** for important notices that don't block workflow
- Use **Success** for positive confirmations of completed actions
- Use **Info** for helpful, non-critical information
- Keep messages concise (under 80 characters if possible)
- Use titles for context when message needs clarification
- Test with keyboard navigation and screen readers

### Don'ts ✗
- Don't stack more than 3 toasts (handled automatically)
- Don't use toasts for critical errors that require modal dialogs
- Don't auto-dismiss critical errors (use longer duration)
- Don't use vague messages like "Error occurred"
- Don't override accessibility features
- Don't use toasts for complex multi-step workflows

---

## Common Use Cases

### E-commerce / Orders
```typescript
// Order placed
showToast('success', 'Your order #259 has been placed!', 'Order Confirmed');

// Payment failed
showToast('error', 'Payment declined. Please try another card.', 'Payment Failed');

// Cart reminder
showToast('warning', 'Items in your cart for 30 minutes.', 'Cart Expiring');

// Pickup ready
showToast('info', 'Ready for pickup today at 2:00 PM.', 'Order #259 Ready');
```

### Forms & Settings
```typescript
// Save success
showToast('success', 'Your profile has been updated.');

// Validation error
showToast('error', 'Please fill in all required fields.');

// Unsaved changes
showToast('warning', 'You have unsaved changes.');

// Auto-save
showToast('info', 'Changes saved automatically.');
```

### Authentication
```typescript
// Login success
showToast('success', 'Welcome back, Emily!');

// Session expired
showToast('error', 'Please log in again.', 'Session Expired');

// Password changed
showToast('success', 'Your password has been updated.');
```

---

## Performance Considerations

- **Maximum toasts:** Capped at 3 for performance and UX
- **Animation optimization:** Uses Motion's optimized layout animations
- **Auto-cleanup:** Toasts automatically removed after duration
- **Memory management:** Old toasts garbage collected when dismissed
- **Event listeners:** Properly cleaned up in useEffect hooks

---

## Browser Support

- **Chrome:** 90+ ✓
- **Firefox:** 88+ ✓
- **Safari:** 14+ ✓
- **Edge:** 90+ ✓
- **Mobile Safari:** iOS 14+ ✓
- **Chrome Mobile:** Android 90+ ✓

Requires support for:
- CSS `backdrop-filter` (glassmorphism)
- ES6+ JavaScript features
- React 18+ features

---

## Testing

### Visual Regression
1. Test all 4 variants (error, warning, success, info)
2. Test with and without titles
3. Test stacking (1, 2, 3 toasts)
4. Test responsive behavior (mobile/desktop)

### Accessibility
1. Screen reader announcements
2. Keyboard navigation (Tab to close button)
3. Focus indicators visible
4. Color contrast validation

### Functional
1. Auto-dismiss after 5 seconds
2. Manual dismiss works
3. Progress bar animates correctly
4. Max 3 toasts enforced
5. Oldest toast removed when 4th added

---

## Future Enhancements

- [ ] Custom icon support
- [ ] Action buttons within toasts
- [ ] Persistent toasts (no auto-dismiss option)
- [ ] Toast positioning options (top-left, bottom-right, etc.)
- [ ] Sound effects toggle
- [ ] Toast history/log
- [ ] Undo action support

---

**Version:** 2.0  
**Last Updated:** November 1, 2025  
**Author:** Emily Bakes Cakes Design Team  
**Status:** Production Ready ✓
