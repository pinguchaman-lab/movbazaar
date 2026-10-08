import {
  getTrendingAll,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
} from "@/lib/tmdb";
import { Hero } from "@/components/hero/Hero";
import { MediaCarousel } from "@/components/carousel/MediaCarousel";
import { ContinueWatching } from "@/components/continue-watching/ContinueWatching";

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
  const [
    trendingItems,
    popularMoviesData,
    popularTvData,
    topRatedMoviesData,
    topRatedTvData,
  ] = await Promise.all([
    getTrendingAll("day"),
    getPopularMovies(1),
    getPopularTV(1),
    getTopRatedMovies(1),
    getTopRatedTV(1),
  ]);

  const heroItem =
    trendingItems.find((item) => item.backdrop_path) ||
    popularMoviesData.results[0] ||
    trendingItems[0];

  return (
    <div className="min-h-screen pb-16 space-y-8 sm:space-y-12">
      {/* Hero Section */}
      {heroItem && <Hero item={heroItem} />}

      <div className="space-y-10 sm:space-y-12">
        {/* Continue Watching Section (Client-rendered from LocalStorage) */}
        <ContinueWatching />

        {/* Trending Now */}
        <MediaCarousel
          title="Trending Now"
          items={trendingItems}
          viewAllHref="/movies"
        />

        {/* Popular Movies */}
        <MediaCarousel
          title="Popular Movies"
          items={popularMoviesData.results}
          defaultType="movie"
          viewAllHref="/movies"
        />

        {/* Popular TV Shows */}
        <MediaCarousel
          title="Popular TV Shows"
          items={popularTvData.results}
          defaultType="tv"
          viewAllHref="/tv"
        />

        {/* Top Rated Movies */}
        <MediaCarousel
          title="Top Rated Movies"
          items={topRatedMoviesData.results}
          defaultType="movie"
          viewAllHref="/movies"
        />

        {/* Top Rated TV Shows */}
        <MediaCarousel
          title="Top Rated TV Shows"
          items={topRatedTvData.results}
          defaultType="tv"
          viewAllHref="/tv"
        />
      </div>
    </div>
  );
}
