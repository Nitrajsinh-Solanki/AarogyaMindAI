export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 text-base"
        style={{ background: "var(--brand-green-light)" }}
      >
        🌿
      </div>

      <div
        className="px-4 py-3 rounded-3xl rounded-tl-md flex items-center gap-1.5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
