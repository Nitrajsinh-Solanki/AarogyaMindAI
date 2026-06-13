"use client";

import type { MoodEntry } from "@/lib/types";
import { MOOD_COLORS, MOOD_EMOJIS } from "@/lib/types";

interface MoodChartProps {
  entries: MoodEntry[];
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MoodChart({ entries }: MoodChartProps) {
  const last7 = getLast7Days();
  const entryMap = new Map(entries.map((e) => [e.date, e]));

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          7-Day Mood Trend
        </h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {entries.length} check-ins
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-1.5 h-28">
        {last7.map((date) => {
          const entry = entryMap.get(date);
          const mood = entry?.mood;
          const barPct = mood ? (mood / 5) * 100 : 0;
          const color = mood ? MOOD_COLORS[mood] : "var(--border)";
          const dayIdx = new Date(date + "T00:00:00").getDay();
          const label = DAY_LABELS[dayIdx];
          const isToday = date === new Date().toISOString().split("T")[0];

          return (
            <div key={date} className="flex flex-col items-center gap-1 flex-1">
              {/* Emoji on top if there's data */}
              {mood && (
                <span className="text-xs leading-none mb-0.5">
                  {MOOD_EMOJIS[mood]}
                </span>
              )}

              {/* Bar */}
              <div
                className="w-full rounded-t-lg relative overflow-hidden"
                style={{ height: "80px", background: "var(--bg-muted)" }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${barPct}%`,
                    background: mood
                      ? `linear-gradient(to top, ${color}cc, ${color})`
                      : "transparent",
                    minHeight: mood ? "8px" : "0",
                  }}
                />
              </div>

              {/* Day label */}
              <span
                className="text-xs font-medium"
                style={{
                  color: isToday ? "var(--brand-green)" : "var(--text-muted)",
                  fontWeight: isToday ? 700 : 500,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {([1, 2, 3, 4, 5] as const).map((m) => (
          <div key={m} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: MOOD_COLORS[m] }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {m === 1 ? "Burned Out" : m === 2 ? "Stressed" : m === 3 ? "Okay" : m === 4 ? "Good" : "Motivated"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
