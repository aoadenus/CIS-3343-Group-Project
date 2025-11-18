# 🚀 ORDER WIZARD - QUICK START GUIDE
## For Developers & QA Testing

**Last Updated**: November 18, 2025

---

## 🎯 TESTING THE ENHANCEMENTS

### **Quick Test Script** (5 minutes)

1. **Start the App**:
   ```bash
   npm run dev
   ```

2. **Navigate to Order Creation**:
   - Login as Sales user
   - Click "Create New Order"

3. **Test Business Rules**:

#### **Test 1: 4-Hour Buffer Rule** ⏰
```
Step 8 → Pickup Details
1. Select TODAY's date
2. Select time < 4 hours from now (e.g., if it's 2PM, select 5PM)
3. ✅ Expected: Red error "Pickup must be at least 4 hours from now"
4. Change time to 6:30PM (4+ hours away)
5. ✅ Expected: Green success "4 hours, 30 minutes until pickup"
```

#### **Test 2: 2-Day Minimum** 📅
```
Step 8 → Pickup Details
1. Select TOMORROW's date
2. ✅ Expected: Red rush order banner appears
3. ⚠️ Message: "Less than 2 days - rush order requires manager approval"
4. Try clicking Next without approval
5. ✅ Expected: Cannot proceed
6. Check "Manager Approval" checkbox
7. ✅ Expected: Can now proceed
```

#### **Test 3: 50% Deposit** 💰
```
Step 7 → Pricing
1. Total shows (e.g., $85.00)
2. Try entering $20.00 deposit
3. ✅ Expected: Error banner "Minimum deposit is $42.50 (50% of total)"
4. Enter $45.00
5. ✅ Expected: Green success "Deposit requirement met"
```

---

##  📋 NEW VALIDATION FUNCTIONS

### **Import from `utils/validation.ts`**:

```typescript
import {
  isPickupTimeValid,      // 4-hour buffer check
  getRushOrderStatus,     // Comprehensive rush analysis
  validateDeposit,        // 50% deposit validation
  formatHoursUntil,       // "2 days, 5 hours"
  isPickupInPast,         // Past date detection
  validateRequiredField,  // Generic required check
} from '@/utils/validation';
```

### **Usage Examples**:

```typescript
// Check 4-hour buffer
const result = isPickupTimeValid('2025-11-18', '18:30');
if (!result.valid) {
  console.log(result.error); // "Pickup must be at least 4 hours from now"
}

// Get rush status
const rushStatus = getRushOrderStatus('2025-11-19');
console.log(rushStatus.message); // "Less than 2 days - rush order..."

// Validate deposit
const depositCheck = validateDeposit(4000, 8500); // cents
console.log(depositCheck.error); // "Minimum deposit is $42.50..."
```

---

## 🎨 NEW UI COMPONENTS

### **FormField** - Enterprise Form Fields

```tsx
import { FormField } from '@/components/ui/FormField';

<FormField
  label="Event Date"
  htmlFor="eventDate"
  required
  error={errorMessage}
  success="Date looks good!"
  helpText="Orders require 2-day advance notice"
  hint="(required)"
>
  <Input id="eventDate" type="date" />
</FormField>
```

**Props**:
- `label` - Field label text
- `htmlFor` - Matches input id (for accessibility)
- `required` - Shows red asterisk
- `error` - Error message (red banner with icon)
- `success` - Success message (green banner with checkmark)
- `hint` - Small text after label "(optional)"
- `helpText` - Info box before input

---

### **BusinessRuleBanner** - Rule Display

```tsx
import { BusinessRuleBanner, RushOrderBanner } from '@/components/ui/BusinessRuleBanner';

// General banner
<BusinessRuleBanner
  type="info"  // info | warning | error | success
  title="Business Rule"
  message="Description..."
/>

// Rush order specific
<RushOrderBanner
  daysUntil={1.5}
  hoursUntil={36}
  requiresApproval={true}
  approved={managerApproval}
  onApprovalChange={(checked) => setManagerApproval(checked)}
/>
```

---

## 🔍 DEBUGGING TIPS

### **Console Logs Added**:

```typescript
// Step 8 validation logs
console.log('Date validation:', {
  eventDate: formData.eventDate,
  isAtLeast2Days: isDateAtLeastDaysAway(formData.eventDate, 2),
  daysUntil: daysUntil(formData.eventDate)
});

console.log('Time validation:', {
  pickupTime: formData.pickupTime,
  validation: isPickupTimeValid(formData.eventDate, formData.pickupTime)
});
```

### **Check Browser Console**:
- Validation errors show in console
- "API not available, using mock data" messages
- Rush order detection logs

---

## 🐛 COMMON ISSUES & FIXES

### **Issue 1: "pickupTime is undefined"**
**Fix**: Make sure WizardContext initializes with:
```typescript
pickupTime: ''  // in INITIAL_FORM_DATA
```

### **Issue 2: Validation not triggering**
**Fix**: Check useEffect dependencies:
```typescript
useEffect(() => {
  // validation logic
}, [formData.eventDate, pickupTime]);  // Include both!
```

### **Issue 3: FormField import error**
**Fix**: Check path is correct:
```typescript
import { FormField } from '@/components/ui/FormField';
// OR
import { FormField } from '../../../../components/ui/FormField';
```

---

## 📱 MOBILE TESTING

**Responsive Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Test on**:
- Chrome DevTools (Cmd+Option+I → Device Mode)
- iPhone SE (375px)
- iPad (768px)

**Check**:
- ✅ Buttons are tap-friendly (44px minimum)
- ✅ Text is readable (14px minimum)
- ✅ Banners don't overflow
- ✅ Form fields stack vertically

---

## 🎯 VALIDATION CHECKLIST

### **Step 8 Pickup - All Validations**:

```typescript
export function validateStep8(formData: any): boolean {
  // 1. Required fields
  if (!formData.eventDate) return false;
  if (!formData.pickupTime) return false;
  
  // 2. Not in past
  if (isPickupInPast(formData.eventDate, formData.pickupTime)) return false;
  
  // 3. 2-day minimum (unless manager approved)
  if (!isDateAtLeastDaysAway(formData.eventDate, 2)) {
    if (!formData.managerApproval) return false;
  }
  
  // 4. 4-hour buffer
  const timeValid = isPickupTimeValid(formData.eventDate, formData.pickupTime);
  if (!timeValid.valid) return false;
  
  // 5. Rush approval if needed
  if (formData.isRushOrder && !formData.managerApproval) return false;
  
  return true;
}
```

---

## 🎨 ACCESSIBILITY TESTING

### **Screen Reader Test**:
```bash
# macOS VoiceOver
Cmd + F5

# Windows Narrator
Windows + Ctrl + Enter
```

**Test Flow**:
1. Navigate to Step 8
2. Tab through all fields
3. Check error announcements
4. Verify field labels

**Expected Behavior**:
- ✅ Labels read before inputs
- ✅ Errors announced with "alert"
- ✅ Success states announced
- ✅ Help text associated with fields

---

## 🚀 PERFORMANCE

**Validation Timing**:
- Date validation: Immediate (on change)
- Time validation: 300ms debounce
- Rush detection: Immediate
- Deposit calc: Immediate

**No Performance Issues**:
- ✅ < 100ms validation time
- ✅ No unnecessary re-renders
- ✅ Memoized calculations

---

## 📊 TEST DATA

### **Good Test Cases**:

```javascript
// Valid same-day order (>4 hours)
{
  eventDate: '2025-11-18',  // Today
  pickupTime: '20:00',       // 8 PM (if now is before 4 PM)
}

// Valid rush order (with approval)
{
  eventDate: '2025-11-19',  // Tomorrow
  pickupTime: '14:00',
  managerApproval: true
}

// Valid standard order
{
  eventDate: '2025-11-22',  // 4 days away
  pickupTime: '12:00'
}
```

### **Invalid Test Cases**:

```javascript
// TOO SOON - 4-hour buffer violated
{
  eventDate: '2025-11-18',  // Today
  pickupTime: '15:00',       // Only 1 hour away (if now is 2 PM)
}

// RUSH WITHOUT APPROVAL
{
  eventDate: '2025-11-19',  // Tomorrow
  pickupTime: '14:00',
  managerApproval: false     // Missing!
}

// IN THE PAST
{
  eventDate: '2025-11-17',  // Yesterday
  pickupTime: '12:00'
}
```

---

## 🔗 RELATED FILES

**Core Files**:
- `src/utils/validation.ts` - All validation functions
- `src/components/ui/FormField.tsx` - Form field component
- `src/components/ui/BusinessRuleBanner.tsx` - Banner components
- `src/pages/admin/order-create/steps/Step8Pickup.tsx` - Enhanced step
- `src/pages/admin/order-create/WizardContext.tsx` - Form state

**Documentation**:
- `ORDER_WIZARD_REFINEMENTS_COMPLETE.md` - Full technical doc
- `QUICK_START_PRESENTATION.md` - Presentation guide

---

## ✅ READY FOR PRESENTATION

**Demo Flow** (3 minutes):

1. **Show Business Rules Banner** (30 sec)
   - Point out all 3 requirements listed

2. **Demo 4-Hour Buffer** (60 sec)
   - Select today, invalid time → error
   - Select valid time → success

3. **Demo Rush Order** (60 sec)
   - Select tomorrow → rush banner
   - Try to proceed → blocked
   - Check approval → success

4. **Show Validation Feedback** (30 sec)
   - Inline errors
   - Success states
   - Help text

**Key Points to Mention**:
- ✅ All case study requirements implemented
- ✅ Enterprise-grade UX with accessibility
- ✅ Real-time validation with clear feedback
- ✅ Business rules enforced at multiple levels

---

**Questions?** Check `ORDER_WIZARD_REFINEMENTS_COMPLETE.md` for full details!

**Happy Testing!** 🎂✨
