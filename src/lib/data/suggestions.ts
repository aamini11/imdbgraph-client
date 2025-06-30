"use server";

import { db } from "@/db/connection";
import { show } from "@/db/schema";
import { Show } from "@/lib/data/types";
import { desc, sql } from "drizzle-orm";

export async function fetchSuggestions(query: string): Promise<Show[]> {
  if (!query || isEmpty(query)) return [];
  return await db
    .select()
    .from(show)
    .where(sql`${query}::text <% title::text`)
    .orderBy(desc(show.numVotes))
    .limit(5);
}

export function isEmptyOrBlank(value: string | undefined): boolean {
  if (!value || !value.trim()) return true;
  const trimmedValue = value.trim();
  return (
    trimmedValue === "null" ||
    trimmedValue.toLowerCase() === "none" ||
    trimmedValue.toLowerCase() === "no"
