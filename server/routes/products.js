const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db');

router.get('/', (req, res) => {
  const rows = all('SELECT * FROM products ORDER BY name');
  res.json({ data: rows });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = get('SELECT * FROM products WHERE id = ?', [id]);
  res.json({ data: row });
});

module.exports = router;
