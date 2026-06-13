import { callAI } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompts";
import type { ChatAPIRequest, ChatMessage, UserProfile } from "@/lib/types";
import { NextRequest } from "next/server";

// ─── Security Constants ──────────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES_COUNT = 50;
const MAX_NAME_LENGTH = 60;
const MAX_JOURNAL_LENGTH = 500;
const VALID_EXAM_TYPES = ["NEET", "JEE", "UPSC", "CAT", "GATE", "CUET", "Other"] as const;
const VALID_ROLES = ["user", "assistant"] as const;

// ─── Security Headers ────────────────────────────────────────────────────────────
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'none'",
  "Cache-Control": "no-store",
};

// ─── Rate Limiting ────────────────────────────────────────────────────────────────
// Simple in-memory sliding-window limiter. Note: this resets on cold starts and
// is per-instance in serverless environments. For production at scale, swap
// this for a shared store (e.g. Upstash Redis / Vercel KV).
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const rateLimitMap = new Map<string, { count: number; reset: number }>();

// Periodically clear stale entries so the map doesn't grow unbounded.
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupRateLimitMap(now: number): void {
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.reset) rateLimitMap.delete(key);
  }
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  cleanupRateLimitMap(now);

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

// ─── Input Sanitizer ─────────────────────────────────────────────────────────────

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  // Remove null bytes and control characters, trim whitespace
  return input
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function isValidExamType(exam: unknown): exam is (typeof VALID_EXAM_TYPES)[number] {
  return VALID_EXAM_TYPES.includes(exam as (typeof VALID_EXAM_TYPES)[number]);
}

function isValidRole(role: unknown): role is (typeof VALID_ROLES)[number] {
  return VALID_ROLES.includes(role as (typeof VALID_ROLES)[number]);
}

// ─── Validation ──────────────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: { messages: ChatMessage[]; userProfile: UserProfile };
}

function validateAndSanitizeRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, error: "Invalid request body" };
  }

  const raw = body as Record<string, unknown>;

  // Validate userProfile
  if (!raw.userProfile || typeof raw.userProfile !== "object" || Array.isArray(raw.userProfile)) {
    return { valid: false, error: "Missing or invalid userProfile" };
  }

  const rawProfile = raw.userProfile as Record<string, unknown>;

  if (!isValidExamType(rawProfile.exam)) {
    return { valid: false, error: "Invalid exam type" };
  }

  const sanitizedName = sanitizeString(rawProfile.name, MAX_NAME_LENGTH);
  if (!sanitizedName) {
    return { valid: false, error: "Missing or invalid name" };
  }

  const userProfile: UserProfile = {
    name: sanitizedName,
    exam: rawProfile.exam as UserProfile["exam"],
    onboardedAt:
      typeof rawProfile.onboardedAt === "string"
        ? sanitizeString(rawProfile.onboardedAt, 30)
        : new Date().toISOString(),
  };

  // Validate messages
  if (!Array.isArray(raw.messages)) {
    return { valid: false, error: "messages must be an array" };
  }

  if (raw.messages.length > MAX_MESSAGES_COUNT) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES_COUNT})` };
  }

  const sanitizedMessages: ChatMessage[] = [];

  for (const msg of raw.messages) {
    if (!msg || typeof msg !== "object" || Array.isArray(msg)) continue;
    const m = msg as Record<string, unknown>;

    if (!isValidRole(m.role)) continue;

    const content = sanitizeString(m.content, MAX_MESSAGE_LENGTH);
    if (!content) continue;

    sanitizedMessages.push({
      id: sanitizeString(m.id, 64) || `msg_${Date.now()}`,
      role: m.role as "user" | "assistant",
      content,
      timestamp:
        typeof m.timestamp === "string"
          ? sanitizeString(m.timestamp, 30)
          : new Date().toISOString(),
    });
  }

  return {
    valid: true,
    sanitized: { messages: sanitizedMessages, userProfile },
  };
}

function validateTodayEntry(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const e = raw as Record<string, unknown>;

  const mood = typeof e.mood === "number" && e.mood >= 1 && e.mood <= 5
    ? (e.mood as 1 | 2 | 3 | 4 | 5)
    : undefined;
  if (!mood) return undefined;

  const stressLevel =
    typeof e.stressLevel === "number" && e.stressLevel >= 1 && e.stressLevel <= 10
      ? e.stressLevel
      : 5;

  const journalText = sanitizeString(e.journalText, MAX_JOURNAL_LENGTH);

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
    journalText,
    stressedSubjects,
    createdAt:
      typeof e.createdAt === "string" ? sanitizeString(e.createdAt, 30) : new Date().toISOString(),
  };
}

// ─── Route Handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: SECURITY_HEADERS }
    );
  }

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

  const validation = validateAndSanitizeRequest(rawBody);
  if (!validation.valid || !validation.sanitized) {
    return Response.json(
      { error: validation.error ?? "Invalid request" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  const { messages, userProfile } = validation.sanitized;
  const body = rawBody as ChatAPIRequest;
  const todayEntry = validateTodayEntry(body.todayEntry);

  try {
    const systemPrompt = buildSystemPrompt(userProfile, todayEntry);
    const reply = await callAI(messages, systemPrompt);

    return Response.json({ reply }, { status: 200, headers: SECURITY_HEADERS });
  } catch (error) {
    console.error("[/api/chat] Error:", error instanceof Error ? error.message : "Unknown error");
    return Response.json(
      {
        reply:
          "I'm having a little trouble connecting right now 🌿 But I'm still here. Take a deep breath — you've got this. Try this: Step away for 2 minutes and drink a glass of water before your next study block.",
      },
      { status: 200, headers: SECURITY_HEADERS }
    );
  }
}