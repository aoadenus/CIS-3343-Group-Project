import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import {
  Search,
  Plus,
  Star,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { cn } from '../ui/utils';
import { useDebounce } from '../../hooks/useDebounce';

import { useOrderWizard } from '../../stores/orderWizardStore';
import { inlineCustomerSchema } from '../../lib/orderWizardSchemas';
import type { Customer } from '../../stores/orderWizardStore';

// Mock customer data - replace with actual API call
const mockCustomers: Customer[] = [
  {
    id: '1',
    full_name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    customer_type: 'retail',
    is_preferred: true,
    last_order_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    created_at: '2024-01-15'
  },
  {
    id: '2',
    full_name: 'Michael Chen',
    email: 'michael.chen@corporation.com',
    phone: '(555) 987-6543',
    customer_type: 'corporate',
    is_preferred: false,
    last_order_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    created_at: '2024-02-20'
  },
  {
    id: '3',
    full_name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 456-7890',
    customer_type: 'retail',
    is_preferred: true,
    last_order_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    created_at: '2024-03-10'
  },
  {
    id: '4',
    full_name: 'Robert Davis',
    email: 'robert.davis@business.com',
    phone: '(555) 234-5678',
    customer_type: 'corporate',
    is_preferred: false,
    address: '123 Business Ave, Suite 100',
    created_at: '2024-04-05'
  },
];

interface CustomerSelectionStepProps {
  className?: string;
}

export const CustomerSelectionStep: React.FC<CustomerSelectionStepProps> = ({
  className
}) => {
  const { data, setWizardData } = useOrderWizard();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [customerType, setCustomerType] = useState<'retail' | 'corporate'>('retail');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearch) return mockCustomers.slice(0, 10); // Show recent customers

    const query = debouncedSearch.toLowerCase();
    return mockCustomers.filter(customer =>
      customer.full_name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone?.includes(query)
    );
  }, [debouncedSearch]);

  const handleSelectCustomer = (customer: Customer) => {
    setWizardData({
      customerId: customer.id,
      inlineCustomer: undefined // Clear any inline customer data
    });
    setIsCreatingNew(false);
  };

  const form = useForm({
    resolver: zodResolver(inlineCustomerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      customer_type: 'retail' as const,
      address: '',
    }
  });

  const handleCreateCustomer = async (formData: any) => {
    // In a real app, this would call an API
    console.log('Creating new customer:', formData);

    // Mock successful creation - add to the list
    const newCustomer: Customer = {
      id: Date.now().toString(),
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      customer_type: formData.customer_type,
      address: formData.address,
      is_preferred: false,
      created_at: new Date().toISOString()
    };

    // Select the newly created customer
    setWizardData({
      customerId: newCustomer.id,
      inlineCustomer: formData
    });
    setIsCreatingNew(false);
    form.reset();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {!isCreatingNew ? (
        <>
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Customer cards */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onSelect={() => handleSelectCustomer(customer)}
                    isSelected={data.customerId === customer.id}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No customers found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Create new customer CTA */}
          <Button
            variant="outline"
            onClick={() => setIsCreatingNew(true)}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Customer
          </Button>
        </>
      ) : (
        <InlineCustomerForm
          form={form}
          onSubmit={handleCreateCustomer}
          onCancel={() => setIsCreatingNew(false)}
        />
      )}
    </div>
  );
};

// Customer Card Component
interface CustomerCardProps {
  customer: Customer;
  onSelect: () => void;
  isSelected: boolean;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onSelect, isSelected }) => (
  <Card
    className={cn(
      "cursor-pointer transition-all hover:shadow-md",
      isSelected && "ring-2 ring-primary"
    )}
    onClick={onSelect}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{customer.full_name}</p>
            {customer.is_preferred && (
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" />
            )}
            <Badge
              variant={customer.customer_type === 'corporate' ? 'secondary' : 'default'}
              className="flex-shrink-0"
            >
              {customer.customer_type}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{customer.email}</span>
          </div>

          {customer.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{customer.phone}</span>
            </div>
          )}

          {customer.last_order_date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Last order {formatDistanceToNow(customer.last_order_date)} ago</span>
            </div>
          )}
        </div>

        {isSelected && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
      </div>
    </CardContent>
  </Card>
);

// Inline Customer Creation Form
interface InlineCustomerFormProps {
  form: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const InlineCustomerForm: React.FC<InlineCustomerFormProps> = ({
  form,
  onSubmit,
  onCancel
}) => {
  const [customerType, setCustomerType] = useState<'retail' | 'corporate'>('retail');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create New Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setCustomerType(value as 'retail' | 'corporate');
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="retail" id="retail" />
                        <Label htmlFor="retail">Retail Customer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="corporate" id="corporate" />
                        <Label htmlFor="corporate">Corporate Account</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {customerType === 'corporate' && (
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Business St, City, State 12345"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Create Customer
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
