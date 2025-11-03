## Overview
This project is for "Emily Bakes Cakes," a dual-interface web application. It features a public-facing website for customers to browse products, build custom cakes, and view galleries, and an administrative portal for staff to manage orders, customers, products, and reports. The goal is to provide a warm and inviting customer experience alongside an efficient staff management system.

## User Preferences
- **HOMEPAGE LOCKED**: The homepage design is finalized and stable. No major changes should be made without explicit user clarification and acceptance.
- **NAVIGATION BAR LOCKED**: The navigation bar design and functionality are finalized. No changes without explicit approval.
- **MOBILE MENU LOCKED**: The mobile menu layout, spacing, and close button are finalized. No changes without explicit approval.
- **FOOTER LOCKED**: The footer design and layout are finalized. No changes without explicit approval.

## System Architecture
The application is built using React 18.3.1 with TypeScript, Vite 6.3.5, and Tailwind CSS 4.1. It utilizes Radix UI primitives for components, Framer Motion for animations, React Hook Form for forms, and Recharts for data visualization. Key design decisions include:

### UI/UX Decisions
- **Color Palette**: "Vanilla Raspberry" (Raspberry Pink, Cream, Charcoal, Soft Gray).
- **Typography**: Playfair Display for headings, Poppins for subheadings, Open Sans for body text.
- **Responsiveness**: Fully responsive design targeting WCAG AA accessibility compliance.
- **Animations**: Smooth transitions and animations are integrated throughout using Framer Motion.
- **Theming**: Dark mode support is included.
- **Loading States**: Implemented with skeleton screens.
- **Z-Index Layering**: Standardized hierarchy to prevent conflicts: Mobile Menu (10000 - highest when open), Navigation Bar (9999), Hero Content (3), Overlays (2), Images (1).

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

## Recent Changes
- November 3, 2025: Shop Page & Inquiry Form Updates
  - **Mobile Menu Close Button Fix**: Replaced Lucide icon with inline SVG (48x48px) to prevent dot rendering on mobile devices
  - **Shop Page Sorting Dropdown**: Added z-index: 100 to ensure dropdown appears above CTA section
  - **Inquiry Form Redesign**: Compact 2-column layout (Name/Email, Phone/Date) with full-width message field, fits within 700px height without scrolling
  - **Inquiry Form Header Styling**: Bold uppercase title (2.4rem, 900 weight) with text shadow for modern look
  - **Inquiry Form Product Highlight**: Product name in pink-tinted bar (rgba 0.22 opacity), 46px height, 26px padding
  - **Inquiry Form Spacing**: Precise layout - icon 48px with 18px margin, title 10px bottom margin, subtitle bar, instruction text 24px below with 46px left margin
  - **Inquiry Form Close Button**: Highly visible 54x54px button positioned 24px from top, 38px from right, z-index 20
  - **Inquiry Form Inputs**: Reduced to h-11 (44px), smaller icons (16px), compact spacing for better visual density
  - **Inquiry Form Buttons**: Border-top separator, h-11 buttons with gradient submit button
  - **Inquiry Form Image Upload**: Compact inline image upload (up to 2 images), 60x60px thumbnails, reduced message field to 2 rows to accommodate
  - **Shop Page Top Padding Reduction**: Reduced top padding by ~60px (paddingTop: clamp(4px, 2vw, 36px)) to minimize scrolling on desktop

- November 3, 2025: Shop Page Comprehensive Redesign (All Features Complete)
  - **Inquiry Modal**: Replaced toast notifications with professional modal featuring form validation (name, email, phone, event date, message fields)
  - **Custom Cake CTA**: Prominent section at top with animated sparkle icon and clear call-to-action linking to custom builder
  - **Enhanced Product Cards**: Improved visual hierarchy with larger titles (22px), emphasized prices (22px raspberry), clear descriptions
  - **Advanced Hover Effects**: Smooth image zoom (scale 1.05), gradient overlay fade-in, card scale transformations
  - **Color-Coded Ratings**: Gold stars (#FFD700) for 5-star, orange (#FFA500) for 4.8+, raspberry for others, with info tooltips
  - **Interactive Filters**: Visual feedback with scale transforms, shadows, 2px borders, smooth transitions on category selection
  - **Product Badges**: POPULAR (raspberry gradient), NEW (green gradient), 5-STAR (gold gradient) with proper shadows and positioning
  - **Loading Skeleton**: Pulse animation skeleton UI during filtering/sorting transitions
  - **Mobile Optimization**: Responsive grid (1/2/3 columns), 44px+ touch targets, clamp() for responsive text sizing
  - **Accessibility**: Comprehensive ARIA labels, aria-pressed states, aria-invalid, role="alert", keyboard navigation support
  - **Smooth Animations**: AnimatePresence with layout animations, stagger delays, fade transitions on filter changes
  - **Corrected Filtering**: Category filtering now properly isolates selections (removed "All" category fallback for specific filters)

- November 3, 2025: Mobile Menu Optimization & Duplicate Close Button Fix
  - **Fixed duplicate X button issue**: Removed hamburger-to-X transformation in navigation bar
  - **Highly visible close button**: Solid raspberry pink (#C44569) background with white X icon (26px, stroke 3)
  - **Z-index fix**: Mobile menu now at z-index 10000, ensuring it appears above navigation bar (9999)
  - **Desktop menu optimization**: Entire menu (nav links, login, contact) now fits on desktop without scrolling
  - **Maintained mobile scrollability**: Menu remains scrollable on smaller mobile screens
  - **Hamburger icon behavior**: Only shows when menu is closed
  - **Logo navigation**: Clicking "Emily Bakes Cakes" logo returns to home page with smooth scroll to top
  - **Spotlight carousel arrows**: Optimized for mobile visibility (52px, solid raspberry, white icons)

- November 3, 2025: Shop Page Major Revision & Inquiry Modal Enhancement
  - **Compact CTA Section**: Reduced "Don't See What You're Looking For?" section size (p-6, text-xl heading, text-sm description, 48px button height)
  - **Modernized Title**: "Our Cake Collection" with gradient text (#C44569 to #8B3A5E to #C44569), decorative underline accent, and tagline "Handcrafted perfection, baked fresh daily"
  - **Product Images**: All 12 products now display stock images with proper aspect ratio (4:3), hover scale (1.1x), and smooth transitions
  - **Enhanced Sorting Dropdown**: Raspberry border (2px #C44569), hover states (bg tint, shadow), focus ring (3px rgba), larger chevron icon (22px, stroke 2.5)
  - **Inquiry Modal Image Upload**: Added inspiration image upload (up to 3 images), file previews with hover removal, proper state management and form reset
  - **Admin Inquiries Page**: New admin portal page to view customer cake inquiries with status filters (pending/reviewed/contacted), contact details, event dates, messages, and inspiration images
  - **Gold Star Ratings**: Maintained color-coded rating system (gold for 5-star, orange for 4.8+, raspberry for others)

- November 3, 2025: Shop Page Layout Optimization & Inquiry Modal UX Improvements
  - **Reduced Scrolling**: Reordered layout with title first, filters second, CTA third (moved down) to show products earlier on desktop view
  - **Centered Category Filters**: Added justify-center to category button container for better visual alignment with search bar
  - **Centered Sorting Dropdown**: Added text-center class and adjusted padding (px-5 pr-11) for proper text centering within border
  - **Ultra-Compact CTA**: Further reduced to p-4, text-lg heading, 44px button height, smaller sparkle icon (20px)
  - **Reduced Spacing**: Changed all mb-12 to mb-6 throughout Shop page for more compact desktop layout
  - **Smaller Title**: Reduced from text-4xl md:text-5xl to text-3xl md:text-4xl with proportionally smaller underline
  - **CTA Button Navigation**: Properly linked "Create Your Custom Cake" button to custom builder using onNavigate('builder') callback
  - **Inquiry Modal Visibility**: Solid white background (#FFFFFF) instead of transparent, solid backdrop (rgba(0,0,0,0.75))
  - **Form Input Contrast**: All inputs use solid backgrounds (#F8F8F8) with clear borders (#E0E0E0) and dark text (#2B2B2B)
  - **Instant Close Button**: Added e.preventDefault() and e.stopPropagation() to X button and Cancel button for immediate response
  - **Enhanced Close Button**: Close X now has visible background (rgba(255,255,255,0.15)) with border and hover states