const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');

// Create order with business rules: 50% deposit recorded, one cake per order enforced
router.post('/', (req, res) => {
  const payload = req.body || {};
  const { customer_id, product_id, scheduled_for, total_cents } = payload;
  if (!customer_id || !product_id || !scheduled_for || !total_cents) return res.status(400).json({ error: 'Missing fields' });

  // enforce one cake per order — schema already supports a single product_id per order

  const deposit_required_cents = Math.round(total_cents * 0.5);

  const info = run('INSERT INTO orders (customer_id, product_id, scheduled_for, deposit_required_cents, total_cents, status) VALUES (?, ?, ?, ?, ?, ?)', [customer_id, product_id, scheduled_for, deposit_required_cents, total_cents, 'pending']);
  const created = get('SELECT * FROM orders WHERE id = ?', [info.lastInsertRowid]);

  // create payment record for deposit
  run('INSERT INTO payments (order_id, amount_cents, type, status) VALUES (?, ?, ?, ?)', [created.id, deposit_required_cents, 'deposit', 'pending']);

  // audit log
  run('INSERT INTO audit_log (event, payload) VALUES (?, ?)', ['order_created', JSON.stringify(created)]);

  res.json({ data: created });
});

router.get('/', (req, res) => {
  const rows = all('SELECT * FROM orders ORDER BY created_at DESC LIMIT 200');
  res.json({ data: rows });
});

module.exports = router;
