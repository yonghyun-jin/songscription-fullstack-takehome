'use client';

import { useState } from 'react';

export default function CharacterDemo() {
  const [selected, setSelected] = useState<number | null>(null);

  const characters = [
    {
      name: 'Music Note Ghost',
      description: 'Pacman-style with eyes',
      render: (
        <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
          {/* Body - music note shape */}
          <rect x="4" y="1" width="8" height="2" fill="#1a1a2e" />
          <rect x="10" y="1" width="2" height="9" fill="#1a1a2e" />
          <rect x="4" y="1" width="2" height="9" fill="#1a1a2e" />
          <rect x="2" y="8" width="4" height="4" fill="#1a1a2e" />
          <rect x="8" y="8" width="4" height="4" fill="#1a1a2e" />
          {/* Eyes */}
          <rect x="3" y="9" width="2" height="2" fill="white" />
          <rect x="9" y="9" width="2" height="2" fill="white" />
          <rect x="4" y="10" width="1" height="1" fill="#1a1a2e" />
          <rect x="10" y="10" width="1" height="1" fill="#1a1a2e" />
        </svg>
      ),
    },
    {
      name: 'Pixel Piano',
      description: 'Cute piano with face',
      render: (
        <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
          {/* Piano body */}
          <rect x="2" y="4" width="12" height="8" fill="#1a1a2e" />
          <rect x="3" y="10" width="2" height="2" fill="white" />
          <rect x="6" y="10" width="2" height="2" fill="white" />
          <rect x="9" y="10" width="2" height="2" fill="white" />
          {/* Eyes */}
          <rect x="4" y="6" width="2" height="2" fill="white" />
          <rect x="10" y="6" width="2" height="2" fill="white" />
          <rect x="5" y="7" width="1" height="1" fill="#1a1a2e" />
          <rect x="11" y="7" width="1" height="1" fill="#1a1a2e" />
          {/* Smile */}
          <rect x="6" y="8" width="4" height="1" fill="white" />
        </svg>
      ),
    },
    {
      name: 'Note Buddy',
      description: 'Single note with big eyes',
      render: (
        <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
          {/* Note stem */}
          <rect x="10" y="2" width="2" height="8" fill="#1a1a2e" />
          {/* Note head */}
          <rect x="5" y="8" width="6" height="5" fill="#1a1a2e" />
          <rect x="4" y="9" width="1" height="3" fill="#1a1a2e" />
          <rect x="11" y="9" width="1" height="3" fill="#1a1a2e" />
          {/* Big eyes */}
          <rect x="6" y="9" width="2" height="3" fill="white" />
          <rect x="9" y="9" width="2" height="3" fill="white" />
          <rect x="7" y="10" width="1" height="2" fill="#1a1a2e" />
          <rect x="10" y="10" width="1" height="2" fill="#1a1a2e" />
        </svg>
      ),
    },
    {
      name: 'Pacman Note',
      description: 'Classic pacman style',
      render: (
        <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
          {/* Pacman body as note */}
          <rect x="3" y="3" width="10" height="10" fill="#FFD700" />
          <rect x="2" y="4" width="1" height="8" fill="#FFD700" />
          <rect x="13" y="4" width="1" height="8" fill="#FFD700" />
          <rect x="4" y="2" width="8" height="1" fill="#FFD700" />
          <rect x="4" y="13" width="8" height="1" fill="#FFD700" />
          {/* Mouth (pacman style) */}
          <rect x="10" y="7" width="4" height="1" fill="#e8f4fc" />
          <rect x="11" y="6" width="3" height="1" fill="#e8f4fc" />
          <rect x="11" y="8" width="3" height="1" fill="#e8f4fc" />
          <rect x="12" y="5" width="2" height="1" fill="#e8f4fc" />
          <rect x="12" y="9" width="2" height="1" fill="#e8f4fc" />
          {/* Eye */}
          <rect x="6" y="4" width="2" height="2" fill="#1a1a2e" />
        </svg>
      ),
    },
    {
      name: 'Blob Note',
      description: 'Friendly blob shape',
      render: (
        <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
          {/* Blob body */}
          <rect x="4" y="4" width="8" height="8" fill="#4FC3F7" />
          <rect x="3" y="5" width="1" height="6" fill="#4FC3F7" />
          <rect x="12" y="5" width="1" height="6" fill="#4FC3F7" />
          <rect x="5" y="3" width="6" height="1" fill="#4FC3F7" />
          <rect x="5" y="12" width="6" height="1" fill="#4FC3F7" />
          {/* Eyes */}
          <rect x="5" y="6" width="2" height="3" fill="white" />
          <rect x="9" y="6" width="2" height="3" fill="white" />
          <rect x="6" y="7" width="1" height="2" fill="#1a1a2e" />
          <rect x="10" y="7" width="1" height="2" fill="#1a1a2e" />
          {/* Blush */}
          <rect x="4" y="9" width="2" height="1" fill="#FF9999" />
          <rect x="10" y="9" width="2" height="1" fill="#FF9999" />
        </svg>
      ),
    },
    {
      name: 'Ghost Note',
      description: 'Undertale ghost style',
      render: (
        <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
          {/* Ghost body */}
          <rect x="4" y="2" width="8" height="10" fill="white" />
          <rect x="3" y="3" width="1" height="8" fill="white" />
          <rect x="12" y="3" width="1" height="8" fill="white" />
          {/* Wavy bottom */}
          <rect x="4" y="12" width="2" height="2" fill="white" />
          <rect x="7" y="11" width="2" height="2" fill="white" />
          <rect x="10" y="12" width="2" height="2" fill="white" />
          {/* Eyes */}
          <rect x="5" y="5" width="2" height="3" fill="#1a1a2e" />
          <rect x="9" y="5" width="2" height="3" fill="#1a1a2e" />
          {/* Mouth */}
          <rect x="7" y="9" width="2" height="1" fill="#1a1a2e" />
          {/* Music note on head */}
          <rect x="10" y="1" width="3" height="1" fill="#1a1a2e" />
          <rect x="12" y="1" width="1" height="3" fill="#1a1a2e" />
        </svg>
      ),
    },
    {
      name: 'Simple Eyes',
      description: 'Minimal music note with eyes',
      render: (
        <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
          {/* Music note */}
          <rect x="4" y="2" width="8" height="2" fill="#1a1a2e" />
          <rect x="10" y="2" width="2" height="8" fill="#1a1a2e" />
          <rect x="4" y="2" width="2" height="8" fill="#1a1a2e" />
          {/* Note heads with eyes */}
          <rect x="2" y="8" width="5" height="5" fill="#1a1a2e" />
          <rect x="8" y="8" width="5" height="5" fill="#1a1a2e" />
          {/* Left eye */}
          <rect x="3" y="9" width="2" height="2" fill="white" />
          <rect x="4" y="10" width="1" height="1" fill="#1a1a2e" />
          {/* Right eye */}
          <rect x="9" y="9" width="2" height="2" fill="white" />
          <rect x="10" y="10" width="1" height="1" fill="#1a1a2e" />
        </svg>
      ),
    },
    {
      name: 'Emoji Style',
      description: 'Current - using emoji',
      render: (
        <div className="text-6xl">🎵</div>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen p-8"
      style={{
        fontFamily: "'VT323', 'Courier New', monospace",
        background: 'linear-gradient(180deg, #e8f4fc 0%, #d0e8f5 100%)',
      }}
    >
      <h1 className="text-4xl text-center mb-2 text-gray-800">Maven Character Options</h1>
      <p className="text-center text-gray-600 mb-8 text-xl">Click to select</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {characters.map((char, idx) => (
          <div
            key={char.name}
            onClick={() => setSelected(idx)}
            className={`
              p-6 rounded-xl cursor-pointer transition-all border-4
              ${selected === idx
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-300 bg-white hover:border-blue-300'
              }
            `}
          >
            <div className="flex justify-center mb-4">
              {char.render}
            </div>
            <h3 className="text-xl text-center font-bold text-gray-800">{char.name}</h3>
            <p className="text-sm text-center text-gray-500">{char.description}</p>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div className="mt-8 text-center">
          <p className="text-2xl text-gray-700 mb-4">
            Selected: <strong>{characters[selected].name}</strong>
          </p>
          <div className="flex justify-center gap-4">
            <div className="p-4 bg-white rounded-xl border-4 border-gray-800">
              <p className="text-sm text-gray-500 mb-2">Preview in dialogue:</p>
              <div className="flex items-start gap-4">
                <div className="scale-75">{characters[selected].render}</div>
                <div className="text-xl text-gray-800">Hey there. I'm Maven!</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <a href="/demo/light" className="text-blue-500 hover:underline text-lg">
          ← Back to demo
        </a>
      </div>
    </div>
  );
}
