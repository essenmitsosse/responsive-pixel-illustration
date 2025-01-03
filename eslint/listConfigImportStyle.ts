import typescript from '@typescript-eslint/eslint-plugin'
// @ts-expect-error - currently no types for this package
import importPlugin from 'eslint-plugin-import'

import type { Linter } from 'eslint'

/** Set of rules to ensure we get a consistant import style and sorting. */
const listConfigImportStyle: ReadonlyArray<Linter.Config> = [
  {
    plugins: {
      // @ts-expect-error - TODO: Check for updates so this actually works
      '@typescript-eslint-import-style': typescript,
      'import-import-style': importPlugin,
    },
    rules: {
      /** {@link https://typescript-eslint.io/rules/consistent-type-imports/} */
      '@typescript-eslint-import-style/consistent-type-imports': [
        'warn',
        { fixStyle: 'separate-type-imports', prefer: 'type-imports' },
      ],

      /** {@link https://typescript-eslint.io/rules/no-import-type-side-effects/} */
      '@typescript-eslint-import-style/no-import-type-side-effects': 'error',

      /** {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/consistent-type-specifier-style.md} */
      'import-import-style/consistent-type-specifier-style': 'error',

      /**
       * Enforces consistant sorting of imports
       * {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md}
       */
      'import-import-style/order': [
        'error',
        {
          'alphabetize': {
            caseInsensitive: true,
            order: 'asc',
          },
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          'pathGroups': [
            {
              group: 'internal',
              pattern: '@/**',
              position: 'before',
            },
          ],
          'pathGroupsExcludedImportTypes': ['builtin', 'external', 'type'],
          'warnOnUnassignedImports': true,
        },
      ],
    },
  },
]

export default listConfigImportStyle
