# Dashboard v2 Component Library

This directory contains the enterprise dashboard component library for Emily Bakes Cakes.

## Purpose

This is a design system foundation for rebuilding the dashboard with consistent, maintainable, and scalable components.

## Design Tokens

All components use design tokens from `src/styles/dashboard-tokens.css`. These tokens include:

- **Brand Colors**: Raspberry Pink, Cream Vanilla, Chocolate Brown, Charcoal Gray
- **Semantic Colors**: Success, Warning, Error, Info
- **Typography Scale**: Display, H1-H6, Body text sizes
- **Spacing System**: 4px base unit with consistent scale
- **Shadow System**: Card, component, and colored shadows
- **Border Radius**: XS to Full with consistent values

## Components

### Layout Components

- **DashboardLayout** - Main wrapper with header, content area, and footer

### Planned Components (Phase 1.2+)

- KPI Cards
- Data Tables
- Modals & Dialogs
- Form Components
- Charts & Visualizations

## Usage

Import components from the index file:

```tsx
import { DashboardLayout } from '@/components/dashboard-v2';

function MyDashboard() {
  return (
    <DashboardLayout pageTitle="Sales Dashboard">
      {/* Your content here */}
    </DashboardLayout>
  );
}
```

## Design Principles

1. **Consistency** - Use design tokens for all styling
2. **Accessibility** - WCAG 2.1 AA compliant
3. **Responsiveness** - Mobile-first approach
4. **Performance** - Optimized for fast rendering
5. **Maintainability** - Clear component structure and documentation

## CSS Variables

All components use CSS variables with the `--db-` prefix:

```css
/* Example usage */
.my-component {
  background: var(--db-color-white);
  color: var(--db-color-charcoal);
  padding: var(--db-space-4);
  border-radius: var(--db-radius-md);
  box-shadow: var(--db-shadow-card);
}
```

## File Structure

```
dashboard-v2/
├── README.md           # This file
├── index.ts            # Export all components
├── DashboardLayout.tsx # Main layout wrapper
└── [future components]
```

## Contributing

When adding new components:

1. Use design tokens for all styling
2. Follow existing component patterns
3. Add TypeScript types for all props
4. Export component in index.ts
5. Document component usage
