import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Toaster } from "@/components/ui/sonner";
import { getLocale } from "@/lib/i18n/get-locale";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "OracleMaster — Certification 1Z0-071 Training Platform",
  description:
    "Plateforme de formation premium pour la certification Oracle Database SQL 1Z0-071. Cours interactifs, simulateur d'examen, flashcards, sandbox SQL et plus.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider locale={locale}>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
