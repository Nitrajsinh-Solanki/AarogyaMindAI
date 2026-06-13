"use client";

import type { MoodLevel } from "@/lib/types";
import { MOOD_EMOJIS, MOOD_LABELS, MOOD_COLORS } from "@/lib/types";

interface MoodSelectorProps {
  selected: MoodLevel | null;
  onMoodSelect: (mood: MoodLevel) => void;
}

const MOODS: MoodLevel[] = [1, 2, 3, 4, 5];

export default function MoodSelector({ selected, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="card flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          How are you feeling right now?
        </h3>
      </div>

      <div className="flex items-end justify-between gap-2">
        {MOODS.map((mood) => {
          const isSelected = selected === mood;
          return (
            <button
              key={mood}
              id={`mood-btn-${mood}`}
              onClick={() => onMoodSelect(mood)}
              className="flex flex-col items-center gap-1.5 flex-1 py-2 rounded-2xl transition-all duration-200"
              style={{
                background: isSelected
                  ? `${MOOD_COLORS[mood]}18`
                  : "transparent",
                outline: isSelected
                  ? `2px solid ${MOOD_COLORS[mood]}`
                  : "2px solid transparent",
                transform: isSelected ? "scale(1.08)" : "scale(1)",
              }}
            >
              <span
                className="transition-all duration-200"
                style={{ fontSize: isSelected ? "2.25rem" : "1.75rem" }}
              >
                {MOOD_EMOJIS[mood]}
              </span>
              <span
                className="text-xs font-medium leading-tight text-center"
                style={{
                  color: isSelected ? MOOD_COLORS[mood] : "var(--text-muted)",
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {MOOD_LABELS[mood]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
