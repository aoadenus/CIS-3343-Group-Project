import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ToastContext';
import { ReportLayout } from './ReportLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  AlertTriangle, 
  DollarSign, 
  TrendingDown,
  Shield,
  ArrowUpRight,
  Loader2
} from 'lucide-react';

interface LostOrderData {
  currentAnnualCost: number;
  targetAnnualCost: number;
  currentMonthlyLosses: number;
  savingsSoFar: number;
  percentToGoal: number;
  monthlyTrend: Array<{
    month: string;
    cost: number;
  }>;
  rootCauses: Array<{
    name: string;
    count: number;
    totalCost: number;
    percentage: number;
  }>;
}

export function LostOrderAnalysisReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [lostOrderData, setLostOrderData] = useState<LostOrderData | null>(null);

  useEffect(() => {
    fetchLostOrderData();
  }, []);

  const fetchLostOrderData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/lost-order-analysis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lost order data');
      }

      const data = await response.json();
      setLostOrderData(data);
    } catch (error) {
      console.error('Error fetching lost order data:', error);
      showToast('error', 'Failed to load lost order analysis. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ReportLayout title="Lost Order Analysis">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
        </div>
      </ReportLayout>
    );
  }

  if (!lostOrderData) {
    return (
      <ReportLayout title="Lost Order Analysis">
        <div className="text-center py-12">
          <p className="text-gray-500">No lost order data available</p>
        </div>
      </ReportLayout>
    );
  }

  return (
    <ReportLayout title="Lost Order Analysis">
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
                Lost Order Analysis
              </h2>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '15px',
                color: '#5A3825'
              }}>
                Track progress toward 80% reduction goal ($4,800/year → $960/year)
              </p>
            </div>
            <Button
              onClick={fetchLostOrderData}
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
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <AlertTriangle size={24} color="#EF4444" strokeWidth={2.5} />
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
                Current Annual Cost
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#EF4444',
                marginBottom: '4px'
              }}>
                ${lostOrderData.currentAnnualCost.toLocaleString()}
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {lostOrderData.currentMonthlyLosses} orders/month
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
                <Shield size={24} color="#10B981" strokeWidth={2.5} />
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
                Target Annual Cost
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
                $960
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                Goal: 80% reduction
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
                <DollarSign size={24} color="#C44569" strokeWidth={2.5} />
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
                Savings So Far
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
                ${lostOrderData.savingsSoFar.toLocaleString()}
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {lostOrderData.percentToGoal.toFixed(1)}% toward goal
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
            Monthly Lost Order Costs
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lostOrderData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }}
              />
              <YAxis 
                label={{ 
                  value: 'Cost ($)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }
                }}
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
              <Bar 
                dataKey="cost" 
                fill="#C44569" 
                name="Lost Order Cost"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Root Cause Analysis */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#2B2B2B',
            marginBottom: '16px'
          }}>
            Root Causes (Historical)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lostOrderData.rootCauses && lostOrderData.rootCauses.length > 0 ? (
              lostOrderData.rootCauses.map((cause, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#2B2B2B',
                      marginBottom: '4px'
                    }}>
                      {cause.name}
                    </div>
                    <div style={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {cause.count} incidents
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#EF4444'
                    }}>
                      ${cause.totalCost.toLocaleString()}
                    </div>
                    <div style={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '11px',
                      color: '#6B7280'
                    }}>
                      {cause.percentage}% of losses
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '48px',
                textAlign: 'center',
                background: '#F9FAFB',
                borderRadius: '8px'
              }}>
                <TrendingDown size={48} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
                <p style={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '15px',
                  color: '#6B7280'
                }}>
                  No root cause data available
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ReportLayout>
  );
}
