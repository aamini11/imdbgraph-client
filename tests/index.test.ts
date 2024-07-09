import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("Title works", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Welcome to IMDB Graph/i })).toBeVisible();
});

test("Home Page matches screenshot", async ({ page }) => {
    await expect(page).toHaveScreenshot();
});

test("Search bar click navigation works", async ({ page }) => {
    await page.getByPlaceholder("Search for any TV show...").fill("Avatar");
    await page.getByText("Avatar: The Last Airbender 2005 - 2008").click();
    await expect(page).toHaveURL(/.*\/ratings\/tt0417299/);
});

test("Search bar keyboard navigation works", async ({ page }) => {
    const searchBar = page.getByPlaceholder("Search for any TV show...");
    await searchBar.fill("Avatar");
    await expect(page.getByText("Avatar: The Last Airbender 2005 - 2008")).toBeVisible();
    await searchBar.press("ArrowDown");
    await searchBar.press("Enter");
    await expect(page).toHaveURL(/.*\/ratings\/tt0417299/);
});

test("LinkedIn button works", async ({ page }) => {
    const href = await page.getByRole("link", { name: /Developed by Aria Amini/i }).getAttribute("href");
    expect(href).toEqual("https://www.linkedin.com/in/aria-amini/");
});
