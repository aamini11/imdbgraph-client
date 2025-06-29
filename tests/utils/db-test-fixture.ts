/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/rules-of-hooks */
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import fs from "node:fs/promises";
import paths from "node:path";
import { Pool } from "pg";
import { test as baseTest } from "vitest";

type Database = NodePgDatabase & {
  $client: Pool;
};

export const testWithDb = baseTest.extend<{ db: Database }>({
  db: async ({}, use) => {
    const db = drizzle({
      client: new Pool({ connectionString: process.env.DATABASE_URL }),
    });

    await setUpSchema(db);
    await use(db);
    // Clean up
    await db.$client.end();
  },
});

/**
 * Run SQL schema migration files.
 */
async function setUpSchema(db: NodePgDatabase) {
  const migrations = paths.join(process.cwd(), "./drizzle");
  const files = await fs.readdir(migrations);
  const sqlFiles = files.filter((file) => file.endsWith(".sql")).sort();
  for (const file of sqlFiles) {
    const content = await fs.readFile(paths.join(migrations, file), "utf-8");
    // Split on statement breakpoints and execute each statement
    const statements = content
      .split("--> statement-breakpoint")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);
    for (const statement of statements) {
      await db.execute(statement);
    }
  }
}
