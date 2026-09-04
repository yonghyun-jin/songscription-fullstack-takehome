'use client';

import { trpc } from '@/lib/trpc';
import { SongCard } from '@/components/dashboard/SongCard';

export default function RecentlyPlayedPage() {
  const { data: songs, isLoading } = trpc.songs.recentlyPlayed.useQuery();
  const utils = trpc.useUtils();

  const toggleFavorite = trpc.songs.toggleFavorite.useMutation({
    onSuccess: () => {
      utils.songs.recentlyPlayed.invalidate();
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
      <h1 className="text-2xl font-bold text-white mb-6">Recently Played</h1>

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
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-medium text-white">No recent songs</h2>
          <p className="text-zinc-500 mt-2">Start practicing to see your history here</p>
        </div>
      )}
    </div>
  );
}
