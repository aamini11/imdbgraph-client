import { show, episode, thumbnails } from "./schema";
import { relations } from "drizzle-orm/relations";

export const episodeRelations = relations(episode, ({ one }) => ({
  show: one(show, {
    fields: [episode.showId],
    references: [show.imdbId],
  }),
}));

export const showRelations = relations(show, ({ many }) => ({
  episodes: many(episode),
  thumbnails: many(thumbnails),
}));

export const thumbnailsRelations = relations(thumbnails, ({ one }) => ({
  show: one(show, {
    fields: [thumbnails.imdbId],
    references: [show.imdbId],
  }),
}));
