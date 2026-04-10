import type { Metadata } from "next";

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
        <form className="form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" />
          <button className="button primary" type="submit">
            Continue
          </button>
        </form>
        <p className="muted">
          Authentication will connect to Supabase when the auth flow is added.
        </p>
      </section>
    </main>
  );
}
