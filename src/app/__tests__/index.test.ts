import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Welcome to IMDB Graph/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Developed by Aria Amini/i })).toBeVisible();
});
