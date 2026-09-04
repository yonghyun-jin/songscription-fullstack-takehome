'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user: {
    name: string;
    initials: string;
    weeklyMinutes: number;
  };
  onUpload?: () => void;
  songCounts?: {
    all: number;
    favorites: number;
    recentlyPlayed: number;
  };
}

// SVG Icons
const SongscriptionLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#3B82F6" />
    <rect x="8" y="20" width="4" height="8" fill="white" />
    <rect x="14" y="14" width="4" height="14" fill="white" />
    <rect x="20" y="8" width="4" height="20" fill="white" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

export function Sidebar({ user, onUpload, songCounts }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: HomeIcon, count: songCounts?.all },
    { href: '/dashboard/recently-played', label: 'Recently Played', icon: ClockIcon, count: songCounts?.recentlyPlayed },
    { href: '/dashboard/favorites', label: 'Favorites', icon: HeartIcon, count: songCounts?.favorites },
  ];

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <SongscriptionLogo />
        <span className="text-white font-semibold text-lg">Songscription</span>
      </div>

      {/* Upload Button */}
      <div className="px-4 mb-4">
        <button
          onClick={onUpload}
          className="w-full bg-transparent border border-zinc-700 text-white py-2.5 px-4 rounded-lg font-medium
                     hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
        >
          <UploadIcon />
          Add transcription
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-sm text-zinc-500">{item.count}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile - Fixed Bottom */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
              {user.initials}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user.name}</p>
              <p className="text-amber-500 text-xs">{user.weeklyMinutes} min this week</p>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <SettingsIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}
