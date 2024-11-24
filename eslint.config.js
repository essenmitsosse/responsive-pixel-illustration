import typescript from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-config-prettier'
import js from '@eslint/js'

/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const eslintConfig = [
  {
    rules: js.configs.recommended.rules,
    languageOptions: {
      globals: {
        window: true,
      },
    },
  },
  prettier,
  {
    plugins: {
      '@typescript-eslint': typescript,
    },
    files: ['*.ts', '*.vue'],
    rules: {
      ...typescript.configs['eslint-recommended'].rules,
      // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    },
    parserOptions: {
      project: ['./tsconfig.json', './tsconfig.node.json'],
    },
  },
]

export default eslintConfig
