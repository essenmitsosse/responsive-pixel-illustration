import getIsUnknownObject from '@/lib/getIsUnknownObject'
import getObjectKeys from '@/lib/getObjectKeys'

import type { ColorRgb } from './typeColor'

type Size<T> = { r?: T; s: { rele?: T } }

export const setValue = <TRele>(what: Size<TRele>, value: TRele): void => {
  what.s.rele = value
}

type DoHover = (args: Record<string, number>) => void

export const getHoverChangerCustom = (): {
  doHover: DoHover
  push: (value: (args: Record<string, number>) => void) => void
} => {
  const listChangerCustom: Array<(args: Record<string, number>) => void> = []

  return {
    push: listChangerCustom.push.bind(listChangerCustom),
    doHover: (args: Record<string, number>): void =>
      listChangerCustom.forEach((change) => change(args)),
  }
}

export const getHoverChangerRelative = (): {
  doHover: DoHover
  push: (
    size: Size<unknown>,
    value: (args: Record<string, number>) => number,
  ) => void
} => {
  const listChangerRelative: Array<
    [Size<unknown>, (args: Record<string, number>) => number]
  > = []

  return {
    push(
      size: Size<unknown>,
      value: (args: Record<string, number>) => number,
    ): void {
      listChangerRelative.push([size, value])
    },
    doHover: (args: Record<string, number>): void => {
      listChangerRelative.forEach((current) => {
        const currentValue = current[1](args)

        if (currentValue === undefined) {
          return
        }

        setValue(current[0], current[1](args))
      })
    },
  }
}

export const getHoverChangerStandard = (): {
  doHover: DoHover
  push: (args: {
    map: string
    max: number
    min: number
    variable: { r?: unknown; s: { rele?: unknown } }
  }) => void

  /**
   * Takes two objects, where the keys of the second object have the names of
   * dimensions from the first object. This dimension "r" is linked to the
   * variables max, min and can be changed by what is defined by map
   */
  pushAutomatic: <T extends string>(
    parent: Record<T, Size<unknown>>,
    info: Record<T, { map: string; max: number; min: number }>,
  ) => void
} => {
  const listChangerStandard: Array<{
    change: number
    map: string
    min: number
    variable: { r?: unknown; s: { rele?: unknown } }
  }> = []
  const push = (args: {
    map: string
    max: number
    min: number
    variable: { r?: unknown; s: { rele?: unknown } }
  }): void => {
    listChangerStandard.push({
      change: args.max - args.min,
      min: args.min,
      map: args.map,
      variable: args.variable,
    })
  }

  return {
    push,
    pushAutomatic: <T extends string>(
      parent: Record<T, Size<unknown>>,
      info?: Record<T, { map: string; max: number; min: number }>,
    ): void => {
      if (!info) {
        return
      }

      getObjectKeys(info).forEach((key) => {
        const currentSize:
          | {
              r?: unknown
              s: { rele?: unknown }
            }
          | undefined = parent[key]

        if (!currentSize) {
          return
        }

        // Assignment
        const currentInfo = info[key]

        if (getIsUnknownObject(currentInfo)) {
          if (currentInfo.map === undefined) {
            return
          }

          push({
            min: currentInfo.min,
            max: currentInfo.max,
            map: currentInfo.map,
            variable: currentSize,
          })
        } else {
          // Just assign the value
          currentSize.r = currentInfo
        }
      })
    },
    doHover: (args: Record<string, number>): void => {
      listChangerStandard.forEach((current) => {
        if (args[current.map] === undefined) {
          return
        }

        setValue(
          current.variable,
          current.min + current.change * args[current.map],
        )
      })
    },
  }
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

export const getHoverChangerColor = (): {
  push: (args: {
    color: ColorRgb
    map: string
    max: ColorRgb
    min: ColorRgb
  }) => void
  doHover(args: Record<string, number>): void
} => {
  const listColorStandard: Array<{
    color: ColorRgb
    map: string
    max: ColorRgb
    min: ColorRgb
  }> = []

  return {
    push: listColorStandard.push.bind(listColorStandard),

    doHover: (args: Record<string, number>): void => {
      listColorStandard.forEach((current) => {
        if (args[current.map] === undefined) {
          return
        }

        changeColor(args[current.map], current)
      })
    },
  }
}
