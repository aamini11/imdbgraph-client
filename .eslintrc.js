module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "next/core-web-vitals",
        "prettier",
    ],
    root: true,

    overrides: [
        {
            files: ["**/*.{ts,tsx}"],
            parser: "@typescript-eslint/parser",
            extends: ["plugin:@typescript-eslint/strict", "plugin:@typescript-eslint/stylistic"],
            plugins: ["@typescript-eslint"],
            rules: {
                "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            },
        },
    ],

    rules: {
        semi: "error",
        "import/order": [
            "warn",
            {
                alphabetize: {
                    order: "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
                    caseInsensitive: true /* ignore case. Options: [true, false] */,
                },
                "newlines-between": "never",
            },
        ],
    },
};
