import Highcharts, {PointOptionsObject, SeriesSplineOptions} from 'highcharts'
import {GetServerSidePropsContext} from "next";
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect, useRef} from "react";
import ReactDOMServer, {renderToStaticMarkup} from 'react-dom/server';
import Footer from "../../components/Footer";
import Navigation from '../../components/Navigation';
import {Episode, formatYears, Show} from "../../models/Show";
import styles from '../../styles/Home.module.css'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch data from external API
    const res = await fetch(`https://www.imdbgraph.org/api/ratings/${context.query.id}`)
    if (res.ok) {
        const ratings: Ratings = await res.json();
        return { props: { ratings: ratings } }
    } else {
        throw "Show not found";
    }
}

export default function Ratings(props: { ratings: Ratings }) {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Head>
                <title>IMDB Graph Ratings - {props.ratings.show.title}</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className={styles.title}>
                    {router.query.ratings}
                </h1>

                {hasRatings(props.ratings) ? <Graph ratings={props.ratings} /> : <h1 className={styles.title}>No ratings found for show</h1>}
            </main>
            <Footer />
        </div>
    )
}

type Ratings = {
    show: Show,
    allEpisodeRatings: {
        [season: number]: {
            [episode: number]: Episode
        }
    },
}

interface Series extends SeriesSplineOptions {
    type: "spline"
    data: {
        x: number,
        y: number,
        custom: { episode: Episode },
    }[]
}

function ShowTitle({ show }: { show: Show }) {
    return (
        <>
            <h1 className="text-center text-xl">{show.title} ({formatYears(show)})</h1>
            <h2 className="text-center text-sm">Show rating: {show.showRating.toFixed(1)} (Votes: {show.numVotes.toLocaleString()})</h2>
        </>
    );
}

function ToolTip({ episode }: { episode: Episode }) {
    return (
        <table>
            <tr>
                <th>
                    {episode.episodeTitle} (s{episode.season}e{episode.episodeNumber}):
                </th>
            </tr>
            <tr>
                <td style={{ textAlign: "left" }}>
                    Rating: {episode.imdbRating.toFixed(1)} ({episode.numVotes.toLocaleString()} votes)
                </td>
            </tr>
        </table>
    );
}

/**
 * Wrap the Hicharts graph in a react component.
 */
function Graph(props: { ratings: Ratings }) {
    const ref = useRef(null);
    const root = <div id="graph" ref={ref} />

    useEffect(() => {
        renderHighcharts(root.props.id, props.ratings);
    });

    return root;
}

/**
 * Helper function to check if a show has any ratings on any of their episodes. This
 * function is used to know whether a graph should be displayed or just an empty
 * banner letting the user know the show had no ratings.
 */
function hasRatings(ratings: Ratings): boolean {
    for (const seasonRatings of Object.values(ratings.allEpisodeRatings)) {
        for (const episode of Object.values(seasonRatings)) {
            if (episode.numVotes > 0) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Transform data into a format that Highcharts understands. 
 * {@link SeriesSplineOptions}
 */
function parseRatings(ratings: Ratings): SeriesSplineOptions[] {
    let i = 1;
    const allSeries: Series[] = [];
    for (const [seasonNumber, seasonRatings] of Object.entries(ratings.allEpisodeRatings)) {
        const data = [];
        for (const episode of Object.values(seasonRatings)) {
            if (episode.numVotes == 0) { // ignore episodes without ratings
                continue;
            }

            data.push({
                x: i,
                y: episode.imdbRating,
                custom: {
                    episode: episode
                }
            });
            i++;
        }

        const series: Series = {
            name: "Season " + seasonNumber,
            type: "spline",
            data: data
        };
        if (data.length > 0) {
            allSeries.push(series);
        }
    }
    return allSeries;
}

function renderHighcharts(id: string, ratings: Ratings) {
    Highcharts.chart(id, {
        title: {
            text: renderToStaticMarkup(<ShowTitle show={ratings.show} />),
            useHTML: true
        },

        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: true
                }
            }
        },

        xAxis: {
            visible: false
        },

        yAxis: {
            title: {
                text: 'IMDB Rating'
            },
            max: 10,
            tickInterval: 1
        },

        tooltip: {
            shared: false,
            useHTML: true,
            headerFormat: '',
            pointFormatter: function (this: PointOptionsObject) {
                const episode = this.custom?.episode as Episode;
                return ReactDOMServer.renderToStaticMarkup(<ToolTip episode={episode}/>);
            },
            footerFormat: '',
            valueDecimals: 2
        },

        credits: {
            enabled: false
        },

        series: parseRatings(ratings)
    });
}
