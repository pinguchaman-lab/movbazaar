import { NextRequest, NextResponse } from "next/server";
import { getDemoSampleSources } from "@/lib/omss";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string; season: string; episode: string };
  }
) {
  const tmdbId = parseInt(params.id, 10);
  const season = parseInt(params.season, 10);
  const episode = parseInt(params.episode, 10);

  if (isNaN(tmdbId) || isNaN(season) || isNaN(episode)) {
    return NextResponse.json(
      { error: { code: "INVALID_PARAMS", message: "Invalid TV episode parameters" } },
      { status: 400 }
    );
  }

  const response = getDemoSampleSources(tmdbId, "tv", season, episode);
  return NextResponse.json(response);
}

