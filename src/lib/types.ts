// ─── Exam Types ─────────────────────────────────────────────────────────────────

export type ExamType =
  | "NEET"
  | "JEE"
  | "UPSC"
  | "CAT"
  | "GATE"
  | "CUET"
  | "Other";

// ─── Mood Scale ──────────────────────────────────────────────────────────────────
// 1 = Burned Out | 2 = Stressed | 3 = Okay | 4 = Good | 5 = Motivated

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export const MOOD_LABELS: Record<MoodLevel, string> = {
  1: "Burned Out",
  2: "Stressed",
  3: "Okay",
  4: "Good",
  5: "Motivated",
};

export const MOOD_EMOJIS: Record<MoodLevel, string> = {
  1: "😔",
  2: "😰",
  3: "😐",
  4: "😊",
  5: "🚀",
};

export const MOOD_COLORS: Record<MoodLevel, string> = {
  1: "var(--mood-1)",
  2: "var(--mood-2)",
  3: "var(--mood-3)",
  4: "var(--mood-4)",
  5: "var(--mood-5)",
};

// ─── Mood Trend ──────────────────────────────────────────────────────────────────

export type MoodTrend = "improving" | "declining" | "stable";

// ─── User Profile ────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  exam: ExamType;
  onboardedAt: string; // ISO date string
}

// ─── Mood Entry ──────────────────────────────────────────────────────────────────

export interface MoodEntry {
  id: string;                    // timestamp-based unique ID
  date: string;                  // ISO date string (YYYY-MM-DD)
  mood: MoodLevel;
  stressLevel: number;           // 1–10
  journalText: string;
  stressedSubjects: string[];    // selected subject tags
  createdAt: string;             // full ISO datetime
}

// ─── Chat Message ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;             // ISO datetime
}

// ─── Weekly Insight ──────────────────────────────────────────────────────────────

export interface WeeklyInsight {
  generatedAt: string;           // ISO datetime
  topTriggers: string[];
  moodTrend: MoodTrend;
  aiSummary: string;
}

// ─── Exam Meta ───────────────────────────────────────────────────────────────────

export interface ExamMeta {
  label: string;
  emoji: string;
  shortDesc: string;
}

export const EXAM_META: Record<ExamType, ExamMeta> = {
  NEET: {
    label: "NEET",
    emoji: "🩺",
    shortDesc: "Biology, Physics & Chemistry",
  },
  JEE: {
    label: "JEE",
    emoji: "⚛️",
    shortDesc: "Math, Physics & Chemistry",
  },
  UPSC: {
    label: "UPSC",
    emoji: "🏛️",
    shortDesc: "Civil Services Exam",
  },
  CAT: {
    label: "CAT",
    emoji: "📊",
    shortDesc: "MBA Entrance — Quant, VARC, DILR",
  },
  GATE: {
    label: "GATE",
    emoji: "⚙️",
    shortDesc: "Engineering Specialization",
  },
  CUET: {
    label: "CUET",
    emoji: "📚",
    shortDesc: "Central University Entrance",
  },
  Other: {
    label: "Other",
    emoji: "📖",
    shortDesc: "My own exam",
  },
};

// ─── API Payloads ────────────────────────────────────────────────────────────────

export interface ChatAPIRequest {
  messages: ChatMessage[];
  userProfile: UserProfile;
  todayEntry?: MoodEntry;
}

export interface ChatAPIResponse {
  reply: string;
}

export interface InsightsAPIRequest {
  entries: MoodEntry[];
  userProfile: UserProfile;
}

export interface InsightsAPIResponse {
  topTriggers: string[];
  moodTrend: MoodTrend;
  aiSummary: string;
}

// ─── Subject Tags ────────────────────────────────────────────────────────────────

export const SUBJECT_TAGS: string[] = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Polity",
  "Quant",
  "English",
  "Current Affairs",
  "Geography",
  "Economy",
  "Other",
];
