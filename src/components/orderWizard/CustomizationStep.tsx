import React, { useEffect, useState } from 'react';
import { Cake, Palette, Sparkles, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useOrderWizard, CustomizationData } from '../../stores/orderWizardStore';

interface CustomizationStepProps {
  className?: string;
}

const SIZES = [
  { value: '6-inch', label: '6" Round', upcharge: 0, serves: '8-10' },
  { value: '8-inch', label: '8" Round', upcharge: 10, serves: '12-15' },
  { value: '10-inch', label: '10" Round', upcharge: 20, serves: '20-25' },
  { value: '12-inch', label: '12" Round', upcharge: 35, serves: '30-35' },
  { value: 'quarter-sheet', label: 'Quarter Sheet', upcharge: 40, serves: '25-30' },
  { value: 'half-sheet', label: 'Half Sheet', upcharge: 75, serves: '50-60' },
  { value: 'full-sheet', label: 'Full Sheet', upcharge: 150, serves: '100-120' },
] as const;

const CAKE_FLAVORS = [
  'Vanilla Bean',
  'Chocolate Fudge',
  'Red Velvet',
  'Lemon Zest',
  'Marble',
  'Strawberry',
  'Carrot Cake',
  'Funfetti',
];

const ICING_FLAVORS = [
  'Vanilla Buttercream',
  'Chocolate Ganache',
  'Cream Cheese Frosting',
  'Swiss Meringue',
  'Whipped Cream',
  'Fondant',
];

const FILLINGS = [
  'Raspberry Preserves',
  'Lemon Curd',
  'Chocolate Mousse',
  'Strawberry Cream',
  'Salted Caramel',
  'Vanilla Custard',
  'Fresh Berries',
];

const DECORATIONS = [
  'Fresh Flowers',
  'Edible Gold Leaf',
  'Fondant Figures',
  'Chocolate Drip',
  'Fresh Fruit',
  'Macarons',
  'Sprinkles',
  'Piped Borders',
];

const COLORS = [
  '#FFB6C1', // Pink
  '#87CEEB', // Sky Blue
  '#FFD700', // Gold
  '#98FB98', // Mint Green
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#FFA07A', // Salmon
  '#E6E6FA', // Lavender
];

export const CustomizationStep: React.FC<CustomizationStepProps> = ({ className }) => {
  const { data, setWizardData } = useOrderWizard();
  const customization = data.customization as Partial<CustomizationData>;

  const [selectedColors, setSelectedColors] = useState<string[]>(customization.colors || []);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>(customization.decorations || []);
  const [selectedFillings, setSelectedFillings] = useState<string[]>(customization.fillings || []);

  // Update wizard data when selections change
  useEffect(() => {
    setWizardData({
      customization: {
        ...customization,
        colors: selectedColors,
        decorations: selectedDecorations,
        fillings: selectedFillings,
      }
    });
  }, [selectedColors, selectedDecorations, selectedFillings]);

  const toggleSelection = (
    item: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    max: number = 999
  ) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else if (current.length < max) {
      setter([...current, item]);
    }
  };

  const selectedSize = SIZES.find(s => s.value === customization.size);

  return (
    <div className={className}>
      {/* Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-primary" />
            Cake Size & Tiers
          </CardTitle>
          <CardDescription>
            Select the size and number of tiers for your cake
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="size">Cake Size *</Label>
              <Select
                value={customization.size}
                onValueChange={(value) => setWizardData({
                  customization: { ...customization, size: value as any }
                })}
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size..." />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{size.label}</span>
                        <div className="flex gap-2 ml-4">
                          <Badge variant="secondary" className="text-xs">
                            {size.serves} servings
                          </Badge>
                          {size.upcharge > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +${size.upcharge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSize && (
                <p className="text-sm text-muted-foreground">
                  Serves {selectedSize.serves}
                  {selectedSize.upcharge > 0 && ` • +$${selectedSize.upcharge} upcharge`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiers">Number of Tiers</Label>
              <Select
                value={customization.tiers?.toString()}
                onValueChange={(value) => setWizardData({
                  customization: { ...customization, tiers: parseInt(value) }
                })}
              >
                <SelectTrigger id="tiers">
                  <SelectValue placeholder="Select tiers..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Single Tier</SelectItem>
                  <SelectItem value="2">Two Tiers (+$25)</SelectItem>
                  <SelectItem value="3">Three Tiers (+$50)</SelectItem>
                  <SelectItem value="4">Four Tiers (+$85)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flavors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Flavors
          </CardTitle>
          <CardDescription>
            Choose your cake and icing flavors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="flavor">Cake Flavor *</Label>
              <Select
                value={customization.flavor}
                onValueChange={(value) => setWizardData({
                  customization: { ...customization, flavor: value }
                })}
              >
                <SelectTrigger id="flavor">
                  <SelectValue placeholder="Select flavor..." />
                </SelectTrigger>
                <SelectContent>
                  {CAKE_FLAVORS.map((flavor) => (
                    <SelectItem key={flavor} value={flavor}>
                      {flavor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icing">Icing Flavor *</Label>
              <Select
                value={customization.icingFlavor}
                onValueChange={(value) => setWizardData({
                  customization: { ...customization, icingFlavor: value }
                })}
              >
                <SelectTrigger id="icing">
                  <SelectValue placeholder="Select icing..." />
                </SelectTrigger>
                <SelectContent>
                  {ICING_FLAVORS.map((icing) => (
                    <SelectItem key={icing} value={icing}>
                      {icing}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fillings (Optional - up to 2)</Label>
            <div className="flex flex-wrap gap-2">
              {FILLINGS.map((filling) => (
                <Badge
                  key={filling}
                  variant={selectedFillings.includes(filling) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSelection(filling, selectedFillings, setSelectedFillings, 2)}
                >
                  {filling}
                  {selectedFillings.includes(filling) && ' ✓'}
                </Badge>
              ))}
            </div>
            {selectedFillings.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFillings.join(', ')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Colors & Decorations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Colors & Decorations
          </CardTitle>
          <CardDescription>
            Customize the appearance of your cake
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Color Scheme (up to 3)</Label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleSelection(color, selectedColors, setSelectedColors, 3)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    selectedColors.includes(color)
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedColors.length} color{selectedColors.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Decorations (Optional - select as many as you like)</Label>
            <div className="flex flex-wrap gap-2">
              {DECORATIONS.map((decoration) => (
                <Badge
                  key={decoration}
                  variant={selectedDecorations.includes(decoration) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSelection(decoration, selectedDecorations, setSelectedDecorations)}
                >
                  {decoration}
                  {selectedDecorations.includes(decoration) && ' ✓'}
                </Badge>
              ))}
            </div>
            {selectedDecorations.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Each decoration adds $10-$30 to the total
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Special Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Special Instructions
          </CardTitle>
          <CardDescription>
            Any additional notes or special requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Example: 'Happy Birthday Sarah' in blue icing, add candles..."
            value={customization.specialInstructions || ''}
            onChange={(e) => setWizardData({
              customization: { ...customization, specialInstructions: e.target.value }
            })}
            rows={4}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Our decorators will review your request and may contact you if adjustments are needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
