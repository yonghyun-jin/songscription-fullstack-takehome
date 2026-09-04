'use client';

import { useState, useEffect, useRef } from 'react';

const MUSIC_TAGS = [
  'Baroque', 'Calm', 'Crowd pleaser', 'Impressionist',
  'Jazz', 'Modern', 'Pop', 'Romantic',
];

const EXPERIENCE_OPTIONS = [
  "I'm just starting out!",
  "I play here and there",
  "I've been at it for a while",
];

type StepType = 'dialogue' | 'tags' | 'experience' | 'input' | 'url';

interface Step {
  text: string;
  type: StepType;
  options?: string[];
}

// Selection cursor - music note with round head
const NoteCursor = () => (
  <svg width="12" height="18" viewBox="0 0 12 18" fill="#1a1a2e">
    {/* Stem */}
    <rect x="9" y="0" width="2" height="13" />
    {/* Flag */}
    <path d="M11 0 Q14 3 11 6 L11 4 Q13 3 11 1 Z" />
    {/* Round note head */}
    <ellipse cx="5" cy="14" rx="5" ry="3.5" />
  </svg>
);

// Blob Note character
const BlobNote = () => (
  <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="4" y="4" width="8" height="8" fill="#4FC3F7" />
    <rect x="3" y="5" width="1" height="6" fill="#4FC3F7" />
    <rect x="12" y="5" width="1" height="6" fill="#4FC3F7" />
    <rect x="5" y="3" width="6" height="1" fill="#4FC3F7" />
    <rect x="5" y="12" width="6" height="1" fill="#4FC3F7" />
    <rect x="5" y="6" width="2" height="3" fill="white" />
    <rect x="9" y="6" width="2" height="3" fill="white" />
    <rect x="6" y="7" width="1" height="2" fill="#1a1a2e" />
    <rect x="10" y="7" width="1" height="2" fill="#1a1a2e" />
    <rect x="4" y="9" width="2" height="1" fill="#FF9999" />
    <rect x="10" y="9" width="2" height="1" fill="#FF9999" />
  </svg>
);

// Note Buddy character - single note shape
const NoteBuddy = () => (
  <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Stem */}
    <rect x="10" y="1" width="2" height="10" fill="#1a1a2e" />
    {/* Flag */}
    <rect x="12" y="1" width="2" height="2" fill="#1a1a2e" />
    <rect x="12" y="3" width="1" height="2" fill="#1a1a2e" />
    {/* Note head - oval with eyes */}
    <rect x="4" y="9" width="8" height="5" fill="#1a1a2e" />
    <rect x="3" y="10" width="1" height="3" fill="#1a1a2e" />
    <rect x="12" y="10" width="1" height="3" fill="#1a1a2e" />
    {/* Eyes */}
    <rect x="5" y="10" width="2" height="2" fill="white" />
    <rect x="9" y="10" width="2" height="2" fill="white" />
    <rect x="6" y="11" width="1" height="1" fill="#1a1a2e" />
    <rect x="10" y="11" width="1" height="1" fill="#1a1a2e" />
  </svg>
);

export default function LightDemo() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [character, setCharacter] = useState<'blob' | 'note'>('blob');
  const audioContextRef = useRef<AudioContext | null>(null);

  const steps: Step[] = [
    { text: "Hey there. I'm Maven.", type: 'dialogue' },
    { text: "I'll be your guide here at Songscription.", type: 'dialogue' },
    { text: "Before we jump in, I'd love to get to know you a little.", type: 'dialogue', options: ["Let's do it!", "Tell me more"] },
    { text: "So... what kind of music speaks to you?", type: 'tags' },
    { text: "Nice picks! How long have you been at the piano?", type: 'experience' },
    { text: "Got it! What's a song you're proud you can play?", type: 'input' },
    { text: "Love that! Now, what song do you dream of playing someday? Drop a YouTube or TikTok link.", type: 'url' },
    { text: "Perfect! Let's make this happen. Your piano journey starts now!", type: 'dialogue', options: ["Let's go!"] },
  ];

  const currentStep = steps[stepIndex];

  const playSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 450;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  };

  const handleStart = () => setStarted(true);

  // Typewriter effect
  useEffect(() => {
    if (!started || stepIndex >= steps.length) return;

    const text = currentStep.text;
    let i = 0;
    setDisplayedText('');
    setIsTyping(true);
    setShowContent(false);

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        if (text[i] !== ' ') playSound();
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        setTimeout(() => setShowContent(true), 200);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [started, stepIndex]);

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(s => s + 1);
      setSelectedOption(0);
      setInputValue('');
    }
  };

  const handleClick = () => {
    if (!started || isTyping) return;
    // Only advance on click if it's a simple dialogue without special content
    if (currentStep.type === 'dialogue' && !currentStep.options) {
      nextStep();
    }
  };

  const handleOptionClick = (idx: number) => {
    playSound();
    nextStep();
  };

  const handleOptionHover = (idx: number) => {
    if (selectedOption !== idx) {
      setSelectedOption(idx);
      playSound();
    }
  };

  const toggleTag = (tag: string) => {
    playSound();
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleTagsContinue = () => {
    if (selectedTags.length > 0) {
      playSound();
      nextStep();
    }
  };

  const handleExperienceSelect = (exp: string) => {
    playSound();
    nextStep();
  };

  const handleInputSubmit = () => {
    playSound();
    nextStep();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 select-none"
      style={{
        fontFamily: "'VT323', 'Courier New', monospace",
        background: 'linear-gradient(180deg, #e8f4fc 0%, #d0e8f5 100%)',
        cursor: started ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    >
      {/* Background Music */}
      {started && (
        <iframe
          className="hidden"
          src="https://www.youtube.com/embed/oTu4WcpB9Iw?autoplay=1&loop=1&playlist=oTu4WcpB9Iw"
          allow="autoplay"
        />
      )}

      {/* Start screen */}
      {!started && (
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Choose your guide:</p>
          <div className="flex justify-center gap-6 mb-8">
            <div
              onClick={() => setCharacter('blob')}
              className={`p-4 rounded-xl cursor-pointer border-4 transition-all ${
                character === 'blob' ? 'border-blue-500 bg-blue-50 scale-110' : 'border-gray-300 bg-white'
              }`}
            >
              <BlobNote />
              <p className="text-sm mt-2 text-gray-600">Blob Note</p>
            </div>
            <div
              onClick={() => setCharacter('note')}
              className={`p-4 rounded-xl cursor-pointer border-4 transition-all ${
                character === 'note' ? 'border-blue-500 bg-blue-50 scale-110' : 'border-gray-300 bg-white'
              }`}
            >
              <NoteBuddy />
              <p className="text-sm mt-2 text-gray-600">Note Buddy</p>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-blue-500 text-white text-2xl rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            Start
          </button>
          <p className="mt-4 text-gray-500 text-lg">Click to begin your journey</p>
        </div>
      )}

      {/* Main content */}
      {started && stepIndex < steps.length && (
        <>
          {/* Maven character */}
          <div className="mb-6">
            {character === 'blob' ? <BlobNote /> : <NoteBuddy />}
          </div>

          {/* Dialogue box */}
          <div
            className="w-full max-w-xl border-4 border-gray-800 bg-white rounded-xl p-5 shadow-lg"
            style={{ minHeight: '100px' }}
          >
            <p className="text-gray-900 text-2xl leading-relaxed">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-6 bg-blue-500 ml-1 animate-pulse align-middle" />}
            </p>
          </div>

          {/* Content based on step type */}
          {showContent && (
            <div className="w-full max-w-xl mt-3" onClick={e => e.stopPropagation()}>

              {/* Simple dialogue options */}
              {currentStep.type === 'dialogue' && currentStep.options && (
                <div className="border-4 border-gray-800 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex flex-wrap gap-4">
                    {currentStep.options.map((opt, idx) => (
                      <div
                        key={opt}
                        className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
                        onMouseEnter={() => handleOptionHover(idx)}
                        onClick={() => handleOptionClick(idx)}
                      >
                        <span className="w-6 flex items-center justify-center">
                          {selectedOption === idx ? <NoteCursor /> : ''}
                        </span>
                        <span className="text-gray-800 text-xl">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag selection */}
              {currentStep.type === 'tags' && (
                <div className="border-4 border-gray-800 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {MUSIC_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-lg text-lg border-2 transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex justify-center">
                      <div
                        className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-lg"
                        onClick={handleTagsContinue}
                      >
                        <span className="w-6 flex items-center justify-center"><NoteCursor /></span>
                        <span className="text-gray-800 text-xl">Continue</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Experience selection */}
              {currentStep.type === 'experience' && (
                <div className="border-4 border-gray-800 bg-white rounded-xl p-4 shadow-lg">
                  <div className="space-y-2">
                    {EXPERIENCE_OPTIONS.map((exp, idx) => (
                      <div
                        key={exp}
                        className="flex items-center p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
                        onMouseEnter={() => handleOptionHover(idx)}
                        onClick={() => handleExperienceSelect(exp)}
                      >
                        <span className="w-6 flex items-center justify-center">
                          {selectedOption === idx ? <NoteCursor /> : ''}
                        </span>
                        <span className="text-gray-800 text-xl">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text input */}
              {currentStep.type === 'input' && (
                <div className="border-4 border-gray-800 bg-white rounded-xl p-4 shadow-lg">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Enter a song name..."
                    className="w-full p-3 text-xl border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
                    style={{ fontFamily: "'VT323', monospace" }}
                  />
                  <div className="flex gap-4">
                    <div
                      className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-lg"
                      onClick={handleInputSubmit}
                    >
                      <span className="w-6 flex items-center justify-center"><NoteCursor /></span>
                      <span className="text-gray-800 text-xl">Skip for now</span>
                    </div>
                    {inputValue && (
                      <div
                        className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-lg"
                        onClick={handleInputSubmit}
                      >
                        <span className="w-6 flex items-center justify-center"><NoteCursor /></span>
                        <span className="text-gray-800 text-xl">Continue</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* URL input */}
              {currentStep.type === 'url' && (
                <div className="border-4 border-gray-800 bg-white rounded-xl p-4 shadow-lg">
                  <input
                    type="url"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Paste YouTube or TikTok link..."
                    className="w-full p-3 text-xl border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
                    style={{ fontFamily: "'VT323', monospace" }}
                  />
                  <div className="flex gap-4">
                    <div
                      className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-lg"
                      onClick={handleInputSubmit}
                    >
                      <span className="w-6 flex items-center justify-center"><NoteCursor /></span>
                      <span className="text-gray-800 text-xl">I'll find one later</span>
                    </div>
                    {inputValue && (
                      <div
                        className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-lg"
                        onClick={handleInputSubmit}
                      >
                        <span className="w-6 flex items-center justify-center"><NoteCursor /></span>
                        <span className="text-gray-800 text-xl">Continue</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Click to continue hint */}
          {showContent && currentStep.type === 'dialogue' && !currentStep.options && stepIndex < steps.length - 1 && (
            <p className="mt-4 text-gray-400 text-lg animate-bounce">
              ▼ Click to continue
            </p>
          )}
        </>
      )}

      <div className="fixed top-4 right-4 text-gray-400 text-xs">
        DEMO
      </div>
    </div>
  );
}
