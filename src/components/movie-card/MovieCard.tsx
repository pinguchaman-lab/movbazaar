"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Star, Plus, Check } from "lucide-react";
import { getTmdbImageUrl } from "@/lib/config";
import { useWatchlist } from "@/hooks/useWatchlist";

export interface MovieCardProps {
  id: number;
  type: "movie" | "tv";
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  voteAverage: number;
  releaseDate?: string;
}

export function MovieCard({
  id,
  type,
  title,
  posterPath,
  backdropPath,
  voteAverage,
  releaseDate,
}: MovieCardProps) {
  const { isInList, add, remove } = useWatchlist();
  const inWatchlist = isInList(id, type);
  const [imgSrc, setImgSrc] = React.useState(() => getTmdbImageUrl(posterPath, "w500"));

  React.useEffect(() => {
    setImgSrc(getTmdbImageUrl(posterPath, "w500"));
  }, [posterPath]);

  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const href = type === "movie" ? `/movie/${id}` : `/tv/${id}`;
  const playHref =
    type === "movie" ? `/watch/movie/${id}` : `/watch/tv/${id}/1/1`;

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      remove(id, type);
    } else {
      add({
        tmdbId: id,
        type,
        title,
        posterPath,
        backdropPath,
        voteAverage,
        releaseYear: year ? String(year) : undefined,
      });
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1">
      <Link href={href} className="block aspect-[2/3] relative w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={title || "Poster"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgSrc("/placeholder-poster.svg")}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Rating Badge top-right */}
        <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[11px] font-semibold text-cinema-gold flex items-center gap-1 border border-white/10 shadow-md">
          <Star className="w-3 h-3 fill-cinema-gold text-cinema-gold" />
          <span>{voteAverage > 0 ? voteAverage.toFixed(1) : "—"}</span>
        </div>

        {/* Hover Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            href={playHref}
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
            title="Watch Now"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </Link>

          <button
            onClick={toggleWatchlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform border ${
              inWatchlist
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-black/80 text-white border-white/20 hover:bg-zinc-800"
            }`}
            title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Bottom Details */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-xs font-semibold text-zinc-100 line-clamp-1 group-hover:text-white transition-colors">
            {title}
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-0.5">
            <span>{year || (type === "movie" ? "Movie" : "TV Show")}</span>
            <span className="uppercase text-[9px] px-1 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 font-semibold text-zinc-300">
              {type}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

