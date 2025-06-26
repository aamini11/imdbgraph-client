import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "clover"],
      include: ["src/**/*.{ts,tsx}"],
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.test.{ts,tsx}"],
          alias: {
            "@": "/src",
          },
        },
      },
      {
        test: {
          name: "integration",
          include: ["tests/database/*.test.{ts,tsx}"],
          alias: {
            "@": "/src",
          },
          testTimeout: 30000, // 30 seconds for database tests
        },
      },
    ],
  },
});
