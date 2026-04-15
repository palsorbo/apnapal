"use client";

import { Character } from "@apnapal/types";
import { useRouter } from "next/navigation";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/character?id=${character.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "var(--color-surface)",
        borderRadius: "20px",
        border: "0.5px solid var(--color-ink-faint)",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: "56%",
          position: "relative",
          background: "linear-gradient(135deg, #f5f0e8 0%, #ede8e1 100%)", // Warm gradient placeholder
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
        {/* Gradient fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top, var(--color-surface) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Content area */}
      <div
        style={{
          padding: "16px",
          height: "44%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            className="font-fraunces"
            style={{
              fontSize: "var(--text-title)",
              fontWeight: 500,
              margin: "0 0 4px 0",
              color: "var(--color-ink)",
            }}
          >
            {character.name}
          </h3>

          {/* Persona badge */}
          <div
            style={{
              display: "inline-block",
              background: "var(--color-saffron-light)",
              color: "#8C3800",
              border: `1px solid var(--color-saffron-mid)`,
              borderRadius: "12px",
              padding: "4px 8px",
              fontSize: "var(--text-micro)",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {character.persona_type}
          </div>

          {/* Last message preview placeholder */}
          <p
            style={{
              fontSize: "var(--text-caption)",
              color: "var(--color-ink-soft)",
              margin: "0",
              lineHeight: 1.4,
            }}
          >
            Tap to start chatting...
          </p>
        </div>

        {/* Online indicator placeholder */}
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--color-jade)",
            alignSelf: "flex-end",
          }}
        />
      </div>
    </div>
  );
}