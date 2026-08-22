import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/navigation/nav";
import { Footer } from "@/components/footer/footer";
import { REVEAL_ARM_SCRIPT } from "@/components/ui/reveal";
import { site } from "@/lib/content/site";

/* Modern neutral grotesk for everything, monospace for scientific annotation. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  keywords: [
    "computational drug discovery",
    "AI for science",
    "cheminformatics",
    "computational biology",
    "graph neural networks",
    "pharmacokinetics",
    "PK/PD",
    "mechanistic modeling",
    "scientific machine learning",
  ],
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  // TODO(MacLean): set `metadataBase` to your deployed origin so Open Graph
  // image URLs resolve absolutely, and add an og-image once you have one.
};

export const viewport: Viewport = {
  themeColor: "#080a0d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `suppressHydrationWarning` covers only this element's own attributes:
    // the inline script below stamps `data-reveal-ready` on <html> before
    // hydration, which React would otherwise report as a mismatch.
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Arms scroll-reveal before the rest of the body parses — see
            components/ui/reveal.tsx. Kept as the first body child rather than
            in <head>, so it does not participate in React's head hoisting.
            Static string, no interpolation. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_ARM_SCRIPT }} />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
