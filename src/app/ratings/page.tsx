import { Graph } from "@/components/graph";
import { Loader } from "@/components/loading";
import { SearchBar } from "@/components/search-bar";
import { RatingsData, RatingsDataSchema } from "@/lib/data/ratings";
import { formatYears } from "@/lib/data/show";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

export const experimental_ppr = true;

export default function RatingsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return (
    <>
      {/* TOP NAVBAR (Home icon + seachbar) */}
      <div className="grid grid-cols-[1fr_minmax(auto,600px)_1fr]">
        <div className="w-full col-start-2">
          <div className="w-full pr-4 flex items-center">
            {/* Home icon */}
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                className="dark:fill-neutral-200 m-2 cursor-pointer transition-opacity hover:opacity-60"
              >
                <path d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z" />
              </svg>
            </Link>
            <SearchBar />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT (Title + Graph) */}
      <div className="flex flex-col flex-1">
        <Suspense fallback={<Loader />}>
          <Ratings searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function Ratings({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const id = (await searchParams)?.id;
  if (!id) {
    notFound();
  }
  const ratings = await getRatings(id);
  const show = ratings.show;
  return (
    <>
      {/* Title */}
      <div className="p-3">
        <h1 className="text-center text-xl">
          {show.title} ({formatYears(show)})
        </h1>
        <h2 className="text-center text-sm">
          Show rating: {show.showRating.toFixed(1)} (Votes: {show.numVotes.toLocaleString()})
        </h2>
      </div>

      {/* Graph */}
      <div className="flex-1 min-h-[250px] p-5">
        <Graph ratings={ratings} />
      </div>
    </>
  );
}

async function getRatings(showId: string): Promise<RatingsData> {
  const url = `https://api.imdbgraph.org/ratings/${encodeURIComponent(showId)}`;
  const timeout = 60 * 60 * 12; // 12 hours
  const data = await fetch(url, { next: { revalidate: timeout } });
  if (!data.ok) {
    notFound();
  }
  const ratingsData = await data.json();
  try {
    return RatingsDataSchema.parse(ratingsData);
  } catch (error) {
    // Just return faulty data but log the error at least.
    if (error instanceof z.ZodError) {
      console.error(`Failed to parse ratings data for show: ${showId}`, error);
      return ratingsData as RatingsData;
    } else {
      throw error;
    }
  }
}
