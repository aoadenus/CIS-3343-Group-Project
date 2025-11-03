## Overview
This project is for "Emily Bakes Cakes," a dual-interface web application. It features a public-facing website for customers to browse products, build custom cakes, and view galleries, and an administrative portal for staff to manage orders, customers, products, and reports. The goal is to provide a warm and inviting customer experience alongside an efficient staff management system.

## User Preferences
- **HOMEPAGE LOCKED**: The homepage design is finalized and stable. No major changes should be made without explicit user clarification and acceptance.

## System Architecture
The application is built using React 18.3.1 with TypeScript, Vite 6.3.5, and Tailwind CSS 4.1. It utilizes Radix UI primitives for components, Framer Motion for animations, React Hook Form for forms, and Recharts for data visualization. Key design decisions include:

### UI/UX Decisions
- **Color Palette**: "Vanilla Raspberry" (Raspberry Pink, Cream, Charcoal, Soft Gray).
- **Typography**: Playfair Display for headings, Poppins for subheadings, Open Sans for body text.
- **Responsiveness**: Fully responsive design targeting WCAG AA accessibility compliance.
- **Animations**: Smooth transitions and animations are integrated throughout using Framer Motion.
- **Theming**: Dark mode support is included.
- **Loading States**: Implemented with skeleton screens.
- **Z-Index Layering**: Standardized hierarchy to prevent conflicts: Navigation Bar (9999), Mobile Menu (9998), Hero Content (3), Overlays (2), Images (1).

### Technical Implementations
- **Public Interface**: Includes a home page, product shop, custom cake builder, photo gallery, about page, and contact form.
- **Admin Interface**: Features a dashboard with analytics (using Recharts), order management with a Kanban board (drag-and-drop), customer database, product management, and reporting.
- **Mock Data System**: Comprehensive mock data (products, orders, customers, sales analytics) is used for development and demonstration of admin features, including a toggle for different datasets.
- **Search Bar**: A smart search bar with autosuggest, keyboard navigation, and debounced search is implemented.
- **Component Design**: Reusable components, including interactive `ProductCard` with hover effects and quick actions.
- **Accessibility**: Focus on ARIA labels and touch target sizes.

### System Design Choices
- **Project Structure**: Organized into `src/components`, `src/pages` (public and admin), `src/styles`, and `src/assets`.
- **Vite Configuration**: Configured for the Replit environment (port 5000, host 0.0.0.0) with HMR and proper asset path resolution.
- **Build Output**: Production builds target the `build/` directory.

## External Dependencies
- **React**: Frontend library.
- **TypeScript**: Language.
- **Vite**: Build tool.
- **Tailwind CSS**: Styling framework.
- **Radix UI**: UI component primitives.
- **Framer Motion**: Animation library.
- **React Hook Form**: Form management.
- **Recharts**: Charting library.
- **Lucide React**: Icon library.
- **Sonner**: Toast notifications.
- **React DnD**: Drag-and-drop functionality (for admin order board).