import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "ApnaPal terms."
};

export default function TermsPage() {
  return (
    <main className="page">
      <section className="section compact">
        <p className="eyebrow">Terms</p>
        <h1>Use ApnaPal thoughtfully.</h1>
        <p>
          ApnaPal is built for supportive conversation, reflection, and creative companionship.
          It is not a replacement for professional medical, legal, or financial advice.
        </p>
      </section>
    </main>
  );
}
