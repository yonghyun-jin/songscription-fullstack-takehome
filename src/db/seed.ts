import { db } from './index';
import { songs } from './schema';
import { v4 as uuid } from 'uuid';

const seedSongs = [
  {
    id: uuid(),
    title: 'Für Elise',
    artist: 'Beethoven',
    filePath: '/samples/beethoven-fur-elise.mid',
    fileName: 'beethoven-fur-elise.mid',
    youtubeId: 'q9bU12gXUyM',
    bpm: 72,
    durationSeconds: 204,
    difficulty: 'intermediate',
    tags: 'Famous classical,Romantic melody,Great for practice',
    isFavorite: true,
    lastPracticedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    progressPercent: 45,
    practiceMinutes: 47,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    title: 'C Major Scale',
    artist: 'Exercise',
    filePath: '/samples/c-major-scale.mid',
    fileName: 'c-major-scale.mid',
    youtubeId: 'edScGrfl50M',
    bpm: 60,
    durationSeconds: 45,
    difficulty: 'beginner',
    tags: 'Perfect for beginners,Finger exercise,Quick to learn',
    isFavorite: false,
    lastPracticedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    progressPercent: 100,
    practiceMinutes: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    title: 'Twinkle Twinkle Little Star',
    artist: 'Traditional',
    filePath: '/samples/twinkle-twinkle.mid',
    fileName: 'twinkle-twinkle.mid',
    youtubeId: '9bK9h12Qdvs',
    bpm: 90,
    durationSeconds: 90,
    difficulty: 'beginner',
    tags: 'Everyone knows it,Great first song,Fun melody',
    isFavorite: false,
    lastPracticedAt: null,
    progressPercent: 0,
    practiceMinutes: 0,
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(songs);

  // Insert seed data
  for (const song of seedSongs) {
    await db.insert(songs).values(song);
    console.log(`  Added: ${song.title}`);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
