const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let dbInstance = null;

function initDb() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../data.db');
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        return reject(err);
      }
      
      dbInstance = db;
      
      // Read schema file
      const schemaPath = path.join(__dirname, '01-car.sql');
      fs.readFile(schemaPath, 'utf8', (err, sql) => {
        if (err) {
          return reject(err);
        }
        
        db.exec(sql, (err) => {
          if (err) {
            return reject(err);
          }
          resolve(db);
        });
      });
    });
  });
}

function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDb first.');
  }
  return dbInstance;
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Make helper functions globally accessible to models (e.g. Car.js)
global.getDb = getDb;
global.all = all;
global.get = get;
global.run = run;

module.exports = {
  initDb,
  getDb,
  all,
  get,
  run
};
