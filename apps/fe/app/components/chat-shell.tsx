"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AuthState = "checking" | "signed-out" | "signed-in";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default function ChatShell() {
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
    const token = window.localStorage.getItem("apnapal.authToken");
    setAuthState(token ? "signed-in" : "signed-out");
  }, []);

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
          </div>
          <span className="api-pill">API: {apiUrl}</span>
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
