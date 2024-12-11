/**
 * Uses same implementation as Object.key, but has proper typing to keep object
 * keys
 */
const getObjectKeys: <TKey extends string>(object: {
  [k in TKey]: unknown
}) => ReadonlyArray<TKey> = Object.keys

export default getObjectKeys
