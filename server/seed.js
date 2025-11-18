const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dbPath = path.join(__dirname, 'emily.db');
const initSql = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf8');

// remove existing DB for a fresh seed (safe in local dev)
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const Database = require('better-sqlite3');
const db = new Database(dbPath);

db.exec(initSql);

const bcrypt = require('bcryptjs');
const insertUser = db.prepare('INSERT INTO users (email, password_hash, role, full_name) VALUES (?, ?, ?, ?)');
const insertProduct = db.prepare('INSERT INTO products (name, price_cents, description) VALUES (?, ?, ?)');
const insertCustomer = db.prepare('INSERT INTO customers (full_name, email, phone, preferred) VALUES (?, ?, ?, ?)');

const pw = bcrypt.hashSync('test', 8);
insertUser.run('emily@emilybakescakes.com', pw, 'Owner', 'Emily Bakes');
insertUser.run('james@emilybakescakes.com', pw, 'Manager', 'James Baker');

// sample products
insertProduct.run('Classic Vanilla Cake', 3000, '8-inch two-layer vanilla cake');
insertProduct.run('Chocolate Fudge Cake', 3500, 'Rich chocolate cake with fudge frosting');

// sample customers
insertCustomer.run('Alice Example', 'alice@example.com', '555-0101', 1);
insertCustomer.run('Bob Sample', 'bob@example.com', '555-0102', 0);

console.log('Seed complete. DB created at', dbPath);
