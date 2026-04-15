"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Minimum 1.5s visual splash for polish if we want, but removing for pure speed is fine too.
          setTimeout(() => {
             setIsLoading(false);
          }, 1500);
        }
      } catch (error) {
        console.error("Error fetching session", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "var(--color-cream)",
        color: "var(--color-ink)",
      }}>
        <h1 className="font-fraunces" style={{ fontSize: "var(--text-display)", fontWeight: 400 }}>ApnaPal</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
