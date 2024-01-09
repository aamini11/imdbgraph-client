"use client";

import Highcharts, { SeriesSplineOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { merge } from "lodash";
import { useContext } from "react";
import Header from "@/components/Header";
import { Theme, ThemeContext } from "@/components/theme/ThemedPage";
import { Episode, formatYears, RatingsData, Show } from "@/models/Show";

export function Graph({ ratings }: { ratings: RatingsData }) {
    const { theme } = useContext(ThemeContext);

    if (!hasRatings(ratings)) {
        return <Header text="No Ratings found for TV show" />;
    }

    const options = theme === Theme.DARK ? merge(defaultOptions(), darkTheme()) : defaultOptions();
    const optionsWithData = { ...options, series: parseRatings(ratings) };
    return (
        <>
            <ShowTitle show={ratings?.show} />
            <HighchartsReact
                highcharts={Highcharts}
                options={optionsWithData}
                className="min-w-[400px] max-w-[100vw] w-full"
            />
        </>
    );
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

type Point = {
    x: number;
    y?: number;
    custom?: { episode: Episode };
};

/**
 * Transform data into a format that Highcharts understands.
 */
function parseRatings(ratings: RatingsData): SeriesSplineOptions[] {
    let i = 1;
    const allSeries: SeriesSplineOptions[] = [];
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

        const series: SeriesSplineOptions = {
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

const defaultOptions: () => Highcharts.Options = () => ({
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
            text: "",
        },
        max: 10,
        tickInterval: 1,
    },

    tooltip: {
        shared: false,
        headerFormat: "",
        followTouchMove: false, // Allow panning on mobile
        footerFormat: "",
        valueDecimals: 2,
        // CAN NOT BE AN ARROW FUNCTION BECAUSE OF THIS
        pointFormatter: function (this: Point) {
            const episode = this?.custom?.episode;
            if (episode) {
                return `
                    ${episode.episodeTitle} (s${episode.season}e${episode.episodeNumber})<br><br>Rating: ${episode.imdbRating.toFixed(1)} (${episode.numVotes.toLocaleString()} votes)
                `;
            } else {
                return "Error: Missing Data";
            }
        }
    },

    credits: {
        enabled: false,
    },
});

const darkTheme = () => ({
    colors: [
        "#2b908f",
        "#90ee7e",
        "#f45b5b",
        "#7798BF",
        "#aaeeee",
        "#ff0066",
        "#eeaaee",
        "#55BF3B",
        "#DF5353",
        "#7798BF",
        "#aaeeee",
    ],

    // Transparent background to match background of page
    chart: {
        backgroundColor: "rgba(0,0,0,0)",
    },

    legend: {
        itemStyle: {
            color: "#ffffff",
        },
        itemHoverStyle: {
            color: "LightGray",
        },
    },

    loading: {
        style: {
            backgroundColor: "rgba(0, 0, 0, 0.0)",
        },
        labelStyle: {
            color: "white",
        },
    },
});
