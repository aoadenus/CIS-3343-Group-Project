# 19: Customer Order Tracking Implementation
## Homepage Refactor + Semi-Functional Demo Tracker + Email/SMS Decision

**Document:** 19_CUSTOMER_ORDER_TRACKING_IMPLEMENTATION.md  
**Project:** Emily Bakes Cakes - CIS 3343 Group 4  
**Date:** November 6, 2025  
**Deadline:** November 21, 2025 (15 days remaining)  
**Purpose:** Safely add order tracking without breaking existing homepage  
**Status:** Ready to Implement

---

## Table of Contents

1. [Part A: Safely Recreating Homepage](#part-a-safely-recreating-homepage)
2. [Part B: Building Semi-Functional Order Tracker](#part-b-building-semi-functional-order-tracker)
3. [Part C: Email vs. SMS Decision & Setup](#part-c-email-vs-sms-decision--setup)
4. [Part D: Integration & Testing](#part-d-integration--testing)
5. [Code Examples](#code-examples)
6. [Deployment Checklist](#deployment-checklist)

---

# PART A: SAFELY RECREATING HOMEPAGE

## Strategy Overview

**Goal:** Refactor homepage to accept new features without breaking existing functionality

**Risk Level:** LOW (if following this approach)

**Time Estimate:** 2-3 days

### Step 1: Backup Current Code

\`\`\`bash
# 1. Commit current state to main branch
git add .
git commit -m "Backup: Homepage before order tracking refactor - Nov 6, 2025"
git push origin main

# 2. Create backup branch (never delete this)
git branch main-backup
git push origin main-backup

# 3. Create new development branch for this feature
git checkout -b feature/order-tracking-demo
\`\`\`

**What You Have:**
- Original code safe on `main`
- Backup branch safe on `main-backup`
- New branch `feature/order-tracking-demo` for new work

### Step 2: Analyze Current Homepage Structure

**Identify these components in your current homepage:**

\`\`\`
HomePage Component
├── Header/Navigation
│   ├── Logo
│   ├── Navigation Links
│   └── Login/Account Section
├── Hero Section
│   ├── Main Call-to-Action
│   └── Images/Banners
├── Product Showcase
│   ├── Standard Products
│   └── Featured Cakes
├── About Section
├── Contact/Footer
└── [NEW] → Order Tracker Widget (INSERT HERE)
\`\`\`

**Questions to answer:**
- Where does the homepage live? (`src/pages/HomePage.tsx` or similar?)
- How is it structured? (one giant component or multiple sub-components?)
- Are there any hardcoded styles or inline JSX that might conflict?

### Step 3: Refactor Homepage to Use Sub-Components

**Before (Monolithic):**
\`\`\`typescript
// BadHomePage.tsx - Everything in one file
export const HomePage = () => {
  return (
    <div>
      <header>Navigation...</header>
      <section>Hero...</section>
      <section>Products...</section>
      <section>About...</section>
      <footer>Contact...</footer>
    </div>
  );
};
\`\`\`

**After (Modular):**
\`\`\`typescript
// HomePage.tsx - Clean & Modular
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { ProductShowcase } from './sections/ProductShowcase';
import { About } from './sections/About';
import { OrderTrackerWidget } from './sections/OrderTrackerWidget'; // NEW
import { Footer } from './sections/Footer';

export const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <ProductShowcase />
      <About />
      <OrderTrackerWidget />  {/* Easy to add/remove */}
      <Footer />
    </div>
  );
};
\`\`\`

**Benefits:**
- ✅ Order tracker is isolated; can be added/removed without touching other sections
- ✅ Each section is testable independently
- ✅ Easy to rearrange sections without breaking code
- ✅ Other developers can work on different sections in parallel

### Step 4: Extract Reusable Sections

**Create these files:**

\`\`\`
src/pages/
├── HomePage.tsx (main container)
└── sections/
    ├── Header.tsx (Navigation, Logo, Auth)
    ├── Hero.tsx (Main banner)
    ├── ProductShowcase.tsx (Product grid)
    ├── About.tsx (Company info)
    ├── OrderTrackerWidget.tsx (NEW - Order tracker)
    └── Footer.tsx (Links, contact)
\`\`\`

**Example: Extract Header**

\`\`\`typescript
// Old way (inline in HomePage)
<header>
  <Logo />
  <nav>{navigationLinks}</nav>
</header>

// New way (separate component)
// src/pages/sections/Header.tsx
export const Header = () => {
  return (
    <header className="bg-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
};
\`\`\`

**Why This Matters:**
- If order tracker breaks later, header still works
- Header can be tested independently
- Someone can update header styles without affecting tracker

### Step 5: Create Insertion Point for Order Tracker

**Decide placement:** Where should the order tracker widget appear on the homepage?

**Option A: After Hero (Most Visible)**
\`\`\`
[Header]
[Hero Banner - "Track Your Order"]
[Order Tracker Widget] ← NEW
[Product Showcase]
[About]
[Footer]
\`\`\`

**Option B: In Dedicated Section**
\`\`\`
[Header]
[Hero Banner]
[Product Showcase]
[Track Your Order Section]  ← NEW dedicated section
[About]
[Footer]
\`\`\`

**Recommendation:** Option A (after hero) for demo impact

### Step 6: Test Homepage Before Adding Tracker

\`\`\`bash
# 1. Start dev server
npm start

# 2. Check homepage loads:
# - Navigation works
# - Can click links
# - Can login
# - Product showcase displays correctly
# - Footer is visible

# 3. No console errors
# Open browser console (F12) → Console tab
# Should see NO red errors

# 4. Responsive check
# Resize browser to mobile size
# Everything should still look good
\`\`\`

**If anything breaks:**
\`\`\`bash
# Revert this branch and start over
git checkout feature/order-tracking-demo
git reset --hard origin/main
git pull
\`\`\`

---

# PART B: BUILDING SEMI-FUNCTIONAL ORDER TRACKER

## Core Concept

**The Order Tracker Widget:**
- Displays a real order ID
- Shows current status with visual progress
- Auto-advances through 11 statuses every 10 seconds
- Completes full cycle in ~110 seconds (1m 50s ≈ 2 minutes)
- Looks like Domino's tracker but runs on client-side timer

## Order Status Flow (From Case Study)

\`\`\`
Timeline: 0s → 110s (11 statuses × 10 seconds each)

┌─────────────────────────────────────────────────────────────┐
│  Order Tracker: #1001 | Estimated Pickup: 2:15 PM         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Status: In Baking                              70% ██████░│
│                                                             │
│  ✓ Order Placed                    (0s)   ✓ Confirmed     │
│  ✓ Design Approved                 (10s)  ✓ Confirmed     │
│  ✓ Pending Baking                  (20s)  ✓ Confirmed     │
│  ⏳ In Baking                       (30s)  ← CURRENT       │
│  ⏱ Cooling                         (40s)  Pending...      │
│  ◇ Ready for Decorating            (50s)  Coming next...  │
│                                                             │
│  Timeline: 30s / 110s (27% complete)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## React Component: OrderTrackerWidget.tsx

\`\`\`typescript
import React, { useState, useEffect } from 'react';

interface OrderStatus {
  step: number;
  status: string;
  timestamp: string;
  icon: string;
}

const ORDER_STATUSES: OrderStatus[] = [
  { step: 1, status: 'Order Placed', timestamp: '0s', icon: '✓' },
  { step: 2, status: 'Design Approved', timestamp: '10s', icon: '✓' },
  { step: 3, status: 'Pending Baking', timestamp: '20s', icon: '✓' },
  { step: 4, status: 'In Baking', timestamp: '30s', icon: '🔥' },
  { step: 5, status: 'Cooling', timestamp: '40s', icon: '❄️' },
  { step: 6, status: 'Ready for Decorating', timestamp: '50s', icon: '✓' },
  { step: 7, status: 'In Decorating', timestamp: '60s', icon: '🎨' },
  { step: 8, status: 'Decorated Complete', timestamp: '70s', icon: '✓' },
  { step: 9, status: 'Quality Check', timestamp: '80s', icon: '✅' },
  { step: 10, status: 'Ready for Pickup', timestamp: '90s', icon: '📦' },
  { step: 11, status: 'Picked Up', timestamp: '110s', icon: '🎉' },
];

const INTERVAL_SECONDS = 10; // Move to next status every 10 seconds
const TOTAL_DURATION = ORDER_STATUSES.length * INTERVAL_SECONDS; // 110 seconds

export const OrderTrackerWidget: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [trackingToken] = useState<string>(
    `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  );

  // Demo Order Data
  const demoOrder = {
    id: '#1001',
    customerName: 'Jane Doe',
    cakeType: '8-inch Round Vanilla',
    pickupTime: '2:15 PM',
    pickupDate: 'Today',
  };

  // Start tracking
  const handleStartTracking = () => {
    setIsTracking(true);
    setCurrentStep(0);
    setElapsedSeconds(0);
  };

  // Auto-advance status every 10 seconds
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      // Move to next status every 10 seconds
      if (elapsedSeconds > 0 && elapsedSeconds % INTERVAL_SECONDS === 0) {
        setCurrentStep((prev) => {
          const next = prev + 1;
          // Stop at last status
          if (next >= ORDER_STATUSES.length) {
            setIsTracking(false);
            return prev;
          }
          return next;
        });
      }

      // Stop after total duration
      if (elapsedSeconds >= TOTAL_DURATION) {
        setIsTracking(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, elapsedSeconds]);

  const currentStatus = ORDER_STATUSES[currentStep];
  const progressPercentage = (currentStep / (ORDER_STATUSES.length - 1)) * 100;

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">📍 Track Your Order</h2>

        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
          {/* Order Header */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order ID</p>
                <p className="font-bold text-lg">{demoOrder.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-bold">{demoOrder.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Cake Type</p>
                <p className="font-bold">{demoOrder.cakeType}</p>
              </div>
              <div>
                <p className="text-gray-600">Pickup</p>
                <p className="font-bold">{demoOrder.pickupTime}</p>
              </div>
            </div>
          </div>

          {/* Current Status Display */}
          <div className="mb-8 text-center">
            <p className="text-gray-600 mb-2">Current Status</p>
            <h3 className="text-3xl font-bold text-blue-600 mb-2">
              {currentStatus.status}
            </h3>
            <p className="text-gray-600">
              Elapsed: {elapsedSeconds}s / {TOTAL_DURATION}s
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-gray-700">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-4">Timeline</p>
            <div className="space-y-3">
              {ORDER_STATUSES.map((status, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;
                const isPending = idx > currentStep;

                return (
                  <div key={idx} className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                        isCompleted
                          ? 'bg-green-100 text-green-600 border-2 border-green-600'
                          : isCurrent
                          ? 'bg-blue-100 text-blue-600 border-2 border-blue-600 animate-pulse'
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                      }`}
                    >
                      {status.icon}
                    </div>

                    {/* Status Info */}
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          isCompleted
                            ? 'text-green-600'
                            : isCurrent
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {status.status}
                      </p>
                      <p className="text-xs text-gray-500">{status.timestamp}</p>
                    </div>

                    {/* Status Badge */}
                    {isCompleted && <span className="text-xs font-bold text-green-600">✓ Done</span>}
                    {isCurrent && <span className="text-xs font-bold text-blue-600 animate-bounce">⏳ Now</span>}
                    {isPending && <span className="text-xs text-gray-400">Pending</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            {!isTracking && elapsedSeconds === 0 && (
              <button
                onClick={handleStartTracking}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg transition"
              >
                🎥 Demo: Watch Order Progress (2 min)
              </button>
            )}
            {isTracking && (
              <p className="text-green-600 font-bold">Tracking live... Check back soon!</p>
            )}
            {!isTracking && elapsedSeconds > 0 && (
              <div>
                <p className="text-green-600 font-bold mb-4">✅ Order Complete!</p>
                <button
                  onClick={handleStartTracking}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition"
                >
                  🔄 Watch Again
                </button>
              </div>
            )}
          </div>

          {/* Demo Note */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>📌 Demo Mode:</strong> This tracker simulates a real order progressing through all stages
              in 2 minutes. In production, real orders would update automatically as they move through the bakery!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
\`\`\`

## Add Widget to Homepage

\`\`\`typescript
// src/pages/HomePage.tsx
import { OrderTrackerWidget } from './sections/OrderTrackerWidget';

export const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <OrderTrackerWidget />  {/* NEW - Add after Hero for visibility */}
      <ProductShowcase />
      <About />
      <Footer />
    </div>
  );
};
\`\`\`

## Testing the Widget

\`\`\`bash
# Start dev server
npm start

# Test checklist:
✓ Click "Demo: Watch Order Progress" button
✓ Status updates every 10 seconds
✓ Progress bar fills smoothly
✓ Timeline shows completed steps in green
✓ Current step has pulsing animation
✓ After 110 seconds, shows "Order Complete!"
✓ Can click "Watch Again" to restart
✓ No console errors
✓ Works on mobile (resize browser)
\`\`\`

---

# PART C: EMAIL VS. SMS DECISION & SETUP

## Comparison Table

| Feature | Email (SendGrid/Mailgun) | SMS (Twilio) |
|---------|--------------------------|--------------|
| **Setup Time** | 10 minutes | 15 minutes |
| **Cost** | Free tier available | Low free tier, then pay-per-SMS |
| **Delivery Speed** | ~2-5 seconds | Instant (~1 second) |
| **Customer Adoption** | Almost everyone has email | Everyone has phone, needs opt-in |
| **Rich Content** | Yes (HTML, colors, images, links) | Plain text only |
| **Demo Wow Factor** | ⭐⭐⭐⭐⭐ (Branded email is impressive) | ⭐⭐⭐ (Quick but plain) |
| **Maintenance** | Low (email is reliable) | Medium (SMS costs add up) |
| **For Demo? Better Pick** | ✅ YES | ❌ (Skip for now) |

## Recommendation for Emily Bakes Cakes

**Choose EMAIL (SendGrid) because:**
1. ✅ Free tier sufficient for demo (100 emails/day)
2. ✅ Can include tracking link with branded email
3. ✅ Shows professionalism
4. ✅ Graders/customers can see full branded experience
5. ✅ No phone number collection needed
6. ✅ Easy to test in development

**Add SMS Later (post-MVP) if needed**

---

## Setup Email Notification: SendGrid

### Step 1: Create SendGrid Account

\`\`\`
1. Go to sendgrid.com
2. Sign up (free account)
3. Verify email address
4. Create API key:
   - Dashboard → API Keys → Create API Key
   - Name: "Emily Bakes Demo"
   - Save the key (you'll need it)
\`\`\`

### Step 2: Backend Setup (Node.js/Express Example)

\`\`\`bash
# Install SendGrid package
npm install @sendgrid/mail
\`\`\`

\`\`\`typescript
// services/emailService.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOrderTrackingEmail = async (
  customerEmail: string,
  orderData: {
    orderId: string;
    customerName: string;
    cakeType: string;
    pickupTime: string;
    trackingToken: string;
  }
) => {
  const trackingUrl = `${process.env.APP_URL}/track/${orderData.trackingToken}`;

  const msg = {
    to: customerEmail,
    from: 'orders@emilybakescakes.com', // Must be verified in SendGrid
    subject: `🎂 Your Custom Cake Order #${orderData.orderId} is Being Prepared!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .header h1 { margin: 0; }
            .order-details { background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #667eea; }
            .order-details p { margin: 8px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { color: #999; font-size: 12px; text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎂 Emily Bakes Cakes</h1>
              <p>Your Order is Being Made!</p>
            </div>

            <h2>Hello ${orderData.customerName}!</h2>
            <p>Thank you for your order! Your custom cake is being made with love.</p>

            <div class="order-details">
              <p><strong>Order ID:</strong> #${orderData.orderId}</p>
              <p><strong>Cake Type:</strong> ${orderData.cakeType}</p>
              <p><strong>Pickup Time:</strong> ${orderData.pickupTime}</p>
            </div>

            <p style="text-align: center;">
              <a href="${trackingUrl}" class="cta-button">📍 Track Your Order Live</a>
            </p>

            <p>Click the button above to see your order progress through all stages in real-time. Your cake will be ready soon!</p>

            <p style="color: #999; font-size: 12px;">
              <strong>Note:</strong> This is a demo tracker. In production, you'll receive real-time updates as your order moves through our bakery.
            </p>

            <div class="footer">
              <p>Emily Bakes Cakes | 📍 Houston, TX | 📞 (713) 555-CAKE</p>
              <p>&copy; 2025 All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Tracking email sent to ${customerEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, message: 'Failed to send email' };
  }
};
\`\`\`

### Step 3: Trigger Email on Order Creation

\`\`\`typescript
// routes/orders.ts
import { sendOrderTrackingEmail } from '../services/emailService';

app.post('/api/orders', async (req, res) => {
  try {
    // Create order in database
    const newOrder = await createOrder(req.body);

    // Generate tracking token
    const trackingToken = generateToken(newOrder.id);

    // Send tracking email to customer
    await sendOrderTrackingEmail(req.body.customerEmail, {
      orderId: newOrder.id,
      customerName: req.body.customerName,
      cakeType: req.body.cakeType,
      pickupTime: req.body.pickupTime,
      trackingToken: trackingToken,
    });

    res.json({
      success: true,
      orderId: newOrder.id,
      trackingUrl: `/track/${trackingToken}`,
      message: 'Order created! Tracking email sent to customer.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
\`\`\`

### Step 4: Environment Variables

\`\`\`
# .env file
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=orders@emilybakescakes.com
APP_URL=http://localhost:3000
\`\`\`

---

# PART D: INTEGRATION & TESTING

## Full Integration Flow

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    FLOW: Order Creation to Tracking             │
└─────────────────────────────────────────────────────────────────┘

1. SALES STAFF
   └─→ Completes Order Wizard
       └─→ Clicks "Submit Order"

2. BACKEND
   └─→ Saves Order to Database (status: "Order Placed")
       └─→ Generates Tracking Token (unique URL)
           └─→ Calls SendGrid API with Email Template
               └─→ Email sent to customer email address

3. CUSTOMER EMAIL (Inbox)
   ┌─────────────────────────────────────────┐
   │ 🎂 Your Order #1001 is Being Prepared! │
   │                                         │
   │ Dear Jane Doe,                          │
   │                                         │
   │ Order ID: #1001                         │
   │ Cake: 8-inch Vanilla                    │
   │ Pickup: 2:15 PM                         │
   │                                         │
   │ [📍 TRACK ORDER LIVE] ← Tracking Link  │
   │                                         │
   │ Emily Bakes Cakes                       │
   └─────────────────────────────────────────┘
   
4. CUSTOMER CLICKS LINK
   └─→ Redirected to /track/{token}
       └─→ OrderTrackerWidget loads
           └─→ Customer clicks "Demo: Watch Progress"
               └─→ Tracker animates through all 11 statuses over 2 minutes
\`\`\`

## Testing Checklist

### Phase 1: Tracker Widget (Local Testing)
- [ ] Widget loads on homepage
- [ ] "Demo: Watch Progress" button works
- [ ] Status updates every 10 seconds
- [ ] Progress bar fills smoothly
- [ ] All 11 statuses display correctly
- [ ] Animations work (pulsing current step, filled progress bar)
- [ ] "Watch Again" button works
- [ ] No console errors
- [ ] Mobile responsive

### Phase 2: Email Integration
- [ ] SendGrid account created
- [ ] API key working
- [ ] Test email sent successfully
- [ ] Email arrives in inbox within 5 seconds
- [ ] Email template looks branded
- [ ] Tracking link in email is clickable
- [ ] Clicking link navigates to /track/{token}

### Phase 3: Full Flow
- [ ] Create order through Sales Dashboard
- [ ] Email is sent automatically
- [ ] Email contains correct order details
- [ ] Customer can click tracking link from email
- [ ] Tracker widget displays and functions
- [ ] No 404 errors for tracking page

### Phase 4: Edge Cases
- [ ] Multiple orders can be tracked independently
- [ ] Each tracking link is unique
- [ ] Old tracking links still work
- [ ] Widget works on different browsers (Chrome, Firefox, Safari)
- [ ] Works on mobile devices

## Manual Testing

\`\`\`bash
# Test 1: Local tracker widget
npm start
# Navigate to homepage
# Click "Demo: Watch Order Progress" button
# Verify 2-minute animation works

# Test 2: Email sending
# Create .env with SENDGRID_API_KEY
# Call sendOrderTrackingEmail() from your backend
# Check email inbox
# Click tracking link

# Test 3: Full integration
# Login as sales staff
# Create a test order with email: your-email@domain.com
# Check email inbox for tracking email
# Click link and verify tracker works
\`\`\`

---

# CODE EXAMPLES

## Complete Order Creation Flow

### Frontend: Order Submission

\`\`\`typescript
// components/sales/OrderWizardStep8Review.tsx
const handleSubmitOrder = async () => {
  try {
    const response = await axios.post('/api/orders', {
      customerId: formData.customerId,
      customerEmail: customer.email, // IMPORTANT: needed for email
      customerName: customer.name,
      cakeType: formData.cakeType,
      layers: formData.layers,
      totalPrice: formData.totalPrice,
      pickupTime: formData.pickupTime,
      pickupDate: formData.pickupDate,
    });

    // Show success message with tracking link
    showNotification(
      `✅ Order created! Tracking email sent to ${customer.email}`,
      'success'
    );

    // Optionally show tracking link
    const trackingUrl = response.data.trackingUrl;
    console.log(`Customer can track at: ${window.location.origin}${trackingUrl}`);

    // Reset form
    resetWizard();
  } catch (error) {
    showNotification('❌ Failed to create order', 'error');
  }
};
\`\`\`

### Backend: Order Creation with Email

\`\`\`typescript
// backend/routes/orders.ts
import express from 'express';
import { sendOrderTrackingEmail } from '../services/emailService';
import { generateTrackingToken } from '../utils/tokenUtils';

const router = express.Router();

router.post('/api/orders', async (req, res) => {
  try {
    // 1. Create order in database
    const orderData = {
      cust_id: req.body.customerId,
      order_date: new Date(),
      pickup_date: req.body.pickupDate,
      pickup_time: req.body.pickupTime,
      firm_price: req.body.totalPrice,
      order_status: 'Order Placed',
      entered_by: req.user.employeeId,
    };

    const orderResult = await db.query(
      `INSERT INTO CUSTOM_ORDER 
       (Cust_ID, Order_Date, Pickup_Date, Pickup_Time, Firm_Price, Order_Status, Entered_By)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.cust_id,
        orderData.order_date,
        orderData.pickup_date,
        orderData.pickup_time,
        orderData.firm_price,
        orderData.order_status,
        orderData.entered_by,
      ]
    );

    const orderId = orderResult.insertId;

    // 2. Generate unique tracking token
    const trackingToken = generateTrackingToken(orderId);

    // 3. Store tracking token (optional, for later reference)
    await db.query(
      `UPDATE CUSTOM_ORDER SET tracking_token = ? WHERE Order_ID = ?`,
      [trackingToken, orderId]
    );

    // 4. Send tracking email
    const emailResult = await sendOrderTrackingEmail(req.body.customerEmail, {
      orderId: orderId,
      customerName: req.body.customerName,
      cakeType: req.body.cakeType,
      pickupTime: req.body.pickupTime,
      trackingToken: trackingToken,
    });

    // 5. Return success response
    res.json({
      success: true,
      orderId: orderId,
      trackingToken: trackingToken,
      trackingUrl: `/track/${trackingToken}`,
      emailSent: emailResult.success,
      message: 'Order created and tracking email sent!',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
\`\`\`

### Tracking Link Handler

\`\`\`typescript
// backend/routes/tracking.ts
router.get('/api/track/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Find order by tracking token
    const result = await db.query(
      `SELECT * FROM CUSTOM_ORDER WHERE tracking_token = ?`,
      [token]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    const order = result[0];

    // 2. Return order data (status, times, etc.)
    res.json({
      success: true,
      order: {
        id: order.Order_ID,
        status: order.Order_Status,
        pickupTime: order.Pickup_Time,
        pickupDate: order.Pickup_Date,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Frontend route to display tracker
app.get('/track/:token', (req, res) => {
  res.render('tracking-page', {
    token: req.params.token,
  });
});
\`\`\`

---

# DEPLOYMENT CHECKLIST

## Pre-Launch (By November 20)

### Code & Functionality
- [ ] Homepage refactoring complete (sub-components extracted)
- [ ] OrderTrackerWidget component built and tested
- [ ] All 11 statuses working correctly
- [ ] Progress bar animates smoothly
- [ ] No console errors
- [ ] Responsive on mobile

### Email Integration
- [ ] SendGrid account created and API key working
- [ ] Email template designed and branded
- [ ] Email service integrated with order creation
- [ ] Test emails sending successfully
- [ ] Tracking link in email is functional

### Testing
- [ ] Widget tested on Chrome, Firefox, Safari
- [ ] Mobile testing (iPhone, Android)
- [ ] Multiple orders tested independently
- [ ] Email delivery time acceptable
- [ ] No database errors

### Documentation
- [ ] README updated with email setup instructions
- [ ] Environment variables documented
- [ ] Tracking URL format documented
- [ ] Demo credentials added to test notes

### Demo Preparation
- [ ] Create sample test account
- [ ] Have demo order ready to create
- [ ] Email address ready to test
- [ ] Know how to manually trigger order tracking email
- [ ] Backup plan if email fails (show widget manually)

## Launch Day (November 21)

\`\`\`bash
# Final checks before presentation
npm start  # Dev server running

# Test complete flow:
1. Login as sales staff
2. Create new order
3. Check email inbox (should receive email within 5 seconds)
4. Click tracking link from email
5. Watch 2-minute demo animation
6. Verify all statuses appear correctly
7. Test "Watch Again" button

# If anything breaks:
- Check console for errors
- Verify API keys in .env
- Check network tab in browser dev tools
- Restart dev server and try again
\`\`\`

---

## Quick Reference: File Changes Summary

| File | Change | Status |
|------|--------|--------|
| `HomePage.tsx` | Import OrderTrackerWidget | ✏️ Modify |
| `sections/OrderTrackerWidget.tsx` | NEW component | ✨ Create |
| `services/emailService.ts` | NEW email handler | ✨ Create |
| `routes/orders.ts` | Add email trigger | ✏️ Modify |
| `routes/tracking.ts` | NEW tracking endpoint | ✨ Create |
| `.env` | Add SENDGRID_API_KEY | ✏️ Add |
| `package.json` | Add @sendgrid/mail | ✏️ Modify |

**Total New Code:** ~200 lines  
**Estimated Implementation Time:** 4-6 hours  
**Risk Level:** LOW (modular, isolated from main features)

---

**Document Status:** COMPLETE & READY FOR IMPLEMENTATION  
**Last Updated:** November 6, 2025, 7:20 PM CST  
**Next Step:** Start Part A refactoring tomorrow morning
