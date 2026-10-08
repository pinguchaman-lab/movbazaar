import { NextRequest, NextResponse } from "next/server";
import { getMovieSources, getDemoSampleSources } from "@/lib/omss";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tmdbId = parseInt(params.id, 10);
  if (isNaN(tmdbId)) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_ID", message: "Invalid TMDB ID" } },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const demoFallback = searchParams.get("demo") === "true";

  const result = await getMovieSources(tmdbId);

  // If OMSS is offline and demo preview is explicitly requested
  if (!result.success && demoFallback) {
    const demoData = getDemoSampleSources(tmdbId, "movie");
    return NextResponse.json({
      success: true,
      data: demoData,
      isDemoFallback: true,
    });
  }

  return NextResponse.json(result);
}

