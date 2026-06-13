"use client";

import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { label: "Check-in", emoji: "📝", path: "/checkin" },
  { label: "Chat",     emoji: "💬", path: "/chat" },
  { label: "Insights", emoji: "📊", path: "/insights" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2 pb-safe">
        {TABS.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-all duration-200"
              style={{
                background: isActive ? "var(--brand-green-light)" : "transparent",
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              <span className="text-xl leading-none">{tab.emoji}</span>
              <span
                className="text-xs font-semibold"
                style={{
                  color: isActive ? "var(--brand-green)" : "var(--text-muted)",
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: "var(--brand-green)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
