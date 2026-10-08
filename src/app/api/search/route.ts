import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";
import { MediaItem } from "@/types/tmdb";

function getItemTitle(item: MediaItem): string {
  if ("title" in item && item.title) return item.title;
  if ("name" in item && item.name) return item.name;
  return "";
}

function getItemDate(item: MediaItem): string {
  if ("release_date" in item && item.release_date) return item.release_date;
  if ("first_air_date" in item && item.first_air_date) return item.first_air_date;
  return "";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!q.trim()) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0 });
  }

  const trimmed = q.trim();
  const lowerQ = trimmed.toLowerCase();
  const aliasMap: Record<string, string> = {
    tmkoc: "taarak mehta",
    bb: "bigg boss",
    kapil: "kapil sharma",
    yrkkh: "yeh rishta",
    aot: "attack on titan",
    dbz: "dragon ball",
    jjk: "jujutsu kaisen",
  };
  const aliasQ = aliasMap[lowerQ] || lowerQ;
  const data = await searchMulti(trimmed, page);

  if (!data?.results || data.results.length === 0) {
    return NextResponse.json(data);
  }

  // Filter high-quality suggestions only
  const filtered = data.results.filter((item: MediaItem) => {
    // Must be a movie or TV show
    if (item.media_type !== "movie" && item.media_type !== "tv") return false;

    // Must have artwork (poster or backdrop)
    if (!item.poster_path && !item.backdrop_path) return false;

    const title = getItemTitle(item).toLowerCase();

    // If title directly contains search query or alias, allow it
    if (title.includes(lowerQ) || title.includes(aliasQ)) return true;

    // Discard zero-vote or obscure noise entries unless it's a recent 2025/2026 title
    const date = getItemDate(item);
    const isRecent = date.startsWith("2025") || date.startsWith("2026");
    if ((item.vote_count || 0) < 3 && !isRecent && (item.popularity || 0) < 3.0) {
      return false;
    }

    return true;
  });

  // Smart ranking for high-quality movie discovery:
  // 1. Exact title match
  // 2. Starts with query
  // 3. Contains query
  // 4. Popularity descending
  filtered.sort((a, b) => {
    const titleA = getItemTitle(a).toLowerCase();
    const titleB = getItemTitle(b).toLowerCase();

    const exactA = titleA === lowerQ || titleA === aliasQ;
    const exactB = titleB === lowerQ || titleB === aliasQ;
    if (exactA && !exactB) return -1;
    if (!exactA && exactB) return 1;

    const startsA = titleA.startsWith(lowerQ) || titleA.startsWith(aliasQ);
    const startsB = titleB.startsWith(lowerQ) || titleB.startsWith(aliasQ);
    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    // Sort by popularity and vote count
    const popA = (a.popularity || 0) + (a.vote_count ? Math.min(a.vote_count / 100, 50) : 0);
    const popB = (b.popularity || 0) + (b.vote_count ? Math.min(b.vote_count / 100, 50) : 0);
    return popB - popA;
  });

  return NextResponse.json({
    ...data,
    results: filtered,
  });
}
