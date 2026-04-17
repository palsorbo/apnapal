import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | ApnaPal",
  description: "Privacy Policy for ApnaPal AI Companion service.",
};

export default function PrivacyPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-cream)",
        color: "var(--color-ink)",
        padding: "0 24px",
      }}
    >
      <nav style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "32px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link href="/" className="font-fraunces" style={{ fontSize: "24px", fontWeight: 600, textDecoration: "none", color: "inherit" }}>
          ApnaPal
        </Link>
        <Link href="/" style={{ color: "var(--color-saffron)", textDecoration: "none" }}>
          ← Back Home
        </Link>
      </nav>

      <main style={{
        maxWidth: "800px",
        margin: "0 auto",
        paddingBottom: "80px"
      }}>
        <h1 className="font-fraunces" style={{
          fontSize: "48px",
          fontWeight: 400,
          margin: "0 0 16px 0",
        }}>
          Privacy Policy
        </h1>

        <p style={{
          color: "var(--color-ink-mid)",
          margin: "0 0 48px 0",
        }}>
          Last updated: April 18, 2026
        </p>

        <div style={{ lineHeight: 1.8 }}>
          <p>
            Apna Pal ("we", "our", or "us") operates the Apna Pal AI companion application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            1. Information We Collect
          </h2>

          <p>We collect the following types of information:</p>
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li><strong>Account Information:</strong> Email address authentication details when you register</li>
            <li><strong>Conversation Data:</strong> All messages, chat history, and interactions with AI companions</li>
            <li><strong>Payment Information:</strong> We do NOT store full credit card details. All payment processing is handled securely by Razorpay. We only store transaction IDs and payment status.</li>
            <li><strong>Technical Data:</strong> Device information, IP address, browser type, and usage analytics</li>
            <li><strong>User Preferences:</strong> Language settings, character preferences, and app configuration</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            2. How We Use Your Information
          </h2>

          <p>We use collected information to:</p>
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li>Provide and maintain our AI companion service</li>
            <li>Process payments and transactions</li>
            <li>Personalize your experience and improve our AI responses</li>
            <li>Communicate with you about service updates</li>
            <li>Comply with legal obligations and prevent fraud</li>
            <li>Analyze usage patterns to improve our service</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            3. Data Sharing & Disclosure
          </h2>

          <p>We do NOT sell your personal data. We may share information only with:</p>
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li><strong>Razorpay:</strong> For payment processing purposes, in accordance with their privacy policy</li>
            <li><strong>Service Providers:</strong> Cloud hosting, analytics, and AI infrastructure providers who are bound by confidentiality agreements</li>
            <li><strong>Legal Authorities:</strong> When required by law, court order, or government regulation</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            4. Data Security
          </h2>

          <p>
            We implement appropriate technical and organizational security measures including encryption, access controls, and regular security audits to protect your personal data.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            5. Your Rights
          </h2>

          <p>You have the right to:</p>
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your conversation history</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            6. Cookies & Tracking
          </h2>

          <p>
            We use essential cookies to maintain your session and ensure proper functioning of the service. We do not use tracking cookies for advertising purposes.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            7. Data Retention
          </h2>

          <p>
            We retain your data for as long as your account is active. Upon account deletion, we will delete your personal data within 30 days, except where we are legally required to retain records.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            8. Changes To This Policy
          </h2>

          <p>
            We may update this Privacy Policy periodically. We will notify you of any material changes via email or in-app notification.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            9. Contact Us
          </h2>

          <p>
            For privacy-related queries, contact us at: <a href="mailto:privacy@apnapal.com" style={{ color: "var(--color-saffron)" }}>privacy@apnapal.in</a>
          </p>
        </div>
      </main>
    </div>
  );
}
