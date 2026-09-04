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
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0),
          linear-gradient(180deg, #f0f7fb 0%, #e4eff5 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
      }}
    >
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
