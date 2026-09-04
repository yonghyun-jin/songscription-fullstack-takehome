# Songscription Onboarding Implementation Plan

## Overview
Create an Undertale-style conversational onboarding experience with Maven (the app's character), featuring typewriter text effects, sound effects, and a Wii-inspired visual theme.

---

## Design References

### Visual Style: Wii Theme
- Rounded corners, soft shadows
- Clean white/light blue color palette
- Friendly, approachable UI
- Mii-style avatar for Maven
- Smooth animations and transitions

### Interaction Style: Undertale
- Character-driven conversation with Maven
- Typewriter text animation
- Sound effect on each character typed
- Wait for user input before proceeding
- Conversational responses based on user choices

---

## Onboarding Flow

### Screen 1: Welcome
```
Maven: "Hey there! I'm Maven."
       [typewriter effect + sound]

       "I'll be your guide here at Songscription.
        Before we jump in, I'd love to get to know you a little!"

       [Let's do it! button]
```

### Screen 2: Music Taste
```
Maven: "First things first... what kind of music speaks to you?"
       [typewriter effect + sound]

       [Tag Selection Grid]
       - Baroque, Calm, Crowd pleaser, Impressionist
       - Improv, Jazz, Modern, Pedal work
       - Pop, Recital, Romantic, Sing along
       - Stretch goal, Technique, Voicings, Warm-up

       [Continue button - appears after 1+ selection]
```

### Screen 3: Experience Level
```
Maven: "[Dynamic response based on tags, e.g.]"
       "Ooh, a jazz lover! Love that for you."
       "So tell me, how long have you been at the piano?"
       [typewriter effect + sound]

       [Selection Options - casual, human-sounding, max 3]
       - "I'm just starting out!"
       - "I play here and there"
       - "I've been at it for a while"
```

### Screen 4: Proud Song (Conditional)
```
If NOT first time:
Maven: "Nice! So you've got some tunes under your belt."
       "What's a song you're proud you can play?
        Don't be shy, I wanna hear it!"
       [typewriter effect + sound]

       [Text input field]
       [Skip for now button]

If first time:
Maven: "That's awesome! Everyone starts somewhere."
       "You know what? I'm gonna help you find the perfect first song."
       [typewriter effect + sound]

       [Continue button]
```

### Screen 5: Response + Goal Transition (combined)
```
If song was provided:
Maven: "Oh, [song name]? Great choice! That's such a good one."
       "Speaking of great music... what's your next dream piece?
        Drop a YouTube or TikTok link and I'll help you get there!"
       [typewriter effect + sound]

If skipped proud song:
Maven: "No worries! We'll discover your sound together."
       "Here's a fun one. What song do you dream of playing someday?
        Paste a YouTube or TikTok link and I'll start prepping it for you!"
       [typewriter effect + sound]

If first-timer:
Maven: "Alright, here's the exciting part!"
       "What song do you dream of playing? Even if it feels impossible right now.
        Drop a link and let's make it your goal!"
       [typewriter effect + sound]

       [URL input field with paste button]
       [Preview of song if valid URL]
       [I'll find one later button]
```

### Screen 6: Closing *(fresh new screen)*
```
[Background music fades out]
[Only typewriter sound plays]

If goal song provided:
Maven: "Perfect! I've got [song name] queued up for you."
       "Let's make this happen. Your piano journey starts now!"
       [typewriter effect + sound, synced duration]

If no goal song:
Maven: "All good! You can always add a dream song later."
       "Let's make this happen. Your piano journey starts now!"
       [typewriter effect + sound, synced duration]

       [Let's go! button - redirects to /dashboard]
```

---

## Technical Implementation

### 1. Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Onboarding flow (main entry)
│   ├── dashboard/
│   │   └── page.tsx                # Main dashboard (post-onboarding)
│   └── globals.css                 # Global styles + Wii theme
├── components/
│   ├── onboarding/
│   │   ├── OnboardingContainer.tsx # Main wrapper with state
│   │   ├── TypewriterText.tsx      # Typewriter effect component
│   │   ├── MavenAvatar.tsx         # Maven character display
│   │   ├── TagSelector.tsx         # Music taste tags
│   │   ├── ExperienceSelector.tsx  # Experience level options
│   │   ├── SongInput.tsx           # Text input for proud song
│   │   ├── GoalUploader.tsx        # URL input for goal song
│   │   └── WiiButton.tsx           # Wii-styled button
│   └── ui/
│       └── AudioController.tsx     # Background music + SFX
├── hooks/
│   ├── useTypewriter.ts            # Typewriter animation hook
│   └── useAudio.ts                 # Audio playback hook
├── lib/
│   └── onboarding-state.ts         # Onboarding state management
└── public/
    └── audio/
        ├── typewriter.mp3          # Typewriter click sound
        └── background.mp3          # Background music
```

### 2. Core Components

#### TypewriterText.tsx
```typescript
interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  speed?: number; // ms per character
  playSound?: boolean;
}
```
- Renders text character by character
- Plays sound effect per character (throttled)
- Calls onComplete when finished
- Supports skip on click

#### OnboardingContainer.tsx
```typescript
interface OnboardingState {
  step: number;
  musicTaste: string[];
  experience: string;
  proudSong: string;
  goalSongUrl: string;
}
```
- Manages flow state
- Controls background music
- Handles transitions between steps

#### AudioController.tsx
- Singleton audio context
- Background music loop
- Typewriter SFX (short, synced with animation)
- Fade out functionality for closing

### 3. Styling (Wii Theme)

```css
/* Color Palette */
--wii-blue: #00a0dc;
--wii-light-blue: #e8f4fc;
--wii-white: #ffffff;
--wii-gray: #f0f0f0;
--wii-text: #333333;
--wii-shadow: rgba(0, 0, 0, 0.1);

/* Design Tokens */
--border-radius-lg: 24px;
--border-radius-md: 16px;
--border-radius-sm: 8px;
--shadow-soft: 0 4px 20px var(--wii-shadow);
```

### 4. Audio Implementation

#### Background Music
- Source: User-provided YouTube link (will need to extract or use alternative)
- For demo: Use royalty-free calm piano music
- Loop during onboarding steps 1-6
- Fade out on step 7

#### Typewriter Sound
- Source: https://www.youtube.com/watch?v=6wsoZChqKVI
- Extract short click sound (~50ms)
- Play on each character render (throttled to avoid overlap)
- For closing: Duration synced to text length

### 5. State Management
- Use React useState/useReducer for onboarding state
- Store completed onboarding in localStorage
- Pass final data to dashboard

---

## Implementation Order

### Phase 1: Foundation
1. [ ] Create folder structure
2. [ ] Set up Wii theme in globals.css
3. [ ] Create WiiButton component
4. [ ] Create MavenAvatar component (simple illustration)

### Phase 2: Core Mechanics
5. [ ] Implement useTypewriter hook
6. [ ] Create TypewriterText component
7. [ ] Set up audio files (download/create)
8. [ ] Implement useAudio hook
9. [ ] Create AudioController component

### Phase 3: Onboarding Screens
10. [ ] Create OnboardingContainer with step management
11. [ ] Screen 1: Welcome
12. [ ] Screen 2: Tag selection (TagSelector)
13. [ ] Screen 3: Experience level (ExperienceSelector)
14. [ ] Screen 4: Proud song input (SongInput) - conditional for non-beginners
15. [ ] Screen 5: Goal upload (GoalUploader) - with dynamic intro based on previous answers
16. [ ] Screen 6: Closing with audio sync and personalized message

### Phase 4: Polish
18. [ ] Transitions between screens
19. [ ] Dynamic Maven responses based on input
20. [ ] Skip/fast-forward functionality
21. [ ] Mobile responsiveness
22. [ ] Create placeholder dashboard page

---

## Audio Files Needed

| File | Description | Source |
|------|-------------|--------|
| `typewriter.mp3` | Short click sound (~50ms) | Extract from Undertale SFX or create |
| `background.mp3` | Calm looping music | Royalty-free piano ambient |

**Note:** For demo purposes, we'll use Web Audio API to generate simple sounds if audio files aren't available, or use royalty-free alternatives.

---

## Dependencies to Add

```json
{
  "dependencies": {
    // None required - using vanilla React + Web Audio API
  }
}
```

All functionality can be achieved with:
- React hooks for state/effects
- Web Audio API for sound
- CSS animations for transitions
- Native HTML5 audio for background music

---

## Demo Considerations

Since this is a demo:
1. Skip complex URL validation
2. Simple localStorage for state persistence
3. Placeholder dashboard with basic UI
4. Pre-selected default values for testing
5. Quick skip option for development

---

## Success Criteria

- [ ] Typewriter effect feels smooth and game-like
- [ ] Sound effects sync with text animation
- [ ] Maven feels like a friendly character
- [ ] Wii theme is consistent and polished
- [ ] Flow is intuitive and engaging
- [ ] Background music creates atmosphere
- [ ] Closing moment feels satisfying
- [ ] Redirects to dashboard successfully
