export const getRandom = (
  seed: number,
): {
  getFloat(): number
  getIf(chance?: number): boolean
  getRandom(min: number, max: number): number
  getRandomFloat(min: number, max: number): number
} => {
  const denom = Math.pow(2, 31)
  const a = 11
  const b = 19
  const c = 8

  // x = Math.pow( seed, 3 ) + 88675123 || 88675123,
  let x = seed || Math.floor(Math.random() * 4294967296)
  let t = x ^ (x << a)

  const getFloat = (): number => {
    const t = x ^ (x << a)

    return (x = x ^ (x >> c) ^ (t ^ (t >> b))) / denom
  }

  x = x ^ (x >> c) ^ (t ^ (t >> b))

  t = x ^ (x << a)

  x = x ^ (x >> c) ^ (t ^ (t >> b))

  t = x ^ (x << a)

  x = x ^ (x >> c) ^ (t ^ (t >> b))

  return {
    getFloat,

    getIf(chance): boolean {
      return (chance || 0.2) > getFloat()
    },

    getRandom(min, max): number {
      return Math.floor((max - min + 1) * getFloat() + min)
    },

    getRandomFloat(min, max): number {
      return (max - min) * getFloat() + min
    },
  }
}
