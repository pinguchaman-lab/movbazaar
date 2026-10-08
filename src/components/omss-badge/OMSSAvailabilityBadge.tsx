"use client";

import React, { useEffect, useState } from "react";
import { Server, WifiOff, CheckCircle2, Volume2 } from "lucide-react";
import { OmssResult } from "@/lib/omss";

interface OMSSAvailabilityBadgeProps {
  mediaType: "movie" | "tv";
  tmdbId: number;
  season?: number;
  episode?: number;
}

export function OMSSAvailabilityBadge({
  mediaType,
  tmdbId,
  season = 1,
  episode = 1,
}: OMSSAvailabilityBadgeProps) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<OmssResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkAvailability() {
      setLoading(true);
      try {
        const url =
          mediaType === "movie"
            ? `/api/omss/movie/${tmdbId}`
            : `/api/omss/tv/${tmdbId}/${season}/${episode}`;
        const res = await fetch(url);
        const data = await res.json();
        if (isMounted) {
          setResult(data);
        }
      } catch {
        if (isMounted) {
          setResult({
            success: false,
            error: {
              code: "BACKEND_OFFLINE",
              message: "OMSS streaming backend is not reachable.",
            },
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAvailability();
    return () => {
      isMounted = false;
    };
  }, [mediaType, tmdbId, season, episode]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
        <Server className="w-4 h-4 animate-spin text-zinc-500" />
        <span>Checking OMSS streaming source availability...</span>
      </div>
    );
  }

  if (!result || !result.success || !result.data) {
    return (
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 font-medium">
          <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            {result?.error?.code === "BACKEND_OFFLINE"
              ? "OMSS Streaming Backend Offline"
              : "No Direct OMSS Sources"}
          </span>
        </div>
        <p className="text-[11px] text-zinc-400">
          {result?.error?.message ||
            "Ensure the OMSS-compatible server is running at the configured endpoint."}
        </p>
      </div>
    );
  }

  const sources = result.data.sources || [];
  const qualities = Array.from(
    new Set(sources.map((s) => s.quality).filter(Boolean))
  );
  const audioTracks = Array.from(
    new Set(sources.flatMap((s) => s.audioTracks || []))
  );

  return (
    <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-white">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Available Streaming Sources ({sources.length})</span>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
          Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-zinc-300">
          <Server className="w-3.5 h-3.5 text-zinc-500" />
          <span>
            Providers:{" "}
            <strong className="text-zinc-200">
              {sources.map((s) => s.provider?.name || s.id).join(", ")}
            </strong>
          </span>
        </div>

        {qualities.length > 0 && (
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="font-semibold text-zinc-400">Qualities:</span>
            <div className="flex gap-1">
              {qualities.map((q) => (
                <span
                  key={q}
                  className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-white font-mono text-[10px]"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}

        {audioTracks.length > 0 && (
          <div className="flex items-center gap-2 text-zinc-300">
            <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
            <span>
              Audio Tracks:{" "}
              <strong className="text-zinc-200">{audioTracks.join(", ")}</strong>
            </span>
          </div>
        )}

        {result.data.subtitles && result.data.subtitles.length > 0 && (
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="font-semibold text-zinc-400">Subtitles:</span>
            <span>{result.data.subtitles.map((s) => s.label).join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

