import { Ratings } from "@/lib/data/types";

export const avatarRatings: Ratings = {
  show: {
    imdbId: "tt0417299",
    title: "Avatar: The Last Airbender",
    startYear: "2005",
    endYear: "2008",
    rating: 9.2,
    numVotes: 193629,
  },
  allEpisodeRatings: {
    "1": {
      "0": {
        title: "Avatar: The Last Airbender",
        seasonNum: 1,
        episodeNum: 0,
        rating: 0,
        numVotes: 0,
      },
      "1": {
        title: "The Boy in the Iceberg",
        seasonNum: 1,
        episodeNum: 1,
        rating: 8.2,
        numVotes: 1953,
      },
      "2": {
        title: "The Avatar Returns",
        seasonNum: 1,
        episodeNum: 2,
        rating: 8.4,
        numVotes: 1705,
      },
    },
    "2": {
      "1": {
        title: "The Avatar State",
        seasonNum: 2,
        episodeNum: 1,
        rating: 0,
        numVotes: 0,
      },
    },
  },
};

export const gameOfThronesRatings: Ratings = {
  show: {
    imdbId: "tt0944947",
    title: "Game of Thrones",
    startYear: "2011",
    endYear: "2019",
    rating: 9.4,
    numVotes: 1563413,
  },
  allEpisodeRatings: {
    "1": {
      "1": {
        title: "Winter Is Coming",
        seasonNum: 1,
        episodeNum: 1,
        rating: 0,
        numVotes: 0,
      },
      "2": {
        title: "The Kingsroad",
        seasonNum: 1,
        episodeNum: 2,
        rating: 0,
        numVotes: 0,
      },
      "3": {
        title: "Lord Snow",
        seasonNum: 1,
        episodeNum: 3,
        rating: 0,
        numVotes: 0,
      },
    },
    "2": {
      "1": {
        title: "The North Remembers",
        seasonNum: 2,
        episodeNum: 1,
        rating: 0,
        numVotes: 0,
      },
      "2": {
        title: "The Night Lands",
        seasonNum: 2,
        episodeNum: 2,
        rating: 0,
        numVotes: 0,
      },
    },
  },
};

export const simpsonsRatings: Ratings = {
  show: {
    imdbId: "tt0096697",
    title: "The Simpsons",
    startYear: "1989",
    endYear: null,
    rating: 0,
    numVotes: 0,
  },
  allEpisodeRatings: {},
};
