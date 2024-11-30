import tsParser from "@typescript-eslint/parser";

/**
 * Basic setup to make sure TypeScript files can be linted and types are
 * available to the linting rules
 */
/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigSetupTypescript = [
    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { modules: true },
                ecmaVersion: "latest",
                project: "tsconfig.json",
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        settings: {
            "import/parsers": {
                "@typescript-eslint/parser": [
                    ".ts",
                    ".tsx",
                    ".js",
                    ".cjs",
                    ".mjs",
                    ".jsx",
                ],
            },
        },
    },
];

export default listConfigSetupTypescript;
