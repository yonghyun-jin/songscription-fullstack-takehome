# Songscription Dashboard Implementation Plan

## Overview
Create a music learning dashboard that displays after onboarding completion. Features a Netflix/Spotify-inspired layout with song catalogues, progress tracking, and interactive hover-to-play functionality.

---

## Design References (from screenshots)

### osu! Style Inspiration
- Collection cards with difficulty distribution charts
- Song lists with BPM, duration, mapper info
- Leaderboard-style rankings
- Difficulty reduction/modification options
- Clean stat displays (Circles, Sliders, Accuracy, etc.)

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         DASHBOARD                                │
├──────────────┬──────────────────────────────────────────────────┤
│   SIDEBAR    │                  MAIN CONTENT                     │
│              │                                                   │
│ [Upload Song]│  ┌─────────────────────────────────────────────┐ │
│              │  │         CONTINUE PLAYING (Hero)              │ │
│ ┌──────────┐ │  │  Large card with progress, stats, details   │ │
│ │    MK    │ │  └─────────────────────────────────────────────┘ │
│ │Maya Kaur │ │                                                   │
│ │137min/wk │ │  ┌─────────────────────────────────────────────┐ │
│ └──────────┘ │  │      "You like classical, so..."             │ │
│              │  │  [Card] [Card] [Card] → horizontal scroll    │ │
│ ────────────│  └─────────────────────────────────────────────┘ │
│              │                                                   │
│ 🏠 Home      │  ┌─────────────────────────────────────────────┐ │
│ 🕐 Recently  │  │         "Learn in an Hour!"                  │ │
│    Played    │  │  [Card] [Card] [Card] → horizontal scroll    │ │
│ ❤️ Favorites │  └─────────────────────────────────────────────┘ │
│              │                                                   │
│              │  ┌─────────────────────────────────────────────┐ │
│              │  │       "Today's Top Pick for You"             │ │
│              │  │  [Card] [Card] [Card] → hover to play        │ │
│              │  └─────────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## Sidebar Components

### 1. Upload Song Button (Top)
```
┌─────────────────────┐
│   + Upload Song     │
└─────────────────────┘
```
- Primary CTA at the very top
- Opens file picker for MIDI uploads
- Wii-style rounded button

### 2. Profile Card
```
┌─────────────────────┐
│       ┌───┐         │
│       │MK │         │  ← Initials avatar
│       └───┘         │
│     Maya Kaur       │  ← User name
│   137 min this week │  ← Practice stats (gamification)
└─────────────────────┘
```
- Shows user initials in circle
- Name below
- Weekly practice time as engagement metric

### 3. Navigation Menu
```
🏠  Home           ← Active state
🕐  Recently Played
❤️  Favorites
```
- Vertical nav with icons
- Highlight active page
- Simple hover states

---

## Home Page Sections

### Section 1: Continue Playing (Hero)

Large featured card showing the last practiced song.

```
┌──────────────────────────────────────────────────────────────────────┐
│  🎵 CONTINUE PLAYING                                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌─────────────────┐                                                │
│   │                 │   Für Elise - Beethoven                        │
│   │   [Album Art]   │                                                │
│   │                 │   난이도: Intermediate  |  악기: Piano          │
│   └─────────────────┘   BPM: 72  |  길이: 3:24                       │
│                                                                       │
│   ───────────────────────────────────                                │
│   Progress: ████████░░░░░░░░ 45%                                     │
│                                                                       │
│   마지막 연습: 2 hours ago                                            │
│   총 연습 시간: 47 min                                                │
│   이번 세션 목표: Measures 16-32                                      │
│                                                                       │
│                                    [▶️ Continue Practice]             │
└──────────────────────────────────────────────────────────────────────┘
```

**Data displayed:**
| Korean | English | Description |
|--------|---------|-------------|
| 난이도 | Difficulty | Beginner/Intermediate/Advanced |
| 악기 | Instrument | Piano (default) |
| BPM | BPM | Beats per minute |
| 길이 | Duration | Song length |
| 마지막 연습 시간 | Last practice | Time since last session |
| 연습 진도 | Progress | Percentage completion |
| 총 연습 시간 | Total time spent | Minutes practiced |

### Section 2: "You like classical, so..." (Personalized)

Horizontal scrolling row based on user's onboarding preferences.

```
┌──────────────────────────────────────────────────────────────────────┐
│  🎼 You like classical, so...                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                           │
│  │          │  │          │  │          │                           │
│  │ Für Elise│  │ C Major  │  │ Twinkle  │  →                        │
│  │          │  │  Scale   │  │ Twinkle  │                           │
│  └──────────┘  └──────────┘  └──────────┘                           │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Section 3: "Learn in an Hour!"

Quick-win songs that can be mastered in ~60 minutes.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⏱️ Learn in an Hour!                                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                           │
│  │ Twinkle  │  │ C Major  │  │ Für Elise│  →                        │
│  │ ~45 min  │  │ ~30 min  │  │ ~60 min  │                           │
│  └──────────┘  └──────────┘  └──────────┘                           │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Section 4: "Today's Top Pick for You"

Interactive cards with hover-to-play preview.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⭐ Today's Top Pick for You                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │              │  │              │  │              │               │
│  │  Beethoven   │  │   C Major    │  │   Twinkle    │               │
│  │  Für Elise   │  │    Scale     │  │   Twinkle    │               │
│  │              │  │              │  │              │               │
│  │ 🔊 Hover to  │  │              │  │              │               │
│  │    preview   │  │              │  │              │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Hover State Overlay:**
```
┌──────────────────┐
│   ▶️ PLAYING...   │
│                  │
│ Difficulty: Easy │
│ Duration: 3:24   │
│ Learn in: ~45min │
│                  │
│ [Start Learning] │
└──────────────────┘
```

---

## Song Data Model

### Sample Songs (using public/samples/)

```typescript
interface Song {
  id: string;
  title: string;
  artist: string;
  midiFile: string;           // Path to MIDI file
  youtubeUrl: string;         // For audio preview
  thumbnailUrl: string;       // Album art / cover
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instrument: string;
  bpm: number;
  duration: string;           // "3:24" format
  expectedLearningTime: string; // "45 min" format
  tags: string[];             // ['classical', 'romantic', etc.]
}

interface UserProgress {
  songId: string;
  progress: number;           // 0-100 percentage
  totalPracticeTime: number;  // Minutes
  lastPracticed: Date;
  currentSection: string;     // "Measures 16-32"
}
```

### Demo Song Data

```typescript
const DEMO_SONGS: Song[] = [
  {
    id: 'fur-elise',
    title: 'Für Elise',
    artist: 'Beethoven',
    midiFile: '/samples/beethoven-fur-elise.mid',
    youtubeUrl: 'https://www.youtube.com/watch?v=q9bU12gXUyM',
    thumbnailUrl: '/thumbnails/fur-elise.jpg',
    difficulty: 'Intermediate',
    instrument: 'Piano',
    bpm: 72,
    duration: '3:24',
    expectedLearningTime: '2 hours',
    tags: ['classical', 'romantic', 'beethoven']
  },
  {
    id: 'c-major-scale',
    title: 'C Major Scale',
    artist: 'Exercise',
    midiFile: '/samples/c-major-scale.mid',
    youtubeUrl: 'https://www.youtube.com/watch?v=edScGrfl50M',
    thumbnailUrl: '/thumbnails/c-major.jpg',
    difficulty: 'Beginner',
    instrument: 'Piano',
    bpm: 60,
    duration: '0:45',
    expectedLearningTime: '15 min',
    tags: ['exercise', 'scales', 'beginner']
  },
  {
    id: 'twinkle-twinkle',
    title: 'Twinkle Twinkle Little Star',
    artist: 'Traditional',
    midiFile: '/samples/twinkle-twinkle.mid',
    youtubeUrl: 'https://www.youtube.com/watch?v=hCKBl-TpRzc',
    thumbnailUrl: '/thumbnails/twinkle.jpg',
    difficulty: 'Beginner',
    instrument: 'Piano',
    bpm: 90,
    duration: '1:30',
    expectedLearningTime: '30 min',
    tags: ['children', 'beginner', 'traditional']
  }
];
```

---

## Technical Implementation

### Backend Stack (Minimal Setup)

```
SQLite (file-based) + Drizzle ORM + tRPC + Vitest
```

### Dependencies

```bash
# Backend
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── trpc/[trpc]/route.ts  # tRPC API handler
│   │   └── upload/route.ts       # File upload endpoint
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard home page
│   ├── dashboard/
│   │   ├── recently-played/
│   │   │   └── page.tsx          # Recently played page
│   │   └── favorites/
│   │       └── page.tsx          # Favorites page
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx   # Main layout with sidebar
│   │   ├── Sidebar.tsx           # Sidebar navigation
│   │   ├── ProfileCard.tsx       # User profile display
│   │   ├── UploadButton.tsx      # Upload song CTA
│   │   ├── ContinuePlaying.tsx   # Hero continue section
│   │   ├── SongRow.tsx           # Horizontal scrolling row
│   │   ├── SongCard.tsx          # Individual song card
│   │   ├── HoverPreviewCard.tsx  # Card with hover-to-play
│   │   └── ProgressBar.tsx       # Progress indicator
│   └── shared/
│       └── YouTubeAudio.tsx      # YouTube audio player (hidden)
├── db/
│   ├── index.ts                  # DB connection (better-sqlite3)
│   ├── schema.ts                 # Drizzle schema
│   └── seed.ts                   # Seed demo songs
├── server/
│   ├── trpc.ts                   # tRPC init
│   └── routers/
│       ├── songs.ts              # Songs CRUD router
│       └── index.ts              # Root router
├── lib/
│   ├── trpc.ts                   # tRPC client
│   └── utils.ts                  # Shared utilities
├── hooks/
│   ├── useYouTubeAudio.ts        # YouTube audio playback
│   └── useUserProgress.ts        # Progress tracking
├── __tests__/                    # Test files
│   ├── setup.ts                  # Vitest setup
│   ├── db/
│   │   └── songs.test.ts         # DB operations tests
│   ├── server/
│   │   └── songs.router.test.ts  # tRPC router tests
│   └── components/
│       ├── SongCard.test.tsx     # Component tests
│       └── Sidebar.test.tsx
└── public/
    ├── samples/                  # Existing MIDI files
    │   ├── beethoven-fur-elise.mid
    │   ├── c-major-scale.mid
    │   └── twinkle-twinkle.mid
    ├── uploads/                  # User uploaded files
    └── thumbnails/               # Song cover images
```

---

## Database Schema

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const songs = sqliteTable('songs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist'),
  filePath: text('file_path').notNull(),
  fileName: text('file_name').notNull(),
  bpm: integer('bpm'),
  durationSeconds: integer('duration_seconds'),
  difficulty: text('difficulty'),  // 'beginner' | 'intermediate' | 'advanced'
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  lastPracticedAt: text('last_practiced_at'),
  progressPercent: integer('progress_percent').default(0),
  practiceMinutes: integer('practice_minutes').default(0),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
```

---

## tRPC Router

```typescript
// src/server/routers/songs.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { songs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

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
      id: z.string(),
      title: z.string(),
      artist: z.string().optional(),
      filePath: z.string(),
      fileName: z.string(),
      bpm: z.number().optional(),
      durationSeconds: z.number().optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    }))
    .mutation(async ({ input }) => {
      await db.insert(songs).values(input);
      return input;
    }),

  toggleFavorite: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const song = await db.select().from(songs).where(eq(songs.id, input));
      if (!song[0]) throw new Error('Song not found');
      await db.update(songs)
        .set({ isFavorite: !song[0].isFavorite })
        .where(eq(songs.id, input));
      return { id: input, isFavorite: !song[0].isFavorite };
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
      .where(sql`${songs.lastPracticedAt} IS NOT NULL`)
      .orderBy(desc(songs.lastPracticedAt))
      .limit(10);
  }),

  favorites: publicProcedure.query(async () => {
    return db.select().from(songs)
      .where(eq(songs.isFavorite, true))
      .orderBy(desc(songs.createdAt));
  }),
});
```

---

## Test Files

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/db/schema';

// In-memory test database
export const testDb = drizzle(new Database(':memory:'), { schema });

beforeAll(() => {
  // Create tables
  testDb.run(sql`
    CREATE TABLE songs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT,
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
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

afterEach(() => {
  // Clear data between tests
  testDb.delete(schema.songs);
});
```

### DB Tests

```typescript
// src/__tests__/db/songs.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { testDb } from '../setup';
import { songs } from '@/db/schema';
import { eq } from 'drizzle-orm';

describe('Songs DB Operations', () => {
  const mockSong = {
    id: 'test-song-1',
    title: 'Test Song',
    artist: 'Test Artist',
    filePath: '/samples/test.mid',
    fileName: 'test.mid',
    bpm: 120,
    difficulty: 'beginner' as const,
  };

  it('should insert a song', async () => {
    await testDb.insert(songs).values(mockSong);
    const result = await testDb.select().from(songs).where(eq(songs.id, 'test-song-1'));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Song');
  });

  it('should update favorite status', async () => {
    await testDb.insert(songs).values(mockSong);
    await testDb.update(songs).set({ isFavorite: true }).where(eq(songs.id, 'test-song-1'));

    const result = await testDb.select().from(songs).where(eq(songs.id, 'test-song-1'));
    expect(result[0].isFavorite).toBe(true);
  });

  it('should update progress', async () => {
    await testDb.insert(songs).values(mockSong);
    await testDb.update(songs)
      .set({ progressPercent: 50, practiceMinutes: 30 })
      .where(eq(songs.id, 'test-song-1'));

    const result = await testDb.select().from(songs).where(eq(songs.id, 'test-song-1'));
    expect(result[0].progressPercent).toBe(50);
    expect(result[0].practiceMinutes).toBe(30);
  });

  it('should delete a song', async () => {
    await testDb.insert(songs).values(mockSong);
    await testDb.delete(songs).where(eq(songs.id, 'test-song-1'));

    const result = await testDb.select().from(songs).where(eq(songs.id, 'test-song-1'));
    expect(result).toHaveLength(0);
  });

  it('should list all songs', async () => {
    await testDb.insert(songs).values([
      mockSong,
      { ...mockSong, id: 'test-song-2', title: 'Another Song' },
    ]);

    const result = await testDb.select().from(songs);
    expect(result).toHaveLength(2);
  });
});
```

### tRPC Router Tests

```typescript
// src/__tests__/server/songs.router.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCallerFactory } from '@trpc/server';
import { appRouter } from '@/server/routers';
import { testDb } from '../setup';
import { songs } from '@/db/schema';

// Mock the db module to use test db
vi.mock('@/db', () => ({
  db: testDb,
}));

const createCaller = createCallerFactory(appRouter);
const caller = createCaller({});

describe('Songs Router', () => {
  const mockSong = {
    id: 'router-test-1',
    title: 'Router Test Song',
    artist: 'Test Artist',
    filePath: '/samples/test.mid',
    fileName: 'test.mid',
  };

  it('should create a song', async () => {
    const result = await caller.songs.create(mockSong);
    expect(result.id).toBe('router-test-1');
  });

  it('should list songs', async () => {
    await testDb.insert(songs).values(mockSong);
    const result = await caller.songs.list();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get song by id', async () => {
    await testDb.insert(songs).values(mockSong);
    const result = await caller.songs.getById('router-test-1');
    expect(result?.title).toBe('Router Test Song');
  });

  it('should return null for non-existent song', async () => {
    const result = await caller.songs.getById('non-existent');
    expect(result).toBeNull();
  });

  it('should toggle favorite', async () => {
    await testDb.insert(songs).values(mockSong);
    const result = await caller.songs.toggleFavorite('router-test-1');
    expect(result.isFavorite).toBe(true);
  });

  it('should update progress', async () => {
    await testDb.insert(songs).values(mockSong);
    const result = await caller.songs.updateProgress({
      id: 'router-test-1',
      progressPercent: 75,
      practiceMinutes: 45,
    });
    expect(result.progressPercent).toBe(75);
  });

  it('should delete a song', async () => {
    await testDb.insert(songs).values(mockSong);
    await caller.songs.delete('router-test-1');
    const result = await caller.songs.getById('router-test-1');
    expect(result).toBeNull();
  });
});
```

### Component Tests

```typescript
// src/__tests__/components/SongCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongCard } from '@/components/dashboard/SongCard';

describe('SongCard', () => {
  const mockSong = {
    id: 'test-1',
    title: 'Test Song',
    artist: 'Test Artist',
    filePath: '/samples/test.mid',
    fileName: 'test.mid',
    difficulty: 'beginner',
    bpm: 120,
    durationSeconds: 180,
    progressPercent: 50,
  };

  it('renders song title and artist', () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('shows difficulty badge', () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('shows progress bar when progress exists', () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<SongCard song={mockSong} onClick={onClick} />);
    fireEvent.click(screen.getByText('Test Song'));
    expect(onClick).toHaveBeenCalledWith('test-1');
  });

  it('calls onFavorite when favorite button clicked', () => {
    const onFavorite = vi.fn();
    render(<SongCard song={mockSong} onFavorite={onFavorite} />);
    fireEvent.click(screen.getByLabelText('Toggle favorite'));
    expect(onFavorite).toHaveBeenCalledWith('test-1');
  });
});
```

```typescript
// src/__tests__/components/Sidebar.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '@/components/dashboard/Sidebar';

describe('Sidebar', () => {
  const mockUser = {
    name: 'Maya Kaur',
    initials: 'MK',
    weeklyMinutes: 137,
  };

  it('renders user profile', () => {
    render(<Sidebar user={mockUser} activePage="home" />);
    expect(screen.getByText('Maya Kaur')).toBeInTheDocument();
    expect(screen.getByText('MK')).toBeInTheDocument();
    expect(screen.getByText('137 min this week')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<Sidebar user={mockUser} activePage="home" />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Recently Played')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('highlights active page', () => {
    render(<Sidebar user={mockUser} activePage="favorites" />);
    const favoritesLink = screen.getByText('Favorites').closest('a');
    expect(favoritesLink).toHaveClass('active');
  });

  it('renders upload button', () => {
    render(<Sidebar user={mockUser} activePage="home" />);
    expect(screen.getByText('Upload Song')).toBeInTheDocument();
  });

  it('calls onUpload when upload button clicked', () => {
    const onUpload = vi.fn();
    render(<Sidebar user={mockUser} activePage="home" onUpload={onUpload} />);
    fireEvent.click(screen.getByText('Upload Song'));
    expect(onUpload).toHaveBeenCalled();
  });
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/db/seed.ts"
  }
}
```

### Core Components

#### 1. DashboardLayout.tsx
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: 'home' | 'recently-played' | 'favorites';
}
```
- Wraps all dashboard pages
- Contains Sidebar component
- Handles responsive layout

#### 2. Sidebar.tsx
```typescript
interface SidebarProps {
  activePage: string;
  user: {
    name: string;
    initials: string;
    weeklyMinutes: number;
  };
  onUploadClick: () => void;
}
```

#### 3. SongCard.tsx
```typescript
interface SongCardProps {
  song: Song;
  progress?: UserProgress;
  variant: 'default' | 'hover-preview' | 'hero';
  onPlay?: () => void;
  onHover?: () => void;
}
```

#### 4. HoverPreviewCard.tsx
- Extends SongCard
- Plays YouTube audio on mouse enter
- Stops on mouse leave
- Shows overlay with stats

### YouTube Audio Integration

For hover-to-play functionality:

```typescript
// useYouTubeAudio.ts
export function useYouTubeAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (youtubeUrl: string) => {
    // Option 1: Use YouTube IFrame API (muted initially)
    // Option 2: Use a service to extract audio
    // Option 3: For demo, use placeholder audio files
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return { play, stop };
}
```

**Note:** For the demo, we'll use placeholder MP3 files or the YouTube IFrame API with video hidden, since direct YouTube audio extraction isn't straightforward in the browser.

---

## Styling Guidelines

### Continue using Wii Theme from Onboarding

```css
/* Dashboard-specific additions */
.dashboard-card {
  background: var(--wii-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.song-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 16px 0;
}

.song-card {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 200px;
}

.progress-bar {
  height: 8px;
  background: var(--wii-gray);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--wii-blue);
  transition: width 0.3s ease;
}
```

---

## Implementation Order

### Phase 1: Layout & Structure
1. [ ] Create DashboardLayout component
2. [ ] Create Sidebar component
3. [ ] Create ProfileCard component
4. [ ] Create UploadButton component
5. [ ] Set up dashboard route `/dashboard`

### Phase 2: Song Data
6. [ ] Create songs.ts with demo data
7. [ ] Create thumbnail images (or use placeholders)
8. [ ] Create user-state.ts for progress tracking
9. [ ] Set up localStorage persistence

### Phase 3: Home Page Sections
10. [ ] Create ContinuePlaying hero component
11. [ ] Create SongCard component
12. [ ] Create SongRow horizontal scroller
13. [ ] Build "You like classical..." section
14. [ ] Build "Learn in an Hour!" section
15. [ ] Build "Today's Top Pick" section

### Phase 4: Interactive Features
16. [ ] Create HoverPreviewCard with audio
17. [ ] Implement YouTube audio playback
18. [ ] Add hover overlay with stats
19. [ ] Add progress animations

### Phase 5: Additional Pages
20. [ ] Create Recently Played page
21. [ ] Create Favorites page
22. [ ] Implement navigation between pages

### Phase 6: Polish
23. [ ] Add loading states
24. [ ] Add smooth transitions
25. [ ] Mobile responsive design
26. [ ] Connect onboarding → dashboard redirect

---

## Demo User Data

For the demo, pre-populate with:

```typescript
const DEMO_USER = {
  name: 'Maya Kaur',
  initials: 'MK',
  weeklyMinutes: 137,
  musicTaste: ['classical', 'romantic'],
  experience: 'intermediate'
};

const DEMO_PROGRESS: UserProgress[] = [
  {
    songId: 'fur-elise',
    progress: 45,
    totalPracticeTime: 47,
    lastPracticed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    currentSection: 'Measures 16-32'
  }
];
```

---

## Audio Preview Strategy

Since extracting audio from YouTube directly is complex, for the demo we'll:

1. **Option A: YouTube IFrame (Recommended)**
   - Embed hidden YouTube player
   - Use YouTube IFrame API to control playback
   - Mute initially, unmute on hover
   - Pros: Legal, works reliably
   - Cons: Video loads too, slight delay

2. **Option B: Placeholder Audio**
   - Use royalty-free piano samples
   - Match the feel of each song
   - Faster loading, simpler implementation

3. **Option C: MIDI Playback**
   - Use Tone.js or similar to play MIDI files
   - Authentic but requires more setup

**Recommendation:** Use Option A (YouTube IFrame) for authentic preview, with Option C (MIDI) as fallback.

---

## Success Criteria

- [ ] Sidebar shows all required elements (Upload, Profile, Nav)
- [ ] Continue Playing shows detailed progress info
- [ ] Horizontal song rows scroll smoothly
- [ ] Hover-to-play works on Top Pick cards
- [ ] All 3 demo songs display correctly
- [ ] Stats display in both English and Korean where specified
- [ ] Navigation between pages works
- [ ] Wii theme is consistent with onboarding
- [ ] User progress persists in localStorage
