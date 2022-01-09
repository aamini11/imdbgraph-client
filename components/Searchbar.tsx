import React, {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './Searchbar.module.css'

export default function Searchbar() {
    const [text, setText] = useState("");

    const dropDownContent = (
        <ul className={styles.dropDown}>
            <DropDownOption text="abc1"/>
            <DropDownOption text="abc2"/>
            <DropDownOption text="abc3"/>
            <DropDownOption text="abc4"/>
            <DropDownOption text="abc5"/>
        </ul>
    )

    return (
        <div className={styles.container}>
            <form className={styles.searchBar}>
                <input className={styles.searchText}
                       type="text"
                       placeholder="Search..."
                       value={text} onInput={e => setText(e.currentTarget.value)}
                />
                <button className={styles.searchButton}>
                    <Image src="/search.svg" alt="Search Icon"
                           width="20" height="20"/>
                </button>
            </form>
            {text ? dropDownContent : null}
        </div>
    )
}

function DropDownOption(props: {text: string, key?: number}) {
    return (
        <Link href={`/search?q=${props.text}`} passHref>
            <li className="text-left p-1 hover:bg-gray-100">
                <a>{props.text}</a>
            </li>
        </Link>
    )
}