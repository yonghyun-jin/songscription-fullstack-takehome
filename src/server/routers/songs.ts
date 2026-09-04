import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { songs } from '@/db/schema';
import { eq, desc, isNotNull, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export const songsRouter = router({
  list: publicProcedure.query(async () => {
    return db.select().from(songs).orderBy(desc(songs.createdAt));
  }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const result = await db.select().from(songs).where(eq(songs.id, input));
      return result[0] ?? null;
    }),

  create: publicProcedure
    .input(z.object({
      title: z.string(),
      artist: z.string().optional(),
      filePath: z.string(),
      fileName: z.string(),
      bpm: z.number().optional(),
      durationSeconds: z.number().optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    }))
    .mutation(async ({ input }) => {
      const newSong = {
        id: uuid(),
        ...input,
        createdAt: new Date().toISOString(),
      };
      await db.insert(songs).values(newSong);
      return newSong;
    }),

  toggleFavorite: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const song = await db.select().from(songs).where(eq(songs.id, input));
      if (!song[0]) throw new Error('Song not found');
      const newValue = !song[0].isFavorite;
      await db.update(songs)
        .set({ isFavorite: newValue })
        .where(eq(songs.id, input));
      return { id: input, isFavorite: newValue };
    }),

  updateProgress: publicProcedure
    .input(z.object({
      id: z.string(),
      progressPercent: z.number().min(0).max(100),
      practiceMinutes: z.number().min(0),
    }))
    .mutation(async ({ input }) => {
      await db.update(songs)
        .set({
          progressPercent: input.progressPercent,
          practiceMinutes: input.practiceMinutes,
          lastPracticedAt: new Date().toISOString(),
        })
        .where(eq(songs.id, input.id));
      return input;
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.delete(songs).where(eq(songs.id, input));
      return { id: input };
    }),

  recentlyPlayed: publicProcedure.query(async () => {
    return db.select().from(songs)
      .where(isNotNull(songs.lastPracticedAt))
      .orderBy(desc(songs.lastPracticedAt))
      .limit(10);
  }),

  favorites: publicProcedure.query(async () => {
    return db.select().from(songs)
      .where(eq(songs.isFavorite, true))
      .orderBy(desc(songs.createdAt));
  }),

  getContinuePlaying: publicProcedure.query(async () => {
    // Get the most recently practiced song that isn't complete
    const result = await db.select().from(songs)
      .where(isNotNull(songs.lastPracticedAt))
      .orderBy(desc(songs.lastPracticedAt))
      .limit(1);
    return result[0] ?? null;
  }),
});
