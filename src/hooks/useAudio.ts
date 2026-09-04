'use client';

import { useRef, useCallback, useEffect } from 'react';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTimeRef = useRef(0);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTypewriterSound = useCallback(() => {
    const now = Date.now();
    // Throttle to prevent overlapping sounds
    if (now - lastPlayTimeRef.current < 30) return;
    lastPlayTimeRef.current = now;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Short, soft click sound
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not available
    }
  }, [getAudioContext]);

  const resumeAudioContext = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }, [getAudioContext]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playTypewriterSound,
    resumeAudioContext,
  };
}
