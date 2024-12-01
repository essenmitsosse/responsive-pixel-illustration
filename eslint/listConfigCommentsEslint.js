import eslintComments from 'eslint-plugin-eslint-comments'

/**
 * Enforces a description for `eslint-disable` comments
 * {@link https://mysticatea.github.io/eslint-plugin-eslint-comments}
 */
/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigCommentsEslint = [
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
