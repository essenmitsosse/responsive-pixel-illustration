import listConfigBase from './eslint/listConfigBase.js'
import listConfigBaseTypescript from './eslint/listConfigBaseTypescript.js'
import listConfigCommentsEslint from './eslint/listConfigCommentsEslint.js'
import listConfigImport from './eslint/listConfigImport.js'
import listConfigImportStyle from './eslint/listConfigImportStyle.js'
import listConfigStylistic from './eslint/listConfigStylistic.js'
import listConfigTypeScript from './eslint/listConfigTypescript.js'

/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigEslint = [
  ...listConfigBaseTypescript,

  ...listConfigBase,
  ...listConfigCommentsEslint,
  ...listConfigImport,
  ...listConfigImportStyle,
  ...listConfigStylistic,
  ...listConfigTypeScript,

  /** Global ignores */
  {
    ignores: ['tsbuild', 'dist'],
  },
]

export default listConfigEslint
