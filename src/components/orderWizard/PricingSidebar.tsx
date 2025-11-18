import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useOrderWizard } from '../../stores/orderWizardStore';

export const PricingSidebar: React.FC = () => {
  const { data } = useOrderWizard();
  const { pricing, customization } = data;

  if (!pricing) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            Order Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Complete customization to see pricing
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Size</p>
            <p className="font-semibold text-sm">{customization.size?.replace('-', ' ') || 'N/A'}</p>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Tiers</p>
            <p className="font-semibold text-sm">{customization.tiers || 1}</p>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base Price</span>
            <span>${pricing.basePrice.toFixed(2)}</span>
          </div>

          {pricing.sizeUpcharge > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size Upcharge</span>
              <span className="text-green-600">+${pricing.sizeUpcharge.toFixed(2)}</span>
            </div>
          )}

          {pricing.tierUpcharge > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tier Upcharge</span>
              <span className="text-green-600">+${pricing.tierUpcharge.toFixed(2)}</span>
            </div>
          )}

          {pricing.decorationCost > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Decorations</span>
              <span className="text-green-600">+${pricing.decorationCost.toFixed(2)}</span>
            </div>
          )}

          {pricing.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-red-600">-${pricing.discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${pricing.total.toFixed(2)}</span>
        </div>

        {/* Deposit Info */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="text-xs text-green-600 font-medium">Deposit (50%)</p>
              <p className="text-xs text-green-600 mt-0.5">Due today</p>
            </div>
            <p className="text-lg font-bold text-green-700">
              ${pricing.depositAmount.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="text-xs text-blue-600 font-medium">Balance Due</p>
              <p className="text-xs text-blue-600 mt-0.5">At pickup</p>
            </div>
            <p className="text-lg font-bold text-blue-700">
              ${pricing.balanceDue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Features Included */}
        {(customization.decorations && customization.decorations.length > 0) && (
          <div className="pt-2">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Included Features
            </p>
            <div className="flex flex-wrap gap-1">
              {customization.decorations.slice(0, 3).map((decoration) => (
                <Badge key={decoration} variant="secondary" className="text-xs">
                  {decoration}
                </Badge>
              ))}
              {customization.decorations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{customization.decorations.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
