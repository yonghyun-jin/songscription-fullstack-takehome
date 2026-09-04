'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Undertale-style dark theme - true to the game
export default function DarkDemo() {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTimeRef = useRef(0);

  const dialogues = [
    "* Hey there. I'm Maven.",
    "* I'll be your guide here at Songscription.",
    "* Before we jump in, I'd love to get to know you a little.",
  ];

  const playSound = useCallback(() => {
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 25) return;
    lastPlayTimeRef.current = now;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch {}
  }, []);

  const typeText = useCallback((text: string, onComplete: () => void) => {
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        if (text[index] !== ' ') playSound();
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete();
      }
    }, 25); // Fast speed

    return () => clearInterval(interval);
  }, [playSound]);

  useEffect(() => {
    if (step < dialogues.length) {
      const cleanup = typeText(dialogues[step], () => {
        if (step === dialogues.length - 1) {
          setTimeout(() => setShowOptions(true), 300);
        }
      });
      return cleanup;
    }
  }, [step, typeText, dialogues]);

  const handleClick = () => {
    if (isTyping) return;
    if (step < dialogues.length - 1) {
      setStep(step + 1);
      setShowOptions(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center justify-center p-8 cursor-pointer select-none"
      onClick={handleClick}
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Maven sprite - simple pixel art style */}
      <div className="mb-8">
        <svg width="120" height="120" viewBox="0 0 24 24" style={{ imageRendering: 'pixelated' }}>
          {/* Simple musical note character */}
          <rect x="8" y="4" width="8" height="2" fill="white" />
          <rect x="14" y="4" width="2" height="10" fill="white" />
          <rect x="10" y="12" width="6" height="4" fill="white" />
          <rect x="8" y="14" width="2" height="4" fill="white" />
          <rect x="14" y="14" width="2" height="4" fill="white" />
        </svg>
      </div>

      {/* Dialogue box */}
      <div
        className="w-full max-w-2xl border-4 border-white bg-black p-6"
        style={{ minHeight: '120px' }}
      >
        <p className="text-white text-2xl leading-relaxed tracking-wide">
          {displayedText}
          {isTyping && <span className="inline-block w-3 h-6 bg-white ml-1 animate-pulse" />}
        </p>
      </div>

      {/* Options */}
      {showOptions && (
        <div className="mt-8 space-y-4 w-full max-w-2xl">
          <button
            className="w-full border-4 border-white bg-black p-4 text-white text-xl text-left hover:bg-white hover:text-black transition-colors"
            onClick={(e) => { e.stopPropagation(); }}
          >
            * Let's do it!
          </button>
        </div>
      )}

      {/* Click to continue hint */}
      {!isTyping && !showOptions && step < dialogues.length - 1 && (
        <p className="mt-6 text-white text-sm animate-pulse">
          [ Click to continue ]
        </p>
      )}

      {/* Theme label */}
      <div className="fixed top-4 right-4 text-white text-sm opacity-50">
        DARK THEME (Undertale style)
      </div>
    </div>
  );
}
