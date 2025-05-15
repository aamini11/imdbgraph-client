"use client";

import { Theme, useTheme } from "@/components/theme/themed-page";
import { Episode } from "@/lib/data/episode";
import { RatingsData } from "@/lib/data/ratings";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts/esm/highcharts";
import "highcharts/esm/modules/accessibility";
import { isArray, mergeWith } from "lodash";

export function Graph({ ratings }: { ratings: RatingsData }) {
  const { theme } = useTheme();

  // Empty result
  if (!hasRatings(ratings)) {
    return <h1 className="pt-8 text-center text-6xl leading-tight">No Ratings Found</h1>;
  }

  const themeSpecificOptions = theme === Theme.LIGHT ? lightThemeOptions : darkThemeOptions;
  return (
    <div className="flex flex-1 relative max-h-[400px] min-h-[250px]">
      <HighchartsReact
        highcharts={Highcharts}
        containerProps={{ style: { position: "absolute", height: "100%", width: "100%" } }}
        options={{
          series: parseRatings(ratings),
          ...mergeOptions(Highcharts.defaultOptions, commonOptions, themeSpecificOptions),
        }}
      />
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
function parseRatings(ratings: RatingsData): Highcharts.SeriesSplineOptions[] {
  let i = 1;
  const allSeries: Highcharts.SeriesSplineOptions[] = [];
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

    const series: Highcharts.SeriesSplineOptions = {
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

  accessibility: {
    description: "A graph showing all the episode ratings of TV show",
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
