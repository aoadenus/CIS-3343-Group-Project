import express from 'express';
import cors from 'cors';
import * as storage from './storage.js';
import type { NewProduct, NewOrder, NewInquiry, NewContactMessage, NewPayment } from '../shared/schema.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ PRODUCTS ============

app.get('/api/products', async (req, res) => {
  try {
    const products = await storage.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// IMPORTANT: Search route must come BEFORE :id route
app.get('/api/products/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const products = await storage.searchProducts(query.trim());
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await storage.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const productData: NewProduct = req.body;
    
    if (!productData.name || !productData.category || !productData.description) {
      return res.status(400).json({ error: 'Name, category, and description are required' });
    }
    
    const product = await storage.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const existing = await storage.getProductById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updated = await storage.updateProduct(id, updates);
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedBy = req.body.deletedBy || 'admin';
    
    const existing = await storage.getProductById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await storage.deleteProduct(id, deletedBy);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============ CUSTOMERS ============

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await storage.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Search customers by name, email, or ID
app.get('/api/customers/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const customers = await storage.searchCustomers(query.trim());
    res.json(customers);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({ error: 'Failed to search customers' });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Check if customer already exists
    const existing = await storage.getCustomerByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Customer with this email already exists' });
    }
    
    const customer = await storage.createCustomer({
      name,
      email,
      phone: phone || null,
      totalOrders: 0,
      isVip: false,
    });
    
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await storage.getCustomerWithOrders(id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// ============ ORDERS ============

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await storage.getAllOrdersWithCustomers();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = await storage.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order from custom builder (frontend) or admin order form (backend)
app.post('/api/orders/custom', async (req, res) => {
  try {
    const { 
      name, email, phone, occasion, flavor, design, servings, date, message, notes, inspirationImages, layers,
      // Admin-specific fields
      customerId, adminNotes, status, priority, depositAmount, paymentStatus, totalAmount, createdBy
    } = req.body;
    
    // Validate required fields (support both legacy single flavor and new layer system)
    if (!name || !email || !occasion || !design) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // If layers are provided, validate them
    if (layers && Array.isArray(layers)) {
      if (layers.length === 0) {
        return res.status(400).json({ error: 'At least one layer is required' });
      }
      
      for (const layer of layers) {
        if (!layer.flavor) {
          return res.status(400).json({ error: 'Each layer must have a flavor' });
        }
        if (layer.fillings && layer.fillings.length > 2) {
          return res.status(400).json({ error: 'Maximum 2 fillings per layer allowed' });
        }
        if (layer.notes && layer.notes.length > 255) {
          return res.status(400).json({ error: 'Layer notes must be 255 characters or less' });
        }
      }
    } else if (!flavor) {
      return res.status(400).json({ error: 'Either flavor or layers must be provided' });
    }
    
    // Find or create customer (admin can provide customerId directly)
    let customer;
    if (customerId) {
      // Admin order: use existing customer
      customer = await storage.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
    } else {
      // Public order: find or create customer
      customer = await storage.findOrCreateCustomer({ name, email, phone });
    }
    
    // Calculate deposit if total is provided (admin orders)
    const calculatedDepositRequired = totalAmount ? Math.ceil(totalAmount * 0.5) : null;
    const finalDepositAmount = depositAmount || calculatedDepositRequired;
    
    // Create order
    const orderData: NewOrder = {
      customerId: customer.id,
      orderType: 'custom',
      occasion,
      flavor: flavor || null,
      design,
      servings: servings ? parseInt(servings) : null,
      eventDate: date ? new Date(date) : null,
      message,
      additionalNotes: notes || null, // Customer notes
      adminNotes: adminNotes || null, // Admin/management notes (separate field)
      inspirationImages: inspirationImages ? JSON.stringify(inspirationImages) : null,
      layers: layers ? JSON.stringify(layers) : null,
      status: status || 'pending', // Admin can set initial status
      priority: priority || 'medium', // Admin can set priority
      totalAmount: totalAmount || null, // Admin provides calculated total
      depositRequired: calculatedDepositRequired,
      depositAmount: finalDepositAmount,
      paymentStatus: paymentStatus || 'pending',
      depositMet: paymentStatus === 'paid' || paymentStatus === 'partial',
      lastModifiedBy: createdBy || 'system',
    };
    
    const order = await storage.createOrder(orderData);
    
    res.status(201).json({ order, customer });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const order = await storage.updateOrderStatus(id, status);
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel order (only allowed before preparing/baking starts)
app.post('/api/orders/:id/cancel', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { reason, cancelledBy } = req.body;
    
    const order = await storage.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Business rule: Can only cancel if order hasn't started preparing
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        error: 'Order can only be cancelled before preparation begins',
        currentStatus: order.status
      });
    }
    
    const cancelled = await storage.updateOrder(id, {
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date(),
      cancelledBy: cancelledBy || 'Unknown',
    });
    
    res.json(cancelled);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// ============ PAYMENTS (Admin Tracking) ============

// Get all payments for an order
app.get('/api/orders/:id/payments', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const payments = await storage.getPaymentsByOrderId(orderId);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Record a new payment (admin-only, record-keeping)
app.post('/api/orders/:id/payments', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { paymentType, amount, paymentDate, paymentStatus, notes, recordedBy } = req.body;
    
    // Validation
    if (!paymentType || !amount || !paymentDate || !recordedBy) {
      return res.status(400).json({ error: 'Payment type, amount, date, and recorded by are required' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Payment amount must be greater than 0' });
    }
    
    // Validate payment type
    const validPaymentTypes = ['credit_card', 'cash', 'check'];
    if (!validPaymentTypes.includes(paymentType)) {
      return res.status(400).json({ error: 'Invalid payment type. Must be credit_card, cash, or check' });
    }
    
    // Check order exists
    const order = await storage.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get existing payments to check total
    const existingPayments = await storage.getPaymentsByOrderId(orderId);
    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Check if adding this payment would exceed order total
    if (order.totalAmount && (totalPaid + amount > order.totalAmount)) {
      return res.status(400).json({ 
        error: 'Payment amount would exceed order total',
        orderTotal: order.totalAmount,
        totalPaid,
        attemptedPayment: amount,
        remaining: order.totalAmount - totalPaid
      });
    }
    
    const paymentData: NewPayment = {
      orderId,
      paymentType,
      amount,
      paymentDate: new Date(paymentDate),
      paymentStatus: paymentStatus || 'completed',
      notes: notes || null,
      recordedBy,
    };
    
    const payment = await storage.createPayment(paymentData);
    
    // Update order payment status based on total paid
    const newTotalPaid = totalPaid + amount;
    let orderPaymentStatus = 'pending';
    
    if (order.totalAmount) {
      if (newTotalPaid >= order.totalAmount) {
        orderPaymentStatus = 'paid';
      } else if (newTotalPaid > 0) {
        orderPaymentStatus = 'partial';
      }
      
      // Update order with new payment info
      await storage.updateOrder(orderId, {
        depositAmount: Math.min(newTotalPaid, order.totalAmount),
        balanceDue: Math.max(0, order.totalAmount - newTotalPaid),
        paymentStatus: orderPaymentStatus,
        paymentDate: newTotalPaid >= order.totalAmount ? new Date() : order.paymentDate,
      });
    }
    
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Update payment record
app.patch('/api/payments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { paymentStatus, notes } = req.body;
    
    const payment = await storage.updatePayment(id, {
      paymentStatus,
      notes,
    });
    
    res.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// ============ INQUIRIES ============

app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await storage.getAllInquiries();
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, eventDate, message, productName, inspirationImages } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Find or create customer
    const customer = await storage.findOrCreateCustomer({ name, email, phone });
    
    const inquiryData: NewInquiry = {
      customerId: customer.id,
      name,
      email,
      phone,
      eventDate: eventDate ? new Date(eventDate) : null,
      message,
      productName,
      inspirationImages: inspirationImages ? JSON.stringify(inspirationImages) : null,
      status: 'pending',
    };
    
    const inquiry = await storage.createInquiry(inquiryData);
    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

app.patch('/api/inquiries/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const inquiry = await storage.updateInquiryStatus(id, status);
    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// ============ CONTACT MESSAGES ============

app.get('/api/contact', async (req, res) => {
  try {
    const messages = await storage.getAllContactMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, inspirationImages } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const messageData: NewContactMessage = {
      name,
      email,
      phone,
      subject,
      message,
      inspirationImages: inspirationImages ? JSON.stringify(inspirationImages) : null,
      status: 'unread',
    };
    
    const contactMessage = await storage.createContactMessage(messageData);
    res.status(201).json(contactMessage);
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📊 Database connected`);
});

export default app;
