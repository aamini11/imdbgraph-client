"use client";

import { LoadingSpinner } from "@/components/icons";
import { fetchSuggestions } from "@/lib/data/suggestions";
import { formatYears } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
import { useState, useDeferredValue, useEffect } from "react";

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const deferredQuery = useDeferredValue(value);

  const { isLoading, data: searchResults } = useQuery({
    queryKey: ["suggestions", deferredQuery],
    queryFn: () => fetchSuggestions(deferredQuery),
    placeholderData: keepPreviousData,
  });

  // Optimize page navigation by prefetching the ratings page
  useEffect(() => {
    router.prefetch("/ratings");
  }, [router]);

  return (
    <search className="w-full">
      <Command
        className={cn(
          "bg-background text-popover-foreground flex h-full w-full flex-col text-sm",
          "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        )}
      >
        {/* Search Bar */}
        <div className="border-input flex items-center rounded-full border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            autoFocus
            value={value}
            onValueChange={setValue}
            className={cn(
              "placeholder:text-muted-foreground h-10 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
            )}
            placeholder="Search for any TV show..."
          />
          {isLoading && <LoadingSpinner />}
        </div>
        {/* Dropdown Menu */}
        <CommandList
          className={cn("mt-2 rounded-xl border p-2", {
            hidden: !value,
          })}
          id="tv-search-dropdown"
        >
          {!isLoading && (
            <CommandEmpty className="text-foreground/60 px-2 py-1.5 text-center">
              No TV Shows Found.
            </CommandEmpty>
          )}
          {searchResults?.map((show) => (
            <CommandItem
              value={show.imdbId}
              key={show.imdbId}
              className={cn(
                "text-foreground/60 hover:bg-foreground/5 flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none",
                "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
              )}
            >
              <Link href={`/ratings`} className="flex w-full gap-2">
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
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </search>
  );
}
