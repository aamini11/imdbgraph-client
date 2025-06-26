"use client";

import { formatYears, Show } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { TRANSITION_VARIANTS } from "@heroui/framer-utils";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Spinner } from "@heroui/spinner";
import { useCombobox, UseComboboxReturnValue } from "downshift";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useMemo, useState } from "react";
import { z } from "zod";

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

  useEffect(() => {
    return () => setIsRedirecting(false);
  }, []);

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
    onSelectedItemChange: ({ selectedItem: show }) => {
      if (isEmpty(text)) {
        return;
      }

      if (show) {
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
      }
    },
    itemToString: (show) => show?.title ?? "",
  });

  const { isOpen, getInputProps, getMenuProps } = comboBoxProps;
  return (
    <div className="relative w-full">
      <Input
        variant="bordered"
        radius="full"
        type="text"
        placeholder="Search for any TV show..."
        onValueChange={(inputValue: string) => {
          setText(inputValue);
          if (!isEmpty(inputValue)) {
            setIsLoading(true);
            void handleNewQuery(inputValue);
          }
        }}
        classNames={{
          // Reason for text-base. (Auto-zoom on safari. Input text size must be >16px)
          // https://stackoverflow.com/q/2989263
          input: "ml-1 text-base",
          inputWrapper: "h-[48px]",
        }}
        startContent={
          <SearchIcon
            className="text-default-400"
            strokeWidth={2.5}
            size={20}
          />
        }
        endContent={
          (isLoading || isRedirecting) && <Spinner color="default" size="sm" />
        }
        disabled={isRedirecting}
        {...getInputProps()}
      />
      <div {...getMenuProps()} className="absolute z-10 w-full overflow-clip">
        <AnimatePresence>
          {isOpen &&
            text.length > 0 &&
            (!isLoading || suggestions.length > 0) && (
              <motion.div
                animate="enter"
                exit="exit"
                initial="exit"
                variants={TRANSITION_VARIANTS.fade}
              >
                <DropDown
                  suggestions={suggestions}
                  comboBoxProps={comboBoxProps}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DropDown({
  suggestions,
  comboBoxProps,
}: {
  suggestions: Show[];
  comboBoxProps: UseComboboxReturnValue<Show>;
}) {
  const { highlightedIndex, getItemProps } = comboBoxProps;

  const rating = (show: Show) => (
    <div className="flex shrink-0 items-center space-x-1 pl-2 text-sm">
      <dt className="text-sky-500">
        <span className="sr-only">Star rating</span>
        <svg width="16" height="20" fill="currentColor">
          <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
        </svg>
      </dt>
      <dd>{`${show.rating.toFixed(1)} / 10.0`}</dd>
    </div>
  );

  const listItems = suggestions.map((show, index) => (
    <li
      key={show.imdbId}
      className={cn(
        "flex h-full w-full items-center justify-between gap-2 px-2 py-1.5",
        "rounded-medium text-default-500 transition-opacity",
        "tap-highlight-transparent cursor-pointer subpixel-antialiased hover:transition-colors",
        {
          "bg-default-200 dark:bg-default-50 text-foreground":
            index === highlightedIndex,
        },
        "hover:bg-default-200 hover:text-foreground",
        "dark:hover:bg-default-50",
      )}
      {...getItemProps({ item: show, index })}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <span className="text-small break-words">{show.title}&nbsp;</span>
          <span className="text-tiny text-default-400">
            {formatYears(show)}
          </span>
        </div>
        {rating(show)}
      </div>
    </li>
  ));

  return (
    <div className="rounded-large border-small border-default-400 dark:border-default-100 bg-background mt-2 p-2">
      <ScrollShadow className="max-h-[320px]">
        <ul id="tv-search-dropdown">
          {suggestions.length > 0 ? (
            listItems
          ) : (
            <li className="text-small text-default-400 pl-2">
              No TV Shows found
            </li>
          )}
        </ul>
      </ScrollShadow>
    </div>
  );
}

function isEmpty(s: string) {
  return !s || !/\S/.test(s);
}

const fetchSuggestions = async (query: string): Promise<Show[]> => {
  const response = await fetch(`/api/search?q=${query}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  let show;
  try {
    show = await response.json();
    return show;
  } catch (error) {
    // Just return faulty data but log the error at least.
    if (error instanceof z.ZodError) {
      console.error(`Failed to parse show data for: ${show.imdbId}`, error);
      return show as Show[];
    } else {
      throw error;
    }
  }
};

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  className,
}: {
  size: number;
  strokeWidth: number;
  className: string;
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size}
    role="presentation"
    viewBox="0 0 24 24"
    width={size}
    className={className}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
