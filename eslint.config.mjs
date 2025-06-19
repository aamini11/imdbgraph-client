import { FlatCompat } from "@eslint/eslintrc";

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
          "patterns": [
            {
              "group": ["../**/*"],
              "message": "Please use absolute imports with '@/'. Example: '@/lib/utils'."
            }
          ]
        }
      ]
    },
  },
];

export default config;
