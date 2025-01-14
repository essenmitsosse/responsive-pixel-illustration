const getRandom = (() => {
  const m = 2147483647
  const a = 16807
  const c = 17
  const z = 3

  let i = 0

  return (
    seed?: number,
  ): {
    count: (c: number) => number
    one: () => number
    seed: () => number
  } => {
    let thisZ = seed || z

    return {
      one: (): number => (thisZ = (a * thisZ + c) % m) / m,
      count: (c: number): number =>
        Math.floor(((thisZ = (a * thisZ + c) % m) / m) * c),
      seed: (): number => (thisZ = (a * thisZ + c) % m) + (i += 1),
    }
  }
})()

const getSeedHandler = (): {
  get: (j?: number) => () => {
    count: (c: number) => number
    one: () => number
    seed: () => number
  }
  reset: () => void
} => {
  const getSeed = getRandom().seed

  let count = 0
  let i: Array<number> = []

  return {
    reset: (): void => {
      i = new Array(count).fill(0)
    },
    get: (j?: number) => {
      const seed = j || getSeed()
      const nr = count

      count += 1

      return () => {
        if (nr in i === false || i[nr] === undefined) {
          throw new Error(
            `Unexpected error: Trying to access non-existing seed #${nr}`,
          )
        }

        return getRandom(seed + i[nr]++ || 0)
      }
    },
  }
}

export default getSeedHandler
