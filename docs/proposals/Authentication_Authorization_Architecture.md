# Authentication & Authorization Architecture
## Emily Bakes Cakes - Security & Access Control System

---

## 📋 EXECUTIVE SUMMARY

**Project:** Comprehensive Authentication & Authorization System  
**Version:** 1.0  
**Security Level:** Enterprise-Grade  
**Prepared For:** CIS 3343 Fall 2025  
**Date:** November 2025

### **Security Philosophy**

**Zero Trust Architecture:** Every request must be authenticated and authorized, regardless of source.

**Defense in Depth:** Multiple layers of security (authentication → authorization → input validation → audit logging).

**Principle of Least Privilege:** Users only get permissions necessary for their role.

---

## 🔐 AUTHENTICATION SYSTEM

### **Strategy: JWT (JSON Web Tokens)**

**Why JWT?**
- ✅ Stateless (no server-side session storage)
- ✅ Scalable across multiple servers
- ✅ Built-in expiration
- ✅ Can include user metadata
- ✅ Industry standard

### **JWT Structure**

\`\`\`
HEADER.PAYLOAD.SIGNATURE

{                                    {                           HMACSHA256(
  "alg": "HS256",                     "userId": 2,                base64UrlEncode(header) + "." +
  "typ": "JWT"                        "email": "james@...",       base64UrlEncode(payload),
}                                     "role": "manager",          secret
                                      "permissions": [...],     )
                                      "iat": 1699564800,
                                      "exp": 1699651200
                                    }
\`\`\`

### **Token Generation**

\`\`\`typescript
// server/auth/jwt.ts

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '24h';

interface JWTPayload {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export function generateAccessToken(user: {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    permissions: getPermissionsByRole(user.role)
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'emily-bakes-cakes',
    audience: 'emily-bakes-api'
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'emily-bakes-cakes',
      audience: 'emily-bakes-api'
    }) as JWTPayload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}
\`\`\`

### **Refresh Token Strategy**

**Problem:** Access tokens expire after 24 hours, forcing re-login.

**Solution:** Refresh tokens with longer expiration (7 days) stored securely.

\`\`\`typescript
// shared/schema.ts

export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  token: varchar('token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  revokedAt: timestamp('revoked_at')
});
\`\`\`

\`\`\`typescript
// server/auth/refreshToken.ts

import { randomBytes } from 'crypto';

export function generateRefreshToken(): string {
  return randomBytes(64).toString('hex');
}

export async function createRefreshToken(employeeId: number): Promise<string> {
  const token = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await db.insert(refreshTokens).values({
    employeeId,
    token,
    expiresAt
  });
  
  return token;
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const [tokenRecord] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken))
    .limit(1);
  
  if (!tokenRecord || tokenRecord.revokedAt) {
    return null;
  }
  
  if (new Date() > tokenRecord.expiresAt) {
    return null;
  }
  
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, tokenRecord.employeeId))
    .limit(1);
  
  return generateAccessToken(employee);
}
\`\`\`

---

## 🔑 PASSWORD SECURITY

### **Hashing Strategy: bcrypt**

\`\`\`typescript
// server/auth/password.ts

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Password strength validation
export function validatePasswordStrength(password: string): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
\`\`\`

---

## 🛡️ AUTHORIZATION SYSTEM

### **Role-Based Access Control (RBAC)**

#### **Role Hierarchy**

\`\`\`
Owner (Emily)
    ↓
Manager (James)
    ↓
├─────────┬──────────┬──────────┐
Sales    Baker    Decorator   Accountant
\`\`\`

#### **Permission Matrix**

\`\`\`typescript
// server/auth/permissions.ts

export const PERMISSIONS = {
  // Customers
  'customers:read': 'View customer information',
  'customers:create': 'Create new customers',
  'customers:update': 'Edit customer details',
  'customers:delete': 'Delete customers',
  
  // Orders
  'orders:read': 'View orders',
  'orders:create': 'Create new orders',
  'orders:update': 'Edit order details',
  'orders:update_status': 'Change order status',
  'orders:delete': 'Delete orders',
  'orders:cancel': 'Cancel orders',
  'orders:approve': 'Approve completed orders',
  
  // Products
  'products:read': 'View products',
  'products:create': 'Create products',
  'products:update': 'Edit products',
  'products:delete': 'Delete products',
  
  // Options
  'options:read': 'View product options',
  'options:manage': 'Manage product options',
  
  // Employees
  'employees:read': 'View employees',
  'employees:manage': 'Manage employees',
  
  // Payments
  'payments:read': 'View payment records',
  'payments:create': 'Record payments',
  'payments:refund': 'Process refunds',
  
  // Reports
  'reports:financial': 'View financial reports',
  'reports:operational': 'View operational reports',
  'reports:export': 'Export report data',
  
  // Settings
  'settings:read': 'View system settings',
  'settings:manage': 'Change system settings',
  'rules:manage': 'Manage business rules',
  
  // System
  'audit:read': 'View audit logs',
  'system:admin': 'Full system administration'
};

export const rolePermissions: Record<string, string[]> = {
  owner: [
    'customers:read', 'customers:create', 'customers:update', 'customers:delete',
    'orders:read', 'orders:create', 'orders:update', 'orders:update_status',
    'orders:delete', 'orders:cancel', 'orders:approve',
    'products:read', 'products:create', 'products:update', 'products:delete',
    'options:read', 'options:manage',
    'employees:read', 'employees:manage',
    'payments:read', 'payments:create', 'payments:refund',
    'reports:financial', 'reports:operational', 'reports:export',
    'settings:read', 'settings:manage', 'rules:manage',
    'audit:read', 'system:admin'
  ],
  
  manager: [
    'customers:read', 'customers:create', 'customers:update', 'customers:delete',
    'orders:read', 'orders:create', 'orders:update', 'orders:update_status',
    'orders:cancel', 'orders:approve',
    'products:read', 'products:update',
    'options:read', 'options:manage',
    'employees:read', 'employees:manage',
    'payments:read', 'payments:create',
    'reports:financial', 'reports:operational', 'reports:export',
    'settings:read', 'rules:manage'
  ],
  
  sales: [
    'customers:read', 'customers:create', 'customers:update',
    'orders:read', 'orders:create',
    'products:read', 'options:read',
    'payments:read', 'payments:create'
  ],
  
  baker: [
    'orders:read', 'orders:update_status',
    'products:read', 'options:read'
  ],
  
  decorator: [
    'orders:read', 'orders:update_status',
    'customers:read', // for clarifications
    'products:read', 'options:read'
  ],
  
  accountant: [
    'customers:read',
    'orders:read',
    'payments:read', 'payments:create', 'payments:refund',
    'reports:financial', 'reports:export'
  ]
};

export function getPermissionsByRole(role: string): string[] {
  return rolePermissions[role] || [];
}

export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  // Owner and manager have all permissions
  if (userPermissions.includes('system:admin')) {
    return true;
  }
  
  return userPermissions.includes(requiredPermission);
}
\`\`\`

---

## 🚪 AUTHENTICATION MIDDLEWARE

\`\`\`typescript
// server/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../auth/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Allow public routes
  const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/public'];
  if (publicRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }
  
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No authentication token provided' 
    });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error.message === 'Token expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({ 
      error: 'Invalid authentication token' 
    });
  }
}
\`\`\`

---

## 🔒 AUTHORIZATION MIDDLEWARE

\`\`\`typescript
// server/middleware/authorization.ts

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: `One of: ${allowedRoles.join(', ')}`,
        current: req.user.role
      });
    }
    
    next();
  };
}

export function requirePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!hasPermission(req.user.permissions, permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission,
        current: req.user.permissions
      });
    }
    
    next();
  };
}

export function requireAnyPermission(permissions: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const hasAny = permissions.some(p => hasPermission(req.user!.permissions, p));
    
    if (!hasAny) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: `One of: ${permissions.join(', ')}`
      });
    }
    
    next();
  };
}
\`\`\`

---

## 📝 USAGE EXAMPLES

### **Protected Route Examples**

\`\`\`typescript
// server/routes/orders.ts

import { authMiddleware, requireRole, requirePermission } from '../middleware';

const router = express.Router();

// Public route (no authentication)
router.get('/api/public/products', async (req, res) => {
  const products = await db.select().from(schema.products);
  res.json(products);
});

// Authenticated route (any logged-in user)
router.get('/api/orders', authMiddleware, async (req, res) => {
  const orders = await db.select().from(schema.orders);
  res.json(orders);
});

// Role-based route (only owners and managers)
router.delete('/api/orders/:id', 
  authMiddleware, 
  requireRole(['owner', 'manager']), 
  async (req, res) => {
    await db.delete(schema.orders).where(eq(schema.orders.id, req.params.id));
    res.json({ success: true });
  }
);

// Permission-based route
router.post('/api/orders/approve/:id',
  authMiddleware,
  requirePermission('orders:approve'),
  async (req, res) => {
    // Approve order logic
  }
);

// Conditional permission route
router.patch('/api/orders/:id/status',
  authMiddleware,
  async (req: AuthRequest, res) => {
    const { newStatus } = req.body;
    const orderId = parseInt(req.params.id);
    
    // Different roles can only update to specific statuses
    const allowedTransitions = {
      'sales': ['pending', 'cancelled'],
      'baker': ['preparing', 'baking_complete'],
      'decorator': ['decorating', 'awaiting_approval'],
      'manager': ['ready', 'completed'],
      'owner': ['ready', 'completed']
    };
    
    const allowed = allowedTransitions[req.user!.role] || [];
    
    if (!allowed.includes(newStatus)) {
      return res.status(403).json({
        error: `${req.user!.role} cannot set status to ${newStatus}`
      });
    }
    
    // Update order status...
  }
);
\`\`\`

---

## 🔐 SECURITY BEST PRACTICES

### **1. Password Reset Flow**

\`\`\`typescript
// server/routes/auth.ts

router.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.email, email))
    .limit(1);
  
  if (!employee) {
    // Don't reveal if email exists
    return res.json({ success: true });
  }
  
  // Generate reset token
  const resetToken = randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  await db.insert(passwordResetTokens).values({
    employeeId: employee.id,
    token: resetToken,
    expiresAt: resetExpires
  });
  
  // Send email with reset link
  await queueEmail({
    toEmail: employee.email,
    subject: 'Password Reset Request',
    bodyHtml: `
      <p>Click this link to reset your password:</p>
      <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
    `
  });
  
  res.json({ success: true });
});

router.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  // Validate password strength
  const validation = validatePasswordStrength(newPassword);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }
  
  // Find valid reset token
  const [resetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);
  
  if (!resetToken || resetToken.usedAt || new Date() > resetToken.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }
  
  // Update password
  const passwordHash = await hashPassword(newPassword);
  
  await db
    .update(employees)
    .set({ passwordHash })
    .where(eq(employees.id, resetToken.employeeId));
  
  // Mark token as used
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, resetToken.id));
  
  res.json({ success: true });
});
\`\`\`

### **2. Rate Limiting**

\`\`\`bash
npm install express-rate-limit
\`\`\`

\`\`\`typescript
// server/middleware/rateLimiting.ts

import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply to login route
app.use('/api/auth/login', loginLimiter);
\`\`\`

### **3. CORS Configuration**

\`\`\`typescript
// server/index.ts

import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

### **4. Security Headers**

\`\`\`bash
npm install helmet
\`\`\`

\`\`\`typescript
// server/index.ts

import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
\`\`\`

---

## 📊 AUDIT LOGGING

\`\`\`typescript
// server/middleware/auditLog.ts

export function auditMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Only log write operations
  if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log after response
      if (res.statusCode < 400) {
        db.insert(auditLog).values({
          tableName: extractTableName(req.path),
          recordId: extractRecordId(req.path, data),
          action: getAction(req.method),
          changes: req.body,
          performedBy: req.user?.userId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });
      }
      
      return originalSend.call(this, data);
    };
  }
  
  next();
}
\`\`\`

---

## ✅ SECURITY CHECKLIST

- [ ] JWT secret stored in environment variable
- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] Rate limiting on login endpoint
- [ ] CORS properly configured
- [ ] HTTPS enforced in production
- [ ] Security headers (Helmet)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection
- [ ] CSRF protection (for cookie-based auth)
- [ ] Audit logging for sensitive operations
- [ ] Password reset with expiring tokens
- [ ] Role-based access control
- [ ] Permission-based authorization
- [ ] Refresh token rotation
- [ ] Session timeout (24 hours)

---

**Prepared By:** Emily Bakes Cakes Development Team  
**Document Version:** 1.0  
**Security Review:** Pending  
**CIS 3343 Fall 2025**
