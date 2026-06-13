"use client";

import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { isOnboarded, saveUserProfile } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isOnboarded()) {
      router.replace("/checkin");
    }
  }, [router]);

  function handleComplete(profile: UserProfile) {
    saveUserProfile(profile);
    router.push("/checkin");
  }

  return (
    <main className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      <OnboardingForm onComplete={handleComplete} />
    </main>
  );
}
