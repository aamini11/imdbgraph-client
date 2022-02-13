import {debounce} from "lodash"
import Link from 'next/link'
import {useRouter} from "next/router";
import React, {useMemo, useState} from 'react'
import {Show} from "../models/Show";

import styles from './Searchbar.module.css'

export default function Searchbar() {
    const router = useRouter();
    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState<Show[]>([]);
    const [isFocused, setIsFocused] = React.useState(false);

    const fetchSuggestions = useMemo(() => debounce(async (query) => {
        if (!query || !/\S/.test(query)) {
            setSuggestions([]);
        } else {
            const response = await fetch(`api/search?q=${query}`)
            const suggestions = await response.json();
            setSuggestions(suggestions);
        }
    }, 300), []);

    const onChange = (input: string) => {
        setText(input);
        fetchSuggestions(input);
    }

    return (
        <div className={styles.container}>
            <form className={styles.searchBar} onSubmit={async e => {
                e.preventDefault();
                await router.push({
                        pathname: "/search",
                        query: {"q": text}
                    }
                );
                setText("");
            }}>
                <input className={styles.searchText}
                       type="text"
                       placeholder="Search for any TV show..."
                       value={text}
                       onInput={e => onChange(e.currentTarget.value)}
                       onFocus={() => setIsFocused(true)}
                       onBlur={() => setIsFocused(false)}
                />
                <button className={styles.searchButton} type="submit">
                    <SearchIcon/>
                </button>
            </form>
            {isFocused && text.length > 0 && suggestions.length > 0 && <DropDown suggestions={suggestions}/>}
        </div>
    );
}

function SearchIcon() {
    return (
        <svg
            width={24}
            height={24}
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Search Icon</title>
            <path
                d="m21.172 24-7.387-7.387A8.945 8.945 0 0 1 9 18c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9a8.951 8.951 0 0 1-1.387 4.785L24 21.172 21.172 24zM9 16c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"
            />
        </svg>
    );
}

function DropDown(props: {suggestions: Show[]}) {
    // const options = props.suggestions.map(suggestion=> <DropDownOption key="" text={suggestion}/>);
    const allDropDownOptions = props.suggestions.map(show => <DropDownOption key={show.imdbId} show={show}/>);
    console.log(props.suggestions);
    return (
        <ul className={styles.dropDown}>
            {allDropDownOptions.slice(0, 5)}
        </ul>
    );
}

function DropDownOption(props: {show: Show}) {
    return (
        <Link href={`/ratings/${props.show.imdbId}`} passHref>
            <li className="text-left p-1 hover:bg-gray-100">
                <a>{props.show.title}</a>
            </li>
        </Link>
    );
}