# Emily Bakes Cakes: Security and Compliance Checklist

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Compliance Level:** WCAG 2.1 AA, OWASP Top 10

---

## Authentication and Authorization

### Password Security **note - clarity**
- [ ] Passwords hashed with bcrypt (min 10 rounds)
- [ ] No plain-text passwords in logs or database
- [ ] Minimum 8 characters required
- [ ] Enforce complexity: uppercase, lowercase, number, symbol
- [ ] Password reset links expire after 1 hour
- [ ] Prevent password reuse (last 5 passwords)

### JWT Token Management **note - clarity**
- [ ] Access token expires in 15 minutes
- [ ] Refresh token expires in 7 days
- [ ] Tokens stored in secure httpOnly cookies (not localStorage)
- [ ] Token revocation on logout
- [ ] Refresh token rotation on use

### Role-Based Access Control (RBAC) **note - clarity, are we adding accountant page??????**
- [ ] Staff role: create/view own orders
- [ ] Manager role: view all, create reports, manage staff
- [ ] Permissions checked on backend (not just frontend)
- [ ] Audit log all role changes

---

## Data Protection

### Encryption
- [ ] HTTPS enforced (SSL/TLS 1.3+)
- [ ] Sensitive data encrypted at rest (AES-256)
- [ ] API keys never in version control (.env files)
- [ ] Environment variables for all secrets

### Data Minimization **note - clarity**
- [ ] Only collect necessary customer data
- [ ] Payment info handled by Stripe (PCI compliance)
- [ ] No credit card storage
- [ ] Minimal PII logging

### Data Retention **note - we dont need this its a prototype**
- [ ] Customer data kept for 7 years (business requirement)
- [ ] Logs retained for 90 days
- [ ] Deleted data purged from backups after 30 days
- [ ] Deletion timestamps recorded

---

## Input Validation

### Form Validation (Frontend)
- [ ] All inputs validated before submission
- [ ] Email format validation
- [ ] Phone number format
- [ ] Date range validation (pickup 2+ days advance)
- [ ] Numeric validation for prices
- [ ] String length limits enforced

### API Validation (Backend)
- [ ] All inputs re-validated server-side
- [ ] Type checking on every endpoint
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize outputs)

\`\`\`javascript
// Example: SQL injection prevention
// ❌ VULNERABLE
const query = `SELECT * FROM orders WHERE customer_id = ${customerId}`;

// ✅ SAFE
const query = 'SELECT * FROM orders WHERE customer_id = ?';
db.query(query, [customerId]);
\`\`\`

### File Upload Security
- [ ] File type validation (magic bytes, not extension)
- [ ] File size limit: 5MB max
- [ ] Virus scan on upload (optional: ClamAV)
- [ ] Store in private bucket (not public)
- [ ] Unique filename with timestamp
- [ ] No executable files (.exe, .sh, .bat)

\`\`\`javascript
// Example: File validation
const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedMimes.includes(file.type)) {
  throw new Error('Invalid file type');
}

if (file.size > 5 * 1024 * 1024) {
  throw new Error('File too large');
}
\`\`\`

---

## API Security

### Rate Limiting **note - clarity**
- [ ] Login endpoint: 5 requests per 15 minutes
- [ ] API endpoints: 100 requests per 15 minutes
- [ ] File upload: 10 requests per hour
- [ ] Return 429 Too Many Requests

### CORS Configuration
\`\`\`javascript
// Express example
app.use(cors({
  origin: ['https://emilybakes.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

### Headers Security
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security (HSTS)
- [ ] Content-Security-Policy defined

---

## Database Security

### Access Control
- [ ] Database credentials in environment variables
- [ ] Least privilege principle (separate read/write users)
- [ ] No database password in connection strings
- [ ] Encrypted database connections (SSL)

### Backup and Recovery
- [ ] Automated daily backups
- [ ] Backups encrypted
- [ ] Test restore quarterly
- [ ] Backup retention: 30 days minimum
- [ ] Disaster recovery plan documented

### SQL Injection Prevention
- [ ] All queries use prepared statements
- [ ] No string concatenation in queries
- [ ] Input validation before database operations

---

## Logging and Monitoring

### Audit Logging
- [ ] All orders logged (create, update, delete)
- [ ] Staff actions logged (user, timestamp, action)
- [ ] Failed login attempts logged
- [ ] Status changes logged with reason

\`\`\`javascript
// Example: Audit log entry
{
  timestamp: '2025-11-05T10:30:00Z',
  userId: 123,
  action: 'ORDER_STATUS_CHANGED',
  resourceId: 5001,
  oldValue: 'In Baking',
  newValue: 'Decorating',
  ipAddress: '192.168.1.1'
}
\`\`\`

### Error Logging **note - not necessary for demo**
- [ ] Errors logged to centralized system (Sentry, DataDog)
- [ ] Stack traces not exposed to users
- [ ] Sensitive data redacted from logs (passwords, tokens)
- [ ] Log retention: 90 days

### Monitoring Alerts
- [ ] Alert on failed login attempts (5+ in 15 min)
- [ ] Alert on unusual data access patterns
- [ ] Alert on API errors (500+)
- [ ] Database performance monitoring

---

## Accessibility (WCAG 2.1 AA)

### Visual Accessibility
- [ ] Color contrast ratio 4.5:1 for normal text ✅
- [ ] Large text (18pt+) contrast 3:1
- [ ] Focus indicators visible (2px outline)
- [ ] No information conveyed by color alone

### Keyboard Navigation
- [ ] All functionality accessible via keyboard
- [ ] Tab order logical (left-to-right, top-to-bottom)
- [ ] Focus trap in modals
- [ ] Escape closes modals/menus

### Screen Reader Support
- [ ] Proper heading hierarchy (H1 → H2)
- [ ] Form labels associated (htmlFor)
- [ ] ARIA landmarks (banner, main, contentinfo)
- [ ] Image alt text (descriptive, not "image")
- [ ] Status messages announced (role="status")
- [ ] Errors announced (role="alert")

### Mobile Accessibility
- [ ] Touch targets minimum 48px
- [ ] Responsive design (mobile-first)
- [ ] Text readable without zoom
- [ ] No keyboard traps

---

## Deployment Security

### Environment Configuration
\`\`\`bash
# .env.production (never commit)
DATABASE_URL=postgres://user:pass@host:5432/db
JWT_SECRET=long_random_secret_key_here
STRIPE_SECRET_KEY=sk_live_...
API_BASE_URL=https://api.emilybakes.com
LOG_LEVEL=warn
\`\`\`

### SSL/TLS Certificate
- [ ] Valid SSL certificate installed
- [ ] Certificate auto-renewal (Let's Encrypt)
- [ ] TLS 1.3+ enforced
- [ ] Weak ciphers disabled

### Server Hardening
- [ ] Firewall configured (allow only necessary ports)
- [ ] SSH key-based authentication only
- [ ] No default credentials
- [ ] Security patches applied monthly
- [ ] DDoS protection enabled (Cloudflare)

---

## Vulnerability Management **note - clarity** **note - clarity**

### Dependency Security
\`\`\`bash
# Check for vulnerable packages
npm audit
npm audit fix

# Weekly security checks
npm audit --production
\`\`\`

- [ ] Dependencies audited weekly
- [ ] Vulnerable packages patched immediately
- [ ] Major versions reviewed quarterly

### Security Testing **note - clarity**
- [ ] OWASP ZAP scanning (free, automated)
- [ ] Penetration testing (annual, professional)
- [ ] Security code review
- [ ] Dependency scanning (Snyk)

### Incident Response
- [ ] Security incident policy documented
- [ ] Escalation path defined (who to notify)
- [ ] Breach notification plan (72-hour requirement)
- [ ] Post-incident review process

---

## Compliance Checklist - **note - clarity**

### Data Protection
- [ ] GDPR compliant (if EU customers)
- [ ] CCPA compliant (if California customers)
- [ ] Privacy policy published
- [ ] Data processing agreements signed
- [ ] Right to deletion implemented

### PCI DSS (if handling payments) **note - clarity**
- [ ] Use Stripe for payment processing
- [ ] No card data stored locally
- [ ] HTTPS enforced
- [ ] Access logs maintained
- [ ] Annual compliance assessment

---

## Security Review Process - **note - clarity**

**Monthly:**
- [ ] Review audit logs for anomalies
- [ ] Check failed login attempts
- [ ] Verify backups completed

**Quarterly:**
- [ ] Dependency security audit
- [ ] Access control review
- [ ] Backup restoration test

**Annually:**
- [ ] Penetration testing
- [ ] Security assessment
- [ ] Policy updates

---

## Incident Response Plan - **note - clarity**

### Data Breach Detection
1. Identify scope (how many records, what data)
2. Contain (limit damage, secure systems)
3. Notify (customers within 72 hours)
4. Review (post-incident analysis)

### Breach Notification Template
\`\`\`
Subject: Important Security Notice

Dear Valued Customer,

We are notifying you that on [DATE], we discovered unauthorized 
access to personal information in your account. 

Details:
- Your name and email may have been accessed
- No payment information was compromised
- No passwords were affected

Steps taken:
- We have secured all systems
- Your account access has been reset
- Enhanced monitoring has been enabled

What you can do:
- Change your password immediately
- Monitor your email for suspicious activity
- Contact us at security@emilybakes.com with questions

Sincerely,
Emily Bakes Cakes Security Team
\`\`\`

---

## Testing Checklist - **note - clarity**

Before Deployment:
- [ ] OWASP ZAP scan passed
- [ ] npm audit clean
- [ ] All tests passing (unit, integration)
- [ ] Security headers verified
- [ ] CORS configured correctly
- [ ] Rate limiting tested

---

## Related Documents

- **01_SCOPE_AND_NON_GOALS.md** - Project boundaries
- **08_API_SPEC_AND_ENDPOINTS.md** - API security
- **12_QA_TEST_PLAN.md** - Testing procedures

---

**Status:** Production Ready  
**Last Updated:** November 5, 2025
