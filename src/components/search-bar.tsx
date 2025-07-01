"use client";

import { LoadingSpinner } from "@/components/icons";
import { fetchSuggestions } from "@/lib/data/suggestions";
import { formatYears } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useDeferredValue } from "react";

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function SearchBar() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const deferredValue = useDeferredValue(inputValue);

  const { isFetching, data: searchResults } = useQuery({
    queryKey: ["suggestions", deferredValue],
    queryFn: () => fetchSuggestions(deferredValue),
    placeholderData: keepPreviousData,
  });

  // Optimize page navigation by prefetching the ratings page
  useEffect(() => {
    router.prefetch("/ratings");
  }, [router]);

  return (
    <Command
      label="TV Show Searchbar"
      className={cn(
        "bg-background text-popover-foreground relative flex h-full w-full flex-col text-sm",
        "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
    >
      {/* Search Bar */}
      <div className="border-input flex items-center rounded-full border px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Command.Input
          autoFocus
          onValueChange={setInputValue}
          className="placeholder:text-muted-foreground h-10 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search for any TV show..."
        />
        {isFetching && <LoadingSpinner />}
      </div>

      {/* Dropdown Menu */}
      <Command.List
        className={cn(
          "bg-popover sticky top-full right-0 left-0 z-50 mt-2 w-full rounded-xl border p-2 shadow-lg",
          {
            hidden: isFetching || !inputValue || !searchResults,
          },
        )}
      >
        <Command.Empty className="text-foreground/60 px-2 py-1.5 text-center">
          No TV Shows Found.
        </Command.Empty>
        {searchResults?.map((show) => (
          <Command.Item
            key={show.imdbId + "_" + show.title}
            value={show.imdbId + "_" + show.title}
            onSelect={() => {
              router.push(`/ratings?id=${show.imdbId}`);
            }}
            className={cn(
              "text-foreground/60 flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none",
              "hover:bg-foreground/5",
              "data-[selected=true]:bg-accent",
              "data-[selected=true]:text-accent-foreground",
              "data-[disabled=true]:pointer-events-none",
              "data-[disabled=true]:opacity-50",
              "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            )}
          >
            <Link
              href={`/ratings?id=${show.imdbId}`}
              className="flex w-full gap-2"
            >
              {/* Show Title + Years */}
              <div className="flex flex-1 flex-col">
                <span className="break-words">{show.title}&nbsp;</span>
                <span className="text-foreground/40 text-xs">
                  {formatYears(show)}
                </span>
              </div>
              {/* 1-10 Rating + Blue Star Icon */}
              <div className="flex shrink-0 items-center space-x-1 text-sm">
                <dt>
                  <span className="sr-only">Star rating</span>
                  <svg
                    className="text-sky-500"
                    width="16"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                  </svg>
                </dt>
                <dd>{`${show.rating.toFixed(1)} / 10.0`}</dd>
              </div>
            </Link>
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
}
