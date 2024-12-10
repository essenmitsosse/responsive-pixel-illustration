import stylistic from '@stylistic/eslint-plugin-ts'

/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigStylistic = [
  {
    plugins: { '@stylistic/ts': stylistic },
    rules: {
      /**
       * Enforce the consistent use of either backticks, double, or single
       * quotes. This doubles with the Prettier rule, but also removes
       * unnesssary backticks.
       *
       * {@link https://eslint.style/rules/js/quotes}
       */
      '@stylistic/ts/quotes': ['error', 'single', { avoidEscape: true }],
    },
  },
]

export default listConfigStylistic
