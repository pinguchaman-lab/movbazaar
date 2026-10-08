import React from "react";
import { notFound } from "next/navigation";
import { getMovieDetails, getMovieTrailer } from "@/lib/tmdb";
import { getMovieSources, getDemoSampleSources } from "@/lib/omss";
import { WatchPlayerContainer } from "@/components/video-player/WatchPlayerContainer";
import { Sparkles, Calendar } from "lucide-react";

import { Metadata } from "next";

interface WatchMoviePageProps {
  params: {
    id: string;
  };
  searchParams: {
    t?: string;
    demo?: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: WatchMoviePageProps): Promise<Metadata> {
  const movieId = parseInt(params.id, 10);
  if (isNaN(movieId)) return { title: "Watch Movie | MovBazaar" };

  const movie = await getMovieDetails(movieId);
  const title = movie ? `Now Streaming: ${movie.title} in 1080p | MovBazaar` : "Watch Movie | MovBazaar";
  return {
    title,
    description: `Watch ${movie?.title || "Movie"} full streaming with Dual Audio and subtitles on MovBazaar.`,
  };
}

export default async function WatchMoviePage({
  params,
  searchParams,
}: WatchMoviePageProps) {
  const movieId = parseInt(params.id, 10);
  if (isNaN(movieId)) notFound();

  const initialTime = searchParams.t ? parseInt(searchParams.t, 10) : 0;
  const isDemoRequested = searchParams.demo === "true";

  const [movie, trailerKey] = await Promise.all([
    getMovieDetails(movieId),
    getMovieTrailer(movieId),
  ]);

  if (!movie) notFound();

  const isUpcoming = Boolean(
    movie.release_date && new Date(movie.release_date).getTime() > Date.now()
  );

  const omssResult = await getMovieSources(movieId, {
    trailerKey,
    isUpcoming,
  });

  // If OMSS result has sources, use them; otherwise ensure fallback stream
  const finalSources =
    omssResult.data?.sources && omssResult.data.sources.length > 0
      ? omssResult.data.sources
      : getDemoSampleSources(movieId, "movie", undefined, undefined, {
          trailerKey,
          isUpcoming,
        }).sources;

  const finalSubtitles =
    omssResult.data?.subtitles && omssResult.data.subtitles.length > 0
      ? omssResult.data.subtitles
      : getDemoSampleSources(movieId, "movie", undefined, undefined, {
          trailerKey,
          isUpcoming,
        }).subtitles || [];

  const isDemoActive = Boolean(omssResult.isDemoFallback || isDemoRequested);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-center items-center px-2 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-6xl space-y-4">
        {/* Status Badges Above Player (if any) */}
        {(isUpcoming || isDemoActive) && (
          <div className="flex items-center justify-end gap-2">
            {isUpcoming && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Pre-Release Title</span>
              </div>
            )}
            {isDemoActive && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#e50914]" />
                <span>Multi-Mirror Engine</span>
              </div>
            )}
          </div>
        )}

        {/* Video Player & Server Selector Container */}
        <WatchPlayerContainer
          sources={finalSources}
          subtitles={finalSubtitles}
          mediaType="movie"
          tmdbId={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          backdropPath={movie.backdrop_path}
          initialTime={initialTime}
          isUpcoming={isUpcoming}
        />

        {/* Title metadata footer */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
          <div>
            <h1 className="text-base font-bold text-white">{movie.title}</h1>
            <p className="text-zinc-400 mt-0.5 line-clamp-1">{movie.overview}</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 flex-shrink-0">
            <span>TMDB: {movie.id}</span>
            <span>•</span>
            <span>Runtime: {movie.runtime ? `${movie.runtime}m` : "N/A"}</span>
            {movie.release_date && (
              <>
                <span>•</span>
                <span>Release: {movie.release_date}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

