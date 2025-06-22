import { Episode, Ratings } from "@/lib/types";
import { show, episode } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export async function getRatings(showId: string): Promise<Ratings> {
  const [foundShow] = await db
    .select()
    .from(show)
    .where(eq(show.imdbId, showId));
  if (!foundShow) {
    throw new Error("Show not found");
  }

  const episodes = await db
    .select()
    .from(episode)
    .where(eq(episode.showId, showId))
    .orderBy(asc(episode.seasonNum), asc(episode.episodeNum));

  // Group episodes by season and episode number (using string keys)
  const groupedEpisodes: Record<string, Record<string, Episode>> = {};
  for (const e of episodes) {
    const seasonKey = e.seasonNum.toString();
    const episodeKey = e.episodeNum.toString();

    // Create season entry if missing
    if (!groupedEpisodes[seasonKey]) {
      groupedEpisodes[seasonKey] = {};
    }

    // Add episode to season
    groupedEpisodes[seasonKey][episodeKey] = e;
  }

  return { show: foundShow, allEpisodeRatings: groupedEpisodes };
}
