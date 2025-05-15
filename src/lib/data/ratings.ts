import { EpisodeSchema } from "@/lib/data/episode";
import { ShowSchema } from "@/lib/data/show";
import { z } from "zod";

export const RatingsDataSchema = z.object({
  show: ShowSchema,
  allEpisodeRatings: z.record(z.string(), z.record(z.string(), EpisodeSchema)),
});

export type RatingsData = z.infer<typeof RatingsDataSchema>;
