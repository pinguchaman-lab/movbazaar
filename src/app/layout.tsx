import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { AuthProvider } from "@/context/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { Navbar } from "@/components/navbar/Navbar";
import Link from "next/link";
import { Play, Sparkles, Shield, Film, Tv, Globe, Clapperboard } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movbazaar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MovBazaar — Stream Movies & TV Series in Ultra HD",
    template: "%s | MovBazaar",
  },
  description:
    "Stream full movies and TV series online for free in Ultra HD 1080p and 4K. Watch trending Indian Cinema (Bollywood & South), Korean K-Dramas, and Hollywood blockbusters with Dual Audio Hindi dubbing, subtitles, and high-speed mirrors.",
  keywords: [
    "MovBazaar",
    "watch free movies online",
    "stream tv shows free",
    "dual audio hindi movies",
    "k-drama watch free",
    "free hd movies 1080p",
    "free streaming platform",
    "watch bollywood movies",
    "hollywood movies hindi dubbed",
    "movbazaar streaming",
    "free movie streaming site",
    "english subtitles movies",
  ],
  authors: [{ name: "MovBazaar Official" }],
  creator: "ssgamingop",
  publisher: "MovBazaar Media",
  applicationName: "MovBazaar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MovBazaar",
    title: "MovBazaar — Stream Movies & TV Series in Ultra HD",
    description:
      "Watch trending movies, web series, and TV shows in 1080p Ultra HD. Fast multi-server streaming with Dual Audio Hindi tracks and full subtitles.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MovBazaar — Official Streaming Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovBazaar — Stream Movies & TV Series in Ultra HD",
    description:
      "Watch trending movies, web series, and TV shows in 1080p Ultra HD with Dual Audio and subtitles.",
    images: ["/og-image.png"],
    creator: "@movbazaar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MovBazaar",
    url: siteUrl,
    description:
      "The premier streaming destination for movies, TV series, Indian cinema, and K-Dramas in Ultra HD.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-[#e50914] selection:text-white flex flex-col font-sans">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <LoginModal />
            <main className="flex-1 pt-16 sm:pt-20">{children}</main>

            {/* Official Platform Streaming Footer */}
            <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto select-none">
              <div className="max-w-7xl mx-auto space-y-10">
                {/* Top Section: Brand & High-Value Feature Badges */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-850">
                  <div className="space-y-2">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-2xl font-black tracking-wider group"
                    >
                      <span className="text-[#e50914] flex items-center justify-center w-8 h-8 rounded-lg bg-[#e50914]/20 border border-[#e50914]/40">
                        <Play className="w-4 h-4 fill-[#e50914]" />
                      </span>
                      <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        MOV<span className="text-[#e50914]">BAZAAR</span>
                      </span>
                    </Link>
                    <p className="text-xs text-zinc-400 max-w-md">
                      The official global streaming destination for movies, TV series, Indian cinema, and Korean dramas in Ultra HD 1080p with Dual Audio dubbing.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ultra 1080p CDN</span>
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <Globe className="w-3.5 h-3.5 text-sky-400" />
                      <span>Dual Audio &amp; Hindi Dubs</span>
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ad-Free VIP System</span>
                    </span>
                  </div>
                </div>

                {/* Middle Section: Navigation Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
                  <div className="space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#e50914]" />
                      <span>Catalog Discovery</span>
                    </div>
                    <ul className="space-y-2 text-zinc-400">
                      <li>
                        <Link href="/movies" className="hover:text-white transition-colors">
                          All Movies
                        </Link>
                      </li>
                      <li>
                        <Link href="/tv" className="hover:text-white transition-colors">
                          TV Series &amp; Shows
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?category=indian" className="hover:text-amber-400 transition-colors">
                          Indian Cinema (Bollywood)
                        </Link>
                      </li>
                      <li>
                        <Link href="/tv?category=korean" className="hover:text-purple-400 transition-colors">
                          Korean Drama (K-Dramas)
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?category=hollywood" className="hover:text-sky-400 transition-colors">
                          Hollywood Blockbusters
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Clapperboard className="w-3.5 h-3.5 text-cinema-gold" />
                      <span>Popular Genres</span>
                    </div>
                    <ul className="space-y-2 text-zinc-400">
                      <li>
                        <Link href="/movies?genre=28" className="hover:text-white transition-colors">
                          Action &amp; Adventure
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?genre=878" className="hover:text-white transition-colors">
                          Sci-Fi &amp; Fantasy
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?genre=35" className="hover:text-white transition-colors">
                          Comedy
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?genre=27" className="hover:text-white transition-colors">
                          Horror &amp; Thriller
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?genre=18" className="hover:text-white transition-colors">
                          Drama &amp; Romance
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Languages</span>
                    </div>
                    <ul className="space-y-2 text-zinc-400">
                      <li>
                        <Link href="/movies?lang=hi" className="hover:text-white transition-colors">
                          Hindi Dubbed / Bollywood
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?lang=en" className="hover:text-white transition-colors">
                          English (Original)
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?lang=ko" className="hover:text-white transition-colors">
                          Korean (한국어)
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?lang=te" className="hover:text-white transition-colors">
                          Telugu &amp; Tamil Cinema
                        </Link>
                      </li>
                      <li>
                        <Link href="/movies?lang=ja" className="hover:text-white transition-colors">
                          Japanese Anime &amp; Film
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-sky-400" />
                      <span>User Hub</span>
                    </div>
                    <ul className="space-y-2 text-zinc-400">
                      <li>
                        <Link href="/watchlist" className="hover:text-white transition-colors">
                          My Watchlist
                        </Link>
                      </li>
                      <li>
                        <Link href="/history" className="hover:text-white transition-colors">
                          Continue Watching History
                        </Link>
                      </li>
                      <li>
                        <Link href="/search" className="hover:text-white transition-colors">
                          Search Discovery
                        </Link>
                      </li>
                      <li>
                        <span className="text-amber-400 font-semibold cursor-pointer">
                          VIP Ad-Free Pass Available
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Legal & DMCA Disclaimer */}
                <div className="pt-6 border-t border-zinc-900 text-[11px] text-zinc-400 leading-relaxed space-y-1.5">
                  <p>
                    <strong>Disclaimer:</strong> MovBazaar is an indexing and media discovery service. MovBazaar does not host, upload, or store any media files or copyright-protected videos on its servers. All video streams and images are indexed and embedded from non-affiliated, publicly available third-party media hosts.
                  </p>
                </div>

                {/* Bottom Credits Bar with explicit text requested by user */}
                <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
                  <div>
                    &copy; {new Date().getFullYear()} MovBazaar. All rights reserved.
                  </div>
                  <div className="font-semibold text-zinc-300">
                    Made by ssgamingop
                  </div>
                </div>
              </div>
            </footer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
