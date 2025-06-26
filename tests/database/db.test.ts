import { testWithDb } from "./utils/db-test-case";
import { customer } from "@/db/schema";
import { describe, expect } from "vitest";

// =============================================================================
// Tests
// =============================================================================
describe("Database Tests", () => {
  testWithDb("Loading sample files into database", async ({ db }) => {
    expect(await db.select().from(customer)).toHaveLength(0);
    const fakeCustomer = {
      id: "2124832",
      name: "John Doe",
      address: "123 Main St",
    };
    await db.insert(customer).values(fakeCustomer);
    expect(await db.select().from(customer)).toEqual([fakeCustomer]);
  });
});
