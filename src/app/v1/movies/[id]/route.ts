import { NextRequest, NextResponse } from "next/server";
import { getDemoSampleSources } from "@/lib/omss";
import { getMovieDetails, getMovieTrailer } from "@/lib/tmdb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tmdbId = parseInt(params.id, 10);
  if (isNaN(tmdbId)) {
    return NextResponse.json(
      { error: { code: "INVALID_ID", message: "Invalid TMDB ID" } },
      { status: 400 }
    );
  }

  const [movie, trailerKey] = await Promise.all([
    getMovieDetails(tmdbId),
    getMovieTrailer(tmdbId),
  ]);

  const isUpcoming = Boolean(
    movie?.release_date && new Date(movie.release_date).getTime() > Date.now()
  );

  const response = getDemoSampleSources(tmdbId, "movie", undefined, undefined, {
    trailerKey,
    isUpcoming,
  });
  return NextResponse.json(response);
}

