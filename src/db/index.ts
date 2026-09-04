import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

const dbPath = path.join(process.cwd(), 'songscription.db');
const sqlite = new Database(dbPath);

// Create table if not exists
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    youtube_id TEXT,
    bpm INTEGER,
    duration_seconds INTEGER,
    difficulty TEXT,
    tags TEXT,
    is_favorite INTEGER DEFAULT 0,
    last_practiced_at TEXT,
    progress_percent INTEGER DEFAULT 0,
    practice_minutes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export const db = drizzle(sqlite, { schema });
