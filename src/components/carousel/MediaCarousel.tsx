"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "../movie-card/MovieCard";
import { TMDBMovie, TMDBTVShow, MediaItem } from "@/types/tmdb";

interface MediaCarouselProps {
  title: string;
  items: (TMDBMovie | TMDBTVShow | MediaItem)[];
  defaultType?: "movie" | "tv";
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function MediaCarousel({
  title,
  items,
  defaultType = "movie",
  viewAllHref,
  viewAllLabel,
}: MediaCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-3 relative group/carousel">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#e50914] rounded-full inline-block" />
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs text-zinc-400 hover:text-white font-medium transition-colors flex items-center gap-0.5 group/link"
          >
            <span>{viewAllLabel || "View All"}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-[#e50914] text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all backdrop-blur-md border border-white/10 shadow-xl"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 py-2"
        >
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
              <div
                key={`${type}-${item.id}`}
                className="w-36 sm:w-44 md:w-48 lg:w-52 flex-shrink-0"
              >
                <MovieCard
                  id={item.id}
                  type={type}
                  title={title}
                  posterPath={item.poster_path}
                  backdropPath={item.backdrop_path}
                  voteAverage={item.vote_average || 0}
                  releaseDate={releaseDate}
                />
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-[#e50914] text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all backdrop-blur-md border border-white/10 shadow-xl"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

