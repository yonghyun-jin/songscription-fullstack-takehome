import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '@/components/dashboard/Sidebar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Sidebar', () => {
  const mockUser = {
    name: 'Maya Kaur',
    initials: 'MK',
    weeklyMinutes: 137,
  };

  const mockSongCounts = {
    all: 12,
    favorites: 5,
    recentlyPlayed: 8,
  };

  it('renders user profile', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('Maya Kaur')).toBeInTheDocument();
    expect(screen.getByText('MK')).toBeInTheDocument();
    expect(screen.getByText('137 min this week')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Recently Played')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('renders upload button with correct text', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('Add transcription')).toBeInTheDocument();
  });

  it('calls onUpload when upload button clicked', () => {
    const onUpload = vi.fn();
    render(<Sidebar user={mockUser} onUpload={onUpload} />);
    fireEvent.click(screen.getByText('Add transcription'));
    expect(onUpload).toHaveBeenCalled();
  });

  it('renders Songscription logo and title', () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText('Songscription')).toBeInTheDocument();
  });

  it('displays song counts when provided', () => {
    render(<Sidebar user={mockUser} songCounts={mockSongCounts} />);
    expect(screen.getByText('12')).toBeInTheDocument(); // all songs
    expect(screen.getByText('5')).toBeInTheDocument(); // favorites
    expect(screen.getByText('8')).toBeInTheDocument(); // recently played
  });

  it('renders settings button', () => {
    render(<Sidebar user={mockUser} />);
    // Settings is an SVG icon in a button - check for the button
    const settingsButton = document.querySelector('button[class*="text-gray-500"]');
    expect(settingsButton).toBeInTheDocument();
  });
});
