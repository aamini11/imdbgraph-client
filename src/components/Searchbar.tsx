"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatYears, Show } from "@/models/Show";

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 * https://nextui.org/docs/components/autocomplete#asynchronous-filtering
 */
export default function SearchBar() {
    const ref = useRef<HTMLInputElement | null>(null);
    const [query, setQuery] = useState("");
    const { suggestions, isLoading } = useSuggestions(query);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();

    return (
        <Autocomplete
            onFocus={(e) => e.preventDefault()}
            ref={ref}
            isClearable={false}
            onClick={() => ref.current?.focus()}
            onInputChange={(text) => setQuery(text)}
            isDisabled={isRedirecting}
            onSelectionChange={(imdbId) => {
                setIsRedirecting(true);
                router.push(`/ratings/${encodeURIComponent(imdbId)}`);
            }}
            classNames={{
                listboxWrapper: "max-h-[320px]",
                selectorButton: "text-default-500",
            }}
            isLoading={isLoading || isRedirecting}
            items={suggestions}
            inputProps={{
                classNames: {
                    input: "ml-1",
                    inputWrapper: "h-[48px]",
                },
            }}
            listboxProps={{
                hideSelectedIcon: true,
                itemClasses: {
                    base: [
                        "rounded-medium",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[hover=true]:bg-default-200",
                        "data-[selectable=true]:focus:bg-default-100",
                        "data-[focus-visible=true]:ring-default-500",
                    ],
                },
            }}
            aria-label="Search for any TV show"
            placeholder="Search for any TV show..."
            popoverProps={{
                offset: 10,
                classNames: {
                    base: "rounded-large",
                    content: "p-1 border-small border-default-100 bg-background",
                },
            }}
            startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />}
            radius="full"
            variant="bordered"
        >
            {(item) => (
                <AutocompleteItem key={item.imdbId} textValue={item.title}>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                                <span className="text-small">{item.title}</span>
                                <span> </span>
                                <span className="text-tiny text-default-400">{formatYears(item)}</span>
                            </div>
                        </div>
                    </div>
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
}

const SearchIcon = ({
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

function useSuggestions(query: string) {
    const [suggestions, setSuggestions] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchSuggestions(query: string) {
        try {
            const controller = new AbortController();
            const { signal } = controller;
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const shows = (await response.json()) as Show[];
            setSuggestions(shows);
        } finally {
            setIsLoading(false);
        }
    }

    const debouncedFetchSuggestions = useMemo(() => debounce(fetchSuggestions, 100), []);
    useEffect(() => {
        if (query) {
            setIsLoading(true);
            void debouncedFetchSuggestions(query);
        } else {
            setIsLoading(false);
            setSuggestions([]);
        }
    }, [debouncedFetchSuggestions, query]);

    return { suggestions, isLoading };
}
