"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    async function finishSignIn() {
      if (!supabase) {
        setMessage("Supabase is not configured yet.");
        return;
      }

      const code = searchParams.get("code");
      const errorCode = searchParams.get("error_code");
      const errorDescription = searchParams.get("error_description");

      if (errorCode) {
        setMessage(errorDescription ?? "The sign-in link was rejected.");
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(error.message);
          return;
        }
      }

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage("No active session found. Please request a new magic link.");
        return;
      }

      router.replace("/chat/");
    }

    void finishSignIn();
  }, [router, searchParams, supabase]);

  return (
    <main className="page">
      <section className="auth-panel">
        <p className="eyebrow">Signing in</p>
        <h1>Just a second.</h1>
        <p className="muted">{message}</p>
      </section>
    </main>
  );
}
