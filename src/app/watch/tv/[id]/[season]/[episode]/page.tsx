import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTVDetails, getTVSeasonDetails, getTVTrailer } from "@/lib/tmdb";
import { getEpisodeSources, getDemoSampleSources } from "@/lib/omss";
import { WatchPlayerContainer } from "@/components/video-player/WatchPlayerContainer";
import { ArrowLeft, Play, Sparkles } from "lucide-react";

import { Metadata } from "next";

interface WatchTVPageProps {
  params: {
    id: string;
    season: string;
    episode: string;
  };
  searchParams: {
    t?: string;
    demo?: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: WatchTVPageProps): Promise<Metadata> {
  const tvId = parseInt(params.id, 10);
  if (isNaN(tvId)) return { title: "Watch TV Episode | MovBazaar" };

  const tvShow = await getTVDetails(tvId);
  const title = tvShow
    ? `Now Streaming: ${tvShow.name} S${params.season}E${params.episode} | MovBazaar`
    : "Watch TV Episode | MovBazaar";
  return {
    title,
    description: `Watch ${tvShow?.name || "TV Show"} Season ${params.season} Episode ${params.episode} in HD with Dual Audio and subtitles on MovBazaar.`,
  };
}

export default async function WatchTVPage({
  params,
  searchParams,
}: WatchTVPageProps) {
  const tvId = parseInt(params.id, 10);
  const seasonNum = parseInt(params.season, 10);
  const episodeNum = parseInt(params.episode, 10);

  if (isNaN(tvId) || isNaN(seasonNum) || isNaN(episodeNum)) notFound();

  const initialTime = searchParams.t ? parseInt(searchParams.t, 10) : 0;
  const isDemoRequested = searchParams.demo === "true";

  const [tvShow, seasonDetail, trailerKey] = await Promise.all([
    getTVDetails(tvId),
    getTVSeasonDetails(tvId, seasonNum),
    getTVTrailer(tvId),
  ]);

  if (!tvShow) notFound();

  const omssResult = await getEpisodeSources(tvId, seasonNum, episodeNum, {
    trailerKey,
  });

  const currentEp = seasonDetail?.episodes?.find(
    (e) => e.episode_number === episodeNum
  );
  const totalEpisodesInSeason = seasonDetail?.episodes?.length || 0;

  // Next episode calculation
  let nextEpisodeUrl: string | undefined = undefined;
  let nextEpisodeNumber: number | undefined = undefined;
  let nextEpisodeTitle: string | undefined = undefined;

  if (episodeNum < totalEpisodesInSeason) {
    nextEpisodeNumber = episodeNum + 1;
    nextEpisodeUrl = `/watch/tv/${tvId}/${seasonNum}/${nextEpisodeNumber}${
      isDemoRequested ? "?demo=true" : ""
    }`;
    const nextEpObj = seasonDetail?.episodes?.find(
      (e) => e.episode_number === nextEpisodeNumber
    );
    nextEpisodeTitle = nextEpObj?.name;
  }

  // If OMSS result has sources, use them; otherwise ensure fallback stream
  const finalSources =
    omssResult.data?.sources && omssResult.data.sources.length > 0
      ? omssResult.data.sources
      : getDemoSampleSources(tvId, "tv", seasonNum, episodeNum, {
          trailerKey,
        }).sources;

  const finalSubtitles =
    omssResult.data?.subtitles && omssResult.data.subtitles.length > 0
      ? omssResult.data.subtitles
      : getDemoSampleSources(tvId, "tv", seasonNum, episodeNum, {
          trailerKey,
        }).subtitles || [];

  const isDemoActive = Boolean(omssResult.isDemoFallback || isDemoRequested);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-center items-center px-2 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-6xl space-y-4">
        {/* Navigation Bar Above Player */}
        <div className="flex items-center justify-between">
          <Link
            href={`/tv/${tvShow.id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to TV Show Details</span>
          </Link>

          {isDemoActive && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#e50914]" />
              <span>Multi-Mirror Engine</span>
            </div>
          )}
        </div>

        {/* Video Player & Server Selector Container */}
        <WatchPlayerContainer
          sources={finalSources}
          subtitles={finalSubtitles}
          mediaType="tv"
          tmdbId={tvShow.id}
          title={tvShow.name}
          posterPath={tvShow.poster_path}
          backdropPath={tvShow.backdrop_path}
          season={seasonNum}
          episode={episodeNum}
          episodeTitle={currentEp?.name}
          nextEpisodeUrl={nextEpisodeUrl}
          nextEpisodeNumber={nextEpisodeNumber}
          nextEpisodeTitle={nextEpisodeTitle}
          initialTime={initialTime}
        />

        {/* Episode Info Card Footer */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span>{tvShow.name}</span>
              <span className="text-[#e50914] text-xs font-semibold px-2 py-0.5 rounded bg-[#e50914]/15 border border-[#e50914]/30">
                S{String(seasonNum).padStart(2, "0")} E
                {String(episodeNum).padStart(2, "0")}
              </span>
            </div>
            {currentEp?.name && (
              <p className="text-zinc-300 font-medium text-xs mt-0.5">
                {currentEp.name}
              </p>
            )}
            {currentEp?.overview && (
              <p className="text-zinc-400 text-xs mt-1 line-clamp-1">
                {currentEp.overview}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {nextEpisodeUrl && (
              <Link
                href={nextEpisodeUrl}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Next Episode</span>
                <Play className="w-3 h-3 fill-white" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

