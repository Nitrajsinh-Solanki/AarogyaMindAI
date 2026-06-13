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

// ─── Constants ───────────────────────────────────────────────────────────────────

const MAX_MOOD_ENTRIES = 365;
const MAX_CHAT_MESSAGES = 50;
const MAX_JOURNAL_LENGTH = 500;
const MAX_NAME_LENGTH = 60;
const MAX_SUBJECT_LENGTH = 50;
const VALID_EXAM_TYPES = ["NEET", "JEE", "UPSC", "CAT", "GATE", "CUET", "Other"] as const;
const VALID_MOOD_LEVELS = [1, 2, 3, 4, 5] as const;

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

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function getTodayDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// ─── Type-safe conversion helper ────────────────────────────────────────────────
// Use this whenever a strongly-typed object (MoodEntry, ChatMessage, etc.) needs
// to be treated as a generic Record for storage/serialization. Going through
// `unknown` first satisfies TS2352 because the source and target types don't
// structurally overlap (no index signature on the source interfaces).
function toRecord<T extends object>(value: T): Record<string, unknown> {
  return value as unknown as Record<string, unknown>;
}

function isValidMoodEntry(entry: unknown): entry is MoodEntry {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
  const e = entry as Record<string, unknown>;
  if (!VALID_MOOD_LEVELS.includes(e.mood as (typeof VALID_MOOD_LEVELS)[number])) return false;
  if (typeof e.stressLevel !== "number" || e.stressLevel < 1 || e.stressLevel > 10) return false;
  if (typeof e.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) return false;
  return true;
}

function isValidChatMessage(msg: unknown): msg is ChatMessage {
  if (!msg || typeof msg !== "object" || Array.isArray(msg)) return false;
  const m = msg as Record<string, unknown>;
  return (
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    m.content.length > 0
  );
}

function sanitizeMoodEntry(raw: unknown): MoodEntry | null {
  if (!isValidMoodEntry(raw)) return null;
  const e = raw as unknown as Record<string, unknown>;
  return {
    id: sanitizeString(e.id, 64) || `entry_${Date.now()}`,
    date: sanitizeString(e.date, 10),
    mood: e.mood as MoodEntry["mood"],
    stressLevel: Math.round(Number(e.stressLevel)),
    journalText: sanitizeString(e.journalText, MAX_JOURNAL_LENGTH),
    stressedSubjects: Array.isArray(e.stressedSubjects)
      ? e.stressedSubjects
        .filter((s): s is string => typeof s === "string")
        .map((s) => sanitizeString(s, MAX_SUBJECT_LENGTH))
        .filter(Boolean)
        .slice(0, 10)
      : [],
    createdAt:
      typeof e.createdAt === "string" ? sanitizeString(e.createdAt, 30) : new Date().toISOString(),
  };
}

function sanitizeChatMessage(raw: unknown): ChatMessage | null {
  if (!isValidChatMessage(raw)) return null;
  const m = raw as unknown as Record<string, unknown>;
  return {
    id: sanitizeString(m.id, 64) || `msg_${Date.now()}`,
    role: m.role as "user" | "assistant",
    content: sanitizeString(m.content, 1000),
    timestamp:
      typeof m.timestamp === "string" ? sanitizeString(m.timestamp, 30) : new Date().toISOString(),
  };
}

// ─── User Profile ────────────────────────────────────────────────────────────────

export function saveUserProfile(profile: UserProfile): void {
  if (!profile || typeof profile !== "object") return;
  if (!VALID_EXAM_TYPES.includes(profile.exam as (typeof VALID_EXAM_TYPES)[number])) return;

  const sanitized: UserProfile = {
    name: sanitizeString(profile.name, MAX_NAME_LENGTH),
    exam: profile.exam,
    onboardedAt:
      typeof profile.onboardedAt === "string"
        ? sanitizeString(profile.onboardedAt, 30)
        : new Date().toISOString(),
  };

  if (!sanitized.name) return;
  safeSet(STORAGE_KEYS.USER_PROFILE, sanitized);
}

export function getUserProfile(): UserProfile | null {
  const raw = safeGet<unknown>(STORAGE_KEYS.USER_PROFILE);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const p = raw as Record<string, unknown>;
  if (!VALID_EXAM_TYPES.includes(p.exam as (typeof VALID_EXAM_TYPES)[number])) return null;

  const name = sanitizeString(p.name, MAX_NAME_LENGTH);
  if (!name) return null;

  return {
    name,
    exam: p.exam as UserProfile["exam"],
    onboardedAt:
      typeof p.onboardedAt === "string"
        ? sanitizeString(p.onboardedAt, 30)
        : new Date().toISOString(),
  };
}

export function isOnboarded(): boolean {
  const profile = getUserProfile();
  return profile !== null && !!profile.name && !!profile.exam;
}

// ─── Mood Entries ────────────────────────────────────────────────────────────────

export function saveMoodEntry(entry: MoodEntry): void {
  const sanitized = sanitizeMoodEntry(entry);
  if (!sanitized) return;

  const entries = getMoodEntries();
  const idx = entries.findIndex((e) => e.date === sanitized.date);
  if (idx >= 0) {
    entries[idx] = sanitized;
  } else {
    entries.push(sanitized);
    // Cap total entries
    if (entries.length > MAX_MOOD_ENTRIES) {
      entries.splice(0, entries.length - MAX_MOOD_ENTRIES);
    }
  }

  safeSet(STORAGE_KEYS.MOOD_ENTRIES, entries);
}

export function getMoodEntries(): MoodEntry[] {
  const raw = safeGet<unknown[]>(STORAGE_KEYS.MOOD_ENTRIES);
  if (!Array.isArray(raw)) return [];
  return raw
    .map((e) => sanitizeMoodEntry(e))
    .filter((e): e is MoodEntry => e !== null);
}

export function getTodayEntry(): MoodEntry | null {
  const today = getTodayDateStr();
  return getMoodEntries().find((e) => e.date === today) ?? null;
}

export function getTodaysMoodEntry(): MoodEntry | null {
  return getTodayEntry();
}

export function hasCheckedInToday(): boolean {
  return getTodayEntry() !== null;
}

/**
 * Returns the mood entries from the last 7 days (most recent first if reversed
 * by the caller). Days with no entry are simply absent — no placeholder data.
 */
export function getLast7DaysEntries(): MoodEntry[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // includes today => 7 days
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return getMoodEntries().filter((e) => {
    const entryDate = new Date(e.date);
    return entryDate >= sevenDaysAgo;
  });
}

/**
 * Returns a single mood entry as a plain serializable record
 * (useful for export/debug tooling or analytics payloads).
 */
export function getMoodEntryAsRecord(date: string): Record<string, unknown> | null {
  const entry = getMoodEntries().find((e) => e.date === date);
  if (!entry) return null;
  return toRecord(entry);
}

// ─── Chat History ────────────────────────────────────────────────────────────────

export function getChatHistory(): ChatMessage[] {
  const raw = safeGet<unknown[]>(STORAGE_KEYS.CHAT_HISTORY);
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m) => sanitizeChatMessage(m))
    .filter((m): m is ChatMessage => m !== null);
}

export function saveChatMessage(message: ChatMessage): void {
  const sanitized = sanitizeChatMessage(message);
  if (!sanitized) return;

  const history = getChatHistory();
  history.push(sanitized);

  if (history.length > MAX_CHAT_MESSAGES) {
    history.splice(0, history.length - MAX_CHAT_MESSAGES);
  }

  safeSet(STORAGE_KEYS.CHAT_HISTORY, history);
}

/**
 * Replaces the entire chat history with the provided array of messages.
 * Each message is sanitized before storing. The array is capped at
 * MAX_CHAT_MESSAGES (50) — the most recent messages are kept.
 *
 * This is used by chat/page.tsx which manages the full messages array
 * in React state and persists the whole snapshot on every update.
 */
export function saveChatHistory(messages: ChatMessage[]): void {
  if (!Array.isArray(messages)) return;

  const sanitized = messages
    .map((m) => sanitizeChatMessage(m))
    .filter((m): m is ChatMessage => m !== null);

  // Keep only the most recent MAX_CHAT_MESSAGES entries
  const capped =
    sanitized.length > MAX_CHAT_MESSAGES
      ? sanitized.slice(sanitized.length - MAX_CHAT_MESSAGES)
      : sanitized;

  safeSet(STORAGE_KEYS.CHAT_HISTORY, capped);
}

export function clearChatHistory(): void {
  safeSet(STORAGE_KEYS.CHAT_HISTORY, []);
}

/**
 * Returns a single chat message as a plain serializable record
 * (useful for export/debug tooling or analytics payloads).
 */
export function getChatMessageAsRecord(id: string): Record<string, unknown> | null {
  const message = getChatHistory().find((m) => m.id === id);
  if (!message) return null;
  return toRecord(message);
}

// ─── Streak ──────────────────────────────────────────────────────────────────────

export function getStreak(): number {
  return safeGet<number>(STORAGE_KEYS.STREAK) ?? 0;
}

export function updateStreak(): number {
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();
  const lastEntryDate = safeGet<string>(STORAGE_KEYS.LAST_ENTRY_DATE);
  const currentStreak = getStreak();

  let streak: number;
  if (lastEntryDate === today) {
    return currentStreak;
  } else if (lastEntryDate === yesterday) {
    streak = currentStreak + 1;
  } else {
    streak = 1;
  }

  safeSet(STORAGE_KEYS.STREAK, streak);
  safeSet(STORAGE_KEYS.LAST_ENTRY_DATE, today);
  return streak;
}

// ─── Weekly Insight ──────────────────────────────────────────────────────────────

export function saveWeeklyInsight(insight: WeeklyInsight): void {
  if (!insight || typeof insight !== "object") return;
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
  if (typeof insight.generatedAt !== "string") return true;
  const generated = new Date(insight.generatedAt).getTime();
  if (isNaN(generated)) return true;
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  return now - generated > TWENTY_FOUR_HOURS;
}