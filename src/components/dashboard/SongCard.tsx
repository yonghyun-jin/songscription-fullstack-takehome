'use client';

import { useState, useRef, useEffect } from 'react';
import type { Song } from '@/db/schema';

interface SongCardProps {
  song: Song;
  variant?: 'default' | 'compact';
  onClick?: (id: string) => void;
  onFavorite?: (id: string) => void;
  showProgress?: boolean;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 2}>
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export function SongCard({
  song,
  onClick,
  onFavorite,
  showProgress = true,
}: SongCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Control YouTube playback on hover
  useEffect(() => {
    if (!song.youtubeId || !iframeRef.current) return;

    const iframe = iframeRef.current;
    if (isHovered) {
      // Seek to start and play
      iframe.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
      iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    } else {
      // Pause and reset to start
      iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      iframe.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
    }
  }, [isHovered, song.youtubeId]);

  return (
    <div
      className={`relative cursor-pointer flex-shrink-0 transition-all duration-300 flex
                  ${isHovered ? 'z-50' : 'z-10'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden YouTube player for audio preview */}
      {song.youtubeId && (
        <iframe
          ref={iframeRef}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          src={`https://www.youtube.com/embed/${song.youtubeId}?enablejsapi=1&autoplay=0&controls=0`}
          allow="autoplay"
          title="Audio preview"
        />
      )}

      {/* Main Card */}
      <div
        className={`relative transition-all duration-300 overflow-hidden border border-gray-200 bg-white
                    ${isHovered ? 'shadow-xl rounded-l-xl' : 'rounded-xl shadow-md'}`}
        style={{ width: '280px' }}
        onClick={() => onClick?.(song.id)}
      >
        {/* Thumbnail */}
        <div className="aspect-[16/10] bg-gradient-to-br from-blue-100 to-blue-200 relative">
          {/* Piano roll visualization */}
          <div className="absolute inset-0">
            <div className="h-full flex items-end justify-around px-4 pb-4">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-blue-500/70 rounded-t"
                  style={{ height: `${20 + Math.random() * 60}%` }}
                />
              ))}
            </div>
          </div>

          {/* Progress bar on thumbnail */}
          {showProgress && song.progressPercent !== null && song.progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-300">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${song.progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Title bar */}
        <div className="p-3 bg-white border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 text-base truncate">{song.title}</h3>
          <p className="text-sm text-gray-500 truncate">{song.artist || 'Unknown'}</p>
        </div>
      </div>

      {/* Hover Panel - expands horizontally to the right */}
      {isHovered && (
        <div
          className="bg-white border border-l-0 border-gray-200 rounded-r-xl shadow-xl flex flex-col justify-between self-stretch"
          style={{ width: '200px' }}
        >
          {/* Top section: Action buttons */}
          <div className="p-4 flex items-center gap-2">
            <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-md">
              <PlayIcon />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite?.(song.id); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                ${song.isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50'}`}
              aria-label="Toggle favorite"
            >
              <HeartIcon filled={song.isFavorite || false} />
            </button>
          </div>

          {/* Middle section: Info */}
          <div className="px-4 flex-1">
            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ClockIcon />
              <span>Duration: {formatDuration(song.durationSeconds)}</span>
            </div>

            {/* Expected learning time */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <BookIcon />
              <span>~{song.practiceMinutes || 0} min to learn</span>
            </div>

            {/* Tag (difficulty) */}
            {song.difficulty && (
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize
                ${song.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : ''}
                ${song.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${song.difficulty === 'advanced' ? 'bg-red-100 text-red-700' : ''}`}>
                {song.difficulty}
              </span>
            )}
          </div>

          {/* Bottom section: Progress */}
          {song.progressPercent !== null && song.progressPercent > 0 && (
            <div className="p-4 pt-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${song.progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-blue-600 font-medium">{song.progressPercent}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
