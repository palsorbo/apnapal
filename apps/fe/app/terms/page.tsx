import Link from "next/link";

export const metadata = {
  title: "Terms of Service | ApnaPal",
  description: "Terms of Service for ApnaPal AI Companion service.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        
        <p style={{ 
          color: "var(--color-ink-mid)",
          margin: "0 0 48px 0",
        }}>
          Last updated: April 18, 2026
        </p>

        <div style={{ lineHeight: 1.8 }}>
          <h2 className="font-fraunces" style={{ marginTop: "0", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            1. Acceptance of Terms
          </h2>
          
          <p>
            By accessing or using Apna Pal ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            2. Service Description
          </h2>
          
          <p>
            Apna Pal provides AI companion services through our web application. The service includes text-based conversations, voice interactions, and virtual characters designed for companionship, emotional support, and entertainment.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            3. User Accounts
          </h2>
          
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li>You must be at least 18 years old to use this service</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You agree to provide accurate and complete information during registration</li>
            <li>We reserve the right to suspend or terminate accounts for violation of these terms</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            4. Payment Terms
          </h2>
          
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li>All payments are processed through Razorpay</li>
            <li>Credits purchased are non-refundable except in cases of service failure</li>
            <li>We reserve the right to modify pricing with 30 days prior notice</li>
            <li>Failed payments may result in temporary suspension of service access</li>
            <li>All transactions are in Indian Rupees (INR)</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            5. User Conduct
          </h2>
          
          <p>You agree NOT to:</p>
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li>Use the service for any illegal or unauthorized purpose</li>
            <li>Share harmful, abusive, or explicit content</li>
            <li>Attempt to hack, disrupt, or reverse engineer the service</li>
            <li>Impersonate other users or third parties</li>
            <li>Use automated systems to access or scrape the service</li>
            <li>Violate any applicable local, state, or national laws</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            6. Intellectual Property
          </h2>
          
          <p>
            All content, design, code, and AI models used in Apna Pal are the exclusive property of Apna Pal. Users retain ownership of their personal conversation data, but grant us a license to use this data to improve our AI services.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            7. Disclaimers
          </h2>
          
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li>The service is provided "as is" without warranties of any kind</li>
            <li>AI companions are virtual entities and do not represent real persons</li>
            <li>Conversations are for entertainment purposes only and do not constitute professional advice</li>
            <li>We do not guarantee uninterrupted or error-free service</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            8. Limitation of Liability
          </h2>
          
          <p>
            In no event shall Apna Pal be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            9. Termination
          </h2>
          
          <p>Either party may terminate this agreement at any time. Upon termination:</p>
          <ul style={{ margin: "16px 0", paddingLeft: "24px" }}>
            <li>Your access to the service will be discontinued</li>
            <li>Your data will be retained in accordance with our Privacy Policy</li>
          </ul>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            10. Governing Law
          </h2>
          
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            11. Changes To Terms
          </h2>
          
          <p>
            We may update these Terms periodically. Continued use of the service after changes are posted constitutes acceptance of the new terms.
          </p>

          <h2 className="font-fraunces" style={{ marginTop: "40px", marginBottom: "16px", fontSize: "24px", fontWeight: 500 }}>
            12. Contact Information
          </h2>
          
          <p>
            For questions about these Terms, contact us at: <a href="mailto:legal@apnapal.in" style={{ color: "var(--color-saffron)" }}>legal@apnapal.in</a>
          </p>
        </div>
      </main>
    </div>
  );
}
