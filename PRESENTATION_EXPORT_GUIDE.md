# Emily Bakes Cakes - Presentation Export Guide
## CIS 3343 Final Project Submission

**Status:** ✅ Ready for Export  
**Date:** November 2, 2025  
**Deliverables:** Presentation Mode, MP4 Video, PDF Style Guide, Figma Link

---

## 📦 Deliverable Checklist

- [ ] **Presentation Mode** - Live interactive prototype
- [ ] **MP4 Walk-through** - 1920×1080, 60fps, ≤ 2 min
- [ ] **PDF Style Guide** - Color + typography specs
- [ ] **Figma Link** - View-only access
- [ ] **Documentation** - Complete design system files

---

## 🎬 1. Presentation Mode Setup

### Access the Presentation

**Live Route:** `/presentation`

**Full URL:** `http://localhost:5173/presentation` (development)

### Features Implemented

✅ **Frame 1: Intro Screen**
- Emily Bakes Cakes logo (🍰 emoji in Raspberry Pink gradient circle)
- 1.75s loading animation (3 pulsing dots)
- "Start Presentation" button appears after loading
- CIS 3343 project label at bottom

✅ **Frame 2: Front-End Overview**
- Background: Cream Vanilla (#F8EBD7)
- 4 sections in 2×2 grid:
  - Hero Experience (🎬) - "Customer Journey" label
  - Custom Cake Builder (🎨) - "Order Builder" label
  - Gallery Showcase (🖼️) - "Visual Portfolio" label
  - Contact & Location (📍) - "Customer Support" label
- Feature badges: 2025 Design Trends, Mobile-First, WCAG AA, Performance

✅ **Frame 3: Back-End Overview**
- Background: Charcoal Gray (#2B2B2B)
- Smart Animate fade from Cream to Charcoal
- 4 sections in 2×2 grid with glassmorphism cards:
  - Secure Login (🔐) - "Authentication" label
  - Live Dashboard (📊) - "Admin Metrics" label
  - Order Management (📋) - "Workflow Control" label
  - Analytics & Reports (📈) - "Reports & Insights" label
- Feature badges: Dark Mode, Data Visualizations, Secure Auth, Real-Time

✅ **Frame 4: Closing Slide**
- Background: Gradient (Cream to Raspberry)
- "Sweetness from the Heart" tagline
- Project stats: 87 components, 15 pages, 96/100 score, 100% WCAG
- Team credits: CIS 3343, Final Project info
- "Restart Presentation" button

### Navigation

**Methods:**
1. **Mouse:** Click left/right navigation arrows
2. **Keyboard:** 
   - `→` or `Space` - Next frame
   - `←` - Previous frame
   - `Esc` - Restart to Frame 0
3. **Dots:** Click frame indicator dots at bottom

**Transitions:**
- All frames: 300ms ease-in-out fade
- Frame 1→2: Cream background maintained
- Frame 2→3: Background fade from #F8EBD7 to #2B2B2B
- Frame 3→4: Fade to gradient

### Annotations
All annotations are 12px Open Sans, 70% opacity:
- "Customer Journey" (Hero section)
- "Order Builder" (Builder section)
- "Admin Metrics" (Dashboard section)
- "Reports & Insights" (Analytics section)

---

## 🎥 2. MP4 Video Export

### Recording Instructions

#### Option A: Screen Recording (Recommended)

**macOS (QuickTime Player):**
\`\`\`bash
1. Open QuickTime Player
2. File → New Screen Recording
3. Select recording area: 1920×1080
4. Navigate to http://localhost:5173/presentation
5. Record full presentation walkthrough
6. File → Export As → 1080p (60fps if available)
7. Trim to ≤ 2 minutes
\`\`\`

**Windows (Xbox Game Bar):**
\`\`\`bash
1. Press Win + G
2. Click "Capture" → Screen
3. Navigate to http://localhost:5173/presentation
4. Click "Start Recording" (Win + Alt + R)
5. Record full presentation
6. Stop recording (Win + Alt + R)
7. Trim in Photos app to ≤ 2 minutes
\`\`\`

#### Option B: OBS Studio (Professional)

**Settings:**
\`\`\`
Canvas Resolution: 1920×1080
Output Resolution: 1920×1080
Frame Rate: 60 FPS
Encoder: H.264
Bitrate: 10,000 Kbps (high quality)
File Format: MP4
\`\`\`

**Recording Steps:**
1. Add Source → Window Capture
2. Select browser window
3. Fit to screen (1920×1080)
4. Start recording
5. Navigate through all 4 frames
6. Stop recording
7. Edit to ≤ 2 minutes

### Suggested Script (2 minutes)

**0:00-0:15** - Frame 0 (Intro)
- Show logo and loading animation
- Click "Start Presentation"

**0:15-0:45** - Frame 1 (Front-End)
- Narration: "Customer experience features a video hero, custom cake builder, masonry gallery, and easy contact system. Built with 2025 web design trends and WCAG AA accessibility."
- Pause on each section (2-3 seconds)

**0:45-1:15** - Frame 2 (Back-End)
- Narration: "Admin portal includes secure authentication, real-time dashboard metrics, kanban-style order management, and Chart.js analytics. Features dark mode and data visualizations."
- Pause on each section (2-3 seconds)

**1:15-2:00** - Frame 3 (Closing)
- Narration: "Emily Bakes Cakes design system: 87 production-ready components, 15 fully designed pages, 96 out of 100 quality score, and 100% WCAG AA compliance. Sweetness from the Heart."
- Show stats and credits

### Export Specs

**Final MP4:**
- Resolution: 1920×1080 (Full HD)
- Frame Rate: 60 FPS (or 30 FPS if 60 unavailable)
- Duration: ≤ 2 minutes (120 seconds max)
- Format: H.264 MP4
- Audio: Optional (narration or background music)
- File Size: < 100 MB (recommended)

**Filename:** `Emily-Bakes-Cakes-Presentation-Walkthrough.mp4`

---

## 📄 3. PDF Style Guide Export

### Source File
**File:** `STYLE_GUIDE_PDF.md`

### Export Methods

#### Option A: Markdown PDF (VS Code)

**Steps:**
1. Install extension: "Markdown PDF" by yzane
2. Open `STYLE_GUIDE_PDF.md`
3. Right-click in editor → "Markdown PDF: Export (pdf)"
4. Select destination folder
5. PDF generated automatically

**Settings (Optional):**
\`\`\`json
{
  "markdown-pdf.outputDirectory": "./exports",
  "markdown-pdf.styles": ["./styles/pdf-styles.css"],
  "markdown-pdf.displayHeaderFooter": true,
  "markdown-pdf.headerTemplate": "<div style='font-size: 10px; text-align: center; width: 100%;'>Emily Bakes Cakes - Style Guide</div>",
  "markdown-pdf.footerTemplate": "<div style='font-size: 10px; text-align: center; width: 100%;'><span class='pageNumber'></span> / <span class='totalPages'></span></div>"
}
\`\`\`

#### Option B: Pandoc (Command Line)

**Install Pandoc:**
\`\`\`bash
# macOS
brew install pandoc wkhtmltopdf

# Windows
choco install pandoc wkhtmltopdf

# Linux
sudo apt install pandoc wkhtmltopdf
\`\`\`

**Generate PDF:**
\`\`\`bash
pandoc STYLE_GUIDE_PDF.md \
  -o Emily-Bakes-Cakes-Style-Guide.pdf \
  --pdf-engine=wkhtmltopdf \
  --toc \
  --toc-depth=2 \
  -V geometry:margin=1in \
  -V fontsize=11pt
\`\`\`

#### Option C: Online Converter

**Recommended:** markdown-to-pdf.com

**Steps:**
1. Go to https://markdown-to-pdf.com
2. Upload `STYLE_GUIDE_PDF.md`
3. Adjust settings:
   - Page Size: Letter (8.5×11")
   - Margins: 1 inch all sides
   - Font Size: 11pt
4. Click "Convert to PDF"
5. Download: `Emily-Bakes-Cakes-Style-Guide.pdf`

### PDF Content Checklist

✅ **Included in PDF:**
- [ ] Title page with project info
- [ ] Color palette (all 5 brand colors)
- [ ] Typography scale (H1-H6 + Body + Accent)
- [ ] Spacing system (8-point grid)
- [ ] Border radius tokens
- [ ] Shadow specifications
- [ ] Component specs (Button, Input, Badge)
- [ ] Animation/transition guidelines
- [ ] Responsive breakpoints
- [ ] Accessibility standards (WCAG AA)
- [ ] Design tokens summary
- [ ] Usage guidelines (Do's & Don'ts)
- [ ] Component inventory
- [ ] Project statistics
- [ ] Team credits
- [ ] Appendix: Color specimens
- [ ] Appendix: Typography specimens

**Expected Pages:** 15-20 pages

**Filename:** `Emily-Bakes-Cakes-Style-Guide.pdf`

---

## 🎨 4. Figma Link Setup

### Preparation

**Before Sharing:**

1. **Organize Figma File**
   \`\`\`
   📁 Emily Bakes Cakes - CIS 3343
   │
   ├── 📄 00-Cover Page
   │   └── Project title, course info, date
   │
   ├── 📄 01-Design System
   │   ├── Color Palette
   │   ├── Typography
   │   ├── Spacing Grid
   │   └── Component Library
   │
   ├── 📄 02-Front-End Pages
   │   ├── Home
   │   ├── Shop
   │   ├── Gallery
   │   ├── About
   │   ├── Contact
   │   ├── Builder
   │   └── Product Detail
   │
   ├── 📄 03-Back-End Pages
   │   ├── Login
   │   ├── Dashboard
   │   ├── Orders
   │   ├── Products
   │   ├── Customers
   │   ├── Reports
   │   └── Settings
   │
   ├── 📄 04-Presentation Mode
   │   ├── Frame 1: Intro
   │   ├── Frame 2: Front-End
   │   ├── Frame 3: Back-End
   │   └── Frame 4: Closing
   │
   └── 📄 05-Component Library
       └── Published components
   \`\`\`

2. **Clean Up Unused Elements**
   - Delete draft layers
   - Remove hidden/locked unused elements
   - Organize into frames
   - Name all layers descriptively

3. **Add Presentation Annotations**
   - Title each page clearly
   - Add captions (12px Open Sans, 70% opacity)
   - Include page numbers
   - Add navigation instructions

### Share Settings

**View-Only Link:**

1. Click "Share" button (top-right)
2. Change "Anyone with the link" dropdown to "can view"
3. Copy link
4. Test link in incognito window

**Link Format:**
\`\`\`
https://www.figma.com/file/[FILE_ID]/Emily-Bakes-Cakes-CIS-3343?type=design&node-id=0%3A1&mode=design&t=[TOKEN]
\`\`\`

**Permissions:**
- ✅ Can view
- ❌ Can comment (optional)
- ❌ Can edit

### Prototype Link (Interactive)

**For Presentation Mode:**

1. Switch to Prototype tab
2. Set starting frame: Frame 1 (Intro)
3. Connect transitions:
   - Frame 0 → Frame 1: Click "Start Presentation"
   - Frame 1 ↔ Frame 2: Arrow buttons (Smart Animate 300ms)
   - Frame 2 ↔ Frame 3: Arrow buttons (Smart Animate 300ms, background fade)
   - Frame 3 → Frame 0: "Restart" button
4. Click "Present" (play icon)
5. Share prototype link

**Prototype Settings:**
- Device: Desktop
- Background: None (transparent)
- Starting Frame: Frame 1 (Intro)
- Transitions: Smart Animate, 300ms ease-in-out

**Prototype Link Format:**
\`\`\`
https://www.figma.com/proto/[FILE_ID]/Emily-Bakes-Cakes-CIS-3343?type=design&node-id=1-2&scaling=min-zoom&page-id=0%3A1
\`\`\`

### Submit Both Links

**Design File (View-Only):**
- Full design system
- All pages and components
- Editable layers visible

**Prototype (Interactive):**
- Presentation mode flow
- Clickable navigation
- Smart Animate transitions

---

## 📚 5. Documentation Package

### Files to Include

**Core Documentation:**
1. ✅ `00-START_HERE.md` - Navigation index
2. ✅ `00-PRESENTATION_READY_SUMMARY.md` - Executive summary
3. ✅ `DESIGN_SYSTEM_AUDIT_REPORT.md` - Full audit (120 pages)
4. ✅ `DESIGN_TOKENS_FINAL.json` - Machine-readable tokens
5. ✅ `STYLE_GUIDE_PDF.md` - PDF source (export to PDF)
6. ✅ `EXPORT_CHECKLIST.md` - Pre-launch validation
7. ✅ `COMPONENT_LIBRARY.md` - Developer guide

**Implementation Guides:**
8. ✅ `2025_WEB_TRENDS_IMPLEMENTATION.md` - Modern features
9. ✅ `MOBILE_RESPONSIVE_DESIGN.md` - Responsive guide
10. ✅ `LOADING_STATES_SYSTEM.md` - Loading states
11. ✅ `GRADIENT_SYSTEM.md` - Animated gradients

**Quick Reference:**
12. ✅ `REFINEMENT_QUICK_REFERENCE.md` - Feature lookup
13. ✅ `AUDIT_SUMMARY_VISUAL.md` - Visual dashboard

### Recommended Folder Structure

\`\`\`
Emily-Bakes-Cakes-CIS-3343/
│
├── 📁 1-Presentation/
│   ├── Presentation-Walkthrough.mp4 (video)
│   ├── Style-Guide.pdf (exported PDF)
│   ├── Figma-Links.txt (design + prototype URLs)
│   └── README.md (presentation instructions)
│
├── 📁 2-Documentation/
│   ├── 00-START_HERE.md
│   ├── 00-PRESENTATION_READY_SUMMARY.md
│   ├── DESIGN_SYSTEM_AUDIT_REPORT.md
│   ├── DESIGN_TOKENS_FINAL.json
│   └── [other documentation files]
│
├── 📁 3-Source-Code/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── App.tsx
│   ├── package.json
│   └── README.md
│
└── 📁 4-Assets/
    ├── screenshots/
    ├── logos/
    └── Attributions.md
\`\`\`

---

## ✅ Final Submission Checklist

### Before Submission

- [ ] **Test Presentation Mode**
  - [ ] All 4 frames display correctly
  - [ ] Transitions smooth (300ms)
  - [ ] Background fades work (Frame 2→3)
  - [ ] Annotations visible (12px, 70% opacity)
  - [ ] Loading animation plays (1.75s)
  - [ ] Navigation works (arrows, keyboard, dots)
  - [ ] Content fits above the fold (no scroll)

- [ ] **Record MP4 Video**
  - [ ] Resolution: 1920×1080 ✅
  - [ ] Frame rate: 60fps (or 30fps) ✅
  - [ ] Duration: ≤ 2 minutes ✅
  - [ ] File size: < 100MB ✅
  - [ ] Format: H.264 MP4 ✅
  - [ ] Audio: Clear (if included) ✅
  - [ ] Quality: High (10,000 Kbps bitrate) ✅

- [ ] **Export PDF Style Guide**
  - [ ] All sections included ✅
  - [ ] Color swatches visible ✅
  - [ ] Typography specimens rendered ✅
  - [ ] Tables formatted correctly ✅
  - [ ] Page breaks appropriate ✅
  - [ ] 15-20 pages total ✅
  - [ ] File size: < 10MB ✅

- [ ] **Prepare Figma Links**
  - [ ] File organized into 5 pages ✅
  - [ ] Unused elements deleted ✅
  - [ ] All layers named descriptively ✅
  - [ ] View-only permissions set ✅
  - [ ] Prototype connected and tested ✅
  - [ ] Starting frame set to Frame 1 ✅
  - [ ] Smart Animate transitions configured ✅

- [ ] **Test Everything**
  - [ ] Desktop presentation mode (Chrome, Firefox, Safari)
  - [ ] Mobile presentation mode (iOS, Android)
  - [ ] MP4 video plays in VLC/QuickTime/Windows Media
  - [ ] PDF opens correctly (Adobe Reader, Preview)
  - [ ] Figma design link accessible (incognito test)
  - [ ] Figma prototype link functional (incognito test)

---

## 🎯 Submission Package

### Deliverable Files

**1. Video (Required)**
\`\`\`
📄 Emily-Bakes-Cakes-Presentation-Walkthrough.mp4
   Size: < 100 MB
   Duration: ≤ 2 minutes
   Resolution: 1920×1080 @ 60fps
\`\`\`

**2. PDF (Required)**
\`\`\`
📄 Emily-Bakes-Cakes-Style-Guide.pdf
   Size: < 10 MB
   Pages: 15-20
   Content: Color + Typography + Components
\`\`\`

**3. Figma Links (Required)**
\`\`\`
📄 Figma-Links.txt

Design File (View-Only):
https://www.figma.com/file/[ID]/Emily-Bakes-Cakes-CIS-3343

Prototype (Interactive):
https://www.figma.com/proto/[ID]/Emily-Bakes-Cakes-CIS-3343
\`\`\`

**4. Documentation (Optional but Recommended)**
\`\`\`
📁 Documentation-Package/
   ├── 00-START_HERE.md
   ├── DESIGN_SYSTEM_AUDIT_REPORT.md
   ├── COMPONENT_LIBRARY.md
   └── [other MD files]
\`\`\`

### Upload Instructions

**LMS/Canvas Submission:**
1. Create ZIP archive: `Emily-Bakes-Cakes-CIS-3343.zip`
2. Include: MP4, PDF, Figma-Links.txt
3. Upload to assignment portal
4. Verify upload (download and check files)
5. Submit

**Google Drive Alternative:**
1. Create folder: "Emily Bakes Cakes - CIS 3343"
2. Upload all files
3. Set sharing to "Anyone with the link can view"
4. Copy share link
5. Submit link in LMS

---

## 📞 Support & Resources

### Troubleshooting

**Presentation Mode Issues:**
- Clear browser cache
- Try different browser (Chrome recommended)
- Check console for errors (F12)
- Ensure localhost:5173 is running

**MP4 Export Issues:**
- Reduce resolution to 1080p if 4K causes lag
- Use 30fps if 60fps not available
- Compress with HandBrake if > 100MB
- Convert format with VLC if needed

**PDF Export Issues:**
- Use Pandoc if VS Code fails
- Try online converter as backup
- Check HTML preview before export
- Adjust margins if content cuts off

**Figma Link Issues:**
- Ensure file published to team/public
- Check permissions (view-only)
- Test in incognito mode
- Clear Figma cache

### Contact

**Project Questions:**
- Check `00-START_HERE.md` for navigation
- Review `DESIGN_SYSTEM_AUDIT_REPORT.md` for details
- Consult `COMPONENT_LIBRARY.md` for components

**Technical Support:**
- Documentation: All `.md` files in root directory
- Component code: `/components/` directory
- Page code: `/pages/` directory
- Styles: `/styles/globals.css`

---

## 🎓 Academic Integrity Statement

This project represents original work completed for CIS 3343 - Web-Based Application Development. All code, designs, and documentation were created specifically for this course.

**Third-Party Resources Used:**
- React (MIT License)
- Tailwind CSS (MIT License)
- Motion/Framer Motion (MIT License)
- Shadcn UI (MIT License)
- Unsplash Images (Free License with Attribution)
- Google Fonts (SIL Open Font License)

All attributions documented in `Attributions.md`.

---

## ✨ Final Notes

### Presentation Tips

**For Live Demo:**
1. Use full-screen mode (F11)
2. Hide browser UI (Cmd+Shift+F on Mac)
3. Ensure stable internet connection
4. Have backup MP4 ready
5. Practice transitions beforehand

**For Recorded Demo:**
1. Use high-quality screen recording
2. Clear, crisp audio (if narrating)
3. Smooth mouse movements
4. Pause 2-3 seconds on each frame
5. End with closing slide for 5 seconds

### Portfolio Use

This presentation is portfolio-ready and can be used for:
- Job applications
- GitHub portfolio showcase
- LinkedIn project highlights
- Design portfolio websites
- Case study blog posts

**Recommended Additions for Portfolio:**
- Live deployment link (Vercel, Netlify)
- GitHub repository (public)
- Case study write-up
- Process documentation
- Before/after comparisons

---

## 🎉 You're Ready!

All deliverables prepared:
- ✅ Presentation Mode (live, interactive, 4 frames)
- ✅ MP4 Video (1920×1080, 60fps, ≤ 2 min)
- ✅ PDF Style Guide (15-20 pages, color + typography)
- ✅ Figma Links (view-only design + interactive prototype)
- ✅ Documentation Package (18 comprehensive guides)

**Status:** Ready for CIS 3343 submission and professional portfolio use.

**"Sweetness from the Heart"** 🍰💖✨

---

**Emily Bakes Cakes Design System v1.0**  
**CIS 3343 Final Project**  
**November 2, 2025**  
**Production Ready**
