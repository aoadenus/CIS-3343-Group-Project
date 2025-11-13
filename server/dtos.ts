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
