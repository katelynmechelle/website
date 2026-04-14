import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Katelyn Cook | Original Paintings",
  description:
    "Original oil, acrylic, and mixed media paintings by Katelyn Cook. Equestrian art, animal studies, and nature-inspired works available for purchase and commission.",
  openGraph: {
    title: "Katelyn Cook | Original Paintings",
    description: "Original paintings that bring warmth, life, and story into your space.",
    url: "https://katelyncook.art",
    siteName: "Katelyn Cook Fine Art",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
