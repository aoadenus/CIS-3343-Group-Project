import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, UserPlus, Download, Mail, Phone } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

const customers = [
  { name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567', orders: 12, lastOrder: 'Oct 28, 2025' },
  { name: 'Michael Chen', email: 'michael.chen@email.com', phone: '(555) 234-5678', orders: 8, lastOrder: 'Oct 30, 2025' },
  { name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789', orders: 15, lastOrder: 'Nov 1, 2025' },
  { name: 'David Kim', email: 'david.kim@email.com', phone: '(555) 456-7890', orders: 6, lastOrder: 'Oct 25, 2025' },
  { name: 'Lisa Martinez', email: 'lisa.martinez@email.com', phone: '(555) 567-8901', orders: 20, lastOrder: 'Oct 31, 2025' },
  { name: 'James Wilson', email: 'james.w@email.com', phone: '(555) 678-9012', orders: 4, lastOrder: 'Oct 20, 2025' },
  { name: 'Maria Garcia', email: 'maria.garcia@email.com', phone: '(555) 789-0123', orders: 9, lastOrder: 'Oct 29, 2025' },
  { name: 'Robert Brown', email: 'robert.brown@email.com', phone: '(555) 890-1234', orders: 11, lastOrder: 'Oct 27, 2025' },
  { name: 'Jennifer Davis', email: 'jennifer.d@email.com', phone: '(555) 901-2345', orders: 7, lastOrder: 'Oct 26, 2025' },
  { name: 'Christopher Lee', email: 'chris.lee@email.com', phone: '(555) 012-3456', orders: 13, lastOrder: 'Nov 1, 2025' },
  { name: 'Amanda Taylor', email: 'amanda.t@email.com', phone: '(555) 123-9876', orders: 5, lastOrder: 'Oct 24, 2025' },
  { name: 'Daniel White', email: 'daniel.white@email.com', phone: '(555) 234-8765', orders: 16, lastOrder: 'Oct 30, 2025' },
];

export function Customers() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleExport = (type: string) => {
    showToast('success', `${type} customer list has been downloaded successfully.`, 'Export Complete');
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#C44569' }}>Customer Management</h1>
          <p className="tagline mt-2" style={{ fontFamily: 'Lucida Handwriting', fontSize: '16px', color: '#C44569', opacity: 0.9 }}>
            Building sweet relationships
          </p>
        </div>
        <Button 
          className="text-white w-full sm:w-auto hover:shadow-bakery-hover transition-all" 
          style={{ borderRadius: '8px', fontFamily: 'Poppins', fontWeight: 600, backgroundColor: '#C44569', height: '44px', minWidth: '44px' }}
          onClick={() => toast.success('Add customer form opened!')}
        >
          <UserPlus size={18} className="mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4 sm:p-5 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} color="#C44569" />
            <Input
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg bg-white"
              style={{ borderColor: 'rgba(90, 56, 37, 0.2)', color: '#5A3825', fontFamily: 'Open Sans' }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              style={{ borderRadius: '8px', borderColor: 'rgba(90, 56, 37, 0.3)', color: '#5A3825', height: '44px', minWidth: '44px' }}
              onClick={() => handleExport('CSV')}
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredCustomers.map((customer, index) => (
          <Card 
            key={index} 
            className="p-5 rounded-xl cursor-pointer transition-all hover:shadow-bakery-hover bg-white"
            style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}
            onClick={() => toast.info(`Viewing ${customer.name}'s profile`)}
          >
            <div className="space-y-4">
              {/* Avatar and Name */}
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="flex items-center justify-center rounded-full" 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'rgba(196, 69, 105, 0.15)' 
                  }}
                >
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#C44569' }}>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                    {customer.name}
                  </p>
                  <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', opacity: 0.7 }}>
                    {customer.orders} orders
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pb-4" style={{ borderBottom: '1px solid rgba(90, 56, 37, 0.1)' }}>
                <div className="flex items-center gap-2">
                  <Mail size={14} color="#5A3825" style={{ opacity: 0.6 }} />
                  <span style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825', wordBreak: 'break-all' }}>
                    {customer.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} color="#5A3825" style={{ opacity: 0.6 }} />
                  <span style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#5A3825' }}>
                    {customer.phone}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.6 }}>Total Orders</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#2B2B2B' }}>
                    {customer.orders}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'Open Sans', fontSize: '12px', color: '#5A3825', opacity: 0.6 }}>Last Order</p>
                  <p style={{ fontFamily: 'Open Sans', fontSize: '13px', color: '#2B2B2B' }}>
                    {customer.lastOrder}
                  </p>
                </div>
              </div>

              {/* VIP Badge */}
              {customer.orders >= 10 && (
                <Badge 
                  className="rounded-lg"
                  style={{ 
                    backgroundColor: '#C44569', 
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontWeight: 500
                  }}
                >
                  VIP Customer
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Section - Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <h3 className="mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 18px)', color: '#2B2B2B' }}>Marketing Lists</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                style={{ 
                  borderRadius: '8px', 
                  borderColor: 'rgba(90, 56, 37, 0.2)', 
                  color: '#5A3825',
                  height: '44px',
                  fontFamily: 'Open Sans'
                }}
                onClick={() => handleExport('Birthday List')}
              >
                Birthday Reminder List
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                style={{ 
                  borderRadius: '8px', 
                  borderColor: 'rgba(90, 56, 37, 0.2)', 
                  color: '#5A3825',
                  height: '44px',
                  fontFamily: 'Open Sans'
                }}
                onClick={() => handleExport('VIP List')}
              >
                VIP Customer List (10+ orders)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                style={{ 
                  borderRadius: '8px', 
                  borderColor: 'rgba(90, 56, 37, 0.2)', 
                  color: '#5A3825',
                  height: '44px',
                  fontFamily: 'Open Sans'
                }}
                onClick={() => handleExport('Newsletter')}
              >
                Newsletter Subscribers
              </Button>
            </div>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="p-6 rounded-xl bg-white" style={{ boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)' }}>
            <h3 className="mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 'clamp(16px, 3.5vw, 18px)', color: '#2B2B2B' }}>Customer Analytics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>Total Customers</span>
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#2B2B2B' }}>
                  {customers.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>VIP Customers</span>
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#C44569' }}>
                  {customers.filter(c => c.orders >= 10).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Open Sans', fontSize: '14px', color: '#5A3825', opacity: 0.8 }}>New This Month</span>
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#2B2B2B' }}>
                  5
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
