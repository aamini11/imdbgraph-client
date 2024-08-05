import { notFound } from "next/navigation";
import { Graph } from "@/components/Graph";
import Navigation from "@/components/Navigation";
import { RatingsData } from "@/models/Show";

export default async function RatingsPage(props: { params: { id?: string } }) {
    const showId = props.params.id;
    if (!showId) {
        throw "Missing show ID parameter";
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="grid grid-cols-[1fr,minmax(auto,600px),1fr]">
                <div className="w-full col-start-2">
                    <Navigation />
                </div>
            </div>
            <div className="flex-1">
                <Graph ratings={await getRatings(showId)} />
            </div>
        </div>
    );
}

async function getRatings(showId: string): Promise<RatingsData> {
    if (!showId) {
        notFound();
    }

    const url = `https://api.imdbgraph.org/ratings/${encodeURIComponent(showId)}`;
    const data = await fetch(url, { next: { revalidate: 60 * 60 * 24 /* One day */ } });
    if (!data.ok) {
        notFound();
    } else {
        return (await data.json()) as Promise<RatingsData>;
    }
}
