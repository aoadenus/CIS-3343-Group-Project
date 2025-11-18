# Emily Bakes Cakes: Public Website Revision Plan

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Purpose:** Define the separate, marketing-focused public website

---

## Executive Summary

The public website serves as a **marketing and information portal** for customers. It is completely separate from the internal staff application. The website showcases Emily Bakes Cakes' work, provides business information, and allows customers to send inquiries via email only. **No orders are placed on the website.**

Clear messaging: "To place an order, call us at (713) 555-CAKE or visit in person. Our staff will enter your custom order details in our system."

---

## What Changed from Original Scope

**Original Plan:**
- Customer browsing and customization
- Online checkout and payment
- Order tracking portal
- Integrated with staff app

**New Plan:**
- Marketing and gallery showcase only
- Email inquiry form (not order form) **note - maybe**
- Bakery information and hours
- Clear call-to-action to contact Emily
- Links to Staff Login (separate app)
- Static, read-only content

---

## Website Pages and Purpose

### 1. Homepage

**Purpose:** Welcome customers, showcase best work, drive inquiries

**Content Sections:**
- Hero banner: "Handcrafted Custom Cakes"
- Featured cake gallery (3-5 images)
- About Emily (short bio)
- Call-to-action buttons:
  - "View Our Gallery" → Gallery page
  - "Contact Us" → Contact form
  - "Staff Login" → Link to /staff (hidden from customers)
- Hours and location
- Testimonials (3-4 customer quotes with photos)

**SEO Elements:**
- Title: "Emily Bakes Cakes | Custom Handcrafted Cakes in Houston"
- Meta description: "Beautiful, delicious custom cakes for birthdays, weddings, and events"

---

### 2. Gallery Page

**Purpose:** Showcase previous work and inspire customers

**Content:** **note - stnd menu**
- Grid of 20+ cake photographs
- Filter buttons: All, Birthdays, Weddings, Events, Themed
- Lightbox/modal for full-size images
- Photo captions with cake flavor, occasion, date
- Responsive: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

**Images:**
- Use actual photos from Emily's portfolio
- All photos compressed and optimized
- Alternative text for accessibility
- Consistent branding (watermark with "Emily Bakes")

**Example Caption:** **note - clarity**
\`\`\`
"Chocolate Dream Cake
Vanilla and raspberry layers with dark chocolate ganache
Birthday celebration for 25 guests
August 2024"
\`\`\`

---

### 3. About Page

**Purpose:** Tell Emily's story and build trust

**Sections:**
1. **Emily's Story**
   - Who Emily is
   - How she started baking
   - Philosophy on custom cakes
   - (200-300 words)

2. **Our Process**
   - Customers call or visit
   - Discuss cake ideas and preferences
   - Emily creates custom design
   - Customer approves design
   - Order is prepared
   - Customer picks up finished cake

3. **Why Custom Cakes**
   - Each cake is unique
   - Made fresh to order
   - Premium ingredients
   - Personal touches
   - Perfect for special occasions

4. **Certifications/Qualifications** (if applicable)
   - Culinary training
   - Food safety certifications
   - Experience with dietary needs

---

### 4. Contact Page

**Purpose:** Provide inquiry form and contact details

**Contact Methods:**
\`\`\`
Phone: (713) 555-CAKE (713-555-2253)
Email: orders@emilybakes.com
Visit: 456 Baking Lane, Houston, TX 77001
Hours:
  Mon-Fri: 9:00 AM - 6:00 PM
  Sat: 10:00 AM - 4:00 PM
  Sun: CLOSED
\`\`\`

**Inquiry Form:**
\`\`\`
Name: [Text input, required]
Email: [Email input, required]
Phone: [Phone input, optional]
Event Date: [Date picker, optional]
Event Type: [Dropdown: Birthday, Wedding, Corporate, Other]
Message: [Textarea]
Preferred Contact: [Radio: Phone, Email]

"To place an order, please call us or visit in person. 
Our staff will guide you through the process and enter 
your custom order details into our system."

[Submit button]
\`\`\`

**Form Processing:**
- Validation: Name and email required
- Success: Thank you message + auto-reply email
- Error: Show validation errors
- Auto-reply email: "Thanks for reaching out! We'll contact you within 24 hours"
- Backend: Email goes to orders@emilybakes.com

---

## Design and Branding

### Color Palette (Same as Internal App)
- Primary: Raspberry (#C44569)
- Warm Neutral: Vanilla (#F8EBD7)
- Dark Text: Charcoal (#2B2B2B)
- Accents: Gold, Silver for elegant feel

### Typography
- Headings: Playfair Display (serif, elegant)
- Body: Open Sans (clean, readable)
- Logo: Lucida Handwriting (handcrafted feel)

### Visual Style
- Warm, inviting, professional
- High-quality cake photography
- Consistent branding (colors, fonts, logo placement)
- White space for breathing room
- Hand-drawn decorative elements (optional)

### Responsive Design
- Mobile: 1 column, touch-friendly
- Tablet: 2 columns where appropriate
- Desktop: 3+ columns for galleries
- Navigation: Hamburger menu on mobile, horizontal on desktop

---

## Navigation Structure

**Primary Navigation (Sticky Header):**
- Logo/Home link
- Gallery
- About
- Contact
- Staff Login (subtle link, bottom of footer)

**Footer Navigation:**
- Contact info
- Hours
- Social media links (Instagram, Facebook)
- Privacy policy
- Terms of use
- Staff login link

**Responsive:**
- Desktop: Horizontal nav bar
- Mobile: Hamburger menu (right side)

---

## Technology Stack (Separate from Staff App)

### Hosting
- Static site hosting: Netlify, Vercel, or GitHub Pages
- Domain: emilybakescakes.com (or similar)
- HTTPS enforced

### Framework Options
- Static generator: Hugo, Jekyll, 11ty (fast, simple)
- Or React SPA if need interactivity
- Keep separate from internal app (different repo)

### Performance
- Optimize images (compress, responsive formats)
- Minimize CSS/JS
- Cache headers configured
- Lighthouse score: ≥90

### SEO
- Meta tags (title, description)
- Structured data (schema.org for local business)
- XML sitemap
- Google Search Console setup

---

## Content Guidelines

### Photography
- Use real photos from Emily's portfolio
- High resolution (at least 1200px width)
- Consistent lighting and styling
- All images compressed for web (< 200KB each)
- Alternative text required (accessibility)

### Copywriting
- Warm, approachable tone
- Emphasize craftsmanship and personal touch
- Call-to-action clear: "Call us" or "Contact us"
- No e-commerce language (no "add to cart", "checkout", etc.)
- Correct phone number throughout (713-555-2253 or (713) 555-CAKE)

### Example Copy
\`\`\`
❌ DON'T SAY:
"Order your custom cake online now. 
Add to cart. Easy checkout."

✅ DO SAY:
"To place your custom cake order, please give us a call 
at (713) 555-CAKE or visit us in person at 456 Baking Lane. 
Our team will walk you through the design process and create 
something truly special for your celebration."
\`\`\`

---

## Security and Compliance

### Privacy
- Privacy policy visible (link in footer)
- Only collect necessary data on inquiry form
- Email submissions go to secure backend
- No tracking pixels (unless Google Analytics)

### Accessibility
- WCAG 2.1 AA compliant
- All images have alt text
- Keyboard navigation works
- Screen reader friendly
- Color contrast 4.5:1 minimum

### Performance
- Lighthouse score ≥90
- Page load < 3 seconds
- Mobile friendly (responsive)
- No broken links

---

## Optional Enhancements (Extra Credit)

### 1. Instagram Feed Integration **note - maybe **
- Display Instagram posts on gallery page
- Shows customer-posted photos of orders
- Automatically updates (no manual posting)
- Social proof and engagement

### 2. Blog Section - **note - sounds good**
- Seasonal cake ideas
- Baking tips (non-competitors)
- Behind-the-scenes content
- SEO benefit (fresh content)

### 3. Email Newsletter **note - maybe **
- Monthly specials or new flavors
- Sign-up form on website
- Mailchimp or similar integration
- Nurture leads who inquire

### 4. Live Chat (Simple) **note - prob not **
- Chatbot or team member
- Quick answer to FAQs
- Link to contact form
- Not AI-powered (keep it simple)

### 5. Video Tour **note - maybewith an ai video or something**
- Short 1-2 minute video
- Emily's kitchen or workspace
- Shows craftsmanship
- Builds trust and personal connection

### 6. Testimonial Carousel **note - sounds nice **
- Rotating customer quotes
- Photos of happy customers (if permitted)
- Star ratings
- Auto-play with previous/next buttons

---

## Content Calendar

**Month 1 (November 2025):**
- [ ] Finalize design
- [ ] Write homepage copy
- [ ] Curate 20+ gallery photos
- [ ] Write About page
- [ ] Setup contact form backend
- [ ] Implement all pages
- [ ] Test on mobile/desktop/tablet
- [ ] SEO setup (meta tags, schema)
- [ ] Accessibility audit
- [ ] Launch website

**Ongoing:**
- [ ] Update gallery quarterly (add new cakes)
- [ ] Maintain hours/contact info
- [ ] Respond to inquiries quickly (within 24 hours)

---

## Launch Checklist

- [ ] All pages built and content complete
- [ ] Images compressed and optimized
- [ ] Links work (no 404s)
- [ ] Forms tested (submissions received)
- [ ] Mobile responsive tested
- [ ] SEO setup (meta tags, robots.txt, sitemap)
- [ ] Analytics configured (Google Analytics)
- [ ] SSL certificate valid
- [ ] Lighthouse score ≥90
- [ ] WCAG 2.1 AA audit passed
- [ ] DNS configured
- [ ] Domain live and accessible
- [ ] Email auto-replies working
- [ ] Contact email monitored

---

## After Launch

**Week 1-2:**
- Monitor for errors/issues
- Test inquiry form responses
- Check search console
- Verify analytics tracking

**Month 1:**
- Update hours/contact if needed
- Respond to inquiries
- Gather feedback

**Quarterly:**
- Update gallery (add new cakes)
- Refresh testimonials
- Check SEO rankings
- Monitor traffic patterns

---

## Separation from Internal App

### Two Completely Separate Systems

**Internal Staff Application:**
- URL: /staff or staff.emilybakes.com
- Requires authentication
- Order entry, management, reporting
- Private, employees only

**Public Website:**
- URL: emilybakes.com
- No authentication
- Gallery, about, contact form
- Public, for customers

### No Communication
- Staff app database NOT visible on website
- Website inquiry form does NOT create orders
- Customers do NOT see order status online
- Phone/email only communication

---

## Example Visitor Flow

\`\`\`
Customer → Google Search "custom cakes Houston"
Customer → Finds www.emilybakescakes.com
Customer → Browses gallery, impressed
Customer → Reads about page, trusts Emily
Customer → Scrolls to contact info
Customer → Calls (713) 555-CAKE
Customer → Speaks with Emily about cake ideas
Emily → Takes order details over phone
Emily → Logs into staff app
Emily → Enters customer info and customization
Emily → Sets price and pickup date
Emily → Confirms with customer
Customer → Pays when picking up cake
\`\`\`

---

## Related Documents

- **01_SCOPE_AND_NON_GOALS.md** - Website is secondary deliverable
- **02_INFORMATION_ARCHITECTURE.md** - Staff app navigation (not website)
- **14_DELTA_LOG.md** - Why website changed from e-commerce to marketing

---

**Status:** Optional Deliverable (Extra Credit)  
**Priority:** Secondary (after staff app is complete)  
**Last Updated:** November 5, 2025
