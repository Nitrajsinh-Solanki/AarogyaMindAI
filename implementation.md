# 🏆 AarogyaMind AI — Complete In-Depth Implementation Plan

## 📁 Complete File Structure (With Routes)

```
nitrajsinh-solanki-aarogyamindai/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── src/
    ├── app/
    │   ├── globals.css                    ← UPDATE (color tokens)
    │   ├── layout.tsx                     ← UPDATE (title, meta)
    │   ├── page.tsx                       ← UPDATE (redirect or landing)
    │   │
    │   ├── onboarding/
    │   │   └── page.tsx                   ← NEW ROUTE /onboarding
    │   │
    │   ├── checkin/
    │   │   └── page.tsx                   ← NEW ROUTE /checkin
    │   │
    │   ├── chat/
    │   │   └── page.tsx                   ← NEW ROUTE /chat
    │   │
    │   ├── insights/
    │   │   └── page.tsx                   ← NEW ROUTE /insights
    │   │
    │   └── api/
    │       ├── chat/
    │       │   └── route.ts               ← NEW API /api/chat (Groq + Gemini fallback)
    │       └── insights/
    │           └── route.ts               ← NEW API /api/insights (weekly AI summary)
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx                 ← Bottom tab navigation
    │   │   ├── Header.tsx                 ← Top header with logo + streak
    │   │   └── PageWrapper.tsx            ← Consistent page padding + bg
    │   │
    │   ├── onboarding/
    │   │   ├── OnboardingForm.tsx         ← Exam picker + name input
    │   │   └── ExamCard.tsx               ← Individual exam option card
    │   │
    │   ├── checkin/
    │   │   ├── MoodSelector.tsx           ← 5 emoji mood picker
    │   │   ├── StressSlider.tsx           ← 1–10 stress level slider
    │   │   ├── JournalTextarea.tsx        ← Open-ended journal input
    │   │   ├── SubjectTags.tsx            ← Stressed subject tag picker
    │   │   └── CheckinSummary.tsx         ← Post-submit confirmation card
    │   │
    │   ├── chat/
    │   │   ├── ChatInterface.tsx          ← Full chat UI container
    │   │   ├── ChatBubble.tsx             ← Individual message bubble
    │   │   ├── ChatInput.tsx              ← Message input + send button
    │   │   ├── TypingIndicator.tsx        ← Pulsing dots while AI responds
    │   │   └── QuickReplies.tsx           ← Suggestion chips
    │   │
    │   └── insights/
    │       ├── InsightsDashboard.tsx      ← Main insights container
    │       ├── MoodChart.tsx              ← 7-day mood bar chart (CSS only)
    │       ├── StreakBadge.tsx            ← Streak fire counter
    │       ├── TriggerTags.tsx            ← Stress trigger keyword cloud
    │       └── WeeklyInsightCard.tsx      ← AI-generated weekly summary card
    │
    └── lib/
        ├── types.ts                       ← All TypeScript interfaces
        ├── storage.ts                     ← localStorage helpers
        ├── prompts.ts                     ← System prompt builder
        └── ai.ts                          ← Groq → Gemini API caller
```

---

## 🎨 PHASE 1 — Foundation (0–15 min)

---

### `src/app/globals.css`

**What to do:**
- Keep the existing `@import "tailwindcss"` at the top
- Define a custom color palette using CSS variables inside `:root`
- Add dark mode overrides under `@media (prefers-color-scheme: dark)`
- Define the wellness color system:
  - `--brand-green: #16a34a` — primary CTA color
  - `--brand-green-light: #dcfce7` — background tints
  - `--brand-teal: #0d9488` — secondary accent
  - `--mood-1: #ef4444` (burned out red)
  - `--mood-2: #f97316` (stressed orange)
  - `--mood-3: #eab308` (okay yellow)
  - `--mood-4: #22c55e` (good green)
  - `--mood-5: #3b82f6` (motivated blue)
- Add a `.gradient-bg` class with a subtle green-to-teal diagonal gradient
- Add a `.card` utility class — white bg, rounded-2xl, shadow-md, padding
- Add smooth scroll behavior on `html`

---

### `src/app/layout.tsx`

**What to do:**
- Change `metadata.title` to `"AarogyaMind — Your Calm in Exam Chaos"`
- Change `metadata.description` to `"AI-powered mental wellness companion for NEET, JEE, UPSC, CAT, GATE students"`
- Add `metadata.themeColor` — `#16a34a`
- Keep the Google Fonts link for Inter already present
- Add a viewport meta for proper mobile rendering
- The body should have `bg-zinc-50 dark:bg-zinc-950` as base

---

### `src/lib/types.ts`

**What to define:**

```
EXAM_TYPES = "NEET" | "JEE" | "UPSC" | "CAT" | "GATE" | "CUET" | "Other"

MOOD_LEVEL = 1 | 2 | 3 | 4 | 5
  (1 = Burned Out, 2 = Stressed, 3 = Okay, 4 = Good, 5 = Motivated)

UserProfile {
  name: string
  exam: EXAM_TYPES
  onboardedAt: string (ISO date)
}

MoodEntry {
  id: string (timestamp-based)
  date: string (ISO date)
  mood: MOOD_LEVEL
  stressLevel: number (1–10)
  journalText: string
  stressedSubject: string (optional)
  createdAt: string
}

ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

WeeklyInsight {
  generatedAt: string
  topTriggers: string[]
  moodTrend: "improving" | "declining" | "stable"
  aiSummary: string
}
```

---

### `src/lib/storage.ts`

**What to define — all functions:**

```
STORAGE KEYS (constants):
  USER_PROFILE_KEY = "aarogya_user_profile"
  MOOD_ENTRIES_KEY = "aarogya_mood_entries"
  CHAT_HISTORY_KEY = "aarogya_chat_history"
  WEEKLY_INSIGHT_KEY = "aarogya_weekly_insight"
  STREAK_KEY = "aarogya_streak"

FUNCTIONS:
  saveUserProfile(profile: UserProfile): void
  getUserProfile(): UserProfile | null
  isOnboarded(): boolean

  saveMoodEntry(entry: MoodEntry): void
  getMoodEntries(): MoodEntry[]
  getTodaysMoodEntry(): MoodEntry | null
  getLast7DaysEntries(): MoodEntry[]

  saveChatHistory(messages: ChatMessage[]): void
  getChatHistory(): ChatMessage[]
  clearChatHistory(): void

  getStreak(): number
  updateStreak(): number   ← increments if last entry was yesterday, resets if gap > 1 day

  saveWeeklyInsight(insight: WeeklyInsight): void
  getWeeklyInsight(): WeeklyInsight | null
```

---

### `src/lib/prompts.ts`

**What to define:**

```
buildSystemPrompt(profile: UserProfile, todayEntry?: MoodEntry): string
  → Injects exam type, mood score, journal text
  → Instructs AI to be warm, empathetic, exam-aware
  → Never be preachy or clinical
  → Always end with ONE actionable micro-tip
  → Speaks like a supportive senior student
  → Knows Indian exam context deeply

buildInsightPrompt(entries: MoodEntry[]): string
  → Takes last 7 days of entries
  → Asks AI to extract top 3 stress triggers
  → Summarize emotional pattern in 2 sentences
  → Return JSON: { topTriggers: string[], moodTrend: string, aiSummary: string }

EXAM_CONTEXT_MAP object:
  NEET → "Biology, Physics, Chemistry focused. 720 marks exam. NTA conducts it."
  JEE → "Math, Physics, Chemistry. IIT aspirants. Extremely competitive."
  UPSC → "Long-haul exam. Current affairs, history, polity. Years of prep."
  CAT → "MBA entrance. Quant, VARC, DILR. 2-hour exam."
  GATE → "Engineering specialization. Technical depth required."
```

---

### `src/lib/ai.ts`

**What to define:**

```
GROQ_CONFIG:
  endpoint: "https://api.groq.com/openai/v1/chat/completions"
  model: "llama-3.1-8b-instant"
  headers: Authorization: Bearer + GROQ_API_KEY env var

GEMINI_CONFIG:
  endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
  model: "gemini-1.5-flash"
  uses: GEMINI_API_KEY env var in query param

callGroq(messages: array, systemPrompt: string): Promise<string>
  → POST to Groq endpoint
  → Returns response text
  → Throws on non-200

callGemini(messages: array, systemPrompt: string): Promise<string>
  → Converts OpenAI-style messages to Gemini format
  → POST to Gemini endpoint
  → Returns response text
  → Throws on non-200

callAI(messages: array, systemPrompt: string): Promise<string>
  → Try callGroq first
  → On any error, catch and try callGemini
  → On both fail, return a hardcoded empathetic fallback message
```

---

## 🛣️ PHASE 2 — Routes (15–25 min)

---

### `src/app/page.tsx` — Smart Redirect

**What to do:**
- This is a CLIENT COMPONENT (`"use client"`)
- On mount, check `isOnboarded()` from storage
- If not onboarded → `router.replace("/onboarding")`
- If onboarded + no today's entry → `router.replace("/checkin")`
- If onboarded + has today's entry → `router.replace("/chat")`
- Show a brief fullscreen loading spinner with the AarogyaMind logo while redirecting
- Use `useRouter` and `useEffect` from Next.js

---

### `src/app/onboarding/page.tsx`

**What to do:**
- CLIENT COMPONENT
- Check `isOnboarded()` on mount — if already done, redirect to `/checkin`
- Render the `<OnboardingForm />` component
- On form completion, call `saveUserProfile()` then `router.push("/checkin")`
- Page title: "Welcome to AarogyaMind"
- Full-height centered layout with the gradient background

---

### `src/app/checkin/page.tsx`

**What to do:**
- CLIENT COMPONENT
- Check `isOnboarded()` on mount — if not, redirect to `/onboarding`
- Load `getUserProfile()` to personalize greeting
- Check `getTodaysMoodEntry()` — if already checked in today, show a "Already checked in today" card with button to go to `/chat`
- Render `<Header />` + `<MoodSelector />` + `<StressSlider />` + `<JournalTextarea />` + `<SubjectTags />` + Submit button
- On submit:
  - Build MoodEntry from form state
  - `saveMoodEntry(entry)`
  - `updateStreak()`
  - Show `<CheckinSummary />` for 2 seconds
  - Then `router.push("/chat")`
- Render `<Navbar />` at the bottom

---

### `src/app/chat/page.tsx`

**What to do:**
- CLIENT COMPONENT
- Check `isOnboarded()` — redirect to `/onboarding` if not
- Load `getUserProfile()` and `getTodaysMoodEntry()` and `getChatHistory()`
- If chat history is empty, auto-inject an opening message from Aarogya based on today's mood entry (build this greeting using the mood + exam context)
- Pass everything to `<ChatInterface />`
- On each new message sent, save updated history via `saveChatHistory()`
- Render `<Header />` + `<ChatInterface />` + `<Navbar />`

---

### `src/app/insights/page.tsx`

**What to do:**
- CLIENT COMPONENT
- Check `isOnboarded()` — redirect if not
- Load `getLast7DaysEntries()` and `getWeeklyInsight()` and `getStreak()`
- If `weeklyInsight` is null or older than 24 hours:
  - Call `POST /api/insights` with last 7 entries
  - Save result via `saveWeeklyInsight()`
- Render `<Header />` + `<StreakBadge />` + `<MoodChart />` + `<TriggerTags />` + `<WeeklyInsightCard />` + `<Navbar />`

---

## 🔌 PHASE 3 — API Routes (25–40 min)

---

### `src/app/api/chat/route.ts`

**What to do:**
- Export `POST` async function
- Accept JSON body: `{ messages: ChatMessage[], userProfile: UserProfile, todayEntry?: MoodEntry }`
- Build system prompt using `buildSystemPrompt(userProfile, todayEntry)`
- Convert `ChatMessage[]` to the OpenAI-compatible format `[{role, content}]`
- Call `callAI(messages, systemPrompt)` from `lib/ai.ts`
- Return `Response.json({ reply: string })`
- Wrap in try/catch — return 500 with fallback message on error
- Set CORS headers if needed

---

### `src/app/api/insights/route.ts`

**What to do:**
- Export `POST` async function
- Accept JSON body: `{ entries: MoodEntry[], userProfile: UserProfile }`
- Build the insight prompt using `buildInsightPrompt(entries)`
- Call `callAI` with a single user message containing all journal data
- Parse the JSON response (strip any markdown backticks before parsing)
- Return `Response.json({ topTriggers, moodTrend, aiSummary })`
- If JSON parsing fails, return safe defaults: `{ topTriggers: [], moodTrend: "stable", aiSummary: "Keep going!" }`

---

## 🖼️ PHASE 4 — Components (40–75 min)

---

### Layout Components

**`src/components/layout/Header.tsx`**
- Shows AarogyaMind logo (text-based, green color) on left
- Shows `<StreakBadge />` on right (small, compact version)
- Shows current exam badge (e.g., "JEE 🎯") in center
- Sticky top, white bg, subtle border-bottom

**`src/components/layout/Navbar.tsx`**
- Fixed bottom navigation bar
- 3 tabs: Check-in (📝), Chat (💬), Insights (📊)
- Active tab highlighted in brand-green
- Each tab uses `usePathname()` to detect active route
- `router.push()` on tap

**`src/components/layout/PageWrapper.tsx`**
- Simple wrapper: `min-h-screen`, proper padding-bottom for navbar
- Accepts `children` and optional `className`

---

### Onboarding Components

**`src/components/onboarding/OnboardingForm.tsx`**
- Step 1: Name input ("What should Aarogya call you?")
- Step 2: Exam picker using `<ExamCard />` grid
- Step 3: Motivational confirmation screen with "Let's Begin" button
- Uses local `step` state (1, 2, 3) to render each step
- Smooth CSS transition between steps
- On step 3 confirm → calls `onComplete(profile)` prop

**`src/components/onboarding/ExamCard.tsx`**
- Card component: exam name + emoji + short description
- Selectable (border-green ring when selected)
- Props: `exam`, `isSelected`, `onSelect`
- Exams: NEET 🩺, JEE ⚛️, UPSC 🏛️, CAT 📊, GATE ⚙️, CUET 📚, Other 📖

---

### Check-in Components

**`src/components/checkin/MoodSelector.tsx`**
- 5 large emoji buttons in a row
- Each emoji has label below: "Burned Out", "Stressed", "Okay", "Good", "Motivated"
- Selected mood has a colored ring + scale-up animation
- On select → calls `onMoodSelect(mood: MOOD_LEVEL)` prop

**`src/components/checkin/StressSlider.tsx`**
- HTML range input styled with Tailwind
- Left label: "😌 Calm" → Right label: "😤 Overwhelmed"
- Shows numeric value in the center (large, colored based on value)
- Color changes: green (1–3), yellow (4–6), red (7–10)
- Calls `onStressChange(value: number)` prop

**`src/components/checkin/JournalTextarea.tsx`**
- Textarea with placeholder: *"How was your study session? What's on your mind? Aarogya reads everything with care 💚"*
- Auto-resize as user types
- Character counter bottom-right (max 500)
- Subtle green focus ring

**`src/components/checkin/SubjectTags.tsx`**
- Row of clickable tag pills: Math, Physics, Chemistry, Biology, History, Polity, Quant, English, Current Affairs, Other
- Multi-select (toggle on/off)
- Selected tags have filled green background
- Calls `onTagsChange(tags: string[])` prop

**`src/components/checkin/CheckinSummary.tsx`**
- Full-screen overlay card shown after submit
- Shows: mood emoji (large), "Check-in saved!" text, streak update ("🔥 3 day streak!")
- Auto-dismisses after 2 seconds
- Green animated checkmark icon

---

### Chat Components

**`src/components/chat/ChatInterface.tsx`**
- Main container with `flex flex-col h-full`
- Renders list of `<ChatBubble />` components
- Auto-scrolls to bottom on new message (useRef + scrollIntoView)
- Shows `<TypingIndicator />` while awaiting AI response
- Shows `<QuickReplies />` below chat area when last message is from AI
- Calls `POST /api/chat` on new message
- Manages `messages` state locally, persists to localStorage after each exchange

**`src/components/chat/ChatBubble.tsx`**
- User messages: right-aligned, green background, white text, rounded-tl-2xl
- AI messages: left-aligned, white background, dark text, rounded-tr-2xl, has Aarogya avatar (🌿 emoji or small green circle)
- Timestamp shown below each bubble (small, gray)
- AI message supports line breaks and simple formatting

**`src/components/chat/ChatInput.tsx`**
- Sticky bottom input bar
- Textarea (single-line, expands on shift+enter)
- Send button (green arrow icon)
- Disabled + grayed out while AI is responding
- On Enter key (without shift) → trigger send

**`src/components/chat/TypingIndicator.tsx`**
- Three dots with a bounce animation (staggered)
- Appears in a chat bubble styled like AI message
- Pure CSS animation

**`src/components/chat/QuickReplies.tsx`**
- Horizontal scrollable row of pill buttons
- Suggestions:
  - "I'm feeling overwhelmed 😰"
  - "Give me a breathing exercise 🧘"
  - "Motivate me for today 💪"
  - "Help me focus 🎯"
  - "I can't concentrate 😵"
- Tapping a chip fills the input and auto-sends
- Hidden once user has started typing

---

### Insights Components

**`src/components/insights/MoodChart.tsx`**
- Pure CSS/Tailwind bar chart (no library needed)
- X-axis: last 7 days (Mon, Tue, etc.)
- Y-axis: mood level 1–5
- Bars colored by mood (red → orange → yellow → green → blue)
- Missing days shown as gray empty bars
- Legend below: mood level color coding

**`src/components/insights/StreakBadge.tsx`**
- Large fire emoji 🔥 + streak number
- Subtext: "day check-in streak"
- If streak = 0, show "Start your streak today!" in gray

**`src/components/insights/TriggerTags.tsx`**
- Section title: "Your Stress Triggers This Week"
- Renders tags from `WeeklyInsight.topTriggers`
- Tags shown as rounded pill badges in orange/red tones
- If no data, show "Complete more check-ins to unlock pattern detection"

**`src/components/insights/WeeklyInsightCard.tsx`**
- Green gradient card
- Header: "🧠 Aarogya's Weekly Read"
- Body: `aiSummary` text from WeeklyInsight
- Footer: mood trend indicator — "📈 Improving", "📉 Declining", "➡️ Stable"
- Loading skeleton while fetching

---

## 🔑 PHASE 5 — Environment Setup (parallel, do while coding)

### `.env.local` (create in root)

```
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
```

**Where to get free keys:**
- Groq: console.groq.com → free tier → `llama-3.1-8b-instant`
- Gemini: aistudio.google.com → Get API Key → free tier → `gemini-1.5-flash`

**In `next.config.ts`:**
- These are server-side env vars — accessed only in `/api/` route files
- Never expose to client — no `NEXT_PUBLIC_` prefix

---

## ✅ PHASE 6 — Polish (75–90 min)

**`src/app/page.tsx` loading screen:**
- Show AarogyaMind logo centered
- Animated green pulse ring around a leaf/heart emoji
- "Loading your wellness space..." text

**Demo mode:**
- In `storage.ts` add a `seedDemoData()` function
- Pre-fills 5 days of mood entries with varied moods and journal texts
- Call it if entries array is empty on first load of insights page
- This ensures the insights page looks populated during demo

**Mobile check:**
- All pages should look good at 375px width
- Navbar should not overlap content (use `pb-20` on page content)
- Chat input should not be hidden by mobile keyboard (use `fixed bottom-0`)

**Final `layout.tsx` metadata:**
- Add Open Graph tags for a professional look
- Add `apple-mobile-web-app-capable` for PWA feel

---

## 🏃 Execution Order (Strict)

```
1.  globals.css + types.ts + storage.ts          (10 min)
2.  prompts.ts + ai.ts                           (8 min)
3.  api/chat/route.ts + api/insights/route.ts    (7 min)
4.  page.tsx (redirect) + layout.tsx             (5 min)
5.  onboarding/page.tsx + OnboardingForm + ExamCard  (10 min)
6.  checkin/page.tsx + all 5 checkin components  (15 min)
7.  chat/page.tsx + all 5 chat components        (15 min)
8.  insights/page.tsx + all 4 insight components (10 min)
9.  Navbar + Header + PageWrapper                (5 min)
10. Polish + demo data + test full flow          (5 min)
```

**Total: 90 minutes exactly. Now go build it. 🚀**