"use client";

import type { ExamType } from "@/lib/types";
import { EXAM_META } from "@/lib/types";

interface ExamCardProps {
  exam: ExamType;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ExamCard({ exam, isSelected, onSelect }: ExamCardProps) {
  const meta = EXAM_META[exam];

  return (
    <button
      id={`exam-card-${exam.toLowerCase()}`}
      onClick={onSelect}
      className="card-hover text-left rounded-2xl p-3 transition-all duration-200 border-2 w-full"
      style={{
        background: isSelected ? "var(--brand-green-light)" : "var(--bg-card)",
        borderColor: isSelected ? "var(--brand-green)" : "var(--border)",
        boxShadow: isSelected
          ? "0 0 0 2px var(--brand-green), var(--shadow-sm)"
          : "var(--shadow-sm)",
      }}
    >
      <div className="text-2xl mb-1">{meta.emoji}</div>
      <div
        className="text-sm font-bold"
        style={{ color: isSelected ? "var(--brand-green-dark)" : "var(--text-primary)" }}
      >
        {meta.label}
      </div>
      <div
        className="text-xs mt-0.5 leading-snug"
        style={{ color: isSelected ? "var(--brand-green)" : "var(--text-muted)" }}
      >
        {meta.shortDesc}
      </div>
    </button>
  );
}
