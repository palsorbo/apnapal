"use client";

import { Character } from "@apnapal/types";
import { useRouter } from "next/navigation";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/character?id=${character.id}`);
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
        boxShadow: "var(--level-1-shadow)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image area */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3/4",
          position: "relative",
          background: "linear-gradient(135deg, var(--shimmer-start) 0%, var(--shimmer-end) 100%)",
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
        {/* Online indicator overlay */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "var(--color-jade)",
            border: "2px solid var(--color-surface)",
            boxShadow: "0 0 8px rgba(26, 122, 94, 0.4)",
          }}
        />

        {/* Gradient fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to top, var(--color-surface) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Content area */}
      <div
        style={{
          padding: "12px 16px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div>
          <h3
            className="font-fraunces"
            style={{
              fontSize: "20px",
              fontWeight: 400,
              margin: "0 0 4px 0",
              color: "var(--color-ink)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {character.name}
          </h3>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--color-saffron-light)",
              color: "#8C3800",
              border: `1px solid var(--color-saffron-mid)`,
              borderRadius: "100px",
              padding: "2px 8px",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            {character.persona_type}
          </div>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--color-ink-soft)",
            margin: "0",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {/* {character.bio || "Tap to start chatting..."} */}
          {"Tap to start chatting..."}
        </p>
      </div>
    </div>
  );
}