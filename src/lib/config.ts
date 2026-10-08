/**
 * Centralized Application Configuration
 *
 * All external service endpoints and keys are defined here.
 * The OMSS backend URL is strictly configurable via NEXT_PUBLIC_OMSS_API_URL.
 */

export const config = {
  tmdb: {
    apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || "",
    baseUrl: "https://api.themoviedb.org/3",
    imageBaseUrl:
      process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p",
  },
  omss: {
    apiUrl: process.env.NEXT_PUBLIC_OMSS_API_URL || "http://localhost:3000",
    timeoutMs: 15000,
  },
  app: {
    name: "MovBazaar",
    description: "Personal Movie & TV Streaming Hub",
  },
};

/**
 * Generates full TMDB image URL with fallback to placeholder if path is absent.
 */
export function getTmdbImageUrl(
  path?: string | null,
  size: "w300" | "w500" | "w780" | "w1280" | "original" = "w500"
): string {
  if (!path) {
    return "/placeholder-poster.svg";
  }
  if (path.startsWith("http")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${config.tmdb.imageBaseUrl}/${size}${cleanPath}`;
}
