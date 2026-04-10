import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "ApnaPal privacy notes."
};

export default function PrivacyPage() {
  return (
    <main className="page">
      <section className="section compact">
        <p className="eyebrow">Privacy</p>
        <h1>Your conversations deserve careful handling.</h1>
        <p>
          ApnaPal keeps private chat data behind authenticated API requests and avoids
          exposing personal conversations on public pages.
        </p>
      </section>
    </main>
  );
}
