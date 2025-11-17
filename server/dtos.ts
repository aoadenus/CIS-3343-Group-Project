export interface TrackingOrderResponse {
  id: number;
  status: string;
  trackingToken: string | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  fulfillment: {
    eventDate: Date | null;
  };
  payment: {
    totalAmount: number | null;
    depositAmount: number | null;
    balanceDue: number | null;
    depositRequired: number | null;
    depositMet: boolean;
    paymentStatus: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface KPIMetric {
  value: number | string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  detail: string;
}

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  timestamp: string;
}

export interface DashboardMetrics {
  kpis: {
    kpi1: KPIMetric;
    kpi2: KPIMetric;
    kpi3: KPIMetric;
    kpi4: KPIMetric;
  };
  activities: ActivityItem[];
  recentOrders?: any[];
  [key: string]: any;
}
