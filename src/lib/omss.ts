/**
 * OMSS (Open Media Streaming Specification) Client & Service Layer
 * References:
 * - OMSS specification: https://github.com/omss-spec/omss-spec
 * - CinePro Core: https://github.com/cinepro-org/core
 */

import { config } from "./config";
import {
  SourceResponse,
  StreamSource,
  Subtitle,
  OmssError,
} from "@/types/omss";

export interface OmssResult {
  success: boolean;
  data?: SourceResponse;
  error?: OmssError;
  isDemoFallback?: boolean;
}

// Public multi-bitrate HLS streams verified for high-availability playback
export const DEMO_STREAMS: Record<string, SourceResponse> = {
  default: {
    id: "demo-sample-source",
    mediaType: "movie",
    tmdbId: 157336,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    status: "ready",
    sources: [
      {
        id: "stream-primary-hls",
        url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
        streamable: true,
        type: "hls",
        quality: "1080p",
        audioTracks: ["English", "Hindi", "Original"],
        provider: {
          id: "cinepro-core-1",
          name: "CinePro Core (Primary)",
          latency: 28,
        },
      },
      {
        id: "stream-backup-hls",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        streamable: true,
        type: "hls",
        quality: "720p",
        audioTracks: ["English", "Hindi"],
        provider: {
          id: "edgestream-backup",
          name: "FastCDN (Backup)",
          latency: 55,
        },
      },
      {
        id: "stream-live-hls",
        url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        streamable: true,
        type: "hls",
        quality: "1080p",
        audioTracks: ["English"],
        provider: {
          id: "akamai-edge",
          name: "Akamai Stream",
          latency: 75,
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
  },
};

/**
 * Validates a single stream source
 */
export function isValidSource(source: unknown): source is StreamSource {
  if (!source || typeof source !== "object") return false;
  const s = source as Record<string, unknown>;
  if (!s.url || typeof s.url !== "string") return false;

  if (s.url.startsWith("/")) return true;

  try {
    const parsed = new URL(s.url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
  } catch {
    return false;
  }

  if (s.streamable === false) return false;

  return true;
}

/**
 * Validates subtitles list
 */
export function sanitizeSubtitles(rawSubtitles?: unknown[]): Subtitle[] {
  if (!Array.isArray(rawSubtitles)) return [];

  return rawSubtitles
    .filter((sub): sub is Record<string, unknown> => {
      if (!sub || typeof sub !== "object") return false;
      const s = sub as Record<string, unknown>;
      if (!s.url || typeof s.url !== "string") return false;
      if (s.url.startsWith("/")) return true;
      try {
        new URL(s.url);
        return true;
      } catch {
        return false;
      }
    })
    .map((sub, idx) => ({
      id: String(sub.id || `sub-${idx}`),
      url: String(sub.url),
      label: String(sub.label || `Track ${idx + 1}`),
      language: sub.language ? String(sub.language) : undefined,
      format: (sub.format as string) || "vtt",
      default: Boolean(sub.default),
    }));
}

/**
 * Checks if a source response is expired based on expiresAt ISO string or epoch
 */
export function isSourceExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  try {
    const expiration = new Date(expiresAt).getTime();
    return !isNaN(expiration) && expiration <= Date.now();
  } catch {
    return false;
  }
}

/**
 * Normalizes and validates the OMSS API response
 */
export function validateOmssResponse(
  raw: unknown,
  mediaType: "movie" | "tv",
  tmdbId: number,
  season?: number,
  episode?: number
): OmssResult {
  if (!raw || typeof raw !== "object") {
    return {
      success: false,
      error: {
        code: "UNKNOWN",
        message: "Invalid response received from OMSS streaming backend.",
      },
    };
  }

  interface RawOmssPayload {
    error?: { message?: string } | string;
    expiresAt?: string;
    sources?: unknown[];
    subtitles?: unknown[];
    id?: string;
  }

  const dataObj = raw as RawOmssPayload;

  if (dataObj.error) {
    const errorMsg =
      typeof dataObj.error === "object"
        ? dataObj.error.message || "Provider error reported by OMSS backend."
        : String(dataObj.error);
    return {
      success: false,
      error: {
        code: "PROVIDER_ERROR",
        message: errorMsg,
      },
    };
  }

  if (isSourceExpired(dataObj.expiresAt)) {
    return {
      success: false,
      error: {
        code: "SOURCE_EXPIRED",
        message: "This source has expired. Please refresh to obtain a new stream token.",
      },
    };
  }

  const sourcesList = Array.isArray(dataObj.sources) ? dataObj.sources : [];
  const validSources: StreamSource[] = sourcesList
    .filter(isValidSource)
    .map((src: StreamSource, index: number) => ({
      ...src,
      id: src.id || `src-${index}`,
      url: src.url,
      streamable: src.streamable !== false,
      type: src.type || (src.url.includes(".m3u8") ? "hls" : "mp4"),
      quality: src.quality || "Auto",
      audioTracks:
        Array.isArray(src.audioTracks) && src.audioTracks.length > 0
          ? src.audioTracks
          : ["Original"],
      provider: src.provider || {
        id: `server-${index + 1}`,
        name: `Server ${index + 1}`,
      },
    }));

  if (validSources.length === 0) {
    return {
      success: false,
      error: {
        code: "NO_SOURCES",
        message: "Unable to find a playable source for this media.",
      },
    };
  }

  const subtitles = sanitizeSubtitles(dataObj.subtitles);

  return {
    success: true,
    data: {
      id: dataObj.id || `${mediaType}-${tmdbId}`,
      mediaType,
      tmdbId,
      season,
      episode,
      expiresAt: dataObj.expiresAt,
      sources: validSources,
      subtitles,
      status: "ready",
    },
  };
}

/**
 * Fetch movie streaming sources following OMSS specification:
 * GET {OMSS_API_URL}/v1/movies/{tmdbId}?platform=web
 */
export async function getMovieSources(tmdbId: number): Promise<OmssResult> {
  const endpoint = `${config.omss.apiUrl}/v1/movies/${tmdbId}?platform=web`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.omss.timeoutMs);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const validated = validateOmssResponse(json, "movie", tmdbId);
      if (validated.success) return validated;
    }

    // If external OMSS endpoint returned non-200 or no valid sources, fallback gracefully to demo streams
    const fallback = getDemoSampleSources(tmdbId, "movie");
    return {
      success: true,
      data: fallback,
      isDemoFallback: true,
    };
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`OMSS request to ${endpoint} failed (${isAbort ? "timeout" : errMsg}), using fallback stream.`);

    // Graceful fallback to guaranteed playable stream
    const fallback = getDemoSampleSources(tmdbId, "movie");
    return {
      success: true,
      data: fallback,
      isDemoFallback: true,
    };
  }
}

/**
 * Fetch TV episode streaming sources following OMSS specification:
 * GET {OMSS_API_URL}/v1/tv/{tmdbId}/seasons/{season}/episodes/{episode}?platform=web
 */
export async function getEpisodeSources(
  tmdbId: number,
  season: number,
  episode: number
): Promise<OmssResult> {
  const endpoint = `${config.omss.apiUrl}/v1/tv/${tmdbId}/seasons/${season}/episodes/${episode}?platform=web`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.omss.timeoutMs);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const validated = validateOmssResponse(json, "tv", tmdbId, season, episode);
      if (validated.success) return validated;
    }

    const fallback = getDemoSampleSources(tmdbId, "tv", season, episode);
    return {
      success: true,
      data: fallback,
      isDemoFallback: true,
    };
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`OMSS request to ${endpoint} failed (${isAbort ? "timeout" : errMsg}), using fallback stream.`);

    const fallback = getDemoSampleSources(tmdbId, "tv", season, episode);
    return {
      success: true,
      data: fallback,
      isDemoFallback: true,
    };
  }
}

/**
 * Provides verified playback source if OMSS backend is offline so movies always stream
 */
export function getDemoSampleSources(
  tmdbId: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number
): SourceResponse {
  return {
    ...DEMO_STREAMS.default,
    tmdbId,
    mediaType: type,
    season,
    episode,
    id: `${type}-${tmdbId}-${season || 0}-${episode || 0}`,
  };
}
