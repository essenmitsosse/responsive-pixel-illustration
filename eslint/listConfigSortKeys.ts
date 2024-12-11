// @ts-expect-error - currently no types for this package
import sortKeys from 'eslint-plugin-sort-keys'

import type { Linter } from 'eslint'

/**
 * This plugin forks the original `sort-keys` ESLint rule, but makes it fixable.
 *
 * {@link https://github.com/leo-buneev/eslint-plugin-sort-keys-fix}
 */
const listConfigSortKeys: ReadonlyArray<Linter.Config> = [
  {
    files: ['*.config.*', 'eslint/**'],
    plugins: {
      'sort-keys': sortKeys,
    },
    rules: {
      /**
       * This rule uses the `sort-keys` plugin that forked the original
       * `sort-keys` ESLint rule, but makes it fixable.
       * {@link https://github.com/leo-buneev/eslint-plugin-sort-keys-fix}
       */
      'sort-keys/sort-keys-fix': 'error',
    },
  },
]

export default listConfigSortKeys
