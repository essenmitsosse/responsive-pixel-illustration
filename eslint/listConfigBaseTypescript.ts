import tsParser from '@typescript-eslint/parser'

import type { Linter } from 'eslint'

/**
 * Basic setup to make sure TypeScript files can be linted and types are
 * available to the linting rules
 */
const listConfigSetupTypescript: ReadonlyArray<Linter.Config> = [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: 'tsconfig.json',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': [
          '.ts',
          '.tsx',
          '.js',
          '.cjs',
          '.mjs',
          '.jsx',
        ],
      },
    },
  },
]

export default listConfigSetupTypescript
