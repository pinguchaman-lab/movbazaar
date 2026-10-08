"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Globe,
  Film,
  Tv,
  Bookmark,
  History,
  Home,
  Menu,
  X,
  Play,
  Settings,
  Loader2,
  Star,
  Sparkles,
} from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/i18n";
import { useAuth } from "@/context/AuthContext";
import { MediaItem } from "@/types/tmdb";
import { getTmdbImageUrl, config } from "@/lib/config";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { isVip, openLoginModal } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const langContainerRef = useRef<HTMLDivElement>(null);

  // Scroll listener for translucent background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchDropdownOpen(false);
      }
      if (
        langContainerRef.current &&
        !langContainerRef.current.contains(e.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchDropdownOpen(false);
  }, [pathname]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&suggest=true`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results?.slice(0, 8) || []);
          setSearchDropdownOpen(true);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: t.nav.home, href: "/", icon: Home },
    { label: t.nav.movies, href: "/movies", icon: Film },
    { label: t.nav.tvShows, href: "/tv", icon: Tv },
    { label: t.nav.watchlist, href: "/watchlist", icon: Bookmark },
    { label: t.nav.history, href: "/history", icon: History },
  ];

  const moviesResults = searchResults.filter((item) => item.media_type === "movie");
  const tvResults = searchResults.filter((item) => item.media_type === "tv");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3"
          : "bg-gradient-to-b from-black/90 via-black/40 to-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-black tracking-wider group focus:outline-none"
            >
              <span className="text-[#e50914] flex items-center justify-center w-8 h-8 rounded bg-[#e50914]/15 border border-[#e50914]/40 group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-[#e50914]" />
              </span>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-colors">
                MOV<span className="text-[#e50914]">BAZAAR</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive
                      ? "text-white bg-white/10 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Search, Language, Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input Bar with Autocomplete Dropdown */}
            <div ref={searchContainerRef} className="relative w-44 sm:w-64 lg:w-72">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder={t.common.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setSearchDropdownOpen(true);
                  }}
                  className="w-full bg-zinc-900/90 text-sm text-zinc-100 placeholder-zinc-500 rounded-full pl-9 pr-4 py-1.5 border border-zinc-800 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                />
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-zinc-400 animate-spin absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </form>

              {/* Autocomplete Dropdown */}
              {searchDropdownOpen && searchResults.length > 0 && (
                <div className="absolute top-full right-0 left-0 sm:left-auto sm:w-80 sm:-right-4 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="max-h-96 overflow-y-auto divide-y divide-zinc-800/60 no-scrollbar">
                    {moviesResults.length > 0 && (
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
                          {t.search.moviesFound}
                        </div>
                        {moviesResults.map((movie) => {
                          const year = movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "";
                          return (
                            <Link
                              key={`movie-${movie.id}`}
                              href={`/movie/${movie.id}`}
                              onClick={() => setSearchDropdownOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/80 transition-colors group"
                            >
                              <div className="relative w-9 h-12 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                                <Image
                                  src={getTmdbImageUrl(movie.poster_path, "w300")}
                                  alt={movie.title || "Poster"}
                                  fill
                                  sizes="36px"
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium text-zinc-100 truncate group-hover:text-[#e50914] transition-colors">
                                  {movie.title}
                                </div>
                                <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                                  <span>{year || "Movie"}</span>
                                  <span>•</span>
                                  <span className="flex items-center text-cinema-gold font-medium">
                                    <Star className="w-2.5 h-2.5 fill-cinema-gold mr-0.5" />
                                    {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {tvResults.length > 0 && (
                      <div className="p-2">
                        <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
                          {t.search.tvFound}
                        </div>
                        {tvResults.map((show) => {
                          const year = show.first_air_date
                            ? new Date(show.first_air_date).getFullYear()
                            : "";
                          return (
                            <Link
                              key={`tv-${show.id}`}
                              href={`/tv/${show.id}`}
                              onClick={() => setSearchDropdownOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/80 transition-colors group"
                            >
                              <div className="relative w-9 h-12 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                                <Image
                                  src={getTmdbImageUrl(show.poster_path, "w300")}
                                  alt={show.name || "Poster"}
                                  fill
                                  sizes="36px"
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium text-zinc-100 truncate group-hover:text-[#e50914] transition-colors">
                                  {show.name}
                                </div>
                                <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                                  <span>{year || "TV Show"}</span>
                                  <span>•</span>
                                  <span className="flex items-center text-cinema-gold font-medium">
                                    <Star className="w-2.5 h-2.5 fill-cinema-gold mr-0.5" />
                                    {show.vote_average ? show.vote_average.toFixed(1) : "—"}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    <div className="p-2 bg-zinc-950/50">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full py-1.5 px-3 text-center text-xs font-medium text-[#e50914] hover:bg-zinc-800 rounded transition-colors"
                      >
                        {t.common.viewAll} ({searchResults.length}+)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div ref={langContainerRef} className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors text-xs font-medium border border-zinc-800"
                aria-label="Select UI Language"
                title="Change UI Language"
              >
                <Globe className="w-4 h-4 text-zinc-400" />
                <span className="hidden sm:inline uppercase text-[11px] font-bold">
                  {language}
                </span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 py-1">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {t.common.language}
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-800 transition-colors ${language === lang.code
                        ? "text-[#e50914] font-semibold bg-white/5"
                        : "text-zinc-200"
                        }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">
                        {lang.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* VIP Status / Ad-Free Access Button */}
            <button
              onClick={openLoginModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isVip
                  ? "bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-950/40"
                  : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800"
              }`}
              title={isVip ? "VIP Active (100% Ad-Free)" : "VIP Login for Ad-Free Streaming"}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isVip ? "text-amber-400" : "text-amber-400"}`} />
              <span className="hidden sm:inline">
                {isVip ? "VIP Active" : "VIP Pass"}
              </span>
            </button>

            {/* Settings Quick Modal Trigger */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors border border-zinc-800"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-zinc-200" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "text-white bg-[#e50914]/20 border border-[#e50914]/40"
                    : "text-zinc-300 hover:bg-zinc-900"
                    }`}
                >
                  <Icon className="w-4 h-4 text-zinc-400" />
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile VIP Pass Trigger */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLoginModal();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2 border ${
                isVip
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              <span className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isVip ? "VIP Member (Ad-Free Active)" : "VIP Ad-Free Login"}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-400">
                {isVip ? "Active" : "Sign In"}
              </span>
            </button>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#e50914]" />
              {t.common.settings}
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  OMSS Streaming Backend URL
                </label>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300">
                  {config.omss.apiUrl}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Configured via NEXT_PUBLIC_OMSS_API_URL in .env.local
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  TMDB Metadata Status
                </label>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
                  <span className="text-zinc-300">TMDB API Key</span>
                  <span
                    className={`font-semibold ${config.tmdb.apiKey ? "text-emerald-400" : "text-amber-400"
                      }`}
                  >
                    {config.tmdb.apiKey ? "Configured" : "Default Mode (Rich Mock Fallback)"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  {t.common.language}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-2 rounded-lg border text-xs font-medium text-center transition-colors ${language === lang.code
                        ? "border-[#e50914] bg-[#e50914]/15 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                        }`}
                    >
                      {lang.nativeName} ({lang.name})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

