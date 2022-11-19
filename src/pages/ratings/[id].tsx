import Highcharts, { PointOptionsObject, SeriesSplineOptions } from "highcharts";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import Navigation from "../../components/Navigation";
import Page from "../../components/Page";
import Title from "../../components/Title";
import { Episode, formatYears, RatingsData, Show } from "../../models/Show";

export default function Ratings() {
    const router = useRouter();
    const showId = router.query["id"];
    const [title, setTitle] = useState("");

    if (typeof showId !== "string") {
        return null;
    }

    /*
     * Because of a quirk in NextJS the Graph component needs a key set so that
     * it doesn't render with stale props between pages. For some reason, the
     * useRatings hook call also has to be within the Graph component instead of
     * here at the root. That's why a setTitle callback is passed because the
     * root component needs to know the title of the show but can't know it
     * until the useRatings hook made the API call.
     *
     * Issue: https://github.com/vercel/next.js/issues/9992
     */
    return (
        <Page>
            <Head>
                <title>IMDB Graph Ratings: {title}</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col">
                <Navigation />
                <Graph key={showId} showId={showId} setTitle={setTitle} />
            </div>
        </Page>
    );
}

interface Series extends SeriesSplineOptions {
    type: "spline";
    data: {
        x: number;
        y: number;
        custom: { episode: Episode };
    }[];
}

function ShowTitle({ show }: { show: Show }) {
    return (
        <div className="p-3">
            <h1 className="text-center text-xl">
                {show.title} ({formatYears(show)})
            </h1>
            <h2 className="text-center text-sm">
                Show rating: {show.showRating.toFixed(1)} (Votes: {show.numVotes.toLocaleString()})
            </h2>
        </div>
    );
}

function ToolTip({ episode }: { episode: Episode }) {
    return (
        <span>
            {episode.episodeTitle} (s{episode.season}e{episode.episodeNumber}):
            <br />
            Rating: {episode.imdbRating.toFixed(1)} ({episode.numVotes.toLocaleString()} votes)
        </span>
    );
}

/**
 * Wrap the Hicharts graph in a React component.
 */
function Graph({ showId, setTitle }: { showId: string; setTitle: (title: string) => void }) {
    const ref = useRef(null);
    const ratings = useRatings(showId);

    const id = "graph";

    useEffect(() => {
        const chart = renderHighcharts(id);
        if (ratings === null) {
            chart.showLoading();
        } else {
            setTitle(ratings.show.title);
            for (const series of parseRatings(ratings)) {
                chart.addSeries(series, false);
            }
            chart.redraw();
            chart.hideLoading();
        }
    }, [ratings, setTitle]);

    return (
        <>
            {ratings !== null && !hasRatings(ratings) ? (
                <Title text="No ratings found for show" />
            ) : (
                ratings && <ShowTitle show={ratings.show} />
            )}
            <div className="px-8 w-screen" id={id} ref={ref} />
        </>
    );
}

function useRatings(showId: string | string[] | undefined): RatingsData | null {
    const [ratings, setRatings] = useState<RatingsData | null>(null);

    useEffect(() => {
        let active = true;

        async function load() {
            if (typeof showId !== "string") {
                setRatings(null);
                return;
            }

            const res = await fetch(`/api/ratings/${encodeURIComponent(showId)}`);
            if (active && res.ok) {
                const ratings = (await res.json()) as RatingsData;
                setRatings(ratings);
            } else {
                throw "Show not found";
            }
        }

        void load();
        return () => {
            active = false;
        };
    }, [showId]);

    return ratings;
}

/**
 * Helper function to check if a show has any ratings on any of their episodes. This
 * function is used to know whether a graph should be displayed or just an empty
 * banner letting the user know the show had no ratings.
 */
function hasRatings(ratings: RatingsData): boolean {
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
 */
function parseRatings(ratings: RatingsData): Series[] {
    let i = 1;
    const allSeries: Series[] = [];
    for (const [seasonNumber, seasonRatings] of Object.entries(ratings.allEpisodeRatings)) {
        const data = [];
        for (const episode of Object.values(seasonRatings)) {
            if (episode.numVotes == 0) {
                // ignore episodes without ratings
                continue;
            }

            data.push({
                x: i,
                y: episode.imdbRating,
                custom: {
                    episode: episode,
                },
            });
            i++;
        }

        const series: Series = {
            name: "Season " + seasonNumber,
            type: "spline",
            data: data,
        };
        if (data.length > 0) {
            allSeries.push(series);
        }
    }
    return allSeries;
}

function renderHighcharts(id: string) {
    return Highcharts.chart(id, {
        chart: {
            zooming: {
                type: "x",
            },
            panning: {
                enabled: true,
                type: "xy",
            },
        },
        title: {
            text: "",
        },

        plotOptions: {
            spline: {
                dataLabels: {
                    enabled: true,
                },
            },
        },

        xAxis: {
            visible: false,
        },

        yAxis: {
            title: {
                text: "IMDB Rating",
            },
            max: 10,
            tickInterval: 1,
        },

        tooltip: {
            shared: false,
            headerFormat: "",
            followTouchMove: false, // Allow panning on mobile
            pointFormatter: function (this: PointOptionsObject) {
                const episode = this.custom?.episode as Episode;
                return ReactDOMServer.renderToStaticMarkup(<ToolTip episode={episode} />);
            },
            footerFormat: "",
            valueDecimals: 2,
        },

        credits: {
            enabled: false,
        },
    });
}
