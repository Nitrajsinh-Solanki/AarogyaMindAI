interface TriggerTagsProps {
  triggers: string[];
}

export default function TriggerTags({ triggers }: TriggerTagsProps) {
  const TRIGGER_COLORS = [
    { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
    { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
    { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
    { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  ];

  return (
    <div className="card flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
        Your Stress Triggers This Week
      </h3>

      {triggers.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Complete more check-ins to unlock pattern detection. Aarogya needs at least 3 days of data to spot trends. 🔍
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {triggers.map((trigger, i) => {
            const color = TRIGGER_COLORS[i % TRIGGER_COLORS.length];
            return (
              <span
                key={trigger}
                className="text-sm font-semibold px-3 py-1.5 rounded-full border"
                style={{
                  background: color.bg,
                  color: color.text,
                  borderColor: color.border,
                }}
              >
                ⚡ {trigger}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
