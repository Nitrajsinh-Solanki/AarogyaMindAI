import type { ChatMessage, MoodEntry, UserProfile, WeeklyInsight } from "./types";

// ─── Storage Keys ────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  USER_PROFILE: "aarogya_user_profile",
  MOOD_ENTRIES: "aarogya_mood_entries",
  CHAT_HISTORY: "aarogya_chat_history",
  WEEKLY_INSIGHT: "aarogya_weekly_insight",
  STREAK: "aarogya_streak",
  LAST_ENTRY_DATE: "aarogya_last_entry_date",
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────────

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("[AarogyaMind] localStorage write failed for key:", key);
  }
}

function getTodayDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// ─── User Profile ────────────────────────────────────────────────────────────────

export function saveUserProfile(profile: UserProfile): void {
  safeSet(STORAGE_KEYS.USER_PROFILE, profile);
}

export function getUserProfile(): UserProfile | null {
  return safeGet<UserProfile>(STORAGE_KEYS.USER_PROFILE);
}

export function isOnboarded(): boolean {
  const profile = getUserProfile();
  return profile !== null && !!profile.name && !!profile.exam;
}

// ─── Mood Entries ────────────────────────────────────────────────────────────────

export function saveMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  // Replace if same date already exists
  const idx = entries.findIndex((e) => e.date === entry.date);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  safeSet(STORAGE_KEYS.MOOD_ENTRIES, entries);
}

export function getMoodEntries(): MoodEntry[] {
  return safeGet<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES) ?? [];
}

export function getTodaysMoodEntry(): MoodEntry | null {
  const today = getTodayDateStr();
  const entries = getMoodEntries();
  return entries.find((e) => e.date === today) ?? null;
}

export function getLast7DaysEntries(): MoodEntry[] {
  const entries = getMoodEntries();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  return entries
    .filter((e) => e.date >= cutoffStr)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Chat History ────────────────────────────────────────────────────────────────

export function saveChatHistory(messages: ChatMessage[]): void {
  // Keep only last 50 messages to avoid storage bloat
  const trimmed = messages.slice(-50);
  safeSet(STORAGE_KEYS.CHAT_HISTORY, trimmed);
}

export function getChatHistory(): ChatMessage[] {
  return safeGet<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY) ?? [];
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
}

// ─── Streak ───────────────────────────────────────────────────────────────────────

export function getStreak(): number {
  return safeGet<number>(STORAGE_KEYS.STREAK) ?? 0;
}

/**
 * Updates the streak:
 * - If last entry was yesterday → increment
 * - If last entry was today → no change (already counted)
 * - If gap > 1 day → reset to 1
 * Returns the new streak count.
 */
export function updateStreak(): number {
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();
  const lastDate = safeGet<string>(STORAGE_KEYS.LAST_ENTRY_DATE);
  let streak = getStreak();

  if (lastDate === today) {
    // Already updated today
    return streak;
  } else if (lastDate === yesterday) {
    streak += 1;
  } else {
    // Streak broken or first time
    streak = 1;
  }

  safeSet(STORAGE_KEYS.STREAK, streak);
  safeSet(STORAGE_KEYS.LAST_ENTRY_DATE, today);
  return streak;
}

// ─── Weekly Insight ──────────────────────────────────────────────────────────────

export function saveWeeklyInsight(insight: WeeklyInsight): void {
  safeSet(STORAGE_KEYS.WEEKLY_INSIGHT, insight);
}

export function getWeeklyInsight(): WeeklyInsight | null {
  return safeGet<WeeklyInsight>(STORAGE_KEYS.WEEKLY_INSIGHT);
}

/**
 * Returns true if the stored insight is older than 24 hours or doesn't exist.
 */
export function shouldRefreshInsight(): boolean {
  const insight = getWeeklyInsight();
  if (!insight) return true;
  const generated = new Date(insight.generatedAt).getTime();
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  return now - generated > TWENTY_FOUR_HOURS;
}

// ─── Demo Data Seeder ────────────────────────────────────────────────────────────

export function seedDemoData(): void {
  const existing = getMoodEntries();
  if (existing.length > 0) return; // don't overwrite real data

  const now = new Date();
  const demoEntries: MoodEntry[] = [
    {
      id: `demo_1`,
      date: (() => {
        const d = new Date(now);
        d.setDate(d.getDate() - 6);
        return d.toISOString().split("T")[0];
      })(),
      mood: 2,
      stressLevel: 7,
      journalText:
        "Organic chemistry is killing me. Can't seem to remember all the reactions.",
      stressedSubjects: ["Chemistry"],
      createdAt: new Date(now.getTime() - 6 * 86400000).toISOString(),
    },
    {
      id: `demo_2`,
      date: (() => {
        const d = new Date(now);
        d.setDate(d.getDate() - 5);
        return d.toISOString().split("T")[0];
      })(),
      mood: 2,
      stressLevel: 8,
      journalText: "Mock test went poorly. Physics numericals are so tough.",
      stressedSubjects: ["Physics", "Chemistry"],
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    },
    {
      id: `demo_3`,
      date: (() => {
        const d = new Date(now);
        d.setDate(d.getDate() - 4);
        return d.toISOString().split("T")[0];
      })(),
      mood: 3,
      stressLevel: 5,
      journalText: "Took a short break. Feeling slightly better after the rest.",
      stressedSubjects: [],
      createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    },
    {
      id: `demo_4`,
      date: (() => {
        const d = new Date(now);
        d.setDate(d.getDate() - 3);
        return d.toISOString().split("T")[0];
      })(),
      mood: 4,
      stressLevel: 4,
      journalText:
        "Finally understood thermodynamics! Revision is going well today.",
      stressedSubjects: ["Physics"],
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    },
    {
      id: `demo_5`,
      date: (() => {
        const d = new Date(now);
        d.setDate(d.getDate() - 2);
        return d.toISOString().split("T")[0];
      })(),
      mood: 4,
      stressLevel: 3,
      journalText:
        "Solved 40 MCQs in Biology. Feeling confident about the chapter.",
      stressedSubjects: [],
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    },
  ];

  safeSet(STORAGE_KEYS.MOOD_ENTRIES, demoEntries);
  safeSet(STORAGE_KEYS.STREAK, 3);
  safeSet(
    STORAGE_KEYS.LAST_ENTRY_DATE,
    (() => {
      const d = new Date(now);
      d.setDate(d.getDate() - 2);
      return d.toISOString().split("T")[0];
    })()
  );
}
