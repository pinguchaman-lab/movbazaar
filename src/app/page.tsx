import {
  getTrendingAll,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  discoverMovies,
  discoverTV,
} from "@/lib/tmdb";
import { Hero } from "@/components/hero/Hero";
import { MediaCarousel } from "@/components/carousel/MediaCarousel";
import { ContinueWatching } from "@/components/continue-watching/ContinueWatching";
import { AdBanner } from "@/components/ads/AdBanner";

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
  const [
    trendingItems,
    popularMoviesData,
    popularTvData,
    topRatedMoviesData,
    topRatedTvData,
    indianMoviesData,
    koreanTvData,
  ] = await Promise.all([
    getTrendingAll("day"),
    getPopularMovies(1),
    getPopularTV(1),
    getTopRatedMovies(1),
    getTopRatedTV(1),
    discoverMovies({ category: "indian", page: 1 }),
    discoverTV({ category: "korean", page: 1 }),
  ]);

  const heroItem =
    trendingItems.find((item) => item.backdrop_path) ||
    popularMoviesData.results[0] ||
    trendingItems[0];

  return (
    <div className="min-h-screen pb-16 space-y-8 sm:space-y-12">
      {/* Hero Section */}
      {heroItem && <Hero item={heroItem} />}

      <div className="space-y-10 sm:space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Continue Watching Section (Client-rendered from LocalStorage) */}
        <ContinueWatching />

        {/* Trending Now */}
        <MediaCarousel
          title="Trending Now"
          items={trendingItems}
          viewAllHref="/movies"
        />

        {/* Indian Cinema Section */}
        {indianMoviesData.results.length > 0 && (
          <MediaCarousel
            title="Indian Cinema (Bollywood & South Indian)"
            items={indianMoviesData.results}
            defaultType="movie"
            viewAllHref="/movies?category=indian"
          />
        )}

        {/* Sponsor Banner (Disappears automatically for VIP users) */}
        <AdBanner slot="home-middle" />

        {/* Korean K-Drama Section */}
        {koreanTvData.results.length > 0 && (
          <MediaCarousel
            title="Trending K-Dramas & Korean Series"
            items={koreanTvData.results}
            defaultType="tv"
            viewAllHref="/tv?category=korean"
          />
        )}

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
