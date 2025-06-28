/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/rules-of-hooks */
import { PostgreSqlContainer } from "@testcontainers/postgresql";
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
    const container = await new PostgreSqlContainer("postgres:17")
      .withExposedPorts(5432)
      .start();

    const db = drizzle({
      client: new Pool({ connectionString: container.getConnectionUri() }),
    });

    await setUpSchema(db);
    await use(db);
    // Clean up
    await db.$client.end();
    await container.stop();
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
