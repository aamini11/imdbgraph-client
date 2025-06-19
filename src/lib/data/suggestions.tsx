"use server";

import { Show } from "./types";
import { show } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export async function fetchSuggestions(query: string): Promise<Show[]> {
  return await db
    .select()
    .from(show)
    .where(sql`${query}::text <% title::text`)
    .orderBy(show.numVotes)
    .limit(5);
}
