import js from '@eslint/js'
import globals from 'globals'

import type { Linter } from 'eslint'

const listConfigEslintBase: ReadonlyArray<Linter.Config> = [
  {
    languageOptions: { globals: { ...globals.browser, process: true } },
    rules: {
      ...js.configs.recommended.rules,

      /**
       * Enforces braces around arrow function bodies as needed.
       *
       * {@link https://eslint.org/docs/latest/rules/arrow-body-style}
       */
      'arrow-body-style': 'error',

      /**
       * Enforce curly braces for all statements. Otherwise it would for example
       * be possible to have `if` statements without curly braces, leading to
       * inconsistant style. {@link https://eslint.org/docs/latest/rules/curly}
       */
      'curly': 'error',

      /**
       * Enforce dot notation whenever possible
       * {@link https://eslint.org/docs/latest/rules/dot-notation#allowpattern}
       */
      'dot-notation': 'error',

      /**
       * Overwrite AirBnB rule, to _always_ enforce `eqeqeq` (AirBnB allows `==`
       * for `null`, which can lead to inconsistant style) {@link eqeqeq}
       */
      'eqeqeq': ['error', 'always'],

      /**
       * Disable use of `console`
       * {@link https://eslint.org/docs/latest/rules/no-console}
       */
      'no-console': 'error',

      /**
       * Disallow comments on the same line as the code
       * {@link https://eslint.org/docs/latest/rules/no-inline-comments}
       */
      'no-inline-comments': 'error',

      /**
       * Disallows importing via relative parent folders
       * {@link https://eslint.org/docs/latest/rules/no-restricted-imports}
       */
      'no-restricted-imports': [1, { patterns: ['../'] }],

      /**
       * Disallow unnecessary computed property keys in objects and classes
       * {@link https://eslint.org/docs/latest/rules/no-useless-computed-key#rule-details}
       */
      'no-useless-computed-key': 'error',

      'no-unused-vars': 'off',
    },
  },

  /** Separate config for config files (which have access to a Node env) */
  {
    files: ['*.config.*'],
    languageOptions: { globals: { ...globals.node, process: true } },
  },
]

export default listConfigEslintBase
