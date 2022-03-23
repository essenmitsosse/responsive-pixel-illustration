module.exports = {
	root: true,
	env: {
		node: true,
	},
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "prettier"],
	parserOptions: {
		ecmaVersion: 2022,
	},
	overrides: [
		// This makes sure typescript rules are only used for typescript files
		// https://stackoverflow.com/questions/58510287/parseroptions-project-has-been-set-for-typescript-eslint-parser
		{
			files: ["*.ts", "*.vue"],
			extends: [
				"plugin:@typescript-eslint/recommended",
				// "plugin:@typescript-eslint/recommended-requiring-type-checking",
			],
			parserOptions: {
				project: ["./tsconfig.json"],
			},
		},
	],
};
