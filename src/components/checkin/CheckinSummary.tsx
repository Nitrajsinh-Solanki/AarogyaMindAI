"use client";

import type { MoodLevel } from "@/lib/types";
import { MOOD_EMOJIS, MOOD_LABELS } from "@/lib/types";

interface CheckinSummaryProps {
  mood: MoodLevel;
  streak: number;
}

export default function CheckinSummary({ mood, streak }: CheckinSummaryProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
    >
      <div className="card animate-scale-in flex flex-col items-center gap-4 text-center max-w-xs w-full py-8">
        {/* Animated checkmark */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-1"
          style={{ background: "var(--brand-green-light)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <circle cx="16" cy="16" r="14" stroke="var(--brand-green)" strokeWidth="2.5" />
            <path
              d="M9 16.5l5 5 9-9"
              stroke="var(--brand-green)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: 0,
                animation: "checkmark 0.4s ease 0.1s both",
              }}
            />
          </svg>
        </div>

        <div>
          <p className="text-3xl mb-1">{MOOD_EMOJIS[mood]}</p>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Check-in saved!
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Feeling <strong>{MOOD_LABELS[mood]}</strong> today — noted.
          </p>
        </div>

        {streak > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "var(--brand-green-light)" }}
          >
            <span className="text-lg">🔥</span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--brand-green-dark)" }}
            >
              {streak} day streak!
            </span>
          </div>
        )}

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Taking you to chat with Aarogya...
        </p>
      </div>
    </div>
  );
}
