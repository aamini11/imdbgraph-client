// TEMPLATE:
// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler

const nextJest = require("next/jest");

// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({ dir: "./", });

/** @type {import('jest').Config} */
const customJestConfig = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
