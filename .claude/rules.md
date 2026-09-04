# Rules

- **Backend stack**: SQLite (file-based `songscription.db`) + Drizzle ORM + tRPC. No Docker/Postgres needed. DB auto-creates tables on first connection via `src/db/index.ts`. **Schema changes require 3 updates**: (1) `src/db/schema.ts` Drizzle schema, (2) `src/db/index.ts` raw SQL CREATE TABLE, (3) `src/__tests__/db/songs.test.ts` in-memory test DB CREATE TABLE — missing any causes "no column named X" errors
- **Single-table schema**: `songs` table contains both song metadata AND user progress (no separate progress table) because README specifies no auth/single user
- **Testing**: Vitest + @testing-library/react + jsdom. When component has duplicate text (e.g., difficulty in badge AND hover overlay), use `getAllByText()` or `getByRole()` instead of `getByText()`
- Onboarding UI: light blue gradient background, **VT323 pixel font**, fixed-size dialogue boxes (no resize), music note cursor (♪ SVG with ellipse head) for selections
- Onboarding uses **Undertale-style interaction**: typewriter text effect with per-character sound, character-driven conversation with Maven, wait for user input before proceeding
- Maven's dialogue has NO `*` prefix; only selection options use `*` prefix (Undertale convention)
- Audio approach: Web Audio API oscillator for SFX (typewriter clicks), YouTube iframe embed for background music — removing iframe from DOM stops music instantly while SFX continue independently
- Maven is the app's mascot/guide character — always friendly, conversational, responds dynamically to user choices (e.g., "I love that song too!"). **Dialogue must flow naturally with bridges between topics** (e.g., "Speaking of great music... what's your next dream piece?"), not feel like a checklist of separate questions
- Song card info priorities differ by user type: beginners care more about popularity/social proof/hope; experienced pianists care more about difficulty/technique
- Never use em dashes (—) in UI copy or dialogue; use periods, commas, or ellipses instead
- Selection options should be casual/human-sounding (e.g., "I'm just starting out!" not "A few months"), max 3 choices to keep decisions simple
- **Dashboard theme**: Dark zinc (zinc-950/900 backgrounds, white text) — NOT the Wii light theme from onboarding. Netflix-inspired.
- **Dashboard icons**: SVG components only, never emojis. All icons are inline SVG (HomeIcon, ClockIcon, HeartIcon, etc.)
- **Dashboard copy language**: English only, no Korean text in dashboard UI
- **Implementation plan is source of truth for UI copy**: When screenshots conflict with `/docs/DASHBOARD_IMPLEMENTATION_PLAN.md`, the plan document wins for copywriting (e.g., "Continue Playing" not "Today's Pick")

# Episodes

## 2026-09-03 — Dashboard design: osu! reference, hover-to-play, YouTube audio strategy
- **Design references**: Screenshots from osu! (rhythm game) showing collection cards with difficulty distribution charts, song lists with BPM/duration/mapper, leaderboards with combo/accuracy stats, difficulty modifiers
- **YouTube audio for hover preview**: Direct audio extraction not browser-friendly; use hidden YouTube IFrame API as primary, MIDI playback (Tone.js) as fallback. IFrame has slight load delay but is legal/reliable
- **Stats display**: ~~Mixed Korean/English~~ → **SUPERSEDED**: Now English-only (see 2026-09-03 episode below)
- **3 demo songs**: Für Elise (q9bU12gXUyM), C Major Scale (edScGrfl50M), Twinkle Twinkle (hCKBl-TpRzc) — these YouTube URLs are the canonical audio sources; MIDI files exist in public/samples/

## 2026-09-03 — Onboarding flow design: Undertale + Wii theme decisions
- **Why Undertale-style**: User wanted game-like feel, typewriter creates anticipation and feels personal like "talking to Maven"
- **Why Wii theme**: Friendly, approachable, non-intimidating for beginners learning piano
- **Audio timing constraint**: Closing screen fades background music, plays ONLY typewriter sound synced to text length (not full 15-second audio file)
- **Conversational responses**: Based on user input — if they enter a proud song, Maven says "I love that one too!" to feel more human
- **Tag selection before experience question**: Low-friction visual input first, gradually deeper commitment (text input → URL upload)
- **"희망을 판다" (selling hope) principle**: Show others playing songs before asking user to commit to a goal — beginners need to see success is possible
- **Skip options**: Always provide escape hatches ("I'll find one later", "This is my first time!") to avoid blocking users
- **Closing screen is separate**: Fresh new screen with background music faded out, only typewriter sound, single "Let's go!" button redirects to /dashboard

## 2026-09-03 — Onboarding demo iteration: Wii theme rejected, pixel style adopted
- **Wii theme rejected**: User found rounded corners/soft shadows too generic; wanted more authentic Undertale feel
- **VT323 font**: Google Font for pixel-style text, imported via layout.tsx `<link>` tag
- **Maven character selection**: User picks between BlobNote (blue blob with eyes) or NoteBuddy (single note ♪ shape with eyes) — both are pixel-art SVG components with `imageRendering: pixelated`
- **Background music**: YouTube embed `oTu4WcpB9Iw` (Undertale OST) with `autoplay=1&loop=1&playlist=oTu4WcpB9Iw`
- **Browser audio policy**: Must have "Start" button for user interaction before any audio plays; hidden YouTube iframe won't autoplay without it
- **Demo folder**: `/demo/light` and `/demo/dark` for design option comparison during iteration

## 2026-09-04 — Dashboard backend implementation: SQLite + tRPC + Vitest
- **Why SQLite over Supabase**: README allows any backend; SQLite is zero-config (just a file), works offline, no account setup. Constraint: 2-3 hour time limit
- **Why single `songs` table**: README says "no auth, treat as single user" — no need for separate `users` or `user_progress` tables. All progress fields live on song record
- **tRPC file structure**: `src/server/routers/songs.ts` for CRUD, `src/app/api/trpc/[trpc]/route.ts` for Next.js handler, `src/lib/trpc.ts` + `trpc-provider.tsx` for client
- **File upload**: Separate `/api/upload` route (not tRPC) because tRPC doesn't handle multipart/form-data well. Saves to `public/uploads/` with UUID filename
- **Seed script**: `npm run db:seed` runs `tsx src/db/seed.ts` — uses same 3 MIDI files from `public/samples/` with mock progress data
- **Vitest test gotcha**: Components with duplicate text (SongCard shows "beginner" twice: in badge AND hover overlay) fail `getByText()`. Fixed by using `getAllByText().length` or `getByRole('button', { name: /.../ })`

## 2026-09-03 — Dashboard UI pivot: dark theme, English-only, Netflix hover cards
- **Wii theme rejected for dashboard**: User wanted dark theme (Netflix/Spotify-inspired), not the light Wii theme from onboarding. Onboarding remains light/pixel; dashboard is dark zinc.
- **No emojis in dashboard**: User explicitly requested no emojis — all icons are inline SVG components (`HomeIcon`, `HeartIcon`, `UploadIcon`, etc.)
- **No Korean in dashboard**: Original plan had Korean labels (난이도, 악기, etc.) but user reversed this — dashboard is now English-only
- **"Today's Pick" vs "Continue Playing"**: A screenshot showed "Today's Pick" but the implementation plan (`docs/DASHBOARD_IMPLEMENTATION_PLAN.md`) specifies "Continue Playing" as the hero section header. **Plan document wins over screenshots for copy.** This is a key gotcha: always verify UI copy against the plan, not visual references.
- **Netflix-style hover**: SongCard uses internal `useState` for hover state. Hover overlay must be **absolute positioned** (not in-flow) to avoid pushing rows down and creating spacing issues.
- **Sidebar structure**: Logo at top → "Add transcription" button → Nav items with counts → Profile fixed at bottom with settings icon

## 2026-09-03 — SongCard Netflix hover: absolute positioning and sizing
- **In-flow hover breaks layout**: Original implementation had hover panel in document flow, which pushed the next row down and created large gaps between sections. User caught this immediately.
- **Fix: absolute positioning**: Hover overlay uses `position: absolute; top: 100%` to float below the card without affecting row spacing. Requires removing `overflow-hidden` from card container.
- **z-index layering**: Hovered card gets `z-30`, hover overlay gets `z-40` to float above neighboring cards
- ~~**SongCard hover info decided**: (1) Play button (white circle, 48px), (2) Heart button (40px), (3) Difficulty badge (color-coded pill: green/yellow/red), (4) Duration + BPM line, (5) Progress bar + % if practiced~~ → **SUPERSEDED**: See 2026-09-03 horizontal expansion episode below
- **Card sizing for Netflix feel**: 280px wide, aspect-[16/10] ratio — original ~200px cards felt too small compared to Netflix reference
- **CSS gotcha**: `overflow-hidden` on parent container clips absolutely-positioned children. Move `overflow-hidden` to just the thumbnail div, not the whole card.

## 2026-09-03 — SongCard hover: horizontal expansion, Duration/Learning time/Tags
- **Vertical expansion rejected**: User didn't want card to grow taller on hover — felt awkward. Horizontal panel to the right is cleaner.
- **Hover info changed**: Now shows (1) Duration with ClockIcon, (2) Learning time (practiceMinutes) with BookIcon, (3) Difficulty tag, (4) Progress bar. BPM removed — user cares more about learning progress than tempo.
- **YouTube audio on hover**: Added `youtubeId` field to songs schema. Hidden iframe with `enablejsapi=1`, controlled via `postMessage` to play/pause on hover. Requires user interaction first (browser autoplay policy).
- **Horizontal panel sizing**: 200px wide panel appears to the right of 280px card using `flex` layout on the outer container.
