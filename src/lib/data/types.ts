export type Show = {
  imdbId: string;
  title: string;
  startYear: string;
  endYear: string | null;
  rating: number;
  numVotes: number;
};

export type Episode = {
  title: string;
  seasonNum: number;
  episodeNum: number;
  rating: number;
  numVotes: number;
};

export type Ratings = {
  show: Show;
  allEpisodeRatings: Record<string, Record<string, Episode>>;
};

export function formatYears(show: Show): string {
  const endDate = show.endYear ?? "Present";
  return `${show.startYear} - ${endDate}`;
}
