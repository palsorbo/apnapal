"use client";

import { useEffect, useState } from "react";

export function TimeGreeting() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <h1
      className="font-fraunces"
      style={{
        fontSize: "var(--text-display)",
        fontWeight: 400,
        color: "var(--color-ink)",
        margin: "0 0 8px 0",
      }}
    >
      {greeting}
    </h1>
  );
}