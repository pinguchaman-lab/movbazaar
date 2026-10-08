"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, Star, Plus, Check } from "lucide-react";
import { MediaItem, TMDBMovie, TMDBTVShow } from "@/types/tmdb";
import { getTmdbImageUrl } from "@/lib/config";
import { useLanguage } from "@/i18n";
import { useWatchlist } from "@/hooks/useWatchlist";

interface HeroProps {
  item:
  | MediaItem
  | (TMDBMovie & { media_type?: "movie" })
  | (TMDBTVShow & { media_type?: "tv" });
}

export function Hero({ item }: HeroProps) {
  const { t } = useLanguage();
  const { isInList, add, remove } = useWatchlist();
  const [backdropSrc, setBackdropSrc] = React.useState(() =>
    getTmdbImageUrl(item?.backdrop_path, "original")
  );

  React.useEffect(() => {
    if (item?.backdrop_path) {
      setBackdropSrc(getTmdbImageUrl(item.backdrop_path, "original"));
    }
  }, [item?.backdrop_path]);

  if (!item) return null;

  const isTv = item.media_type === "tv" || "first_air_date" in item;
  const type: "movie" | "tv" = isTv ? "tv" : "movie";
  const title = "title" in item ? item.title : item.name;
  const releaseDate = "release_date" in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";

  const inWatchlist = isInList(item.id, type);

  const watchHref =
    type === "movie"
      ? `/watch/movie/${item.id}`
      : `/watch/tv/${item.id}/1/1`;

  const detailsHref = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  const toggleWatchlist = () => {
    if (inWatchlist) {
      remove(item.id, type);
    } else {
      add({
        tmdbId: item.id,
        type,
        title,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        voteAverage: item.vote_average,
        releaseYear: year ? String(year) : undefined,
      });
    }
  };

  return (
    <div className="relative w-full h-[65vh] min-h-[460px] max-h-[620px] overflow-hidden select-none bg-zinc-950">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropSrc}
          alt={title || "Backdrop"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-90"
          onError={() => setBackdropSrc("/placeholder-poster.svg")}
        />
        {/* Gradients: Vignette and read overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/70 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12 sm:pb-16">
        <div className="max-w-2xl space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-zinc-300">
            <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-[#e50914] text-white text-[11px] font-bold">
              {type === "movie" ? "Featured Movie" : "Featured Series"}
            </span>
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1 text-cinema-gold bg-black/60 px-2 py-0.5 rounded border border-white/10">
                <Star className="w-3.5 h-3.5 fill-cinema-gold" />
                {item.vote_average.toFixed(1)}
              </span>
            )}
            {year && <span>{year}</span>}
            {"runtime" in item && item.runtime ? (
              <span>
                {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
              </span>
            ) : null}
            {"number_of_seasons" in item && item.number_of_seasons ? (
              <span>
                {item.number_of_seasons} {t.common.seasons}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {title}
          </h1>

          {/* Tagline or genres */}
          {item.tagline && (
            <p className="text-xs sm:text-sm italic text-zinc-300 font-medium line-clamp-1">
              &ldquo;{item.tagline}&rdquo;
            </p>
          )}

          {/* Overview */}
          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
            {item.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={watchHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white font-bold text-sm shadow-xl shadow-red-950/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{t.common.watchNow}</span>
            </Link>

            <Link
              href={detailsHref}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/90 text-white font-semibold text-sm backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95 transition-all"
            >
              <Info className="w-4 h-4" />
              <span>{t.common.moreInfo}</span>
            </Link>

            <button
              onClick={toggleWatchlist}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm backdrop-blur-md border transition-all ${inWatchlist
                ? "bg-emerald-600/80 border-emerald-500 text-white"
                : "bg-black/60 border-white/15 text-zinc-200 hover:text-white hover:bg-zinc-800/80"
                }`}
              title={inWatchlist ? t.common.inWatchlist : t.common.addToWatchlist}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">{t.common.inWatchlist}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">{t.common.addToWatchlist}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

