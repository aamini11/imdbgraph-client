import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockSearchResult } from "components/__tests__/mockSearchResult";
import Searchbar, { DROPDOWN_SIZE_LIMIT } from "components/Searchbar";

jest.mock("next/navigation");

global.fetch = jest.fn();
jest.spyOn(global, "fetch").mockImplementation(
    jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockSearchResult),
        }),
    ) as jest.Mock,
);

describe("Searchbar tests", () => {
    test("Dropdown works", async () => {
        const user = userEvent.setup();

        render(<Searchbar />);
        const searchBar = screen.getByRole("textbox");
        expect(searchBar).toBeInTheDocument();
        await user.type(searchBar, "Avatar");

        for (const suggestion of mockSearchResult.slice(0, DROPDOWN_SIZE_LIMIT)) {
            const suggestionListItem = await screen.findByRole("link", { name: suggestion.title });
            expect(suggestionListItem).toBeInTheDocument();
        }
    });
});
