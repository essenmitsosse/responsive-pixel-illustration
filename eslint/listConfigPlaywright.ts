import playwright from 'eslint-plugin-playwright'

import type { Linter } from 'eslint'

/**
 * Playwright rules
 * {@link https://github.com/playwright-community/eslint-plugin-playwright}
 */
const listConfigPlaywright: ReadonlyArray<Linter.Config> = [
  {
    ...playwright.configs['flat/recommended'],
    files: ['**/*.spec.*'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,

      /**
       * This rule is redundant, because this is already checked by TypeScript
       * and it actually gives false negatives.
       */
      'playwright/valid-title': 'off',
    },
  },
]

export default listConfigPlaywright
