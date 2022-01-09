import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Search.module.css'
import {useRouter} from 'next/router'
import Highcharts, {Options, SeriesOptionsType, SeriesSplineOptions} from 'highcharts'
import {useEffect, useRef} from "react";
import Footer from "../components/Footer";

export default function Search() {
    const router = useRouter();
    const sampleData: ShowRatings = {
        "show": {
            "imdbId": "tt0944947",
            "title": "Game of Thrones",
            "startYear": "2011",
            "endYear": "2019",
            "showRating": 9.2,
            "numVotes": 1926615
        },
        "allEpisodeRatings": {
            "1": {
                "1": {
                    "episodeTitle": "Winter Is Coming",
                    "season": 1,
                    "episodeNumber": 1,
                    "imdbRating": 9.1,
                    "numVotes": 45104
                },
                "2": {
                    "episodeTitle": "The Kingsroad",
                    "season": 1,
                    "episodeNumber": 2,
                    "imdbRating": 8.8,
                    "numVotes": 34274
                },
                "3": {
                    "episodeTitle": "Lord Snow",
                    "season": 1,
                    "episodeNumber": 3,
                    "imdbRating": 8.7,
                    "numVotes": 32458
                },
                "4": {
                    "episodeTitle": "Cripples, Bastards, and Broken Things",
                    "season": 1,
                    "episodeNumber": 4,
                    "imdbRating": 8.8,
                    "numVotes": 30863
                },
                "5": {
                    "episodeTitle": "The Wolf and the Lion",
                    "season": 1,
                    "episodeNumber": 5,
                    "imdbRating": 9.1,
                    "numVotes": 32096
                },
                "6": {
                    "episodeTitle": "A Golden Crown",
                    "season": 1,
                    "episodeNumber": 6,
                    "imdbRating": 9.2,
                    "numVotes": 31749
                },
                "7": {
                    "episodeTitle": "You Win or You Die",
                    "season": 1,
                    "episodeNumber": 7,
                    "imdbRating": 9.2,
                    "numVotes": 32276
                },
                "8": {
                    "episodeTitle": "The Pointy End",
                    "season": 1,
                    "episodeNumber": 8,
                    "imdbRating": 9,
                    "numVotes": 30196
                },
                "9": {
                    "episodeTitle": "Baelor",
                    "season": 1,
                    "episodeNumber": 9,
                    "imdbRating": 9.6,
                    "numVotes": 42127
                },
                "10": {
                    "episodeTitle": "Fire and Blood",
                    "season": 1,
                    "episodeNumber": 10,
                    "imdbRating": 9.5,
                    "numVotes": 37106
                }
            },
            "2": {
                "1": {
                    "episodeTitle": "The North Remembers",
                    "season": 2,
                    "episodeNumber": 1,
                    "imdbRating": 8.8,
                    "numVotes": 29054
                },
                "2": {
                    "episodeTitle": "The Night Lands",
                    "season": 2,
                    "episodeNumber": 2,
                    "imdbRating": 8.5,
                    "numVotes": 27520
                },
                "3": {
                    "episodeTitle": "What Is Dead May Never Die",
                    "season": 2,
                    "episodeNumber": 3,
                    "imdbRating": 8.8,
                    "numVotes": 27214
                },
                "4": {
                    "episodeTitle": "Garden of Bones",
                    "season": 2,
                    "episodeNumber": 4,
                    "imdbRating": 8.8,
                    "numVotes": 26375
                },
                "5": {
                    "episodeTitle": "The Ghost of Harrenhal",
                    "season": 2,
                    "episodeNumber": 5,
                    "imdbRating": 8.8,
                    "numVotes": 26549
                },
                "6": {
                    "episodeTitle": "The Old Gods and the New",
                    "season": 2,
                    "episodeNumber": 6,
                    "imdbRating": 9.1,
                    "numVotes": 27693
                },
                "7": {
                    "episodeTitle": "A Man Without Honor",
                    "season": 2,
                    "episodeNumber": 7,
                    "imdbRating": 8.9,
                    "numVotes": 26975
                },
                "8": {
                    "episodeTitle": "The Prince of Winterfell",
                    "season": 2,
                    "episodeNumber": 8,
                    "imdbRating": 8.8,
                    "numVotes": 26686
                },
                "9": {
                    "episodeTitle": "Blackwater",
                    "season": 2,
                    "episodeNumber": 9,
                    "imdbRating": 9.7,
                    "numVotes": 45779
                },
                "10": {
                    "episodeTitle": "Valar Morghulis",
                    "season": 2,
                    "episodeNumber": 10,
                    "imdbRating": 9.4,
                    "numVotes": 32630
                }
            },
            "3": {
                "1": {
                    "episodeTitle": "Valar Dohaeris",
                    "season": 3,
                    "episodeNumber": 1,
                    "imdbRating": 8.8,
                    "numVotes": 28751
                },
                "2": {
                    "episodeTitle": "Dark Wings, Dark Words",
                    "season": 3,
                    "episodeNumber": 2,
                    "imdbRating": 8.6,
                    "numVotes": 26312
                },
                "3": {
                    "episodeTitle": "Walk of Punishment",
                    "season": 3,
                    "episodeNumber": 3,
                    "imdbRating": 8.9,
                    "numVotes": 26579
                },
                "4": {
                    "episodeTitle": "And Now His Watch Is Ended",
                    "season": 3,
                    "episodeNumber": 4,
                    "imdbRating": 9.6,
                    "numVotes": 35806
                },
                "5": {
                    "episodeTitle": "Kissed by Fire",
                    "season": 3,
                    "episodeNumber": 5,
                    "imdbRating": 9,
                    "numVotes": 27214
                },
                "6": {
                    "episodeTitle": "The Climb",
                    "season": 3,
                    "episodeNumber": 6,
                    "imdbRating": 8.8,
                    "numVotes": 26925
                },
                "7": {
                    "episodeTitle": "The Bear and the Maiden Fair",
                    "season": 3,
                    "episodeNumber": 7,
                    "imdbRating": 8.7,
                    "numVotes": 26111
                },
                "8": {
                    "episodeTitle": "Second Sons",
                    "season": 3,
                    "episodeNumber": 8,
                    "imdbRating": 9,
                    "numVotes": 26778
                },
                "9": {
                    "episodeTitle": "The Rains of Castamere",
                    "season": 3,
                    "episodeNumber": 9,
                    "imdbRating": 9.9,
                    "numVotes": 98534
                },
                "10": {
                    "episodeTitle": "Mhysa",
                    "season": 3,
                    "episodeNumber": 10,
                    "imdbRating": 9.2,
                    "numVotes": 30049
                }
            },
            "4": {
                "1": {
                    "episodeTitle": "Two Swords",
                    "season": 4,
                    "episodeNumber": 1,
                    "imdbRating": 9.1,
                    "numVotes": 33361
                },
                "2": {
                    "episodeTitle": "The Lion and the Rose",
                    "season": 4,
                    "episodeNumber": 2,
                    "imdbRating": 9.7,
                    "numVotes": 51673
                },
                "3": {
                    "episodeTitle": "Breaker of Chains",
                    "season": 4,
                    "episodeNumber": 3,
                    "imdbRating": 8.9,
                    "numVotes": 28597
                },
                "4": {
                    "episodeTitle": "Oathkeeper",
                    "season": 4,
                    "episodeNumber": 4,
                    "imdbRating": 8.8,
                    "numVotes": 27523
                },
                "5": {
                    "episodeTitle": "First of His Name",
                    "season": 4,
                    "episodeNumber": 5,
                    "imdbRating": 8.8,
                    "numVotes": 26760
                },
                "6": {
                    "episodeTitle": "The Laws of Gods and Men",
                    "season": 4,
                    "episodeNumber": 6,
                    "imdbRating": 9.7,
                    "numVotes": 48787
                },
                "7": {
                    "episodeTitle": "Mockingbird",
                    "season": 4,
                    "episodeNumber": 7,
                    "imdbRating": 9.1,
                    "numVotes": 29552
                },
                "8": {
                    "episodeTitle": "The Mountain and the Viper",
                    "season": 4,
                    "episodeNumber": 8,
                    "imdbRating": 9.7,
                    "numVotes": 51684
                },
                "9": {
                    "episodeTitle": "The Watchers on the Wall",
                    "season": 4,
                    "episodeNumber": 9,
                    "imdbRating": 9.6,
                    "numVotes": 44310
                },
                "10": {
                    "episodeTitle": "The Children",
                    "season": 4,
                    "episodeNumber": 10,
                    "imdbRating": 9.7,
                    "numVotes": 43710
                }
            },
            "5": {
                "1": {
                    "episodeTitle": "The Wars to Come",
                    "season": 5,
                    "episodeNumber": 1,
                    "imdbRating": 8.5,
                    "numVotes": 29330
                },
                "2": {
                    "episodeTitle": "The House of Black and White",
                    "season": 5,
                    "episodeNumber": 2,
                    "imdbRating": 8.5,
                    "numVotes": 26222
                },
                "3": {
                    "episodeTitle": "High Sparrow",
                    "season": 5,
                    "episodeNumber": 3,
                    "imdbRating": 8.5,
                    "numVotes": 25447
                },
                "4": {
                    "episodeTitle": "Sons of the Harpy",
                    "season": 5,
                    "episodeNumber": 4,
                    "imdbRating": 8.7,
                    "numVotes": 26100
                },
                "5": {
                    "episodeTitle": "Kill the Boy",
                    "season": 5,
                    "episodeNumber": 5,
                    "imdbRating": 8.6,
                    "numVotes": 26334
                },
                "6": {
                    "episodeTitle": "Unbowed, Unbent, Unbroken",
                    "season": 5,
                    "episodeNumber": 6,
                    "imdbRating": 8,
                    "numVotes": 29533
                },
                "7": {
                    "episodeTitle": "The Gift",
                    "season": 5,
                    "episodeNumber": 7,
                    "imdbRating": 9,
                    "numVotes": 28593
                },
                "8": {
                    "episodeTitle": "Hardhome",
                    "season": 5,
                    "episodeNumber": 8,
                    "imdbRating": 9.9,
                    "numVotes": 96182
                },
                "9": {
                    "episodeTitle": "The Dance of Dragons",
                    "season": 5,
                    "episodeNumber": 9,
                    "imdbRating": 9.5,
                    "numVotes": 42282
                },
                "10": {
                    "episodeTitle": "Mother's Mercy",
                    "season": 5,
                    "episodeNumber": 10,
                    "imdbRating": 9.1,
                    "numVotes": 41020
                }
            },
            "6": {
                "1": {
                    "episodeTitle": "The Red Woman",
                    "season": 6,
                    "episodeNumber": 1,
                    "imdbRating": 8.5,
                    "numVotes": 38805
                },
                "2": {
                    "episodeTitle": "Home",
                    "season": 6,
                    "episodeNumber": 2,
                    "imdbRating": 9.4,
                    "numVotes": 45461
                },
                "3": {
                    "episodeTitle": "Oathbreaker",
                    "season": 6,
                    "episodeNumber": 3,
                    "imdbRating": 8.7,
                    "numVotes": 32987
                },
                "4": {
                    "episodeTitle": "Book of the Stranger",
                    "season": 6,
                    "episodeNumber": 4,
                    "imdbRating": 9.1,
                    "numVotes": 35445
                },
                "5": {
                    "episodeTitle": "The Door",
                    "season": 6,
                    "episodeNumber": 5,
                    "imdbRating": 9.7,
                    "numVotes": 68681
                },
                "6": {
                    "episodeTitle": "Blood of My Blood",
                    "season": 6,
                    "episodeNumber": 6,
                    "imdbRating": 8.4,
                    "numVotes": 32723
                },
                "7": {
                    "episodeTitle": "The Broken Man",
                    "season": 6,
                    "episodeNumber": 7,
                    "imdbRating": 8.6,
                    "numVotes": 31888
                },
                "8": {
                    "episodeTitle": "No One",
                    "season": 6,
                    "episodeNumber": 8,
                    "imdbRating": 8.4,
                    "numVotes": 36007
                },
                "9": {
                    "episodeTitle": "Battle of the Bastards",
                    "season": 6,
                    "episodeNumber": 9,
                    "imdbRating": 9.9,
                    "numVotes": 199772
                },
                "10": {
                    "episodeTitle": "The Winds of Winter",
                    "season": 6,
                    "episodeNumber": 10,
                    "imdbRating": 9.9,
                    "numVotes": 140319
                }
            },
            "7": {
                "1": {
                    "episodeTitle": "Dragonstone",
                    "season": 7,
                    "episodeNumber": 1,
                    "imdbRating": 8.6,
                    "numVotes": 49552
                },
                "2": {
                    "episodeTitle": "Stormborn",
                    "season": 7,
                    "episodeNumber": 2,
                    "imdbRating": 8.9,
                    "numVotes": 43076
                },
                "3": {
                    "episodeTitle": "The Queen's Justice",
                    "season": 7,
                    "episodeNumber": 3,
                    "imdbRating": 9.2,
                    "numVotes": 45057
                },
                "4": {
                    "episodeTitle": "The Spoils of War",
                    "season": 7,
                    "episodeNumber": 4,
                    "imdbRating": 9.8,
                    "numVotes": 85274
                },
                "5": {
                    "episodeTitle": "Eastwatch",
                    "season": 7,
                    "episodeNumber": 5,
                    "imdbRating": 8.8,
                    "numVotes": 42844
                },
                "6": {
                    "episodeTitle": "Beyond the Wall",
                    "season": 7,
                    "episodeNumber": 6,
                    "imdbRating": 9,
                    "numVotes": 62270
                },
                "7": {
                    "episodeTitle": "The Dragon and the Wolf",
                    "season": 7,
                    "episodeNumber": 7,
                    "imdbRating": 9.4,
                    "numVotes": 62082
                }
            },
            "8": {
                "1": {
                    "episodeTitle": "Winterfell",
                    "season": 8,
                    "episodeNumber": 1,
                    "imdbRating": 7.5,
                    "numVotes": 129182
                },
                "2": {
                    "episodeTitle": "A Knight of the Seven Kingdoms",
                    "season": 8,
                    "episodeNumber": 2,
                    "imdbRating": 7.8,
                    "numVotes": 127499
                },
                "3": {
                    "episodeTitle": "The Long Night",
                    "season": 8,
                    "episodeNumber": 3,
                    "imdbRating": 7.4,
                    "numVotes": 211019
                },
                "4": {
                    "episodeTitle": "The Last of the Starks",
                    "season": 8,
                    "episodeNumber": 4,
                    "imdbRating": 5.4,
                    "numVotes": 161397
                },
                "5": {
                    "episodeTitle": "The Bells",
                    "season": 8,
                    "episodeNumber": 5,
                    "imdbRating": 5.9,
                    "numVotes": 188000
                },
                "6": {
                    "episodeTitle": "The Iron Throne",
                    "season": 8,
                    "episodeNumber": 6,
                    "imdbRating": 4,
                    "numVotes": 239533
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>IMDB Graph</title>
                <meta name="description" content="Website to visualize IMDB TV show ratings as a graph"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {router.query.q}
                </h1>

                <Graph data={sampleData}/>
            </main>

            <Footer/>
        </div>
    )
}

type ShowRatings = {
    show: {
        imdbId: string,
        title: string,
        startYear: string,
        endYear: string,
        showRating: number,
        numVotes: number
    },

    allEpisodeRatings: {
        [season: number]: {
            [episode: number]: Episode
        }
    },
}

type Episode = {
    episodeTitle: string,

    season: number,
    episodeNumber: number,

    imdbRating: number,
    numVotes: number
}

interface Series extends SeriesSplineOptions {
    type: "spline"
    data: {
        x: number,
        y: number,
        custom: {episode: Episode},
    }[]
}

/**
 * Transform data into a format that Highcharts understands
 */
function parseRatings(ratings: ShowRatings): SeriesSplineOptions[] {
    let i = 1;
    let allSeries: Series[] = [];
    for (let [seasonNumber, seasonRatings] of Object.entries(ratings.allEpisodeRatings)) {
        let data = [];
        for (let episode of Object.values(seasonRatings)) {
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

function Graph(props: {data: ShowRatings}) {
    const ref = useRef(null);
    const root = <div id="graph" ref={ref}/>

    useEffect(() => {
        renderHighcharts(root.props.id, props.data);
    });

    return root;
}

function renderHighcharts(id: string, data: ShowRatings) {
    Highcharts.chart(id, {
        title: {
            text: ""
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

        series: parseRatings(data)
    });
}