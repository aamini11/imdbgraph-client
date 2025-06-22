import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export let config = [
  ...compat.config({
    extends: [
      "plugin:@tanstack/eslint-plugin-query/recommended",
      "next/core-web-vitals",
      "next/typescript",
      "prettier",
    ],
  }),
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../**/*"],
              message:
                "Please use absolute imports with '@/'. Example: '@/lib/utils'.",
            },
          ],
        },
      ],
    },
  },
  ...tseslint.config(
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

export default config;
