import getIsUnknownObject from '@/lib/getIsUnknownObject'
import getObjectKeys from '@/lib/getObjectKeys'

type SizeIn<TA, TUse> = {
  a: TA
  getBiggerDim: unknown
  r: number
  r2: number
  useSize: ReadonlyArray<TUse>
}

type SizeOut<TA, TUse> = {
  a?: TA
  max?: Max
  min?: Max
  r: number
  useSize?: TUse
}

type Size<T> = { r?: T; s: { rele?: T } }

type Max = {
  a?: unknown
  otherDim: boolean
  r: number
  useSize?: unknown
}

type ColorRgb = [number, number, number]

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

export const setValue = <T>(what: Size<T>, value: T): void => {
  what.r = value
}

export const setValueNew = <TRele>(what: Size<TRele>, value: TRele): void => {
  what.s.rele = value
}

export const helper = {
  getHoverChangers(): {
    changersCustomList: Array<unknown>
    changersRelativeCustomList: Array<unknown>
    list: Array<{
      change: number
      map: string
      min: number
      variable: unknown
    }>
    pushColorStandard: Array<{
      color: ColorRgb
      map: string
      max: ColorRgb
      min: ColorRgb
    }>
    hover(args: unknown): void
    pushRelativeStandard(
      min: number,
      max: number,
      map: string,
      variable: unknown,
    ): void
    pushRelativeStandardAutomatic<T extends string>(
      this: Record<T, Size<unknown>>,
      info: Record<T, { map?: unknown; max?: number; min?: number }>,
    ): void
    ready(): void
  } {
    let setValueInner = setValue

    const changersRelativeStandardList: Array<{
      change: number
      map: string
      min: number
      variable: { r?: unknown; s: { rele?: unknown } }
    }> = []
    const changersRelativeCustomList: Array<
      [Size<unknown>, (args: Record<string, number>) => void]
    > = []
    const changersColorStandardList: Array<{
      color: ColorRgb
      map: string
      max: ColorRgb
      min: ColorRgb
    }> = []
    const changersCustomList: Array<(args: Record<string, number>) => void> = []
    const pushRelativeStandard = (
      min: number,
      max: number,
      map: string,
      variable: { r?: unknown; s: { rele?: unknown } },
    ): void => {
      changersRelativeStandardList.push({
        change: max - min,
        min,
        map,
        variable,
      })
    }
    const changeColor = (
      value: number,
      map: { color: ColorRgb; max: ColorRgb; min: ColorRgb },
    ): void => {
      const [maxR, maxG, maxB] = map.max
      const [minR, minG, minB] = map.min
      const valueNeg = 1 - value

      map.color[0] = minR * valueNeg + maxR * value

      map.color[1] = minG * valueNeg + maxG * value

      map.color[2] = minB * valueNeg + maxB * value
    }

    return {
      list: changersRelativeStandardList,
      changersRelativeCustomList,
      changersCustomList,
      pushColorStandard: changersColorStandardList,

      pushRelativeStandard,

      // Takes an object, where the keys have the names of dimensions from the object which called it
      // This dimension "r" is linked to the variables max, min and can be changed by what is defined by map
      pushRelativeStandardAutomatic<T extends string>(
        this: Record<T, Size<unknown>>,
        info: Record<T, { map: string; max: number; min: number }>,
      ): void {
        if (info) {
          getObjectKeys(info).forEach((key) => {
            let currentSize:
              | number
              | {
                  r?: unknown
                  s: { rele?: unknown }
                }
              | undefined = this[key]

            if (currentSize) {
              // Assignment
              const currentInfo = info[key]

              if (getIsUnknownObject(currentInfo)) {
                if (currentInfo.map !== undefined) {
                  pushRelativeStandard(
                    currentInfo.min,
                    currentInfo.max,
                    currentInfo.map,
                    currentSize,
                  )
                } else {
                  // Just assign the max or min value
                  currentSize = currentInfo.max || currentInfo.min
                }
              } else {
                // Just assign the value
                currentSize.r = currentInfo
              }
            }
          })
        }
      },
      hover(args: Record<string, number>): void {
        let somethingToChange = false

        for (const key in args) {
          if (key !== 'width' && key !== 'height') {
            somethingToChange = true
            break
          }
        }

        if (somethingToChange) {
          let l0 = changersRelativeStandardList.length

          // Change the RELATIVE VALUE of the variable, by the STANDARD map scheme
          if (l0) {
            while (l0--) {
              const current = changersRelativeStandardList[l0]

              if (args[current.map] !== undefined) {
                setValueInner(
                  current.variable,
                  current.min + current.change * args[current.map],
                )
              }
            }
          }

          // Change the RELATIVE VALUE of the variable, by a CUSTOM map scheme
          let l1 = changersRelativeCustomList.length

          if (l1) {
            while (l1--) {
              const current = changersRelativeCustomList[l1]
              const currentValue = current[1](args)

              if (currentValue !== undefined) {
                setValueInner(current[0], currentValue)
              }
            }
          }

          let l2 = changersColorStandardList.length

          // Change a COLOR, by a STANDARD map scheme
          if (l2) {
            while (l2--) {
              const current = changersColorStandardList[l2]

              if (args[current.map] !== undefined) {
                changeColor(args[current.map], current)
              }
            }
          }

          let l3 = changersCustomList.length

          // Execute a CUSTOM FUNCTION
          if (l3) {
            while (l3--) {
              changersCustomList[l3](args)
            }
          }

          // TODO: Set Color after adding;
        }
      },

      ready(): void {
        setValueInner = setValueNew
      },
    }
  },
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
