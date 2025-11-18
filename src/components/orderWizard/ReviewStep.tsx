import React from 'react';
import {
  CheckCircle2,
  User,
  Cake,
  Palette,
  DollarSign,
  Calendar,
  Edit,
  AlertCircle,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { useOrderWizard } from '../../stores/orderWizardStore';

interface ReviewStepProps {
  className?: string;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ className }) => {
  const { data, goToStep } = useOrderWizard();
  const { customization, pricing, schedule } = data;

  // Mock customer and product data (in real app, fetch from state/database)
  const customerName = 'Sarah Johnson'; // Would come from selected customer
  const productName = 'Classic Vanilla Birthday Cake'; // Would come from selected product

  const EditButton = ({ step, label }: { step: number; label: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => goToStep(step)}
      className="gap-2"
    >
      <Edit className="h-3 w-3" />
      {label}
    </Button>
  );

  return (
    <div className={className}>
      {/* Success Header */}
      <Card className="border-green-500/50 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Order Ready for Confirmation
              </h3>
              <p className="text-sm text-green-700">
                Please review all details before submitting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Customer Information</CardTitle>
            </div>
            <EditButton step={1} label="Edit Customer" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID:</span>
              <span className="font-mono text-sm">{data.customerId || 'NEW'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Selected Product</CardTitle>
            </div>
            <EditButton step={2} label="Change Product" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cake className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">{productName}</p>
              <p className="text-sm text-muted-foreground">Base Price: ${pricing?.basePrice.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Customization Details</CardTitle>
            </div>
            <EditButton step={3} label="Edit Customization" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Size:</span>
              <Badge variant="secondary">{customization.size || 'Not specified'}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tiers:</span>
              <Badge variant="secondary">{customization.tiers || 1}</Badge>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cake Flavor:</span>
              <span className="font-medium">{customization.flavor || 'Not specified'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Icing Flavor:</span>
              <span className="font-medium">{customization.icingFlavor || 'Not specified'}</span>
            </div>
            
            {customization.fillings && customization.fillings.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Fillings:</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                  {customization.fillings.map((filling) => (
                    <Badge key={filling} variant="outline" className="text-xs">
                      {filling}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Separator />
            
            {customization.colors && customization.colors.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Colors:</span>
                <div className="flex gap-2">
                  {customization.colors.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {customization.decorations && customization.decorations.length > 0 && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Decorations:</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                  {customization.decorations.map((decoration) => (
                    <Badge key={decoration} variant="outline" className="text-xs">
                      {decoration}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {customization.specialInstructions && (
              <>
                <Separator />
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Special Instructions:</span>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {customization.specialInstructions}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle>Pricing Summary</CardTitle>
            </div>
            <EditButton step={4} label="Review Pricing" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Price:</span>
              <span>${pricing?.basePrice.toFixed(2)}</span>
            </div>
            
            {pricing && pricing.sizeUpcharge > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size Upcharge:</span>
                <span>+${pricing.sizeUpcharge.toFixed(2)}</span>
              </div>
            )}
            
            {pricing && pricing.tierUpcharge > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tier Upcharge:</span>
                <span>+${pricing.tierUpcharge.toFixed(2)}</span>
              </div>
            )}
            
            {pricing && pricing.decorationCost > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Decorations:</span>
                <span>+${pricing.decorationCost.toFixed(2)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-primary">${pricing?.total.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-600 mb-1">Deposit (50%)</p>
                <p className="text-lg font-bold text-green-700">
                  ${pricing?.depositAmount.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Due at Pickup</p>
                <p className="text-lg font-bold text-blue-700">
                  ${pricing?.balanceDue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Pickup Schedule</CardTitle>
            </div>
            <EditButton step={5} label="Change Schedule" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pickup Date:</span>
              <span className="font-medium">
                {schedule?.pickupDate ? format(new Date(schedule.pickupDate), 'EEEE, MMMM d, yyyy') : 'Not set'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pickup Time:</span>
              <span className="font-medium">{schedule?.pickupTime || 'Not set'}</span>
            </div>
            
            {schedule?.isRush && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Rush Order:</strong> This is a rush order. Additional fees may apply and 75% deposit is required.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Final Confirmation Notice */}
      <Card className="border-primary/50">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Before You Submit
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>All details have been reviewed and are correct</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>A ${pricing?.depositAmount.toFixed(2)} deposit will be charged immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>You will receive an order confirmation email</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Balance of ${pricing?.balanceDue.toFixed(2)} is due at pickup</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Deposit is non-refundable after 48 hours</span>
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900">
              <strong>Cancellation Policy:</strong> Orders can be cancelled with a full refund within 48 hours of placement. 
              After 48 hours, the deposit is non-refundable. Please contact us at (713) 555-CAKE if you need to make changes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
