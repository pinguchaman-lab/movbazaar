"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MovieGrid } from "../movie-grid/MovieGrid";
import { TMDBMovie, TMDBTVShow, TMDBGenre } from "@/types/tmdb";
import { useLanguage } from "@/i18n";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface CatalogViewProps {
  type: "movie" | "tv";
  title: string;
  items: (TMDBMovie | TMDBTVShow)[];
  genres: TMDBGenre[];
  currentGenreId?: number;
  currentSort?: string;
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
  currentPage,
  totalPages,
}: CatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const handleGenreChange = (genreId?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genreId) {
      params.set("genre", String(genreId));
    } else {
      params.delete("genre");
    }
    params.set("page", "1");
    router.push(`/${type === "movie" ? "movies" : "tv"}?${params.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.set("page", "1");
    router.push(`/${type === "movie" ? "movies" : "tv"}?${params.toString()}`);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-2 h-6 bg-[#e50914] rounded-full inline-block" />
            {title}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse and stream available {type === "movie" ? "movies" : "TV series"}
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <span className="text-xs text-zinc-400 font-medium">
            {t.catalog.sortBy}:
          </span>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-[#e50914]"
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
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {t.catalog.genres}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreChange(undefined)}
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
                onClick={() => handleGenreChange(genre.id)}
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

