export type Show = {
    imdbId: string,
    title: string,
    startYear: string,
    endYear?: string,
    showRating: number,
    numVotes: number
}

export type Episode = {
    episodeTitle: string,

    season: number,
    episodeNumber: number,

    imdbRating: number,
    numVotes: number
}