import express from 'express';
import session from 'express-session';
import SQLiteStoreFactory from 'connect-sqlite3';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const app = express();
const db = new Database(path.join(__dirname, '../auth.db'));
const SQLiteStore = SQLiteStoreFactory(session);
const SALT_ROUNDS = 12;

// User table for secure account storage.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.db', dir: path.join(__dirname, '..') }),
    secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(express.static(rootDir));

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
  if (existing) return res.status(409).json({ error: 'Username or email is already in use.' });

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username, email, hash);

  return res.status(201).json({ message: 'Account created successfully.' });
});

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  if (!identifier || !password) return res.status(400).json({ error: 'All fields are required.' });
  const user = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(identifier, identifier);
  if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials.' });

  req.session.user = { id: user.id, username: user.username, email: user.email };

  if (rememberMe) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
  }

  return res.json({ user: req.session.user });
});

app.get('/api/auth/session', (req, res) => {
  if (!req.session.user) return res.json({ user: null });
  return res.json({ user: req.session.user });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed.' });
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out.' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
