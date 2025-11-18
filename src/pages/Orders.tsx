import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Edit2, Edit, CheckCircle, Check, Trash2, MoreHorizontal, Eye } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

import { OrderWizardDialog } from '../components/orderWizard/OrderWizard';

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
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState(existingOrders);

  const handleOrderComplete = (orderId: string) => {
    showToast('success', `Order ${orderId} created successfully!`);
    // In a real app, you'd refresh the orders list here
  };

  const handleCompleteOrder = (orderId: string) => {
    showToast('success', `Order ${orderId} marked as complete and ready for pickup!`);
    // Update order status in the list
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'Ready', statusColor: '#5A3825' }
          : order
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    showToast('success', `Order ${orderId} has been removed from the system.`);
    setDeleteOrderId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Order Management
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Create and manage customer orders with our guided wizard
          </p>
        </div>
        <Button
          onClick={() => setIsWizardOpen(true)}
          size="lg"
          className="bg-primary hover:bg-primary/90 shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Order
        </Button>
      </div>

      {/* Order List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Active Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="mb-4">
                <Plus className="mx-auto h-16 w-16 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No orders yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Get started by creating your first order with our guided wizard.
              </p>
              <Button onClick={() => setIsWizardOpen(true)} size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Order
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Cake Type</TableHead>
                    <TableHead>Pickup Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="group">
                      <TableCell>
                        <span className="font-medium text-primary">
                          {order.id}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.customer}
                      </TableCell>
                      <TableCell>
                        {order.cake}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.pickup}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'Ready'
                              ? 'default'
                              : order.status === 'New Order'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="font-medium"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => showToast('info', 'View feature coming soon!')}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleCompleteOrder(order.id)}
                              className="text-green-600 focus:text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteOrderId(order.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Wizard */}
      <OrderWizardDialog
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleOrderComplete}
      />

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
