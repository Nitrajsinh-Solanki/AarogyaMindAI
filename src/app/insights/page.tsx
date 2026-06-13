"use client";

import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageWrapper from "@/components/layout/PageWrapper";
import MoodChart from "@/components/insights/MoodChart";
import StreakBadge from "@/components/insights/StreakBadge";
import TriggerTags from "@/components/insights/TriggerTags";
import WeeklyInsightCard from "@/components/insights/WeeklyInsightCard";
import {
  getLast7DaysEntries,
  getMoodEntries,
  getStreak,
  getUserProfile,
  getWeeklyInsight,
  isOnboarded,
  saveWeeklyInsight,
  shouldRefreshInsight,
} from "@/lib/storage";
import type { MoodEntry, UserProfile, WeeklyInsight } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InsightsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [weeklyInsight, setWeeklyInsight] = useState<WeeklyInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    if (!isOnboarded()) {
      router.replace("/onboarding");
      return;
    }

    const p = getUserProfile()!;
    setProfile(p);

    const last7 = getLast7DaysEntries();
    const all = getMoodEntries();
    const currentStreak = getStreak();

    setEntries(last7);
    setStreak(currentStreak);
    setTotalEntries(all.length);

    // No entries yet — nothing to summarize. Skip the AI call entirely
    // and show the empty-state UI instead of fetching/seeding fake data.
    if (all.length === 0) {
      setWeeklyInsight(null);
      return;
    }

    const cachedInsight = getWeeklyInsight();

    if (cachedInsight && !shouldRefreshInsight()) {
      setWeeklyInsight(cachedInsight);
    } else {
      // Fetch fresh insight
      setIsLoadingInsight(true);
      fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: last7, userProfile: p }),
      })
        .then((r) => r.json())
        .then((data) => {
          const insight: WeeklyInsight = {
            generatedAt: new Date().toISOString(),
            topTriggers: data.topTriggers ?? [],
            moodTrend: data.moodTrend ?? "stable",
            aiSummary: data.aiSummary ?? "",
          };
          saveWeeklyInsight(insight);
          setWeeklyInsight(insight);
        })
        .catch(() => {
          // Show cached if available, even if stale
          if (cachedInsight) setWeeklyInsight(cachedInsight);
        })
        .finally(() => setIsLoadingInsight(false));
    }
  }, [router]);

  return (
    <PageWrapper>
      <Header profile={profile} streak={streak} />

      <div className="flex-1 overflow-y-auto p-4 pb-4 flex flex-col gap-5">
        {/* Page Title */}
        <div className="animate-fade-in-up">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Your Wellness Insights 📊
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {totalEntries} check-in{totalEntries !== 1 ? "s" : ""} logged •{" "}
            {entries.length} this week
          </p>
        </div>

        {totalEntries === 0 ? (
          /* Empty State — no entries yet, encourage first check-in */
          <div
            className="animate-fade-in-up flex flex-col items-center text-center gap-3 rounded-2xl p-8 mt-4"
            style={{ background: "var(--surface)" }}
          >
            <div className="text-4xl">🌱</div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              No insights yet
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Complete your first daily check-in and Aarogya will start
              building a picture of your mood, stress patterns, and the
              subjects on your mind.
            </p>
            <button
              onClick={() => router.push("/checkin")}
              className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm"
              style={{ background: "var(--brand-green)", color: "white" }}
            >
              Go to Check-In
            </button>
          </div>
        ) : (
          <>
            {/* Streak Badge */}
            <div className="animate-fade-in-up" style={{ animationDelay: "60ms" }}>
              <StreakBadge streak={streak} />
            </div>

            {/* Mood Chart */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              <MoodChart entries={entries} />
            </div>

            {/* Trigger Tags */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "180ms" }}
            >
              <TriggerTags triggers={weeklyInsight?.topTriggers ?? []} />
            </div>

            {/* Weekly Insight Card */}
            <div className="animate-fade-in-up pb-2" style={{ animationDelay: "240ms" }}>
              <WeeklyInsightCard
                insight={weeklyInsight}
                isLoading={isLoadingInsight}
              />
            </div>
          </>
        )}
      </div>

      <Navbar />
    </PageWrapper>
  );
}