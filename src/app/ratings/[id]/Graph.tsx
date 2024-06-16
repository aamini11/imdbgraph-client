"use client";

import Highcharts, { defaultOptions, SeriesSplineOptions } from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import MouseZoom from "highcharts/modules/mouse-wheel-zoom";
import HighchartsReact from "highcharts-react-official";
import { isArray, mergeWith } from "lodash";
import Header from "@/components/Header";
import { Theme, useTheme } from "@/components/theme/ThemedPage";
import { Episode, formatYears, RatingsData, Show } from "@/models/Show";

// https://stackoverflow.com/a/56766980
if (typeof Highcharts === "object") {
    MouseZoom(Highcharts);
    Accessibility(Highcharts);
}

export function Graph({ ratings }: { ratings: RatingsData }) {
    const { theme } = useTheme();

    if (!hasRatings(ratings)) {
        return <Header text="No Ratings found for TV show" />;
    }

    const themeSpecificOptions = theme === Theme.DARK ? darkThemeOptions : lightThemeOptions;
    return (
        <>
            <ShowTitle show={ratings?.show} />
            {theme && (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                        series: parseRatings(ratings),
                        ...mergeOptions(defaultOptions, commonOptions, themeSpecificOptions),
                    }}
                    className="min-w-[400px] max-w-[100vw] w-full"
                />
            )}
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

const commonOptions: Highcharts.Options = {
    chart: {
        backgroundColor: "rgba(0,0,0,0)",
        zooming: {
            type: "x",
            mouseWheel: true,
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
        // CAN NOT BE AN ARROW FUNCTION BECAUSE OF 'THIS' KEYWORD
        pointFormatter: function (this: Point) {
            const episode = this?.custom?.episode;
            if (episode) {
                return `
                    ${episode.episodeTitle} (s${episode.season}e${episode.episodeNumber})
                    <br><br>
                    Rating: ${episode.imdbRating.toFixed(1)} (${episode.numVotes.toLocaleString()} votes)
                `;
            } else {
                return "Error: Missing Data";
            }
        },
    },

    credits: {
        enabled: false,
    },
};

const lightThemeOptions: Highcharts.Options = {
    plotOptions: {
        spline: {
            dataLabels: {
                style: {
                    color: "rgb(0, 0, 0)",
                },
            },
        },
    },

    legend: {
        itemStyle: {
            color: "rgb(0,0,0)",
        },
    },
};

const darkThemeOptions: Highcharts.Options = {
    colors: ["#7CEA9C", "#50B2C0", "rgb(114, 78, 145)", "hsl(45, 93%, 58%)", "rgb(230, 78, 108)"],

    yAxis: {
        gridLineColor: "#3f3f46",
        labels: {
            style: {
                color: "#d4d4d4",
            },
        },
    },

    plotOptions: {
        spline: {
            dataLabels: {
                style: {
                    color: "#d4d4d4",
                },
            },
        },
    },

    tooltip: {
        style: {
            color: "#d4d4d4",
        },
        borderWidth: 1,
        borderColor: "#d4d4d4",
        backgroundColor: "#171717",
    },

    legend: {
        itemStyle: {
            color: "#d4d4d4",
            fontFamily: "var(--font-inter)",
        },
        itemHoverStyle: {
            color: "#fafafa",
        },
    },
};

/**
 * Modified version of lodash's recursive merge function. In lodash's version, it would merge together two arrays.
 * In this version, if two arrays are encountered, it just replaces the original with the new array. The main use case
 * for this function is when merging the dark theme config object I want it to replace all the colors not just add dark
 * theme colors to the original set of default colors.
 */
function mergeOptions<T>(...options: [T, T, T]): Highcharts.Options {
    // merge mutates the first param so pass in any empty object {} instead.
    return mergeWith(
        {},
        ...options,
        (obj: Highcharts.Options, src: Highcharts.Options): Highcharts.Options | undefined => {
            if (isArray(obj) && isArray(src)) {
                return src;
            } else {
                return undefined;
            }
        },
    );
}
