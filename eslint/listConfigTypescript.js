import typescript from '@typescript-eslint/eslint-plugin'

const listConfigTypeScript = [
  {
    rules: {
      /**
       * Basic ESLint TypeScript rules, that work without type checking
       * {@link https://typescript-eslint.io/}
       */
      ...typescript.configs['eslint-recommended'].rules,
    },
  },

  /**
   * Overwrite default rule by ESLint with the `@typescript-eslint` version
   * which respects some TypeScript specfics. The JavaScript version of this
   * rule will sometimes give false negatives for TypeScript types.
   */
  {
    plugins: { '@typescript-eslint': typescript },
    rules: {
      'no-unused-vars': 'off',

      /**
       * This also adds some exception, where an unused variable is followed
       * by a used parameter, in which case fixing this rule would mean
       * changing the function signature.
       */
      '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used' }],
    },
  },
]

export default listConfigTypeScript
