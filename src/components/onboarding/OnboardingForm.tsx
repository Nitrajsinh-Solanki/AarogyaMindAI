"use client";

import type { ExamType, UserProfile } from "@/lib/types";
import { EXAM_META } from "@/lib/types";
import { useState } from "react";
import ExamCard from "./ExamCard";

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

const EXAMS = Object.keys(EXAM_META) as ExamType[];

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [exam, setExam] = useState<ExamType | null>(null);

  function handleStep1() {
    if (name.trim().length < 2) return;
    setStep(2);
  }

  function handleStep2() {
    if (!exam) return;
    setStep(3);
  }

  function handleComplete() {
    if (!name || !exam) return;
    onComplete({
      name: name.trim(),
      exam,
      onboardedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Step 1 — Name */}
      {step === 1 && (
        <div className="card animate-scale-in flex flex-col gap-6">
          <div className="text-center">
            <div className="text-5xl mb-3">👋</div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Welcome to AarogyaMind
            </h1>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              Your calm companion through exam chaos. Let&apos;s get to know you.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              What should Aarogya call you?
            </label>
            <input
              id="name-input"
              type="text"
              className="input-base"
              placeholder="Your name or nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStep1()}
              autoFocus
              maxLength={30}
            />
          </div>

          <button
            id="name-next-btn"
            className="btn-primary w-full"
            onClick={handleStep1}
            disabled={name.trim().length < 2}
          >
            Continue →
          </button>

          <div className="flex justify-center gap-2 mt-1">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: step >= s ? "var(--brand-green)" : "var(--border)",
                  transform: step === s ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Exam Picker */}
      {step === 2 && (
        <div className="card animate-scale-in flex flex-col gap-5">
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Which exam are you preparing for?
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Aarogya will personalise everything for your journey.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {EXAMS.map((e) => (
              <ExamCard
                key={e}
                exam={e}
                isSelected={exam === e}
                onSelect={() => setExam(e)}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              className="btn-ghost flex-1"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <button
              id="exam-next-btn"
              className="btn-primary flex-1"
              onClick={handleStep2}
              disabled={!exam}
            >
              Continue →
            </button>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: step >= s ? "var(--brand-green)" : "var(--border)",
                  transform: step === s ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Confirmation */}
      {step === 3 && (
        <div className="card animate-scale-in flex flex-col gap-6 text-center">
          <div>
            <div className="text-6xl mb-3">🌿</div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Welcome, {name.split(" ")[0]}!
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
              Aarogya is ready to support your{" "}
              <strong style={{ color: "var(--brand-green)" }}>{exam}</strong> journey.
              Daily check-ins take just 60 seconds — and they make a real difference.
            </p>
          </div>

          <div
            className="rounded-2xl p-4 text-left flex flex-col gap-2"
            style={{ background: "var(--brand-green-light)" }}
          >
            {[
              "Daily mood check-ins (60 sec)",
              "AI chat support — like a senior who gets it",
              "Weekly insights on your stress patterns",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <span style={{ color: "var(--brand-green)" }}>✓</span>
                <span style={{ color: "var(--brand-green-dark)" }}>{item}</span>
              </div>
            ))}
          </div>

          <button
            id="lets-begin-btn"
            className="btn-primary w-full text-base py-3"
            onClick={handleComplete}
          >
            Let&apos;s Begin 🚀
          </button>

          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: "var(--brand-green)",
                  transform: step === s ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
