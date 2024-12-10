// @ts-expect-error - currently no types for this package
import importPlugin from 'eslint-plugin-import'
import unusedImportPlugin from 'eslint-plugin-unused-imports'

import type { Linter } from 'eslint'

/**
 * This plugin enforces rules for imports
 * {@link https://github.com/import-js/eslint-plugin-import/tree/main}
 */
const listConfigImport: ReadonlyArray<Linter.Config> = [
  {
    plugins: { import: importPlugin },
    rules: {
      /**
       * Ensure consistent use of file extension within the import path
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/extensions.md}
       */
      'import/extensions': [
        'error',
        { ts: 'never', tsx: 'never', js: 'always' },
      ],

      /**
       * Disallow non-import statements appearing before import statements
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/first.md}
       */
      'import/first': 'error',

      /**
       * Require a newline after the last import/require in a group
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md}
       */
      'import/newline-after-import': 'error',

      /**
       * Reports if a module's default export is unnamed
       * {@link https://github.com/import-js/eslint-plugin-import/blob/d9b712ac7fd1fddc391f7b234827925c160d956f/docs/rules/no-anonymous-default-export.md}
       */
      'import/no-anonymous-default-export': [
        'error',
        {
          /**
           * This needs to be manually enabled, since it is set to `true` by
           * default, for backwards compatibility
           */
          allowCallExpression: false,
        },
      ],

      /**
       * Forbid cyclical dependencies between modules. While it is nice to check
       * this with infinite depth, it is incredible expensive and slows down
       * ESLint significantly.
       * {@link https://github.com/import-js/eslint-plugin-import/blob/d81f48a2506182738409805f5272eff4d77c9348/docs/rules/no-cycle.md}
       */
      'import/no-cycle': ['error', { maxDepth: 1 }],

      /**
       * Disallow duplicate imports
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md}
       */
      'import/no-duplicates': 'error',

      /**
       * Forbid the import of external modules that are not declared in the
       * `package.json`'s `dependencies`
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md}
       */
      'import/no-extraneous-dependencies': 'error',

      /**
       * Do not allow a default import name to match a named export
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md}
       */
      'import/no-named-as-default': 'error',

      /**
       * Prevent importing the default as if it were named
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-default.md}
       */
      'import/no-named-default': 'error',

      /**
       * Disallow namespace imports
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-namespace.md}
       */
      'import/no-namespace': 'error',

      /**
       * Use this rule to prevent imports to folders in relative parent paths.
       * {@link https://github.com/import-js/eslint-plugin-import/blob/c34f14f67f077acd5a61b3da9c0b0de298d20059/docs/rules/no-relative-parent-imports.md}
       */
      'import/no-relative-parent-imports': 'error',

      /**
       * Forbid a module from importing itself
       * {@link https://github.com/import-js/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-self-import.md}
       */
      'import/no-self-import': 'error',

      /**
       * Prevent unassigned imports to avoid unintended side-effect
       * {@link https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-unassigned-import.md}
       */
      'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],

      /**
       * Ensures that there are no useless path segments
       * {@link https://github.com/import-js/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/no-useless-path-segments.md}
       */
      'import/no-useless-path-segments': 'error',
    },
  },

  /**
   * Detect unused imports and most importantly: Make them fixable.
   * {@link https://github.com/sweepline/eslint-plugin-unused-imports} */
  {
    plugins: { 'unused-imports': unusedImportPlugin },
    rules: { 'unused-imports/no-unused-imports': 'error' },
  },

  {
    files: ['*.config.*', 'eslint/**/*'],
    plugins: { import: importPlugin },
    rules: {
      /**
       * Extensions are required for config files, because they don't go through
       * vite
       */
      'import/extensions': 'off',
    },
  },
]

export default listConfigImport
