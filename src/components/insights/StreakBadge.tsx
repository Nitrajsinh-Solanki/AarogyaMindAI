interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) {
    return (
      <div
        className="card flex items-center gap-3"
        style={{ borderLeft: "4px solid var(--border)" }}
      >
        <span className="text-3xl">🌱</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
            Start your streak today!
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Daily check-ins build powerful wellness habits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card flex items-center gap-4"
      style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
        borderLeft: "4px solid var(--mood-2)",
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-4xl leading-none">🔥</span>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-3xl font-extrabold tabular-nums"
            style={{ color: "#ea580c" }}
          >
            {streak}
          </span>
          <span className="text-base font-bold" style={{ color: "#c2410c" }}>
            day{streak !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-sm font-medium" style={{ color: "#9a3412" }}>
          check-in streak 🎉
        </p>
        {streak >= 7 && (
          <p className="text-xs mt-0.5" style={{ color: "#c2410c" }}>
            One whole week — you&apos;re on fire!
          </p>
        )}
      </div>
    </div>
  );
}
