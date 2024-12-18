/**
 * Uses same implementation as Object.entries, but has proper typing to keep
 * object keys
 */
const getObjectEntries: <TKey extends string, T>(object: {
  [k in TKey]: T
}) => ReadonlyArray<[TKey, T]> = Object.entries

export default getObjectEntries
