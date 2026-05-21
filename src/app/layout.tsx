import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "GAIMIN Avatar AI",
  description: "Create game-inspired profile avatars with GAIMIN branding.",
  metadataBase: new URL("https://avatar.gaimin.gg"),
  openGraph: {
    title: "GAIMIN Avatar AI",
    description: "Upload a selfie and generate game-inspired avatar variations.",
    url: "https://avatar.gaimin.gg",
    siteName: "GAIMIN Avatar AI",
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
      <body>{children}</body>
    </html>
  );
}
