import {
  avatarRatings,
  gameOfThronesRatings,
  simpsonsRatings,
} from "./__fixtures__/ratings";
import { db } from "@/lib/db/drizzle";
import { show, episode } from "@/lib/db/schema";
import { update } from "@/lib/scraper/db-uploader";
import { download, ImdbFile } from "@/lib/scraper/downloader";
import { getRatings } from "@/lib/scraper/ratings";
import { count, TableConfig } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import fs from "fs/promises";
import path from "path";

jest.mock("@/lib/scraper/downloader");

// =============================================================================
// Tests
// =============================================================================
beforeEach(async () => {
  await db.delete(episode);
  await db.delete(show);
});

test("Loading sample files into database", async () => {
  mockDownloads({
    "title.basics.tsv.gz": "./__fixtures__/files/titles.tsv",
    "title.episode.tsv.gz": "./__fixtures__/files/episodes.tsv",
    "title.ratings.tsv.gz": "./__fixtures__/files/ratings.tsv",
  });

  await update();

  expect(await getRatings("tt0417299")).toEqual(avatarRatings);
  expect(await getRatings("tt0944947")).toEqual(gameOfThronesRatings);
  expect(await getRatings("tt0096697")).toEqual(simpsonsRatings);
});

test("Handling bad files", async () => {
  mockDownloads({
    "title.basics.tsv.gz": "./__fixtures__/files/titles.tsv",
    "title.episode.tsv.gz": "./__fixtures__/files/bad-episodes.tsv",
    "title.ratings.tsv.gz": "./__fixtures__/files/ratings.tsv",
  });

  await expect(update()).rejects.toThrow("Error updating database");

  expect(await countRows(show)).toBe(0);
  expect(await countRows(episode)).toBe(0);
});

afterAll(async () => {
  await db.$client.end();
});

// =============================================================================
// Helpers
// =============================================================================
function mockDownloads(mockedFiles: Record<ImdbFile, string>) {
  const fakeDownloadFn = async (imdbFile: ImdbFile, output: string) => {
    const inputFile = path.join(__dirname, mockedFiles[imdbFile]);
    await fs.copyFile(inputFile, output);
  };

  jest.mocked(download).mockImplementation(fakeDownloadFn);
}

async function countRows<T extends TableConfig>(
  table: PgTable<T>,
): Promise<number> {
  const results = await db.select({ row_count: count() }).from(table);
  return results[0].row_count;
}
