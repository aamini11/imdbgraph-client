import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Ratings from "../src/pages/ratings/[id]";

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                show: {
                    imdbId: "tt5175444",
                    title: "Empty show",
                    startYear: "2014",
                    endYear: null,
                    showRating: 7.7,
                    numVotes: 197,
                },
                allEpisodeRatings: {},
            }),
    })
) as jest.Mock;

jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: { id: "tt1234567" },
        };
    },
}));

describe("Ratings page tests", () => {
    it("Test show with not ratings", async () => {
        render(<Ratings />);
        expect(await screen.findByText("No ratings found for show")).toBeInTheDocument();
    });
});
