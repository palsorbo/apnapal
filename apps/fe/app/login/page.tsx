import type { Metadata } from "next";
import LoginForm from "../components/login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return (
    <main className="page">
      <section className="auth-panel">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to ApnaPal.</h1>
        <LoginForm />
        <p className="muted">
          Supabase email sign-in keeps this static frontend simple while the Worker protects
          private data.
        </p>
      </section>
    </main>
  );
}
