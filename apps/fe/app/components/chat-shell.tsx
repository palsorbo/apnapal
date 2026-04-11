"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

type AuthState = "checking" | "signed-out" | "signed-in";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default function ChatShell() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAuthState("signed-out");
      setEmail(null);
      return;
    }

    const client = supabase;

    async function loadSession() {
      const {
        data: { session }
      } = await client.auth.getSession();

      setAuthState(session ? "signed-in" : "signed-out");
      setEmail(session?.user.email ?? null);
    }

    void loadSession();

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "signed-in" : "signed-out");
      setEmail(session?.user.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  }

  if (authState === "checking") {
    return (
      <main className="page">
        <section className="app-panel">
          <p className="eyebrow">Chat</p>
          <h1>Opening your space...</h1>
        </section>
      </main>
    );
  }

  if (authState === "signed-out") {
    return (
      <main className="page">
        <section className="app-panel">
          <p className="eyebrow">Private chat</p>
          <h1>Sign in to continue.</h1>
          <p>
            Your conversations load only after authentication. The Worker API still verifies
            every private request.
          </p>
          <Link className="button primary" href="/login/">
            Go to login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="chat-layout">
      <aside className="chat-sidebar" aria-label="Conversations">
        <p className="eyebrow">Conversations</p>
        <button className="conversation active" type="button">
          Asha
        </button>
        <button className="conversation" type="button">
          Kabir
        </button>
      </aside>
      <section className="chat-window" aria-label="Chat with Asha">
        <div className="chat-header">
          <div>
            <p className="eyebrow">Asha</p>
            <h1>Daily check-in</h1>
            <p className="muted">{email ?? "Signed in"}</p>
          </div>
          <div className="chat-header-actions">
            <span className="api-pill">API: {apiUrl}</span>
            <button className="button secondary" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
        <div className="messages">
          <p className="message assistant">Welcome back. What should we make lighter today?</p>
          <p className="message user">I want to plan my next step without overthinking.</p>
        </div>
        <form className="composer">
          <label className="sr-only" htmlFor="message">
            Message
          </label>
          <input id="message" name="message" placeholder="Write a message..." />
          <button className="button primary" type="submit">
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
