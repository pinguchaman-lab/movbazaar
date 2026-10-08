import React from "react";
import { Loader2 } from "lucide-react";

export default function WatchMovieLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-center items-center px-2 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-6xl space-y-4">
        {/* Top back bar skeleton */}
        <div className="h-4 w-36 bg-zinc-850 bg-zinc-800/60 rounded animate-pulse" />

        {/* Player Skeleton */}
        <div className="w-full aspect-video rounded-2xl bg-zinc-950 border border-zinc-850 border-zinc-800/60 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/50 to-transparent" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#e50914] animate-spin" />
            <span className="text-xs text-zinc-400 font-medium">
              Preparing video stream...
            </span>
          </div>
        </div>

        {/* Footer info skeleton */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="h-5 w-48 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-96 max-w-full bg-zinc-800/60 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

