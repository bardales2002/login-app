// ---------- db.js ----------
const mysql  = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,          // caboose.proxy.rlwy.net
  port: process.env.DB_PORT,          // 54665
  user: process.env.DB_USER,          // root
  password: process.env.DB_PASSWORD,  // QbsmIROdzOCYTYEugWfdTwmUwkksPUXb
  database: process.env.DB_NAME,      // railway
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {                               // ⇦ habilita TLS / SSL
    rejectUnauthorized: true
  }
});

module.exports = pool;
