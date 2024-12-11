import stylistic from '@stylistic/eslint-plugin-ts'

import type { Linter } from 'eslint'

const listConfigStylistic: ReadonlyArray<Linter.Config> = [
  {
    plugins: { '@stylistic/ts': stylistic },
    rules: {
      /**
       * This rule requires or disallows blank lines between the given 2 kinds
       * of statements. Properly blank lines help developers to understand the
       * code.
       * {@link https://eslint.style/rules/js/padding-line-between-statements}
       */
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        /** No new line between expression */
        { blankLine: 'always', next: 'expression', prev: 'expression' },

        /** New line before return statement */
        { blankLine: 'always', next: 'return', prev: '*' },

        /** New line around block-like */
        { blankLine: 'always', next: 'block-like', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'block-like' },

        /** Always new line around const blocks */
        { blankLine: 'always', next: 'const', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'const' },
        /** No new line between const */
        { blankLine: 'never', next: 'const', prev: 'const' },

        /** New line before export */
        { blankLine: 'always', next: 'export', prev: '*' },
      ],

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
