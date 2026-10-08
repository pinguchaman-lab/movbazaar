import React from "react";
import { searchMulti } from "@/lib/tmdb";
import { MovieGrid } from "@/components/movie-grid/MovieGrid";
import { Search } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Search className="w-6 h-6 text-[#e50914]" />
          <span>Search Results</span>
        </h1>
        {query ? (
          <p className="text-sm text-zinc-400 mt-2">
            Showing results for{" "}
            <span className="text-white font-semibold italic">
              &ldquo;{query}&rdquo;
            </span>{" "}
            ({items.length} titles found)
          </p>
        ) : (
          <p className="text-sm text-zinc-400 mt-2">
            Enter a movie or TV show title to search.
          </p>
        )}
      </div>

      {/* Grid or Empty State */}
      {query && items.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-300">No results found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            We couldn&apos;t find any movies or TV shows matching &ldquo;{query}&rdquo;. Check your
            spelling or try searching for another title.
          </p>
        </div>
      ) : (
        <MovieGrid items={items} emptyMessage="Type in the search bar above to begin searching." />
      )}
    </div>
  );
}

