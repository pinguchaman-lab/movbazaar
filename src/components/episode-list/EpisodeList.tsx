"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, ChevronDown, CheckCircle2, Film } from "lucide-react";
import { TMDBSeasonSummary, TMDBEpisode } from "@/types/tmdb";
import { getTmdbImageUrl } from "@/lib/config";
import { EpisodeSkeleton } from "../skeletons";

interface EpisodeListProps {
  tvId: number;
  seasons: TMDBSeasonSummary[];
  initialEpisodes?: TMDBEpisode[];
  currentSeason?: number;
  currentEpisode?: number;
}

export function EpisodeList({
  tvId,
  seasons,
  initialEpisodes = [],
  currentSeason,
  currentEpisode,
}: EpisodeListProps) {
  // Exclude season 0 (Specials) unless it is the only one available
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const activeSeasonList = validSeasons.length > 0 ? validSeasons : seasons;

  const defaultSeason = currentSeason || activeSeasonList[0]?.season_number || 1;
  const [selectedSeason, setSelectedSeason] = useState<number>(defaultSeason);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>(
    selectedSeason === defaultSeason && initialEpisodes.length > 0
      ? initialEpisodes
      : []
  );
  const [loading, setLoading] = useState(false);

  // Sync selectedSeason if currentSeason prop changes
  useEffect(() => {
    if (currentSeason && currentSeason !== selectedSeason) {
      setSelectedSeason(currentSeason);
    }
  }, [currentSeason, selectedSeason]);

  // Load episodes when selectedSeason changes
  useEffect(() => {
    let isMounted = true;
    async function loadSeasonEpisodes() {
      if (selectedSeason === defaultSeason && initialEpisodes.length > 0) {
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
  }, [tvId, selectedSeason, defaultSeason, initialEpisodes]);

  return (
    <div className="space-y-5 bg-zinc-950/70 border border-zinc-850 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Season Selector Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#e50914] rounded-full inline-block" />
            <span>Select Season &amp; Episodes</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Choose any season from the dropdown to watch all episodes directly
          </p>
        </div>

        {/* Dropdown for Season Selection */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-zinc-400 whitespace-nowrap hidden sm:inline">
            Season:
          </label>
          <div className="relative inline-block w-full sm:w-60">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="w-full appearance-none bg-zinc-900 border border-zinc-700/80 text-white text-xs font-bold rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] cursor-pointer shadow-md"
            >
              {activeSeasonList.map((season) => (
                <option key={season.id} value={season.season_number}>
                  {season.name} ({season.episode_count} Episodes)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick Episode Jump Pills (Especially convenient for Anime with 20+ eps) */}
      {!loading && episodes.length > 12 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3 h-3 text-[#e50914]" />
            <span>Quick Episode Jump (Season {selectedSeason})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            {episodes.map((ep) => {
              const isCurrent =
                selectedSeason === currentSeason &&
                ep.episode_number === currentEpisode;
              const epUrl = `/watch/tv/${tvId}/${selectedSeason}/${ep.episode_number}`;

              return (
                <Link
                  key={`pill-${ep.id}`}
                  href={epUrl}
                  prefetch={true}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    isCurrent
                      ? "bg-[#e50914] text-white shadow-md shadow-red-950/60 ring-1 ring-red-400"
                      : "bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800"
                  }`}
                  title={`Episode ${ep.episode_number}: ${ep.name}`}
                >
                  {ep.episode_number}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Episode Cards Grid / List */}
      {loading ? (
        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <EpisodeSkeleton key={i} />
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          No episode details available for Season {selectedSeason}.
        </div>
      ) : (
        <div className="space-y-2.5 pt-2 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
          {episodes.map((episode) => {
            const isCurrent =
              selectedSeason === currentSeason &&
              episode.episode_number === currentEpisode;
            const playUrl = `/watch/tv/${tvId}/${selectedSeason}/${episode.episode_number}`;

            return (
              <div
                key={episode.id}
                className={`group p-3 sm:p-3.5 rounded-xl transition-all flex flex-col sm:flex-row gap-3.5 items-start sm:items-center border ${
                  isCurrent
                    ? "bg-[#e50914]/10 border-[#e50914] shadow-lg shadow-red-950/40 ring-1 ring-[#e50914]/50"
                    : "bg-zinc-900/50 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
                  <Image
                    src={getTmdbImageUrl(episode.still_path, "w500")}
                    alt={episode.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Link
                      href={playUrl}
                      prefetch={true}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95 ${
                        isCurrent
                          ? "bg-[#e50914] text-white ring-2 ring-white"
                          : "bg-black/80 hover:bg-[#e50914] text-white"
                      }`}
                      title={isCurrent ? "Currently Playing" : "Play Episode"}
                    >
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#e50914]">
                      EP {episode.episode_number}
                    </span>

                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e50914] text-white">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Now Playing</span>
                      </span>
                    )}

                    <Link
                      href={playUrl}
                      prefetch={true}
                      className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                        isCurrent
                          ? "text-white"
                          : "text-zinc-200 hover:text-[#e50914]"
                      }`}
                    >
                      {episode.name}
                    </Link>

                    {episode.runtime ? (
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {episode.runtime}m
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {episode.overview ||
                      `Episode ${episode.episode_number} of ${seasons.find((s) => s.season_number === selectedSeason)?.name || `Season ${selectedSeason}`}.`}
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
