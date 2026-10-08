import { NextRequest, NextResponse } from "next/server";
import { getEpisodeSources, getDemoSampleSources } from "@/lib/omss";

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
      {
        success: false,
        error: { code: "INVALID_PARAMS", message: "Invalid TV episode parameters" },
      },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const demoFallback = searchParams.get("demo") === "true";

  const result = await getEpisodeSources(tmdbId, season, episode);

  if (!result.success && demoFallback) {
    const demoData = getDemoSampleSources(tmdbId, "tv", season, episode);
    return NextResponse.json({
      success: true,
      data: demoData,
      isDemoFallback: true,
    });
  }

  return NextResponse.json(result);
}

