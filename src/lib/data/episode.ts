import { z } from "zod";

export const EpisodeSchema = z.object({
    episodeTitle: z.string().nullish(),
    season: z.number(),
    episodeNumber: z.number(),
    imdbRating: z.number(),
    numVotes: z.number(),
});

export type Episode = z.infer<typeof EpisodeSchema>;
