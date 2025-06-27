import { fetchSuggestions } from "@/lib/data/suggestions";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 },
      );
    }

    if (query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query parameter 'q' cannot be empty" },
        { status: 400 },
      );
    }

    // Use the existing fetchSuggestions function
    const suggestions = await fetchSuggestions(query);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
