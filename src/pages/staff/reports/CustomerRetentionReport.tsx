import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../components/ToastContext';
import { ReportLayout } from './ReportLayout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Star,
  Calendar,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface RetentionData {
  currentReturning: number;
  targetReturning: number;
  retentionRate: number;
  additionalCustomers: number;
  percentToGoal: number;
  monthlyTrend: Array<{
    month: string;
    returning: number;
    target: number;
  }>;
  atRiskCount: number;
  atRiskCustomers: Array<{
    id: number;
    fullName: string;
    lastOrderDate: string;
    daysSinceLastOrder: number;
    totalOrders: number;
  }>;
}

export function CustomerRetentionReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [retentionData, setRetentionData] = useState<RetentionData | null>(null);

  useEffect(() => {
    fetchRetentionData();
  }, []);

  const fetchRetentionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/retention-analysis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch retention data');
      }

      const data = await response.json();
      setRetentionData(data);
    } catch (error) {
      console.error('Error fetching retention data:', error);
      showToast('error', 'Failed to load retention analysis. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ReportLayout title="Customer Retention Analysis">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
        </div>
      </ReportLayout>
    );
  }

  if (!retentionData) {
    return (
      <ReportLayout title="Customer Retention Analysis">
        <div className="text-center py-12">
          <p className="text-gray-500">No retention data available</p>
        </div>
      </ReportLayout>
    );
  }

  return (
    <ReportLayout title="Customer Retention Analysis">
      <div className="space-y-6">
        {/* Header Card */}
        <Card style={{ 
          background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.1) 0%, rgba(196, 69, 105, 0.05) 100%)',
          border: '2px solid rgba(196, 69, 105, 0.2)',
          padding: '24px'
        }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 style={{ 
                fontFamily: 'Playfair Display, serif',
                fontSize: '28px',
                fontWeight: 700,
                color: '#2B2B2B',
                marginBottom: '8px'
              }}>
                Customer Retention Analysis
              </h2>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '15px',
                color: '#5A3825'
              }}>
                Track progress toward 15% increase goal (700/year → 805/year)
              </p>
            </div>
            <Button
              onClick={fetchRetentionData}
              variant="outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ArrowUpRight size={16} />
              Refresh Data
            </Button>
          </div>
        </Card>

        {/* Current vs Target KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card style={{ padding: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
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
                marginBottom: '4px'
              }}>
                Current Returning Customers
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#2B2B2B',
                marginBottom: '4px'
              }}>
                {retentionData.currentReturning}/year
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                Retention rate: {retentionData.retentionRate.toFixed(1)}%
              </p>
            </div>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
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
                <TrendingUp size={24} color="#10B981" strokeWidth={2.5} />
              </div>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                Target
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#10B981',
                marginBottom: '4px'
              }}>
                805/year
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                Goal: 15% increase
              </p>
            </div>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
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
                marginBottom: '4px'
              }}>
                Progress
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#C44569',
                marginBottom: '4px'
              }}>
                +{retentionData.additionalCustomers}
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {retentionData.percentToGoal.toFixed(1)}% toward goal
              </p>
            </div>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#2B2B2B',
            marginBottom: '16px'
          }}>
            Monthly Returning Customers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }}
              />
              <YAxis 
                style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  fontFamily: 'Open Sans, sans-serif',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}
              />
              <Legend 
                wrapperStyle={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px' }}
              />
              <Line 
                type="monotone" 
                dataKey="returning" 
                stroke="#C44569" 
                strokeWidth={2} 
                name="Returning Customers"
                dot={{ fill: '#C44569', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#5A3825" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                name="Target"
                dot={{ fill: '#5A3825', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* At-Risk Customers */}
        <Card style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <AlertTriangle size={24} color="#F59E0B" />
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#2B2B2B'
              }}>
                At-Risk Customers ({retentionData.atRiskCount})
              </h3>
            </div>
            <p style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '14px',
              color: '#6B7280'
            }}>
              Customers who haven't ordered in 180+ days
            </p>
          </div>

          {retentionData.atRiskCustomers && retentionData.atRiskCustomers.length > 0 ? (
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
                      Customer Name
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
                      Days Since Order
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {retentionData.atRiskCustomers.map((customer, index) => (
                    <tr 
                      key={customer.id}
                      style={{ 
                        borderTop: index > 0 ? '1px solid #E5E7EB' : 'none'
                      }}
                    >
                      <td style={{
                        padding: '12px 16px',
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px',
                        color: '#2B2B2B'
                      }}>
                        {customer.fullName}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px',
                        color: '#2B2B2B'
                      }}>
                        {format(new Date(customer.lastOrderDate), 'MMM d, yyyy')}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px',
                        color: '#2B2B2B'
                      }}>
                        <Badge 
                          variant="warning"
                          style={{
                            background: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #F59E0B'
                          }}
                        >
                          {customer.daysSinceLastOrder} days
                        </Badge>
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        fontFamily: 'Open Sans, sans-serif',
                        fontSize: '14px',
                        color: '#2B2B2B'
                      }}>
                        {customer.totalOrders}
                      </td>
                      <td style={{
                        padding: '12px 16px'
                      }}>
                        <Button
                          size="sm"
                          variant="outline"
                          style={{
                            height: '32px',
                            fontSize: '13px',
                            background: 'rgba(196, 69, 105, 0.08)',
                            border: '1px solid rgba(196, 69, 105, 0.3)',
                            color: '#C44569'
                          }}
                        >
                          Follow Up
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              background: '#F9FAFB',
              borderRadius: '8px'
            }}>
              <Calendar size={48} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '15px',
                color: '#6B7280'
              }}>
                No at-risk customers identified
              </p>
            </div>
          )}
        </Card>
      </div>
    </ReportLayout>
  );
}
