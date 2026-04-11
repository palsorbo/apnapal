// app/characters/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Characters",
  description: "Meet ApnaPal characters for reflection, focus, and creative conversation."
};

export const revalidate = 60; // optional (ISR)

export default async function CharactersPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters`);
  const characters = await res.json();

  return (
    <main className="page">
      <section className="section compact">
        <div className="section-heading">
          <p className="eyebrow">Characters</p>
          <h1>Find a conversation style that fits the moment.</h1>
        </div>

        <div className="card-grid">
          {characters.map((character: any) => (
            <article className="card" key={character.name}>
              <h2>{character.name}</h2>
              <p className="card-role">{character.tone}</p>
              <p>{character.description}</p>
              <Link href="/chat/">Start chatting</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}