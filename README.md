# 🌿 AarogyaMind AI

> **Your calm in exam chaos** — an AI-powered mental wellness companion built specifically for Indian competitive exam aspirants.

---

## What is AarogyaMind?

Preparing for NEET, JEE, UPSC, CAT, GATE, or CUET is not just an academic grind — it is a deeply personal, emotionally exhausting marathon. AarogyaMind is a daily wellness app that checks in on how you are feeling, listens to what is stressing you out, and gives you a supportive AI companion named **Aarogya** to talk to — one who actually understands Indian exam culture, the pressure of coaching centres, syllabus anxiety, and the long haul of competitive prep.

No therapy jargon. No generic advice. No lecture. Just a warm, exam-aware friend in your pocket.

---

## Who Is This For?

- Students preparing for **NEET, JEE, UPSC, CAT, GATE, CUET**, or any other competitive exam
- Anyone who wants a private, judgment-free space to process study stress and daily emotions
- Students who feel overwhelmed but do not know where to start talking about it
- Aspirants who want to track their emotional patterns and study-related stress over time
- Anyone who wants to build a consistent daily self-check-in habit alongside their prep routine

---

## Core Features

### 📝 Daily Check-In
Every day, spend 60 seconds logging how you are feeling. The check-in is deliberately short — it will not eat into your study time. You:

- **Pick your mood** from five emotional states: Burned Out 😔 → Stressed 😰 → Okay 😐 → Good 😊 → Motivated 🚀
- **Rate your stress level** on a slider from 1 (completely calm) to 10 (totally overwhelmed), with a color indicator that shifts from green to yellow to red as pressure rises
- **Write a short journal note** in a free-text box — anything from *"I bombed the mock test today"* to *"finally understood organic chemistry reactions"* — Aarogya reads everything with care
- **Tag stressed subjects** from a multi-select list of topics including Math, Physics, Chemistry, Biology, History, Polity, Quant, English, Current Affairs, Geography, Economy, and Other

Once you submit, a confirmation card flashes your updated streak and your selected mood emoji, then smoothly transitions you to the Chat screen.

---

### 💬 Chat With Aarogya
After your check-in, you can open a conversation with **Aarogya** — your AI study companion. What makes Aarogya different from a generic chatbot:

- **Aarogya already knows your context.** Before the conversation even begins, Aarogya has been briefed on which exam you are preparing for, how you are feeling today, your stress level, what subjects are troubling you, and what you wrote in your journal. The conversation starts exactly where you are, not from zero.
- **Aarogya speaks like a supportive senior student**, not a textbook or a therapist. The tone is warm, direct, and motivating without being preachy or clinical.
- **Aarogya is exam-aware.** It understands that NEET has 720 marks and an NTA format, that JEE is brutally competitive, that UPSC is a years-long commitment, that CAT tests VARC and DILR alongside Quant, and that GATE requires deep engineering specialization. Its advice is grounded in that reality.
- **Quick Reply chips** appear below the chat — pre-written prompts you can tap to instantly start common conversations:
  - "I'm feeling overwhelmed 😰"
  - "Give me a breathing exercise 🧘"
  - "Motivate me for today 💪"
  - "Help me focus 🎯"
  - "I can't concentrate 😵"
- **Aarogya always ends with one actionable micro-tip** — a specific, concrete thing you can do in the next few minutes to feel better or study smarter.
- **Conversation history is preserved** across sessions, so you can pick up where you left off.

---

### 📊 Weekly Insights
After a few days of check-ins, the Insights tab becomes your personal mental health mirror:

- **7-Day Mood Chart** — a color-coded bar chart showing your mood levels from Monday through Sunday. Bars are colored by mood intensity: red for burned out, orange for stressed, yellow for okay, green for good, blue for motivated. Missing days show as empty gray bars so you can see your consistency at a glance.
- **Stress Trigger Tags** — AI-identified keywords and subjects from your journal entries that appear most frequently as pain points. These are shown as highlighted pill badges in orange and red tones. For example, if you mentioned "organic chemistry" three times this week, it will surface as a top trigger.
- **Aarogya's Weekly Read** — an AI-generated 2-sentence summary of your emotional pattern for the week, with a mood trend indicator: 📈 Improving, 📉 Declining, or ➡️ Stable. This refreshes automatically every 24 hours as new check-in data comes in.
- **Streak Badge** — your daily check-in fire streak 🔥 displayed prominently. Each day you show up gets counted. If your streak is at zero, you see a gentle prompt to start today.

The insights page uses a demo data seed on first load (if no real entries exist yet), so it looks usefully populated right from the start.

---

### 🔥 Streak Tracker
Visible throughout the app in the top header, the streak counter tracks how many consecutive days you have completed a check-in. It resets if you miss a day, and increments automatically when you submit a new entry. It is a small but meaningful daily accountability mechanism — because consistency in self-care matters just as much as consistency in studying.

---

## Getting Started

### Prerequisites

You need:
- [Node.js](https://nodejs.org/) version 18 or newer (download from nodejs.org if you do not have it)
- A **Groq API key** (free, takes 2 minutes to set up — this powers the AI chat)
- Optionally, a **Google Gemini API key** as a fallback if Groq is unavailable

---

### Step 1 — Get Your API Keys

**Groq (required):**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys → Create API Key
4. Copy the key — it starts with `gsk_`

**Gemini (optional but recommended as backup):**
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with a Google account
3. Click "Create API Key"
4. Copy the key

---

### Step 2 — Clone and Install

Open a terminal and run:

```bash
git clone https://github.com/nitrajsinh-solanki/aarogyamindai.git
cd aarogyamindai
npm install
```

This downloads the code and installs all dependencies. It should take about a minute.

---

### Step 3 — Add Your API Keys

Create a file called `.env.local` in the root folder of the project (the same folder where `package.json` lives). Add the following lines:

```
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
```

Replace `your_groq_key_here` with your actual Groq key and `your_gemini_key_here` with your Gemini key. If you only have Groq, leave the Gemini line out entirely — the app still works.

> ⚠️ **Important:** Never share this `.env.local` file or commit it to GitHub. It contains your private API keys. The `.gitignore` file already excludes it by default.

---

### Step 4 — Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will load and walk you through onboarding automatically.

---

## Your First Experience — A Walkthrough

### Onboarding (30 seconds)
When you open the app for the first time, you will be taken to the onboarding screen. It has three quick steps:

1. **Your name** — Aarogya uses this to greet you personally throughout the app
2. **Your exam** — Choose from NEET, JEE, UPSC, CAT, GATE, CUET, or Other. This shapes every conversation Aarogya has with you — the advice, the context, the tone.
3. **Confirmation** — A warm welcome screen with a "Let's Begin" button

Your profile is saved locally in your browser. You will never need to repeat this unless you clear your browser data.

---

### Daily Check-In (60 seconds)
After onboarding, you land on the Check-In screen. Each time you open the app on a new day, this is where you start.

- Tap the emoji that matches your current mood
- Drag the stress slider to your current pressure level
- Type a few words about your day or study session — even one sentence helps
- Tap the subjects that have been giving you trouble today
- Hit **Submit**

A confirmation card appears with your streak count, then you are taken straight to Chat.

If you have already checked in today, the app detects this automatically and shows an "Already checked in today!" card with a button to jump directly to Chat.

---

### Chatting With Aarogya
The chat screen greets you with a personalized opening message from Aarogya, already tailored to your mood and today's journal. If you are feeling burned out, Aarogya opens with empathy and a grounding technique. If you are feeling motivated, Aarogya matches your energy and helps you channel it.

You can ask anything:
- "I have a mock test tomorrow and I'm terrified"
- "How do I stay consistent with UPSC reading?"
- "I feel like I'm falling behind everyone"
- "Give me a 10-minute focus technique"

Aarogya responds like a knowledgeable, compassionate senior who has been through the same exam pressure — not a bot reciting bullet points.

The chat input supports multi-line messages (Shift+Enter for a new line, Enter to send). The send button grays out while Aarogya is generating a response, and a pulsing three-dot typing indicator shows while you wait. Chat history is preserved across sessions automatically.

---

### Insights Tab
Navigate to the Insights tab using the bottom navigation bar after a few days of check-ins. The tab shows:

- Your mood over the past 7 days as a color bar chart
- Your top stress triggers identified from your journal entries
- Aarogya's written summary of your week
- Your current streak badge

The AI-generated weekly summary is fetched fresh every 24 hours. While it is loading, skeleton placeholders animate in smoothly.

---

## Navigation

The bottom navigation bar has three tabs accessible throughout the app:

| Tab | Icon | What it does |
|-----|------|-------------|
| Check-In | 📝 | Today's mood and journal entry |
| Chat | 💬 | Talk with Aarogya |
| Insights | 📊 | Weekly mood chart and AI analysis |

The active tab is highlighted in brand green. Tapping any tab navigates there instantly.

---

## How the AI Works

AarogyaMind uses a two-layer AI system:

**Primary — Groq (LLaMA 3.1 8B Instant):**
The app first tries to reach Groq's API, which runs Meta's LLaMA 3.1 model at very fast speeds. This is what powers most conversations.

**Fallback — Google Gemini 1.5 Flash:**
If Groq is unavailable or returns an error, the app automatically retries with Gemini 1.5 Flash without any interruption to your experience.

**Hardcoded fallback:**
If both AI services are down, Aarogya still responds — with a warm, empathetic message telling you it is having a connection issue and giving you a practical tip to try in the meantime. The app never leaves you with a cold error screen.

**System prompt context injected before every chat:**
Each time you send a message, the app sends Aarogya a background briefing that includes:
- Your name and exam type
- Today's mood level and stress score
- What you wrote in your journal today
- Exam-specific context (for example, NEET students get responses aware of NTA format and Biology-Physics-Chemistry focus)

This is what makes every conversation feel personal rather than generic.

---

## Privacy and Data Storage

All your data stays entirely on your own device:

- Your name and exam preference
- All daily mood entries and journal text
- Your entire chat history with Aarogya
- Your streak count and weekly insights

Everything is stored in your **browser's localStorage** — it never leaves your device and is not sent to any server. The only information that ever leaves your browser is the chat messages you send to Aarogya, which are transmitted to the Groq or Gemini API to generate a reply. Those messages are used solely to produce the response and are not stored on AarogyaMind's servers.

**What this means practically:**
- Clearing your browser data will erase all your entries and history
- Using the app in a private/incognito window means your data is erased when you close the tab
- Your data is not synced across devices or browsers — it lives only in the browser you use

---

## Supported Exams

| Exam | Coverage |
|------|----------|
| 🩺 NEET | Biology, Physics & Chemistry — NTA format, 720 marks |
| ⚛️ JEE | Math, Physics & Chemistry — IIT aspirants |
| 🏛️ UPSC | Civil Services — History, Polity, Current Affairs, long-haul prep |
| 📊 CAT | MBA Entrance — Quant, VARC, DILR |
| ⚙️ GATE | Engineering Specialization — technical depth |
| 📚 CUET | Central University Entrance |
| 📖 Other | Any exam you are preparing for |

Aarogya's system prompt is calibrated differently for each exam type, so the advice you receive is always relevant to your actual preparation context.

---

## Subject Tags Available

When tagging stressed subjects in your daily check-in, you can choose from:

Math · Physics · Chemistry · Biology · History · Polity · Quant · English · Current Affairs · Geography · Economy · Other

Tags are multi-select — tap any combination that applies to today.

---

## Mood Scale Reference

| Level | Label | Emoji | Color |
|-------|-------|-------|-------|
| 1 | Burned Out | 😔 | Red |
| 2 | Stressed | 😰 | Orange |
| 3 | Okay | 😐 | Yellow |
| 4 | Good | 😊 | Green |
| 5 | Motivated | 🚀 | Blue |

---

## Rate Limits

The app has a built-in rate limiter on the chat API: a maximum of **20 messages per minute** per IP address. This is a safeguard against accidental rapid-fire requests. In normal use you will never hit this limit. If you do, you will see a message asking you to slow down, and you can resume after a minute.

---

## Troubleshooting

**The app opens but Aarogya never responds:**
- Check that your `.env.local` file exists in the root folder and contains a valid `GROQ_API_KEY`
- Make sure you have run `npm install` before `npm run dev`
- Open your browser's developer console (F12 → Console) and look for any red error messages

**I see "Loading your wellness space..." forever:**
- This usually means a JavaScript error on startup
- Open the browser console (F12) and check for errors
- Try clearing your browser's localStorage for `localhost:3000` under Application → Storage → Local Storage

**My streak reset unexpectedly:**
- The streak increments only if your last check-in was yesterday. If you skipped a day, the streak resets to 1 on your next check-in. This is by design.

**The Insights page shows demo data instead of my real entries:**
- The demo data seeds only when no real entries exist. Once you complete at least one real check-in, your actual data appears on the Insights page.

**Chat history disappeared:**
- Chat history is stored in `localStorage`. Clearing browser data, switching browsers, or using incognito mode will erase it.

**The app looks broken on mobile:**
- The app is built for mobile-first use. If something looks off, try rotating your phone to portrait mode. The app is optimized for 375px viewport width and above.

---

## Dark Mode

AarogyaMind fully supports dark mode. It automatically follows your device or browser preference. If your system is set to dark mode, the app switches to a deep green-black palette. No manual toggle is needed.

---

## A Note on What AarogyaMind Is (and Isn't)

AarogyaMind is a **wellness companion**, not a mental health service or a substitute for professional care. It is designed to help you build daily self-awareness habits, process study stress in a low-pressure way, and feel less alone in the grind.

If you are going through something serious — persistent hopelessness, thoughts of self-harm, or a mental health crisis — please reach out to a trusted person in your life or a mental health professional. Aarogya is here for the everyday pressure of exam prep, not for emergencies.

---

## Technology Stack

For the curious:

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom CSS variables for the wellness color system
- **AI:** Groq API (LLaMA 3.1 8B Instant) with Google Gemini 1.5 Flash as fallback
- **Storage:** Browser `localStorage` — fully client-side, zero server storage
- **Fonts:** Inter (Google Fonts)
- **Charts:** Pure CSS/Tailwind bar chart — no charting library dependency
- **Animations:** Custom CSS keyframe animations (fadeInUp, scaleIn, pulse-ring, bounce-dot, shimmer)
- **Security:** Server-side input sanitization, rate limiting (20 req/min), strict security headers (X-Content-Type-Options, X-Frame-Options, CSP, no-store cache), null-byte stripping, control character filtering

---

*Built with care for every student who has ever felt alone in the grind. 💚*