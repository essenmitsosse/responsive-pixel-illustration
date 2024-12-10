import playwright from 'eslint-plugin-playwright'

/**
 * Playwright rules
 * {@link https://github.com/playwright-community/eslint-plugin-playwright}
 */
/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigPlaywright = [
  {
    ...playwright.configs['flat/recommended'],
    files: ['**/*.spec.*'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,

      /**
       * This rule is redundant, because this is already checked by TypeScript
       * and it actually gives false negatives.
       **/
      'playwright/valid-title': 'off',
    },
  },
]

export default listConfigPlaywright
