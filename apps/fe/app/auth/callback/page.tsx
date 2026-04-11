import type { Metadata } from "next";
import { Suspense } from "react";
import AuthCallback from "../../components/auth-callback";

export const metadata: Metadata = {
  title: "Auth Callback",
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          <section className="auth-panel">
            <p className="eyebrow">Signing in</p>
            <h1>Just a second.</h1>
            <p className="muted">Preparing your secure sign-in...</p>
          </section>
        </main>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
