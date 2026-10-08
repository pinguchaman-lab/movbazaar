import React from "react";
import { searchMulti } from "@/lib/tmdb";
import { SearchView } from "@/components/search/SearchView";

interface SearchPageProps {
  searchParams: {
    q?: string;
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
