import getIsUnknownObject from '@/lib/getIsUnknownObject'
import getObjectKeys from '@/lib/getObjectKeys'

import setValue from './setValue'

import type { DoHover } from './typeHover'
import type { SizeHover } from './typeSize'
import type { DataSlider } from '@/helper/typeSlider'

const getHoverChangerStandard = (): {
  doHover: DoHover
  push: (
    args: DataSlider & {
      variable: { r?: unknown; s: { rele?: unknown } }
    },
  ) => void

  /**
   * Takes two objects, where the keys of the second object have the names of
   * dimensions from the first object. This dimension "r" is linked to the
   * variables max, min and can be changed by what is defined by map
   */
  pushAutomatic: <T extends string>(
    parent: Record<T, SizeHover<unknown>>,
    info: Record<T, DataSlider>,
  ) => void
} => {
  const listChangerStandard: Array<{
    change: number
    map?: string
    min: number
    variable: { r?: unknown; s: { rele?: unknown } }
  }> = []

  const push = (args: {
    map?: string
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
    pushAutomatic: (
      parent: Record<string, SizeHover<unknown>>,
      info?: Record<string, DataSlider>,
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
    doHover: (args): void => {
      listChangerStandard.forEach((current) => {
        const value = current.map !== undefined ? args[current.map] : undefined

        // TODO: Shouldn't need to check for `number`
        if (value === undefined || typeof value !== 'number') {
          return
        }

        setValue(current.variable, current.min + current.change * value)
      })
    },
  }
}

export default getHoverChangerStandard
