import eslintComments from '@eslint-community/eslint-plugin-eslint-comments'

import type { Linter } from 'eslint'

/**
 * Enforces a description for `eslint-disable` comments
 * {@link https://eslint-community.github.io/eslint-plugin-eslint-comments}
 */
const listConfigCommentsEslint: ReadonlyArray<Linter.Config> = [
  {
    plugins: { '@eslint-community/eslint-comments': eslintComments },
    rules: {
      /**
       * Additional ESLint rules for ESLint directive comments (e.g.
       * `//eslint-disable-line`).
       * {@link https://eslint-community.github.io/eslint-plugin-eslint-comments/}
       */
      ...eslintComments.configs.recommended.rules,

      /** {@link https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/require-description.html} */
      '@eslint-community/eslint-comments/require-description': [
        'error',
        { ignore: ['eslint-enable'] },
      ],
    },
  },
]

export default listConfigCommentsEslint
