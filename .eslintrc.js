module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "next/core-web-vitals",
        "prettier"
    ],

    overrides: [
        {
            files: [
                "**/__tests__/**/*.[jt]s?(x)",
                "**/?(*.)+(spec|test).[jt]s?(x)"
            ],
            env: {
                "jest/globals": true // now **/*.test.js files' env has both es6 *and* jest
            },
            extends: [
                "plugin:jest/recommended",
                "plugin:jest/style",
                "plugin:testing-library/react"
            ]
        },
        {
            files: [
                "**/*.{ts,tsx}"
            ],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ["./tsconfig.json"]
            },
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking"
            ]
        }
    ],

    rules: {
        semi: "error",
        "import/order": ["warn", {
            alphabetize: {
                order: "asc", /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
                caseInsensitive: true /* ignore case. Options: [true, false] */
            },
            "newlines-between": "never"
        }]
    }
};
