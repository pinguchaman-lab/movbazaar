import { NextRequest, NextResponse } from "next/server";
import { getDemoSampleSources } from "@/lib/omss";

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

  const response = getDemoSampleSources(tmdbId, "movie");
  return NextResponse.json(response);
}

