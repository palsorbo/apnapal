import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Characters",
  description: "Meet ApnaPal characters for reflection, focus, and creative conversation."
};

const characters = [
  {
    name: "Asha",
    description: "A steady companion for check-ins, routines, and kind accountability.",
    tone: "Warm and practical"
  },
  {
    name: "Kabir",
    description: "A creative partner for story ideas, prompts, and playful momentum.",
    tone: "Curious and vivid"
  },
  {
    name: "Mira",
    description: "A calm guide for decisions, next steps, and quiet focus.",
    tone: "Grounded and clear"
  }
];

export default function CharactersPage() {
  return (
    <main className="page">
      <section className="section compact">
        <div className="section-heading">
          <p className="eyebrow">Characters</p>
          <h1>Find a conversation style that fits the moment.</h1>
          <p>
            Each ApnaPal character is designed around a different kind of support,
            from daily reflection to creative exploration.
          </p>
        </div>
        <div className="card-grid">
          {characters.map((character) => (
            <article className="card" key={character.name}>
              <h2>{character.name}</h2>
              <p className="card-role">{character.tone}</p>
              <p>{character.description}</p>
              <Link className="text-link" href="/chat/">
                Start chatting
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
