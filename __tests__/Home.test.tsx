import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../src/pages";

describe("Home page tests", () => {
    it("Renders title correctly", () => {
        render(<Home />);

        const mainTitle = screen.getByRole("heading", {
            name: "Welcome to IMDB Graph",
        });

        expect(mainTitle).toBeInTheDocument();
    });

    it("Renders Gitlab page correctly", () => {
        render(<Home />);

        const title = "Source Code →";
        expect(
            screen.getByRole("heading", {
                name: title,
                level: 2,
                exact: false,
            })
        ).toBeInTheDocument();

        const description = "IMDB Graph is 100% open source. Click here to see the GitLab page";
        expect(screen.getByText(description)).toBeInTheDocument();

        const link = screen.getByRole("link", {
            name: title + " " + description,
        });
        expect(link).toHaveAttribute("href", "https://gitlab.com/users/aamini11/projects");
    });
});
