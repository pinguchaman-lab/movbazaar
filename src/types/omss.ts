/**
 * OMSS (Open Media Streaming Specification) Type Definitions
 * References: https://github.com/omss-spec/omss-spec & CinePro Core
 */

export type StreamType = "hls" | "mp4" | "dash" | "m3u8" | "webm" | string;

export type VideoQuality =
  | "4K"
  | "FHD"
  | "1080p"
  | "HD"
  | "720p"
  | "480p"
  | "360p"
  | "Auto"
  | string;

export interface StreamProvider {
  id: string;
  name: string;
  icon?: string;
  latency?: number;
}

export interface StreamSource {
  id: string;
  url: string;
  streamable: boolean;
  type: StreamType;
  quality?: VideoQuality;
  audioTracks?: string[]; // e.g. ["English", "Hindi", "Original"]
  subtitles?: Subtitle[];
  provider?: StreamProvider;
  headers?: Record<string, string>;
  format?: string;
  codec?: string;
  sizeBytes?: number;
  bitrate?: number;
}

export interface Subtitle {
  id: string;
  url: string;
  label: string; // e.g. "English", "Hindi", "Spanish"
  language?: string; // ISO 639-1 code e.g. "en", "hi"
  format: "vtt" | "srt" | string;
  default?: boolean;
}

export interface SourceResponse {
  id: string; // e.g. "movie-603" or "tv-1399-s1-e1"
  mediaType: "movie" | "tv";
  tmdbId: number;
  season?: number;
  episode?: number;
  expiresAt?: string; // ISO timestamp or epoch
  sources: StreamSource[];
  subtitles?: Subtitle[];
  error?: string;
  status?: "ready" | "fetching" | "error";
}

export interface OmssError {
  code:
  | "BACKEND_OFFLINE"
  | "NO_SOURCES"
  | "SOURCE_EXPIRED"
  | "PROVIDER_ERROR"
  | "INVALID_URL"
  | "TIMEOUT"
  | "UNKNOWN";
  message: string;
  details?: string;
}
