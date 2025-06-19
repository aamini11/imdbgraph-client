import { db } from "@/lib/db/drizzle";
import { download } from "@/lib/scraper/downloader";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { PoolClient } from "pg";
import { from as copyFrom } from "pg-copy-streams";

/**
 * Main method that downloads the latest files from IMDB and updates our
 * internal database with the latest data.
 */
export async function update(): Promise<void> {
  const client = await db.$client.connect();
  try {
    await client.query("BEGIN");
    await transfer(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Error updating database", { cause: error });
  } finally {
    client.release();
  }
}

/**
 * Download files and store them in temp tables using efficient bulk operations.
 * Once all data is loaded into temp tables, update all the real tables with
 * data from the temp tables.
 */
async function transfer(client: PoolClient) {
  await client.query(`
    CREATE TEMPORARY TABLE temp_title
    (
        imdb_id         VARCHAR(10),
        title_type      TEXT,
        primary_title   TEXT,
        original_title  TEXT,
        is_adult        BOOLEAN,
        start_year      CHAR(4),
        end_year        CHAR(4),
        runtime_minutes INT,
        genres          TEXT
    ) ON COMMIT DROP;
    
    CREATE TEMPORARY TABLE temp_episode
    (
        episode_id  VARCHAR(10),
        show_id     VARCHAR(10),
        season_num  INT,
        episode_num INT
    ) ON COMMIT DROP;
    
    CREATE TEMPORARY TABLE temp_ratings
    (
        imdb_id     VARCHAR(10) PRIMARY KEY,
        imdb_rating DOUBLE PRECISION,
        num_votes   INT
    ) ON COMMIT DROP;
  `);

  // Download files and store them in temp tables.
  const filesToTablesMappings = [
    ["title.basics.tsv.gz", "temp_title"],
    ["title.episode.tsv.gz", "temp_episode"],
    ["title.ratings.tsv.gz", "temp_ratings"],
  ] as const;
  const tempDir = path.join(tmpdir(), `imdb-run-${randomUUID()}`);
  await mkdir(tempDir);
  for (const [fileName, table] of filesToTablesMappings) {
    const outputFile = path.join(tempDir, fileName);
    await download(fileName, outputFile);

    // Use COPY command to efficiently copy data from files into tables.
    const sourceStream = createReadStream(outputFile);
    const ingestStream = client.query(
      copyFrom(`COPY ${table} FROM STDIN WITH (DELIMITER '\t', HEADER TRUE);`),
    );
    await pipeline(sourceStream, ingestStream);
    console.log(`Successfully transferred ${fileName} to table ${table}`);
  }

  // Update show table using new data from temp tables
  await client.query(`
    INSERT INTO show(imdb_id, title, start_year, end_year, rating, num_votes)
    SELECT imdb_id,
            primary_title,
            start_year,
            end_year,
            COALESCE(imdb_rating, 0.0),
            COALESCE(num_votes, 0)
    FROM temp_title
            LEFT JOIN temp_ratings USING (imdb_id)
    WHERE title_type IN ('tvSeries', 'tvShort', 'tvSpecial', 'tvMiniSeries')
    ON CONFLICT (imdb_id) DO UPDATE
        SET title = excluded.title,
            start_year = excluded.start_year,
            end_year = excluded.end_year,
            rating = excluded.rating,
            num_votes = excluded.num_votes;
  `);
  console.log("Shows successfully updated");

  // Update episode table using new data from temp tables
  await client.query(`
    DROP TABLE IF EXISTS episode_new;
    
    CREATE TABLE episode_new AS
    SELECT show_id,
            episode_id,
            primary_title as title,
            season_num,
            episode_num,
            COALESCE(imdb_rating, 0.0) as rating,
            COALESCE(num_votes, 0) as num_votes
    FROM temp_episode
            LEFT JOIN temp_title ON (episode_id = imdb_id)
            LEFT JOIN temp_ratings USING (imdb_id)
    WHERE show_id IN (SELECT imdb_id FROM show)
    AND season_num >= 0
    AND episode_num >= 0;
    
    ALTER TABLE episode_new ADD PRIMARY KEY (episode_id);
    ALTER TABLE episode_new ADD FOREIGN KEY (show_id) REFERENCES show(imdb_id);
    CREATE INDEX ON episode_new (show_id);
    
    ALTER TABLE episode_new ALTER COLUMN show_id SET NOT NULL;
    ALTER TABLE episode_new ALTER COLUMN episode_id SET NOT NULL;
    ALTER TABLE episode_new ALTER COLUMN season_num SET NOT NULL;
    ALTER TABLE episode_new ALTER COLUMN episode_num SET NOT NULL;
    ALTER TABLE episode_new ALTER COLUMN rating SET NOT NULL;
    ALTER TABLE episode_new ALTER COLUMN num_votes SET NOT NULL;
    
    DROP TABLE IF EXISTS episode;
    ALTER TABLE episode_new RENAME TO episode;
  `);
  console.log("Episodes successfully updated");
}
