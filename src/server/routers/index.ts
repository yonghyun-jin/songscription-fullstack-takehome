import { router } from '../trpc';
import { songsRouter } from './songs';

export const appRouter = router({
  songs: songsRouter,
});

export type AppRouter = typeof appRouter;
