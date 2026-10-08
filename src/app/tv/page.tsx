import React from "react";
import { getTVGenres, discoverTV } from "@/lib/tmdb";
import { CatalogView } from "@/components/catalog/CatalogView";

interface PageProps {
  searchParams: {
    genre?: string;
    sort?: string;
    page?: string;
  };
}

export default async function TVCatalogPage({ searchParams }: PageProps) {
  const currentGenreId = searchParams.genre
    ? parseInt(searchParams.genre, 10)
    : undefined;
  const currentSort = searchParams.sort || "popularity.desc";
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const [genres, tvData] = await Promise.all([
    getTVGenres(),
    discoverTV({
      genreId: currentGenreId,
      sortBy: currentSort,
      page: currentPage,
    }),
  ]);

  return (
    <CatalogView
      type="tv"
      title="TV Shows"
      items={tvData.results}
      genres={genres}
      currentGenreId={currentGenreId}
      currentSort={currentSort}
      currentPage={currentPage}
      totalPages={tvData.total_pages || 1}
    />
  );
}

