import Link from "next/link";

const characters = [
  {
    name: "Asha",
    role: "Daily check-ins",
    note: "Gentle conversation for routines, reflection, and small resets."
  },
  {
    name: "Kabir",
    role: "Creative spark",
    note: "Story prompts, playful ideas, and momentum when the page feels quiet."
  },
  {
    name: "Mira",
    role: "Calm focus",
    note: "Short, grounded chats that help you choose the next useful step."
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Private AI companions</p>
          <h1>Conversations that feel close, useful, and yours.</h1>
          <p className="hero-text">
            ApnaPal gives you thoughtful characters for daily reflection, emotional steadiness,
            and creative companionship.
          </p>
          <div className="actions">
            <Link className="button primary" href="/characters/">
              Meet characters
            </Link>
            <Link className="button secondary" href="/chat/">
              Open chat
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Conversation preview">
          <div className="chat-bubble left">How are you arriving today?</div>
          <div className="chat-bubble right">A little scattered, but ready.</div>
          <div className="chat-bubble left">Then we begin with one honest breath.</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Characters</p>
          <h2>Choose the kind of presence you need.</h2>
        </div>
        <div className="card-grid">
          {characters.map((character) => (
            <article className="card" key={character.name}>
              <h3>{character.name}</h3>
              <p className="card-role">{character.role}</p>
              <p>{character.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
