"use client";

import { Input } from "./ui/input";
import { Show, formatYears } from "@/lib/data/show";
import { fetchSuggestions } from "@/lib/data/suggestions";
import { cn, isEmpty } from "@/lib/utils";
import { useCombobox } from "downshift";
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

const DROPDOWN_LIMIT = 5;

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function SearchBar() {
  const router = useRouter();

  const [isRedirecting, setIsRedirecting] = useState(false);
  // const { isPending, isError, data, error } = useQuery({
  //   queryKey: ['suggestions'],
  //   queryFn: () => fetchSuggestions(input),
  // })
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Show[]>([]);

  // Optimize page navigation by prefetching the ratings page
  useEffect(() => {
    router.prefetch("/ratings");
  }, [router]);

  const handleNewQuery = useMemo(
    () =>
      debounce(async (x: string) => {
        try {
          const suggestions = await fetchSuggestions(x);
          setSuggestions(suggestions.slice(0, DROPDOWN_LIMIT));
        } finally {
          setIsLoading(false);
        }
      }, 200),
    [],
  );

  const {
    isOpen,
    inputValue,
    highlightedIndex,
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
  } = useCombobox({
    items: suggestions,
    itemToString: (show) => show?.title ?? "",
    onInputValueChange: ({ inputValue }) => {
      if (!isEmpty(inputValue)) {
        setIsLoading(true);
        void handleNewQuery(inputValue);
      } else {
        setSuggestions([]);
        setIsLoading(false);
      }
    },
  });

  const shouldShowDropdown = isOpen && inputValue.length > 0 && !isLoading;
  return (
    <div className="relative w-full">
      {/* Searchbar */}
      <div className="relative">
        <label className="sr-only" {...getLabelProps()}>
          TV Show Search Bar
        </label>
        <Input
          type="text"
          disabled={isRedirecting}
          placeholder="Search for any TV show..."
          className="placeholder:text-base border-2 rounded-full h-11 px-5 py-4"
          {...getInputProps()}
        />
        {/* Loading Indicator */}
        {isLoading && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <SpinnerIcon className="animate-spin h-5 w-5 text-gray-400" />
          </div>
        )}
        {/* Status for screen readers */}
        <div className="sr-only" aria-live="polite">
          {isLoading ? "Loading suggestions" : ""}
        </div>
      </div>
      {/* Dropdown Menu */}
      <ul
        id="tv-search-dropdown"
        className={cn("rounded-xl p-2 border mt-2 w-full", {
          hidden: !shouldShowDropdown,
        })}
        {...getMenuProps()}
      >
        {suggestions.length === 0 && !isLoading ? (
          <li className="text-sm px-2 py-1.5 text-foreground/60">
            No shows found
          </li>
        ) : (
          suggestions.map((show, index) => (
            <li key={show.imdbId} {...getItemProps({ item: show, index })}>
              <Link
                href={`/ratings?id=${show.imdbId}`}
                className={cn(
                  "text-sm flex w-full items-center justify-between text-foreground/60 px-2 py-1.5 rounded-md",
                  "hover:bg-foreground/5",
                  {
                    "bg-foreground/5": index === highlightedIndex,
                  },
                )}
                prefetch={false} // Prefetch is already handled in useEffect
                onNavigate={() => {
                  setIsRedirecting(true);
                  if (!isEmpty(inputValue)) {
                    void handleNewQuery(inputValue);
                  }
                }}
              >
                {/* Show Title + Years */}
                <div className="flex flex-col">
                  <span className="break-words">{show.title}&nbsp;</span>
                  <span className="text-foreground/40 text-xs">
                    {formatYears(show)}
                  </span>
                </div>
                {/* 1-10 Rating + Blue Star Icon */}
                <div className="shrink-0 flex items-center space-x-1 text-sm pl-2">
                  <StarIcon />
                  <dd>{`${show.showRating.toFixed(1)} / 10.0`}</dd>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
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

// Spinner icon for loading state
const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
