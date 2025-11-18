const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// ensure DB exists
const migrations = path.join(__dirname, 'migrations', 'init.sql');
if (!fs.existsSync(path.join(__dirname, 'emily.db'))) {
  console.log('Database not found — running seed to create DB');
  require('./seed');
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Emily local API listening on http://localhost:${PORT}`);
});
