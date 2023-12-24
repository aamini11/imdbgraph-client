import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("Title works", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Welcome to IMDB Graph/i })).toBeVisible();
});

test("Search Bar Works", async ({ page }) => {
    await page.getByPlaceholder('Search for any TV show...').fill('Avatar');
    await page.getByRole('link', { name: 'Avatar: The Last Airbender' }).click();
    await expect(page).toHaveURL(/.*\/ratings\/tt0417299/);
});

test("LinkedIn button works", async ({ page }) => {
    const href = await page.getByRole("link", { name: /Developed by Aria Amini/i }).getAttribute('href');
    expect(href).toEqual("https://www.linkedin.com/in/aria-amini/");
});

test("Test matches snapshot", async ({ page }) => {
    await expect(page).toHaveScreenshot();
});