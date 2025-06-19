import { db } from "@/lib/db/drizzle";
import { show, episode } from "@/lib/db/schema";
import { update } from "@/lib/scraper/db-uploader";
import { download, ImdbFile } from "@/lib/scraper/downloader";
import { count, TableConfig } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { promises as fs, PathLike } from "fs";
import path from "path";

jest.mock("@/lib/scraper/downloader");

// =============================================================================
// Tests
// =============================================================================
beforeEach(async () => {
  await db.delete(episode);
  await db.delete(show);
});

test(
  "Loading sample files into database",
  async () => {
    mockDownloads({
      "title.basics.tsv.gz": path.join(__dirname, "./samples/titles.tsv"),
      "title.episode.tsv.gz": path.join(__dirname, "./samples/episodes.tsv"),
      "title.ratings.tsv.gz": path.join(__dirname, "./samples/ratings.tsv"),
    });

    await update();

    expect(await countRows(show)).toBe(3);
    expect(await countRows(episode)).toBe(9);
  },
  60 * 1000,
);

test("Handling bad files", async () => {
  mockDownloads({
    "title.basics.tsv.gz": path.join(__dirname, "./samples/titles.tsv"),
    "title.episode.tsv.gz": path.join(__dirname, "./samples/bad-episodes.tsv"),
    "title.ratings.tsv.gz": path.join(__dirname, "./samples/ratings.tsv"),
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
  const fakeDownloadFn = async (imdbFile: ImdbFile, output: PathLike) => {
    await fs.copyFile(mockedFiles[imdbFile], output);
  };

  jest.mocked(download).mockImplementation(fakeDownloadFn);
}

async function countRows<T extends TableConfig>(
  table: PgTable<T>,
): Promise<number> {
  const results = await db.select({ row_count: count() }).from(table);
  return results[0].row_count;
}
