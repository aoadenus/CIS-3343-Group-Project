# Product Image Schema Documentation
## Emily Bakes Cakes - Image Support Implementation

---

## Overview

This document describes the image support feature added to the Emily Bakes Cakes OMS to display product images in the order creation interface and other areas.

## Data Structure Changes

### Product Data Structures with Image Support

All product data structures now include an optional `image_path` field of type `VARCHAR(255)` to store the relative path to product images.

#### 1. Standard Cakes
\`\`\`typescript
export interface StandardCakeRecipe {
  id: string;
  name: string;
  basePrice: number;
  description?: string;
  category?: string;
  image_path?: string;  // NEW: Path to cake image
  layers: Array<{
    flavor: string;
    fillings: string[];
    icing: string;
    notes?: string;
  }>;
}
\`\`\`

**Image Path Format**: `/images/products/cakes/{cake-id}.jpg`

**Example**:
\`\`\`typescript
{
  id: 'birthday-celebration',
  name: 'Birthday Celebration',
  image_path: '/images/products/cakes/birthday-celebration.jpg',
  // ... other fields
}
\`\`\`

#### 2. Cake Flavors
\`\`\`typescript
export interface CakeFlavor {
  id: string;
  name: string;
  price: number;
  image_path?: string;  // NEW: Path to flavor image
}
\`\`\`

**Image Path Format**: `/images/products/cake-flavors/{flavor-id}.jpg`

**Example**:
\`\`\`typescript
{
  id: 'vanilla',
  name: 'Vanilla',
  price: 0,
  image_path: '/images/products/cake-flavors/vanilla.jpg'
}
\`\`\`

#### 3. Filling Flavors
\`\`\`typescript
export interface FillingFlavor {
  id: string;
  name: string;
  price: number;
  image_path?: string;  // NEW: Path to filling image
}
\`\`\`

**Image Path Format**: `/images/products/fillings/{filling-id}.jpg`

**Example**:
\`\`\`typescript
{
  id: 'chocolate-mousse',
  name: 'Chocolate Mousse',
  price: 0,
  image_path: '/images/products/fillings/chocolate-mousse.jpg'
}
\`\`\`

#### 4. Icing Flavors
\`\`\`typescript
export interface IcingFlavor {
  id: string;
  name: string;
  price: number;
  image_path?: string;  // NEW: Path to icing image
}
\`\`\`

**Image Path Format**: `/images/products/icings/{icing-id}.jpg`

**Example**:
\`\`\`typescript
{
  id: 'cream-cheese',
  name: 'Cream Cheese',
  price: 0,
  image_path: '/images/products/icings/cream-cheese.jpg'
}
\`\`\`

#### 5. Icing Colors
\`\`\`typescript
export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  category: 'primary' | 'pastel' | 'neon' | 'fall' | 'extra';
  image_path?: string;  // NEW: Path to color sample image (optional)
}
\`\`\`

**Image Path Format**: `/images/products/icing-colors/{color-id}.jpg`

**Note**: For icing colors, the hex value provides sufficient visual representation, so images are optional.

---

## Directory Structure

All product images are stored in the `/public/images/products/` directory with the following subdirectories:

\`\`\`
/public/images/products/
├── cakes/                    # Standard cake images
│   ├── birthday-celebration.jpg
│   ├── almond-delight.jpg
│   ├── lemon-cream-cheese.jpg
│   └── ...
├── cake-flavors/            # Cake flavor images
│   ├── vanilla.jpg
│   ├── chocolate.jpg
│   ├── strawberry.jpg
│   └── ...
├── fillings/                # Filling flavor images
│   ├── white-buttercream.jpg
│   ├── chocolate-mousse.jpg
│   ├── lemon-curd.jpg
│   └── ...
├── icings/                  # Icing flavor images
│   ├── white-buttercream.jpg
│   ├── chocolate-ganache.jpg
│   ├── cream-cheese.jpg
│   └── ...
├── icing-colors/           # Icing color sample images (optional)
│   └── ...
└── placeholder.svg         # Fallback placeholder image
\`\`\`

---

## Placeholder Image

A placeholder image (`/images/products/placeholder.svg`) is provided for products without images. This SVG displays a simple cake icon with "No Image Available" text.

**Usage**: All image components include error handling to fall back to the placeholder:

\`\`\`typescript
<img
  src={product.image_path || '/images/products/placeholder.svg'}
  alt={product.name}
  onError={(e) => { 
    (e.target as HTMLImageElement).src = '/images/products/placeholder.svg'; 
  }}
/>
\`\`\`

---

## UI Integration

### 1. Order Creation - Step 2: Cake Type Selection

Standard cakes are displayed as a grid of cards with thumbnails:

- **Image Size**: 150px height, full width, cover fit
- **Border**: Selected cake has 3px solid border (#C44569)
- **Fallback**: Uses placeholder.svg if image fails to load

### 2. Order Creation - Step 3: Layer Builder

#### Cake Flavors
- **Display**: Selected flavor shown with 40x40px thumbnail above dropdown
- **Border Radius**: 6px
- **Background**: Light pink highlight (#rgba(196, 69, 105, 0.05))

#### Fillings
- **Display**: Grid of buttons with 32x32px inline thumbnails
- **Layout**: Flex with 8px gap between image and text
- **Border**: 2px solid (#C44569 when selected)

#### Icings
- **Display**: Selected icing shown with 40x40px thumbnail above dropdown
- **Border Radius**: 6px
- **Background**: Light pink highlight

---

## Database Schema Considerations

### Future Database Integration

If product data is moved from static files to a database, the following schema additions are recommended:

#### Products Table Extension
\`\`\`sql
ALTER TABLE products
ADD COLUMN image_path VARCHAR(255) NULL;

COMMENT ON COLUMN products.image_path IS 'Relative path to product image from /public directory';
\`\`\`

#### Cake Flavors Table (New)
\`\`\`sql
CREATE TABLE cake_flavors (
  id SERIAL PRIMARY KEY,
  flavor_id VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  price INTEGER DEFAULT 0,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Filling Flavors Table (New)
\`\`\`sql
CREATE TABLE filling_flavors (
  id SERIAL PRIMARY KEY,
  filling_id VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  price INTEGER DEFAULT 0,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Icing Flavors Table (New)
\`\`\`sql
CREATE TABLE icing_flavors (
  id SERIAL PRIMARY KEY,
  icing_id VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  price INTEGER DEFAULT 0,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### Icing Colors Table (New)
\`\`\`sql
CREATE TABLE icing_colors (
  id SERIAL PRIMARY KEY,
  color_id VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  hex VARCHAR(7) NOT NULL,
  category VARCHAR(20) NOT NULL,
  image_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

## Image Specifications

### Recommended Image Formats
- **Format**: JPEG or PNG
- **Dimensions**: 400x400px minimum (square aspect ratio preferred)
- **File Size**: < 200KB for optimal loading
- **Naming**: Lowercase with hyphens (e.g., `chocolate-mousse.jpg`)

### Image Quality Guidelines
1. **Lighting**: Well-lit, consistent lighting across all product images
2. **Background**: White or light neutral background preferred
3. **Focus**: Clear focus on the product
4. **Composition**: Centered product, minimal negative space
5. **Consistency**: Similar style across all product images

---

## Implementation Notes

### Current State
- ✅ Data structures updated with `image_path` field
- ✅ Directory structure created
- ✅ Placeholder image created
- ✅ UI components updated to display images
- ✅ Error handling implemented (fallback to placeholder)

### Future Enhancements
1. **Image Upload Interface**: Admin panel for uploading/managing product images
2. **Image Optimization**: Automatic resizing and compression on upload
3. **CDN Integration**: Serve images from CDN for better performance
4. **Multiple Images**: Support for multiple images per product (gallery view)
5. **Image Variants**: Thumbnail, medium, and full-size versions

---

## Accessibility

All product images include:
- **Alt Text**: Descriptive alt text using product name
- **Error Handling**: Graceful fallback to placeholder
- **Semantic HTML**: Proper img tags with appropriate attributes

---

## Version History

- **v1.0** (November 2025): Initial implementation
  - Added `image_path` field to all product data structures
  - Created directory structure
  - Implemented UI integration in order creation wizard
  - Added placeholder image fallback

---

## Related Documentation

- [ERD Current Implementation](./ERD_Current_Implementation.md)
- [Schema Gap Analysis](./Schema_Gap_Analysis.md)
- [Product Catalog Transformation](./PRODUCT-CATALOG-TRANSFORMATION.md)
