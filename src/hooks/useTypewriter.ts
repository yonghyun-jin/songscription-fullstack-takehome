'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  onCharacter?: () => void;
  onComplete?: () => void;
}

export function useTypewriter({
  text,
  speed = 40,
  onCharacter,
  onComplete,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        onCharacter?.();
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && text.length > 0) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onCharacter, onComplete]);

  const skip = useCallback(() => {
    setDisplayedText(text);
    setCurrentIndex(text.length);
    setIsComplete(true);
    onComplete?.();
  }, [text, onComplete]);

  return {
    displayedText,
    isComplete,
    skip,
  };
}
