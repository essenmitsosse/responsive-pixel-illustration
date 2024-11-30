import listConfigBaseTypescript from "./eslint/listConfigBaseTypescript.js"

/** @type {ReadonlyArray<import('eslint').Linter.Config>} */
const listConfigEslint = [
  ...listConfigBaseTypescript,

  /** Global ignores */
  {
    ignores: ["tsbuild", "dist"],
  },
]

export default listConfigEslint
