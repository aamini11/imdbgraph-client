import {debounce} from "lodash"
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from "next/router";
import React, {useMemo, useState} from 'react'
import {Show} from "../models/Show";

import styles from './Searchbar.module.css'

export default function Searchbar() {
    const router = useRouter();
    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState<Show[]>([]);

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
                       value={text} onInput={e => onChange(e.currentTarget.value)}
                />
                <button className={styles.searchButton} type="submit">
                    <Image src="/search.svg" alt="Search Icon"
                           width="20" height="20"/>
                </button>
            </form>
            {text.length > 0 && suggestions.length > 0 ? <DropDown suggestions={suggestions}/> : null}
        </div>
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