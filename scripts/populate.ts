/**
 * Standalone script to populate the database with IMDB data Usage: pnpm run
 * populate
 */
import { update } from "@/lib/scraper/db-uploader";

async function main() {
  console.log("Starting database population...");
  console.log("This will download IMDB data files and update the database.");
  console.log(
    "This process may take several minutes depending on file sizes and network speed.\n",
  );

  try {
    const startTime = Date.now();
    await update();
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(
      `\n✅ Database population completed successfully in ${duration} seconds!`,
    );
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database population failed:");
    console.error(error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.cause) {
      console.error("Caused by:", error.cause);
    }
    process.exit(1);
  }
}

main();
