import { z } from "zod";

export const ShowSchema = z.object({
  imdbId: z.string(),
  title: z.string(),
  startYear: z.string().nullish(),
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
