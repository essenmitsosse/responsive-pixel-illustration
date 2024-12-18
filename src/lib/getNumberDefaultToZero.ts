/**
 * Gets an unknown value and:
 *
 * - Returns it if its a `number`
 * - Return `0` for any other case
 * - Try to cast a string to a number
 */
export const getNumberDefaultToZero = (value: unknown): number =>
  typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? parseFloat(value)
      : 0
