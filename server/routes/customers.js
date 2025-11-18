const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db');

router.get('/', (req, res) => {
  const rows = all('SELECT * FROM customers ORDER BY full_name LIMIT 200');
  res.json({ data: rows });
});

router.post('/', (req, res) => {
  const { full_name, email, phone, preferred } = req.body || {};
  if (!full_name) return res.status(400).json({ error: 'Missing full_name' });
  const info = run('INSERT INTO customers (full_name, email, phone, preferred) VALUES (?, ?, ?, ?)', [full_name, email || null, phone || null, preferred ? 1 : 0]);
  const created = get('SELECT * FROM customers WHERE id = ?', [info.lastInsertRowid]);
  res.json({ data: created });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  run('DELETE FROM customers WHERE id = ?', [id]);
  res.json({ success: true });
});

module.exports = router;
