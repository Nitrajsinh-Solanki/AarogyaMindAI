"use client";

const QUICK_REPLIES = [
  "I'm feeling overwhelmed 😰",
  "Give me a breathing exercise 🧘",
  "Motivate me for today 💪",
  "Help me focus 🎯",
  "I can't concentrate 😵",
  "How do I beat exam anxiety? 🤔",
];

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

export default function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div
      className="px-3 py-2 animate-fade-in"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <p className="text-xs mb-2 px-1" style={{ color: "var(--text-muted)" }}>
        Quick replies
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => onSelect(reply)}
            className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--brand-green-light)";
              e.currentTarget.style.borderColor = "var(--brand-green)";
              e.currentTarget.style.color = "var(--brand-green-dark)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-card)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
}
