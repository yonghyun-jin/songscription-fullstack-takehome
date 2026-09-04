import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongCard } from '@/components/dashboard/SongCard';
import type { Song } from '@/db/schema';

describe('SongCard', () => {
  const mockSong: Song = {
    id: 'test-1',
    title: 'Test Song',
    artist: 'Test Artist',
    filePath: '/samples/test.mid',
    fileName: 'test.mid',
    youtubeId: 'q9bU12gXUyM',
    difficulty: 'beginner',
    bpm: 120,
    durationSeconds: 180,
    progressPercent: 50,
    practiceMinutes: 25,
    isFavorite: false,
    lastPracticedAt: null,
    createdAt: new Date().toISOString(),
  };

  it('renders song title and artist when not hovered', () => {
    render(<SongCard song={mockSong} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('shows difficulty on hover', () => {
    render(<SongCard song={mockSong} />);
    const card = screen.getByText('Test Song').closest('div[class*="cursor-pointer"]')!;
    fireEvent.mouseEnter(card);
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('shows progress bar when progress exists', () => {
    render(<SongCard song={mockSong} showProgress={true} />);
    // Progress bar is a div with bg-blue-600 inside another div
    const progressContainer = document.querySelector('.bg-blue-600');
    expect(progressContainer).toBeInTheDocument();
    expect(progressContainer).toHaveStyle({ width: '50%' });
  });

  it('hides progress bar when showProgress is false', () => {
    render(<SongCard song={mockSong} showProgress={false} />);
    const progressContainer = document.querySelector('.bg-blue-600');
    expect(progressContainer).not.toBeInTheDocument();
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
    // Need to hover first to see the favorite button
    const card = screen.getByText('Test Song').closest('div[class*="cursor-pointer"]')!;
    fireEvent.mouseEnter(card);
    fireEvent.click(screen.getByLabelText('Toggle favorite'));
    expect(onFavorite).toHaveBeenCalledWith('test-1');
  });

  it('shows duration on hover', () => {
    render(<SongCard song={mockSong} />);
    const card = screen.getByText('Test Song').closest('div[class*="cursor-pointer"]')!;
    fireEvent.mouseEnter(card);
    expect(screen.getByText(/Duration: 3:00/)).toBeInTheDocument();
  });

  it('shows learning time on hover', () => {
    render(<SongCard song={mockSong} />);
    const card = screen.getByText('Test Song').closest('div[class*="cursor-pointer"]')!;
    fireEvent.mouseEnter(card);
    expect(screen.getByText(/~25 min to learn/)).toBeInTheDocument();
  });

  it('shows progress percentage on hover when practiced', () => {
    render(<SongCard song={mockSong} />);
    const card = screen.getByText('Test Song').closest('div[class*="cursor-pointer"]')!;
    fireEvent.mouseEnter(card);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays Unknown when artist is null', () => {
    const songWithoutArtist = { ...mockSong, artist: null };
    render(<SongCard song={songWithoutArtist} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
