# Loading States - Quick Reference
## Emily Bakes Cakes

**Last Updated:** November 1, 2025

---

## 🚀 Quick Start

### 1. Skeleton Card Placeholders

\`\`\`tsx
import { SkeletonCard } from '../components/Loading/SkeletonCard';

// Customer site - Product skeleton
<SkeletonCard variant="customer" type="product" />

// Admin portal - KPI skeleton
<SkeletonCard variant="admin" type="kpi" />

// Admin portal - Table skeleton
<SkeletonCard variant="admin" type="table" />

// Admin portal - Chart skeleton with pulse
<SkeletonCard variant="admin" type="chart" />
\`\`\`

---

### 2. Lazy Loading Images

\`\`\`tsx
import { LazyImage } from '../components/Loading/LazyImage';

// With blur-up thumbnail
<LazyImage
  src="https://example.com/full-image.jpg"
  alt="Product"
  thumbnail="https://example.com/thumbnail.jpg"
  onLoad={() => console.log('Loaded!')}
/>

// Without thumbnail (uses skeleton)
<LazyImage
  src="https://example.com/image.jpg"
  alt="Product"
/>
\`\`\`

---

### 3. Progress Bars

\`\`\`tsx
import { ProgressBar, IndeterminateProgressBar } from '../components/Loading/ProgressBar';

// Known progress (0-100)
<ProgressBar 
  progress={uploadProgress} 
  variant="customer"
  showPercentage={true}
/>

// Unknown duration
<IndeterminateProgressBar variant="admin" />
\`\`\`

---

### 4. Loading Spinners

\`\`\`tsx
import { LoadingSpinner, ButtonSpinner } from '../components/Loading/LoadingSpinner';

// Inline spinner with label
<LoadingSpinner size="md" variant="customer" label="Loading products..." />

// Button loading state
<button disabled>
  <ButtonSpinner size="sm" />
  Saving...
</button>
\`\`\`

---

## 📋 Common Patterns

### Pattern 1: Page with Skeleton Loading

\`\`\`tsx
export function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      {isLoading ? (
        // Show skeletons
        <>
          <SkeletonCard variant="customer" type="product" />
          <SkeletonCard variant="customer" type="product" />
          <SkeletonCard variant="customer" type="product" />
        </>
      ) : (
        // Show actual products
        products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))
      )}
    </div>
  );
}
\`\`\`

---

### Pattern 2: Progressive Content Reveal

\`\`\`tsx
<div className="grid grid-cols-4 gap-6">
  {kpis.map((kpi, index) => (
    <div key={kpi.id} className="progressive-content">
      <Card>{/* Content */}</Card>
    </div>
  ))}
</div>
\`\`\`

**CSS automatically staggers:**
- 1st item: 0ms delay
- 2nd item: 50ms delay
- 3rd item: 100ms delay
- 4th item: 150ms delay

---

### Pattern 3: Form Submission with Progress

\`\`\`tsx
export function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setProgress(0);
    
    // Simulate multi-step submission
    setProgress(25); // Validating
    await validateOrder();
    
    setProgress(50); // Processing payment
    await processPayment();
    
    setProgress(75); // Creating order
    await createOrder();
    
    setProgress(100); // Complete
    setIsSubmitting(false);
  };

  return (
    <>
      {isSubmitting && (
        <ProgressBar 
          progress={progress} 
          variant="customer"
          showPercentage={true}
        />
      )}
      
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <ButtonSpinner size="sm" />
            Processing...
          </>
        ) : (
          'Place Order'
        )}
      </button>
    </>
  );
}
\`\`\`

---

### Pattern 4: Lazy Loading Gallery

\`\`\`tsx
export function Gallery() {
  const [images, setImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = () => {
    setLoadedCount(prev => prev + 1);
  };

  return (
    <div className="masonry-grid">
      {images.map(image => (
        <LazyImage
          key={image.id}
          src={image.url}
          alt={image.caption}
          thumbnail={image.thumbnail}
          onLoad={handleImageLoad}
        />
      ))}
      
      <p className="sr-only">
        {loadedCount} of {images.length} images loaded
      </p>
    </div>
  );
}
\`\`\`

---

## 🎨 Variant Differences

### Customer vs Admin Shimmer Colors

**Customer (Warm):**
\`\`\`css
linear-gradient(
  90deg,
  rgba(248, 235, 215, 0.3) 0%,      /* Cream Vanilla */
  rgba(196, 69, 105, 0.1) 50%,      /* Raspberry Pink */
  rgba(248, 235, 215, 0.3) 100%
)
\`\`\`

**Admin (Professional):**
\`\`\`css
linear-gradient(
  90deg,
  rgba(240, 240, 240, 0.15) 0%,     /* Light Gray */
  rgba(255, 255, 255, 0.05) 50%,    /* White */
  rgba(240, 240, 240, 0.15) 100%
)
\`\`\`

---

## ⚡ Performance Tips

### DO ✅
- Use skeletons for predictable layouts
- Lazy load images below the fold
- Show progress for operations > 1 second
- Use CSS animations (not JS)
- Maintain consistent sizing (no layout shift)

### DON'T ❌
- Animate width/height/top/left (causes reflow)
- Load all images at once
- Show spinners for < 500ms operations
- Use GIF spinners (not performant)
- Block interactions during load

---

## ♿ Accessibility Checklist

\`\`\`tsx
// ✅ Hide skeleton from screen readers
<div className="skeleton-card" aria-hidden="true">
  {/* Skeleton content */}
</div>

// ✅ Announce loading state
<div role="status" aria-live="polite">
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>

// ✅ Label progress bars
<ProgressBar 
  progress={50}
  aria-label="Upload progress: 50%"
/>

// ✅ Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer { animation: none; }
}
\`\`\`

---

## 🐛 Troubleshooting

### Skeleton Not Showing

**Problem:** Skeleton appears briefly then disappears
**Solution:** Ensure `isLoading` state is initialized to `true`

\`\`\`tsx
// ❌ Wrong
const [isLoading, setIsLoading] = useState(false);

// ✅ Correct
const [isLoading, setIsLoading] = useState(true);
\`\`\`

### Layout Shift During Load

**Problem:** Content jumps when skeleton is replaced
**Solution:** Ensure skeleton matches content dimensions

\`\`\`tsx
// Skeleton and content must have same container size
<div style={{ minHeight: '200px' }}>
  {isLoading ? <SkeletonCard /> : <ContentCard />}
</div>
\`\`\`

### Images Not Lazy Loading

**Problem:** All images load at once
**Solution:** Verify LazyImage is imported correctly

\`\`\`tsx
// ✅ Use LazyImage component
import { LazyImage } from '../components/Loading/LazyImage';

// ❌ Not regular img tag
<LazyImage src="..." alt="..." />
\`\`\`

### Progress Bar Not Visible

**Problem:** Progress bar doesn't appear
**Solution:** Check z-index and position

\`\`\`tsx
// Progress bar uses z-index: 9999
// Ensure no other elements have higher z-index
<ProgressBar progress={50} />
\`\`\`

---

## 📊 Component Props Reference

### SkeletonCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'customer' \| 'admin'` | `'customer'` | Color scheme |
| `type` | `'product' \| 'kpi' \| 'table' \| 'chart'` | `'product'` | Skeleton layout |

### LazyImage

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `src` | `string` | Yes | Full-resolution image URL |
| `alt` | `string` | Yes | Alt text for accessibility |
| `thumbnail` | `string` | No | Low-res thumbnail URL |
| `className` | `string` | No | Additional CSS classes |
| `style` | `CSSProperties` | No | Inline styles |
| `onLoad` | `() => void` | No | Callback when loaded |

### ProgressBar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | Required | Progress value (0-100) |
| `variant` | `'customer' \| 'admin'` | `'customer'` | Color scheme |
| `showPercentage` | `boolean` | `false` | Show percentage badge |

### LoadingSpinner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size |
| `variant` | `'customer' \| 'admin'` | `'customer'` | Color scheme |
| `label` | `string` | No | Loading label text |

---

## 🎓 Best Practices

### 1. Loading Duration Guidelines

| Duration | User Experience | Recommendation |
|----------|----------------|----------------|
| < 300ms | Instant | No indicator needed |
| 300ms - 1s | Fast | Inline spinner only |
| 1s - 3s | Noticeable | Skeleton placeholder |
| > 3s | Slow | Progress bar with % |

### 2. Skeleton Sizing

**Match Content Dimensions:**
\`\`\`tsx
// Product card is 300x400px
<SkeletonCard 
  style={{ width: '300px', height: '400px' }}
  variant="customer"
  type="product"
/>
\`\`\`

### 3. Progressive Enhancement

**Show most important content first:**

\`\`\`
Loading Priority:
1. Navigation (instant)
2. Page structure (50ms)
3. Above-the-fold content (200ms)
4. Below-the-fold content (lazy load)
5. Non-critical images (lazy load)
\`\`\`

### 4. Error States

**Always handle loading errors:**

\`\`\`tsx
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchData()
    .then(data => setData(data))
    .catch(err => setError(err))
    .finally(() => setIsLoading(false));
}, []);

if (error) return <ErrorMessage />;
if (isLoading) return <SkeletonCard />;
return <Content />;
\`\`\`

---

## 📱 Mobile Considerations

### Touch-Friendly Loading States

\`\`\`tsx
// Ensure loading indicators are visible on small screens
<div style={{ minHeight: '48px' }}>
  {isLoading ? (
    <LoadingSpinner size="md" label="Loading..." />
  ) : (
    <Content />
  )}
</div>
\`\`\`

### Bandwidth Optimization

\`\`\`tsx
// Use smaller thumbnails for mobile
const thumbnailUrl = isMobile 
  ? image.thumbnail_mobile  // 5px wide
  : image.thumbnail_desktop; // 10px wide

<LazyImage
  src={image.url}
  alt={image.alt}
  thumbnail={thumbnailUrl}
/>
\`\`\`

---

## 🔗 Related Documentation

- **LOADING_STATES_SYSTEM.md** - Complete technical documentation
- **GRADIENT_SYSTEM.md** - Animated backgrounds
- **UNIFIED_DESIGN_SYSTEM.md** - Core design tokens
- **QUICK_REFERENCE.md** - General component reference

---

**Need Help?** Check the full LOADING_STATES_SYSTEM.md for detailed implementation examples and troubleshooting.

**Version:** 2.0  
**Last Updated:** November 1, 2025  
**Status:** Production Ready ✅
