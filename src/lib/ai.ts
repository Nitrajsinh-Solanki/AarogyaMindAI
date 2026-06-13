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

// ─── Groq Caller ─────────────────────────────────────────────────────────────────

export async function callGroq(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const response = await fetch(GROQ_CONFIG.endpoint, {
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
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
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
): { systemInstruction: { parts: { text: string }[] }; contents: GeminiContent[] } {
  // Gemini uses systemInstruction separately
  const contents: GeminiContent[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Gemini requires alternating user/model turns — ensure it starts with user
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
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const { systemInstruction, contents } = toGeminiMessages(messages, systemPrompt);

  const response = await fetch(
    `${GEMINI_CONFIG.endpoint}?key=${apiKey}`,
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
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
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
    console.warn("[AarogyaMind] Groq failed, trying Gemini:", groqError);
  }

  // 2. Fallback to Gemini
  try {
    const result = await callGemini(messages, systemPrompt);
    return result;
  } catch (geminiError) {
    console.error("[AarogyaMind] Gemini also failed:", geminiError);
  }

  // 3. Both failed — return hardcoded empathetic fallback
  return FALLBACK_RESPONSE;
}
