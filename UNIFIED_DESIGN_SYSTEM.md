# Emily Bakes Cakes - Unified Design System

## Overview
This document defines the complete visual system for Emily Bakes Cakes - a modern, accessible, high-contrast design system that ensures consistency across all pages, components, and states.

---

## Color System

### Primary Brand Colors

\`\`\`css
--color-raspberry: #C44569   /* Primary: CTAs, accents, highlights ONLY */
--color-cream: #F8EBD7        /* Background base for light mode areas */
--color-charcoal: #2B2B2B     /* Surface dark: panels, footer, admin sections */
--color-white: #FFFFFF        /* Pure white for cards and surfaces */
--color-soft-gray: #E9E9E9    /* Dividers and secondary backgrounds */
\`\`\`

### Text Colors (Auto-Adjusting)

\`\`\`css
--text-on-light: #2B2B2B              /* Dark text on light backgrounds */
--text-on-dark: #FFFFFF               /* Light text on dark backgrounds */
--text-muted-light: rgba(43,43,43,0.65)  /* Muted on light */
--text-muted-dark: rgba(255,255,255,0.75) /* Muted on dark */
\`\`\`

### Semantic Colors

\`\`\`css
--color-success: #10B981   /* Green - for success states */
--color-error: #EF4444     /* Red - for error states */
--color-warning: #F59E0B   /* Yellow/Amber - for warnings */
--color-info: #3B82F6      /* Blue - for informational states */
\`\`\`

### Critical Rules

❌ **NEVER** use Chocolate Brown (#5A3825) for buttons or large blocks
❌ **NEVER** use overly dark or muddy tones - maintain clean, legible design
✅ **ALWAYS** maintain 4.5:1 contrast ratio minimum (WCAG AA)
✅ **ALWAYS** auto-adjust text color based on background brightness

---

## Typography System

### Font Families

\`\`\`css
Primary Heading: 'Playfair Display', serif
Subheadings: 'Poppins', sans-serif
Body Text: 'Open Sans', sans-serif
Accent Script: 'Lucida Handwriting', cursive (taglines/quotes ONLY)
\`\`\`

### Typography Hierarchy

#### H1 - Main Headings
- **Font:** Playfair Display Bold
- **Size:** 40-48px (clamp based on viewport)
- **Line Height:** 120%
- **Letter Spacing:** -0.02em
- **Usage:** Primary page titles, hero statements
- **Weight:** 700 (Bold)

\`\`\`css
h1 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(40px, 5vw, 48px);
  line-height: 1.2;
  letter-spacing: -0.02em;
}
\`\`\`

#### H2-H4 - Subheadings
- **Font:** Poppins SemiBold
- **Size:** 24-32px (responsive)
- **Line Height:** 130-140%
- **Usage:** Section headers, card titles
- **Weight:** 600 (SemiBold)

\`\`\`css
h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: clamp(28px, 4vw, 32px);
  line-height: 1.3;
}

h3 {
  font-size: clamp(22px, 3.5vw, 28px);
}

h4 {
  font-size: clamp(18px, 3vw, 24px);
}
\`\`\`

#### Body Text
- **Font:** Open Sans Regular
- **Size:** 16-18px
- **Line Height:** 170%
- **Usage:** Paragraphs, forms, table data
- **Weight:** 400 (Regular)

\`\`\`css
p {
  font-family: 'Open Sans', sans-serif;
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.7;
}
\`\`\`

#### Accent Script
- **Font:** Lucida Handwriting Italic
- **Size:** 18-20px
- **Usage:** Taglines, quotes ONLY
- **Weight:** Italic

\`\`\`css
.tagline {
  font-family: 'Lucida Handwriting', cursive;
  font-style: italic;
  font-size: clamp(18px, 2.5vw, 20px);
}
\`\`\`

---

## Component Styles

### Buttons

#### Primary Button
\`\`\`css
.btn-primary {
  background: #C44569;          /* Raspberry Pink */
  color: #FFFFFF;               /* White text */
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 32px;
  border-radius: 8px;           /* 8px radius */
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  min-height: 48px;
  min-width: 44px;
}

.btn-primary:hover {
  background: #D15577;          /* Brighten by ~10% */
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transform: translateY(-1px);
}
\`\`\`

#### Secondary Button
\`\`\`css
.btn-secondary {
  background: transparent;       /* Or white */
  color: #C44569;               /* Raspberry text */
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 32px;
  border-radius: 8px;
  border: 2px solid #C44569;    /* Raspberry border */
  min-height: 48px;
  min-width: 44px;
}

.btn-secondary:hover {
  background: rgba(196,69,105,0.08);
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}
\`\`\`

### Input Fields

\`\`\`css
.input-field {
  background: #FFFFFF;           /* Light background */
  border: 1px solid #E0E0E0;    /* 1px border */
  border-radius: 8px;
  color: #2B2B2B;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  padding: 12px 16px;
  min-height: 48px;
}

.input-field:focus {
  outline: none;
  border-color: #C44569;        /* Raspberry focus */
  box-shadow: 0 0 0 3px rgba(196,69,105,0.15);
}
\`\`\`

### Cards

\`\`\`css
.card {
  background: #FFFFFF;          /* White background */
  border-radius: 12px;          /* 12px radius */
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 24px;                /* Minimum 24px padding */
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
\`\`\`

---

## Layout System

### 8-Point Grid System

All spacing uses multiples of 8:

\`\`\`css
--space-1: 8px
--space-2: 16px
--space-3: 24px     /* Minimum card/section padding */
--space-4: 32px
--space-5: 40px
--space-6: 48px
--space-8: 64px
--space-12: 96px
\`\`\`

### Container

\`\`\`css
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;              /* Mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 0 48px;            /* Tablet */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 64px;            /* Desktop */
  }
}
\`\`\`

### Visual Hierarchy Rules

✅ Use bold, confident headers
✅ Apply ample whitespace for premium feel
✅ Align headers and CTAs vertically for strong rhythm
✅ Minimum 24px padding inside cards and sections
✅ Maintain consistent visual weight across pages

---

## Shadows

\`\`\`css
--shadow-card: 0 2px 8px rgba(0,0,0,0.08)
--shadow-hover: 0 4px 16px rgba(0,0,0,0.12)
--shadow-button: 0 2px 6px rgba(0,0,0,0.12)
--shadow-raspberry: 0 4px 16px rgba(196,69,105,0.3)
\`\`\`

---

## Accessibility Standards

### Contrast Requirements

- **WCAG AA Minimum:** 4.5:1 for normal text, 3:1 for large text
- **Light Text:** Only on Charcoal (#2B2B2B) or Raspberry (#C44569) backgrounds
- **Dark Text:** Only on Cream (#F8EBD7) or White (#FFFFFF) backgrounds

### Touch Targets

\`\`\`css
/* Minimum 44x44px (WCAG 2.1 AAA) */
button, a[role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile: 48x48px recommended */
@media (max-width: 767px) {
  button {
    min-height: 48px;
  }
}
\`\`\`

### Focus States

\`\`\`css
*:focus-visible {
  outline: 2px solid #C44569;
  outline-offset: 2px;
}
\`\`\`

---

## Responsive Breakpoints

\`\`\`css
/* Mobile First Approach */
@media (max-width: 767px)    /* Mobile */
@media (min-width: 768px)    /* Tablet */
@media (min-width: 1024px)   /* Desktop */
@media (min-width: 1440px)   /* Large Desktop */
\`\`\`

---

## Implementation Checklist

### Phase 1: Foundation
- [x] Update globals.css with unified design tokens
- [x] Establish typography hierarchy
- [x] Define color system with accessibility rules
- [x] Create button and input component styles

### Phase 2: Component Audit
- [ ] Review all components for color consistency
- [ ] Replace non-system colors with design tokens
- [ ] Ensure all buttons use `.btn-primary` or `.btn-secondary`
- [ ] Verify all cards use white background with proper shadow

### Phase 3: Typography
- [ ] Apply bold headers across all pages
- [ ] Ensure H1 uses Playfair Display Bold
- [ ] Ensure H2-H4 use Poppins SemiBold
- [ ] Remove any incorrect font usage

### Phase 4: Accessibility
- [ ] Verify 4.5:1 contrast on all text
- [ ] Ensure touch targets meet 44x44px minimum
- [ ] Test keyboard navigation with focus states
- [ ] Add ARIA labels where needed

### Phase 5: Visual Harmony
- [ ] Harmonize public and admin interfaces
- [ ] Ensure consistent spacing (8-point grid)
- [ ] Apply uniform shadows and borders
- [ ] Test responsive behavior at all breakpoints

---

## Common Patterns

### Hero Section
\`\`\`css
.hero {
  background: linear-gradient(rgba(43,43,43,0.7), rgba(43,43,43,0.7)),
              url('hero-image.jpg');
  color: #FFFFFF;              /* Light text on dark */
  padding: 96px 24px;
}
\`\`\`

### Dark Surface Panel
\`\`\`css
.surface-dark {
  background: #2B2B2B;         /* Charcoal */
  color: #FFFFFF;              /* Light text */
  padding: 48px 24px;
}
\`\`\`

### Light Content Section
\`\`\`css
.section-light {
  background: #F8EBD7;         /* Cream */
  color: #2B2B2B;              /* Dark text */
  padding: 96px 24px;
}
\`\`\`

---

## Don'ts

❌ Never use brown buttons or dark muddy tones
❌ Never use light text on light backgrounds
❌ Never use dark text on dark backgrounds
❌ Never skip the 8-point grid spacing
❌ Never use Chocolate Brown for prominent UI elements
❌ Never sacrifice contrast for aesthetics
❌ Never use more than 3 font families
❌ Never create buttons smaller than 44x44px

---

## Result

A visually unified, high-contrast, elegant dual-interface web application with:

✅ Consistent color palette across all pages
✅ Bold, confident typography hierarchy
✅ Accessible, WCAG AA compliant design
✅ Responsive layouts that work on all devices
✅ Premium feel with refined professional tone
✅ Light text on dark, dark text on light
✅ Clean, modern components with proper spacing

---

**Last Updated:** November 1, 2025
**Version:** 2.0
**Maintainer:** Emily Bakes Cakes Design Team
