'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TypewriterText } from './TypewriterText';
import { MavenAvatar } from './MavenAvatar';
import { useAudio } from '@/hooks/useAudio';

const MUSIC_TAGS = [
  'Baroque', 'Calm', 'Crowd pleaser', 'Impressionist',
  'Improv', 'Jazz', 'Modern', 'Pedal work',
  'Pop', 'Recital', 'Romantic', 'Sing along',
];

const EXPERIENCE_OPTIONS = [
  "I'm just starting out!",
  "I play here and there",
  "I've been at it for a while",
];

type Step = 'welcome' | 'music-taste' | 'experience' | 'proud-song' | 'goal-song' | 'closing';

interface OnboardingState {
  musicTaste: string[];
  experience: string;
  proudSong: string;
  goalSongUrl: string;
}

export function OnboardingContainer() {
  const router = useRouter();
  const { resumeAudioContext } = useAudio();

  const [step, setStep] = useState<Step>('welcome');
  const [textComplete, setTextComplete] = useState(false);
  const [state, setState] = useState<OnboardingState>({
    musicTaste: [],
    experience: '',
    proudSong: '',
    goalSongUrl: '',
  });

  const handleNext = useCallback(() => {
    setTextComplete(false);
  }, []);

  const goToStep = useCallback((nextStep: Step) => {
    handleNext();
    setStep(nextStep);
  }, [handleNext]);

  const isBeginnerPath = state.experience === "I'm just starting out!";

  const getTagResponse = () => {
    if (state.musicTaste.includes('Jazz')) return "Ooh, a jazz lover! Love that for you.";
    if (state.musicTaste.includes('Pop')) return "Pop music! Great taste.";
    if (state.musicTaste.includes('Romantic')) return "Romantic pieces are so beautiful.";
    if (state.musicTaste.includes('Baroque')) return "Baroque! A person of fine taste.";
    return "Nice picks!";
  };

  const getGoalIntro = () => {
    if (state.proudSong) {
      return `Oh, ${state.proudSong}? Great choice! That's such a good one.\n\nSpeaking of great music... what's your next dream piece? Drop a YouTube or TikTok link and I'll help you get there!`;
    }
    if (isBeginnerPath) {
      return "Alright, here's the exciting part!\n\nWhat song do you dream of playing? Even if it feels impossible right now. Drop a link and let's make it your goal!";
    }
    return "No worries! We'll discover your sound together.\n\nHere's a fun one. What song do you dream of playing someday? Paste a YouTube or TikTok link and I'll start prepping it for you!";
  };

  const getClosingMessage = () => {
    if (state.goalSongUrl) {
      return "Perfect! I've got your dream song queued up for you.\n\nLet's make this happen. Your piano journey starts now!";
    }
    return "All good! You can always add a dream song later.\n\nLet's make this happen. Your piano journey starts now!";
  };

  const handleStart = () => {
    resumeAudioContext();
    goToStep('music-taste');
  };

  const toggleTag = (tag: string) => {
    setState(prev => ({
      ...prev,
      musicTaste: prev.musicTaste.includes(tag)
        ? prev.musicTaste.filter(t => t !== tag)
        : [...prev.musicTaste, tag],
    }));
  };

  const selectExperience = (exp: string) => {
    setState(prev => ({ ...prev, experience: exp }));
    if (exp === "I'm just starting out!") {
      goToStep('goal-song');
    } else {
      goToStep('proud-song');
    }
  };

  const handleProudSongSubmit = () => {
    goToStep('goal-song');
  };

  const handleGoalSubmit = () => {
    goToStep('closing');
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding-complete', 'true');
    localStorage.setItem('onboarding-data', JSON.stringify(state));
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="wii-card max-w-lg w-full">
        <div className="flex flex-col items-center gap-6">
          <MavenAvatar size="lg" />

          {/* Screen 1: Welcome */}
          {step === 'welcome' && (
            <div className="text-center space-y-6 w-full">
              <div className="text-xl leading-relaxed">
                <TypewriterText
                  text="Hey there! I'm Maven.\n\nI'll be your guide here at Songscription. Before we jump in, I'd love to get to know you a little!"
                  onComplete={() => setTextComplete(true)}
                />
              </div>
              {textComplete && (
                <button
                  onClick={handleStart}
                  className="wii-button wii-button-primary"
                >
                  Let's do it!
                </button>
              )}
            </div>
          )}

          {/* Screen 2: Music Taste */}
          {step === 'music-taste' && (
            <div className="text-center space-y-6 w-full">
              <div className="text-xl leading-relaxed">
                <TypewriterText
                  text="First things first... what kind of music speaks to you?"
                  onComplete={() => setTextComplete(true)}
                />
              </div>
              {textComplete && (
                <>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {MUSIC_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`tag-chip ${state.musicTaste.includes(tag) ? 'selected' : ''}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {state.musicTaste.length > 0 && (
                    <button
                      onClick={() => goToStep('experience')}
                      className="wii-button wii-button-primary"
                    >
                      Continue
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Screen 3: Experience Level */}
          {step === 'experience' && (
            <div className="text-center space-y-6 w-full">
              <div className="text-xl leading-relaxed">
                <TypewriterText
                  text={`${getTagResponse()}\n\nSo tell me, how long have you been at the piano?`}
                  onComplete={() => setTextComplete(true)}
                />
              </div>
              {textComplete && (
                <div className="space-y-3">
                  {EXPERIENCE_OPTIONS.map(option => (
                    <button
                      key={option}
                      onClick={() => selectExperience(option)}
                      className="experience-option"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Screen 4: Proud Song (non-beginners only) */}
          {step === 'proud-song' && (
            <div className="text-center space-y-6 w-full">
              <div className="text-xl leading-relaxed">
                <TypewriterText
                  text="Nice! So you've got some tunes under your belt.\n\nWhat's a song you're proud you can play? Don't be shy, I wanna hear it!"
                  onComplete={() => setTextComplete(true)}
                />
              </div>
              {textComplete && (
                <>
                  <input
                    type="text"
                    placeholder="Enter a song name..."
                    value={state.proudSong}
                    onChange={(e) => setState(prev => ({ ...prev, proudSong: e.target.value }))}
                    className="wii-input"
                  />
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleProudSongSubmit}
                      className="wii-button"
                    >
                      Skip for now
                    </button>
                    {state.proudSong && (
                      <button
                        onClick={handleProudSongSubmit}
                        className="wii-button wii-button-primary"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Screen 5: Goal Song */}
          {step === 'goal-song' && (
            <div className="text-center space-y-6 w-full">
              <div className="text-xl leading-relaxed">
                <TypewriterText
                  text={getGoalIntro()}
                  onComplete={() => setTextComplete(true)}
                />
              </div>
              {textComplete && (
                <>
                  <input
                    type="url"
                    placeholder="Paste a YouTube or TikTok link..."
                    value={state.goalSongUrl}
                    onChange={(e) => setState(prev => ({ ...prev, goalSongUrl: e.target.value }))}
                    className="wii-input"
                  />
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleGoalSubmit}
                      className="wii-button"
                    >
                      I'll find one later
                    </button>
                    {state.goalSongUrl && (
                      <button
                        onClick={handleGoalSubmit}
                        className="wii-button wii-button-primary"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Screen 6: Closing */}
          {step === 'closing' && (
            <div className="text-center space-y-6 w-full">
              <div className="text-xl leading-relaxed">
                <TypewriterText
                  text={getClosingMessage()}
                  onComplete={() => setTextComplete(true)}
                />
              </div>
              {textComplete && (
                <button
                  onClick={handleFinish}
                  className="wii-button wii-button-primary"
                >
                  Let's go!
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
