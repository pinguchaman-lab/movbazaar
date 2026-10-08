"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, X, ChevronRight } from "lucide-react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useLanguage } from "@/i18n";
import { getTmdbImageUrl } from "@/lib/config";

export function ContinueWatching() {
  const { items, isLoaded, removeItem } = useWatchHistory();
  const { t } = useLanguage();

  if (!isLoaded || items.length === 0) return null;

  const formatRemaining = (progress: number, duration: number) => {
    if (!duration || duration <= 0) return "";
    const remainingSec = Math.max(0, duration - progress);
    const mins = Math.ceil(remainingSec / 60);
    return `${mins} ${t.common.min} ${t.home.remaining}`;
  };

  return (
    <section className="space-y-3 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#e50914] rounded-full inline-block" />
          {t.home.continueWatching}
        </h2>
        <Link
          href="/history"
          className="text-xs text-zinc-400 hover:text-white font-medium transition-colors flex items-center gap-0.5 group/link"
        >
          <span>{t.common.viewAll}</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
        {items.slice(0, 10).map((item) => {
          const percent =
            item.duration > 0
              ? Math.min(100, Math.max(2, (item.progress / item.duration) * 100))
              : 0;

          const playHref =
            item.type === "movie"
              ? `/watch/movie/${item.tmdbId}?t=${Math.floor(item.progress)}`
              : `/watch/tv/${item.tmdbId}/${item.season || 1}/${item.episode || 1
              }?t=${Math.floor(item.progress)}`;

          const detailsHref =
            item.type === "movie"
              ? `/movie/${item.tmdbId}`
              : `/tv/${item.tmdbId}`;

          const imageSrc = item.backdropPath
            ? getTmdbImageUrl(item.backdropPath, "w780")
            : getTmdbImageUrl(item.posterPath, "w500");

          return (
            <div
              key={`${item.type}-${item.tmdbId}-${item.season || 0}-${item.episode || 0
                }`}
              className="relative w-64 sm:w-72 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group hover:border-zinc-700 hover:shadow-xl transition-all"
            >
              {/* Media image container */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                <Image
                  src={imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 256px, 288px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Dismiss item button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeItem(item.tmdbId, item.type, item.season, item.episode);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from Continue Watching"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Play Overlay Button */}
                <Link
                  href={playHref}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                >
                  <div className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </Link>

                {/* Progress bar along bottom of thumbnail */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                  <div
                    className="h-full bg-[#e50914] transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Text metadata */}
              <div className="p-3">
                <Link
                  href={detailsHref}
                  className="block text-xs font-bold text-zinc-100 truncate hover:text-[#e50914] transition-colors"
                >
                  {item.title}
                </Link>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                  <span>
                    {item.type === "tv" && item.season
                      ? `S${String(item.season).padStart(2, "0")} E${String(
                        item.episode || 1
                      ).padStart(2, "0")}`
                      : "Movie"}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {formatRemaining(item.progress, item.duration)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

