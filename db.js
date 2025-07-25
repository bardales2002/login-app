// ---------- db.js ----------
const mysql = require('mysql2/promise');   // usa require, igual que server.js
require('dotenv').config();

const pool = mysql.createPool({
  host     : process.env.DB_HOST,      // caboose.proxy.rlwy.net
  port     : process.env.DB_PORT,      // 54665 (no 3306)
  user     : process.env.DB_USER,      // root
  password : process.env.DB_PASSWORD,  // tu password largo
  database : process.env.DB_NAME,      // railway
  waitForConnections : true,
  connectionLimit    : 10,

  /* 👇 ESTA es la línea clave */
  ssl : { rejectUnauthorized : false }  // acepta el certificado de Railway
});

module.exports = pool;
