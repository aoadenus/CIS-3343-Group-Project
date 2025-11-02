import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Edit, Check, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../components/ui/alert-dialog';

const existingOrders = [
  { id: '#258', customer: 'Sarah Johnson', cake: 'Birthday Celebration', pickup: 'Nov 5, 2025', status: 'New Order', statusColor: '#C44569' },
  { id: '#257', customer: 'Michael Chen', cake: 'German Chocolate', pickup: 'Nov 4, 2025', status: 'In Progress', statusColor: '#2B2B2B' },
  { id: '#256', customer: 'Emily Rodriguez', cake: 'Strawberry Delight', pickup: 'Nov 6, 2025', status: 'Ready', statusColor: '#5A3825' },
  { id: '#255', customer: 'David Kim', cake: 'Lemon Doberge', pickup: 'Nov 4, 2025', status: 'Decorating', statusColor: '#C44569' },
  { id: '#254', customer: 'Lisa Martinez', cake: 'Almond Delight', pickup: 'Nov 3, 2025', status: 'Ready', statusColor: '#5A3825' },
  { id: '#253', customer: 'James Wilson', cake: 'Black Forest', pickup: 'Nov 7, 2025', status: 'New Order', statusColor: '#C44569' },
  { id: '#252', customer: 'Maria Garcia', cake: 'Italian Cream', pickup: 'Nov 5, 2025', status: 'In Progress', statusColor: '#2B2B2B' },
  { id: '#251', customer: 'Robert Brown', cake: 'Chocolate Doberge', pickup: 'Nov 6, 2025', status: 'Decorating', statusColor: '#C44569' },
];

export function Orders() {
  const { showToast } = useToast();
  const [size, setSize] = useState('8-inch');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState(existingOrders);

  const handleSaveOrder = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('success', 'Order created successfully! Order #259 has been added to the system.');
    
    setIsSubmitting(false);
  };

  const handleCompleteOrder = (orderId: string) => {
    showToast('success', `Order ${orderId} marked as complete and ready for pickup!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    showToast('success', `Order ${orderId} has been removed from the system.`);
    setDeleteOrderId(null);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 600, color: '#C44569' }}>Create New Order</h1>
      </div>

      {/* Order Form */}
      <Card className="p-6 lg:p-8 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <Label className="text-[#383A3F] mb-2 block">Customer Selection</Label>
              <Select>
                <SelectTrigger className="rounded-lg" style={{ borderRadius: '8px' }}>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                  <SelectItem value="emily">Emily Rodriguez</SelectItem>
                  <SelectItem value="david">David Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#383A3F] mb-2 block">Cake Type</Label>
              <Select>
                <SelectTrigger className="rounded-lg" style={{ borderRadius: '8px' }}>
                  <SelectValue placeholder="Select cake type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday Celebration</SelectItem>
                  <SelectItem value="lemon">Lemon & Cream Cheese</SelectItem>
                  <SelectItem value="black-forest">Black Forest</SelectItem>
                  <SelectItem value="german">German Chocolate</SelectItem>
                  <SelectItem value="almond">Almond Delight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#383A3F] mb-3 block">Size Selection</Label>
              <RadioGroup value={size} onValueChange={setSize} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6-inch" id="6-inch" />
                  <Label htmlFor="6-inch" className="cursor-pointer">6 inch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8-inch" id="8-inch" />
                  <Label htmlFor="8-inch" className="cursor-pointer">8 inch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-inch" id="10-inch" />
                  <Label htmlFor="10-inch" className="cursor-pointer">10 inch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-[#383A3F] mb-2 block">Cake Flavor</Label>
              <Select>
                <SelectTrigger className="rounded-lg" style={{ borderRadius: '8px' }}>
                  <SelectValue placeholder="Select flavor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vanilla">Vanilla</SelectItem>
                  <SelectItem value="chocolate">Chocolate</SelectItem>
                  <SelectItem value="strawberry">Strawberry</SelectItem>
                  <SelectItem value="almond">Almond</SelectItem>
                  <SelectItem value="lemon">Lemon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <Label className="text-[#383A3F] mb-2 block">Filling Selection</Label>
              <Select>
                <SelectTrigger className="rounded-lg" style={{ borderRadius: '8px' }}>
                  <SelectValue placeholder="Select filling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vanilla-buttercream">Vanilla Buttercream</SelectItem>
                  <SelectItem value="chocolate-buttercream">Chocolate Buttercream</SelectItem>
                  <SelectItem value="strawberry-mousse">Strawberry Mousse</SelectItem>
                  <SelectItem value="lemon-mousse">Lemon Mousse</SelectItem>
                  <SelectItem value="cream-cheese">Cream Cheese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#383A3F] mb-2 block">Icing Type</Label>
              <Select>
                <SelectTrigger className="rounded-lg" style={{ borderRadius: '8px' }}>
                  <SelectValue placeholder="Select icing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buttercream">Buttercream</SelectItem>
                  <SelectItem value="ganache">Ganache</SelectItem>
                  <SelectItem value="cream-cheese">Cream Cheese</SelectItem>
                  <SelectItem value="whipped">Whipped Cream</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#383A3F] mb-2 block">Pickup Date</Label>
              <Input type="date" className="rounded-lg" style={{ borderRadius: '8px' }} />
            </div>

            <div>
              <Label className="text-[#383A3F] mb-2 block">Deposit Amount</Label>
              <Input type="number" placeholder="Minimum $50" min="50" className="rounded-lg" style={{ borderRadius: '8px' }} />
            </div>

            <div>
              <Label className="text-[#383A3F] mb-2 block">Special Instructions</Label>
              <Textarea 
                placeholder="Any special requests or notes..." 
                rows={4} 
                className="rounded-lg" 
                style={{ borderRadius: '8px' }} 
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 lg:mt-8 pt-6" style={{ borderTop: '1px solid rgba(90, 56, 37, 0.15)' }}>
          <Button 
            onClick={handleSaveOrder}
            disabled={isSubmitting}
            className="text-white px-6 sm:px-8 disabled:opacity-50 w-full sm:w-auto hover:shadow-bakery-hover transition-all" 
            style={{ borderRadius: '8px', fontFamily: 'Poppins', fontWeight: 600, backgroundColor: '#C44569', height: '44px' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Order'
            )}
          </Button>
          <Button 
            variant="outline" 
            className="px-6 sm:px-8 w-full sm:w-auto" 
            style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.3)', color: '#5A3825', height: '44px' }}
            onClick={() => toast.info('Order cancelled')}
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            className="px-6 sm:px-8 w-full sm:w-auto" 
            style={{ borderRadius: '8px', borderColor: 'rgba(196, 69, 105, 0.3)', color: '#C44569', height: '44px' }}
            onClick={() => toast.info('Preview feature coming soon!')}
          >
            Preview Order
          </Button>
        </div>
      </Card>

      {/* Order List */}
      <Card className="p-6 lg:p-8 rounded-xl overflow-x-auto bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <h2 className="mb-6" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 'clamp(18px, 4vw, 24px)', color: '#2B2B2B' }}>Order List</h2>
        <div className="overflow-x-auto -mx-6 lg:-mx-8 px-6 lg:px-8">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Cake Type</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="transition-colors" style={{ '&:hover': { backgroundColor: 'rgba(248, 235, 215, 0.3)' } }}>
                <TableCell style={{ color: '#5A3825', fontFamily: 'Open Sans' }}>{order.id}</TableCell>
                <TableCell style={{ color: '#2B2B2B', fontFamily: 'Open Sans' }}>{order.customer}</TableCell>
                <TableCell style={{ color: '#2B2B2B', fontFamily: 'Open Sans' }}>{order.cake}</TableCell>
                <TableCell style={{ color: '#5A3825', fontFamily: 'Open Sans' }}>{order.pickup}</TableCell>
                <TableCell>
                  <Badge className="rounded-lg" style={{ backgroundColor: order.statusColor, color: '#FFFFFF' }}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-lg transition-colors"
                      style={{ '&:hover': { backgroundColor: 'rgba(196, 69, 105, 0.1)' } }}
                      onClick={() => toast.info('Edit feature coming soon!')}
                    >
                      <Edit size={16} color="#C44569" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-lg transition-colors"
                      style={{ '&:hover': { backgroundColor: 'rgba(90, 56, 37, 0.1)' } }}
                      onClick={() => handleCompleteOrder(order.id)}
                    >
                      <Check size={16} color="#5A3825" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-lg transition-colors"
                      style={{ '&:hover': { backgroundColor: 'rgba(196, 69, 105, 0.1)' } }}
                      onClick={() => setDeleteOrderId(order.id)}
                    >
                      <Trash2 size={16} color="#C44569" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete order {deleteOrderId}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteOrderId && handleDeleteOrder(deleteOrderId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
