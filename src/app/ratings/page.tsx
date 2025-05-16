import { Graph } from "@/components/graph";
import { RatingsData, validateRatingsData } from "@/lib/data/ratings";
import { formatYears } from "@/lib/data/show";
import { notFound } from "next/navigation";

export default async function Ratings({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const id = (await searchParams)?.id;
  if (!id) {
    notFound();
  }

  // Call API..
  const url = `https://api.imdbgraph.org/ratings/${encodeURIComponent(id)}`;
  const timeout = 60 * 60 * 12; // 12 hours
  const data = await fetch(url, { next: { revalidate: timeout } });
  if (!data.ok) {
    notFound();
  }

  // Parse JSON response.
  const jsonResponse = await data.json();
  const ratings = validateRatingsData(jsonResponse);
  const show = ratings.show;

  return (
    <>
      {/* Show Title */}
      <div className="p-3">
        <h1 className="text-center text-xl">
          {show.title} ({formatYears(show)})
        </h1>
        <h2 className="text-center text-sm">
          Show rating: {show.showRating.toFixed(1)} (Votes:{" "}
          {show.numVotes.toLocaleString()})
        </h2>
      </div>

      {/* Graph */}
      <div className="flex-1 min-h-[250px] p-5">
        {!hasRatings(ratings) ? (
          <h1 className="pt-8 text-center text-6xl leading-tight">
            No Ratings Found
          </h1>
        ) : (
          <Graph ratings={ratings} />
        )}
      </div>
    </>
  );
}

function hasRatings(ratings: RatingsData): boolean {
  for (const seasonRatings of Object.values(ratings.allEpisodeRatings)) {
    for (const episode of Object.values(seasonRatings)) {
      if (episode.numVotes > 0) {
        return true;
      }
    }
  }
  return false;
}
