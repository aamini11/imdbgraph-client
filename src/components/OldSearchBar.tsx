"use client";

import { Input, ScrollShadow, Spinner } from "@nextui-org/react";
import { clsx } from "@nextui-org/shared-utils";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/Icons";
import { formatYears, Show } from "@/models/Show";

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function Searchbar() {
    const router = useRouter();

    const [text, setText] = useState("");
    const { suggestions, isLoading } = useSuggestions(text);
    const [isFocused, setIsFocused] = useState(false);
    const [selected, setSelected] = useState<number>();
    const selectedShow = selected !== undefined ? suggestions[selected] : undefined;
    const [isRedirecting, setIsRedirecting] = useState(false);

    const isDropdownVisible = isFocused && text.length > 0 && suggestions.length > 0;

    function navigateDropdown(direction: "ArrowUp" | "ArrowDown") {
        if (!isDropdownVisible) {
            return;
        }

        const dropdownSize = suggestions.length;

        let newSelected;
        if (selected == null) {
            newSelected = direction == "ArrowDown" ? 0 : dropdownSize - 1;
            setSelected(newSelected);
        } else if (
            (selected === 0 && direction === "ArrowUp") ||
            (selected === dropdownSize - 1 && direction === "ArrowDown")
        ) {
            newSelected = undefined;
            setSelected(newSelected);
        } else {
            newSelected = direction === "ArrowDown" ? selected + 1 : selected - 1;
            setSelected(newSelected);
        }
    }

    const onUserTyping = (input: string) => {
        setSelected(undefined);
        setText(input);
    };

    const onFormSubmit = () => {
        if (isEmpty(text)) {
            return;
        }

        setIsRedirecting(true);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        if (selectedShow === undefined) {
            // Go to search page
            router.push(`/search?q=${text}`);
        } else {
            // Go to ratings page
            goToRatingsPage(selectedShow.imdbId);
        }
    };

    const goToRatingsPage = (imdbId: string) => {
        router.push(`/ratings/${encodeURIComponent(imdbId)}`);
    };

    return (
        <form
            role="search"
            className="relative w-full"
            onSubmit={(e) => {
                onFormSubmit();
                e.preventDefault();
            }}
        >
            <Input
                autoComplete="off"
                variant="bordered"
                radius="full"
                id="search-bar"
                type="text"
                role="combobox"
                aria-label="TV Show"
                aria-owns="tv-search-dropdown"
                aria-autocomplete="list"
                aria-expanded={isDropdownVisible}
                aria-activedescendant={selectedShow?.imdbId ?? ""}
                placeholder="Search for any TV show..."
                value={!selectedShow ? text : selectedShow.title}
                onChange={(e) => onUserTyping(e.currentTarget.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
                        e.preventDefault();
                        navigateDropdown(e.key);
                    }
                }}
                classNames={{
                    input: "ml-1",
                    inputWrapper: "h-[48px]",
                }}
                startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />}
                endContent={(isLoading || isRedirecting) && <Spinner color="default" size="sm" />}
                disabled={isRedirecting}
            />
            <div id="search-suggestions">
                {isDropdownVisible && <DropDown suggestions={suggestions} selectedShow={selectedShow} />}
            </div>
        </form>
    );
}

function DropDown(props: { suggestions: Show[]; selectedShow?: { imdbId: string } }) {
    const { suggestions, selectedShow } = props;
    return (
        <div
            role="listbox"
            className="rounded-large p-1 border-small border-default-100 bg-background mt-2 absolute w-full"
        >
            <ScrollShadow hideScrollBar className="max-h-[320px]">
                <ul id="tv-search-dropdown">
                    {suggestions.map((show) => (
                        <li
                            key={show.imdbId}
                            className={clsx(
                                "rounded-medium",
                                "text-default-500",
                                "transition-opacity",
                                { "bg-default-50 text-foreground": show.imdbId === selectedShow?.imdbId },

                                "hover:text-foreground",
                                "hover:bg-default-200",
                                "dark:hover:bg-default-50",

                                "flex gap-2 items-center justify-between px-2 py-1.5 w-full h-full",
                                "subpixel-antialiased cursor-pointer tap-highlight-transparent hover:transition-colors",

                                // "data-[pressed=true]:opacity-70",
                                // "data-[selectable=true]:focus:bg-default-100",
                                // "data-[focus-visible=true]:ring-default-500",
                            )}
                            // textValue={show.title}
                        >
                            <Link
                                tabIndex={-1}
                                href={{ pathname: `/ratings/tt0417299` }}
                                className="flex justify-between items-center"
                            >
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-small">{show.title}&nbsp;</span>
                                        <span className="text-tiny text-default-400">{formatYears(show)}</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </ScrollShadow>
        </div>
    );
}

function isEmpty(s: string) {
    return !s || !/\S/.test(s);
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
