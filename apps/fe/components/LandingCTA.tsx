"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

interface LandingCTAProps {
  variant: "nav" | "hero";
}

export function LandingCTA({ variant }: LandingCTAProps) {
  const { user, setAuthModalOpen, isLoading } = useAuth();
  const router = useRouter();

  const handleCTA = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      setAuthModalOpen(true);
    }
  };

  if (variant === "nav") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <ThemeToggle />
        <button 
          onClick={handleCTA}
          disabled={isLoading}
          style={{
            background: "transparent",
            border: "1px solid var(--color-ink-faint)",
            borderRadius: "100px",
            padding: "8px 20px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: isLoading ? "default" : "pointer",
            color: "var(--color-ink)",
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 0.2s ease"
          }}
        >
          {user ? "Dashboard" : "Log In"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <button 
        onClick={handleCTA}
        disabled={isLoading}
        style={{
          background: "var(--color-saffron)",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "100px",
          padding: "16px 40px",
          fontSize: "18px",
          fontWeight: 600,
          cursor: isLoading ? "default" : "pointer",
          boxShadow: "0 4px 20px rgba(232, 97, 10, 0.2)",
          opacity: isLoading ? 0.8 : 1,
          transition: "all 0.2s ease"
        }}
      >
        {user ? "Back to Dashboard" : "Get Started Now"}
      </button>
    </div>
  );
}
