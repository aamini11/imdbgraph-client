import { render, screen } from "@testing-library/react";
import Ratings from "../app/ratings/[id]/page";

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
    }),
) as jest.Mock;

jest.mock("next/navigation");

describe("Ratings page tests", () => {
    test("Page when show has no ratings", async () => {
        render(await Ratings({
            params: {
                id: "tt0417299"
            }
        }));

        const noShowMessage = await screen.findByRole("heading", {
            name: /No Ratings found for TV show/i,
        });
        expect(noShowMessage).toBeInTheDocument();
    });
});
