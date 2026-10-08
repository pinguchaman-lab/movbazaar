import React from "react";
import { searchMulti } from "@/lib/tmdb";
import { SearchView } from "@/components/search/SearchView";

import { Metadata } from "next";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q ? `"${searchParams.q}"` : "Movies & TV Series";
  return {
    title: `Search ${query} | MovBazaar`,
    description: `Discover and stream free movies and TV shows matching ${query} in Ultra HD on MovBazaar.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const searchResults = query.trim() ? await searchMulti(query.trim(), 1) : null;
  const items = searchResults?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchView items={items} query={query} />
    </div>
  );
}
