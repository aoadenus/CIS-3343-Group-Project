# Emily Bakes Cakes - Unified Design System Documentation

## 🎨 Overview

This is a **dual-interface web application** featuring:
- **Public Front-End**: Customer-facing marketing and ordering site with dark theme
- **Admin Back-End**: Staff management portal with light theme
- **Unified Brand Identity**: Vanilla Raspberry color system throughout

---

## 🌈 Color Palette

### Brand Colors
\`\`\`css
--accent-raspberry: #C44569    /* Primary actions, highlights, CTAs */
--accent-vanilla: #F8EBD7      /* Warm accents, secondary backgrounds */
--accent-chocolate: #5A3825    /* Secondary text, borders */
--charcoal: #2B2B2B            /* Dark neutral */
\`\`\`

### Dark Theme (Public Site)
\`\`\`css
/* Surface Colors */
--surface-primary: #0A0A0A     /* Main background */
--surface-secondary: #1A1A1A   /* Section backgrounds */
--surface-elevated: #252525    /* Cards, raised elements */
--surface-glass: rgba(255, 255, 255, 0.05)  /* Glass-morphism */

/* Text Colors */
--text-primary: #FFFFFF        /* Headings, primary text */
--text-secondary: rgba(255, 255, 255, 0.75)  /* Body text */
--text-tertiary: rgba(255, 255, 255, 0.5)    /* Subtle text */

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.08)
--border-medium: rgba(255, 255, 255, 0.15)
--border-strong: rgba(255, 255, 255, 0.25)
\`\`\`

### Light Theme (Admin Portal)
Applied via `.light-theme` class:
\`\`\`css
--surface-primary: #F8EBD7
--surface-secondary: #FFFFFF
--text-primary: #2B2B2B
--text-secondary: #5A3825
--border-subtle: rgba(90, 56, 37, 0.1)
\`\`\`

---

## 📐 Typography

### Font Stack
\`\`\`css
/* Serif - Display & Headings */
font-family: 'Playfair Display', serif;

/* Sans-Serif - UI & Subheadings */
font-family: 'Poppins', sans-serif;

/* Sans-Serif - Body Text */
font-family: 'Open Sans', sans-serif;

/* Script - Accent Taglines */
font-family: 'Lucida Handwriting', cursive;
\`\`\`

### Type Scale
\`\`\`css
h1: clamp(40px, 8vw, 72px)  /* Hero headings */
h2: clamp(32px, 6vw, 48px)  /* Section headings */
h3: clamp(24px, 5vw, 32px)  /* Card headings */
h4: clamp(18px, 4vw, 24px)  /* List titles */
h5: clamp(16px, 3.5vw, 20px)  /* Small headings */
body: clamp(14px, 2.5vw, 16px)  /* Base text */
\`\`\`

### Font Weights
- **Display**: 700 (Bold)
- **Headings**: 600 (SemiBold)
- **UI Labels**: 500 (Medium)
- **Body**: 400 (Regular)

---

## 📏 Spacing System (8-Point Grid)

\`\`\`css
--space-1: 8px
--space-2: 16px
--space-3: 24px   /* Base padding */
--space-4: 32px
--space-5: 40px
--space-6: 48px
--space-8: 64px
--space-12: 96px  /* Section padding */
\`\`\`

### Usage
- **Component Padding**: 24px (desktop) → 16px (mobile)
- **Section Spacing**: 64-96px vertical
- **Card Gaps**: 24-32px
- **Element Margins**: 8px, 16px, 24px increments

---

## 🔘 Border Radius

\`\`\`css
--radius-sm: 8px     /* Small elements */
--radius-md: 12px    /* Buttons, inputs */
--radius-lg: 16px    /* Cards */
--radius-xl: 24px    /* Large cards */
--radius-full: 9999px  /* Pills, avatars */
\`\`\`

---

## 🌑 Shadows

\`\`\`css
--shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.12)
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.16)
--shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.24)
--shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.32)
\`\`\`

### Light Theme Shadows
\`\`\`css
--shadow-md: 0 2px 8px rgba(90, 56, 37, 0.12)
--shadow-lg: 0 4px 16px rgba(90, 56, 37, 0.18)
\`\`\`

---

## ⚡ Animation & Easing

\`\`\`css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)  /* Material smooth */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  /* Spring bounce */
\`\`\`

### Timing
- **Micro-interactions**: 150-250ms
- **Page transitions**: 300-600ms
- **Entrance animations**: 600-800ms
- **Ambient effects**: 2-10s (infinite)

---

## 🧩 Component Classes

### Buttons
\`\`\`css
.btn-primary
  - Gradient background (#C44569 → #A03355)
  - White text, Poppins SemiBold
  - Shadow: 0 4px 16px rgba(196, 69, 105, 0.3)
  - Hover: translateY(-2px), enhanced shadow

.btn-secondary
  - Transparent background
  - Border: 2px solid var(--border-medium)
  - Hover: Glass effect + Raspberry border
\`\`\`

### Cards
\`\`\`css
.glass-card
  - Background: var(--surface-glass)
  - Backdrop blur: 20px
  - Border: 1px solid var(--border-subtle)
  - Radius: var(--radius-lg)

.surface-elevated
  - Background: var(--surface-elevated)
  - Border + shadow
\`\`\`

### Text Effects
\`\`\`css
.gradient-text
  - Linear gradient: #C44569 → #F8EBD7
  - WebKit background clip
\`\`\`

---

## 📱 Responsive Breakpoints

\`\`\`css
Mobile:   375px - 767px   (4-column grid)
Tablet:   768px - 1023px  (8-column grid)
Desktop:  1024px - 1439px (12-column grid)
Wide:     1440px+         (max-width container)
\`\`\`

### Container
\`\`\`css
.container
  - Max-width: 1440px
  - Padding: 24px (mobile) → 48px (tablet) → 64px (desktop)
\`\`\`

---

## ♿ Accessibility Standards

### Contrast Ratios (WCAG AA)
- **Large Text**: ≥ 3:1
- **Normal Text**: ≥ 4.5:1
- **UI Components**: ≥ 3:1

### Touch Targets
- **Minimum Size**: 44×44 px
- **Spacing**: 8px between interactive elements

### Focus States
\`\`\`css
*:focus-visible
  - Outline: 2px solid var(--accent-raspberry)
  - Outline-offset: 2px
\`\`\`

### Semantic HTML
- Proper heading hierarchy (H1 → H6)
- ARIA labels for icons
- Alt text for images
- Descriptive button text

---

## 🏗️ Application Structure

### Public Pages
\`\`\`
/           → Home (hero, features, testimonials)
/shop       → Product catalog with filters
/builder    → 4-step custom cake builder
/gallery    → Portfolio with lightbox
/about      → Emily's story, team, values
/contact    → Contact form + info
\`\`\`

### Admin Pages
\`\`\`
/dashboard  → KPIs, charts, quick actions
/orders     → Order management table
/customers  → Customer cards + analytics
/products   → Product catalog + customization
/reports    → Revenue charts + metrics
/settings   → Business config + preferences
\`\`\`

### Routing Flow
\`\`\`
1. Welcome Screen (3s animation)
2. Public Site (default)
3. Staff Login → Admin Portal
4. Logout → Back to Public
\`\`\`

---

## 🎭 Motion Design Principles

### Entrance Animations
\`\`\`javascript
fadeInUp: {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}
\`\`\`

### Hover Effects
- **Lift**: translateY(-2px to -4px)
- **Shadow**: Increase elevation
- **Scale**: 1.0 → 1.02 (subtle)

### Parallax
- Background gradients: slow movement
- Hero elements: depth layering

---

## 🔧 Component Patterns

### Card Hover
\`\`\`css
transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
hover: border-color: var(--accent-raspberry);
hover: box-shadow: var(--shadow-lg);
\`\`\`

### Input Focus
\`\`\`css
border: 1px solid var(--border-medium);
focus: border-color: var(--accent-raspberry);
focus: box-shadow: 0 0 0 3px rgba(196, 69, 105, 0.15);
\`\`\`

### Loading States
- Spinner rotation: 360deg, 1s linear infinite
- Skeleton shimmer: gradient animation
- Dots pulse: scale + opacity loop

---

## 📦 File Organization

\`\`\`
/components
  /ui              → shadcn components
  PublicLayout.tsx → Public navigation
  AdminLayout.tsx  → Admin sidebar
  WelcomeScreen.tsx

/pages
  /public          → Customer-facing pages
  /admin           → Staff portal pages
  Dashboard.tsx    → Admin dashboard
  Orders.tsx       → etc.

/styles
  globals.css      → Design tokens + utilities

App.tsx            → Routing logic
\`\`\`

---

## 🚀 Performance Optimizations

### Above-the-Fold
- Hero content prioritized
- Critical CSS inline
- Lazy load below fold

### Images
- Responsive sizing
- Compressed assets
- Fallback components

### Animations
- GPU-accelerated transforms
- Reduced motion support
- Deferred heavy animations

---

## 🎯 Brand Voice

**Tone**: Premium, warm, artisanal  
**Style**: "Apple Meets Crumbl" - modern luxury + comfort  
**Copy**: Confident, personal, detail-oriented  
**Imagery**: High-contrast, elegant, immersive  

---

## 📝 Development Guidelines

1. **Always use design tokens** - No hardcoded colors/spacing
2. **Mobile-first responsive** - Test all breakpoints
3. **Accessibility first** - Keyboard nav + screen readers
4. **Semantic markup** - Proper HTML5 elements
5. **Consistent naming** - Follow BEM-style conventions
6. **Component reuse** - DRY principles
7. **Type safety** - TypeScript interfaces
8. **Performance budget** - Monitor bundle size

---

## 🌟 Key Features

✅ Dual dark/light theme system  
✅ Smooth page transitions  
✅ Glass-morphism effects  
✅ Responsive 375px → 1440px+  
✅ WCAG AA compliant  
✅ 8-point grid system  
✅ 60-30-10 color distribution  
✅ Mobile gesture support  
✅ Keyboard navigation  
✅ SEO-friendly structure  

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Designer**: AI Assistant  
**Brand**: Emily Bakes Cakes
