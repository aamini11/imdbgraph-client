import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Show } from "../models/Show";

const DROPDOWN_SIZE_LIMIT = 5;

type SearchCallback = (show?: Show) => void;

export default function Searchbar() {
    const router = useRouter();

    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState<Show[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    const isDropdownVisible = isFocused && text.length > 0 && suggestions.length > 0;

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
            newSelected = null;
            setSelected(newSelected);
        } else {
            newSelected = direction === "ArrowDown" ? selected + 1 : selected - 1;
            setSelected(newSelected);
        }

        if (newSelected !== null) {
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
        []
    );

    const onUserTyping = (input: string) => {
        setSelected(null);
        setText(input);

        if (isEmpty(input)) {
            setSuggestions([]);
        } else {
            void fetchSuggestions(input);
        }
    };

    function onSubmitSearch(show?: Show) {
        const goToShowRatings = (show: Show) =>
            void router.push({
                pathname: `/ratings/${encodeURIComponent(show.imdbId)}`,
            });

        if (isEmpty(text)) {
            return;
        }

        setText("");
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (show) {
            goToShowRatings(show);
        } else if (selected !== null) {
            // If show selected in dropdown, go directly to selected dropdown option
            goToShowRatings(suggestions[selected]);
        } else {
            // Do a search with whatever query is in the search box
            void router.push({
                pathname: "/search",
                query: { q: text },
            });
        }
    }

    return (
        <div className="relative text-base w-full">
            <form
                className="flex flex-row p-1 bg-white border-gray-500 border rounded-md transition duration-300 focus-within:border-blue-300"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitSearch();
                }}
            >
                <input
                    className="flex-grow border-none px-2 focus:outline-none"
                    type="text"
                    placeholder="Search for any TV show..."
                    value={text}
                    onInput={(e) => onUserTyping(e.currentTarget.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        setSelected(null);
                    }}
                    onKeyDown={(e) => {
                        if (e.key == "ArrowUp" || e.key == "ArrowDown") {
                            e.preventDefault();
                            navigateDropdown(e.key);
                        }
                    }}
                />
                <button className="pr-2" type="submit">
                    <SearchIcon />
                </button>
            </form>
            {isDropdownVisible && (
                <DropDown suggestions={suggestions} activeOption={selected} onSubmitSearch={onSubmitSearch} />
            )}
        </div>
    );
}

function SearchIcon() {
    return (
        <svg width={24} height={24} className="transition hover:fill-blue-500" xmlns="http://www.w3.org/2000/svg">
            <title>Search Icon</title>
            <path d="m21.172 24-7.387-7.387A8.945 8.945 0 0 1 9 18c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9a8.951 8.951 0 0 1-1.387 4.785L24 21.172 21.172 24zM9 16c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
        </svg>
    );
}

function DropDown(props: { suggestions: Show[]; activeOption: number | null; onSubmitSearch: SearchCallback }) {
    return (
        <ul className="w-full bg-white absolute z-[1] border-gray-500 border" onMouseDown={(e) => e.preventDefault()}>
            {props.suggestions.slice(0, DROPDOWN_SIZE_LIMIT).map((show, i) => (
                <DropDownOption
                    key={show.imdbId}
                    show={show}
                    isSelected={i === props.activeOption}
                    onSubmitSearch={props.onSubmitSearch}
                />
            ))}
        </ul>
    );
}

function DropDownOption(props: { show: Show; isSelected: boolean; onSubmitSearch: SearchCallback }) {
    return (
        <li
            onClick={() => props.onSubmitSearch(props.show)}
            className={`text-left px-2 p-1 hover:bg-gray-100 select-none hover:cursor-pointer ${
                props.isSelected ? "bg-gray-100" : ""
            }`}
        >
            <a>{props.show.title}</a>
        </li>
    );
}

function isEmpty(s: string) {
    return !s || !/\S/.test(s);
}