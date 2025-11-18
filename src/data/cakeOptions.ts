// ============================================================================
// EMILY BAKES CAKES - COMPLETE CASE STUDY DATA
// Single Source of Truth for All Product Options
// Updated: November 13, 2025
// Source: CIS 3343 Fall 2025 Case Study
// ============================================================================

// ============================================================================
// PRODUCT CATEGORIES (Case Study Alignment)
// ============================================================================
// Note: Shop page displays finished cakes, cake flavors, and filling options
// for inspiration and education. Customers call to order with these options.
export const productCategories = ['All', 'Cakes', 'Flavors', 'Fillings'];

// ============================================================================
// STANDARD CAKES (14 Options from Case Study) with Pre-defined Recipes
// ============================================================================
export interface StandardCakeRecipe {
  id: string;
  name: string;
  basePrice: number;
  description?: string;
  category?: string;
  image_path?: string;
  layers: Array<{
    flavor: string;
    fillings: string[];
    icing: string;
    notes?: string;
  }>;
}

export const standardCakes: StandardCakeRecipe[] = [
  {
    id: 'birthday-celebration',
    name: 'Birthday Celebration',
    basePrice: 30,
    description: 'Classic yellow cake with white buttercream - perfect for any celebration',
    category: 'Classic',
    image_path: '/images/products/cakes/birthday-celebration.jpg',
    layers: [
      { flavor: 'yellow', fillings: ['white-buttercream'], icing: 'white-buttercream' },
      { flavor: 'yellow', fillings: ['white-buttercream'], icing: 'white-buttercream' }
    ]
  },
  {
    id: 'almond-delight',
    name: 'Almond Delight',
    basePrice: 35,
    description: 'Rich almond cake with almond buttercream filling',
    category: 'Premium',
    image_path: '/images/products/cakes/almond-delight.jpg',
    layers: [
      { flavor: 'almond', fillings: ['almond-buttercream'], icing: 'almond-buttercream' },
      { flavor: 'almond', fillings: ['almond-buttercream'], icing: 'almond-buttercream' }
    ]
  },
  {
    id: 'lemon-cream-cheese',
    name: 'Lemon & Cream Cheese',
    basePrice: 35,
    description: 'Tangy lemon cake with smooth cream cheese icing',
    category: 'Fruity',
    image_path: '/images/products/cakes/lemon-cream-cheese.jpg',
    layers: [
      { flavor: 'yellow', fillings: ['lemon-curd'], icing: 'cream-cheese' },
      { flavor: 'yellow', fillings: ['lemon-curd'], icing: 'cream-cheese' }
    ]
  },
  {
    id: 'black-forest',
    name: 'Black Forest',
    basePrice: 40,
    description: 'Chocolate cake with cherry filling and chocolate ganache',
    category: 'Premium',
    image_path: '/images/products/cakes/black-forest.jpg',
    layers: [
      { flavor: 'chocolate', fillings: ['chocolate-mousse'], icing: 'chocolate-ganache' },
      { flavor: 'chocolate', fillings: ['chocolate-mousse'], icing: 'chocolate-ganache' }
    ]
  },
  {
    id: 'german-chocolate',
    name: 'German Chocolate',
    basePrice: 38,
    description: 'Rich chocolate cake with pecan praline filling',
    category: 'Premium',
    image_path: '/images/products/cakes/german-chocolate.jpg',
    layers: [
      { flavor: 'chocolate', fillings: ['pecan-praline'], icing: 'chocolate-buttercream' },
      { flavor: 'chocolate', fillings: ['pecan-praline'], icing: 'chocolate-buttercream' }
    ]
  },
  {
    id: 'cream-cheese-chocolate',
    name: 'Cream Cheese Chocolate',
    basePrice: 38,
    description: 'Decadent chocolate cake with cream cheese frosting',
    category: 'Premium',
    image_path: '/images/products/cakes/cream-cheese-chocolate.jpg',
    layers: [
      { flavor: 'devils-food-chocolate', fillings: ['chocolate-buttercream'], icing: 'cream-cheese' },
      { flavor: 'devils-food-chocolate', fillings: ['chocolate-buttercream'], icing: 'cream-cheese' }
    ]
  },
  {
    id: 'italian-cream',
    name: 'Italian Cream',
    basePrice: 40,
    description: 'Light vanilla cake with cream cheese and pecans',
    category: 'Premium',
    image_path: '/images/products/cakes/italian-cream.jpg',
    layers: [
      { flavor: 'vanilla', fillings: ['cream-cheese', 'pecan-praline'], icing: 'cream-cheese' },
      { flavor: 'vanilla', fillings: ['cream-cheese', 'pecan-praline'], icing: 'cream-cheese' }
    ]
  },
  {
    id: 'lemon-doberge',
    name: 'Lemon Doberge',
    basePrice: 45,
    description: 'Multi-layered lemon cake with lemon mousse',
    category: 'Signature',
    image_path: '/images/products/cakes/lemon-doberge.jpg',
    layers: [
      { flavor: 'yellow', fillings: ['lemon-curd'], icing: 'white-buttercream' },
      { flavor: 'yellow', fillings: ['lemon-mousse'], icing: 'white-buttercream' }
    ]
  },
  {
    id: 'chocolate-doberge',
    name: 'Chocolate Doberge',
    basePrice: 45,
    description: 'Multi-layered chocolate cake with chocolate mousse',
    category: 'Signature',
    image_path: '/images/products/cakes/chocolate-doberge.jpg',
    layers: [
      { flavor: 'chocolate', fillings: ['chocolate-mousse'], icing: 'chocolate-buttercream' },
      { flavor: 'chocolate', fillings: ['chocolate-mousse'], icing: 'chocolate-buttercream' }
    ]
  },
  {
    id: 'half-half-doberge',
    name: '½ & ½ Doberge (Lemon + Chocolate)',
    basePrice: 48,
    description: 'Half lemon, half chocolate - best of both worlds',
    category: 'Signature',
    image_path: '/images/products/cakes/half-half-doberge.jpg',
    layers: [
      { flavor: 'yellow', fillings: ['lemon-mousse'], icing: 'white-buttercream', notes: 'Lemon half' },
      { flavor: 'chocolate', fillings: ['chocolate-mousse'], icing: 'chocolate-buttercream', notes: 'Chocolate half' }
    ]
  },
  {
    id: 'pecan-praline',
    name: 'Pecan Praline Cream Cheese',
    basePrice: 42,
    description: 'Yellow cake with pecan praline and cream cheese',
    category: 'Premium',
    image_path: '/images/products/cakes/pecan-praline.jpg',
    layers: [
      { flavor: 'yellow', fillings: ['pecan-praline'], icing: 'cream-cheese' },
      { flavor: 'yellow', fillings: ['pecan-praline'], icing: 'cream-cheese' }
    ]
  },
  {
    id: 'chocolate-banana',
    name: 'Chocolate Banana',
    basePrice: 36,
    description: 'Chocolate cake with banana cream filling',
    category: 'Classic',
    image_path: '/images/products/cakes/chocolate-banana.jpg',
    layers: [
      { flavor: 'chocolate', fillings: ['white-buttercream'], icing: 'chocolate-buttercream', notes: 'Banana flavor' },
      { flavor: 'chocolate', fillings: ['white-buttercream'], icing: 'chocolate-buttercream', notes: 'Banana flavor' }
    ]
  },
  {
    id: 'strawberry-delight',
    name: 'Strawberry Delight',
    basePrice: 36,
    description: 'Strawberry cake with strawberry mousse filling',
    category: 'Fruity',
    image_path: '/images/products/cakes/strawberry-delight.jpg',
    layers: [
      { flavor: 'strawberry', fillings: ['strawberry-mousse'], icing: 'white-buttercream' },
      { flavor: 'strawberry', fillings: ['strawberry-mousse'], icing: 'white-buttercream' }
    ]
  },
  {
    id: 'cookies-cream',
    name: 'Cookies & Cream Cake',
    basePrice: 35,
    description: 'Vanilla cake with cookies and cream filling',
    category: 'Classic',
    image_path: '/images/products/cakes/cookies-cream.jpg',
    layers: [
      { flavor: 'vanilla', fillings: ['white-buttercream'], icing: 'white-buttercream', notes: 'Crushed Oreos' },
      { flavor: 'vanilla', fillings: ['white-buttercream'], icing: 'white-buttercream', notes: 'Crushed Oreos' }
    ]
  }
];

// ============================================================================
// CAKE FLAVORS (6 Options from Case Study)
// ============================================================================
export const cakeFlavors = [
  { id: 'vanilla', name: 'Vanilla', price: 0, image_path: '/images/products/cake-flavors/vanilla.jpg' },
  { id: 'almond', name: 'Almond', price: 0, image_path: '/images/products/cake-flavors/almond.jpg' },
  { id: 'yellow', name: 'Yellow', price: 0, image_path: '/images/products/cake-flavors/yellow.jpg' },
  { id: 'devils-food-chocolate', name: "Devil's Food Chocolate", price: 0, image_path: '/images/products/cake-flavors/devils-food-chocolate.jpg' },
  { id: 'chocolate', name: 'Chocolate', price: 0, image_path: '/images/products/cake-flavors/chocolate.jpg' },
  { id: 'strawberry', name: 'Strawberry', price: 0, image_path: '/images/products/cake-flavors/strawberry.jpg' }
];

// ============================================================================
// FILLING FLAVORS (15 Options from Case Study)
// ============================================================================
export const fillingFlavors = [
  { id: 'white-buttercream', name: 'White Buttercream', price: 0, image_path: '/images/products/fillings/white-buttercream.jpg' },
  { id: 'chocolate-buttercream', name: 'Chocolate Buttercream', price: 0, image_path: '/images/products/fillings/chocolate-buttercream.jpg' },
  { id: 'almond-buttercream', name: 'Almond Buttercream', price: 0, image_path: '/images/products/fillings/almond-buttercream.jpg' },
  { id: 'cream-cheese', name: 'Cream Cheese', price: 0, image_path: '/images/products/fillings/cream-cheese.jpg' },
  { id: 'lemon-curd', name: 'Lemon Curd', price: 0, image_path: '/images/products/fillings/lemon-curd.jpg' },
  { id: 'strawberry', name: 'Strawberry', price: 0, image_path: '/images/products/fillings/strawberry.jpg' },
  { id: 'raspberry', name: 'Raspberry', price: 0, image_path: '/images/products/fillings/raspberry.jpg' },
  { id: 'rum-strawberry', name: 'Rum-Strawberry', price: 0, image_path: '/images/products/fillings/rum-strawberry.jpg' },
  { id: 'pecan-praline', name: 'Pecan Praline', price: 0, image_path: '/images/products/fillings/pecan-praline.jpg' },
  { id: 'chocolate-mousse', name: 'Chocolate Mousse', price: 0, image_path: '/images/products/fillings/chocolate-mousse.jpg' },
  { id: 'lemon-mousse', name: 'Lemon Mousse', price: 0, image_path: '/images/products/fillings/lemon-mousse.jpg' },
  { id: 'strawberry-mousse', name: 'Strawberry Mousse', price: 0, image_path: '/images/products/fillings/strawberry-mousse.jpg' },
  { id: 'raspberry-mousse', name: 'Raspberry Mousse', price: 0, image_path: '/images/products/fillings/raspberry-mousse.jpg' },
  { id: 'white-chocolate-mousse', name: 'White Chocolate Mousse', price: 0, image_path: '/images/products/fillings/white-chocolate-mousse.jpg' },
  { id: 'mango-mousse', name: 'Mango Mousse', price: 0, image_path: '/images/products/fillings/mango-mousse.jpg' }
];

// ============================================================================
// ICING FLAVORS (6 Options from Case Study)
// ============================================================================
export const icingFlavors = [
  { id: 'white-buttercream', name: 'White Buttercream', price: 0, image_path: '/images/products/icings/white-buttercream.jpg' },
  { id: 'chocolate-buttercream', name: 'Chocolate Buttercream', price: 0, image_path: '/images/products/icings/chocolate-buttercream.jpg' },
  { id: 'almond-buttercream', name: 'Almond Buttercream', price: 0, image_path: '/images/products/icings/almond-buttercream.jpg' },
  { id: 'white-chocolate-buttercream', name: 'White Chocolate Buttercream', price: 0, image_path: '/images/products/icings/white-chocolate-buttercream.jpg' },
  { id: 'cream-cheese', name: 'Cream Cheese', price: 0, image_path: '/images/products/icings/cream-cheese.jpg' },
  { id: 'chocolate-ganache', name: 'Chocolate Ganache', price: 0, image_path: '/images/products/icings/chocolate-ganache.jpg' }
];

// ============================================================================
// CAKE SIZES WITH PRICES (9 Options from Case Study - as of 10/2/2024)
// ============================================================================
export const cakeSizes = [
  { id: '6-round', name: '6" Round Double Layer', servings: '4-6', price: 2000 }, // $20 in cents
  { id: '8-round', name: '8" Round Double Layer', servings: '12-15', price: 3000 }, // $30
  { id: '10-round', name: '10" Round Double Layer', servings: '25-30', price: 6000 }, // $60
  { id: '12-round', name: '12" Round Double Layer', servings: '35', price: 10000 }, // $100
  { id: '14-round', name: '14" Round Double Layer', servings: '40', price: 14000 }, // $140
  { id: '16-round', name: '16" Round Double Layer', servings: '85', price: 18000 }, // $180
  { id: 'quarter-sheet', name: '¼ Sheet Double Layer', servings: '15-20', price: 4000 }, // $40
  { id: 'half-sheet', name: '½ Sheet Double Layer', servings: '30-50', price: 10000 }, // $100
  { id: 'full-sheet', name: 'Full Sheet Double Layer', servings: '90-100', price: 20000 } // $200
];

// ============================================================================
// ICING & WRITING COLORS (37 Colors with HEX from Case Study Image)
// ============================================================================
export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  category: 'primary' | 'pastel' | 'neon' | 'fall' | 'extra';
  image_path?: string;
}

export const icingColors: ColorOption[] = [
  // PRIMARY COLORS (6 colors)
  { id: 'red', name: 'Red', hex: '#FF0000', category: 'primary' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#0033A0', category: 'primary' },
  { id: 'green', name: 'Green', hex: '#008000', category: 'primary' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00', category: 'primary' },
  { id: 'orange', name: 'Orange', hex: '#FF7F00', category: 'primary' },
  { id: 'pink', name: 'Pink', hex: '#FFC0CB', category: 'primary' },
  
  // PASTEL COLORS (6 colors)
  { id: 'baby-pink', name: 'Baby Pink', hex: '#F4C2C2', category: 'pastel' },
  { id: 'baby-blue', name: 'Baby Blue', hex: '#A7D3F3', category: 'pastel' },
  { id: 'pastel-green', name: 'Pastel Green', hex: '#B5E5B5', category: 'pastel' },
  { id: 'pastel-yellow', name: 'Pastel Yellow', hex: '#FFF9A6', category: 'pastel' },
  { id: 'lavender', name: 'Lavender', hex: '#C8A2C8', category: 'pastel' },
  { id: 'peach', name: 'Peach', hex: '#FFDAB9', category: 'pastel' },
  
  // NEON COLORS (7 colors)
  { id: 'hot-pink', name: 'Hot Pink', hex: '#FF69B4', category: 'neon' },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#0096FF', category: 'neon' },
  { id: 'neon-green', name: 'Neon Green', hex: '#39FF14', category: 'neon' },
  { id: 'neon-yellow', name: 'Neon Yellow', hex: '#E6FF00', category: 'neon' },
  { id: 'neon-orange', name: 'Neon Orange', hex: '#FF5F1F', category: 'neon' },
  { id: 'purple', name: 'Purple', hex: '#6A0DAD', category: 'neon' },
  { id: 'lime', name: 'Lime', hex: '#BFFF00', category: 'neon' },
  
  // FALL COLORS (5 colors)
  { id: 'fall-red', name: 'Fall Red', hex: '#8B0000', category: 'fall' },
  { id: 'fall-green', name: 'Fall Green', hex: '#4F7942', category: 'fall' },
  { id: 'fall-yellow', name: 'Fall Yellow', hex: '#F2AF34', category: 'fall' },
  { id: 'fall-orange', name: 'Fall Orange', hex: '#D35400', category: 'fall' },
  { id: 'brown', name: 'Brown', hex: '#7B3F00', category: 'fall' },
  
  // EXTRA COLORS (13 colors)
  { id: 'ivory', name: 'Ivory', hex: '#FFF8E7', category: 'extra' },
  { id: 'golden-yellow', name: 'Golden Yellow', hex: '#FFDF00', category: 'extra' },
  { id: 'gold', name: 'Gold', hex: '#FFD700', category: 'extra' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#FF00FF', category: 'extra' },
  { id: 'maroon', name: 'Maroon', hex: '#800000', category: 'extra' },
  { id: 'burgundy', name: 'Burgundy', hex: '#800020', category: 'extra' },
  { id: 'burnt-orange', name: 'Burnt Orange', hex: '#CC5500', category: 'extra' },
  { id: 'turquoise', name: 'Turquoise', hex: '#40E0D0', category: 'extra' },
  { id: 'teal', name: 'Teal', hex: '#008080', category: 'extra' },
  { id: 'navy-blue', name: 'Navy Blue', hex: '#000080', category: 'extra' },
  { id: 'gray-silver', name: 'Gray / Silver', hex: '#C0C0C0', category: 'extra' },
  { id: 'black', name: 'Black', hex: '#000000', category: 'extra' },
  { id: 'white', name: 'White', hex: '#FFFFFF', category: 'extra' }
];

// ============================================================================
// DECORATIONS (from Case Study)
// ============================================================================
export const decorations = [
  { id: 'buttercream-flowers', name: 'Buttercream Flowers', price: 0 },
  { id: 'fondant-decorations', name: 'Fondant Decorations', price: 0 },
  { id: 'silk-flowers-iris', name: 'Silk Flowers (Iris)', price: 0 },
  { id: 'silk-flowers-rose', name: 'Silk Flowers (Rose)', price: 0 },
  { id: 'silk-flowers-daisy', name: 'Silk Flowers (Daisy)', price: 0 },
  { id: 'silk-flowers-lily', name: 'Silk Flowers (Lily)', price: 0 },
  { id: 'silk-butterflies', name: 'Silk Butterflies', price: 0 },
  { id: 'edible-photo', name: 'Edible Sugar-Based Photos', price: 0 },
  { id: 'toys-trains', name: 'Toys (Trains)', price: 0 },
  { id: 'toys-dinosaurs', name: 'Toys (Dinosaurs)', price: 0 },
  { id: 'toys-race-cars', name: 'Toys (Race Cars)', price: 0 },
  { id: 'plastic-sports', name: 'Plastic Decorations (Sports Equipment)', price: 0 },
  { id: 'plastic-graduation', name: 'Plastic Decorations (Graduation Caps)', price: 0 },
  { id: 'plastic-baby', name: 'Plastic Decorations (Baby Items)', price: 0 },
  { id: 'paper-parasols', name: 'Paper Parasols', price: 0 },
  { id: 'plastic-flamingos', name: 'Plastic Pics (Flamingos)', price: 0 },
  { id: 'plastic-mermaids', name: 'Plastic Pics (Mermaids)', price: 0 },
  { id: 'plastic-seashells', name: 'Plastic Pics (Seashells)', price: 0 },
  { id: 'flags', name: 'Flags', price: 0 },
  { id: 'ribbons', name: 'Ribbons (Multiple Colors)', price: 0 },
  { id: 'plastic-trees', name: 'Plastic Trees', price: 0 },
  { id: 'plastic-animals', name: 'Plastic Animals', price: 0 },
  { id: 'plastic-camping', name: 'Plastic Camping Sets', price: 0 },
  { id: 'rock-candy', name: 'Rock Candy', price: 0 },
  { id: 'plastic-star-explosion', name: 'Plastic Star Explosion Insert', price: 0 }
];

// ============================================================================
// LEGACY DATA (for backward compatibility)
// ============================================================================
export const flavors = cakeFlavors;
export const fillings = fillingFlavors;

// ============================================================================
// PRICING CONSTANTS
// ============================================================================
export const pricingConstants = {
  basePrice: 50, // Base price for custom cakes (in dollars)
  perLayerPrice: 15, // Additional cost per layer
  perFillingPrice: 1, // Cost per filling
  maxFillingsPerLayer: 2, // Maximum fillings per layer (per case study)
  layerWarningThreshold: 20, // Warning when exceeding recommended layers
  minimumLayers: 2, // Minimum layers required (per case study)
  minimumDepositPercentage: 50, // Minimum deposit required (50% per case study)
  rushOrderThresholdDays: 2 // Orders due in < 2 days are rush orders
};

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================
export interface LayerData {
  id: string;
  flavor: string;
  fillings: string[];
  icing: string; // Icing flavor for this layer
  notes: string;
}

// ============================================================================
// PRICING UTILITIES
// ============================================================================

/**
 * Calculate total price for custom cake based on layers
 * Note: Prices for decorated cakes are negotiated at order time (case study rule)
 */
export function calculateTotalPrice(layers: LayerData[]): number {
  let total = pricingConstants.basePrice;
  
  layers.forEach(layer => {
    const flavorObj = cakeFlavors.find(f => f.id === layer.flavor);
    total += pricingConstants.perLayerPrice;
    total += flavorObj?.price || 0;
    total += layer.fillings.length * pricingConstants.perFillingPrice;
  });
  
  return total;
}

/**
 * Calculate total price based on selected cake size
 * Returns price in cents for consistency with API
 */
export function calculateSizeBasedPrice(sizeId: string): number {
  const size = cakeSizes.find(s => s.id === sizeId);
  return size ? size.price : 0; // Returns cents (e.g., 2000 for $20)
}

/**
 * Check if order is a rush order (< 2 days)
 */
export function isRushOrder(pickupDate: Date): boolean {
  const today = new Date();
  const pickup = new Date(pickupDate);
  const diffTime = pickup.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < pricingConstants.rushOrderThresholdDays;
}

/**
 * Get color category for organization
 */
export function getColorsByCategory(category: ColorOption['category']): ColorOption[] {
  return icingColors.filter(c => c.category === category);
}
