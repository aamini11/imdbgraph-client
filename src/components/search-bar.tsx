"use client";

import { Input } from "@/components/ui/input";
import { formatYears, Show } from "@/lib/data/show";
import { fetchSuggestions } from "@/lib/data/suggestions";
import { cn, isEmpty } from "@/lib/utils";
import { useCombobox } from "downshift";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useMemo, useState } from "react";

const DROPDOWN_LIMIT = 5;

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function SearchBar() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Show[]>([]);

  // Reset loading spinner when unmounting/navigating
  useEffect(() => {
    return () => setIsRedirecting(false);
  }, []);

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

  const comboBoxProps = useCombobox({
    items: suggestions,
    inputValue: text,
    itemToString: (show) => show?.title ?? "",
    onInputValueChange: ({ inputValue }) => {
      setText(inputValue);
      if (!isEmpty(inputValue)) {
        setIsLoading(true);
        void handleNewQuery(inputValue);
      }
    },
    onSelectedItemChange: ({ selectedItem: show }) => {
      if (isEmpty(text) || !show) {
        return;
      }

      setIsRedirecting(true);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Go to ratings page
      // https://buildui.com/posts/global-progress-in-nextjs#introduction
      startTransition(() => {
        setIsRedirecting(false);
        router.push(`/ratings?id=${show.imdbId}`);
      });
    },
    onHighlightedIndexChange: (e) => {
      const i = e.highlightedIndex;
      const selectedShow = suggestions[i]?.title;
      setText(selectedShow ?? text);
    },
  });

  const {
    isOpen,
    getLabelProps,
    getInputProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = comboBoxProps;

  const shouldShowDropdown = isOpen && text.length > 0 && !isLoading;
  return (
    <div className="relative w-full">
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
      {/* Dropdown Menu */}
      <ul
        className={cn("rounded-xl p-2 border mt-2 w-full", {
          hidden: !shouldShowDropdown,
        })}
        id="tv-search-dropdown"
        {...getMenuProps()}
      >
        {shouldShowDropdown &&
          (!suggestions.length ? (
            <li className="text-sm px-2 py-1.5">No TV Shows found</li>
          ) : (
            suggestions.map((show, index) => (
              <li
                key={show.imdbId}
                className={cn(
                  "text-sm text-foreground/60 px-2 py-1.5",
                  "flex gap-2 items-center justify-between cursor-pointer rounded-md",
                  "hover:bg-foreground/5",
                  {
                    "bg-foreground/5": index === highlightedIndex,
                  },
                )}
                {...getItemProps({ item: show, index })}
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
              </li>
            ))
          ))}
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
