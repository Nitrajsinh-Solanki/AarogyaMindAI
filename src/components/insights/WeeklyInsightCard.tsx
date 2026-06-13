import type { WeeklyInsight, MoodTrend } from "@/lib/types";

interface WeeklyInsightCardProps {
  insight: WeeklyInsight | null;
  isLoading: boolean;
}

const TREND_CONFIG: Record<MoodTrend, { icon: string; label: string; color: string }> = {
  improving: { icon: "📈", label: "Improving", color: "#16a34a" },
  declining: { icon: "📉", label: "Needs Attention", color: "#dc2626" },
  stable:    { icon: "➡️", label: "Stable", color: "#d97706" },
};

export default function WeeklyInsightCard({ insight, isLoading }: WeeklyInsightCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "linear-gradient(135deg, #166534 0%, #15803d 60%, #0d9488 100%)",
        boxShadow: "0 8px 24px 0 rgb(22 163 74 / 0.3)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🧠</span>
        <h3 className="text-base font-bold text-white">
          Aarogya&apos;s Weekly Read
        </h3>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          <div className="skeleton h-4 w-3/4 opacity-40" />
          <div className="skeleton h-4 w-full opacity-40" />
          <div className="skeleton h-4 w-2/3 opacity-40" />
        </div>
      )}

      {/* Insight content */}
      {!isLoading && insight && (
        <>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {insight.aiSummary}
          </p>

          {/* Mood trend indicator */}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 self-start"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span className="text-base">
              {TREND_CONFIG[insight.moodTrend].icon}
            </span>
            <span className="text-sm font-semibold text-white">
              Mood Trend:{" "}
              <span style={{ color: insight.moodTrend === "improving" ? "#86efac" : insight.moodTrend === "declining" ? "#fca5a5" : "#fde68a" }}>
                {TREND_CONFIG[insight.moodTrend].label}
              </span>
            </span>
          </div>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            Generated {new Date(insight.generatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </>
      )}

      {/* No data yet */}
      {!isLoading && !insight && (
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
          Complete a few check-ins and Aarogya will generate your personalised weekly insight! 🌱
        </p>
      )}
    </div>
  );
}
