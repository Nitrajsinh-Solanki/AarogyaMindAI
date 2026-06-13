"use client";

import type { UserProfile } from "@/lib/types";

interface HeaderProps {
  profile: UserProfile | null;
  streak: number;
}

export default function Header({ profile, streak }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span
            className="text-base font-bold tracking-tight"
            style={{ color: "var(--brand-green)" }}
          >
            AarogyaMind
          </span>
        </div>

        {/* Exam badge (center) */}
        {profile?.exam && (
          <div
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: "var(--brand-green-light)",
              color: "var(--brand-green-dark)",
            }}
          >
            {profile.exam} 🎯
          </div>
        )}

        {/* Streak (right) */}
        <div className="flex items-center gap-1.5">
          {streak > 0 ? (
            <>
              <span className="text-base">🔥</span>
              <span
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {streak}
              </span>
            </>
          ) : (
            <span className="text-lg">🌱</span>
          )}
        </div>
      </div>
    </header>
  );
}
