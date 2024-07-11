import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const x = page.getByRole("combobox");
  await x.click();
  await x.fill('Avata');
  await x.press('ArrowDown');
  await x.press('Enter');

  // await page.getByPlaceholder('Search for any TV show...').click();
  // await page.getByPlaceholder('Search for any TV show...').fill('Avata');
  // await page.getByPlaceholder('Search for any TV show...').press('ArrowDown');
  // await page.getByPlaceholder('Search for any TV show...').press('Enter');
});