import type { Metadata } from "next";
import Link from "next/link";
import "./styles.css";

export const metadata: Metadata = {
  title: {
    default: "ApnaPal",
    template: "%s | ApnaPal"
  },
  description: "AI companions for thoughtful everyday conversations.",
  metadataBase: new URL("https://apnapal.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="ApnaPal home">
            ApnaPal
          </Link>
          <nav className="nav" aria-label="Main navigation">
            <Link href="/characters/">Characters</Link>
            <Link href="/chat/">Chat</Link>
            <Link href="/login/">Login</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <span>ApnaPal</span>
          <nav aria-label="Footer navigation">
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
