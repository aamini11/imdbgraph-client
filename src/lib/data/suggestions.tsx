import { Show, ShowSchema } from "./show";
import { z } from "zod";

export async function fetchSuggestions(query: string): Promise<Show[]> {
  const response = await fetch(`/api/search?q=${query}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const show = await response.json();
  try {
    return z.array(ShowSchema).parse(show);
  } catch (error) {
    // Just return faulty data but log the error at least.
    if (error instanceof z.ZodError) {
      console.error(`Failed to parse show data for: ${show.imdbId}`, error);
      return show as Show[];
    } else {
      throw error;
    }
  }
}
