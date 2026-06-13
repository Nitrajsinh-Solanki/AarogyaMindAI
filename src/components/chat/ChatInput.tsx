"use client";

import { useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: (content: string) => void;
  disabled: boolean;
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend(value);
      }
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    // Auto-resize
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }

  return (
    <div
      className="px-4 py-3"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}
    >
      <div
        className="flex items-end gap-2 rounded-2xl px-3 py-2"
        style={{
          background: "var(--bg-muted)",
          border: "1.5px solid var(--border)",
        }}
      >
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Message Aarogya..."
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed py-1"
          style={{
            color: "var(--text-primary)",
            fontFamily: "inherit",
            maxHeight: "120px",
          }}
        />

        {/* Send button */}
        <button
          id="chat-send-btn"
          onClick={() => onSend(value)}
          disabled={disabled || !value.trim()}
          className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 mb-0.5"
          style={{
            background:
              disabled || !value.trim()
                ? "var(--border)"
                : "var(--brand-green)",
            cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M14 8L2 2l2.5 6L2 14l12-6z"
              fill={disabled || !value.trim() ? "var(--text-muted)" : "#fff"}
            />
          </svg>
        </button>
      </div>

      <p
        className="text-center text-xs mt-2"
        style={{ color: "var(--text-muted)" }}
      >
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
