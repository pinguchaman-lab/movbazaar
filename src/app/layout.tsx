import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { Navbar } from "@/components/navbar/Navbar";
import Link from "next/link";
import { Play } from "lucide-react";

export const metadata: Metadata = {
  title: "MovBazaar — Personal Movie & TV Streaming Web App",
  description:
    "A polished, personal movie and TV streaming web application with OMSS backend compatibility, TMDB metadata, and multi-track audio and subtitle support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-[#e50914] selection:text-white flex flex-col font-sans">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 pt-16 sm:pt-20">{children}</main>

          {/* Footer */}
          <footer className="border-t border-zinc-900 bg-zinc-950/80 text-zinc-500 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-[#e50914] text-[#e50914]" />
                </span>
                <span className="font-bold text-zinc-300">MovBazaar</span>
                <span>• Personal Home Streaming</span>
              </div>

              <div className="flex items-center gap-6">
                <Link href="/movies" className="hover:text-zinc-300 transition-colors">
                  Movies
                </Link>
                <Link href="/tv" className="hover:text-zinc-300 transition-colors">
                  TV Shows
                </Link>
                <Link href="/watchlist" className="hover:text-zinc-300 transition-colors">
                  My List
                </Link>
                <Link href="/history" className="hover:text-zinc-300 transition-colors">
                  History
                </Link>
              </div>

              <div className="text-[11px] text-zinc-600">
                OMSS Compatible Client • Powered by Next.js & TMDB
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
