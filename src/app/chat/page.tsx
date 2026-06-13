"use client";

import ChatInterface from "@/components/chat/ChatInterface";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageWrapper from "@/components/layout/PageWrapper";
import {
  getChatHistory,
  getMoodEntries,
  getTodaysMoodEntry,
  getUserProfile,
  isOnboarded,
  saveChatHistory,
} from "@/lib/storage";
import type { ChatMessage, MoodEntry, UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function buildWelcomeMessage(profile: UserProfile, todayEntry?: MoodEntry | null): ChatMessage {
  const name = profile.name.split(" ")[0];
  let content = "";

  if (todayEntry) {
    const moodMap: Record<number, string> = {
      1: "You're burned out today — that's real, and I see it. 💙",
      2: "I can see you're stressed today. Let's talk about it.",
      3: "Sounds like today's been just okay — that's perfectly fine.",
      4: "Great to see you're in a good headspace today! 😊",
      5: "You're feeling motivated — let's channel that energy! 🚀",
    };

    const moodLine = moodMap[todayEntry.mood] || "Good to have you here today.";
    const subjectLine =
      todayEntry.stressedSubjects.length > 0
        ? ` I noticed you're struggling with ${todayEntry.stressedSubjects.join(", ")} — we can tackle that together.`
        : "";

    content = `Hey ${name}! 🌿 ${moodLine}${subjectLine}

I've read your check-in. What's on your mind — want to vent, need a pep talk, or looking for a quick study tip?`;
  } else {
    content = `Hey ${name}! 🌿 Welcome back to your wellness space.

You haven't done a check-in today yet — but no pressure! I'm here whenever you need me. What's going on with your prep today?`;
  }

  return {
    id: `welcome_${Date.now()}`,
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
  };
}

export default function ChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isOnboarded()) {
      router.replace("/onboarding");
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    const p = getUserProfile()!;
    const entry = getTodaysMoodEntry();
    const history = getChatHistory();
    const allEntries = getMoodEntries();

    setProfile(p);
    setTodayEntry(entry);
    setStreak(allEntries.length);

    if (history.length === 0) {
      const welcome = buildWelcomeMessage(p, entry);
      const initialMessages = [welcome];
      setMessages(initialMessages);
      saveChatHistory(initialMessages);
    } else {
      setMessages(history);
    }
  }, [router]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!profile || !content.trim()) return;

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            userProfile: profile,
            todayEntry: todayEntry ?? undefined,
          }),
        });

        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toISOString(),
        };

        const finalMessages = [...updatedMessages, assistantMsg];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      } catch {
        const errorMsg: ChatMessage = {
          id: `ai_err_${Date.now()}`,
          role: "assistant",
          content:
            "Having a tiny connection hiccup 🌐 — but don't stress! Try this: write down 3 things you want to accomplish in the next study session. It clears the mental fog instantly.",
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, errorMsg];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, profile, todayEntry]
  );

  return (
    <PageWrapper className="flex flex-col">
      <Header profile={profile} streak={streak} />
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
      <Navbar />
    </PageWrapper>
  );
}
