"use server";

import { db } from "@/lib/db/drizzle";
import { show } from "@/lib/db/schema";
import { Show } from "@/lib/types";
import { sql } from "drizzle-orm";

export async function fetchSuggestions(query: string): Promise<Show[]> {
  return await db
    .select()
    .from(show)
    .where(sql`${query}::text <% title::text`)
    .orderBy(show.numVotes)
    .limit(5);
}
