"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

type FormState = "idle" | "submitting" | "success" | "error";

export default function LoginForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormState("submitting");
    setMessage(null);

    if (!supabase) {
      setFormState("error");
      setMessage("Supabase is not configured yet. Add the public URL and anon key first.");
      return;
    }

    const redirectTo =
      typeof window === "undefined" ? undefined : `${window.location.origin}/auth/callback/`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    });

    if (error) {
      setFormState("error");
      setMessage(error.message);
      return;
    }

    setFormState("success");
    setMessage("Check your email for the secure sign-in link.");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button className="button primary" type="submit" disabled={formState === "submitting"}>
        {formState === "submitting" ? "Sending link..." : "Send magic link"}
      </button>
      {message ? (
        <p className={formState === "error" ? "status error" : "status success"}>{message}</p>
      ) : null}
    </form>
  );
}
