import Link from "next/link";
import React from "react";
import Navigation from "components/Navigation";
import { formatYears, Show } from "models/Show";

async function getSearchResults(query: string): Promise<Show[]> {
    // Fetch data from external API
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (response.ok) {
        return (await response.json()) as Show[];
    } else {
        throw "API Failed";
    }
}

export default async function Search(props: { searchParams: { q: string } }) {
    const query = props.searchParams.q;
    if (!query) {
        throw "No query provided";
    }

    const shows = await getSearchResults(query);
    return (
        <div>
            <div className="p-6 w-full flex items-center max-w-screen-sm">
                <div className="w-full max-w-screen-sm">
                    <Navigation />
                </div>
            </div>
            <div className="max-w-screen-sm px-6">
                {shows.length > 0 ? (
                    <List searchResults={shows} />
                ) : (
                    <div className="pt-8">No results found for : {query}</div>
                )}
            </div>
        </div>
    );
}

function List(props: { searchResults: Show[] }) {
    return (
        <ul className="space-y-5">
            {props.searchResults.map((movie) => (
                <ListItem key={movie.imdbId} show={movie} />
            ))}
        </ul>
    );
}

function ListItem({ show }: { show: Show }) {
    const title = <h2 className="text-2xl font-semibold truncate pr-20">{show.title}</h2>;
    const year = (
        <div className="ml-2">
            <dt className="sr-only">Year</dt>
            <dd>{formatYears(show)}</dd>
        </div>
    );
    const rating = (
        <div className="absolute top-0 right-0 flex items-center space-x-1">
            <dt className="text-sky-500">
                <span className="sr-only">Star rating</span>
                <svg width="16" height="20" fill="currentColor">
                    <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                </svg>
            </dt>
            <dd>{`${show.showRating.toFixed(1)} / 10.0`}</dd>
        </div>
    );

    return (
        <article className="p-6 relative drop-shadow-xl rounded-xl bg-gray-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-700">
            <div className="min-w-0 relative">
                {title}
                <dl className="mt-2 text-sm leading-6 font-medium">
                    {year}
                    {rating}
                </dl>
            </div>
            <Link href={`/ratings/${show.imdbId}`}>
                <button className="absolute w-full h-full top-0 left-0 z-[1]" />
            </Link>
        </article>
    );
}
