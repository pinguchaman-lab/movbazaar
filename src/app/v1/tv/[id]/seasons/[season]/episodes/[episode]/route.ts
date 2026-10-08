import { NextRequest, NextResponse } from "next/server";
import { SourceResponse } from "@/types/omss";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string; season: string; episode: string };
  }
) {
  const tmdbId = parseInt(params.id, 10);
  const season = parseInt(params.season, 10);
  const episode = parseInt(params.episode, 10);

  if (isNaN(tmdbId) || isNaN(season) || isNaN(episode)) {
    return NextResponse.json(
      { error: { code: "INVALID_PARAMS", message: "Invalid TV episode parameters" } },
      { status: 400 }
    );
  }

  const response: SourceResponse = {
    id: `tv-${tmdbId}-s${season}-e${episode}`,
    mediaType: "tv",
    tmdbId,
    season,
    episode,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    status: "ready",
    sources: [
      {
        id: `stream-tv-primary-${tmdbId}-${season}-${episode}`,
        url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
        streamable: true,
        type: "hls",
        quality: "1080p",
        audioTracks: ["English", "Hindi", "Original"],
        provider: {
          id: "cinepro-core-1",
          name: "CinePro Core (Primary)",
          latency: 35,
        },
      },
      {
        id: `stream-tv-backup-${tmdbId}-${season}-${episode}`,
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        streamable: true,
        type: "hls",
        quality: "720p",
        audioTracks: ["English", "Hindi"],
        provider: {
          id: "edgestream-2",
          name: "EdgeStream (Backup)",
          latency: 70,
        },
      },
    ],
    subtitles: [
      {
        id: "sub-en",
        url: "/subtitles/en.vtt",
        label: "English",
        language: "en",
        format: "vtt",
        default: true,
      },
      {
        id: "sub-hi",
        url: "/subtitles/hi.vtt",
        label: "Hindi",
        language: "hi",
        format: "vtt",
      },
    ],
  };

  return NextResponse.json(response);
}

