"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Character } from "@apnapal/types";

export default function CharacterProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const characterId = searchParams.get('id');

  useEffect(() => {
    if (characterId) {
      fetchCharacter();
    }
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCharacter(characterId!);
      setCharacter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load character");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!character) return;

    try {
      const conversation = await api.createConversation(character.id);
      router.push(`/chat?id=${conversation.id}`);
    } catch (err) {
      console.error("Failed to start conversation:", err);
      alert("Failed to start conversation. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
        minHeight: "100dvh",
          background: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-ink-soft)" }}>Loading...</p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div
        style={{
        minHeight: "100dvh",
          background: "var(--color-cream)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-rose)", marginBottom: "16px" }}>
          {error || "Character not found"}
        </p>
        <button
          onClick={() => router.back()}
          style={{
            background: "var(--color-saffron)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "14px",
            padding: "12px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-cream)",
      }}
    >
      {/* Header with back button */}
      <header
        style={{
          padding: "48px 16px 0 16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--color-surface)",
            border: "1px solid var(--color-ink-faint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <h1
          className="font-fraunces"
          style={{
            fontSize: "var(--text-title-lg)",
            fontWeight: 400,
            margin: 0,
          }}
        >
          {character.name}
        </h1>
      </header>

      {/* Full-bleed image area */}
      <section
        style={{
          height: "60vh",
          position: "relative",
          marginTop: "24px",
          background: "linear-gradient(135deg, #f5f0e8 0%, #ede8e1 100%)",
        }}
      >
        {character.avatar_url && (
          <img
            src={character.avatar_url}
            alt={character.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Content card overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "16px",
            right: "16px",
            background: "var(--color-surface)",
            borderRadius: "24px 24px 0 0",
            padding: "24px 20px",
            boxShadow: "0 -4px 24px rgba(28, 22, 20, 0.14)",
          }}
        >
          {/* Persona badge */}
          <div
            style={{
              display: "inline-block",
              background: "var(--color-saffron-light)",
              color: "#8C3800",
              border: `1px solid var(--color-saffron-mid)`,
              borderRadius: "12px",
              padding: "6px 12px",
              fontSize: "var(--text-caption)",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            {character.persona_type}
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "var(--text-body)",
              color: "var(--color-ink-mid)",
              lineHeight: 1.6,
              margin: "0 0 32px 0",
            }}
          >
            {character.description}
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStartChat}
            style={{
              background: "var(--color-saffron)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "14px",
              padding: "14px 24px",
              fontSize: "15px",
              fontWeight: 600,
              minHeight: "52px",
              width: "100%",
              cursor: "pointer",
            }}
          >
            Start Chatting
          </button>
        </div>
      </section>
    </div>
  );
}