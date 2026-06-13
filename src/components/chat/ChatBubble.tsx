"use client";

import type { ChatMessage } from "@/lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ChatBubble({ message, isLast }: ChatBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className="flex justify-end animate-slide-right"
        style={{ animationDuration: isLast ? "0.3s" : "0s" }}
      >
        <div className="flex flex-col items-end max-w-[78%]">
          <div
            className="px-4 py-2.5 rounded-3xl rounded-tr-md text-sm leading-relaxed whitespace-pre-wrap"
            style={{
              background: "var(--brand-green)",
              color: "#fff",
              boxShadow: "var(--shadow-green)",
            }}
          >
            {message.content}
          </div>
          <span
            className="text-xs mt-1 mr-1"
            style={{ color: "var(--text-muted)" }}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div
      className="flex items-end gap-2 animate-slide-left"
      style={{ animationDuration: isLast ? "0.35s" : "0s" }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-base mb-1"
        style={{ background: "var(--brand-green-light)" }}
      >
        🌿
      </div>

      <div className="flex flex-col items-start max-w-[78%]">
        <div
          className="px-4 py-2.5 rounded-3xl rounded-tl-md text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {message.content}
        </div>
        <span
          className="text-xs mt-1 ml-1"
          style={{ color: "var(--text-muted)" }}
        >
          Aarogya · {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
