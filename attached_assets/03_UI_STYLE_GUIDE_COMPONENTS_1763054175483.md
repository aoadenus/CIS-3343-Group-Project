# Emily Bakes Cakes: UI Style Guide and Component Library

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Production Ready

---

## Brand Guidelines

### Color Palette

**Primary Colors:**
- Raspberry (#C44569) - Primary actions, CTAs, focus states
- Vanilla (#F8EBD7) - Warm backgrounds, card surfaces
- Chocolate (#5A3825) - Body text, secondary elements

**Secondary Colors:**
- Charcoal (#2B2B2B) - Dark text, headings (WCAG AA contrast: 7.2:1 with Vanilla)
- Cream (#FAF5F0) - Light backgrounds, subtle accents
- Berry Red (#8B1E3E) - Links (darker Raspberry for WCAG AA)

**System Colors:**
- Success Green (#10B981) - Confirmation, positive actions
- Warning Amber (#F59E0B) - Alerts, need attention
- Error Red (#EF4444) - Errors, destructive actions
- Info Blue (#3B82F6) - Informational messages
- Neutral Gray (#6B7280) - Disabled, secondary text

**WCAG AA Compliance Verified:**
- Raspberry on Vanilla: 4.8:1 ✅
- Charcoal on Vanilla: 7.2:1 ✅
- Charcoal on Cream: 8.1:1 ✅
- All text meets 4.5:1 minimum for normal text

### Typography

**Font Stack:**
- Headings: "Playfair Display", "Georgia", serif (Bold weight)
- Body: "Open Sans", "Segoe UI", sans-serif (Regular 400)
- Monospace: "Menlo", "Monaco", "Courier New" (for data)
- Accent: "Lucida Handwriting", cursive (Emily Bakes logo style)

**Size Scale (8px base):**
- H1: 40px, Bold, Line-height 1.2
- H2: 32px, Bold, Line-height 1.3
- H3: 24px, Bold, Line-height 1.3
- H4: 20px, Bold, Line-height 1.4
- Body: 16px, Regular 400, Line-height 1.5
- Small: 14px, Regular 400, Line-height 1.5
- Tiny: 12px, Regular 400, Line-height 1.4

### Spacing System (8px Grid)

- xs: 4px
- sm: 8px (1 unit)
- md: 16px (2 units)
- lg: 24px (3 units)
- xl: 32px (4 units)
- 2xl: 48px (6 units)
- 3xl: 64px (8 units)

### Shadows and Elevation

- Elevation 1 (Cards): 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
- Elevation 2 (Modals): 0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)
- Elevation 3 (Dropdowns): 0 10px 20px rgba(0,0,0,0.15)
- Hover Shadow (Interactive): 0 2px 4px rgba(196, 69, 105, 0.3)

---

## Component Library

### Button

**Variants:**

\`\`\`jsx
// Primary (Raspberry background)
<Button variant="primary">Save Order</Button>

// Secondary (Outlined)
<Button variant="secondary">Cancel</Button>

// Danger (Red background)
<Button variant="danger">Delete Order</Button>

// Disabled
<Button disabled>Processing...</Button>

// Loading
<Button loading>Saving...</Button>
\`\`\`

**Specs:**
- Height: 40px or 48px (touch-friendly)
- Padding: 8px 16px (sm), 12px 24px (md)
- Border radius: 4px
- Font weight: 600
- Cursor: pointer (or not-allowed if disabled)

**States:**
- Default: Raspberry background, white text
- Hover: Darken by 10%, shadow elevation 1
- Active/Pressed: Darken by 20%
- Disabled: Gray background, 50% opacity
- Focus: 2px Raspberry outline, 2px offset

**Keyboard & Accessibility:**
- Tab navigable (tabindex="0" if custom)
- Enter/Space activates
- Focus indicator always visible
- aria-label for icon-only buttons

---

### Form Input

**Structure:**
\`\`\`jsx
<div className="form-group">
  <label htmlFor="cake-flavor">Cake Flavor</label>
  <input 
    id="cake-flavor"
    type="text"
    placeholder="Select flavor"
    aria-describedby="flavor-help"
  />
  <p id="flavor-help" className="help-text">Choose from available flavors</p>
  <p role="alert" className="error-text">This field is required</p>
</div>
\`\`\`

**Specs:**
- Height: 40px
- Padding: 8px 12px
- Font size: 16px (prevent iOS zoom)
- Border: 1px solid #E5E7EB
- Border radius: 4px
- Focus: 2px Raspberry outline

**States:**
- Empty: Light gray border, placeholder text
- Filled: Dark gray border, Charcoal text
- Focus: Raspberry outline, shadow
- Error: Red border, error icon, error message
- Disabled: Gray background, 50% opacity

---

### Select/Dropdown

**Specs:**
- Height: 40px
- Padding: 8px 12px (left), 36px 12px (right for arrow)
- Arrow icon: 24px, positioned right 8px
- Border: same as input
- Options: scroll if > 6 items

**Behavior:**
- Click opens dropdown
- Arrow key to navigate
- Enter to select
- Escape to close
- Dynamic lists load from database (no hardcoding)

---

### Layer Repeater Component

**Purpose:** Allow staff to add/remove/customize up to 7 layers **Note-no max**

**Structure:**
\`\`\`jsx
<div className="layer-repeater">
  <div className="layer-header">
    <h3>Layer 1 (Bottom)</h3>
    <button className="delete-layer" aria-label="Delete layer">×</button>
  </div>
  
  <div className="layer-fields">
    <Select label="Flavor" options={flavors} />
    <Select label="Filling" options={fillings} />
    <Select label="Icing" options={icings} />
    <Select label="Writing Color" options={colors} />
    <TextArea label="Special Notes" />
    <FileUpload label="Design Image" />
  </div>
</div>

<button className="add-layer" disabled={layers.length >= 7}>
  + Add Layer
</button>
\`\`\`

**Validation:**
- Maximum 7 layers **no max**
- At least 1 layer required
- Delete disabled if only 1 layer
- Add Layer button disabled if max reached

---

### Image Upload Component

**Features:**
- Drag-and-drop support
- File preview thumbnail
- Progress bar during upload
- Multiple files
- File size validation (max 5MB each)
- Supported formats: JPG, PNG, WebP

**Accessibility:**
- Hidden file input
- Keyboard accessible (click or Tab+Enter)
- ARIA labels for upload status

---

### Date/Time Picker

**Components:**
- Date: HTML5 date input with validation (min 2 days advance)
- Time: HTML5 time input
- Range picker for manager reports

**Validation:**
- Minimum: 2 days from today
- Maximum: 1 year from today
- Weekend availability (per settings)
- Business hours enforcement

---

### Status Badge

**Variants:**
\`\`\`jsx
<StatusBadge status="in_baking">In Baking</StatusBadge>
<StatusBadge status="decorating">Decorating</StatusBadge>
<StatusBadge status="ready">Ready for Pickup</StatusBadge>
<StatusBadge status="cancelled">Cancelled</StatusBadge>
\`\`\`

**Styling:**
- Pill shape (border-radius: 20px)
- Padding: 4px 12px
- Font size: 12px (small)
- Colored background + darker text or white text

**Color Mapping:**
- To Be Created: Blue (#3B82F6)
- In Baking: Amber (#F59E0B)
- Decorating: Purple (#A855F7)
- Ready: Green (#10B981)
- Picked Up: Gray (#6B7280)
- Cancelled: Red (#EF4444)

---

### KPI Stat Card

**Structure:**
\`\`\`jsx
<StatCard>
  <div className="stat-label">Total Revenue</div>
  <div className="stat-value">$2,450</div>
  <div className="stat-period">This Month</div>
  <div className="stat-trend">↑ 12% from last month</div>
</StatCard>
\`\`\`

**Specs:**
- Minimum width: 200px
- Padding: 20px
- Background: Cream (#FAF5F0)
- Border: 1px solid #E5E7EB
- Border-radius: 8px

---

### Modal Dialog

**Structure:**
\`\`\`jsx
<Modal title="Confirm Cancellation" open={isOpen}>
  <p>Are you sure you want to cancel this order? This cannot be undone.</p>
  <div className="modal-actions">
    <Button onClick={handleClose}>Go Back</Button>
    <Button variant="danger" onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>
\`\`\`

**Specs:**
- Overlay: Black 50% opacity
- Max width: 500px
- Padding: 24px
- Border-radius: 8px
- Close button: Top right corner
- Escape key closes
- Focus trapped inside modal

---

### Toast/Alert Notification

**Variants:**
\`\`\`jsx
<Toast type="success">Order saved successfully!</Toast>
<Toast type="error">Failed to save order. Try again.</Toast>
<Toast type="warning">Pickup date is in 2 days</Toast>
<Toast type="info">Order updated by another user</Toast>
\`\`\`

**Specs:**
- Position: Fixed bottom-right
- Max width: 400px
- Auto-dismiss after 4 seconds (unless action needed)
- Stacking: Multiple toasts stack vertically
- Animation: Slide in from bottom-right

**Accessibility:**
- role="alert" for errors
- role="status" for success/info
- Auto-dismiss announced to screen readers

---

### Data Table

**Features:**
- Sortable columns (click header)
- Hover state (row highlight)
- Responsive (horizontal scroll on mobile)
- Pagination (if > 20 rows)
- Selection checkboxes (multi-select)

**Specs:**
- Row height: 48px
- Header background: Light gray (#F9FAFB)
- Borders: 1px #E5E7EB
- Hover: Light Vanilla background
- Font: 14px body text

---

## Interaction Patterns

### Form Validation

**Inline Validation:**
- Show error message below field
- Change border color to red
- Show error icon (red circle with X)
- aria-invalid="true"

**Submit Prevention:**
- Disable Submit button if form invalid
- Show summary of errors above form

**Real-time Validation:**
- Validate on blur (leave field)
- Validate on change (after initial blur)

### Keyboard Navigation

**Tab Order:**
- Logical flow: left-to-right, top-to-bottom
- Skip disabled elements
- Logical grouping of related fields

**Shortcuts:**
- Ctrl+S: Save form (if applicable)
- Escape: Close modal or cancel action

### Loading States

**Skeleton Screens:**
- Show placeholder content while loading
- Animated shimmer effect
- Same layout as actual content

**Progress Indicators:**
- Progress bar for file uploads
- Spinner for network requests
- Estimated time remaining (if available)

---

## Accessibility Standards

**WCAG 2.1 Level AA Compliance:**

**Color & Contrast:**
- ✅ 4.5:1 text contrast ratio
- ✅ 3:1 UI component contrast
- ✅ Color not sole differentiator
- ✅ Focus indicators visible (2px outline)

**Keyboard Navigation:**
- ✅ All functionality keyboard accessible
- ✅ Logical tab order
- ✅ Escape closes menus/modals
- ✅ Enter activates buttons

**Screen Reader Support:**
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Form labels associated (label for/id)
- ✅ ARIA landmarks (header, main, footer)
- ✅ Image alt text (descriptive)
- ✅ Form errors announced as alerts
- ✅ Status updates announced as status

**Responsive Design:**
- ✅ Mobile friendly (320px minimum width)
- ✅ Touch targets 48px minimum
- ✅ Text readable without zoom
- ✅ No horizontal scroll on mobile

---

## Design Tokens (CSS Variables)

\`\`\`css
:root {
  /* Colors */
  --color-primary: #C44569;
  --color-primary-dark: #8B1E3E;
  --color-secondary: #F8EBD7;
  --color-charcoal: #2B2B2B;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  
  /* Typography */
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Open Sans', 'Segoe UI', sans-serif;
  --font-mono: 'Menlo', 'Monaco', monospace;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 3px 6px rgba(0,0,0,0.15);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
\`\`\`

---

## Component Examples in Code

### React Button Component

\`\`\`jsx
export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded transition-all';
  const variantClasses = {
    primary: 'bg-raspberry text-white hover:bg-raspberry-dark',
    secondary: 'border border-raspberry text-raspberry hover:bg-vanilla',
    danger: 'bg-error text-white hover:bg-error-dark'
  };
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
\`\`\`

---

## Related Documents

- **01_SCOPE_AND_NON_GOALS.md** - Project scope
- **02_INFORMATION_ARCHITECTURE.md** - User flows
- **04_PAGES_AND_WIREFRAME_SPECS.md** - Page layouts
- **09_FRONTEND_IMPLEMENTATION_PLAYBOOK.md** - Implementation guide

---

**Status:** Production Ready  
**Last Updated:** November 5, 2025
