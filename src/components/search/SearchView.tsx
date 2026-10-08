"use client";

import React, { useState, useMemo } from "react";
import { MediaItem } from "@/types/tmdb";
import { MovieGrid } from "@/components/movie-grid/MovieGrid";
import { Search, Film, Tv, SlidersHorizontal } from "lucide-react";

interface SearchViewProps {
  items: MediaItem[];
  query: string;
}

function getItemDate(item: MediaItem): string {
  if ("release_date" in item && item.release_date) return item.release_date;
  if ("first_air_date" in item && item.first_air_date) return item.first_air_date;
  return "";
}

export function SearchView({ items, query }: SearchViewProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "tv">("all");
  const [langFilter, setLangFilter] = useState<"all" | "indian" | "korean" | "english">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"popular" | "top_rated" | "newest">("popular");

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter((item) => item.media_type === typeFilter);
    }

    // Filter by language / origin
    if (langFilter === "korean") {
      result = result.filter((item) => item.original_language === "ko");
    } else if (langFilter === "indian") {
      result = result.filter((item) =>
        ["hi", "te", "ta", "ml", "kn", "bn"].includes(item.original_language || "")
      );
    } else if (langFilter === "english") {
      result = result.filter(
        (item) => item.original_language === "en" || !item.original_language
      );
    }

    // Filter by year
    if (yearFilter !== "all") {
      if (yearFilter === "2010s") {
        result = result.filter((item) => {
          const d = getItemDate(item);
          return d >= "2010-01-01" && d <= "2019-12-31";
        });
      } else if (yearFilter === "2000s") {
        result = result.filter((item) => {
          const d = getItemDate(item);
          return d >= "2000-01-01" && d <= "2009-12-31";
        });
      } else if (yearFilter === "classics") {
        result = result.filter((item) => {
          const d = getItemDate(item);
          return d < "2000-01-01";
        });
      } else {
        result = result.filter((item) => {
          const d = getItemDate(item);
          return d.startsWith(yearFilter);
        });
      }
    }

    // Sort
    if (sortBy === "top_rated") {
      result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => {
        const dateA = getItemDate(a);
        const dateB = getItemDate(b);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } else {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return result;
  }, [items, typeFilter, langFilter, yearFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Search className="w-6 h-6 text-[#e50914]" />
          <span>Search Discovery</span>
        </h1>
        {query ? (
          <p className="text-sm text-zinc-400 mt-2">
            Showing results for{" "}
            <span className="text-white font-semibold italic">
              &ldquo;{query}&rdquo;
            </span>{" "}
            ({filteredItems.length} of {items.length} titles matched)
          </p>
        ) : (
          <p className="text-sm text-zinc-400 mt-2">
            Enter any movie, show, or actor title to search.
          </p>
        )}
      </div>

      {/* Filter and Discovery Control Bar */}
      {items.length > 0 && (
        <div className="space-y-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
          {/* Top row: Type & Language Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Type selector */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  typeFilter === "all"
                    ? "bg-[#e50914] text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All Formats
              </button>
              <button
                onClick={() => setTypeFilter("movie")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  typeFilter === "movie"
                    ? "bg-[#e50914] text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => setTypeFilter("tv")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  typeFilter === "tv"
                    ? "bg-[#e50914] text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV Shows</span>
              </button>
            </div>

            {/* Language / Region Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-zinc-500 text-[11px] font-medium mr-1 hidden sm:inline">
                Category:
              </span>
              <button
                onClick={() => setLangFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  langFilter === "all"
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-900"
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setLangFilter("indian")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  langFilter === "indian"
                    ? "bg-amber-600 text-white shadow"
                    : "bg-zinc-950/80 text-amber-400 hover:text-amber-300 border border-amber-900/40"
                }`}
              >
                Indian Cinema
              </button>
              <button
                onClick={() => setLangFilter("korean")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  langFilter === "korean"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-zinc-950/80 text-purple-400 hover:text-purple-300 border border-purple-900/40"
                }`}
              >
                Korean (K-Drama)
              </button>
              <button
                onClick={() => setLangFilter("english")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  langFilter === "english"
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-900"
                }`}
              >
                Hollywood
              </button>
            </div>
          </div>

          {/* Bottom row: Year & Sort controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/60 text-xs">
            {/* Year Selector */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-medium">Release Year:</span>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-[#e50914]"
              >
                <option value="all">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2010s">2010s Decade</option>
                <option value="2000s">2000s Decade</option>
                <option value="classics">Classics (&lt; 2000)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "popular" | "top_rated" | "newest")}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-[#e50914]"
              >
                <option value="popular">Most Popular</option>
                <option value="top_rated">Highest Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid or Empty State */}
      {query && filteredItems.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-300">No results found for current filters</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your format, category, or year filters to discover matching titles.
          </p>
        </div>
      ) : (
        <MovieGrid
          items={filteredItems}
          emptyMessage="Type in the search bar above to begin searching."
        />
      )}
    </div>
  );
}
