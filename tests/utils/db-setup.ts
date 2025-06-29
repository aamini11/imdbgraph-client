import { PostgreSqlContainer } from "@testcontainers/postgresql";

export default async function setup() {
  const contaier = await new PostgreSqlContainer("postgres:17")
    .withExposedPorts(5432)
    .start();

  // Clean up
  return async () => {
    await contaier.stop();
  };
}
