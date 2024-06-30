"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon } from "@/components/Icons";
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
            ref={ref}
            isClearable={false}
            menuTrigger={"input"}
            inputValue={query}
            onOpenChange={(isOpen) => isOpen && ref.current?.focus()}
            onClick={() => ref.current?.focus()}
            allowsCustomValue={true}
            allowsEmptyCollection={false}
            onInputChange={(text) => setQuery(text)}
            isDisabled={isRedirecting}
            onSelectionChange={(imdbId): void => {
                setIsRedirecting(true);
                router.push(`/ratings/${encodeURIComponent(imdbId ?? "")}`);
            }}
            classNames={{
                listboxWrapper: "max-h-[320px]",
                selectorButton: "text-default-500",
            }}
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
            popoverProps={{
                offset: 10,
                classNames: {
                    base: "rounded-large",
                    content: "p-1 border-small border-default-100 bg-background",
                },
            }}
            isLoading={isLoading || isRedirecting}
            items={suggestions}
            aria-label="Search for any TV show"
            placeholder="Search for any TV show..."
            startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />}
            radius="full"
            variant="bordered"
        >
            {(item) => (
                <AutocompleteItem key={item.imdbId} textValue={item.title}>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                                <span className="text-small">{item.title}&nbsp;</span>
                                <span className="text-tiny text-default-400">{formatYears(item)}</span>
                            </div>
                        </div>
                    </div>
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
}

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
