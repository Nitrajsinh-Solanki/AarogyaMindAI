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
        background: "rgba(var(--bg-card-rgb, 255 255 255) / 0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 0 0 var(--border)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 max-w-lg mx-auto"
        style={{ height: "56px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--brand-green) 0%, var(--brand-teal) 100%)",
              boxShadow: "0 2px 8px rgb(22 163 74 / 0.35)",
            }}
          >
            🌿
          </div>
          <span
            className="text-[15px] font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            AarogyaMind
          </span>
        </div>

        {/* Exam badge */}
        {profile?.exam && (
          <div
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{
              background: "var(--brand-green-light)",
              color: "var(--brand-green-dark)",
              border: "1px solid var(--brand-green)",
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--brand-green)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {profile.exam}
          </div>
        )}

        {/* Streak */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: streak > 0 ? "#fff7ed" : "var(--bg-muted)",
            border: streak > 0 ? "1px solid #fed7aa" : "1px solid var(--border)",
            minWidth: "52px",
            justifyContent: "center",
          }}
        >
          {streak > 0 ? (
            <>
              <span style={{ fontSize: "14px" }}>🔥</span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: "#c2410c" }}
              >
                {streak}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: "14px" }}>🌱</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                0
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}