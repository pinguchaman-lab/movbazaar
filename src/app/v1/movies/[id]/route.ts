import { NextRequest, NextResponse } from "next/server";
import { SourceResponse } from "@/types/omss";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tmdbId = parseInt(params.id, 10);
  if (isNaN(tmdbId)) {
    return NextResponse.json(
      { error: { code: "INVALID_ID", message: "Invalid TMDB ID" } },
      { status: 400 }
    );
  }

  const response: SourceResponse = {
    id: `movie-${tmdbId}`,
    mediaType: "movie",
    tmdbId,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    status: "ready",
    sources: [
      {
        id: `stream-primary-${tmdbId}`,
        url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
        streamable: true,
        type: "hls",
        quality: "1080p",
        audioTracks: ["English", "Hindi", "Original"],
        provider: {
          id: "cinepro-core-1",
          name: "CinePro Core (FastCDN)",
          latency: 28,
        },
      },
      {
        id: `stream-backup-${tmdbId}`,
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        streamable: true,
        type: "hls",
        quality: "720p",
        audioTracks: ["English", "Hindi"],
        provider: {
          id: "edgestream-2",
          name: "EdgeStream (Backup)",
          latency: 64,
        },
      },
      {
        id: `stream-live-${tmdbId}`,
        url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        streamable: true,
        type: "hls",
        quality: "1080p",
        audioTracks: ["English"],
        provider: {
          id: "akamai-edge-3",
          name: "Akamai Global",
          latency: 82,
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

