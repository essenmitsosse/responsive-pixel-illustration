import getIsUnknownObject from '@/lib/getIsUnknownObject'
import getObjectKeys from '@/lib/getObjectKeys'

import type { ColorRgb } from './helper'

type Size<T> = { r?: T; s: { rele?: T } }

export const setValue = <TRele>(what: Size<TRele>, value: TRele): void => {
  what.s.rele = value
}

export const getHoverChangerCustom = (): {
  push: (value: (args: Record<string, number>) => void) => void
  doHover(args: Record<string, number>): void
} => {
  const listChangerCustom: Array<(args: Record<string, number>) => void> = []

  return {
    push: listChangerCustom.push.bind(listChangerCustom),
    doHover(args: Record<string, number>): void {
      let lengthRemaining = listChangerCustom.length

      if (lengthRemaining) {
        while (lengthRemaining--) {
          listChangerCustom[lengthRemaining](args)
        }
      }
    },
  }
}

const getHoverChangers = (): {
  listChangerRelative: Array<
    [Size<unknown>, (args: Record<string, number>) => void]
  >
  listColorStandard: Array<{
    color: ColorRgb
    map: string
    max: ColorRgb
    min: ColorRgb
  }>
  doHover(args: Record<string, number>): void
  pushRelativeStandard(
    min: number,
    max: number,
    map: string,
    variable: { r?: unknown; s: { rele?: unknown } },
  ): void

  /**
   * Takes two objects, where the keys of the second object have the names of
   * dimensions from the first object. This dimension "r" is linked to the
   * variables max, min and can be changed by what is defined by map
   */
  pushRelativeStandardAutomatic<T extends string>(
    parent: Record<T, Size<unknown>>,
    info: Record<T, { map: string; max: number; min: number }>,
  ): void
} => {
  const changersRelativeStandardList: Array<{
    change: number
    map: string
    min: number
    variable: { r?: unknown; s: { rele?: unknown } }
  }> = []
  const listChangerRelative: Array<
    [Size<unknown>, (args: Record<string, number>) => void]
  > = []
  const listColorStandard: Array<{
    color: ColorRgb
    map: string
    max: ColorRgb
    min: ColorRgb
  }> = []
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
    listChangerRelative,
    listColorStandard,

    pushRelativeStandard,

    pushRelativeStandardAutomatic<T extends string>(
      parent: Record<T, Size<unknown>>,
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
            | undefined = parent[key]

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
    doHover(args: Record<string, number>): void {
      let somethingToChange = false

      for (const key in args) {
        if (key !== 'width' && key !== 'height') {
          somethingToChange = true
          break
        }
      }

      if (!somethingToChange) {
        return
      }

      let l0 = changersRelativeStandardList.length

      // Change the RELATIVE VALUE of the variable, by the STANDARD map scheme
      if (l0) {
        while (l0--) {
          const current = changersRelativeStandardList[l0]

          if (args[current.map] !== undefined) {
            setValue(
              current.variable,
              current.min + current.change * args[current.map],
            )
          }
        }
      }

      // Change the RELATIVE VALUE of the variable, by a CUSTOM map scheme
      let l1 = listChangerRelative.length

      if (l1) {
        while (l1--) {
          const current = listChangerRelative[l1]
          const currentValue = current[1](args)

          if (currentValue !== undefined) {
            setValue(current[0], currentValue)
          }
        }
      }

      let l2 = listColorStandard.length

      // Change a COLOR, by a STANDARD map scheme
      if (l2) {
        while (l2--) {
          const current = listColorStandard[l2]

          if (args[current.map] !== undefined) {
            changeColor(args[current.map], current)
          }
        }
      }
    },
  }
}

export default getHoverChangers
