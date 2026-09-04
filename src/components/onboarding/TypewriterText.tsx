'use client';

import { useTypewriter } from '@/hooks/useTypewriter';
import { useAudio } from '@/hooks/useAudio';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  speed?: number;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  onComplete,
  speed = 40,
  showCursor = true,
}: TypewriterTextProps) {
  const { playTypewriterSound } = useAudio();

  const { displayedText, isComplete, skip } = useTypewriter({
    text,
    speed,
    onCharacter: playTypewriterSound,
    onComplete,
  });

  return (
    <div onClick={skip} className="cursor-pointer">
      <span>{displayedText}</span>
      {showCursor && !isComplete && <span className="typewriter-cursor" />}
    </div>
  );
}
