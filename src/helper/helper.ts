import type { ColorRgb } from './typeColor'
import type { Max, SizeIn, SizeOut } from './typeSize'

export const getSmallerDim = <TA, TUse>(
  x: SizeIn<TA, TUse>,
): SizeOut<TA, TUse> => {
  const o: SizeOut<TA, TUse> = { r: x.r }
  const max: Max = {
    r: x.r2 || x.r,
    otherDim: true,
  }

  if (x.a) {
    o.a = x.a

    max.a = x.a
  }

  if (x.useSize) {
    o.useSize = x.useSize[0]

    max.useSize = x.useSize[1] || x.useSize[0]
  }

  if (x.r >= 0 && !x.getBiggerDim) {
    o.max = max
  } else {
    o.min = max
  }

  return o
}

export const getBiggerDim = <TA, TUse>(
  x: SizeIn<TA, TUse>,
): SizeOut<TA, TUse> => {
  x.getBiggerDim = true

  return getSmallerDim(x)
}

export const mult = <TR, TUse, TA>(
  r: TR,
  use: TUse,
  a: TA,
): {
  a: TA
  r: TR
  useSize: TUse
} => ({ r, useSize: use, a })

export const sub = <TUse>(use: TUse): { r: number; useSize: TUse } => ({
  r: -1,
  useSize: use,
})

export const darken = (darken: ColorRgb, strength: number) => {
  let l = darken.length

  const finalDarken: Array<number> = []

  strength /= 255

  while (l--) {
    finalDarken[l] = darken[l] * strength
  }

  return (color: ColorRgb, copy?: ColorRgb): ColorRgb => {
    let l = color.length

    const newColor: ColorRgb = copy || [0, 0, 0]

    while (l--) {
      newColor[l] = Math.floor(color[l] * finalDarken[l])
    }

    return newColor
  }
}

export const lighten = (lighten: ColorRgb, strength: number) => {
  let l = lighten.length

  const finaleLighten: ColorRgb = [0, 0, 0]

  while (l--) {
    finaleLighten[l] = lighten[l] * strength
  }

  return (color: ColorRgb): ColorRgb => {
    let l = color.length

    const newColor: ColorRgb = [0, 0, 0]

    let thisC: number

    while (l--) {
      newColor[l] = (thisC = color[l] + finaleLighten[l]) > 255 ? 255 : thisC
    }

    return newColor
  }
}

export const multiplyColor = (rgb: ColorRgb, factor: number): ColorRgb => [
  rgb[0] * factor,
  rgb[1] * factor,
  rgb[2] * factor,
]

export const getLinkListPusher = <T>(linkList: Array<T>): ((link: T) => T) =>
  function (link) {
    linkList.push(link)

    return link
  }

export const getRandomInt = (i: number): number => Math.floor(Math.random() * i)

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
