import React, { useEffect, useMemo } from 'react';
import { DollarSign, Calculator, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { useOrderWizard, PriceCalculation } from '../../stores/orderWizardStore';

interface PricingStepProps {
  className?: string;
}

const SIZE_UPCHARGES: Record<string, number> = {
  '6-inch': 0,
  '8-inch': 10,
  '10-inch': 20,
  '12-inch': 35,
  '14-inch': 50,
  '16-inch': 70,
  'quarter-sheet': 40,
  'half-sheet': 75,
  'full-sheet': 150,
};

const TIER_UPCHARGES: Record<number, number> = {
  1: 0,
  2: 25,
  3: 50,
  4: 85,
};

const DECORATION_COST_PER_ITEM = 15;

export const PricingStep: React.FC<PricingStepProps> = ({ className }) => {
  const { data, setWizardData } = useOrderWizard();
  const { customization, productId } = data;

  // Mock product base price (in real app, fetch from products table)
  const baseProductPrice = 45; // Base price for selected product

  const calculatedPricing = useMemo((): PriceCalculation => {
    const sizeUpcharge = SIZE_UPCHARGES[customization.size || '6-inch'] || 0;
    const tierUpcharge = TIER_UPCHARGES[customization.tiers || 1] || 0;
    const decorationCost = (customization.decorations?.length || 0) * DECORATION_COST_PER_ITEM;

    const subtotal = baseProductPrice + sizeUpcharge + tierUpcharge + decorationCost;
    
    // Apply any discounts (e.g., preferred customer discount)
    const discount = 0; // Could be calculated based on customer type
    
    const total = subtotal - discount;
    
    // 50% deposit required per business rules
    const depositAmount = Math.ceil(total * 0.5);
    const balanceDue = total - depositAmount;

    return {
      basePrice: baseProductPrice,
      sizeUpcharge,
      tierUpcharge,
      decorationCost,
      discount,
      subtotal,
      depositAmount,
      balanceDue,
      total,
    };
  }, [customization, baseProductPrice]);

  // Update wizard data when pricing changes
  useEffect(() => {
    setWizardData({ pricing: calculatedPricing });
  }, [calculatedPricing, setWizardData]);

  const PriceRow = ({ label, amount, isHighlight = false, isBold = false }: {
    label: string;
    amount: number;
    isHighlight?: boolean;
    isBold?: boolean;
  }) => (
    <div className={`flex justify-between items-center py-2 ${isBold ? 'font-semibold text-lg' : ''} ${isHighlight ? 'bg-primary/5 px-3 -mx-3 rounded' : ''}`}>
      <span className={isHighlight ? 'text-primary' : ''}>{label}</span>
      <span className={isHighlight ? 'text-primary' : ''}>${amount.toFixed(2)}</span>
    </div>
  );

  return (
    <div className={className}>
      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Price Breakdown
          </CardTitle>
          <CardDescription>
            Detailed cost calculation for your custom cake
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <PriceRow label="Base Cake Price" amount={calculatedPricing.basePrice} />
            
            {calculatedPricing.sizeUpcharge > 0 && (
              <PriceRow label={`Size Upcharge (${customization.size})`} amount={calculatedPricing.sizeUpcharge} />
            )}
            
            {calculatedPricing.tierUpcharge > 0 && (
              <PriceRow label={`Tier Upcharge (${customization.tiers} tier${customization.tiers! > 1 ? 's' : ''})`} amount={calculatedPricing.tierUpcharge} />
            )}
            
            {calculatedPricing.decorationCost > 0 && (
              <PriceRow 
                label={`Decorations (${customization.decorations?.length} items)`} 
                amount={calculatedPricing.decorationCost} 
              />
            )}

            <div className="border-t my-2" />
            
            <PriceRow label="Subtotal" amount={calculatedPricing.subtotal} isBold />
            
            {calculatedPricing.discount > 0 && (
              <PriceRow label="Discount" amount={-calculatedPricing.discount} />
            )}
            
            <div className="border-t-2 border-primary/20 my-2" />
            
            <PriceRow 
              label="Total Amount" 
              amount={calculatedPricing.total} 
              isHighlight 
              isBold 
            />
          </div>

          {/* Summary Cards */}
          <div className="grid gap-3 mt-6">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Deposit Required (50%)</p>
                  <p className="text-xs text-green-600">Due at order placement</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-700">
                ${calculatedPricing.depositAmount.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Balance Due</p>
                  <p className="text-xs text-blue-600">Due at pickup</p>
                </div>
              </div>
              <p className="text-lg font-bold text-blue-700">
                ${calculatedPricing.balanceDue.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Information
          </CardTitle>
          <CardDescription>
            Deposit payment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>50% deposit required</strong> to confirm your order. The remaining balance is due at pickup.
              We accept cash, credit cards, and Venmo.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 pt-2">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method for Deposit</Label>
                <select 
                  id="payment-method"
                  className="w-full p-2 border rounded-md"
                  defaultValue="card"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="venmo">Venmo</option>
                  <option value="zelle">Zelle</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-notes">Payment Notes (Optional)</Label>
                <Input
                  id="payment-notes"
                  placeholder="E.g., 'Will pay deposit in cash when picking up order form'"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-amber-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Important Payment Terms
              </h4>
              <ul className="text-sm text-amber-800 space-y-1 ml-6 list-disc">
                <li>Deposit is non-refundable after 48 hours</li>
                <li>Full balance must be paid before pickup</li>
                <li>Orders not picked up within 24 hours may be resold</li>
                <li>Rush orders (less than 2 days notice) require 75% deposit</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border-primary/50">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">Order Cost Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cake Size:</span>
              <Badge variant="secondary">{customization.size || 'Not selected'}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tiers:</span>
              <Badge variant="secondary">{customization.tiers || 1}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Decorations:</span>
              <Badge variant="secondary">{customization.decorations?.length || 0} items</Badge>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${calculatedPricing.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                <span>Deposit Now:</span>
                <span>${calculatedPricing.depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Due at Pickup:</span>
                <span>${calculatedPricing.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
