import { NextResponse, type NextRequest } from "next/server";
import { searchAnime } from "@/lib/anilist/client";
import type { SearchResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json<SearchResponse>({ results: [] });
  }

  try {
    const results = await searchAnime(query, 8);
    return NextResponse.json<SearchResponse>({ results });
  } catch (error) {
    console.error("AniList search failed", error);
    return NextResponse.json(
      { error: "Pencarian sedang tidak tersedia." },
      { status: 502 },
    );
  }
}
