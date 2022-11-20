import Highcharts, { PointOptionsObject, SeriesSplineOptions } from "highcharts";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Page from "../../components/Page";
import { Episode, formatYears, RatingsData, Show } from "../../models/Show";

export default function RatingsPage() {
    const router = useRouter();
    const showId = router.query["id"];
    const { isLoading, ratings } = useRatings(showId);

    return (
        <Page>
            <Head>
                <title>IMDB Graph Ratings: {ratings?.show.title ?? `Loading`}</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col">
                <div className="px-8">
                    <Navigation />
                </div>
                <Graph ratings={ratings} isLoading={isLoading} />
            </div>
        </Page>
    );
}

function Graph({ ratings, isLoading }: { ratings?: RatingsData, isLoading: boolean }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current === null) {
            return;
        }

        const chart = renderHighcharts(ref.current.id);
        chart.showLoading();

        if (ratings !== undefined) {
            for (const series of parseRatings(ratings)) {
                chart.addSeries(series, false);
            }
            chart.redraw();
            chart.hideLoading();
        }
    }, [ratings]);

    if (!isLoading && (ratings === undefined || !hasRatings(ratings))) {
        return <Header text="No Ratings found for TV show"/>;
    } else {
        return (
          <>
              <ShowTitle show={ratings?.show}/>
              <div className="px-8 w-screen" id="graph" ref={ref} />
          </>
        );
    }
}

function ShowTitle({ show }: { show?: Show }) {
    if (show === undefined) {
        return null;
    }
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

function useRatings(showId: string | string[] | undefined): { isLoading: boolean, ratings: RatingsData | undefined } {
    const [ratings, setRatings] = useState<RatingsData>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function load() {
            if (showId === undefined || Array.isArray(showId)) {
                return;
            }

            const res = await fetch(`/api/ratings/${encodeURIComponent(showId)}`);
            if (active && res.ok) {
                const ratings = (await res.json()) as RatingsData;
                if (active) {
                    setIsLoading(false);
                    setRatings(ratings);
                }
            } else {
                setIsLoading(false);
                setRatings(undefined);
            }
        }

        void load();
        return () => {
            active = false;
        };
    }, [showId]);

    return { isLoading, ratings };
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

interface Series extends SeriesSplineOptions {
    type: "spline";
    data: {
        x: number;
        y: number;
        custom: { episode: Episode };
    }[];
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
