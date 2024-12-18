/**
 * Gets an unknown value and:
 *
 * - Returns it if its a `number`
 * - Return `0` for any other case
 *
 * This DOESN'T case `string` to `number`
 */
export const getNumberDefaultToZero = (value: unknown): number =>
  typeof value === 'number' ? value : 0
