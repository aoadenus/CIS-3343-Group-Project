import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Star,
  Crown,
  Sparkles,
  Cake,
  Cookie,
  Palette
} from 'lucide-react';
import { cn } from '../ui/utils';

import { useOrderWizard } from '../../stores/orderWizardStore';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: 'classic' | 'premium' | 'specialty' | 'seasonal';
  is_active: boolean;
  is_popular?: boolean;
  image_url?: string;
  features?: string[];
}

// Mock product data - replace with API call
const mockProducts: Product[] = [
  // Classic Cakes
  {
    id: 'classic-birthday',
    name: 'Birthday Celebration',
    description: 'Classic vanilla or chocolate cake with buttercream frosting, perfect for birthdays.',
    base_price: 35,
    category: 'classic',
    is_active: true,
    is_popular: true,
    features: ['Custom message', 'Standard decorations']
  },
  {
    id: 'classic-chocolate',
    name: 'German Chocolate',
    description: 'Rich chocolate cake with coconut-pecan frosting and chocolate ganache.',
    base_price: 40,
    category: 'classic',
    is_active: true,
    features: ['Premium chocolate', 'Nut toppings']
  },
  {
    id: 'classic-strawberry',
    name: 'Strawberry Delight',
    description: 'Light vanilla cake layered with fresh strawberries and cream cheese frosting.',
    base_price: 38,
    category: 'classic',
    is_active: true,
    features: ['Fresh fruit', 'Cream cheese icing']
  },

  // Premium Cakes
  {
    id: 'premium-lemon',
    name: 'Lemon & Cream Cheese',
    description: 'Tangy lemon cake with cream cheese filling and vanilla buttercream.',
    base_price: 45,
    category: 'premium',
    is_active: true,
    is_popular: true,
    features: ['Sour cream addition', 'Zesty lemon curd']
  },
  {
    id: 'premium-black-forest',
    name: 'Black Forest',
    description: 'Chocolate cake with cherry filling, whipped cream, and chocolate shavings.',
    base_price: 50,
    category: 'premium',
    is_active: true,
    features: ['Cherry liqueur', 'Whipped cream']
  },
  {
    id: 'premium-italian-cream',
    name: 'Italian Cream',
    description: 'Buttery yellow cake with almond and vanilla custard filling.',
    base_price: 48,
    category: 'premium',
    is_active: true,
    features: ['Almond extract', 'Custard filling']
  },

  // Specialty Cakes
  {
    id: 'specialty-almond',
    name: 'Almond Delight',
    description: 'Italian almond cake with marzipan decorations and almond buttercream.',
    base_price: 55,
    category: 'specialty',
    is_active: true,
    features: ['Marzipan accents', 'Almond paste']
  },
  {
    id: 'specialty-mocha',
    name: 'Mocha Madness',
    description: 'Coffee-infused chocolate cake with espresso buttercream.',
    base_price: 52,
    category: 'specialty',
    is_active: true,
    features: ['Espresso beans', 'Coffee extract']
  },

  // Seasonal Cakes
  {
    id: 'seasonal-pumpkin',
    name: 'Pumpkin Spice',
    description: 'Seasonal pumpkin cake with cinnamon cream cheese frosting.',
    base_price: 42,
    category: 'seasonal',
    is_active: true,
    features: ['Autumn spices', 'Cinnamon frosting']
  },
  {
    id: 'seasonal-eggnog',
    name: 'Christmas Eggnog',
    description: 'Holiday eggnog cake with nutmeg buttercream and cranberry filling.',
    base_price: 46,
    category: 'seasonal',
    is_active: true,
    features: ['Holiday spices', 'Cranberry compote']
  },
];

interface ProductSelectionStepProps {
  className?: string;
}

const categoryConfig = {
  all: { label: 'All Cakes', icon: Cake, color: 'text-gray-600' },
  classic: { label: 'Classic', icon: Cookie, color: 'text-blue-600' },
  premium: { label: 'Premium', icon: Crown, color: 'text-amber-600' },
  specialty: { label: 'Specialty', icon: Sparkles, color: 'text-purple-600' },
  seasonal: { label: 'Seasonal', icon: Palette, color: 'text-green-600' },
};

export const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  className
}) => {
  const { data, setWizardData } = useOrderWizard();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'classic' | 'premium' | 'specialty' | 'seasonal'>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return mockProducts.filter(p => p.is_active);
    return mockProducts.filter(p => p.category === selectedCategory && p.is_active);
  }, [selectedCategory]);

  const handleSelectProduct = (product: Product) => {
    setWizardData({
      productId: product.id,
      // Reset customization data when changing products
      customization: {
        tiers: 1,
        colors: [],
        decorations: [],
        fillings: []
      }
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Icon className={cn("h-4 w-4", config.color)} />
                <span className="text-xs">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Products Grid */}
      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => handleSelectProduct(product)}
              isSelected={data.productId === product.id}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Cake className="mx-auto h-12 w-12 opacity-50 mb-4" />
            <p className="text-lg font-medium">No products available</p>
            <p className="text-sm">Please check back later or select a different category.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  onSelect: () => void;
  isSelected: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, isSelected }) => (
  <Card
    className={cn(
      "cursor-pointer overflow-hidden transition-all hover:shadow-lg group",
      isSelected && "ring-2 ring-primary border-primary"
    )}
    onClick={onSelect}
  >
    {/* Product Image Placeholder */}
    <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
      <Cake className="h-12 w-12 text-pink-400 opacity-60" />
      {product.is_popular && (
        <Badge className="absolute top-2 right-2 bg-amber-400 hover:bg-amber-400 text-black">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Popular
        </Badge>
      )}
    </div>

    <CardContent className="p-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          <Badge variant="outline" className="ml-2 capitalize text-xs">
            {product.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            Starting at ${product.base_price.toFixed(2)}
          </p>
          {isSelected && (
            <Badge className="bg-primary text-primary-foreground">
              Selected
            </Badge>
          )}
        </div>

        {product.features && product.features.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{product.features.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
