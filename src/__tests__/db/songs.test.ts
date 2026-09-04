import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { songs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

// Create in-memory test database
const sqlite = new Database(':memory:');
const testDb = drizzle(sqlite);

// Create table
beforeAll(() => {
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
      is_favorite INTEGER DEFAULT 0,
      last_practiced_at TEXT,
      progress_percent INTEGER DEFAULT 0,
      practice_minutes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

describe('Songs DB Operations', () => {
  const mockSong = {
    id: uuid(),
    title: 'Test Song',
    artist: 'Test Artist',
    filePath: '/samples/test.mid',
    fileName: 'test.mid',
    youtubeId: 'q9bU12gXUyM',
    bpm: 120,
    durationSeconds: 180,
    difficulty: 'beginner',
    isFavorite: false,
    progressPercent: 0,
    practiceMinutes: 0,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Reset mock song id for each test
    mockSong.id = uuid();
  });

  afterEach(() => {
    // Clear data between tests
    sqlite.exec('DELETE FROM songs');
  });

  it('should insert a song', async () => {
    await testDb.insert(songs).values(mockSong);
    const result = await testDb.select().from(songs).where(eq(songs.id, mockSong.id));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Song');
  });

  it('should update favorite status', async () => {
    await testDb.insert(songs).values(mockSong);
    await testDb.update(songs).set({ isFavorite: true }).where(eq(songs.id, mockSong.id));

    const result = await testDb.select().from(songs).where(eq(songs.id, mockSong.id));
    expect(result[0].isFavorite).toBe(true);
  });

  it('should update progress', async () => {
    await testDb.insert(songs).values(mockSong);
    await testDb.update(songs)
      .set({ progressPercent: 50, practiceMinutes: 30 })
      .where(eq(songs.id, mockSong.id));

    const result = await testDb.select().from(songs).where(eq(songs.id, mockSong.id));
    expect(result[0].progressPercent).toBe(50);
    expect(result[0].practiceMinutes).toBe(30);
  });

  it('should delete a song', async () => {
    await testDb.insert(songs).values(mockSong);
    await testDb.delete(songs).where(eq(songs.id, mockSong.id));

    const result = await testDb.select().from(songs).where(eq(songs.id, mockSong.id));
    expect(result).toHaveLength(0);
  });

  it('should list all songs', async () => {
    const song1 = { ...mockSong, id: uuid() };
    const song2 = { ...mockSong, id: uuid(), title: 'Another Song' };

    await testDb.insert(songs).values([song1, song2]);

    const result = await testDb.select().from(songs);
    expect(result).toHaveLength(2);
  });

  it('should filter by difficulty', async () => {
    const beginnerSong = { ...mockSong, id: uuid(), difficulty: 'beginner' };
    const advancedSong = { ...mockSong, id: uuid(), difficulty: 'advanced', title: 'Hard Song' };

    await testDb.insert(songs).values([beginnerSong, advancedSong]);

    const result = await testDb.select().from(songs).where(eq(songs.difficulty, 'beginner'));
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Song');
  });

  it('should filter favorites', async () => {
    const favSong = { ...mockSong, id: uuid(), isFavorite: true, title: 'Favorite' };
    const normalSong = { ...mockSong, id: uuid(), isFavorite: false };

    await testDb.insert(songs).values([favSong, normalSong]);

    const result = await testDb.select().from(songs).where(eq(songs.isFavorite, true));
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Favorite');
  });
});
