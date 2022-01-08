import React from 'react'
import Image from 'next/image'
import styles from './Searchbar.module.css'

export default function Searchbar() {
    return (
        <form className={styles.root}>
            <input className={styles.searchBar}
                   type="text"
                   placeholder="Search..."/>
            <button className={styles.searchButton}>
                <Image src="/search.svg" alt="Search Icon"
                       width="20" height="20"/>
            </button>
        </form>
    )
}