import express from 'express';
import cors from 'cors';
import * as storage from './storage.js';
import type { NewOrder, NewInquiry, NewContactMessage } from '../shared/schema.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Create order from custom builder
app.post('/api/orders/custom', async (req, res) => {
  try {
    const { name, email, phone, occasion, flavor, design, servings, date, message, notes, inspirationImages } = req.body;
    
    // Validate required fields
    if (!name || !email || !occasion || !flavor || !design) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find or create customer
    const customer = await storage.findOrCreateCustomer({ name, email, phone });
    
    // Create order
    const orderData: NewOrder = {
      customerId: customer.id,
      orderType: 'custom',
      occasion,
      flavor,
      design,
      servings: servings ? parseInt(servings) : null,
      eventDate: date ? new Date(date) : null,
      message,
      additionalNotes: notes,
      inspirationImages: inspirationImages ? JSON.stringify(inspirationImages) : null,
      status: 'pending',
      priority: 'medium',
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
