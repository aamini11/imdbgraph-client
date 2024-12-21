import { z } from "zod";

export const ShowSchema = z.object({
    imdbId: z.string(),
    title: z.string(),
    startYear: z.string(),
    endYear: z.string().nullish(),
    runtime: z.string().nullish(),
    rating: z.string().nullish(),
    showRating: z.number().gte(0).lte(10.0),
    numVotes: z.number().nonnegative(),
    cast: z.string().nullish(),
    genre: z.string().nullish(),
});

export type Show = z.infer<typeof ShowSchema>;

export function formatYears(show: Show): string {
    const endDate = show.endYear ?? "Present";
    return `${show.startYear} - ${endDate}`;
}

export const EpisodeSchema = z.object({
    episodeTitle: z.string().nullish(),
    season: z.number(),
    episodeNumber: z.number(),
    imdbRating: z.number(),
    numVotes: z.number(),
});

export type Episode = z.infer<typeof EpisodeSchema>;

export const RatingsDataSchema = z.object({
    show: ShowSchema,
    allEpisodeRatings: z.record(z.string(), z.record(z.string(), EpisodeSchema)),
});

export type RatingsData = z.infer<typeof RatingsDataSchema>;
