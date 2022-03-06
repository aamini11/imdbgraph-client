module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",

  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],

      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"] // Specify it only for TypeScript files
      }
    }
  ],

  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
    "next/core-web-vitals",
    "prettier"
  ]
};
