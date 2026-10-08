"use client";

import React, { useState } from "react";
import { StreamSource, Subtitle as OmssSubtitle } from "@/types/omss";
import { VideoPlayer } from "./VideoPlayer";
import { ServerSelectorBar } from "./ServerSelectorBar";
import { AdBanner } from "@/components/ads/AdBanner";

interface WatchPlayerContainerProps {
  sources: StreamSource[];
  subtitles?: OmssSubtitle[];
  mediaType: "movie" | "tv";
  tmdbId: number;
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  nextEpisodeUrl?: string;
  nextEpisodeNumber?: number;
  nextEpisodeTitle?: string;
  initialTime?: number;
  isUpcoming?: boolean;
  originalLanguage?: string;
}

export function WatchPlayerContainer({
  sources,
  subtitles = [],
  mediaType,
  tmdbId,
  title,
  posterPath,
  backdropPath,
  season,
  episode,
  episodeTitle,
  nextEpisodeUrl,
  nextEpisodeNumber,
  nextEpisodeTitle,
  initialTime = 0,
  isUpcoming = false,
  originalLanguage,
}: WatchPlayerContainerProps) {
  const [activeSourceId, setActiveSourceId] = useState<string>(
    sources[0]?.id || ""
  );

  return (
    <div className="w-full space-y-4">
      {/* Video Player Frame */}
      <VideoPlayer
        sources={sources}
        subtitles={subtitles}
        mediaType={mediaType}
        tmdbId={tmdbId}
        title={title}
        posterPath={posterPath}
        backdropPath={backdropPath}
        season={season}
        episode={episode}
        episodeTitle={episodeTitle}
        nextEpisodeUrl={nextEpisodeUrl}
        nextEpisodeNumber={nextEpisodeNumber}
        nextEpisodeTitle={nextEpisodeTitle}
        initialTime={initialTime}
        activeSourceId={activeSourceId}
        onSourceChange={(s) => setActiveSourceId(s.id)}
        originalLanguage={originalLanguage}
      />

      {/* Dedicated Server Switcher Bar directly below player */}
      <ServerSelectorBar
        sources={sources}
        activeSourceId={activeSourceId}
        onSelectSource={(s) => setActiveSourceId(s.id)}
        isUpcoming={isUpcoming}
        originalLanguage={originalLanguage}
      />

      {/* Ad Banner Slot (Disappears 100% for Logged-In VIP Users) */}
      <AdBanner slot="player-bottom" />
    </div>
  );
}
