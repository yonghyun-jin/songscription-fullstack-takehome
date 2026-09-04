'use client';

import { trpc } from '@/lib/trpc';
import { ContinuePlaying } from '@/components/dashboard/ContinuePlaying';
import { SongRow } from '@/components/dashboard/SongRow';

export default function DashboardPage() {
  const { data: continueSong, isLoading: continueLoading } = trpc.songs.getContinuePlaying.useQuery();
  const { data: allSongs, isLoading: songsLoading } = trpc.songs.list.useQuery();
  const utils = trpc.useUtils();

  const toggleFavorite = trpc.songs.toggleFavorite.useMutation({
    onSuccess: () => {
      utils.songs.list.invalidate();
      utils.songs.favorites.invalidate();
      utils.songs.getContinuePlaying.invalidate();
    },
  });

  const handleSongClick = (id: string) => {
    // For demo, just log. In real app, navigate to practice page
    console.log('Opening song:', id);
  };

  const handleFavorite = (id: string) => {
    toggleFavorite.mutate(id);
  };

  const handleContinue = () => {
    if (continueSong) {
      console.log('Continuing:', continueSong.id);
    }
  };

  if (continueLoading || songsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Filter songs for different sections
  const beginnerSongs = allSongs?.filter(s => s.difficulty === 'beginner') || [];
  const classicalSongs = allSongs?.filter(s => s.artist === 'Beethoven' || s.title.includes('Classical')) || [];

  return (
    <div>
      {/* Continue Playing */}
      {continueSong && (
        <ContinuePlaying song={continueSong} onContinue={handleContinue} />
      )}

      {/* You like classical... */}
      <SongRow
        title="Because you like classical..."
        songs={classicalSongs.length >= 3 ? classicalSongs : [...(allSongs || [])].slice(0, 3)}
        onSongClick={handleSongClick}
        onFavorite={handleFavorite}
      />

      {/* Learn in an Hour */}
      <SongRow
        title="Learn in an Hour"
        songs={beginnerSongs.length >= 3 ? beginnerSongs : (allSongs || []).slice(0, 3)}
        onSongClick={handleSongClick}
        onFavorite={handleFavorite}
      />

      {/* Today's Top Pick */}
      <SongRow
        title="Popular This Week"
        songs={(allSongs || []).slice(0, 3)}
        onSongClick={handleSongClick}
        onFavorite={handleFavorite}
      />

      {/* Empty state */}
      {(!allSongs || allSongs.length === 0) && !continueSong && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-lg flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-zinc-600">
              <rect x="6" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 12h20M10 8v-2M22 8v-2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="text-xl font-medium text-white">No songs yet</h2>
          <p className="text-zinc-500 mt-2">Upload your first MIDI file to get started</p>
        </div>
      )}
    </div>
  );
}
