import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!q.trim()) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0 });
  }

  const results = await searchMulti(q, page);
  return NextResponse.json(results);
}

