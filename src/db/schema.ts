import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const songs = sqliteTable('songs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist'),
  filePath: text('file_path').notNull(),
  fileName: text('file_name').notNull(),
  youtubeId: text('youtube_id'), // YouTube video ID for audio preview
  bpm: integer('bpm'),
  durationSeconds: integer('duration_seconds'),
  difficulty: text('difficulty'), // 'beginner' | 'intermediate' | 'advanced'
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  lastPracticedAt: text('last_practiced_at'),
  progressPercent: integer('progress_percent').default(0),
  practiceMinutes: integer('practice_minutes').default(0),
  createdAt: text('created_at'),
});

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
