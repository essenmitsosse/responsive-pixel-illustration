import setValue from './setValue'

import type { DoHover } from './typeHover'
import type { SizeHover } from './typeSize'

const getHoverChangerRelative = (): {
  doHover: DoHover
  push: (
    size: SizeHover<unknown>,
    value: (args: Record<string, number>) => number,
  ) => void
} => {
  const listChangerRelative: Array<
    [SizeHover<unknown>, (args: Record<string, number>) => number]
  > = []

  return {
    push(
      size: SizeHover<unknown>,
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

export default getHoverChangerRelative
