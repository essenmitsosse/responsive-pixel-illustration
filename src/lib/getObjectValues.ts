/**
 * Uses same implementation as Object.key, but has proper typing to keep object
 * keys
 */
const getObjectValues: <TKey extends string, T>(object: {
  [k in TKey]: T
}) => ReadonlyArray<T> = Object.values

export default getObjectValues
