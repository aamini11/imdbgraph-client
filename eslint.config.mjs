import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const noRelativeImportsRule = {
  ignores: ["*.test.*", "**/__tests__/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["./", "../"],
            message:
              "Please use absolute imports with '@/'. Example: '@/lib/utils'.",
          },
        ],
      },
    ],
  },
};

/** @type {import("eslint").Linter.Config[]} */
export let config = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  noRelativeImportsRule,
  ...compat.config({
    extends: [
      "plugin:@tanstack/eslint-plugin-query/recommended",
      "next/core-web-vitals",
    ],
  }),
  prettier,
];

export default defineConfig(config);
