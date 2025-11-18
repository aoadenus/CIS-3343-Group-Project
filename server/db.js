const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'emily.db');
const db = new Database(dbPath);

function run(sql, params = []) {
  return db.prepare(sql).run(params);
}

function all(sql, params = []) {
  return db.prepare(sql).all(params);
}

function get(sql, params = []) {
  return db.prepare(sql).get(params);
}

module.exports = { db, run, all, get };
