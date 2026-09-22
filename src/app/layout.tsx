import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono, Caveat_Brush } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { siteUrl } from "@/lib/seo/pages";
import "./globals.css";

/**
 * One family carries both body and display so headings and UI text share the
 * same voice, the way the reference design does. Manrope's tight apertures and
 * tall x-height give the compact, engineered feel at heavy weights while
 * staying readable at 13-14px in dense dashboard tables.
 */
const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Carries the one handwritten word in the hero headline against the wide,
// thin caps underneath it — the contrast between the two is the whole effect.
const script = Caveat_Brush({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Reserved for the uppercase micro-labels and numeric readouts.
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — The AI Adoption Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: `${SITE_NAME} — The AI Adoption Platform`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const base = siteUrl();

  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${mono.variable} ${script.variable} font-sans flex min-h-screen flex-col antialiased`}
      >
        {/* Site-wide identity, declared once here so individual pages only
            need to describe themselves. */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${base}/#organization`,
                name: SITE_NAME,
                url: base,
                logo: `${base}/ploy-mark.png`,
                description: SITE_DESCRIPTION,
              },
              {
                "@type": "WebSite",
                "@id": `${base}/#website`,
                name: SITE_NAME,
                url: base,
                publisher: { "@id": `${base}/#organization` },
              },
            ],
          }}
        />
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}
