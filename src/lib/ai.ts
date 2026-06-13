import type { ChatMessage } from "./types";

// ─── Configuration ───────────────────────────────────────────────────────────────

const GROQ_CONFIG = {
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
  model: "llama-3.1-8b-instant",
} as const;

const GEMINI_CONFIG = {
  endpoint:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  model: "gemini-1.5-flash",
} as const;

// Request timeout in milliseconds
const REQUEST_TIMEOUT_MS = 15_000;
// Maximum response size to read (bytes) — prevents response-flooding
const MAX_RESPONSE_BYTES = 64 * 1024; // 64 KB

// ─── Fallback Response ───────────────────────────────────────────────────────────

const FALLBACK_RESPONSE = `Hey, I'm having a little trouble connecting right now, but I'm still here with you! 🌿

Remember — whatever you're going through in your prep journey, tough moments don't last forever. You've made it through every hard day so far.

Try this: Take 3 deep breaths right now — in for 4 counts, hold for 4, out for 4. It genuinely helps reset your focus.`;

// ─── OpenAI-compatible Message Format ────────────────────────────────────────────

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function toOpenAIMessages(
  messages: ChatMessage[],
  systemPrompt: string
): OpenAIMessage[] {
  const systemMessage: OpenAIMessage = {
    role: "system",
    content: systemPrompt,
  };
  const chatMessages: OpenAIMessage[] = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
  return [systemMessage, ...chatMessages];
}

// ─── Fetch with Timeout ──────────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Safe Response Text Reader ───────────────────────────────────────────────────

async function safeReadJson(response: Response): Promise<unknown> {
  const reader = response.body?.getReader();
  if (!reader) {
    return response.json();
  }
  let totalBytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_RESPONSE_BYTES) {
      reader.cancel();
      throw new Error("Response too large");
    }
    chunks.push(value);
  }
  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const text = new TextDecoder().decode(combined);
  return JSON.parse(text);
}

// ─── Groq Caller ─────────────────────────────────────────────────────────────────

export async function callGroq(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const response = await fetchWithTimeout(
    GROQ_CONFIG.endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_CONFIG.model,
        messages: toOpenAIMessages(messages, systemPrompt),
        max_tokens: 512,
        temperature: 0.75,
      }),
    },
    REQUEST_TIMEOUT_MS
  );

  if (!response.ok) {
    // Do NOT include response body in error — may contain key details
    throw new Error(`Groq API error: HTTP ${response.status}`);
  }

  const data = await safeReadJson(response);
  const content = (data as { choices?: { message?: { content?: string } }[] })
    ?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned empty content");
  return content.trim();
}

// ─── Gemini Caller ────────────────────────────────────────────────────────────────

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

function toGeminiMessages(
  messages: ChatMessage[],
  systemPrompt: string
): {
  systemInstruction: { parts: { text: string }[] };
  contents: GeminiContent[];
} {
  const contents: GeminiContent[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const validContents =
    contents.length > 0 && contents[0].role === "model"
      ? [{ role: "user" as const, parts: [{ text: "Hello" }] }, ...contents]
      : contents;

  return {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: validContents,
  };
}

export async function callGemini(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const { systemInstruction, contents } = toGeminiMessages(messages, systemPrompt);

  // Key is passed as query param — this is Gemini's required pattern (server-side only)
  const url = new URL(GEMINI_CONFIG.endpoint);
  url.searchParams.set("key", apiKey);

  const response = await fetchWithTimeout(
    url.toString(),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction,
        contents,
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.75,
        },
      }),
    },
    REQUEST_TIMEOUT_MS
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: HTTP ${response.status}`);
  }

  const data = await safeReadJson(response);
  const text = (
    data as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    }
  )?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty content");
  return text.trim();
}

// ─── Main AI Caller (Groq → Gemini → Fallback) ───────────────────────────────────

export async function callAI(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  // 1. Try Groq first (fast, free)
  try {
    const result = await callGroq(messages, systemPrompt);
    return result;
  } catch (groqError) {
    console.warn(
      "[AarogyaMind] Groq failed, trying Gemini:",
      groqError instanceof Error ? groqError.message : "Unknown"
    );
  }

  // 2. Fallback to Gemini
  try {
    const result = await callGemini(messages, systemPrompt);
    return result;
  } catch (geminiError) {
    console.error(
      "[AarogyaMind] Gemini also failed:",
      geminiError instanceof Error ? geminiError.message : "Unknown"
    );
  }

  // 3. Both failed — return hardcoded empathetic fallback
  return FALLBACK_RESPONSE;
}