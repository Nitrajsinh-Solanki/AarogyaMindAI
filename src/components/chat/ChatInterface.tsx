"use client";

import type { ChatMessage } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import QuickReplies from "./QuickReplies";
import TypingIndicator from "./TypingIndicator";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
}: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const lastIsAssistant =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const showQuickReplies = lastIsAssistant && !isLoading && inputValue === "";

  function handleSend(content: string) {
    if (!content.trim() || isLoading) return;
    setInputValue("");
    onSendMessage(content);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3 pb-2 flex flex-col gap-3"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
            <span className="text-5xl">🌿</span>
            <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
              Aarogya is here. Say hi!
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} isLast={i === messages.length - 1} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {showQuickReplies && (
        <QuickReplies
          onSelect={(text) => {
            setInputValue(text);
            handleSend(text);
          }}
        />
      )}

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}
