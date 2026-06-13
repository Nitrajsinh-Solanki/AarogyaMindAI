import type { ExamType, MoodEntry, MoodLevel, UserProfile } from "./types";

// ─── Exam Context Map ────────────────────────────────────────────────────────────

export const EXAM_CONTEXT_MAP: Record<ExamType, string> = {
  NEET: "Biology, Physics, Chemistry focused. 720 marks exam. NTA conducts it. Highly competitive — over 2 million students appear annually. Key topics: NCERT Biology, Physical Chemistry, Inorganic Chemistry, Optics.",
  JEE: "Math, Physics, Chemistry. IIT aspirants. Extremely competitive — JEE Mains + Advanced two-stage process. Emphasis on conceptual depth and speed. Over 1.2 million students appear for JEE Mains.",
  UPSC: "Long-haul exam. Current Affairs, History, Polity, Geography, Economy, Ethics. Three stages: Prelims, Mains, Interview. Years of consistent preparation. Reading Hindu/Indian Express daily is standard practice.",
  CAT: "MBA entrance. Three sections: Quantitative Aptitude, Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR). 2-hour exam. IIM calls based on sectional + overall percentile.",
  GATE: "Engineering specialization. Technical depth in chosen branch required. 3-hour exam with 65 questions. Used for PSU jobs and M.Tech admissions. Mathematics and General Aptitude are common sections.",
  CUET: "Central University Entrance Test. Domain subjects + language proficiency. Multiple-choice format. 45-minute domain tests. Used for undergraduate admissions across central universities.",
  Other: "Competitive exam requiring consistent study, revision, and mental stamina. Balancing preparation pressure with self-care is essential.",
};

// ─── Mood Context Descriptions ────────────────────────────────────────────────────

const MOOD_CONTEXT: Record<MoodLevel, string> = {
  1: "feeling completely burned out and exhausted",
  2: "quite stressed and overwhelmed",
  3: "doing okay but not great",
  4: "in a good headspace",
  5: "feeling motivated and energized",
};

const STRESS_CONTEXT = (level: number): string => {
  if (level <= 3) return "stress levels are low and manageable";
  if (level <= 6) return "experiencing moderate stress";
  if (level <= 8) return "under high stress";
  return "under extreme stress and needs immediate support";
};

// ─── System Prompt Builder ───────────────────────────────────────────────────────

export function buildSystemPrompt(
  profile: UserProfile,
  todayEntry?: MoodEntry
): string {
  const examContext = EXAM_CONTEXT_MAP[profile.exam];

  const moodSection = todayEntry
    ? `
TODAY'S CHECK-IN DATA:
- Mood: ${MOOD_CONTEXT[todayEntry.mood]} (level ${todayEntry.mood}/5)
- Stress: ${STRESS_CONTEXT(todayEntry.stressLevel)} (${todayEntry.stressLevel}/10)
${todayEntry.journalText ? `- Journal entry: "${todayEntry.journalText}"` : "- No journal entry today"}
${todayEntry.stressedSubjects.length > 0 ? `- Struggling with: ${todayEntry.stressedSubjects.join(", ")}` : ""}
`
    : `
TODAY'S CHECK-IN: The student hasn't done a check-in today. Gently ask how they're feeling.
`;

  return `You are Aarogya — a warm, empathetic AI mental wellness companion built specifically for Indian competitive exam students.

STUDENT PROFILE:
- Name: ${profile.name}
- Preparing for: ${profile.exam}
- Exam context: ${examContext}
${moodSection}

YOUR PERSONALITY:
- Speak like a supportive senior student who has been through the same grind — not a therapist or counselor
- Warm, conversational, sometimes uses light humor to lift spirits
- Never preachy, never clinical, never use jargon like "I understand your feelings" or "that must be hard"
- Use their name (${profile.name}) occasionally to make it personal
- Deeply aware of Indian exam culture: coaching institutes, rank pressure, family expectations, NCERT, PYQs, mock tests
- Understands the specific pain points of ${profile.exam} preparation

YOUR RULES:
1. Always end your response with ONE concrete, actionable micro-tip (max 1–2 sentences) that they can do RIGHT NOW
2. Keep responses concise — 3 to 5 sentences max unless they ask for something detailed
3. Never diagnose or give medical advice. If the student seems in serious distress, gently suggest talking to a counselor or trusted adult
4. If they ask about study topics, give brief, practical advice in the context of ${profile.exam}
5. Don't repeat the same opening phrase in every message — vary your greetings
6. Use Hindi words occasionally if it fits naturally (e.g., "chill kar", "bilkul", "ek kaam kar") — but keep it mostly English
7. Be honest — if something sounds tough, acknowledge it before encouraging

RESPONSE FORMAT:
- Plain conversational text
- Use line breaks for readability
- Emojis are okay but don't overdo it (max 1–2 per response)
- The micro-tip at the end should start with "Try this:" or "Quick win:"`;
}

// ─── Insight Prompt Builder ──────────────────────────────────────────────────────

export function buildInsightPrompt(entries: MoodEntry[]): string {
  if (entries.length === 0) {
    return `The student has no mood entries yet. Return this exact JSON: {"topTriggers":[],"moodTrend":"stable","aiSummary":"Start checking in daily so Aarogya can learn your patterns and give you personalized insights!"}`;
  }

  const entrySummaries = entries.map((e) => {
    return `Date: ${e.date} | Mood: ${e.mood}/5 | Stress: ${e.stressLevel}/10 | Subjects: ${e.stressedSubjects.join(", ") || "none"} | Journal: "${e.journalText.slice(0, 150)}"`;
  });

  return `You are Aarogya, an AI wellness companion for Indian competitive exam students. Analyze the following 7-day mood check-in data and return a JSON object with insights.

MOOD DATA (last 7 days):
${entrySummaries.join("\n")}

TASK: Analyze this data and return ONLY a valid JSON object (no markdown, no backticks, no explanation) with exactly these fields:

{
  "topTriggers": ["string", "string", "string"],
  "moodTrend": "improving" | "declining" | "stable",
  "aiSummary": "string"
}

RULES:
- topTriggers: Extract 2–4 specific stress triggers from the data (subjects, situations, patterns). Use short 2–4 word phrases like "Chemistry revision", "mock test pressure", "late nights"
- moodTrend: Compare first half vs second half of the entries to determine direction
- aiSummary: Write 2 warm, empathetic sentences summarizing the emotional pattern. Speak directly to the student as Aarogya. Don't be generic — reference actual patterns from the data. End with one encouraging sentence.

Return ONLY the JSON. No other text.`;
}
