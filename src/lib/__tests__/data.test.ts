import { avatarRatings, gameOfThronesRatings, simpsonsRatings } from "../__mocks__/expectedRatings";
import { getRatings } from "@/lib/data/ratings";
import { pool } from "@/lib/db/connection";
import { update } from "@/lib/scraper/db-updater";
import { download, ImdbFile } from "@/lib/scraper/imdb-file-downloader";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import fs from "fs/promises";
import path from "path";
import { Pool } from "pg";

jest.mock("@/lib/scraper/imdb-file-downloader");
jest.mock("@/lib/db/connection");

// =============================================================================
// Tests
// =============================================================================
let container: StartedPostgreSqlContainer;
let pool: NodePgDatabase;

beforeAll(async () => {
  container = await new PostgreSqlContainer("redis")
    .withExposedPorts(6379)
    .start();

  pool = new Pool({
    connectionString: container.getConnectionUri(),
  });
});

afterAll(async () => {
  await container.stop();
});

test(
  "Loading sample files into database",
  async () => {
    mockDownloads({
      "title.basics.tsv.gz": "../__mocks__/sample-files/titles.tsv",
      "title.episode.tsv.gz": "../__mocks__/sample-files/episodes.tsv",
      "title.ratings.tsv.gz": "../__mocks__/sample-files/ratings.tsv",
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
    "title.basics.tsv.gz": "../__mocks__/sample-files/titles.tsv",
    "title.episode.tsv.gz": "../__mocks__/sample-files/bad-episodes.tsv",
    "title.ratings.tsv.gz": "../__mocks__/sample-files/ratings.tsv",
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