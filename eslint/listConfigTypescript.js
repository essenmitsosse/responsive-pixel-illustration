import typescript from '@typescript-eslint/eslint-plugin'

const listConfigTypeScript = [
  {
    rules: {
      /**
       * Basic ESLint TypeScript rules, that work without type checking
       * {@link https://typescript-eslint.io/}
       */
      ...typescript.configs['eslint-recommended'].rules,

      /**
       * Basic ESLint TypeScript rules, that require type checking
       * {@link https://typescript-eslint.io/linting/typed-linting/}
       */
      ...typescript.configs.recommended.rules,

      /**
       * Assigning a variable to this instead of properly using arrow lambdas
       * may be a symptom of pre-ES6 practices or not managing scope well.
       *
       * {@link https://typescript-eslint.io/rules/no-this-alias/}
       *
       * This rule is enabled in the recommended rule that, but currently the
       * code needs to violate it in quite a few places. As suggested in the
       * docs, this rule for now only enforces a consistent alias name `that`.
       *
       * TODO: Refactor code in such a way that aliasing `this` is not needed.
       * */
      '@typescript-eslint/no-this-alias': ['error', { allowedNames: ['that'] }],

      '@typescript-eslint/no-unused-expressions': 'off',
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
