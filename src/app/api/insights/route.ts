import { callAI } from "@/lib/ai";
import { buildInsightPrompt } from "@/lib/prompts";
import type { InsightsAPIRequest, InsightsAPIResponse, MoodTrend } from "@/lib/types";
import { NextRequest } from "next/server";

const SAFE_DEFAULTS: InsightsAPIResponse = {
  topTriggers: [],
  moodTrend: "stable",
  aiSummary:
    "Keep checking in daily so Aarogya can learn your patterns and give you personalized insights! Every entry helps build a clearer picture of your wellness journey.",
};

function parseInsightResponse(raw: string): InsightsAPIResponse {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  const parsed = JSON.parse(cleaned);

  const topTriggers = Array.isArray(parsed.topTriggers)
    ? parsed.topTriggers.slice(0, 4).map(String)
    : [];

  const validTrends: MoodTrend[] = ["improving", "declining", "stable"];
  const moodTrend: MoodTrend = validTrends.includes(parsed.moodTrend)
    ? (parsed.moodTrend as MoodTrend)
    : "stable";

  const aiSummary =
    typeof parsed.aiSummary === "string" && parsed.aiSummary.length > 0
      ? parsed.aiSummary
      : SAFE_DEFAULTS.aiSummary;

  return { topTriggers, moodTrend, aiSummary };
}

export async function POST(req: NextRequest) {
  try {
    const body: InsightsAPIRequest = await req.json();
    const { entries, userProfile } = body;

    if (!entries || !userProfile) {
      return Response.json(
        { error: "Missing required fields: entries, userProfile" },
        { status: 400 }
      );
    }

    const insightPrompt = buildInsightPrompt(entries);

    // Send as a single user message asking for JSON insights
    const messages = [
      {
        id: "insight-request",
        role: "user" as const,
        content: insightPrompt,
        timestamp: new Date().toISOString(),
      },
    ];

    // Use a minimal system prompt for JSON-only output
    const systemPrompt =
      "You are a data analysis assistant. Return ONLY valid JSON as instructed. No markdown, no explanation, no extra text.";

    const raw = await callAI(messages, systemPrompt);

    try {
      const result = parseInsightResponse(raw);
      return Response.json(result, { status: 200 });
    } catch {
      // JSON parsing failed — return safe defaults
      console.warn("[/api/insights] JSON parse failed, returning defaults. Raw:", raw);
      return Response.json(SAFE_DEFAULTS, { status: 200 });
    }
  } catch (error) {
    console.error("[/api/insights] Error:", error);
    return Response.json(SAFE_DEFAULTS, { status: 200 });
  }
}
