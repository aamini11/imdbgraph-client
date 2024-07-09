import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("ratings/tt0417299");
});

test("Title works", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Avatar: The Last Airbender (2005 - 2008)" })).toBeVisible();
});

test("Ratings page screenshot test", async ({ page }) => {
    await expect(page).toHaveScreenshot();
});
