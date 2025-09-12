import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clipbox - Boostez votre visibilité, monétisez vos clips",
  description: "La plateforme qui connecte les marques aux créateurs de contenu pour des campagnes virales. Gagnez de l'argent en créant des clips pour les plus grandes marques.",
  keywords: "clipbox, créateur de contenu, influenceur, marketing d'influence, clips, tiktok, instagram, youtube, monétisation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
