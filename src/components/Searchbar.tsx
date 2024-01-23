"use client";

import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Show } from "@/models/Show";

export const DROPDOWN_SIZE_LIMIT = 5;

/**
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 */
export default function Searchbar() {
    const router = useRouter();

    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState<Show[]>([]);
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

        const dropdownSize = Math.min(suggestions.length, DROPDOWN_SIZE_LIMIT);

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

        if (newSelected !== undefined) {
            setText(suggestions[newSelected].title);
        }
    }

    const fetchSuggestions = useMemo(
        () =>
            debounce(async (query: string) => {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const suggestions: Show[] = (await response.json()) as Show[];
                setSuggestions(suggestions);
            }, 300),
        [],
    );

    const onUserTyping = (input: string) => {
        setSelected(undefined);
        setText(input);

        if (isEmpty(input)) {
            setSuggestions([]);
        } else {
            void fetchSuggestions(input);
        }
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
        <div className="relative text-base w-full">
            <form
                role="search"
                className="min-w-fit flex p-1 dark:bg-neutral-900 border-gray-400 border-2 rounded-xl transition duration-300 focus-within:border-blue-600"
                onSubmit={(e) => {
                    onFormSubmit();
                    e.preventDefault();
                }}
            >
                {/* Set border radius to 0 (rounded-none). Otherwise, safari on iphone thinks the input
                 * box should be rounded and causes the divider to look weird.
                 */}
                <input
                    id="search-bar"
                    type="text"
                    role="combobox"
                    aria-label="TV Show"
                    aria-controls="tv-search-dropdown"
                    aria-autocomplete="list"
                    aria-expanded={isDropdownVisible}
                    aria-activedescendant={selectedShow?.imdbId}
                    className="pr-2 bg-transparent rounded-none border-r border-black dark:border-white mr-4 flex-grow pl-2 focus:outline-none"
                    placeholder="Search for any TV show..."
                    value={text}
                    onInput={(e) => onUserTyping(e.currentTarget.value)}
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
                />
                <button
                    tabIndex={-1}
                    className="p-1"
                    type="submit"
                    aria-expanded={isDropdownVisible}
                    aria-controls="tv-search-dropdown"
                    aria-label="TV Show"
                >
                    <SearchIcon />
                </button>
            </form>
            {isDropdownVisible && (
                <DropDown suggestions={suggestions} selectedShow={selectedShow} goToRatingsPage={goToRatingsPage} />
            )}
        </div>
    );
}

function DropDown(props: {
    suggestions: Show[];
    selectedShow?: { imdbId: string };
    goToRatingsPage: (imdbId: string) => void;
}) {
    const { suggestions, selectedShow, goToRatingsPage } = props;
    return (
        <ul
            role="listbox"
            id="tv-search-dropdown"
            aria-activedescendant={selectedShow?.imdbId}
            className="mt-2 bg-white dark:bg-neutral-900 w-full absolute z-[1] border-gray-500 border"
            onMouseDown={(e) => {
                // Prevent dropdown option clicks from triggering the onMouseDown of parent
                e.preventDefault();
            }}
        >
            {suggestions.slice(0, DROPDOWN_SIZE_LIMIT).map((show) => {
                const isSelected = show === selectedShow;
                return (
                    <li
                        key={show.imdbId}
                        id={show.imdbId}
                        role="option"
                        aria-selected={isSelected}
                        aria-label="TV show suggestions"
                        onClick={() => goToRatingsPage(show.imdbId)}
                        className={`text-left px-2 p-1 select-none hover:cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-100 ${
                            isSelected ? "bg-gray-100 dark:bg-neutral-700 border-l-2 border-blue-700" : ""
                        }`}
                    >
                        {show.title}
                    </li>
                );
            })}
        </ul>
    );
}

function SearchIcon() {
    return (
        <svg
            width={24}
            height={24}
            className="dark:fill-white transition hover:fill-blue-600"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Search Icon</title>
            <path d="m21.172 24-7.387-7.387A8.945 8.945 0 0 1 9 18c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9a8.951 8.951 0 0 1-1.387 4.785L24 21.172 21.172 24zM9 16c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
        </svg>
    );
}

function isEmpty(s: string) {
    return !s || !/\S/.test(s);
}
