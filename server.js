// ---------- server.js ----------
const express = require('express');
const session = require('express-session');
const bcrypt  = require('bcryptjs');
const pool    = require('./db');       // ← conexión definida en db.js
require('dotenv').config();

const app = express();

/* ---------- middlewares ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));     // sirve /public (HTML, CSS, JS)


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día
  })
);

/* ---------- rutas API ---------- */

// Registro
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: 'Completa los campos' });

    const [exists] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (exists.length)
      return res.status(409).json({ msg: 'Usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hash]
    );

    // Autologin
    req.session.user = { id: result.insertId, username };
    res.json({ msg: 'Registrado y autenticado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: 'Completa los campos' });

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (!rows.length)
      return res.status(401).json({ msg: 'Credenciales incorrectas' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(401).json({ msg: 'Credenciales incorrectas' });

    req.session.user = { id: rows[0].id, username };
    res.json({ msg: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Usuario autenticado
app.get('/api/me', (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ msg: 'No autenticado' });
  res.json(req.session.user);
});

// Cerrar sesión (opcional)
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ msg: 'Sesión cerrada' }));
});

/* ---------- levantar servidor ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
