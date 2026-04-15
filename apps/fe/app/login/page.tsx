"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setErrorMsg("");
    
    // We expect NextJs and Supabase Email OTP auth setup
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Will trigger user creation if missing
      }
    });

    setLoading(false);

    if (error) {
      setErrorMsg("Kuch gadbad ho gayi, dobara try karo. (" + error.message + ")");
    } else {
      setStep("otp");
      setResendCooldown(30);
    }
  };

  const verifyOtpCode = async (code: string) => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    setLoading(false);

    if (error) {
       // Supabase default expiration is usually token expired or invalid
      if (error.message.toLowerCase().includes("expired")) {
        setErrorMsg("Code expire ho gaya hai. Please naya code mangaiye.");
      } else {
        setErrorMsg("Galat code. Fir se check karo yaar.");
      }
    } 
    // Success => AuthProvider onAuthStateChange will pick it up and router.push("/")
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // strictly digits
    setOtp(val);
    
    if (val.length === 6) {
      verifyOtpCode(val);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      justifyContent: "flex-end",
    }}>
      {/* Illustration Area / Top Area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
         <h1 className="font-fraunces" style={{ fontSize: "var(--text-display)", fontWeight: 400 }}>ApnaPal</h1>
      </div>

      {/* Bottom Sheet Card */}
      <div style={{
        background: "var(--color-surface)",
        borderRadius: "24px 24px 0 0",
        padding: "20px 24px",
        paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
        boxShadow: "0 -4px 24px rgba(28, 22, 20, 0.14)",
      }}>
        {/* Handle Bar */}
        <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "var(--color-ink-faint)", margin: "0 auto 20px" }}></div>

        {step === "email" ? (
          <form onSubmit={handleSendEmail} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
             <h2 className="font-fraunces" style={{ fontSize: "var(--text-title-lg)", fontWeight: 400, margin: "0 0 8px 0" }}>
               Log in or Sign up
             </h2>
             
             {errorMsg && (
              <p style={{ color: "var(--color-rose)", fontSize: "var(--text-caption)", margin: 0 }}>{errorMsg}</p>
             )}

             <input 
               type="email" 
               placeholder="Enter your email ID"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               autoComplete="email"
               style={{
                 background: "var(--color-cream-dark)",
                 border: `1.5px solid ${errorMsg ? "var(--color-rose)" : "var(--color-ink-faint)"}`,
                 borderRadius: "14px",
                 padding: "14px 16px",
                 fontSize: "15px",
                 fontFamily: "var(--font-sora)",
                 color: "var(--color-ink)",
                 minHeight: "52px",
                 width: "100%"
               }}
               required
             />

             <button 
               type="submit"
               disabled={loading || !email}
               style={{
                 background: "var(--color-saffron)",
                 color: "#FFFFFF",
                 borderRadius: "14px",
                 padding: "14px 24px",
                 fontFamily: "var(--font-sora)",
                 fontSize: "15px",
                 fontWeight: 600,
                 minHeight: "52px",
                 width: "100%",
                 border: "none",
                 opacity: loading || !email ? 0.7 : 1,
               }}
             >
               {loading ? "Rukiye..." : "Continue"}
             </button>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 className="font-fraunces" style={{ fontSize: "var(--text-title-lg)", fontWeight: 400, margin: "0 0 8px 0" }}>
               Check your email
            </h2>
            <p style={{ fontSize: "var(--text-body)", color: "var(--color-ink-mid)", margin: 0 }}>
              We sent a 6-digit code to {email}.
            </p>

            {errorMsg && (
              <p style={{ color: "var(--color-rose)", fontSize: "var(--text-caption)", margin: 0 }}>{errorMsg}</p>
             )}

            <input 
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={handleOtpChange}
              autoComplete="one-time-code"
              style={{
                background: "var(--color-cream-dark)",
                border: `1.5px solid ${errorMsg ? "var(--color-rose)" : "var(--color-ink-faint)"}`,
                borderRadius: "14px",
                padding: "14px 16px",
                fontSize: "18px",
                letterSpacing: "4px",
                textAlign: "center",
                fontFamily: "var(--font-sora)",
                color: "var(--color-ink)",
                minHeight: "52px",
                width: "100%"
              }}
              required
            />

            <button 
               onClick={() => handleSendEmail()}
               disabled={resendCooldown > 0 || loading}
               style={{
                  background: "transparent",
                  color: "var(--color-ink-mid)",
                  border: "none",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginTop: "8px"
               }}
             >
               {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
