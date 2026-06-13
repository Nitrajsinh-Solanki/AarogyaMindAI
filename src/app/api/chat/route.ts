import { callAI } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompts";
import type { ChatAPIRequest } from "@/lib/types";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ChatAPIRequest = await req.json();
    const { messages, userProfile, todayEntry } = body;

    if (!userProfile || !messages) {
      return Response.json(
        { error: "Missing required fields: messages, userProfile" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(userProfile, todayEntry);

    // Convert to the format callAI expects (exclude any injected welcome messages)
    const filteredMessages = messages.filter((m) => m.role !== "system");

    const reply = await callAI(filteredMessages, systemPrompt);

    return Response.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("[/api/chat] Error:", error);
    return Response.json(
      {
        reply:
          "I'm having a little trouble connecting right now 🌿 But I'm still here. Take a deep breath — you've got this. Try this: Step away for 2 minutes and drink a glass of water before your next study block.",
      },
      { status: 200 } // Return 200 with fallback so UI doesn't show error
    );
  }
}
