"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import { api } from "../lib/api";
import { Character, Credits } from "@apnapal/types";
import { CharacterCard } from "../components/CharacterCard";
import { TimeGreeting } from "../components/TimeGreeting";
import { Skeleton } from "../components/Skeleton";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, [selectedLanguage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [charactersData, creditsData] = await Promise.all([
        api.getCharacters(selectedLanguage || undefined),
        api.getCredits()
      ]);
      setCharacters(charactersData);
      setCredits(creditsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang === selectedLanguage ? "" : lang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div
      className="min-h-screen-dvh"
      style={{
        background: "var(--color-cream)",
        color: "var(--color-ink)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "48px 16px 24px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          className="font-fraunces"
          style={{
            fontSize: "var(--text-title-lg)",
            fontWeight: 400,
            margin: 0,
          }}
        >
          ApnaPal
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Profile button */}
          <button
            onClick={() => router.push("/profile")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-ink-mid)",
              cursor: "pointer",
            }}
          >
            👤
          </button>

          {/* Notification bell placeholder */}
          <button
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-ink-mid)",
            }}
          >
            🔔
          </button>

          {/* Credit pill - clickable to go to credits page */}
          <button
            onClick={() => router.push("/credits")}
            style={{
              background: "var(--color-marigold-light)",
              border: "1px solid var(--color-marigold)",
              borderRadius: "100px",
              padding: "6px 12px",
              fontSize: "var(--text-caption)",
              fontWeight: 600,
              color: "#7A5200",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <span>💰</span>
            <span>{credits?.balance || 0}</span>
          </button>
        </div>
      </header>

      {/* Greeting */}
      <section style={{ padding: "0 16px 32px 16px" }}>
        <TimeGreeting />
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-ink-mid)",
            margin: "8px 0 0 0",
          }}
        >
          Choose a companion to chat with
        </p>
      </section>

      {/* Language Filter */}
      <section style={{ padding: "0 16px 20px 16px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["English", "Hindi", "Hinglish"].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang.toLowerCase())}
              style={{
                background: selectedLanguage === lang.toLowerCase() ? "var(--color-saffron)" : "var(--color-surface)",
                color: selectedLanguage === lang.toLowerCase() ? "#FFFFFF" : "var(--color-ink-mid)",
                border: selectedLanguage === lang.toLowerCase() ? "none" : "1px solid var(--color-ink-faint)",
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "var(--text-caption)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* Character Grid */}
      <section style={{ padding: "0 16px 100px 16px" }}>
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Skeleton height="200px" borderRadius="20px" />
                <Skeleton width="60%" height="24px" />
                <Skeleton width="40%" height="16px" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
            <h3 className="font-fraunces" style={{ fontSize: "20px", marginBottom: "8px" }}>
              Kuch gadbad ho gayi
            </h3>
            <p style={{ color: "var(--color-ink-mid)", marginBottom: "24px" }}>
              {error}
            </p>
            <button
              onClick={fetchData}
              style={{
                background: "var(--color-saffron)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "14px",
                padding: "14px 32px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(232, 97, 10, 0.2)",
              }}
            >
              Phir se koshish karein
            </button>
          </div>
        ) : characters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
            <h3 className="font-fraunces" style={{ fontSize: "20px", marginBottom: "8px" }}>
              Koi mil nahi raha...
            </h3>
            <p style={{ color: "var(--color-ink-mid)" }}>
              {selectedLanguage ? `"${selectedLanguage}" mein koi companion nahi mil raha. Language badal kar dekhein?` : "Abhi koi companion available nahi hai."}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        )}
      </section>

      {/* Debug logout button - remove in production */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
        <button
          onClick={handleLogout}
          style={{
            background: "var(--color-rose)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
