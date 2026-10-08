import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star, Layers } from "lucide-react";
import { getTVDetails, getTVCredits, getTVSeasonDetails } from "@/lib/tmdb";
import { getTmdbImageUrl } from "@/lib/config";
import { EpisodeList } from "@/components/episode-list/EpisodeList";
import { OMSSAvailabilityBadge } from "@/components/omss-badge/OMSSAvailabilityBadge";
import { WatchlistButton } from "@/components/details/WatchlistButton";

import { Metadata } from "next";

interface TVPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 3600;

export async function generateMetadata({ params }: TVPageProps): Promise<Metadata> {
  const tvId = parseInt(params.id, 10);
  if (isNaN(tvId)) return { title: "TV Show Not Found | MovBazaar" };

  const tvShow = await getTVDetails(tvId);
  if (!tvShow) return { title: "TV Show Not Found | MovBazaar" };

  const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : "";
  const title = `Watch ${tvShow.name} ${year ? `(${year})` : ""} All Seasons & Episodes Free in HD`;
  const description = `Stream all seasons and episodes of ${tvShow.name} in Ultra HD 1080p with Dual Audio tracks, subtitles, and fast servers on MovBazaar. ${tvShow.overview ? tvShow.overview.slice(0, 140) + "..." : ""}`;
  const posterUrl = getTmdbImageUrl(tvShow.poster_path, "w500");
  const backdropUrl = getTmdbImageUrl(tvShow.backdrop_path, "original");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: backdropUrl || posterUrl || "/og-image.png",
          width: 1200,
          height: 630,
          alt: tvShow.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [backdropUrl || posterUrl || "/og-image.png"],
    },
  };
}

export default async function TVDetailsPage({ params }: TVPageProps) {
  const tvId = parseInt(params.id, 10);
  if (isNaN(tvId)) notFound();

  const [tvShow, credits, season1Details] = await Promise.all([
    getTVDetails(tvId),
    getTVCredits(tvId),
    getTVSeasonDetails(tvId, 1),
  ]);

  if (!tvShow) notFound();

  const topCast = credits?.cast?.slice(0, 8) || [];
  const year = tvShow.first_air_date
    ? new Date(tvShow.first_air_date).getFullYear()
    : "";

  const tvJsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: tvShow.name,
    description: tvShow.overview,
    image: getTmdbImageUrl(tvShow.poster_path, "w500"),
    startDate: tvShow.first_air_date,
    numberOfSeasons: tvShow.number_of_seasons || 1,
    numberOfEpisodes: tvShow.number_of_episodes || 10,
    aggregateRating: tvShow.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: tvShow.vote_average.toFixed(1),
          bestRating: "10",
          ratingCount: tvShow.vote_count || 100,
        }
      : undefined,
  };

  return (
    <div className="min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd) }}
      />
      {/* Backdrop Banner */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] max-h-[500px] overflow-hidden bg-zinc-950">
        <Image
          src={getTmdbImageUrl(tvShow.backdrop_path, "original")}
          alt={tvShow.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-[#09090b]" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-48 relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="w-48 sm:w-60 md:w-64 aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-zinc-800 flex-shrink-0 bg-zinc-900 mx-auto md:mx-0">
            <Image
              src={getTmdbImageUrl(tvShow.poster_path, "w500")}
              alt={tvShow.name}
              fill
              sizes="(max-width: 640px) 192px, 256px"
              className="object-cover"
              priority
            />
          </div>

          {/* Metadata & Actions */}
          <div className="flex-1 space-y-4 text-left">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-zinc-400 mb-2">
                <span className="uppercase px-2 py-0.5 rounded bg-[#e50914] text-white text-[11px] font-bold">
                  TV Series
                </span>
                {year && <span>{year}</span>}
                {tvShow.number_of_seasons ? (
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-zinc-500" />
                    {tvShow.number_of_seasons} Season
                    {tvShow.number_of_seasons > 1 ? "s" : ""}
                  </span>
                ) : null}
                {tvShow.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-cinema-gold">
                    <Star className="w-3.5 h-3.5 fill-cinema-gold" />
                    <strong>{tvShow.vote_average.toFixed(1)}</strong>
                    <span className="text-zinc-500">
                      ({tvShow.vote_count.toLocaleString()} votes)
                    </span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {tvShow.name}
              </h1>

              {tvShow.original_name && tvShow.original_name !== tvShow.name && (
                <p className="text-xs text-zinc-500 italic mt-0.5">
                  Original title: {tvShow.original_name}
                </p>
              )}

              {tvShow.tagline && (
                <p className="text-sm italic text-zinc-300 font-medium mt-2">
                  &ldquo;{tvShow.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Genres */}
            {tvShow.genres && tvShow.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tvShow.genres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/tv?genre=${g.id}`}
                    className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href={`/watch/tv/${tvShow.id}/1/1`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white font-bold text-sm shadow-xl shadow-red-950/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Play S1 E1</span>
              </Link>

              <WatchlistButton
                item={{
                  tmdbId: tvShow.id,
                  type: "tv",
                  title: tvShow.name,
                  posterPath: tvShow.poster_path,
                  backdropPath: tvShow.backdrop_path,
                  voteAverage: tvShow.vote_average,
                  releaseYear: year ? String(year) : undefined,
                }}
              />
            </div>

            {/* OMSS Availability Checker for TV Pilot */}
            <div className="pt-2 max-w-xl">
              <OMSSAvailabilityBadge mediaType="tv" tmdbId={tvShow.id} season={1} episode={1} />
            </div>

            {/* Overview */}
            <div className="pt-2 space-y-2">
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                Overview
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {tvShow.overview || "No overview available for this series."}
              </p>
            </div>
          </div>
        </div>

        {/* Season & Episode Selector */}
        {tvShow.seasons && tvShow.seasons.length > 0 && (
          <div className="pt-6 border-t border-zinc-800/80">
            <EpisodeList
              tvId={tvShow.id}
              seasons={tvShow.seasons}
              initialEpisodes={season1Details?.episodes || []}
            />
          </div>
        )}

        {/* Top Cast Section */}
        {topCast.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-zinc-800/80">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#e50914] rounded-full inline-block" />
              Series Cast
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {topCast.map((actor) => (
                <div
                  key={actor.id}
                  className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 p-2 text-center space-y-1.5"
                >
                  <div className="aspect-square relative w-full rounded-lg overflow-hidden bg-zinc-950">
                    <Image
                      src={getTmdbImageUrl(actor.profile_path, "w300")}
                      alt={actor.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 truncate">
                    {actor.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {actor.character || "Cast"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

