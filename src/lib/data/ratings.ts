import { EpisodeSchema } from "@/lib/data/episode";
import { ShowSchema } from "@/lib/data/show";
import { z } from "zod";

const RatingsDataSchema = z.object({
  show: ShowSchema,
  allEpisodeRatings: z.record(z.string(), z.record(z.string(), EpisodeSchema)),
});

export type RatingsData = z.infer<typeof RatingsDataSchema>;

export function validateRatingsData(ratingsData: unknown): RatingsData {
  try {
    return RatingsDataSchema.parse(ratingsData);
  } catch (error) {
    // Just return faulty data but log the error at least.
    if (error instanceof z.ZodError) {
      console.error(`Failed to parse ratings data`, error.issues);
    }
    return ratingsData as RatingsData;
  }
}
