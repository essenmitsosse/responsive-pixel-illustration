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
