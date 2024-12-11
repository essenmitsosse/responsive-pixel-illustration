const getIsUnknownObject = (
  x: unknown,
): x is {
  [key in string]?: unknown
} => x !== null && typeof x === 'object' && !Array.isArray(x)

export default getIsUnknownObject
