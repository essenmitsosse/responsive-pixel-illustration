import listConfigBase from './eslint/listConfigBase.js'
import listConfigBaseTypescript from './eslint/listConfigBaseTypescript.js'
import listConfigCommentsEslint from './eslint/listConfigCommentsEslint.js'
import listConfigImport from './eslint/listConfigImport.js'
import listConfigImportStyle from './eslint/listConfigImportStyle.js'
import listConfigPlaywright from './eslint/listConfigPlaywright.js'
import listConfigSortKeys from './eslint/listConfigSortKeys.js'
import listConfigStylistic from './eslint/listConfigStylistic.js'
import listConfigTypeScript from './eslint/listConfigTypescript.js'

import type { Linter } from 'eslint'

const listConfigEslint: ReadonlyArray<Linter.Config> = [
  ...listConfigBaseTypescript,

  ...listConfigBase,
  ...listConfigCommentsEslint,
  ...listConfigImport,
  ...listConfigImportStyle,
  ...listConfigPlaywright,
  ...listConfigSortKeys,
  ...listConfigStylistic,
  ...listConfigTypeScript,

  /** Global ignores */
  {
    ignores: ['tsbuild', 'dist'],
  },
]

export default listConfigEslint
