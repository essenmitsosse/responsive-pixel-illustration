/** @type {import('prettier').Config} */
const configPrettier = {
  /**
   * Prettier plugin for format comment blocks and convert to standard Match
   * with Visual studio and other IDE which support jsdoc and comments as
   *
   * Markdown. {@link https://github.com/hosseinmd/prettier-plugin-jsdoc}
   */
  plugins: ['prettier-plugin-jsdoc'],
  quoteProps: 'consistent',
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}

export default configPrettier
