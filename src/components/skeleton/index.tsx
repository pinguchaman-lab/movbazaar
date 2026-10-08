import React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-850 bg-zinc-800/60 ${className}`}
      {...props}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800/50 aspect-[2/3] p-3 flex flex-col justify-end">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-zinc-900/10 animate-pulse" />
      <div className="relative z-10 space-y-2">
        <div className="h-3.5 bg-zinc-800 rounded w-4/5 animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="h-2.5 bg-zinc-800/80 rounded w-1/4 animate-pulse" />
          <div className="h-2.5 bg-zinc-800/80 rounded w-1/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MediaCarouselSkeleton({ title }: { title?: string }) {
  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {title ? (
          <div className="h-6 bg-zinc-800 rounded w-36 animate-pulse" />
        ) : (
          <div className="h-6 bg-zinc-800 rounded w-44 animate-pulse" />
        )}
        <div className="h-4 bg-zinc-800/60 rounded w-16 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[65vh] min-h-[460px] max-h-[620px] bg-zinc-950 overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-zinc-900/30 animate-pulse" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12 sm:pb-16">
        <div className="max-w-2xl space-y-4 w-full">
          {/* Metadata pills */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-12 bg-zinc-800/70 rounded animate-pulse" />
            <div className="h-5 w-14 bg-zinc-800/70 rounded animate-pulse" />
          </div>

          {/* Title */}
          <div className="h-10 sm:h-14 bg-zinc-800 rounded w-3/4 animate-pulse" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3.5 bg-zinc-800/70 rounded w-full animate-pulse" />
            <div className="h-3.5 bg-zinc-800/70 rounded w-4/5 animate-pulse" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-11 w-32 bg-zinc-800 rounded-xl animate-pulse" />
            <div className="h-11 w-28 bg-zinc-800/60 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogSkeleton({ title }: { title?: string } = {}) {
  return (
    <div className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pt-4">
      {/* Header and filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {title ? (
            <h1 className="text-2xl sm:text-3xl font-black text-white/40 tracking-tight">
              {title}
            </h1>
          ) : (
            <div className="h-8 bg-zinc-800 rounded w-36 animate-pulse" />
          )}
          <div className="flex items-center gap-3">
            <div className="h-10 w-36 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Genre pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-zinc-900 border border-zinc-800 rounded-full flex-shrink-0 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="min-h-screen pb-16">
      {/* Banner */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] max-h-[500px] bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-zinc-900/40 animate-pulse" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-48 relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-48 sm:w-60 md:w-64 aspect-[2/3] rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse flex-shrink-0 mx-auto md:mx-0" />

          {/* Metadata */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
              <div className="h-5 w-12 bg-zinc-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
            </div>

            <div className="h-10 bg-zinc-800 rounded w-2/3 animate-pulse" />

            <div className="flex gap-2 pt-1">
              <div className="h-6 w-16 bg-zinc-900 rounded-md animate-pulse" />
              <div className="h-6 w-20 bg-zinc-900 rounded-md animate-pulse" />
              <div className="h-6 w-16 bg-zinc-900 rounded-md animate-pulse" />
            </div>

            <div className="flex gap-3 pt-3">
              <div className="h-12 w-36 bg-zinc-800 rounded-xl animate-pulse" />
              <div className="h-12 w-36 bg-zinc-850 bg-zinc-800/60 rounded-xl animate-pulse" />
            </div>

            <div className="h-20 bg-zinc-900/60 border border-zinc-800/60 rounded-xl animate-pulse w-full max-w-xl" />

            <div className="space-y-2 pt-2">
              <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
              <div className="h-3.5 bg-zinc-800/70 rounded w-full animate-pulse" />
              <div className="h-3.5 bg-zinc-800/70 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EpisodeSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse">
      <div className="w-full sm:w-44 aspect-video bg-zinc-800 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-zinc-800 rounded w-1/3" />
        <div className="h-3 bg-zinc-800/80 rounded w-full" />
        <div className="h-3 bg-zinc-800/80 rounded w-2/3" />
      </div>
    </div>
  );
}

export const CardSkeleton = MovieCardSkeleton;
export const GridSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);
