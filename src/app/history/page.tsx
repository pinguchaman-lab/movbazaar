"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Play, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useLanguage } from "@/i18n";
import { getTmdbImageUrl } from "@/lib/config";
import { CatalogSkeleton } from "@/components/skeleton";

export default function HistoryPage() {
  const { items, isLoaded, removeItem, clear } = useWatchHistory();
  const { t } = useLanguage();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!isLoaded) {
    return <CatalogSkeleton title="Watch History" />;
  }

  const handleClearAll = () => {
    clear();
    setShowConfirmClear(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <History className="w-6 h-6 text-[#e50914]" />
            <span>{t.history.title}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track your watching progress and resume playback where you left off
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.history.clearHistory}</span>
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmClear && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{t.history.clearConfirm}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-300">{t.history.empty}</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            {t.history.emptyDesc}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e50914] text-white text-xs font-bold hover:bg-[#f40612] transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const percent =
              item.duration > 0
                ? Math.min(100, Math.max(2, (item.progress / item.duration) * 100))
                : 0;

            const remainingSec = Math.max(0, item.duration - item.progress);
            const remainingMins = Math.ceil(remainingSec / 60);

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

            const formattedDate = new Date(item.timestamp).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <div
                key={`${item.type}-${item.tmdbId}-${item.season || 0}-${item.episode || 0
                  }`}
                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play Overlay */}
                  <Link
                    href={playHref}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeItem(
                        item.tmdbId,
                        item.type,
                        item.season,
                        item.episode
                      )
                    }
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
                    <div
                      className="h-full bg-[#e50914] transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <Link
                      href={detailsHref}
                      className="text-sm font-bold text-white hover:text-[#e50914] transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      {item.type === "tv" && (
                        <span className="font-semibold text-zinc-300">
                          S{String(item.season || 1).padStart(2, "0")} E
                          {String(item.episode || 1).padStart(2, "0")}
                        </span>
                      )}
                      <span>•</span>
                      <span>
                        {remainingMins > 0
                          ? `${remainingMins} min left`
                          : t.history.completed}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500">
                    <span>Watched {formattedDate}</span>
                    <Link
                      href={playHref}
                      className="text-[#e50914] hover:underline font-semibold flex items-center gap-1"
                    >
                      {t.history.resume} →
                    </Link>
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

