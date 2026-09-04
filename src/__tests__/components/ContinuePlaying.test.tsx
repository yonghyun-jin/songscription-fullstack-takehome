import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContinuePlaying } from '@/components/dashboard/ContinuePlaying';
import type { Song } from '@/db/schema';

describe('ContinuePlaying', () => {
  const mockSong: Song = {
    id: 'test-1',
    title: 'Für Elise',
    artist: 'Beethoven',
    filePath: '/samples/fur-elise.mid',
    fileName: 'fur-elise.mid',
    youtubeId: 'q9bU12gXUyM',
    difficulty: 'intermediate',
    bpm: 72,
    durationSeconds: 204,
    progressPercent: 45,
    practiceMinutes: 47,
    isFavorite: true,
    lastPracticedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: new Date().toISOString(),
  };

  it('renders song title and artist', () => {
    render(<ContinuePlaying song={mockSong} />);
    expect(screen.getByText('Für Elise')).toBeInTheDocument();
    // Artist is part of the info line with BPM and duration
    expect(screen.getByText(/Beethoven/)).toBeInTheDocument();
  });

  it('displays section header', () => {
    render(<ContinuePlaying song={mockSong} />);
    expect(screen.getByText('Continue Playing')).toBeInTheDocument();
  });

  it('shows BPM in info line', () => {
    render(<ContinuePlaying song={mockSong} />);
    expect(screen.getByText(/72 BPM/)).toBeInTheDocument();
  });

  it('shows progress percentage in description', () => {
    render(<ContinuePlaying song={mockSong} />);
    expect(screen.getByText(/45%.*of the way through/)).toBeInTheDocument();
  });

  it('shows last practiced time', () => {
    render(<ContinuePlaying song={mockSong} />);
    expect(screen.getAllByText(/2 hour/).length).toBeGreaterThanOrEqual(1);
  });

  it('calls onContinue when button clicked', () => {
    const onContinue = vi.fn();
    render(<ContinuePlaying song={mockSong} onContinue={onContinue} />);
    fireEvent.click(screen.getByRole('button', { name: /Continue practicing/ }));
    expect(onContinue).toHaveBeenCalled();
  });

  it('displays duration in formatted time', () => {
    render(<ContinuePlaying song={mockSong} />);
    expect(screen.getByText(/3:24/)).toBeInTheDocument();
  });
});
