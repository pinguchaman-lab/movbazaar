"use client";

import React from "react";
import { MovieCard } from "../movie-card/MovieCard";
import { TMDBMovie, TMDBTVShow, MediaItem } from "@/types/tmdb";

interface MovieGridProps {
  items: (TMDBMovie | TMDBTVShow | MediaItem)[];
  defaultType?: "movie" | "tv";
  emptyMessage?: string;
}

export function MovieGrid({
  items,
  defaultType = "movie",
  emptyMessage = "No titles found in this category.",
}: MovieGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
      {items.map((item) => {
        const isTv =
          ("media_type" in item && item.media_type === "tv") ||
          (!("media_type" in item) && defaultType === "tv") ||
          "first_air_date" in item;

        const type: "movie" | "tv" = isTv ? "tv" : "movie";
        const title = "title" in item ? item.title : (item as TMDBTVShow).name;
        const releaseDate =
          "release_date" in item
            ? (item as TMDBMovie).release_date
            : (item as TMDBTVShow).first_air_date;

        return (
          <MovieCard
            key={`${type}-${item.id}`}
            id={item.id}
            type={type}
            title={title}
            posterPath={item.poster_path}
            backdropPath={item.backdrop_path}
            voteAverage={item.vote_average || 0}
            releaseDate={releaseDate}
          />
        );
      })}
    </div>
  );
}

