export interface ChartDataPoint {
  date: string;
  count: number;
}

export interface ReportOrder {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: Date | string;
  status: string;
  totalAmount: number | null;
  depositAmount: number | null;
  balanceDue: number | null;
  createdAt: Date | string;
}

export interface OrderSummaryResponse {
  chartData: ChartDataPoint[];
  orders: ReportOrder[];
  totals: {
    count: number;
    revenue: number;
  };
}

export interface OrderSummaryFilters {
  startDate: string;
  endDate: string;
  status: string;
}

// Customer List Report Types
export interface CustomerChartDataPoint {
  month: string;
  count: number;
}

export interface ReportCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string; // 'Retail' or 'Corporate'
  orderCount: number;
  totalSpent: number;
  createdAt: Date | string;
}

export interface CustomerListResponse {
  chartData: CustomerChartDataPoint[];
  customers: ReportCustomer[];
  totals: {
    customers: number;
    revenue: number;
    orders: number;
  };
}

export interface CustomerListFilters {
  customerType: string;
  minSpending: string;
  maxSpending: string;
}
