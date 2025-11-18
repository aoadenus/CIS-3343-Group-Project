import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ToastContext';
import {
  Users,
  RefreshCw,
  AlertTriangle,
  Star,
  Search,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Loader2,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  customerType: 'retail' | 'corporate';
  isPreferred: boolean;
  totalOrders: number;
  lastOrderDate: string | null;
  daysSinceLastOrder: number;
  atRiskOfChurn: boolean;
}

interface RetentionStats {
  total: number;
  returning: number;
  atRisk: number;
  preferred: number;
  percentToGoal: number;
}

type FilterType = 'all' | 'retail' | 'corporate' | 'preferred' | 'at-risk';

export function CustomerManagementEnhanced() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [retentionStats, setRetentionStats] = useState<RetentionStats | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchRetentionStats();
  }, [filter, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/customers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast('error', 'Failed to load customers. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRetentionStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customers/retention-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRetentionStats(data);
      }
    } catch (error) {
      console.error('Error fetching retention stats:', error);
    }
  };

  const handleMarkAsPreferred = async (customerId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/customers/${customerId}/preferred`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPreferred: true })
      });

      if (response.ok) {
        showToast('success', 'Customer marked as preferred', 'Success');
        fetchCustomers();
        fetchRetentionStats();
      }
    } catch (error) {
      console.error('Error marking customer as preferred:', error);
      showToast('error', 'Failed to update customer', 'Error');
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Retention KPIs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <Card style={{ padding: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(196, 69, 105, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Users size={24} color="#C44569" strokeWidth={2.5} />
          </div>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}>
            Total Customers
          </p>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#2B2B2B'
          }}>
            {retentionStats?.total || 0}
          </p>
        </Card>

        <Card style={{ padding: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <RefreshCw size={24} color="#10B981" strokeWidth={2.5} />
          </div>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}>
            Returning Customers
          </p>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#2B2B2B',
            marginBottom: '4px'
          }}>
            {retentionStats?.returning || 0}
          </p>
          <p style={{
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '12px',
            color: '#6B7280'
          }}>
            Goal: 805 ({retentionStats?.percentToGoal || 0}% to goal)
          </p>
        </Card>

        <Card style={{ padding: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <AlertTriangle size={24} color="#F59E0B" strokeWidth={2.5} />
          </div>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}>
            At Risk of Churn
          </p>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#F59E0B'
          }}>
            {retentionStats?.atRisk || 0}
          </p>
        </Card>

        <Card style={{ padding: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(196, 69, 105, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Star size={24} color="#C44569" strokeWidth={2.5} />
          </div>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}>
            Preferred Customers
          </p>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#C44569'
          }}>
            {retentionStats?.preferred || 0}
          </p>
        </Card>
      </div>

      {/* Customer Directory Card */}
      <Card style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '24px',
              fontWeight: 700,
              color: '#2B2B2B'
            }}>
              Customer Directory
            </h2>
            <Button
              style={{
                background: 'linear-gradient(135deg, #C44569 0%, #D4567A 100%)',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              Add Customer
            </Button>
          </div>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }} 
              />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontFamily: 'Open Sans, sans-serif'
                }}
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              style={{
                height: '40px',
                padding: '0 16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                minWidth: '180px'
              }}
            >
              <option value="all">All Customers</option>
              <option value="retail">Retail Only</option>
              <option value="corporate">Corporate Only</option>
              <option value="preferred">Preferred Only</option>
              <option value="at-risk">At Risk of Churn</option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <div style={{ 
          border: '1px solid #E5E7EB', 
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F9FAFB' }}>
              <tr>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Name
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Type
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Contact
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Total Orders
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Last Order
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Status
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr 
                  key={customer.id}
                  style={{ 
                    borderTop: index > 0 ? '1px solid #E5E7EB' : 'none'
                  }}
                >
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '14px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, color: '#2B2B2B', marginBottom: '4px' }}>
                        {customer.fullName}
                      </div>
                      {customer.isPreferred && (
                        <Badge style={{
                          background: 'rgba(196, 69, 105, 0.1)',
                          color: '#C44569',
                          border: '1px solid rgba(196, 69, 105, 0.3)',
                          fontSize: '11px',
                          padding: '2px 8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Star size={12} />
                          Preferred
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td style={{
                    padding: '12px 16px'
                  }}>
                    <Badge style={{
                      background: customer.customerType === 'corporate' ? '#E0E7FF' : '#F3F4F6',
                      color: customer.customerType === 'corporate' ? '#3730A3' : '#374151',
                      border: `1px solid ${customer.customerType === 'corporate' ? '#C7D2FE' : '#D1D5DB'}`,
                      fontSize: '12px',
                      padding: '4px 10px',
                      textTransform: 'capitalize'
                    }}>
                      {customer.customerType}
                    </Badge>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '13px'
                  }}>
                    <div style={{ color: '#2B2B2B' }}>{customer.email}</div>
                    <div style={{ color: '#6B7280', marginTop: '2px' }}>{customer.phone}</div>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#2B2B2B'
                  }}>
                    {customer.totalOrders}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: '13px'
                  }}>
                    {customer.lastOrderDate ? (
                      <div>
                        <div style={{ color: '#2B2B2B' }}>
                          {format(new Date(customer.lastOrderDate), 'MMM d, yyyy')}
                        </div>
                        <div style={{ color: '#6B7280', marginTop: '2px' }}>
                          {customer.daysSinceLastOrder} days ago
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>Never</span>
                    )}
                  </td>
                  <td style={{
                    padding: '12px 16px'
                  }}>
                    {customer.atRiskOfChurn && (
                      <Badge style={{
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: '1px solid #F59E0B',
                        fontSize: '11px',
                        padding: '4px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <AlertTriangle size={12} />
                        At Risk
                      </Badge>
                    )}
                  </td>
                  <td style={{
                    padding: '12px 16px'
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        style={{
                          height: '32px',
                          padding: '0 12px',
                          fontSize: '13px'
                        }}
                      >
                        <Eye size={14} style={{ marginRight: '6px' }} />
                        View
                      </Button>
                      {!customer.isPreferred && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsPreferred(customer.id)}
                          style={{
                            height: '32px',
                            padding: '0 12px',
                            fontSize: '13px',
                            background: 'rgba(196, 69, 105, 0.05)',
                            border: '1px solid rgba(196, 69, 105, 0.3)',
                            color: '#C44569'
                          }}
                        >
                          <Star size={14} style={{ marginRight: '6px' }} />
                          Mark Preferred
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {customers.length === 0 && !loading && (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              background: '#F9FAFB'
            }}>
              <Calendar size={48} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '15px',
                color: '#6B7280'
              }}>
                No customers found
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
