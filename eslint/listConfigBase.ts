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
