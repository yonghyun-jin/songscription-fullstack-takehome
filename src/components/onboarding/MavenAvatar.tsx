'use client';

interface MavenAvatarProps {
  size?: 'sm' | 'md' | 'lg';
}

export function MavenAvatar({ size = 'md' }: MavenAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-white shadow-lg flex items-center justify-center`}
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Simple friendly face */}
      <svg viewBox="0 0 100 100" className="w-full h-full p-2">
        {/* Face background */}
        <circle cx="50" cy="50" r="45" fill="#FFE4C4" />

        {/* Eyes */}
        <ellipse cx="35" cy="42" rx="6" ry="8" fill="#333" />
        <ellipse cx="65" cy="42" rx="6" ry="8" fill="#333" />

        {/* Eye highlights */}
        <circle cx="37" cy="40" r="2" fill="#fff" />
        <circle cx="67" cy="40" r="2" fill="#fff" />

        {/* Smile */}
        <path
          d="M 30 60 Q 50 80 70 60"
          fill="none"
          stroke="#333"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Blush */}
        <ellipse cx="25" cy="55" rx="8" ry="5" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="75" cy="55" rx="8" ry="5" fill="#FFB6C1" opacity="0.6" />
      </svg>
    </div>
  );
}
