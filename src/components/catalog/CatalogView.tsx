"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MovieGrid } from "../movie-grid/MovieGrid";
import { TMDBMovie, TMDBTVShow, TMDBGenre } from "@/types/tmdb";
import { useLanguage } from "@/i18n";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Film,
  Tv,
  Globe,
  Calendar,
  Sparkles,
} from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";

interface CatalogViewProps {
  type: "movie" | "tv";
  title: string;
  items: (TMDBMovie | TMDBTVShow)[];
  genres: TMDBGenre[];
  currentGenreId?: number;
  currentSort?: string;
  currentCategory?: string;
  currentLanguage?: string;
  currentYear?: string;
  currentPage: number;
  totalPages: number;
}

export function CatalogView({
  type,
  title,
  items,
  genres,
  currentGenreId,
  currentSort = "popularity.desc",
  currentCategory = "all",
  currentLanguage = "all",
  currentYear = "all",
  currentPage,
  totalPages,
}: CatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/${type === "movie" ? "movies" : "tv"}?${params.toString()}`);
  };

  const switchType = (newType: "movie" | "tv") => {
    if (newType === type) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("genre"); // Genres vary between movie and tv
    params.set("page", "1");
    router.push(`/${newType === "movie" ? "movies" : "tv"}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/${type === "movie" ? "movies" : "tv"}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortOptions = [
    { value: "popularity.desc", label: t.catalog.sortPopular },
    { value: "vote_average.desc", label: t.catalog.sortTopRated },
    {
      value:
        type === "movie"
          ? "primary_release_date.desc"
          : "first_air_date.desc",
      label: t.catalog.sortNewest,
    },
  ];

  const categories = [
    { id: "all", label: "All Collections" },
    { id: "hindi-dubbed", label: "🇮🇳 Hindi Dubbed / Dual Audio", color: "text-amber-400" },
    { id: "indian-tv", label: "📺 TV Serials & Reality Shows", color: "text-emerald-400" },
    { id: "web-series", label: "⚡ Desi Web Series", color: "text-yellow-400" },
    { id: "anime", label: "⛩️ Anime (Hindi Dub & Sub)", color: "text-pink-400" },
    { id: "south-indian", label: "🔥 South Indian (Hindi Dub)", color: "text-orange-400" },
    { id: "bollywood", label: "🎬 Bollywood (Hindi)", color: "text-red-400" },
    { id: "hollywood", label: "🍿 Hollywood (Hindi & Eng)", color: "text-sky-400" },
    { id: "korean", label: "🇰🇷 Korean (K-Drama / Film)", color: "text-purple-400" },
  ];

  const languageOptions = [
    { value: "all", label: "All Languages" },
    { value: "hi", label: "Hindi (हिंदी / Dubbed)" },
    { value: "en", label: "English (Original / Dubbed)" },
    { value: "te", label: "Telugu (తెలుగు)" },
    { value: "ta", label: "Tamil (தமிழ்)" },
    { value: "ml", label: "Malayalam (മലയാളം)" },
    { value: "kn", label: "Kannada (ಕನ್ನಡ)" },
    { value: "ko", label: "Korean (한국어)" },
    { value: "ja", label: "Japanese (Anime)" },
    { value: "es", label: "Spanish (Español)" },
    { value: "fr", label: "French (Français)" },
  ];

  const yearOptions = [
    { value: "all", label: "All Years" },
    { value: "2026", label: "2026 (Latest)" },
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2010s", label: "2010 - 2019 Decade" },
    { value: "2000s", label: "2000 - 2009 Decade" },
    { value: "classics", label: "Classics (< 2000)" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Top Header & Format Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-7 bg-[#e50914] rounded-full inline-block" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 pl-5.5">
            Discover verified streaming titles with multi-audio, dual language and quality options
          </p>
        </div>

        {/* Format Selector: Movies vs TV Shows */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800/90 self-start md:self-auto">
          <button
            onClick={() => switchType("movie")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              type === "movie"
                ? "bg-[#e50914] text-white shadow-md shadow-red-950/60"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => switchType("tv")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              type === "tv"
                ? "bg-[#e50914] text-white shadow-md shadow-red-950/60"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>TV Series</span>
          </button>
        </div>
      </div>

      {/* Primary Category Quick-Filters (Indian, Korean, Hollywood, All) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Regional & Curated Categories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#e50914] text-white shadow-md shadow-red-950/60 ring-1 ring-red-500/50"
                    : "bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters Bar: Language, Year, Sorting */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4.5 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Language & Year Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-medium">Language:</span>
            <select
              value={currentLanguage}
              onChange={(e) => updateParam("lang", e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#e50914]"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-medium">Year:</span>
            <select
              value={currentYear}
              onChange={(e) => updateParam("year", e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#e50914]"
            >
              {yearOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400 font-medium">{t.catalog.sortBy}:</span>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#e50914]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre Pills Filter */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          {t.catalog.genres}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => updateParam("genre", undefined)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !currentGenreId
                ? "bg-[#e50914] text-white shadow-md shadow-red-950/50"
                : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white"
            }`}
          >
            {t.catalog.allGenres}
          </button>
          {genres.map((genre) => {
            const isActive = currentGenreId === genre.id;
            return (
              <button
                key={genre.id}
                onClick={() => updateParam("genre", String(genre.id))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#e50914] text-white shadow-md shadow-red-950/50"
                    : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest Ad Slot (Hidden automatically for VIP Users) */}
      <AdBanner slot="catalog-header" />

      {/* Grid */}
      <MovieGrid items={items} defaultType={type} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 pt-8 border-t border-zinc-800/80">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.catalog.previous}
        </button>

        <span className="text-xs text-zinc-400 font-medium">
          {t.catalog.page} <strong className="text-white">{currentPage}</strong>
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={totalPages <= currentPage}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t.catalog.next}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
