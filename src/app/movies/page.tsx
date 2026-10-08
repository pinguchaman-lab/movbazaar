import React from "react";
import { getMovieGenres, discoverMovies } from "@/lib/tmdb";
import { CatalogView } from "@/components/catalog/CatalogView";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies Catalog — Stream Trending Movies Online Free in HD",
  description:
    "Browse the full MovBazaar movies library. Stream Bollywood, Hollywood, and international blockbusters in Full HD with Dual Audio and subtitles.",
};

interface PageProps {
  searchParams: {
    genre?: string;
    sort?: string;
    page?: string;
    category?: string;
    lang?: string;
    year?: string;
  };
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const currentGenreId = searchParams.genre
    ? parseInt(searchParams.genre, 10)
    : undefined;
  const currentSort = searchParams.sort || "popularity.desc";
  const currentCategory = searchParams.category || "all";
  const currentLanguage = searchParams.lang || "all";
  const currentYear = searchParams.year || "all";
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const [genres, moviesData] = await Promise.all([
    getMovieGenres(),
    discoverMovies({
      genreId: currentGenreId,
      sortBy: currentSort,
      page: currentPage,
      category: currentCategory,
      language: currentLanguage !== "all" ? currentLanguage : undefined,
      year: currentYear !== "all" ? currentYear : undefined,
    }),
  ]);

  return (
    <CatalogView
      type="movie"
      title="Movies Catalog"
      items={moviesData.results}
      genres={genres}
      currentGenreId={currentGenreId}
      currentSort={currentSort}
      currentCategory={currentCategory}
      currentLanguage={currentLanguage}
      currentYear={currentYear}
      currentPage={currentPage}
      totalPages={moviesData.total_pages || 1}
    />
  );
}
