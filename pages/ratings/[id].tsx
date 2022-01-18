import Head from 'next/head'
import styles from '../../styles/Search.module.css'
import {useRouter} from 'next/router'
import Highcharts, {SeriesSplineOptions} from 'highcharts'
import {useEffect, useRef} from "react";
import Footer from "../../components/Footer";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {Episode, Show} from "../../models/Show";

export default function Ratings(props: {data: Ratings}) { // props: {data: ShowRatings}
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Head>
                <title>IMDB Graph</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {router.query.ratings}
                </h1>

                <Graph data={props.data}/>
            </main>
            <Footer/>
        </div>
    )
}

export type Ratings = {
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
        custom: {episode: Episode},
    }[]
}

function Graph(props: {data: Ratings}) {
    const ref = useRef(null);
    const root = <div id="graph" ref={ref}/>

    useEffect(() => {
        renderHighcharts(root.props.id, props.data);
    });

    return root;
}

/**
 * Transform data into a format that Highcharts understands
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
    function formatTitle(show: Show) {
        const endDate = show.endYear ?? "Present"
        const ratings = "" ?? `(rating: ${show.showRating}, votes: ${show.numVotes})`;
        return `${show.title} (${show.startYear} - ${endDate}) ${ratings}`;
    }

    Highcharts.chart(id, {
        title: {
            text: formatTitle(ratings.show)
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
            shared: true,
            useHTML: true,
            headerFormat: '',
            pointFormat:
                '<tr><td style="color: {series.color}">s{point.season}e{point.episode} ({point.title}): </td>' +
                '<td style="text-align: right"><b>{point.y} ({point.numVotes} votes)</b></td></tr>',
            footerFormat: '',
            valueDecimals: 2
        },

        credits: {
            enabled: false
        },

        series: parseRatings(ratings)
    });
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch data from external API
    const res = await fetch(`http://localhost:8080/ratings/${context.query.id}`)
    if (res.ok) {
        const data = await res.json()
        return {props: {data}};
    } else {
        throw "Show not found";
    }
}