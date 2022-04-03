import Highcharts, { PointOptionsObject, SeriesSplineOptions } from "highcharts";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import Title from "../../components/Title";
import { Episode, formatYears, Show } from "../../models/Show";

export default function Ratings() {
    const router = useRouter();
    const showId = router.query["id"];
    const [title, setTitle] = useState("");

    if (typeof showId !== "string") {
        return null;
    }

    return (
        <div className="px-8 py-0">
            <Head>
                <title>IMDB Graph Ratings: {title}</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Navigation />
                <Graph showId={showId} setTitle={setTitle} />
            </main>
            <Footer />
        </div>
    );
}

type Ratings = {
    show: Show;
    allEpisodeRatings: {
        [season: number]: {
            [episode: number]: Episode;
        };
    };
};

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
            <div id={id} ref={ref} />
        </>
    );
}

function useRatings(showId: string | string[] | undefined): Ratings | null {
    const [ratings, setRatings] = useState<Ratings | null>(null);

    useEffect(() => {
        async function load() {
            if (typeof showId !== "string") {
                setRatings(null);
                return;
            }

            const res = await fetch(`/api/ratings/${encodeURIComponent(showId)}`);
            if (res.ok) {
                setRatings((await res.json()) as Ratings);
            } else {
                throw "Show not found";
            }
        }

        void load();
    }, [showId]);

    return ratings;
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
 */
function parseRatings(ratings: Ratings): Series[] {
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
