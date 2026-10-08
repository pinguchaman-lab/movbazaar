import { NextRequest, NextResponse } from "next/server";
import { getTVSeasonDetails } from "@/lib/tmdb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; seasonNumber: string } }
) {
  const tvId = parseInt(params.id, 10);
  const seasonNumber = parseInt(params.seasonNumber, 10);

  if (isNaN(tvId) || isNaN(seasonNumber)) {
    return NextResponse.json(
      { error: "Invalid TV ID or season number" },
      { status: 400 }
    );
  }

  const seasonDetail = await getTVSeasonDetails(tvId, seasonNumber);
  if (!seasonDetail) {
    return NextResponse.json(
      { error: "Season details not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(seasonDetail);
}

