import { ICING_COLORS, DEFAULT_PRODUCTS } from './shopData';

type PaymentStatus = 'partial_deposit' | 'paid_in_full' | 'pending';
type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

function toIsoLocal(d: Date) {
  // produce yyyy-mm-dd
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function rand(seed: number) {
  // simple LCG
  return function() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export interface FakeOrder {
  id: string;
  createdAt: string;
  pickupDate: string;
  customer: { id: number; name: string; email?: string };
  totalAmount: number; // cents
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  cakeProductId?: string;
  icingColor?: string;
}

export function generateFakeOrders2025(): FakeOrder[] {
  const orders: FakeOrder[] = [];
  const rng = rand(12345);
  const start = new Date('2025-01-01');
  const end = new Date('2025-12-31');
  let idCounter = 1000;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // ensure at least one pickup order for each day
    const pickupsForDay = Math.floor(rng() * 3) + 1; // 1..3
    for (let i = 0; i < pickupsForDay; i++) {
      const product = DEFAULT_PRODUCTS[Math.floor(rng() * DEFAULT_PRODUCTS.length)];
      const total = product.priceCents + Math.floor(rng() * 2000);
      const pick = new Date(d);
      // some pickups earlier/later in day
      pick.setHours(10 + Math.floor(rng() * 8), 0, 0, 0);

      const created = new Date(pick);
      created.setDate(created.getDate() - (Math.floor(rng() * 14) + 1));

      const paidRoll = rng();
      const paymentStatus: PaymentStatus = paidRoll > 0.6 ? 'paid_in_full' : paidRoll > 0.2 ? 'partial_deposit' : 'pending';
      const statusRoll = rng();
      const status: OrderStatus = statusRoll > 0.85 ? 'completed' : statusRoll > 0.6 ? 'ready' : statusRoll > 0.1 ? 'confirmed' : 'pending';

      orders.push({
        id: `ORD-${idCounter++}`,
        createdAt: created.toISOString(),
        pickupDate: pick.toISOString(),
        customer: { id: Math.floor(rng() * 300) + 1, name: `Customer ${Math.floor(rng() * 900) + 100}` },
        totalAmount: total,
        paymentStatus,
        status,
        cakeProductId: product.id,
        icingColor: ICING_COLORS[Math.floor(rng() * ICING_COLORS.length)].hex
      });
    }

    // also create a few future creation-only orders (not yet pickup same day)
    if (rng() > 0.8) {
      const futureOffset = 1 + Math.floor(rng() * 30);
      const pickup = new Date(d);
      pickup.setDate(pickup.getDate() + futureOffset);
      if (pickup <= end) {
        const product = DEFAULT_PRODUCTS[Math.floor(rng() * DEFAULT_PRODUCTS.length)];
        orders.push({
          id: `ORD-${idCounter++}`,
          createdAt: new Date(d).toISOString(),
          pickupDate: pickup.toISOString(),
          customer: { id: Math.floor(rng() * 300) + 1000, name: `Future ${Math.floor(rng() * 900) + 1}` },
          totalAmount: product.priceCents,
          paymentStatus: 'pending',
          status: 'pending',
          cakeProductId: product.id,
          icingColor: ICING_COLORS[Math.floor(rng() * ICING_COLORS.length)].hex
        });
      }
    }
  }

  return orders;
}

export const fakeOrders2025 = generateFakeOrders2025();
