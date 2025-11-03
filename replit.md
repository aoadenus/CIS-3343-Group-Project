## Overview
This project is for "Emily Bakes Cakes," a dual-interface web application. It features a public-facing website for customers to browse products, build custom cakes, and view galleries, and an administrative portal for staff to manage orders, customers, products, and reports. The goal is to provide a warm and inviting customer experience alongside an efficient staff management system.

## User Preferences
- **HOMEPAGE LOCKED**: The homepage design is finalized and stable. No major changes should be made without explicit user clarification and acceptance.
- **NAVIGATION BAR LOCKED**: The navigation bar design and functionality are finalized. No changes without explicit approval.
- **MOBILE MENU LOCKED**: The mobile menu layout, spacing, and close button are finalized. No changes without explicit approval.
- **FOOTER LOCKED**: The footer design and layout are finalized. No changes without explicit approval.

## System Architecture
The application is built using React 18.3.1 with TypeScript, Vite 6.3.5, and Tailwind CSS 4.1. It utilizes Radix UI primitives for components, Framer Motion for animations, React Hook Form for forms, and Recharts for data visualization.

### Backend & Database
- **Database**: PostgreSQL (Replit Neon) with Drizzle ORM for type-safe queries
- **API Server**: Express.js running on port 3000 (TypeScript with tsx)
- **Tables**: customers, orders, inquiries, contact_messages with relational foreign keys
- **Data Flow**: Form submissions (Custom Builder, Shop Inquiries) persist to database and appear in admin pages; Contact form submissions are stored but admin view pending
- **Migrations**: Use `npm run db:push` (never manual SQL) to sync schema changes

Key design decisions include:

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

## Backend API Endpoints
- `GET /api/customers` - Fetch all customers with order counts and last order dates
- `POST /api/orders/custom` - Create custom cake order (creates/links customer automatically)
- `GET /api/orders` - Fetch all orders with joined customer data
- `PATCH /api/orders/:id/status` - Update order status (drag-drop on Order Board)
- `GET /api/inquiries` - Fetch all shop inquiries
- `POST /api/inquiries` - Create new inquiry from Shop page
- `PATCH /api/inquiries/:id/status` - Update inquiry status
- `GET /api/contact` - Fetch all contact messages (admin view not yet implemented)
- `POST /api/contact` - Create contact form submission (stored in database)

## Recent Changes
- November 3, 2025: Complete Database Integration
  - **PostgreSQL Backend**: Full database integration with Replit Neon PostgreSQL
  - **Drizzle ORM**: Type-safe database queries with schema defined in shared/schema.ts
  - **Express API Server**: Backend server on port 3000 with comprehensive CRUD endpoints
  - **Relational Schema**: customers table with foreign key relationship to orders table
  - **Custom Builder**: Form submissions now persist to database via POST /api/orders/custom
  - **Contact Form**: Submissions persist to contact_messages table via POST /api/contact
  - **Inquiries System**: Shop inquiry form submissions persist via InquiriesContext API integration
  - **Admin Order Board**: Fetches real orders from database, displays occasion/flavor/design/servings, drag-drop updates status via API
  - **Admin Customers**: Displays real customer data from database with total orders and last order dates
  - **Data Persistence**: Form data flows: Frontend Form → API → Database → Admin Dashboard (Note: Contact form submissions are stored in database but admin view is not yet implemented)
  - **Customer Auto-Creation**: Custom Builder automatically creates/links customers on order submission
  - **VIP Status**: Customers automatically become VIP after 5+ orders
- November 3, 2025: Inquiry System Global Data Management
  - **InquiriesContext Implementation**: Created global context provider for managing customer inquiries across the application
  - **Data Flow Integration**: Inquiry form submissions from Shop page now persist to Admin Inquiries page via React Context
  - **Mobile Form Scrolling**: Added overflow-y-auto to inquiry modal form content for proper scrolling on mobile devices
  - **Status Management**: Admin can update inquiry statuses (pending/reviewed/contacted) with real-time UI updates
  - **Context Provider Structure**: InquiriesProvider wraps entire app in App.tsx, providing addInquiry and updateInquiryStatus functions
  - **Form Data Types**: Exported InquiryFormData type from InquiryModal for type-safe form submissions
  - **Removed Mock Data**: Admin Inquiries page now uses live context data instead of static mockInquiries array

- November 3, 2025: Shop Page & Inquiry Form Updates
  - **Mobile Menu Close Button Fix**: Replaced Lucide icon with inline SVG (48x48px) to prevent dot rendering on mobile devices
  - **Shop Page Sorting Dropdown**: Added z-index: 100 to ensure dropdown appears above CTA section
  - **Inquiry Form Redesign**: Compact 2-column layout (Name/Email, Phone/Date) with full-width message field, fits within 700px height without scrolling
  - **Inquiry Form Header Styling**: Clean professional design - 2.5rem Playfair title (700 weight) with 40px cake emoji icon
  - **Inquiry Form Product Highlight**: Product name in elegant pill/chip with semi-transparent white background, 20px border-radius
  - **Inquiry Form Spacing**: Consistent 24/32px padding, natural 8px/16px gaps between elements for clean hierarchy
  - **Inquiry Form Close Button**: Clean 48x48px button positioned top-right (20px/24px), subtle semi-transparent styling with hover states
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