export const api = {
  async post(path: string, body?: any, token?: string) {
    const res = await fetch(`/api/${path.replace(/^\/+/, '')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data || { error: 'Request failed' };
    return data;
  },
  async get(path: string, token?: string) {
    const res = await fetch(`/api/${path.replace(/^\/+/, '')}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data || { error: 'Request failed' };
    return data;
  },
  async login(email: string, password: string) {
    return this.post('auth/login', { email, password });
  },
  async listProducts() {
    return this.get('products');
  },
  async listCustomers() {
    return this.get('customers');
  },
  async createOrder(payload: any) {
    return this.post('orders', payload);
  }
};
