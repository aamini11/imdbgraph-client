import {useRouter} from "next/router";
import React, {FormEvent, useCallback, useMemo, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './Searchbar.module.css'
import {Show} from "../models/Show";
import {debounce} from "lodash"

export default function Searchbar() {
    const router = useRouter()
    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState<Show[]>([]);

    const handler = useMemo(() => debounce(async (query) => {
        if (!query || !/\S/.test(query)) {
            setSuggestions([]);
        } else {
            const response = await fetch(`http://localhost:3000/api/search?q=${query}`)
            const suggestions = await response.json();
            setSuggestions(suggestions);
        }
    }, 300), []);

    const onChange = (query: string) => {
        setText(query);
        handler(query);
    }

    return (
        <div className={styles.container}>
            <form className={styles.searchBar} onSubmit={() => router.push({pathname: "/search", query: {"q": "abc"}})}>
                <input className={styles.searchText}
                       type="text"
                       placeholder="Search..."
                       value={text} onInput={e => onChange(e.currentTarget.value)}
                />
                <button className={styles.searchButton} type="submit">
                    <Image src="/search.svg" alt="Search Icon"
                           width="20" height="20"/>
                </button>
            </form>
            {text.length > 0 && suggestions.length > 0 ? <DropDown suggestions={suggestions}/> : null}
        </div>
    )
}

function DropDown(props: {suggestions: Show[]}) {
    // const options = props.suggestions.map(suggestion=> <DropDownOption key="" text={suggestion}/>);
    const allDropDownOptions = props.suggestions.map(show => <DropDownOption key={show.imdbId} show={show}/>);
    console.log(props.suggestions);
    return (
        <ul className={styles.dropDown}>
            {allDropDownOptions.slice(0, 5)}
        </ul>
    )
}

function DropDownOption(props: {show: Show}) {
    return (
        <Link href={`/ratings/${props.show.imdbId}`} passHref>
            <li className="text-left p-1 hover:bg-gray-100">
                <a>{props.show.title}</a>
            </li>
        </Link>
    )
}