"use client";

import { Input, Listbox, ListboxItem, ScrollShadow, Spinner } from "@nextui-org/react";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/Icons";
import { formatYears, Show } from "@/models/Show";

export const DROPDOWN_SIZE_LIMIT = 5;

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export function OldSearchbar() {
    const router = useRouter();

    const [text, setText] = useState("");
    const { suggestions, isLoading } = useSuggestions(text);
    const [isFocused, setIsFocused] = useState(false);
    const [selected, setSelected] = useState<number>();
    const selectedShow = selected !== undefined ? suggestions[selected] : undefined;

    const isDropdownVisible = isFocused && text.length > 0 && suggestions.length > 0;

    const blur = () => {
        setSelected(undefined);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

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

        if (selectedShow === undefined) {
            goToSearchPage(text);
        } else {
            goToRatingsPage(selectedShow.imdbId);
        }
    };

    const goToSearchPage = (q: string) => {
        blur();
        router.push(`/search?q=${q}`);
    };

    const goToRatingsPage = (imdbId: string) => {
        blur();
        router.push(`/ratings/${encodeURIComponent(imdbId)}`);
    };

    return (
        <form
            role="search"
            onSubmit={(e) => {
                onFormSubmit();
                e.preventDefault();
            }}
        >
            <Input
                variant="bordered"
                radius="full"
                id="search-bar"
                type="text"
                role="combobox"
                aria-label="TV Show"
                aria-controls="tv-search-dropdown"
                aria-autocomplete="list"
                aria-expanded={isDropdownVisible}
                aria-activedescendant={selectedShow?.imdbId ?? ""}
                placeholder="Search for any TV show..."
                value={!selectedShow ? text : selectedShow.title}
                onChange={(e) => onUserTyping(e.currentTarget.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    setSelected(undefined);
                }}
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
                endContent={isLoading && <Spinner color="default" size="sm" />}
            />
            {isDropdownVisible && (
                <DropDown suggestions={suggestions} selectedShow={selectedShow} goToRatingsPage={goToRatingsPage} />
            )}
        </form>
    );
}

function DropDown(props: {
    suggestions: Show[];
    selectedShow?: { imdbId: string };
    goToRatingsPage: (imdbId: string) => void;
}) {
    const { suggestions, selectedShow } = props;
    return (
        <div className="rounded-large p-1 border-small border-default-100 bg-background">
            <ScrollShadow hideScrollBar className="max-h-[320px] mt-30">
                <Listbox
                    label="suggestions"
                    items={suggestions}
                    itemClasses={{
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
                    }}
                    // className="rounded-large p-1 border-small border-default-100 bg-background"
                    role="listbox"
                    id="tv-search-dropdown"
                    selectedKeys={selectedShow?.imdbId === undefined ? [] : [selectedShow.imdbId]}
                    // aria-activedescendant={selectedShow?.imdbId}
                    onMouseDown={(e) => {
                        // Prevent dropdown option clicks from triggering the onMouseDown of parent
                        e.preventDefault();
                    }}
                >
                    {(show) => (
                        <ListboxItem key={show.imdbId} textValue={show.title}>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col">
                                        <span className="text-small">{show.title}&nbsp;</span>
                                        <span className="text-tiny text-default-400">{formatYears(show)}</span>
                                    </div>
                                </div>
                            </div>
                        </ListboxItem>
                    )}
                </Listbox>
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
