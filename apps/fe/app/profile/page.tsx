"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Profile as ProfileType } from "@apnapal/types";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProfile();
      setProfile(data);
      setName(data.name || "");
      setPreferredLanguage(data.preferred_language || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const updates: { name?: string; preferred_language?: string } = {};

      if (name !== (profile?.name || "")) {
        updates.name = name.trim() || undefined;
      }

      if (preferredLanguage !== (profile?.preferred_language || "")) {
        updates.preferred_language = preferredLanguage || undefined;
      }

      if (Object.keys(updates).length === 0) {
        return; // No changes
      }

      const updatedProfile = await api.updateProfile(updates);
      setProfile(updatedProfile);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-ink-soft)" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-cream)",
        color: "var(--color-ink)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "48px 16px 24px 16px",
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
          Profile
        </h1>
      </header>

      {/* Content */}
      <main style={{ padding: "0 16px 32px 16px" }}>
        {error && (
          <div
            style={{
              background: "var(--color-rose-light)",
              border: "1px solid var(--color-rose)",
              borderRadius: "14px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "#7A1035",
                fontSize: "var(--text-caption)",
                margin: 0,
              }}
            >
              {error}
            </p>
          </div>
        )}

        {success && (
          <div
            style={{
              background: "var(--color-jade-light)",
              border: "1px solid var(--color-jade)",
              borderRadius: "14px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "var(--color-jade)",
                fontSize: "var(--text-caption)",
                margin: 0,
              }}
            >
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Name Field */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-body)",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "8px",
            }}
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={100}
            style={{
              width: "100%",
              background: "var(--color-cream-dark)",
              border: "1.5px solid var(--color-ink-faint)",
              borderRadius: "14px",
              padding: "14px 16px",
              fontSize: "15px",
              fontFamily: "var(--font-sora)",
              color: "var(--color-ink)",
              minHeight: "52px",
              outline: "none",
            }}
          />
          <p
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-ink-soft)",
              margin: "4px 0 0 0",
            }}
          >
            Optional. How you'd like to be addressed by your companions.
          </p>
        </div>

        {/* Language Field */}
        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-body)",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "12px",
            }}
          >
            Preferred Language
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {LANGUAGES.map((lang) => (
              <label
                key={lang.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  background: preferredLanguage === lang.value ? "var(--color-saffron-light)" : "var(--color-surface)",
                  border: `1.5px solid ${preferredLanguage === lang.value ? "var(--color-saffron)" : "var(--color-ink-faint)"}`,
                  borderRadius: "14px",
                  cursor: "pointer",
                  minHeight: "52px",
                }}
              >
                <input
                  type="radio"
                  name="language"
                  value={lang.value}
                  checked={preferredLanguage === lang.value}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "var(--color-saffron)",
                  }}
                />
                <span
                  style={{
                    fontSize: "15px",
                    color: "var(--color-ink)",
                  }}
                >
                  {lang.label}
                </span>
              </label>
            ))}
          </div>
          <p
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-ink-soft)",
              margin: "8px 0 0 0",
            }}
          >
            Choose your preferred language for companions to respond in.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
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
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </main>
    </div>
  );
}