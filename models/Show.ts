export type Show = {
    readonly imdbId: string,
    readonly title: string,
    readonly image?: StaticImageData,
    readonly startYear: string,
    readonly endYear?: string,
    readonly runtime?: string,
    readonly rating?: string,

    readonly showRating: number,
    readonly numVotes: number,

    readonly cast?: string,
    readonly genre?: string,
}

export function formatTitle(show: Show): string {
    const ratings = `(rating: ${show.showRating}, votes: ${show.numVotes})`;
    return `${show.title} (${formatYears(show)}) ${ratings}`;
}

export function formatYears(show: Show): string {
    const endDate = show.endYear ?? "Present";
    return `${show.startYear} - ${endDate}`;
}

export type Episode = {
    readonly episodeTitle: string,

    readonly season: number,
    readonly episodeNumber: number,

    readonly imdbRating: number,
    readonly numVotes: number
}