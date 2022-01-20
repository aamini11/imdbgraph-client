import {GetServerSidePropsContext} from "next";
import Head from "next/head";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import Searchbar from "../../components/Searchbar";
import {Show} from "../../models/Show";
import styles from "../../styles/Home.module.css";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch data from external API
    const response = await fetch(`http://localhost:8080/search?${context.query.id}`)
    if (response.ok) {
        const searchResults: Show[] = await response.json();
        return {props: {searchResults: searchResults}}
    } else {
        throw "Show not found";
    }
}

export default function Search(props: {searchResults: Show[]}) {
    return (
        <div className={styles.container}>
            <Head>
                <title>IMDB Graph</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <ul>{props.searchResults.map(show => <li key={show.imdbId}/>)}</ul>
            </main>
            <Footer/>
        </div>
    )
}