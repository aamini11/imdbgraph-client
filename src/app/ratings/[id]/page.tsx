import { Graph } from "@/components/graph";
import Navigation from "@/components/navigation";
import { Spinner } from "@/components/ui/spinner";
import { RatingsData, RatingsDataSchema } from "@/lib/data/ratings";
import { formatYears } from "@/lib/data/show";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

export default function RatingsPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="grid grid-cols-[1fr,minmax(auto,600px),1fr]">
                <div className="w-full col-start-2">
                    <Navigation />
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <Suspense fallback={<Spinner />}>
                    <Ratings params={params} />
                </Suspense>
            </div>
        </div>
    );
}

export async function Ratings({ params }: { params: Promise<{ id?: string }> }) {
    const id = (await params)?.id;
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
            <Graph ratings={ratings} />
        </>
    );
}

async function getRatings(showId: string): Promise<RatingsData> {
    const url = `https://api.imdbgraph.org/ratings/${encodeURIComponent(showId)}`;
    const data = await fetch(url);
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
