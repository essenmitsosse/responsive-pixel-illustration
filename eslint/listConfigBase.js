import js from '@eslint/js'
import globals from 'globals'

/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigEslintBase = [
  {
    languageOptions: { globals: { ...globals.browser, process: true } },
    rules: {
      ...js.configs.recommended.rules,

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
