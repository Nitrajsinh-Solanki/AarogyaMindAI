"use client";

const MAX_CHARS = 500;

interface JournalTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JournalTextarea({ value, onChange }: JournalTextareaProps) {
  const remaining = MAX_CHARS - value.length;
  const isNearLimit = remaining < 60;

  return (
    <div className="card flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
        Journal (optional)
      </h3>

      <div className="relative">
        <textarea
          id="journal-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="How was your study session? What's on your mind? Aarogya reads everything with care 💚"
          rows={4}
          className="w-full resize-none rounded-xl p-3 text-sm leading-relaxed outline-none transition-all duration-200"
          style={{
            background: "var(--bg-muted)",
            border: "1.5px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--brand-green)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgb(22 163 74 / 0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <span
          className="absolute bottom-2.5 right-3 text-xs tabular-nums"
          style={{ color: isNearLimit ? "var(--mood-2)" : "var(--text-muted)" }}
        >
          {remaining}
        </span>
      </div>
    </div>
  );
}
