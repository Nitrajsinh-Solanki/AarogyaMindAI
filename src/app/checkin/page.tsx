"use client";

import CheckinSummary from "@/components/checkin/CheckinSummary";
import JournalTextarea from "@/components/checkin/JournalTextarea";
import MoodSelector from "@/components/checkin/MoodSelector";
import StressSlider from "@/components/checkin/StressSlider";
import SubjectTags from "@/components/checkin/SubjectTags";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageWrapper from "@/components/layout/PageWrapper";
import {
  getMoodEntries,
  getTodaysMoodEntry,
  getUserProfile,
  isOnboarded,
  saveMoodEntry,
  updateStreak,
} from "@/lib/storage";
import type { MoodEntry, MoodLevel, UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckinPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);

  // Form state
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [stressLevel, setStressLevel] = useState(5);
  const [journalText, setJournalText] = useState("");
  const [stressedSubjects, setStressedSubjects] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [newStreak, setNewStreak] = useState(0);

  useEffect(() => {
    if (!isOnboarded()) {
      router.replace("/onboarding");
      return;
    }
    const p = getUserProfile();
    setProfile(p);

    const todayEntry = getTodaysMoodEntry();
    if (todayEntry) {
      setAlreadyCheckedIn(true);
    }

    // Get current streak
    const entries = getMoodEntries();
    setStreak(entries.length);
  }, [router]);

  function handleSubmit() {
    if (!mood) return;
    setIsSubmitting(true);

    const now = new Date();
    const entry: MoodEntry = {
      id: `entry_${now.getTime()}`,
      date: now.toISOString().split("T")[0],
      mood,
      stressLevel,
      journalText,
      stressedSubjects,
      createdAt: now.toISOString(),
    };

    saveMoodEntry(entry);
    const updatedStreak = updateStreak();
    setNewStreak(updatedStreak);
    setShowSummary(true);

    // Auto-redirect to chat after 2.5s
    setTimeout(() => {
      router.push("/chat");
    }, 2500);
  }

  // Already checked in today
  if (alreadyCheckedIn) {
    return (
      <PageWrapper>
        <Header profile={profile} streak={streak} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <div className="card text-center max-w-sm w-full animate-scale-in">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Already checked in today!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              You&apos;ve done your daily check-in. Head over to chat with Aarogya!
            </p>
            <button
              className="btn-primary w-full"
              onClick={() => router.push("/chat")}
            >
              Chat with Aarogya 💬
            </button>
          </div>
        </div>
        <Navbar />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header profile={profile} streak={streak} />

      {showSummary && (
        <CheckinSummary mood={mood!} streak={newStreak} />
      )}

      <div className="flex-1 overflow-y-auto p-4 pb-2 flex flex-col gap-5">
        {/* Greeting */}
        <div className="animate-fade-in-up">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Hey {profile?.name?.split(" ")[0] || "there"} 👋
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            How are you feeling today? Be honest — Aarogya&apos;s got you. 💚
          </p>
        </div>

        {/* Mood Selector */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "60ms" }}
        >
          <MoodSelector selected={mood} onMoodSelect={setMood} />
        </div>

        {/* Stress Slider */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "120ms" }}
        >
          <StressSlider value={stressLevel} onStressChange={setStressLevel} />
        </div>

        {/* Journal */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "180ms" }}
        >
          <JournalTextarea value={journalText} onChange={setJournalText} />
        </div>

        {/* Subject Tags */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <SubjectTags selected={stressedSubjects} onTagsChange={setStressedSubjects} />
        </div>

        {/* Submit */}
        <div
          className="animate-fade-in-up pb-4"
          style={{ animationDelay: "300ms" }}
        >
          <button
            className="btn-primary w-full text-base py-3"
            onClick={handleSubmit}
            disabled={!mood || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Check-in 💚"}
          </button>
          {!mood && (
            <p
              className="text-xs text-center mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              Select your mood to continue
            </p>
          )}
        </div>
      </div>

      <Navbar />
    </PageWrapper>
  );
}
