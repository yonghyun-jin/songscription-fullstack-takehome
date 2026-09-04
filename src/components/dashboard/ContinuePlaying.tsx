'use client';

import type { Song } from '@/db/schema';

interface ContinuePlayingProps {
  song: Song;
  onContinue?: () => void;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

export function ContinuePlaying({ song, onContinue }: ContinuePlayingProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Continue Playing</span>
      </div>

      <div className="flex gap-6">
        {/* Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{song.title}</h2>
          <p className="text-gray-500 mb-4">
            {song.artist || 'Unknown'} · {song.bpm} BPM · {formatDuration(song.durationSeconds)}
          </p>

          <p className="text-gray-600 mb-6">
            You&apos;re {song.progressPercent || 0}% of the way through and last played it {formatTimeAgo(song.lastPracticedAt)}
            {song.progressPercent && song.progressPercent < 100
              ? ". One focused pass on the hardest bars would move it forward."
              : ". Great progress!"}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onContinue}
              className="bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium
                         hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <PlayIcon />
              Open practice view
            </button>
            <span className="text-gray-400 text-sm">{formatTimeAgo(song.lastPracticedAt)}</span>
          </div>
        </div>

        {/* Piano roll visualization */}
        <div className="w-96 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
          <div className="h-full flex items-end justify-around px-4 pb-4">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-blue-400/70 rounded-t"
                style={{ height: `${10 + Math.random() * 80}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
