const getRandom = (() => {
  const m = 2147483647
  const a = 16807
  const c = 17
  const z = 3

  let i = 0

  return function (seed) {
    let thisZ = seed || z

    return {
      one() {
        return (thisZ = (a * thisZ + c) % m) / m
      },
      count(c) {
        return Math.floor(((thisZ = (a * thisZ + c) % m) / m) * c)
      },
      seed() {
        return (thisZ = (a * thisZ + c) % m) + (i += 1)
      },
    }
  }
})()

const getSeedHandler = () => {
  const getSeed = getRandom().seed

  let count = 0

  const i = []

  return {
    reset() {
      let l = count

      while (l--) {
        i[l] = 0
      }
    },
    get(j) {
      const seed = j || getSeed()
      const nr = (count += 1)

      return function () {
        return getRandom(seed + i[nr]++ || 0)
      }
    },
  }
}

export default getSeedHandler
