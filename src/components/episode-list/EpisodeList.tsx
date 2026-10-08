"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, ChevronDown } from "lucide-react";
import { TMDBSeasonSummary, TMDBEpisode } from "@/types/tmdb";
import { getTmdbImageUrl } from "@/lib/config";
import { EpisodeSkeleton } from "../skeletons";

interface EpisodeListProps {
  tvId: number;
  seasons: TMDBSeasonSummary[];
  initialEpisodes?: TMDBEpisode[];
}

export function EpisodeList({
  tvId,
  seasons,
  initialEpisodes = [],
}: EpisodeListProps) {
  // Exclude season 0 (Specials) if preferred, or include if it's the only one
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const activeSeasonList = validSeasons.length > 0 ? validSeasons : seasons;

  const [selectedSeason, setSelectedSeason] = useState<number>(
    activeSeasonList[0]?.season_number || 1
  );
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>(initialEpisodes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSeasonEpisodes() {
      if (selectedSeason === 1 && initialEpisodes.length > 0) {
        setEpisodes(initialEpisodes);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/tv/${tvId}/season/${selectedSeason}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.episodes) {
            setEpisodes(data.episodes);
          }
        }
      } catch (err) {
        console.error("Failed to load season episodes:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSeasonEpisodes();
    return () => {
      isMounted = false;
    };
  }, [tvId, selectedSeason, initialEpisodes]);

  return (
    <div className="space-y-6">
      {/* Season Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#e50914] rounded-full inline-block" />
          Episodes
        </h2>

        {/* Dropdown for Season */}
        <div className="relative inline-block w-48">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-[#e50914] cursor-pointer"
          >
            {activeSeasonList.map((season) => (
              <option key={season.id} value={season.season_number}>
                {season.name} ({season.episode_count} eps)
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Episode Cards Grid / List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <EpisodeSkeleton key={i} />
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          No episode details available for this season.
        </div>
      ) : (
        <div className="space-y-3">
          {episodes.map((episode) => {
            const playUrl = `/watch/tv/${tvId}/${episode.season_number}/${episode.episode_number}`;

            return (
              <div
                key={episode.id}
                className="group p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
                  <Image
                    src={getTmdbImageUrl(episode.still_path, "w500")}
                    alt={episode.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Link
                      href={playUrl}
                      className="w-10 h-10 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform"
                      title="Play Episode"
                    >
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#e50914]">
                      EP {episode.episode_number}
                    </span>
                    <Link
                      href={playUrl}
                      className="text-sm font-bold text-white hover:text-[#e50914] transition-colors truncate"
                    >
                      {episode.name}
                    </Link>
                    {episode.runtime ? (
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {episode.runtime}m
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {episode.overview || "No overview available for this episode."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

