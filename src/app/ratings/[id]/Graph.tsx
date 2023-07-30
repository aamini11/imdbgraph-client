"use client";

import Header from "components/Header";
import { ThemeContext } from "components/theme/ThemedPage";
import Highcharts, { SeriesSplineOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { merge } from "lodash";
import { Episode, formatYears, RatingsData, Show } from "models/Show";
import { useContext } from "react";

export function Graph( { ratings } : { ratings: RatingsData }) {
    const { theme } = useContext(ThemeContext);

    if (!hasRatings(ratings)) {
        return <Header text="No Ratings found for TV show" />;
    } else {
        const options = theme === "dark" ? merge(defaultOptions(), darkTheme()) : defaultOptions();
        const optionsWithData = { ...options, series: parseRatings(ratings) };
        return (
            <>
                <ShowTitle show={ratings?.show} />
                <HighchartsReact
                    highcharts={Highcharts}
                    options={optionsWithData}
                    className="min-w-[400px] max-w-[100vw] w-full" />
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
