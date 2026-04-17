import { LandingCTA } from "../components/LandingCTA";

export default function LandingPage() {
  return (
    <div 
      style={{ 
        minHeight: "100dvh", 
        background: "var(--color-cream)", 
        color: "var(--color-ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      {/* Navigation */}
      <nav style={{ 
        width: "100%", 
        maxWidth: "1200px", 
        padding: "32px 0", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <div className="font-fraunces" style={{ fontSize: "24px", fontWeight: 600 }}>ApnaPal</div>
        <LandingCTA variant="nav" />
      </nav>

      {/* Hero Section */}
      <main style={{ 
        flex: 1, 
        width: "100%", 
        maxWidth: "1200px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        textAlign: "center",
        paddingBottom: "80px"
      }}>
        <h1 className="font-fraunces" style={{ 
          fontSize: "clamp(48px, 10vw, 84px)", 
          lineHeight: 1.1, 
          fontWeight: 400,
          margin: "0 0 24px 0",
          letterSpacing: "-0.02em"
        }}>
          Your <span style={{ color: "var(--color-saffron)" }}>Companion</span>,<br />
          Anytime. Anywhere.
        </h1>
        
        <p style={{ 
          fontSize: "clamp(18px, 4vw, 24px)", 
          maxWidth: "600px", 
          color: "var(--color-ink-mid)",
          margin: "0 0 48px 0",
          lineHeight: 1.5
        }}>
          Empathetic AI companions built for India. Multilingual, culturally aware, and always ready to listen.
        </p>

        <LandingCTA variant="hero" />

        {/* Features Preview */}
        <div style={{ 
          marginTop: "100px", 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px",
          width: "100%"
        }}>
          <div style={{ background: "var(--color-surface)", padding: "32px", borderRadius: "24px", border: "1px solid var(--color-ink-faint)" }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>🇮🇳</div>
            <h3 className="font-fraunces" style={{ fontSize: "20px", marginBottom: "12px", fontWeight: 500 }}>Culturally Contextual</h3>
            <p style={{ color: "var(--color-ink-mid)", lineHeight: 1.5 }}>Understands regional nuances, festivals, and the Indian lifestyle better than any generic AI.</p>
          </div>
          <div style={{ background: "var(--color-surface)", padding: "32px", borderRadius: "24px", border: "1px solid var(--color-ink-faint)" }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>🗣️</div>
            <h3 className="font-fraunces" style={{ fontSize: "20px", marginBottom: "12px", fontWeight: 500 }}>Multi-lingual</h3>
            <p style={{ color: "var(--color-ink-mid)", lineHeight: 1.5 }}>Fluent in English, Hindi, and Hinglish. Talk exactly how you talk in real life.</p>
          </div>
          <div style={{ background: "var(--color-surface)", padding: "32px", borderRadius: "24px", border: "1px solid var(--color-ink-faint)" }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔐</div>
            <h3 className="font-fraunces" style={{ fontSize: "20px", marginBottom: "12px", fontWeight: 500 }}>Private & Secure</h3>
            <p style={{ color: "var(--color-ink-mid)", lineHeight: 1.5 }}>Your conversations are yours. Secure auth and end-to-end focus on user privacy.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        width: "100%", 
        maxWidth: "1200px", 
        padding: "48px 0 32px 0", 
        borderTop: "1px solid var(--color-ink-faint)",
        display: "flex",
        justifyContent: "space-between",
        color: "var(--color-ink-mid)",
        fontSize: "14px"
      }}>
        © 2026 ApnaPal AI. Built for the Bharat of tomorrow.
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
          <a href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>
    </div>
  );
}
