import { notFound } from "next/navigation";
import { Graph } from "@/components/graph";
import Navigation from "@/components/navigation";
import { formatYears, RatingsData, RatingsDataSchema, Show } from "@/lib/show";

export default async function RatingsPage(props: { params: { id?: string } }) {
    const showId = props.params.id;
    if (!showId) {
        throw Error("Missing show ID parameter");
    }

    const ratings = await getRatings(showId);
    return (
        <div className="flex flex-1 flex-col">
            <div className="grid grid-cols-[1fr,minmax(auto,600px),1fr]">
                <div className="w-full col-start-2">
                    <Navigation />
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <ShowTitle show={ratings.show} />
                <Graph ratings={ratings} />
            </div>
        </div>
    );
}

function ShowTitle({ show }: { show: Show }) {
    return (
        <div className="p-3">
            <h1 className="text-center text-xl">
                {show.title} ({formatYears(show)})
            </h1>
            <h2 className="text-center text-sm">
                Show rating: {show.showRating.toFixed(1)} (Votes: {show.numVotes.toLocaleString()})
            </h2>
        </div>
    );
}

async function getRatings(showId: string): Promise<RatingsData> {
    if (!showId) {
        notFound();
    }

    const timeout = 60 * 60 * 12;
    const url = `https://api.imdbgraph.org/ratings/${encodeURIComponent(showId)}`;
    const data = await fetch(url, { next: { revalidate: timeout } });
    if (!data.ok) {
        notFound();
    } else {
        const ratingsData = await data.json();
        try {
            return RatingsDataSchema.parse(ratingsData);
        } catch (error) {
            // Just return faulty data but log the error at least.
            console.error("Failed to parse ratings data", error);
            return ratingsData;
        }
    }
}
