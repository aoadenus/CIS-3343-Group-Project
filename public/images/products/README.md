# Product Images Directory

This directory contains images for all product types used in the Emily Bakes Cakes OMS.

## Directory Structure

\`\`\`
/public/images/products/
├── cakes/                    # Standard cake images (14 cakes)
├── cake-flavors/            # Cake flavor images (6 flavors)
├── fillings/                # Filling flavor images (15 fillings)
├── icings/                  # Icing flavor images (6 icings)
├── icing-colors/           # Icing color sample images (optional, 37 colors)
└── placeholder.svg         # Fallback placeholder image
\`\`\`

## Image Specifications

### File Format
- **Preferred**: JPEG (.jpg)
- **Alternative**: PNG (.png)
- **Fallback**: SVG for placeholder

### Dimensions
- **Recommended**: 400x400px (square aspect ratio)
- **Minimum**: 200x200px
- **Maximum**: 1000x1000px

### File Size
- **Target**: < 100KB per image
- **Maximum**: < 200KB per image
- Compress images using tools like TinyPNG or ImageOptim

### Naming Convention
- Use lowercase letters
- Use hyphens (-) for spaces
- Match the product ID exactly
- Examples:
  - `birthday-celebration.jpg`
  - `devils-food-chocolate.jpg`
  - `white-buttercream.jpg`

## Required Images

### Standard Cakes (14 images needed)
1. `birthday-celebration.jpg`
2. `almond-delight.jpg`
3. `lemon-cream-cheese.jpg`
4. `black-forest.jpg`
5. `german-chocolate.jpg`
6. `cream-cheese-chocolate.jpg`
7. `italian-cream.jpg`
8. `lemon-doberge.jpg`
9. `chocolate-doberge.jpg`
10. `half-half-doberge.jpg`
11. `pecan-praline.jpg`
12. `chocolate-banana.jpg`
13. `strawberry-delight.jpg`
14. `cookies-cream.jpg`

### Cake Flavors (6 images needed)
1. `vanilla.jpg`
2. `almond.jpg`
3. `yellow.jpg`
4. `devils-food-chocolate.jpg`
5. `chocolate.jpg`
6. `strawberry.jpg`

### Filling Flavors (15 images needed)
1. `white-buttercream.jpg`
2. `chocolate-buttercream.jpg`
3. `almond-buttercream.jpg`
4. `cream-cheese.jpg`
5. `lemon-curd.jpg`
6. `strawberry.jpg`
7. `raspberry.jpg`
8. `rum-strawberry.jpg`
9. `pecan-praline.jpg`
10. `chocolate-mousse.jpg`
11. `lemon-mousse.jpg`
12. `strawberry-mousse.jpg`
13. `raspberry-mousse.jpg`
14. `white-chocolate-mousse.jpg`
15. `mango-mousse.jpg`

### Icing Flavors (6 images needed)
1. `white-buttercream.jpg`
2. `chocolate-buttercream.jpg`
3. `almond-buttercream.jpg`
4. `white-chocolate-buttercream.jpg`
5. `cream-cheese.jpg`
6. `chocolate-ganache.jpg`

### Icing Colors (optional, 37 images)
Images for icing colors are optional since the hex color provides sufficient visual representation.

## Placeholder Image

The `placeholder.svg` file is used as a fallback when:
- An image file is missing
- An image fails to load
- An image path is undefined

This placeholder displays a simple cake icon with "No Image Available" text.

## Adding New Images

To add a new product image:

1. Prepare the image according to specifications above
2. Name the file to match the product ID exactly
3. Place it in the appropriate subdirectory
4. The image will automatically appear in the UI (no code changes needed)
5. Verify the image displays correctly in the order creation wizard

## Image Quality Guidelines

1. **Lighting**: Well-lit with consistent lighting
2. **Background**: White or light neutral background preferred
3. **Focus**: Clear focus on the product
4. **Composition**: Centered product, minimal negative space
5. **Consistency**: Similar style and quality across all images

## Technical Notes

- All images are served from the `/public` directory
- Paths in code use relative URLs: `/images/products/cakes/birthday-celebration.jpg`
- The UI includes automatic error handling to show placeholder on load failure
- Images are loaded on-demand (no preloading)
- No image optimization or resizing is currently implemented
- All images should be manually optimized before uploading

## Future Enhancements

Planned improvements for the image system:

1. **Upload Interface**: Admin panel for managing images
2. **Auto-Optimization**: Automatic resizing and compression
3. **CDN Integration**: Serve images from CDN
4. **Multiple Variants**: Thumbnail, medium, and full-size versions
5. **Image Gallery**: Multiple images per product
6. **Lazy Loading**: Performance optimization for large galleries

## Support

For questions or issues with product images, contact the development team or refer to the main documentation at `/docs/PRODUCT_IMAGE_SCHEMA.md`.
