import {debounce} from "lodash"
import Link from 'next/link'
import {useRouter} from "next/router";
import {FormEvent, KeyboardEvent, useMemo, useState} from 'react'
import {Show} from "../models/Show";

const DROPDOWN_SIZE_LIMIT = 5;

export default function Searchbar() {
    const router = useRouter();
    
    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState<Show[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    function handleKeyDown(e: KeyboardEvent) {        
        const dropdownSize = Math.min(suggestions.length, DROPDOWN_SIZE_LIMIT);
        if (e.key == "ArrowUp" || e.key == "ArrowDown") {
            e.preventDefault();

            let newSelected;
            if (selected == null) {
                newSelected = e.key == "ArrowDown" ? 0 : dropdownSize - 1;
                setSelected(newSelected);
            } else if ((selected === 0 && e.key === "ArrowUp") || (selected === dropdownSize - 1 && e.key === "ArrowDown")) {
                newSelected = null;
                setSelected(newSelected);
            } else {
                const dir = e.key === "ArrowDown" ? 1 : -1;
                newSelected = selected + dir;
                setSelected(newSelected);
            }

            if (newSelected !== null) {
                setText("" ? text : suggestions[newSelected].title);
            }
        }
    }

    const fetchSuggestions = useMemo(() => debounce(async (query: string) => {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const suggestions = await response.json();
        setSuggestions(suggestions);
    }, 300), []);

    const onInput = (input: string) => {
        setSelected(null);
        setText(input);
        
        if (isEmpty(input)) {
            setSuggestions([]);
        } else {
            fetchSuggestions(input);
        }
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEmpty(text)) {
            return;
        }

        setText("");
        if (selected !== null) { // Go directly to selected dropdown option
            const show = suggestions[selected];
            await router.push({
                pathname: `/ratings/${encodeURIComponent(show.imdbId)}`
            });
        } else { // Do a search with whatever query is in the search box
            await router.push({
                pathname: "/search",
                query: {"q": text}
            });
        }
    }

    return (
        <div className="relative text-base w-full">
            <form className="flex flex-row p-1 bg-white border-gray-500 border rounded-md transition duration-300 focus-within:border-blue-300" 
                  onSubmit={onSubmit}
            >
                <input className="flex-grow border-none px-2 focus:outline-none"
                       type="text"
                       placeholder="Search for any TV show..."
                       value={text}
                       onInput={e => onInput(e.currentTarget.value)}
                       onFocus={() => setIsFocused(true)}
                       onBlur={() => {
                           setIsFocused(false);
                           setSelected(null);
                       }}
                       onKeyDown={handleKeyDown}
                />
                <button className="pr-2" type="submit">
                    <SearchIcon/>
                </button>
            </form>
            {isFocused && text.length > 0 && suggestions.length > 0 && <DropDown suggestions={suggestions} activeOption={selected}/>}
        </div>
    );
}

function SearchIcon() {
    return (
        <svg
            width={24}
            height={24}
            className="transition hover:fill-blue-500"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Search Icon</title>
            <path
                d="m21.172 24-7.387-7.387A8.945 8.945 0 0 1 9 18c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9a8.951 8.951 0 0 1-1.387 4.785L24 21.172 21.172 24zM9 16c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"
            />
        </svg>
    );
}

function DropDown(props: { suggestions: Show[], activeOption: number | null}) {
    return (
        <ul className="w-full bg-white absolute z-[1] border-gray-500 border"
            onMouseDown={e => e.preventDefault()}
        >
            {props.suggestions.slice(0, DROPDOWN_SIZE_LIMIT).map((show, i) =>
                <DropDownOption key={show.imdbId} show={show} isSelected={i === props.activeOption}/>
            )}
        </ul>
    );
}

function DropDownOption(props: { show: Show, isSelected: boolean }) {
    return (
        <Link href={`/ratings/${encodeURIComponent(props.show.imdbId)}`} passHref>
            <li className={`text-left px-2 p-1 hover:bg-gray-100 select-none hover:cursor-pointer ${props.isSelected ? "bg-gray-100" : ""}`}>
                <a>{props.show.title}</a>
            </li>
        </Link>
    );
}

function isEmpty(s: string) {
    return !s || !/\S/.test(s);
}