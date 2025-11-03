# Emily Bakes Cakes Website

## Project Overview
A modern, dual-interface web application for Emily Bakes Cakes featuring:
- **Public-facing website**: Warm, inviting customer experience with shop, custom cake builder, gallery, about, and contact pages
- **Admin portal**: Staff management interface with dashboard, orders, customers, products, and reports

## Technology Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1 with custom design system
- **UI Components**: Radix UI primitives
- **Animations**: Motion (Framer Motion)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

## Design System
### Color Palette (Vanilla Raspberry)
- **Raspberry Pink**: `#C44569` - Primary CTAs and accents
- **Cream**: `#F8EBD7` - Background base
- **Charcoal**: `#2B2B2B` - Dark surfaces and text
- **Soft Gray**: `#E9E9E9` - Dividers and secondary backgrounds

### Typography
- **Headings**: Playfair Display (serif)
- **Subheadings**: Poppins (sans-serif)
- **Body Text**: Open Sans (sans-serif)

## Project Structure
```
/
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/         # UI primitives (buttons, inputs, etc.)
│   │   ├── figma/      # Figma-specific components
│   │   └── ...         # Layout and feature components
│   ├── pages/          # Page components
│   │   ├── public/     # Public-facing pages
│   │   ├── admin/      # Admin pages
│   │   └── ...         # Other pages
│   ├── styles/         # Global styles
│   ├── assets/         # Images and static assets
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## Development
The application runs on port 5000 and is configured for the Replit environment.

### Available Scripts
- `npm run dev` - Start development server (configured in workflow)
- `npm run build` - Build for production

### Key Features
1. **Public Interface**:
   - Home page with hero section and testimonials
   - Shop with product catalog
   - Custom cake builder
   - Photo gallery
   - About page
   - Contact form

2. **Admin Interface**:
   - Dashboard with analytics
   - Order management with Kanban board
   - Customer database
   - Product management
   - Reports and insights
   - Settings panel

3. **Design Features**:
   - Fully responsive design
   - WCAG AA accessibility compliance
   - Smooth animations and transitions
   - Toast notification system
   - Dark mode support
   - Loading states and skeleton screens

## Replit Configuration
- **Host**: 0.0.0.0 (allows proxy access)
- **Port**: 5000 (required for Replit webview)
- **HMR**: Configured for Replit's proxy environment
- **Build Output**: `build/` directory

## Recent Changes
- November 3, 2025: Navigation & Footer UX Improvements
  - **Professional minimal navigation bar**:
    - Reduced height from 64px to 60px for sleeker appearance
    - 32px Heart icon (cream #F8EBD7) with smaller brand text: clamp(16px, 3.5vw, 22px)
    - Compact navigation links: 14px font, minimal gap-1 spacing, whiteSpace: nowrap
    - Responsive Staff Login button: "Login" on lg, "Staff Login" on xl screens
    - Optimized padding: px-3 (mobile), px-4 (sm), px-6 (lg) for better fit
    - All text guaranteed to fit without wrapping on all screen sizes
    - flex-shrink-0 on logo and right section to prevent compression
  - **Enhanced carousel navigation arrows**:
    - Upgraded from 40px to 48px solid raspberry (#C44569) buttons
    - Replaced text arrows with white Chevron icons (24px, strokeWidth 3) from Lucide React
    - Added box-shadow (0 8px 24px rgba(0,0,0,0.18)) for depth and visibility on all backgrounds
    - Implemented motion.whileHover (scale 1.1) and whileTap (scale 0.95) animations
    - Disabled state uses 0.4 opacity while maintaining raspberry color
    - Highly visible on mobile and all background types
  - **Footer redesign for cleaner UX**:
    - Restructured to true 3-column grid: Brand | Quick Links | Contact (md:2-col, lg:3-col)
    - Removed logo images for cleaner text-only layout
    - Consolidated all navigation items into single "Quick Links" column
    - Increased spacing: 3rem vertical padding, gap-10 between columns
    - Reduced max-width to 5xl for better proportions
    - Maintained Houston contact info: 2847 Westheimer Road, (713) 555-CAKE, info@emilybakescakes.com
  - All changes maintain WCAG AA accessibility and responsive design principles

- November 3, 2025: Homepage & About Page UI/UX Enhancements
  - **Updated testimonials section text**: Changed from "Real stories from real celebrations" to "True experiences from memorable celebrations" (Home.tsx and TestimonialCarousel.tsx)
  - **Larger navigation logo**: Increased Heart icon from 28px to 40px and brand text from 18-24px to 20-26px for better visibility
  - **Order Now buttons verified**: All carousel "Order Now" buttons properly linked to custom builder page
  - **New About page CTA section**: Added "Why Choose Emily Bakes Cakes" section with:
    - Centered headline in Playfair Display (32-48px)
    - Raspberry pink divider line
    - Mission statement: "We're not just bakers—we're artisans dedicated to making every celebration extraordinary."
    - "Explore Our Story" button with hover animations that scrolls to top
    - Clean white background for visual contrast
  - All UI/UX changes maintain responsive design and accessibility standards
  
- November 3, 2025: Compact Footer Redesign with Logo & Houston Contact Info
  - **4-column responsive layout**: Logo + Brand, Explore links, Learn More links, Contact information
  - **Added logo image**: 40px logo displayed with brand name in footer
  - **Houston business details**: 
    - Address: 2847 Westheimer Road, Houston, TX 77098
    - Phone: (713) 555-CAKE
    - Email: info@emilybakescakes.com (clickable mailto link)
  - **Shorter, more compact design**: Reduced padding (py-8 vs py-12), tighter spacing, smaller fonts (13px body)
  - **Split navigation**: First 3 nav items in "Explore" column, last 3 in "Learn More" column
  - **All footer links functional**: Every navigation link properly connected via onNavigate prop
  - **Navigation bar z-index fix**: Increased to 9999 to always stay on top during scrolling
  - Result: Professional, space-efficient footer with complete contact information

- November 3, 2025: Bold Homepage Hero Redesign with Custom Image
  - **Custom hero image**: Integrated user-provided image (gift box with ribbon) at 50% opacity
  - **Dramatic new headline**: "Emily Bakes Cakes" in large Playfair Display (52-96px) with scale animation
  - **Animated gradient divider**: Horizontal line with raspberry pink gradient that expands on load
  - **Bold tagline**: "Custom Cakes Crafted with Love and Tradition" (28-48px Poppins)
  - **Premium CTA button**: "Build Your Dream Cake" with glow effects, 3D hover animations, and border
  - **Dark gradient overlay**: rgba(43,43,43, 0.5-0.7) for excellent white text contrast
  - **Smooth animations**: Staggered fade-in and slide-up effects (scale, scaleX, y-axis)
  - **Functional navigation**: Button links directly to custom builder page
  - **Professional styling**: Multiple text shadows, glowing effects, and micro-interactions
  - Overall result: Eye-catching, professional hero section that commands attention

- November 3, 2025: Frontend Enhancements - Interactive Admin Features
  - **Created comprehensive mock data system** (src/data/mockData.ts): Products, orders, customers, sales analytics with three demo datasets
  - **Built interactive Admin Dashboard** (src/pages/admin/Dashboard.tsx) with Recharts:
    - Animated KPI cards showing revenue, orders, average order value, retention rate
    - Revenue trend line chart with 7-month time series
    - Top products bar chart with sales and revenue metrics
    - Customer segments pie chart with VIP/Regular/New distribution
    - CSV export functionality for all charts
    - **Working demo data toggle**: Switch between "Current Week", "Peak Season", and "Quiet Period" datasets
    - Print-friendly mode toggle for reports
  - **Implemented drag-and-drop Order Board** (src/pages/admin/OrderBoard.tsx) using React DnD:
    - Kanban-style board with Pending, Preparing, Ready, Completed columns
    - Drag-and-drop order cards between status columns
    - Order details with customer info, items, and pricing
    - Real-time visual feedback during drag operations
  - **Created smart SearchBar component** (src/components/SearchBar.tsx):
    - Real-time autosuggest filtering products and customers
    - Keyboard navigation (arrow keys, Enter, Escape)
    - ARIA accessibility labels and roles
    - Debounced search for performance
  - **Built interactive ProductCard component** (src/components/ProductCard.tsx):
    - Smooth hover effects with scale and shadow animations
    - Favorite/star toggle with animation
    - Quick action buttons (Edit, View History)
    - Stock status indicators
  - **Enhanced Products page** (src/pages/admin/Products.tsx):
    - Showcases ProductCard components in responsive grid
    - Integrated with SearchBar for filtering
    - Product statistics summary
  - **Updated Admin navigation** (src/components/AdminLayout.tsx):
    - Added "Analytics" (Dashboard) with TrendingUp icon
    - Added "Order Board" with Kanban icon
    - Reorganized nav items for better UX
  - All features use Motion (Framer Motion) for smooth animations
  - Zero TypeScript/LSP errors, clean code with no unused imports
  - All features work with mock data (no backend required)

- November 2, 2025: Workflow Stability Fix & Code Cleanup
  - **Fixed stuck workflow issue**: Used `kill 1` to restart Replit VM and resolve workflow system deadlock
  - **Verified dev-server stability**: Confirmed Vite runs continuously without crashes on port 5000
  - **Cleaned up Home.tsx code**: Removed unused imports (useRef, useTransform, ImageWithFallback, SkeletonCard, useMotionValue)
  - **Removed dead code**: Eliminated unused state variables (isLoading, loadedImages, x) and functions (handleImageLoad)
  - **Fixed duplicate CSS property**: Removed duplicate marginBottom in CTA section styling
  - **Achieved zero LSP errors**: All TypeScript diagnostics resolved, code compiles cleanly
  - **Confirmed functionality**: Carousel auto-rotation, swipe gestures, lazy loading all working correctly
  - **Server accessibility verified**: App accessible via external .replit.dev URL with proper HMR

- November 2, 2025: Network Host Rendering Diagnostics & Optimization
  - **Fixed AnimatePresence blank screen issue**: Refactored from multiple conditional children to single motion.div with dynamic key={appMode}
  - **Added sessionStorage persistence**: Welcome animation only plays once per browser session
  - **Added environment detection logging**: Console now shows URL, hostname, protocol, and environment type
  - **Optimized Vite config for external access**: Added `base: './'` for proper asset path resolution in proxy environments
  - **Created diagnostic tools**: Built network-test.html tool for visual and color analysis
  - **Verified configuration**: Port 5000, host 0.0.0.0, allowedHosts includes .replit.dev and .repl.co
  - **HMR properly configured**: WebSocket Secure (wss) protocol with clientPort 443 for HTTPS proxy

- November 2, 2025: Initial Replit setup
  - Organized files into proper src/ directory structure
  - Configured Vite for Replit environment (0.0.0.0:5000)
  - Fixed Tailwind CSS v4 PostCSS plugin configuration
  - Fixed versioned imports in UI components
  - Created workflow for development server
  - Configured deployment settings

## Notes
- The project uses Tailwind CSS v4 which requires `@tailwindcss/postcss` instead of the legacy plugin
- All Radix UI and other library imports have been cleaned to remove version numbers
- The application includes extensive documentation in markdown files for design system, components, and features
