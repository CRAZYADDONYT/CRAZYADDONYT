import express from 'express';
import session from 'express-session';
import SQLiteStoreFactory from 'connect-sqlite3';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const uploadsDir = path.join(rootDir, 'uploads');
fs.mkdirSync(path.join(uploadsDir, 'videos'), { recursive: true });
fs.mkdirSync(path.join(uploadsDir, 'thumbs'), { recursive: true });

const app = express();
const db = new Database(path.join(__dirname, '../app.db'));
const SQLiteStore = SQLiteStoreFactory(session);

// Core tables for videos, interactions, and comments.
db.exec(`
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  channel_name TEXT NOT NULL DEFAULT 'XXG Creator',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  duration_label TEXT DEFAULT '00:00',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

app.use(express.json());
app.use(cookieParser());
app.use(session({ store: new SQLiteStore({ db: 'sessions.db', dir: path.join(__dirname, '..') }), secret: 'xxgs-secret', resave: false, saveUninitialized: true }));
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(rootDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, file.fieldname === 'videoFile' ? path.join(uploadsDir, 'videos') : path.join(uploadsDir, 'thumbs')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});
const upload = multer({ storage });

function timeAgo(iso){
  const diffHrs = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 36e5));
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  const days = Math.floor(diffHrs/24); return `${days} days ago`;
}

app.get('/api/videos', (req, res) => {
  const { q = '', category = '' } = req.query;
  const rows = db.prepare(`SELECT * FROM videos WHERE title LIKE ? AND (? = '' OR category = ?) ORDER BY id DESC`).all(`%${q}%`, category, category);
  res.json(rows.map(r => ({ ...r, time_ago: timeAgo(r.created_at) })));
});

app.post('/api/videos/upload', upload.fields([{ name:'videoFile', maxCount:1 }, { name:'thumbnailFile', maxCount:1 }]), (req, res) => {
  const { titleInput, descriptionInput, categoryInput } = req.body;
  const video = req.files.videoFile?.[0]; const thumb = req.files.thumbnailFile?.[0];
  if (!video || !thumb) return res.status(400).json({ error:'Files missing' });
  db.prepare(`INSERT INTO videos (title, description, category, video_url, thumbnail_url, duration_label) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(titleInput, descriptionInput, categoryInput, `/uploads/videos/${video.filename}`, `/uploads/thumbs/${thumb.filename}`, '04:20');
  res.status(201).json({ ok:true });
});

app.get('/api/videos/:id', (req, res) => {
  db.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').run(req.params.id);
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(req.params.id);
  if (!video) return res.status(404).json({ error:'Not found' });
  const comments = db.prepare('SELECT * FROM comments WHERE video_id = ? ORDER BY id DESC').all(req.params.id);
  res.json({ video: { ...video, time_ago: timeAgo(video.created_at) }, comments });
});
app.post('/api/videos/:id/like', (req,res)=>{db.prepare('UPDATE videos SET likes = likes + 1 WHERE id = ?').run(req.params.id);res.json({ok:true});});
app.post('/api/videos/:id/subscribe', (req,res)=>res.json({ok:true}));
app.post('/api/videos/:id/comments', (req,res)=>{const {author='Guest',body}=req.body;db.prepare('INSERT INTO comments (video_id, author, body) VALUES (?,?,?)').run(req.params.id,author,body);res.status(201).json({ok:true});});

app.get('*', (req,res)=>res.sendFile(path.join(rootDir,'index.html')));
app.listen(3000, ()=>console.log('XXG\'s running at http://localhost:3000'));
