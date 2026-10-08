import React from "react";
import { getMovieGenres, discoverMovies } from "@/lib/tmdb";
import { CatalogView } from "@/components/catalog/CatalogView";

interface PageProps {
  searchParams: {
    genre?: string;
    sort?: string;
    page?: string;
  };
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const currentGenreId = searchParams.genre
    ? parseInt(searchParams.genre, 10)
    : undefined;
  const currentSort = searchParams.sort || "popularity.desc";
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const [genres, moviesData] = await Promise.all([
    getMovieGenres(),
    discoverMovies({
      genreId: currentGenreId,
      sortBy: currentSort,
      page: currentPage,
    }),
  ]);

  return (
    <CatalogView
      type="movie"
      title="Movies"
      items={moviesData.results}
      genres={genres}
      currentGenreId={currentGenreId}
      currentSort={currentSort}
      currentPage={currentPage}
      totalPages={moviesData.total_pages || 1}
    />
  );
}

