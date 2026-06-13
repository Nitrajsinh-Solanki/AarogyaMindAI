import { callAI } from "@/lib/ai";
import { buildInsightPrompt } from "@/lib/prompts";
import type {
  InsightsAPIResponse,
  MoodEntry,
  MoodTrend,
  UserProfile,
} from "@/lib/types";
import { NextRequest } from "next/server";

// ─── Security Constants ──────────────────────────────────────────────────────────
const MAX_ENTRIES = 7;
const MAX_JOURNAL_LENGTH = 500;
const MAX_NAME_LENGTH = 60;
const VALID_EXAM_TYPES = ["NEET", "JEE", "UPSC", "CAT", "GATE", "CUET", "Other"] as const;

// ─── Security Headers ────────────────────────────────────────────────────────────
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'none'",
  "Cache-Control": "no-store",
};

// ─── Safe Defaults ───────────────────────────────────────────────────────────────
const SAFE_DEFAULTS: InsightsAPIResponse = {
  topTriggers: [],
  moodTrend: "stable",
  aiSummary:
    "Keep checking in daily so Aarogya can learn your patterns and give you personalized insights! Every entry helps build a clearer picture of your wellness journey.",
};

// ─── Sanitizer ───────────────────────────────────────────────────────────────────

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function isValidExamType(exam: unknown): exam is (typeof VALID_EXAM_TYPES)[number] {
  return VALID_EXAM_TYPES.includes(exam as (typeof VALID_EXAM_TYPES)[number]);
}

// ─── Entry Sanitizer ─────────────────────────────────────────────────────────────

function sanitizeEntry(raw: unknown): MoodEntry | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const e = raw as Record<string, unknown>;

  const mood =
    typeof e.mood === "number" && Number.isInteger(e.mood) && e.mood >= 1 && e.mood <= 5
      ? (e.mood as 1 | 2 | 3 | 4 | 5)
      : null;
  if (!mood) return null;

  const stressLevel =
    typeof e.stressLevel === "number" && e.stressLevel >= 1 && e.stressLevel <= 10
      ? Math.round(e.stressLevel)
      : 5;

  const stressedSubjects = Array.isArray(e.stressedSubjects)
    ? e.stressedSubjects
        .filter((s): s is string => typeof s === "string")
        .map((s) => sanitizeString(s, 50))
        .filter(Boolean)
        .slice(0, 10)
    : [];

  return {
    id: sanitizeString(e.id, 64) || `entry_${Date.now()}`,
    date: sanitizeString(e.date, 10) || new Date().toISOString().split("T")[0],
    mood,
    stressLevel,
    journalText: sanitizeString(e.journalText, MAX_JOURNAL_LENGTH),
    stressedSubjects,
    createdAt:
      typeof e.createdAt === "string"
        ? sanitizeString(e.createdAt, 30)
        : new Date().toISOString(),
  };
}

// ─── Profile Sanitizer ───────────────────────────────────────────────────────────

function sanitizeProfile(raw: unknown): UserProfile | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const p = raw as Record<string, unknown>;

  if (!isValidExamType(p.exam)) return null;

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

// ─── Response Parser ─────────────────────────────────────────────────────────────

function parseInsightResponse(raw: string): InsightsAPIResponse {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  const parsed = JSON.parse(cleaned);

  const topTriggers = Array.isArray(parsed.topTriggers)
    ? parsed.topTriggers
        .slice(0, 4)
        .map(String)
        .map((t: string) => sanitizeString(t, 100))
        .filter(Boolean)
    : [];

  const validTrends: MoodTrend[] = ["improving", "declining", "stable"];
  const moodTrend: MoodTrend = validTrends.includes(parsed.moodTrend)
    ? (parsed.moodTrend as MoodTrend)
    : "stable";

  const aiSummary =
    typeof parsed.aiSummary === "string" && parsed.aiSummary.length > 0
      ? sanitizeString(parsed.aiSummary, 600)
      : SAFE_DEFAULTS.aiSummary!;

  return { topTriggers, moodTrend, aiSummary };
}

// ─── Route Handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Enforce Content-Type
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json(
      { error: "Content-Type must be application/json" },
      { status: 415, headers: SECURITY_HEADERS }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  const body = rawBody as Record<string, unknown>;

  const userProfile = sanitizeProfile(body.userProfile);
  if (!userProfile) {
    return Response.json(
      { error: "Missing or invalid userProfile" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  if (!Array.isArray(body.entries)) {
    return Response.json(
      { error: "entries must be an array" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  const entries: MoodEntry[] = body.entries
    .slice(0, MAX_ENTRIES)
    .map(sanitizeEntry)
    .filter((e): e is MoodEntry => e !== null);

  try {
    const insightPrompt = buildInsightPrompt(entries);

    const messages = [
      {
        id: "insight-request",
        role: "user" as const,
        content: insightPrompt,
        timestamp: new Date().toISOString(),
      },
    ];

    const systemPrompt =
      "You are a data analysis assistant. Return ONLY valid JSON as instructed. No markdown, no explanation, no extra text.";

    const raw = await callAI(messages, systemPrompt);

    try {
      const result = parseInsightResponse(raw);
      return Response.json(result, { status: 200, headers: SECURITY_HEADERS });
    } catch {
      console.warn(
        "[/api/insights] JSON parse failed, returning defaults. Raw:",
        raw.slice(0, 100)
      );
      return Response.json(SAFE_DEFAULTS, { status: 200, headers: SECURITY_HEADERS });
    }
  } catch (error) {
    console.error(
      "[/api/insights] Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return Response.json(SAFE_DEFAULTS, { status: 200, headers: SECURITY_HEADERS });
  }
}