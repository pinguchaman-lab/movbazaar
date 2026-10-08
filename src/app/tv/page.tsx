import React from "react";
import { getTVGenres, discoverTV } from "@/lib/tmdb";
import { CatalogView } from "@/components/catalog/CatalogView";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TV Shows & Series — Stream All Seasons Online Free in HD",
  description:
    "Explore full seasons and episodes of top web series, Korean dramas, Indian shows, and trending television series with multi-track audio on MovBazaar.",
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

export default async function TVCatalogPage({ searchParams }: PageProps) {
  const currentGenreId = searchParams.genre
    ? parseInt(searchParams.genre, 10)
    : undefined;
  const currentSort = searchParams.sort || "popularity.desc";
  const currentCategory = searchParams.category || "all";
  const currentLanguage = searchParams.lang || "all";
  const currentYear = searchParams.year || "all";
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const [genres, tvData] = await Promise.all([
    getTVGenres(),
    discoverTV({
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
      type="tv"
      title="TV Shows Catalog"
      items={tvData.results}
      genres={genres}
      currentGenreId={currentGenreId}
      currentSort={currentSort}
      currentCategory={currentCategory}
      currentLanguage={currentLanguage}
      currentYear={currentYear}
      currentPage={currentPage}
      totalPages={tvData.total_pages || 1}
    />
  );
}
