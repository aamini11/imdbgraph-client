import { show, episode } from "./schema";
import { relations } from "drizzle-orm/relations";

export const episodeRelations = relations(episode, ({ one }) => ({
  show: one(show, {
    fields: [episode.showId],
    references: [show.imdbId],
  }),
}));

export const showRelations = relations(show, ({ many }) => ({
  episodes: many(episode),
}));
