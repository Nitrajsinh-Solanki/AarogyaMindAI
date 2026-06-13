# 🌿 AarogyaMind AI

> **Your calm in exam chaos** — an AI-powered mental wellness companion built for Indian competitive exam aspirants.

---

## What is AarogyaMind?

Preparing for NEET, JEE, UPSC, CAT, GATE, or CUET is a marathon — mentally and emotionally. AarogyaMind is a daily wellness app that checks in on how you're feeling, listens to what's stressing you out, and gives you a supportive AI companion (Aarogya) to talk to — one who actually understands Indian exam culture.

No therapy jargon. No generic advice. Just a warm, exam-aware friend in your pocket.

---

## Who Is This For?

- Students preparing for **NEET, JEE, UPSC, CAT, GATE, CUET**, or any other competitive exam
- Anyone who wants a private, judgment-free space to process study stress
- Students who feel overwhelmed but don't know where to start talking about it

---

## What Can You Do With It?

### 📝 Daily Check-In
Every day, take 60 seconds to log how you're feeling. Pick your mood (from "Burned Out 😔" to "Motivated 🚀"), rate your stress level, jot down what's on your mind, and tag which subjects are giving you trouble. That's it — short, simple, and actually useful.

### 💬 Chat With Aarogya
After your check-in, talk to Aarogya — your AI study companion. Aarogya already knows what exam you're preparing for and how you're feeling today, so the conversation starts from where you actually are. Ask for study tips, vent about a tough chapter, or just talk about how the day went. Aarogya speaks like a supportive senior student, not a textbook.

### 📊 Weekly Insights
See your mood patterns over the past 7 days, discover what's been stressing you out most (subjects, topics, study sessions), and get an AI-generated weekly summary that helps you understand your own mental patterns — so you can study smarter and protect your wellbeing.

### 🔥 Streak Tracker
Build a daily check-in habit. Your streak grows every day you show up — a small but meaningful reminder that consistency matters, both in prep and in self-care.

---

## Getting Started

### 1. Set Up Your Environment

You'll need:
- [Node.js](https://nodejs.org/) (version 18 or newer)
- A free [Groq API key](https://console.groq.com/) (for the AI chat — takes 2 minutes to get)
- Optionally, a [Google Gemini API key](https://aistudio.google.com/app/apikey) as a fallback

### 2. Clone & Install

```bash
git clone https://github.com/nitrajsinh-solanki/aarogyamindai.git
cd aarogyamindai
npm install
```

### 3. Add Your API Keys

Create a `.env.local` file in the root folder and add:

```
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here   # optional but recommended
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be walked through a quick onboarding — just tell Aarogya your name and which exam you're preparing for.

---

## Your First Experience

1. **Onboarding** — Tell Aarogya your name and pick your exam. Takes 30 seconds.
2. **Daily Check-In** — Log your mood, stress level, and a few words about your day.
3. **Chat** — Aarogya greets you based on how you're actually feeling and is ready to talk.
4. **Insights** — After a few days, head to the Insights tab to see your patterns and get your weekly AI summary.

---

## Privacy

All your journal entries, mood logs, and chat history are stored **locally in your browser**. Nothing is sent to any server except your messages to the AI — and those are only used to generate Aarogya's replies. Your data stays with you.

---

## Supported Exams

| Exam | What it covers |
|------|---------------|
| 🩺 NEET | Biology, Physics & Chemistry |
| ⚛️ JEE | Math, Physics & Chemistry |
| 🏛️ UPSC | Civil Services — History, Polity, Current Affairs |
| 📊 CAT | MBA Entrance — Quant, VARC, DILR |
| ⚙️ GATE | Engineering Specialization |
| 📚 CUET | Central University Entrance |
| 📖 Other | Any exam you're preparing for |

---

## A Note on What AarogyaMind Is (and Isn't)

AarogyaMind is a **wellness companion**, not a mental health service. It's designed to help you build daily self-awareness habits and have a supportive space to process study stress. If you're going through something serious, please reach out to a trusted person or a mental health professional.

---

*Built with care for every student who's ever felt alone in the grind. 💚*