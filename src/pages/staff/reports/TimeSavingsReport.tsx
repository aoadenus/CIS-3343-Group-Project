import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
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
  Clock, 
  TrendingDown, 
  Target,
  Zap,
  ArrowUpRight,
  Loader2
} from 'lucide-react';

interface TimeSavingsData {
  currentWeeklyHours: number;
  targetWeeklyHours: number;
  avgOrderTime: number;
  hoursSaved: number;
  percentToGoal: number;
  weeklyTrend: Array<{
    week: string;
    actual: number;
    target: number;
  }>;
  featureSavings: Array<{
    name: string;
    description: string;
    timeSaved: number;
  }>;
}

export function TimeSavingsReport() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeSavingsData, setTimeSavingsData] = useState<TimeSavingsData | null>(null);

  useEffect(() => {
    fetchTimeSavingsData();
  }, []);

  const fetchTimeSavingsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/time-savings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch time savings data');
      }

      const data = await response.json();
      setTimeSavingsData(data);
    } catch (error) {
      console.error('Error fetching time savings data:', error);
      showToast('error', 'Failed to load time savings analysis. Please try again.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ReportLayout title="Time Savings Analysis">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C44569' }} />
        </div>
      </ReportLayout>
    );
  }

  if (!timeSavingsData) {
    return (
      <ReportLayout title="Time Savings Analysis">
        <div className="text-center py-12">
          <p className="text-gray-500">No time savings data available</p>
        </div>
      </ReportLayout>
    );
  }

  return (
    <ReportLayout title="Time Savings Analysis">
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
                Time Savings Analysis
              </h2>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '15px',
                color: '#5A3825'
              }}>
                Track progress toward 25% reduction goal (20hrs/week → 15hrs/week)
              </p>
            </div>
            <Button
              onClick={fetchTimeSavingsData}
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
                <Clock size={24} color="#C44569" strokeWidth={2.5} />
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
                Current Weekly Time
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
                {timeSavingsData.currentWeeklyHours}hrs
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                Avg order creation time: {timeSavingsData.avgOrderTime} min
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
                <Target size={24} color="#10B981" strokeWidth={2.5} />
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
                Target Weekly Time
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
                15hrs
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                Goal: 25% reduction
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
                <Zap size={24} color="#C44569" strokeWidth={2.5} />
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
                Time Saved So Far
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
                {timeSavingsData.hoursSaved}hrs
              </p>
              <p style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {timeSavingsData.percentToGoal.toFixed(1)}% toward goal
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
            Weekly Time Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSavingsData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="week" 
                style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px' }}
              />
              <YAxis 
                label={{ 
                  value: 'Hours', 
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
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#C44569" 
                strokeWidth={2} 
                name="Actual Time"
                dot={{ fill: '#C44569', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#5A3825" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                name="Target (15hrs)"
                dot={{ fill: '#5A3825', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Time Savings by Feature */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#2B2B2B',
            marginBottom: '16px'
          }}>
            Time Savings by Feature
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timeSavingsData.featureSavings && timeSavingsData.featureSavings.length > 0 ? (
              timeSavingsData.featureSavings.map((feature, index) => (
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
                      {feature.name}
                    </div>
                    <div style={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {feature.description}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#10B981'
                    }}>
                      -{feature.timeSaved} min
                    </div>
                    <div style={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '11px',
                      color: '#6B7280'
                    }}>
                      per order
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
                  No feature-specific savings data available
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ReportLayout>
  );
}
