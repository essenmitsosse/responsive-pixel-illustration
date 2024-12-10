// @ts-expect-error - currently no types for this package
import eslintComments from 'eslint-plugin-eslint-comments'

import type { Linter } from 'eslint'

/**
 * Enforces a description for `eslint-disable` comments
 * {@link https://mysticatea.github.io/eslint-plugin-eslint-comments}
 */
const listConfigCommentsEslint: ReadonlyArray<Linter.Config> = [
  {
    plugins: { 'eslint-comments': eslintComments },
    rules: {
      /**
       * Additional ESLint rules for ESLint directive comments (e.g.
       * `//eslint-disable-line`).
       * {@link https://mysticatea.github.io/eslint-plugin-eslint-comments/}
       */
      ...eslintComments.configs.recommended.rules,

      /** {@link https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/require-description.html} */
      'eslint-comments/require-description': [
        'error',
        { ignore: ['eslint-enable'] },
      ],
    },
  },
]

export default listConfigCommentsEslint
