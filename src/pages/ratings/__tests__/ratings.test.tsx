import "@testing-library/jest-dom";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import Ratings from "../[id]";

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                show: {
                    imdbId: "tt0417299",
                    title: "Avatar: The Last Airbender",
                    startYear: "2005",
                    endYear: "2008",
                    showRating: 9.3,
                    numVotes: 312232,
                },
                allEpisodeRatings: {},
            }),
    })
) as jest.Mock;

jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: { id: "tt0417299" },
        };
    },
}));

describe("Ratings page tests", () => {
    it("Test show with not ratings", async () => {
        render(<Ratings />);
        await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

        const noShowMessage = screen.getByRole('heading', {
            name: /no ratings found for show/i
        });
        expect(noShowMessage).toBeInTheDocument();
    });
});
