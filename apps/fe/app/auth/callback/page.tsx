"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase-js automatically detects the session in the URL (code or hash)
        // and exchanges it. We just need to wait for it to settle.
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          return;
        }

        if (data.session) {
          // Successfully authenticated
          router.push("/dashboard");
        } else {
          // No session found, maybe the link expired or was already used
          setError("Session not found. The link might have expired.");
        }
      } catch (err) {
        console.error("Unexpected error during auth callback:", err);
        setError("An unexpected error occurred.");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100dvh",
      backgroundColor: "var(--color-cream)",
      color: "var(--color-ink)",
      padding: "24px",
      textAlign: "center"
    }}>
      {!error ? (
        <>
          <div className="loader" style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--color-ink-faint)",
            borderTop: "3px solid var(--color-saffron)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "24px"
          }}></div>
          <h2 className="font-fraunces" style={{ fontSize: "24px", fontWeight: 400, margin: "0 0 12px 0" }}>
            Authenticating...
          </h2>
          <p style={{ color: "var(--color-ink-mid)" }}>
            Please wait while we log you in securely.
          </p>
        </>
      ) : (
        <>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>⚠️</div>
          <h2 className="font-fraunces" style={{ fontSize: "24px", fontWeight: 400, margin: "0 0 12px 0", color: "var(--color-rose)" }}>
            Auth Error
          </h2>
          <p style={{ color: "var(--color-ink-mid)", marginBottom: "32px" }}>
            {error}
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "var(--color-saffron)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "100px",
              padding: "12px 32px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Go back to Home
          </button>
        </>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
