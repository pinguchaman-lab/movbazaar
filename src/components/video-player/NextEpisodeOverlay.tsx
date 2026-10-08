"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";

interface NextEpisodeOverlayProps {
  nextEpisodeUrl: string;
  nextEpisodeNumber: number;
  nextEpisodeTitle?: string;
  onReplay: () => void;
}

export function NextEpisodeOverlay({
  nextEpisodeUrl,
  nextEpisodeNumber,
  nextEpisodeTitle,
  onReplay,
}: NextEpisodeOverlayProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = nextEpisodeUrl;
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, nextEpisodeUrl]);

  return (
    <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-5 shadow-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#e50914]">
          Episode Finished
        </div>

        <div>
          <h3 className="text-xl font-black text-white">Up Next: Episode {nextEpisodeNumber}</h3>
          {nextEpisodeTitle && (
            <p className="text-xs text-zinc-400 mt-1">{nextEpisodeTitle}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href={nextEpisodeUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white font-bold text-sm shadow-xl shadow-red-950/50 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Next ({countdown}s)</span>
          </Link>

          <button
            onClick={onReplay}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition-colors border border-zinc-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
}

