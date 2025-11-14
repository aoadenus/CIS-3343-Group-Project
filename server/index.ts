import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import * as storage from './storage.js';
import { authenticateToken, generateToken, requireRole, type AuthRequest } from './authMiddleware.js';
import type { NewProduct, NewOrder, NewInquiry, NewContactMessage, NewPayment } from '../shared/schema.js';
import { getUncachableResendClient } from './resendClient.js';
import { generateOrderConfirmationEmail, generateOrderStatusUpdateEmail } from './emailTemplates.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ AUTHENTICATION ============

app.post('/api/auth/staff-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const employee = await storage.getEmployeeByEmail(email.toLowerCase().trim());
    
    if (!employee) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, employee.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      id: employee.id,
      email: employee.email,
      role: employee.role,
      name: employee.name,
    });

    res.json({
      token,
      user: {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        name: employee.name,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
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

// Public order tracking endpoint (no authentication required)
app.get('/api/orders/track/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token || token.trim().length === 0) {
      return res.status(400).json({ error: 'Tracking token is required' });
    }
    
    const orderData = await storage.getOrderByTrackingToken(token.trim());
    
    if (!orderData) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Transform to DTO structure
    const response = {
      id: orderData.id,
      status: orderData.status,
      trackingToken: orderData.trackingToken,
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
      },
      fulfillment: {
        eventDate: orderData.eventDate,
      },
      payment: {
        totalAmount: orderData.totalAmount,
        depositAmount: orderData.depositAmount,
        balanceDue: orderData.balanceDue,
        depositRequired: orderData.depositRequired,
        depositMet: orderData.depositMet,
        paymentStatus: orderData.paymentStatus,
      },
      metadata: {
        createdAt: orderData.createdAt,
        updatedAt: orderData.updatedAt,
      },
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: 'Failed to track order' });
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
      name, email, phone, flavor, servings, date, message, notes, inspirationImages, layers,
      // Admin-specific fields
      customerId, adminNotes, status, priority, depositAmount, paymentStatus, totalAmount, createdBy
    } = req.body;
    
    // Validate required fields (support both legacy single flavor and new layer system)
    if (!name || !email) {
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
      flavor: flavor || null,
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
    
    // Send order confirmation email (non-blocking)
    try {
      const { client, fromEmail } = await getUncachableResendClient();
      const emailTemplate = generateOrderConfirmationEmail({
        customerName: customer.name,
        orderId: order.id,
        trackingToken: order.trackingToken || '',
        orderDetails: {
          flavor: order.flavor || undefined,
          servings: order.servings || undefined,
          eventDate: order.eventDate?.toISOString(),
          layers: order.layers || undefined,
          message: order.message || undefined,
        },
        totalAmount: order.totalAmount || undefined,
        depositRequired: order.depositRequired || undefined,
      });
      
      await client.emails.send({
        from: fromEmail,
        to: customer.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      
      console.log(`✅ Order confirmation email sent to ${customer.email} for order #${order.id}`);
    } catch (emailError) {
      console.error('⚠️ Failed to send order confirmation email:', emailError);
    }
    
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
    
    // Get the order and customer info before updating
    const existingOrder = await storage.getOrderById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const customer = await storage.getCustomerById(existingOrder.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const oldStatus = existingOrder.status;
    
    const order = await storage.updateOrderStatus(id, status);
    
    // Send status update email (non-blocking)
    try {
      const { client, fromEmail } = await getUncachableResendClient();
      const emailTemplate = generateOrderStatusUpdateEmail({
        customerName: customer.name,
        orderId: order.id,
        trackingToken: order.trackingToken || '',
        oldStatus: oldStatus,
        newStatus: status,
        eventDate: order.eventDate?.toISOString(),
      });
      
      await client.emails.send({
        from: fromEmail,
        to: customer.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      
      console.log(`✅ Order status update email sent to ${customer.email} for order #${order.id} (${oldStatus} → ${status})`);
    } catch (emailError) {
      console.error('⚠️ Failed to send order status update email:', emailError);
    }
    
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

// ============ EMPLOYEES ============

app.get('/api/employees', authenticateToken, requireRole('manager', 'owner'), async (req: AuthRequest, res) => {
  try {
    const employees = await storage.getAllEmployeesIncludingInactive();
    const employeesWithoutPasswords = employees.map(({ passwordHash, ...employee }) => employee);
    res.json(employeesWithoutPasswords);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/api/employees/search', authenticateToken, requireRole('manager', 'owner'), async (req: AuthRequest, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const employees = await storage.searchEmployees(query.trim());
    const employeesWithoutPasswords = employees.map(({ passwordHash, ...employee }) => employee);
    res.json(employeesWithoutPasswords);
  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500).json({ error: 'Failed to search employees' });
  }
});

app.post('/api/employees', authenticateToken, requireRole('manager', 'owner'), async (req: AuthRequest, res) => {
  try {
    const { name, email, role, password } = req.body;
    
    if (!name || !email || !role || !password) {
      return res.status(400).json({ error: 'Name, email, role, and password are required' });
    }
    
    const validRoles = ['sales', 'baker', 'decorator', 'accountant', 'manager', 'owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const existing = await storage.getEmployeeByEmailIncludingInactive(email);
    if (existing) {
      return res.status(409).json({ error: 'Employee with this email already exists' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const employee = await storage.createEmployee({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      isActive: true,
    });
    
    const { passwordHash: _, ...employeeWithoutPassword } = employee;
    res.status(201).json(employeeWithoutPassword);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

app.patch('/api/employees/:id', authenticateToken, requireRole('manager', 'owner'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, role, password } = req.body;
    
    const existing = await storage.getEmployeeByIdIncludingInactive(id);
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const updates: any = {};
    
    if (name) updates.name = name;
    if (email && email !== existing.email) {
      const emailExists = await storage.getEmployeeByEmailIncludingInactive(email);
      if (emailExists && emailExists.id !== id) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.email = email.toLowerCase().trim();
    }
    if (role) {
      const validRoles = ['sales', 'baker', 'decorator', 'accountant', 'manager', 'owner'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      updates.role = role;
    }
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      updates.passwordHash = await bcrypt.hash(password, 10);
    }
    
    const updated = await storage.updateEmployee(id, updates);
    const { passwordHash: _, ...employeeWithoutPassword } = updated;
    res.json(employeeWithoutPassword);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

app.patch('/api/employees/:id/status', authenticateToken, requireRole('manager', 'owner'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const employee = await storage.toggleEmployeeStatus(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const { passwordHash: _, ...employeeWithoutPassword } = employee;
    res.json(employeeWithoutPassword);
  } catch (error) {
    console.error('Error toggling employee status:', error);
    res.status(500).json({ error: 'Failed to toggle employee status' });
  }
});

// ============ REPORTS ============

// Customer List Report
app.get('/api/reports/customer-list', async (req, res) => {
  try {
    const { minSpending, maxSpending, customerType } = req.query;
    
    // Get customers with order statistics
    const customersData = await storage.getCustomersForReport(
      minSpending ? Number(minSpending) : undefined,
      maxSpending ? Number(maxSpending) : undefined,
      customerType as string | undefined
    );
    
    // Group customers by date for acquisition trend (by month)
    const acquisitionByMonth: Record<string, number> = {};
    customersData.forEach(customer => {
      const month = customer.createdAt.toISOString().slice(0, 7); // YYYY-MM
      acquisitionByMonth[month] = (acquisitionByMonth[month] || 0) + 1;
    });
    
    // Convert to array format for Recharts and sort chronologically
    const chartData = Object.entries(acquisitionByMonth).map(([month, count]) => ({
      month,
      count
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    // Calculate totals
    const totalCustomers = customersData.length;
    const totalRevenue = customersData.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const totalOrders = customersData.reduce((sum, customer) => sum + customer.orderCount, 0);
    
    res.json({
      chartData,
      customers: customersData.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        type: c.customerType.charAt(0).toUpperCase() + c.customerType.slice(1), // Capitalize for display
        orderCount: c.orderCount,
        totalSpent: c.totalSpent,
        createdAt: c.createdAt
      })),
      totals: {
        customers: totalCustomers,
        revenue: totalRevenue,
        orders: totalOrders
      }
    });
  } catch (error) {
    console.error('Error generating customer list report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Revenue Report (TIER 3 - Report 3)
// Accountant, Manager ONLY - Financial analytics with invoiced revenue, deposits, outstanding
app.get('/api/reports/revenue', authenticateToken, requireRole('accountant', 'manager', 'owner'), async (req: AuthRequest, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    
    // Calculate date range based on period
    let start: Date, end: Date;
    const now = new Date();
    
    if (period === 'day') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else if (period === 'week') {
      const dayOfWeek = now.getDay();
      start = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
      end.setHours(23, 59, 59);
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else {
      // Custom date range
      end = endDate ? new Date(endDate as string) : now;
      start = startDate ? new Date(startDate as string) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Get revenue data (excludes cancelled & refunded orders per architect guidance)
    const revenueOrders = await storage.getRevenueData(start, end);
    
    // Calculate KPIs
    let totalRevenue = 0;
    let totalDeposits = 0;
    let totalOutstanding = 0;
    const revenueByType: Record<string, number> = {};
    
    revenueOrders.forEach(order => {
      const revenue = order.totalAmount || 0;
      const deposit = order.depositAmount || 0;
      const outstanding = order.balanceDue ?? (revenue - deposit); // Use balanceDue, fallback to calculation
      
      totalRevenue += revenue;
      totalDeposits += deposit;
      totalOutstanding += outstanding;
      
      // Aggregate by order type for pie chart
      const type = order.orderType || 'other';
      revenueByType[type] = (revenueByType[type] || 0) + revenue;
    });
    
    const collectionRate = totalRevenue > 0 ? (totalDeposits / totalRevenue) * 100 : 0;
    
    // Determine bucket size for trend chart (per architect guidance)
    const rangeDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    let bucketFormat: string;
    if (rangeDays <= 1) bucketFormat = 'hour'; // ≤1 day → hourly
    else if (rangeDays <= 31) bucketFormat = 'day'; // ≤31 days → daily
    else if (rangeDays <= 180) bucketFormat = 'week'; // ≤180 days → weekly
    else bucketFormat = 'month'; // >180 days → monthly
    
    // Aggregate revenue trend by bucket
    const trendData: Record<string, number> = {};
    revenueOrders.forEach(order => {
      const date = new Date(order.createdAt);
      let bucket: string;
      
      if (bucketFormat === 'hour') {
        bucket = `${date.toISOString().slice(0, 13)}:00`;
      } else if (bucketFormat === 'day') {
        bucket = date.toISOString().split('T')[0];
      } else if (bucketFormat === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        bucket = weekStart.toISOString().split('T')[0];
      } else {
        bucket = date.toISOString().slice(0, 7); // YYYY-MM
      }
      
      trendData[bucket] = (trendData[bucket] || 0) + (order.totalAmount || 0);
    });
    
    const trendChartData = Object.entries(trendData).map(([period, revenue]) => ({
      period,
      revenue
    })).sort((a, b) => a.period.localeCompare(b.period));
    
    // Pie chart: Revenue by product type
    const pieChartData = Object.entries(revenueByType).map(([type, revenue]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      revenue
    }));
    
    // Bar chart: Trailing 12 months (per architect guidance)
    const monthlyData: Record<string, number> = {};
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    const startMonth = new Date(endMonth);
    startMonth.setMonth(endMonth.getMonth() - 11); // 12 months including current
    
    // Get data for trailing 12 months
    const monthlyOrders = await storage.getRevenueData(startMonth, end);
    monthlyOrders.forEach(order => {
      const month = new Date(order.createdAt).toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + (order.totalAmount || 0);
    });
    
    const barChartData = Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    res.json({
      kpis: {
        totalRevenue,
        totalDeposits,
        totalOutstanding,
        collectionRate: Math.round(collectionRate * 10) / 10 // Round to 1 decimal
      },
      trendChart: {
        data: trendChartData,
        bucketFormat
      },
      pieChart: pieChartData,
      barChart: barChartData,
      metadata: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        period: period || 'custom',
        orderCount: revenueOrders.length
      }
    });
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Dashboard Report - Pre-validated metrics for Reports.tsx
app.get('/api/reports/dashboard', authenticateToken, requireRole('accountant', 'manager', 'owner'), async (req: AuthRequest, res) => {
  try {
    const [allOrders, allCustomers] = await Promise.all([
      storage.getAllOrdersWithCustomers(),
      storage.getAllCustomers()
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const validOrders = allOrders.filter(order => order.status !== 'cancelled');
    const recentOrders = validOrders.filter(order => new Date(order.createdAt) >= sixMonthsAgo);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenueMapCents: Record<string, number> = {};
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = monthNames[date.getMonth()];
      monthlyRevenueMapCents[monthKey] = 0;
    }

    recentOrders.forEach(order => {
      if (order.totalAmount) {
        const orderDate = new Date(order.createdAt);
        const monthKey = monthNames[orderDate.getMonth()];
        if (monthKey in monthlyRevenueMapCents) {
          monthlyRevenueMapCents[monthKey] += order.totalAmount;
        }
      }
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMapCents).map(([month, revenueCents]) => ({
      month,
      revenue: parseFloat((revenueCents / 100).toFixed(2))
    }));

    const cakeCounts: Record<string, number> = {};
    recentOrders.forEach(order => {
      const cakeName = order.flavor || 'Custom Order';
      cakeCounts[cakeName] = (cakeCounts[cakeName] || 0) + 1;
    });

    const topSellingCakes = Object.entries(cakeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Mutually exclusive cohorts that cover ALL customers
    const vipCustomers = allCustomers.filter(c => c.isVip);
    const returningNotVIP = allCustomers.filter(c => !c.isVip && c.totalOrders > 1);
    const newNotVIP = allCustomers.filter(c => !c.isVip && c.totalOrders <= 1);

    const total = allCustomers.length;
    const customerDistribution = {
      new: total > 0 ? Math.round((newNotVIP.length / total) * 100) : 0,
      returning: total > 0 ? Math.round((returningNotVIP.length / total) * 100) : 0,
      vip: total > 0 ? Math.round((vipCustomers.length / total) * 100) : 0,
    };

    const completedOrders = validOrders.filter(o => 
      o.status === 'completed' && 
      o.createdAt && 
      o.updatedAt &&
      new Date(o.updatedAt) > new Date(o.createdAt)
    );

    const dayOfWeekHours: Record<string, { total: number; count: number }> = {
      'Mon': { total: 0, count: 0 },
      'Tue': { total: 0, count: 0 },
      'Wed': { total: 0, count: 0 },
      'Thu': { total: 0, count: 0 },
      'Fri': { total: 0, count: 0 },
      'Sat': { total: 0, count: 0 },
      'Sun': { total: 0, count: 0 },
    };

    completedOrders.forEach(order => {
      const created = new Date(order.createdAt);
      const completed = new Date(order.updatedAt);
      const hours = (completed.getTime() - created.getTime()) / (1000 * 60 * 60);
      
      if (hours > 0 && hours < 720) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayKey = dayNames[created.getDay()];
        
        if (dayKey in dayOfWeekHours) {
          dayOfWeekHours[dayKey].total += hours;
          dayOfWeekHours[dayKey].count += 1;
        }
      }
    });

    const completionTimeByDay = Object.entries(dayOfWeekHours).map(([day, data]) => ({
      day,
      avgHours: data.count > 0 ? Math.round(data.total / data.count) : 0
    }));

    const totalRevenueInCents = recentOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = recentOrders.length;

    res.json({
      monthlyRevenue,
      topSellingCakes,
      customerDistribution,
      completionTimeByDay,
      kpis: {
        totalRevenue: parseFloat((totalRevenueInCents / 100).toFixed(2)),
        totalOrders,
        avgOrderValue: totalOrders > 0 
          ? parseFloat((totalRevenueInCents / totalOrders / 100).toFixed(2))
          : 0
      }
    });
  } catch (error) {
    console.error('Error generating dashboard report:', error);
    res.status(500).json({ error: 'Failed to generate dashboard report' });
  }
});

// Order Summary Report
app.get('/api/reports/order-summary', async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    // Default to last 30 days if no date range provided
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate ? new Date(startDate as string) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get all orders with customers in date range
    const ordersData = await storage.getOrdersForReport(start, end, status as string | undefined);
    
    // Group orders by day for bar chart
    const ordersByDay: Record<string, number> = {};
    ordersData.forEach(order => {
      const day = order.createdAt.toISOString().split('T')[0];
      ordersByDay[day] = (ordersByDay[day] || 0) + 1;
    });
    
    // Convert to array format for Recharts
    const chartData = Object.entries(ordersByDay).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate totals
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    res.json({
      chartData,
      orders: ordersData,
      totals: {
        count: totalOrders,
        revenue: totalRevenue
      }
    });
  } catch (error) {
    console.error('Error generating order summary report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
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
