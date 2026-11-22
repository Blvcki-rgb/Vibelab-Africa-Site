import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "VibeLab Africa — Votre business en ligne, propulsé par l'IA.",
    template: "%s — VibeLab Africa",
  },
  description:
    "Studio de vibe coding à Casablanca et Dakar : sites vitrines, boutiques en ligne, dashboards et automatisations IA, conçus et mis en ligne de A à Z.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "VibeLab Africa",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
