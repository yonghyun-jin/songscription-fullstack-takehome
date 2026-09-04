'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { UploadModal } from '@/components/dashboard/UploadModal';
import { trpc } from '@/lib/trpc';

const DEMO_USER = {
  name: 'Maya Kaur',
  initials: 'MK',
  weeklyMinutes: 137,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: allSongs } = trpc.songs.list.useQuery();
  const { data: favorites } = trpc.songs.favorites.useQuery();
  const { data: recentlyPlayed } = trpc.songs.recentlyPlayed.useQuery();

  const songCounts = {
    all: allSongs?.length || 0,
    favorites: favorites?.length || 0,
    recentlyPlayed: recentlyPlayed?.length || 0,
  };

  const handleUploadSuccess = () => {
    // Invalidate queries to refresh data
    utils.songs.list.invalidate();
    utils.songs.recentlyPlayed.invalidate();
    utils.songs.getContinuePlaying.invalidate();
    utils.songs.favorites.invalidate();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar
        user={DEMO_USER}
        onUpload={() => setIsUploadOpen(true)}
        songCounts={songCounts}
      />

      <main className="ml-64 p-8">
        {children}
      </main>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
