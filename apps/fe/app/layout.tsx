import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/site-header";
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
        <SiteHeader />
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
