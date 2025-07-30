import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weddingtroop.com"),
  title: "Wedding Troop - Wedding Photography & Cinematography",
  description:
    "Wedding Troop: We don't just capture weddings — we live them with you! Professional wedding photography and cinematography services.",
  keywords:
    "wedding photography, wedding cinematography, wedding videography, wedding photographer, wedding videographer, wedding films, wedding videos, wedding photography services, wedding cinematography services",
  authors: [{ name: "Wedding Troop" }],
  robots: "index, follow",
  openGraph: {
    title: "Wedding Troop - Wedding Photography & Cinematography",
    description:
      "We don't just capture weddings — we live them with you! Professional wedding photography and cinematography services.",
    type: "website",
    url: "https://weddingtroop.com",
    images: [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: "Wedding Troop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Troop - Wedding Photography & Cinematography",
    description:
      "We don't just capture weddings — we live them with you! Professional wedding photography and cinematography services.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "https://weddingtroop.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
