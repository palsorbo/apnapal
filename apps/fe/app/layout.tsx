import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { AuthProvider } from "../components/AuthProvider";
import { AuthModal } from "../components/AuthModal";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ApnaPal | Your AI Companion",
  description: "Experience the next generation of AI companions built for India.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

import { ThemeProvider } from "../components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.className} ${fraunces.variable} antialiased`} style={{backgroundColor: "var(--color-cream)", minHeight: "100dvh", margin: 0, overflowX: "hidden" }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
