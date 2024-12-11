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

      /**
       * Require `let` or `const` instead of var
       *
       * {@link https://eslint.org/docs/latest/rules/no-var}
       */
      'no-var': 'error',

      /**
       * Require or disallow method and property shorthand syntax for object
       * literals {@link https://eslint.org/docs/latest/rules/object-shorthand}
       */
      'object-shorthand': 'error',

      /**
       * Enforce variables to be declared separately in functions, instead of as
       * a list.
       *
       * {@link https://eslint.org/docs/latest/rules/one-var}
       */
      'one-var': ['error', 'never'],

      /**
       * This rule enforces usage of destructuring instead of accessing a
       * property through a member expression. This is only enforced for
       * variable declarations, not for assignment expressions. Destructering in
       * assignment expressions clashes with not using semicolons and leads to
       * weird syntax.
       *
       * {@link https://eslint.org/docs/latest/rules/prefer-destructuring}
       */
      'prefer-destructuring': [
        'error',
        {
          AssignmentExpression: { array: false, object: false },
          VariableDeclarator: { array: true, object: true },
        },
        { enforceForRenamedProperties: false },
      ],

      /**
       * This works alongside `import/order` to make sure to also order named
       * imports {@link https://eslint.org/docs/latest/rules/sort-imports}
       */
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
    },
  },

  /** Separate config for config files (which have access to a Node env) */
  {
    files: ['*.config.*'],
    languageOptions: { globals: { ...globals.node, process: true } },
  },
]

export default listConfigEslintBase
