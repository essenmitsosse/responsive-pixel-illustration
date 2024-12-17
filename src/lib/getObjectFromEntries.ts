/**
 * Uses same implementation as Object.fromEntries, but has proper typing for the
 * keys of the resulting object
 */
const getObjectFromEntries: <TKey extends string, T>(
  entries: ReadonlyArray<[TKey, T]>,
) => { [k in TKey]: T } = Object.fromEntries

export default getObjectFromEntries
