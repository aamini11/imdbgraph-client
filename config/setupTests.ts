import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

jest.mock("@/lib/db/drizzle", async () => {
  const postgresContainer = await new PostgreSqlContainer("postgres").start();
  const pool = new Pool({
    connectionString: postgresContainer.getConnectionUri(),
  });
  const db = drizzle({
    client: pool,
  });
  return {
    db: db,
    pool: pool,
  };
});