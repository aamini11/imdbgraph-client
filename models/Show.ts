export type Show = {
    imdbId: string,
    title: string,
    startYear: string,
    endYear?: string,
    showRating: number,
    numVotes: number

export function formatTitle(show: Show): string {
    const endDate = show.endYear ?? "Present"
    const ratings = `(rating: ${show.showRating}, votes: ${show.numVotes})`;
    return `${show.title} (${show.startYear} - ${endDate}) ${ratings}`;
}

export type Episode = {
    episodeTitle: string,

    season: number,
    episodeNumber: number,

    imdbRating: number,
    numVotes: number
}