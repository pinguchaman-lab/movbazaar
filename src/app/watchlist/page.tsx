"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Play, Trash2, Film } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useLanguage } from "@/i18n";
import { getTmdbImageUrl } from "@/lib/config";
import { CatalogSkeleton } from "@/components/skeleton";

export default function WatchlistPage() {
  const { items, isLoaded, remove } = useWatchlist();
  const { t } = useLanguage();

  if (!isLoaded) {
    return <CatalogSkeleton title="My Watchlist" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-[#e50914]" />
            <span>{t.watchlist.title}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {items.length} {items.length === 1 ? "title" : "titles"} saved to your
            personal list
          </p>
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-300">{t.watchlist.empty}</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            {t.watchlist.emptyDesc}
          </p>
          <div className="pt-2">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e50914] text-white text-xs font-bold hover:bg-[#f40612] transition-colors"
            >
              <Film className="w-4 h-4" />
              {t.watchlist.browseMovies}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {items.map((item) => {
            const playHref =
              item.type === "movie"
                ? `/watch/movie/${item.tmdbId}`
                : `/watch/tv/${item.tmdbId}/1/1`;

            const detailsHref =
              item.type === "movie"
                ? `/movie/${item.tmdbId}`
                : `/tv/${item.tmdbId}`;

            return (
              <div
                key={`${item.type}-${item.tmdbId}`}
                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1"
              >
                <div className="aspect-[2/3] relative w-full overflow-hidden">
                  <Image
                    src={getTmdbImageUrl(item.posterPath, "w500")}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Remove button */}
                  <button
                    onClick={() => remove(item.tmdbId, item.type)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                    title={t.common.removeFromWatchlist}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Play Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={playHref}
                      className="w-11 h-11 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                      title="Watch Now"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </Link>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <Link
                      href={detailsHref}
                      className="text-xs font-semibold text-zinc-100 line-clamp-1 hover:text-[#e50914] transition-colors"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
                      <span>{item.releaseYear || item.type}</span>
                      <span className="uppercase font-semibold text-zinc-400">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

