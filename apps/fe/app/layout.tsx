import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { AuthProvider } from "../components/AuthProvider";
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
  title: "ApnaPal",
  description: "An AI companion app built for India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sora.className} ${fraunces.variable} antialiased`} style={{backgroundColor: "var(--color-cream)", minHeight: "100vh", margin: 0, overflowX: "hidden" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
