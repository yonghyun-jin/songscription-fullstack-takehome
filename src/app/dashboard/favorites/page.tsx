'use client';

import { trpc } from '@/lib/trpc';
import { SongCard } from '@/components/dashboard/SongCard';

export default function FavoritesPage() {
  const { data: songs, isLoading } = trpc.songs.favorites.useQuery();
  const utils = trpc.useUtils();

  const toggleFavorite = trpc.songs.toggleFavorite.useMutation({
    onSuccess: () => {
      utils.songs.favorites.invalidate();
    },
  });

  const handleSongClick = (id: string) => {
    console.log('Opening song:', id);
  };

  const handleFavorite = (id: string) => {
    toggleFavorite.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Favorites</h1>

      {songs && songs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onClick={handleSongClick}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-lg flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-zinc-600">
              <path d="M16 28l-1.8-1.6C6.4 19.4 2 15.5 2 10.5 2 6.4 5.4 3 9.5 3c2.3 0 4.5 1.1 6 2.7C17 4.1 19.2 3 21.5 3 25.6 3 29 6.4 29 10.5c0 5-4.4 8.9-12.2 15.9L16 28z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="text-xl font-medium text-white">No favorites yet</h2>
          <p className="text-zinc-500 mt-2">Click the heart on any song to add it here</p>
        </div>
      )}
    </div>
  );
}
