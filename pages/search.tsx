import {GetServerSidePropsContext} from "next";
import Head from "next/head";
import Image from "next/image";
import React, {ReactNode} from "react";
import Footer from "../components/Footer";
import {Show} from "../models/Show";
import image from "../public/movie.png"
import styles from "../styles/Home.module.css";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch data from external API
    const response = await fetch(`http://localhost:3000/api/search?q=${context.query.q}`)
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
                <ShowList shows={sampleMovies}/>
            </main>
            <Footer/>
        </div>
    )
}

function ShowList({shows}: {shows: Show[]}) {
    return (
        <div className="divide-y divide-slate-100">
            <Nav>
                <NavItem href="/new" isActive={true}>New Releases</NavItem>
                <NavItem href="/top" isActive={false}>Top Rated</NavItem>
                <NavItem href="/picks" isActive={false}>Vincent’s Picks</NavItem>
            </Nav>
            <List>
                {shows.map((movie) => (
                    <ListItem key={movie.imdbId} show={movie} />
                ))}
            </List>
        </div>
    )
}

function Nav({children}: {children: ReactNode}) {
    return (
        <nav className="py-4 px-6 text-sm font-medium">
            <ul className="flex space-x-3">
                {children}
            </ul>
        </nav>
    )
}

function NavItem(props: {href: string, isActive: boolean, children: ReactNode}) {
    return (
        <li>
            <a href={props.href}
               className={`block px-3 py-2 rounded-md ${props.isActive ? 'bg-sky-500 text-white' : 'bg-slate-50'}`}
            >
                {props.children}
            </a>
        </li>
    )
}

function List({children} : {children: ReactNode}) {
    return (
        <ul className="divide-y divide-slate-100">
            {children}
        </ul>
    )
}

function ListItem({show}: {show: Show}) {
    return (
        <article className="flex items-start space-x-6 p-6">
            {show.image !== undefined && <Image src={show.image} alt="" width="60" height="88" className="flex-none rounded-md bg-slate-100"/>}
            <div className="min-w-0 relative flex-auto">
                <h2 className="font-semibold text-slate-900 truncate pr-20">{show.title}</h2>
                <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
                    <div className="absolute top-0 right-0 flex items-center space-x-1">
                        <dt className="text-sky-500">
                            <span className="sr-only">Star rating</span>
                            <svg width="16" height="20" fill="currentColor">
                                <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                            </svg>
                        </dt>
                        <dd>{show.showRating}</dd>
                    </div>
                    <div>
                        <dt className="sr-only">Rating</dt>
                        <dd className="px-1.5 ring-1 ring-slate-200 rounded">{show.rating}</dd>
                    </div>
                    <div className="ml-2">
                        <dt className="sr-only">Year</dt>
                        <dd>{show.startYear}</dd>
                    </div>
                    <div>
                        <dt className="sr-only">Genre</dt>
                        <dd className="flex items-center">
                            <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            {show.genre}
                        </dd>
                    </div>
                    <div>
                        <dt className="sr-only">Runtime</dt>
                        <dd className="flex items-center">
                            <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            {show.runtime}
                        </dd>
                    </div>
                    <div className="flex-none w-full mt-2 font-normal">
                        <dt className="sr-only">Cast</dt>
                        <dd className="text-slate-400">{show.cast}</dd>
                    </div>
                </dl>
            </div>
        </article>
    )
}

const sampleMovies: Show[] = [
    {
        imdbId: "100",
        title: "Title",
        image: image,
        startYear: "2008",
        runtime: "1h5m",
        rating: "PG-13",

        showRating: 5,
        numVotes: 10,

        cast: "Cast",
        genre: "Action",
    },
    {
        imdbId: "101",
        title: "Title",
        image: image,
        startYear: "2008",
        runtime: "1h5m",
        numVotes: 10,

        rating: "R",
        showRating: 5,

        cast: "Cast",
        genre: "Action",
    }
];