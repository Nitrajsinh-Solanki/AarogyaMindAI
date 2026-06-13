"use client";

interface StressSliderProps {
  value: number;
  onStressChange: (value: number) => void;
}

function getStressColor(v: number): string {
  if (v <= 3) return "var(--mood-4)";
  if (v <= 6) return "var(--mood-3)";
  if (v <= 8) return "var(--mood-2)";
  return "var(--mood-1)";
}

function getStressLabel(v: number): string {
  if (v <= 3) return "Manageable";
  if (v <= 5) return "Moderate";
  if (v <= 7) return "High";
  if (v <= 9) return "Very High";
  return "Overwhelming";
}

export default function StressSlider({ value, onStressChange }: StressSliderProps) {
  const color = getStressColor(value);
  const pct = ((value - 1) / 9) * 100;

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          Stress level
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-extrabold tabular-nums transition-all duration-200"
            style={{ color }}
          >
            {value}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-200"
            style={{ background: `${color}20`, color }}
          >
            {getStressLabel(value)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            id="stress-slider"
            type="range"
            min={1}
            max={10}
            value={value}
            onChange={(e) => onStressChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${color} ${pct}%, var(--border) ${pct}%)`,
              accentColor: color,
            }}
          />
        </div>
        <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>😌 Calm</span>
          <span>😤 Overwhelmed</span>
        </div>
      </div>

      <style>{`
        #stress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 0 3px white, 0 0 0 5px ${color}60;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
        }
        #stress-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          box-shadow: 0 0 0 2px ${color}60;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
