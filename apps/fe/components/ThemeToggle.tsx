"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getEmoji = () => {
    if (theme === "light") return "☀️";
    if (theme === "dark") return "🌙";
    return "⚙️"; // System
  };

  const getLabel = () => {
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    return "System";
  };

  return (
    <button
      onClick={toggleTheme}
      title={`Theme: ${getLabel()} (Click to change)`}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-ink-faint)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "18px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden"
      }}
      className="theme-toggle"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.borderColor = "var(--color-saffron-mid)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = "var(--color-ink-faint)";
      }}
    >
      <span style={{ 
        display: "block",
        transition: "transform 0.3s ease",
        transform: theme === "system" ? "rotate(90deg)" : "none" 
      }}>
        {getEmoji()}
      </span>
      
      {/* Small dot indicator for manual override */}
      {theme !== "system" && (
        <div style={{
          position: "absolute",
          top: "6px",
          right: "6px",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "var(--color-saffron)",
          border: "1px solid var(--color-surface)"
        }} />
      )}
    </button>
  );
}
