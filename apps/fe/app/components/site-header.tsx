"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

type AuthState = "checking" | "signed-out" | "signed-in";

export default function SiteHeader() {
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAuthState("signed-out");
      return;
    }

    const client = supabase;

    async function loadSession() {
      const {
        data: { session }
      } = await client.auth.getSession();

      setAuthState(session ? "signed-in" : "signed-out");
    }

    void loadSession();

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "signed-in" : "signed-out");
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

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="ApnaPal home">
        ApnaPal
      </Link>
      <nav className="nav" aria-label="Main navigation">
        <Link href="/characters/">Characters</Link>
        <Link href="/chat/">Chat</Link>
        {authState === "signed-in" ? (
          <button className="nav-button" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        ) : (
          <Link href="/login/">{authState === "checking" ? "Account" : "Login"}</Link>
        )}
      </nav>
    </header>
  );
}
