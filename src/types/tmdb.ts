/**
 * TMDB (The Movie Database) Type Definitions
 */

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids?: number[];
  genres?: TMDBGenre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  spoken_languages?: Array<{ english_name: string; iso_639_1: string; name: string }>;
  production_companies?: Array<{ id: number; name: string; logo_path: string | null }>;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: TMDBGenre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: TMDBSeasonSummary[];
  status?: string;
  tagline?: string;
  spoken_languages?: Array<{ english_name: string; iso_639_1: string; name: string }>;
  production_companies?: Array<{ id: number; name: string; logo_path: string | null }>;
}

export interface TMDBSeasonSummary {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string | null;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_number: number;
  still_path: string | null;
  air_date: string | null;
  vote_average: number;
  vote_count: number;
  runtime?: number;
}

export interface TMDBSeasonDetail {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  poster_path: string | null;
  air_date: string | null;
  episodes: TMDBEpisode[];
}

export interface TMDBPerson {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path: string | null;
}

export interface TMDBCredits {
  id: number;
  cast: TMDBPerson[];
  crew: TMDBPerson[];
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at?: string;
}

export type MediaItem = (
  | (TMDBMovie & { media_type?: "movie" })
  | (TMDBTVShow & { media_type?: "tv" })
) & {
  media_type: "movie" | "tv";
};

