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
       * A "Thenable" value is an object which has a `then` method, such as a
       * Promise. The `await` keyword is generally used to retrieve the result
       * of calling a Thenable's `then` method.
       *
       * If the `await` keyword is used on a value that is not a Thenable, the
       * value is directly resolved, but will still pause execution until the
       * next microtask. While doing so is valid JavaScript, it is often a
       * programmer error, such as forgetting to add parenthesis to call a
       * function that returns a Promise.
       *
       * {@link https://typescript-eslint.io/rules/await-thenable}
       */
      '@typescript-eslint/await-thenable': 'error',

      /**
       * This rule enforces that functions do have an explicit return type
       * annotation.
       *
       * {@link https://typescript-eslint.io/rules/explicit-function-return-type/}
       */
      '@typescript-eslint/explicit-function-return-type': 'error',

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
    },
  },

  /** Disable rule for .js, because return types can't be typed in `.js` fiels */
  {
    files: ['**/*.js'],
    plugins: { '@typescript-eslint': typescript },
    rules: { '@typescript-eslint/explicit-function-return-type': 'off' },
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
