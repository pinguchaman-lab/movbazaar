import { config } from "./config";
import {
  TMDBMovie,
  TMDBTVShow,
  TMDBSeasonDetail,
  TMDBCredits,
  TMDBGenre,
  TMDBPaginatedResponse,
  MediaItem,
  TMDBVideo,
} from "@/types/tmdb";
import {
  FALLBACK_MOVIES,
  FALLBACK_TV_SHOWS,
  FALLBACK_EPISODES,
  FALLBACK_CREDITS,
  FALLBACK_GENRES,
} from "./tmdb-fallback";

const BASE_URL = config.tmdb.baseUrl;
const API_KEY = config.tmdb.apiKey;

const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
  revalidate = 3600
): Promise<T | null> {
  if (!API_KEY) {
    return null;
  }

  const cacheKey = `${endpoint}?${JSON.stringify(params)}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data as T;
  }

  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("language", "en-US");

    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate },
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`TMDB request to ${endpoint} returned status ${res.status}`);
      return null;
    }

    const json = (await res.json()) as T;
    memoryCache.set(cacheKey, {
      data: json,
      expiresAt: Date.now() + revalidate * 1000,
    });
    return json;
  } catch (err) {
    console.warn(`TMDB network request failed for ${endpoint}:`, err);
    return null;
  }
}

export async function getTrendingAll(
  timeWindow: "day" | "week" = "day"
): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBPaginatedResponse<MediaItem>>(
    `/trending/all/${timeWindow}`
  );
  if (data?.results && data.results.length > 0) {
    return data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
  }

  // Fallback
  const moviesWithMedia: MediaItem[] = FALLBACK_MOVIES.slice(0, 4).map((m) => ({
    ...m,
    media_type: "movie",
  }));
  const tvWithMedia: MediaItem[] = FALLBACK_TV_SHOWS.slice(0, 4).map((t) => ({
    ...t,
    media_type: "tv",
  }));
  return [...moviesWithMedia, ...tvWithMedia];
}

export async function getPopularMovies(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
    "/movie/popular",
    { page }
  );
  if (data?.results && data.results.length > 0) return data;

  return {
    page,
    results: FALLBACK_MOVIES,
    total_pages: 1,
    total_results: FALLBACK_MOVIES.length,
  };
}

export async function getTopRatedMovies(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
    "/movie/top_rated",
    { page }
  );
  if (data?.results && data.results.length > 0) return data;

  const sorted = [...FALLBACK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
  return {
    page,
    results: sorted,
    total_pages: 1,
    total_results: sorted.length,
  };
}

export async function getPopularTV(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>(
    "/tv/popular",
    { page }
  );
  if (data?.results && data.results.length > 0) return data;

  return {
    page,
    results: FALLBACK_TV_SHOWS,
    total_pages: 1,
    total_results: FALLBACK_TV_SHOWS.length,
  };
}

export async function getTopRatedTV(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>(
    "/tv/top_rated",
    { page }
  );
  if (data?.results && data.results.length > 0) return data;

  const sorted = [...FALLBACK_TV_SHOWS].sort((a, b) => b.vote_average - a.vote_average);
  return {
    page,
    results: sorted,
    total_pages: 1,
    total_results: sorted.length,
  };
}

export async function getMovieGenres(): Promise<TMDBGenre[]> {
  const data = await tmdbFetch<{ genres: TMDBGenre[] }>("/genre/movie/list");
  if (data?.genres && data.genres.length > 0) return data.genres;
  return FALLBACK_GENRES.movie;
}

export async function getTVGenres(): Promise<TMDBGenre[]> {
  const data = await tmdbFetch<{ genres: TMDBGenre[] }>("/genre/tv/list");
  if (data?.genres && data.genres.length > 0) return data.genres;
  return FALLBACK_GENRES.tv;
}

export interface DiscoverOptions {
  genreId?: number;
  sortBy?: string;
  page?: number;
  category?: string;
  language?: string;
  year?: number | string;
}

export async function discoverMovies({
  genreId,
  sortBy = "popularity.desc",
  page = 1,
  category,
  language,
  year,
}: DiscoverOptions): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const params: Record<string, string | number> = {
    sort_by: sortBy,
    page,
  };
  if (genreId) {
    params.with_genres = genreId;
  }

  if (category === "korean" || language === "ko") {
    params.with_original_language = "ko";
  } else if (
    category === "indian" ||
    language === "hi" ||
    (language && ["te", "ta", "ml", "kn", "bn"].includes(language))
  ) {
    params.with_original_language = language || "hi|te|ta|ml|kn";
  } else if (category === "hollywood" || language === "en") {
    params.with_original_language = "en";
  } else if (language) {
    params.with_original_language = language;
  }

  if (year) {
    const yrStr = String(year);
    if (yrStr === "2010s") {
      params["primary_release_date.gte"] = "2010-01-01";
      params["primary_release_date.lte"] = "2019-12-31";
    } else if (yrStr === "2000s") {
      params["primary_release_date.gte"] = "2000-01-01";
      params["primary_release_date.lte"] = "2009-12-31";
    } else if (yrStr === "classics") {
      params["primary_release_date.lte"] = "1999-12-31";
    } else {
      params.primary_release_year = yrStr;
    }
  }

  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>(
    "/discover/movie",
    params
  );
  if (data?.results && data.results.length > 0) return data;

  let results = [...FALLBACK_MOVIES];

  if (category === "korean" || language === "ko") {
    const filtered = results.filter((m) => m.original_language === "ko");
    if (filtered.length > 0) results = filtered;
  } else if (
    category === "indian" ||
    language === "hi" ||
    (language && ["te", "ta", "ml", "kn", "bn"].includes(language))
  ) {
    const filtered = results.filter((m) =>
      ["hi", "te", "ta", "ml", "kn", "bn"].includes(m.original_language || "")
    );
    if (filtered.length > 0) results = filtered;
  } else if (category === "hollywood" || language === "en") {
    const filtered = results.filter(
      (m) => m.original_language === "en" || !m.original_language
    );
    if (filtered.length > 0) results = filtered;
  }

  if (year) {
    const yrStr = String(year);
    if (yrStr === "2010s") {
      const filtered = results.filter(
        (m) => m.release_date >= "2010-01-01" && m.release_date <= "2019-12-31"
      );
      if (filtered.length > 0) results = filtered;
    } else if (yrStr === "2000s") {
      const filtered = results.filter(
        (m) => m.release_date >= "2000-01-01" && m.release_date <= "2009-12-31"
      );
      if (filtered.length > 0) results = filtered;
    } else if (yrStr === "classics") {
      const filtered = results.filter((m) => m.release_date < "2000-01-01");
      if (filtered.length > 0) results = filtered;
    } else {
      const filtered = results.filter((m) => m.release_date?.startsWith(yrStr));
      if (filtered.length > 0) results = filtered;
    }
  }

  if (genreId) {
    const filtered = results.filter((m) => m.genre_ids?.includes(genreId));
    if (filtered.length > 0) results = filtered;
  }

  if (sortBy.includes("vote_average")) {
    results.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy.includes("primary_release_date")) {
    results.sort(
      (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );
  } else {
    results.sort((a, b) => b.popularity - a.popularity);
  }

  return {
    page,
    results,
    total_pages: 1,
    total_results: results.length,
  };
}

export async function discoverTV({
  genreId,
  sortBy = "popularity.desc",
  page = 1,
  category,
  language,
  year,
}: DiscoverOptions): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  const params: Record<string, string | number> = {
    sort_by: sortBy,
    page,
  };
  if (genreId) {
    params.with_genres = genreId;
  }

  if (category === "korean" || language === "ko") {
    params.with_original_language = "ko";
  } else if (
    category === "indian" ||
    language === "hi" ||
    (language && ["te", "ta", "ml", "kn", "bn"].includes(language))
  ) {
    params.with_original_language = language || "hi|te|ta|ml|kn";
  } else if (category === "hollywood" || language === "en") {
    params.with_original_language = "en";
  } else if (language) {
    params.with_original_language = language;
  }

  if (year) {
    const yrStr = String(year);
    if (yrStr === "2010s") {
      params["first_air_date.gte"] = "2010-01-01";
      params["first_air_date.lte"] = "2019-12-31";
    } else if (yrStr === "2000s") {
      params["first_air_date.gte"] = "2000-01-01";
      params["first_air_date.lte"] = "2009-12-31";
    } else if (yrStr === "classics") {
      params["first_air_date.lte"] = "1999-12-31";
    } else {
      params.first_air_date_year = yrStr;
    }
  }

  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>(
    "/discover/tv",
    params
  );
  if (data?.results && data.results.length > 0) return data;

  let results = [...FALLBACK_TV_SHOWS];

  if (category === "korean" || language === "ko") {
    const filtered = results.filter((t) => t.original_language === "ko");
    if (filtered.length > 0) results = filtered;
  } else if (
    category === "indian" ||
    language === "hi" ||
    (language && ["te", "ta", "ml", "kn", "bn"].includes(language))
  ) {
    const filtered = results.filter((t) =>
      ["hi", "te", "ta", "ml", "kn", "bn"].includes(t.original_language || "")
    );
    if (filtered.length > 0) results = filtered;
  } else if (category === "hollywood" || language === "en") {
    const filtered = results.filter(
      (t) => t.original_language === "en" || !t.original_language
    );
    if (filtered.length > 0) results = filtered;
  }

  if (year) {
    const yrStr = String(year);
    if (yrStr === "2010s") {
      const filtered = results.filter(
        (t) => t.first_air_date >= "2010-01-01" && t.first_air_date <= "2019-12-31"
      );
      if (filtered.length > 0) results = filtered;
    } else if (yrStr === "2000s") {
      const filtered = results.filter(
        (t) => t.first_air_date >= "2000-01-01" && t.first_air_date <= "2009-12-31"
      );
      if (filtered.length > 0) results = filtered;
    } else if (yrStr === "classics") {
      const filtered = results.filter((t) => t.first_air_date < "2000-01-01");
      if (filtered.length > 0) results = filtered;
    } else {
      const filtered = results.filter((t) => t.first_air_date?.startsWith(yrStr));
      if (filtered.length > 0) results = filtered;
    }
  }

  if (genreId) {
    const filtered = results.filter((t) => t.genre_ids?.includes(genreId));
    if (filtered.length > 0) results = filtered;
  }

  if (sortBy.includes("vote_average")) {
    results.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy.includes("first_air_date")) {
    results.sort(
      (a, b) =>
        new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime()
    );
  } else {
    results.sort((a, b) => b.popularity - a.popularity);
  }

  return {
    page,
    results,
    total_pages: 1,
    total_results: results.length,
  };
}

export async function getMovieDetails(id: number): Promise<TMDBMovie | null> {
  const data = await tmdbFetch<TMDBMovie>(`/movie/${id}`);
  if (data) return data;

  const fallback = FALLBACK_MOVIES.find((m) => m.id === id);
  return fallback || null;
}

export async function getTVDetails(id: number): Promise<TMDBTVShow | null> {
  const data = await tmdbFetch<TMDBTVShow>(`/tv/${id}`);
  if (data) return data;

  const fallback = FALLBACK_TV_SHOWS.find((t) => t.id === id);
  return fallback || null;
}

export async function getTVSeasonDetails(
  id: number,
  seasonNumber: number
): Promise<TMDBSeasonDetail | null> {
  const data = await tmdbFetch<TMDBSeasonDetail>(
    `/tv/${id}/season/${seasonNumber}`
  );
  if (data) return data;

  const key = `${id}-${seasonNumber}`;
  if (FALLBACK_EPISODES[key]) {
    return FALLBACK_EPISODES[key];
  }

  // Generates dummy episodes if none exist
  return {
    id: 999900 + seasonNumber,
    name: `Season ${seasonNumber}`,
    overview: `Season ${seasonNumber} episodes.`,
    season_number: seasonNumber,
    poster_path: null,
    air_date: null,
    episodes: Array.from({ length: 8 }).map((_, idx) => ({
      id: 9999000 + idx,
      name: `Episode ${idx + 1}`,
      overview: `Episode ${idx + 1} overview and summary.`,
      season_number: seasonNumber,
      episode_number: idx + 1,
      still_path: null,
      air_date: null,
      vote_average: 8.0,
      vote_count: 50,
      runtime: 45,
    })),
  };
}

export async function getMovieCredits(id: number): Promise<TMDBCredits | null> {
  const data = await tmdbFetch<TMDBCredits>(`/movie/${id}/credits`);
  if (data) return data;

  return FALLBACK_CREDITS[id] || { id, cast: [], crew: [] };
}

export async function getTVCredits(id: number): Promise<TMDBCredits | null> {
  const data = await tmdbFetch<TMDBCredits>(`/tv/${id}/credits`);
  if (data) return data;

  return FALLBACK_CREDITS[id] || { id, cast: [], crew: [] };
}

export async function getMovieTrailer(id: number): Promise<string | null> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${id}/videos`);
  if (!data?.results || data.results.length === 0) return null;

  const videos = data.results.filter((v) => v.site === "YouTube");
  const officialTrailer = videos.find(
    (v) => v.type === "Trailer" && v.official
  );
  if (officialTrailer) return officialTrailer.key;

  const anyTrailer = videos.find((v) => v.type === "Trailer");
  if (anyTrailer) return anyTrailer.key;

  const teaser = videos.find((v) => v.type === "Teaser");
  if (teaser) return teaser.key;

  return videos[0]?.key || null;
}

export async function getTVTrailer(id: number): Promise<string | null> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${id}/videos`);
  if (!data?.results || data.results.length === 0) return null;

  const videos = data.results.filter((v) => v.site === "YouTube");
  const officialTrailer = videos.find(
    (v) => v.type === "Trailer" && v.official
  );
  if (officialTrailer) return officialTrailer.key;

  const anyTrailer = videos.find((v) => v.type === "Trailer");
  if (anyTrailer) return anyTrailer.key;

  const teaser = videos.find((v) => v.type === "Teaser");
  if (teaser) return teaser.key;

  return videos[0]?.key || null;
}

export async function searchMulti(
  query: string,
  page = 1
): Promise<TMDBPaginatedResponse<MediaItem>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const data = await tmdbFetch<TMDBPaginatedResponse<MediaItem>>(
    "/search/multi",
    { query, page },
    60
  );
  if (data?.results && data.results.length > 0) {
    const filtered = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    return { ...data, results: filtered };
  }

  // Fallback search
  const q = query.toLowerCase();
  const matchedMovies = FALLBACK_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
  ).map((m) => ({ ...m, media_type: "movie" as const }));

  const matchedTV = FALLBACK_TV_SHOWS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) || t.overview.toLowerCase().includes(q)
  ).map((t) => ({ ...t, media_type: "tv" as const }));

  const combined = [...matchedMovies, ...matchedTV];
  return {
    page,
    results: combined,
    total_pages: 1,
    total_results: combined.length,
  };
}

