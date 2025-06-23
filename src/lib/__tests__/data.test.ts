import { avatarRatings, gameOfThronesRatings, simpsonsRatings } from "../__mocks__/expectedRatings";
import { getRatings } from "@/lib/data/ratings";
import { pool } from "@/lib/db/drizzle";
import { update } from "@/lib/scraper/db-uploader";
import { download, ImdbFile } from "@/lib/scraper/downloader";
import fs from "fs/promises";
import path from "path";


jest.mock("@/lib/scraper/downloader");

// =============================================================================
// Tests
// =============================================================================
test(
  "Loading sample files into database",
  async () => {
    mockDownloads({
      "title.basics.tsv.gz": "../__mocks__/files/titles.tsv",
      "title.episode.tsv.gz": "../__mocks__/files/episodes.tsv",
      "title.ratings.tsv.gz": "../__mocks__/files/ratings.tsv",
    });

    await update();

    expect(await getRatings("tt0417299")).toEqual(avatarRatings);
    expect(await getRatings("tt0944947")).toEqual(gameOfThronesRatings);
    expect(await getRatings("tt0096697")).toEqual(simpsonsRatings);
  },
  15 * 60 * 1000,
);

test("Handling bad files", async () => {
  mockDownloads({
    "title.basics.tsv.gz": "../__mocks__/files/titles.tsv",
    "title.episode.tsv.gz": "../__mocks__/files/bad-episodes.tsv",
    "title.ratings.tsv.gz": "../__mocks__/files/ratings.tsv",
  });

  await expect(update()).rejects.toThrow("Error updating database");
});

afterAll(async () => {
  await pool.end();
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