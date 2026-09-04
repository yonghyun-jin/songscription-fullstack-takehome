'use client';

import type { Song } from '@/db/schema';
import { SongCard } from './SongCard';

interface SongRowProps {
  title: string;
  songs: Song[];
  onSongClick?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

export function SongRow({
  title,
  songs,
  onSongClick,
  onFavorite,
}: SongRowProps) {
  if (songs.length === 0) return null;

  return (
    <div className="mb-8 relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h2>

      <div className="flex gap-4">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onClick={onSongClick}
            onFavorite={onFavorite}
          />
        ))}
      </div>
    </div>
  );
}
