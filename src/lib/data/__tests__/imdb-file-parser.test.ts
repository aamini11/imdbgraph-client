import { testWithDb } from "../../../../tests/utils/db-setup";
import {
  avatarRatings,
  gameOfThronesRatings,
  simpsonsRatings,
} from "./data/ratings";
import { download, ImdbFile } from "@/lib/data/imdb-file-downloader";
import { update } from "@/lib/data/imdb-file-parser";
import { getRatings } from "@/lib/data/ratings";
import fs from "fs/promises";
import path from "path";
import { describe, expect, vi } from "vitest";

vi.mock("@/lib/data/imdb-file-downloader");

// =============================================================================
// Tests
// =============================================================================
describe("Test IMDB data scraper", () => {
  testWithDb("Loading sample files into database", async ({ db }) => {
    mockDownloads({
      "title.basics.tsv.gz": "./data/titles.tsv",
      "title.episode.tsv.gz": "./data/episodes.tsv",
      "title.ratings.tsv.gz": "./data/ratings.tsv",
    });

    await update(db.$client);

    expect(await getRatings(db, "tt0417299")).toEqual(avatarRatings);
    expect(await getRatings(db, "tt0944947")).toEqual(gameOfThronesRatings);
    expect(await getRatings(db, "tt0096697")).toEqual(simpsonsRatings);
  });

  testWithDb("Handling bad files", async ({ db }) => {
    mockDownloads({
      "title.basics.tsv.gz": "./data/titles.tsv",
      "title.episode.tsv.gz": "./data/bad-episodes.tsv",
      "title.ratings.tsv.gz": "./data/ratings.tsv",
    });

    await expect(update(db.$client)).rejects.toThrow("Error updating database");
  });
});

// =============================================================================
// Helpers
// =============================================================================
function mockDownloads(mockedFiles: Record<ImdbFile, string>) {
  const fakeDownloadFn = async (imdbFile: ImdbFile, output: string) => {
    const inputFile = path.join(__dirname, mockedFiles[imdbFile]);
    await fs.copyFile(inputFile, output);
  };

  vi.mocked(download).mockImplementation(fakeDownloadFn);
}
