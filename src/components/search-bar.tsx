"use client";

import { formatYears } from "@/lib/data/show";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "cmdk";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// MAC: "placeholder:text-base",
const suggestions = [
  {
    imdbId: "tt0369179",
    title: "Two and a Half Men",
    startYear: "2003",
    endYear: "2015",
    showRating: 7.1,
    numVotes: 289874,
  },
  {
    imdbId: "tt1843230",
    title: "Once Upon a Time",
    startYear: "2011",
    endYear: "2018",
    showRating: 7.7,
    numVotes: 242917,
  },
  {
    imdbId: "tt2395695",
    title: "Cosmos: A Spacetime Odyssey",
    startYear: "2014",
    endYear: "2014",
    showRating: 9.2,
    numVotes: 134137,
  },
  {
    imdbId: "tt5189670",
    title: "Making a Murderer",
    startYear: "2015",
    endYear: "2018",
    showRating: 8.5,
    numVotes: 105977,
  },
  {
    imdbId: "tt2177461",
    title: "A Discovery of Witches",
    startYear: "2018",
    endYear: "2022",
    showRating: 7.8,
    numVotes: 69740,
  },
];

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function SearchBar() {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  // Optimize page navigation by prefetching the ratings page
  useEffect(() => {
    router.prefetch("/ratings");
  }, [router]);

  const filteredSuggestions =
    value.length > 0
      ? suggestions.filter((x) =>
          x.title.toLowerCase().includes(value.toLowerCase()),
        )
      : [];

  return (
    <search className="relative w-full">
      <Command
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          "flex h-full w-full px-3 py-1 bg-background  placeholder:text-muted-foreground text-base md:text-sm",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        {/* Search Bar */}
        <div className="flex items-center px-3 border border-input rounded-full">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            value={value}
            onValueChange={(value) => setValue(value)}
            className={cn(
              "h-10 w-full text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            )}
            placeholder="Search for any TV show..."
          />
        </div>
        {/* Dropdown Menu */}
        <CommandList
          className={cn("rounded-xl p-2 border mt-2 w-full", {
            hidden: !value,
          })}
          id="tv-search-dropdown"
        >
          {!filteredSuggestions.length ? (
            <CommandEmpty>No TV Shows found</CommandEmpty>
          ) : (
            filteredSuggestions.map((show) => (
              <CommandItem
                key={show.imdbId}
                className={cn(
                  "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                  "text-sm text-foreground/60 px-2 py-1.5",
                  "flex gap-2 items-center justify-between cursor-pointer rounded-md",
                  "hover:bg-foreground/5",
                )}
              >
                <Link href={`/ratings`} className="flex w-full gap-2">
                  {/* Show Title + Years */}
                  <div className="flex flex-col flex-1">
                    <span className="break-words">{show.title}&nbsp;</span>
                    <span className="text-foreground/40 text-xs">
                      {formatYears(show)}
                    </span>
                  </div>
                  {/* 1-10 Rating + Blue Star Icon */}
                  <div className="shrink-0 flex items-center space-x-1 text-sm">
                    <StarIcon />
                    <dd>{`${show.showRating.toFixed(1)} / 10.0`}</dd>
                  </div>
                </Link>
              </CommandItem>
            ))
          )}
        </CommandList>
      </Command>
    </search>
  );
}

const StarIcon = () => (
  <dt>
    <span className="sr-only">Star rating</span>
    <svg className="text-sky-500" width="16" height="20" fill="currentColor">
      <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
    </svg>
  </dt>
);
