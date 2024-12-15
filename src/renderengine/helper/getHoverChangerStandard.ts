import getIsUnknownObject from '@/lib/getIsUnknownObject'
import getObjectKeys from '@/lib/getObjectKeys'

import setValue from './setValue'

import type { DoHover } from './typeHover'
import type { SizeHover } from './typeSize'

const getHoverChangerStandard = (): {
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
    parent: Record<T, SizeHover<unknown>>,
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
      parent: Record<T, SizeHover<unknown>>,
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

export default getHoverChangerStandard
