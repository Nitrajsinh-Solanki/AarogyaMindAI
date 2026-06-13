"use client";

import { isOnboarded, getTodaysMoodEntry } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (!isOnboarded()) {
      router.replace("/onboarding");
      return;
    }
    const todayEntry = getTodaysMoodEntry();
    if (!todayEntry) {
      router.replace("/checkin");
    } else {
      router.replace("/chat");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-bg">
      {/* Animated loading screen */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo pulse ring */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-24 h-24 rounded-full pulse-ring"
            style={{ background: "var(--brand-green-light)" }}
          />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
            style={{ background: "var(--brand-green)" }}
          >
            🌿
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--brand-green)" }}
          >
            AarogyaMind
          </h1>
          <p
            className="text-sm mt-1 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Loading your wellness space...
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-2">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
