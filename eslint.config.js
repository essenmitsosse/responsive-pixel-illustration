import listConfigBase from './eslint/listConfigBase.js'
import listConfigBaseTypescript from './eslint/listConfigBaseTypescript.js'

/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigEslint = [
  ...listConfigBaseTypescript,

  ...listConfigBase,

  /** Global ignores */
  {
    ignores: ['tsbuild', 'dist'],
  },
]

export default listConfigEslint
