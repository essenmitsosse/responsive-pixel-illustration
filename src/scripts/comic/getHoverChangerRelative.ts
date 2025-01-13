import setValue from '@/helper/setValue'

import type { DoHover } from '@/helper/typeHover'
import type { InputDynamicVariableBase } from '@/helper/typeSize'

const getHoverChangerRelative = (): {
  doHover: DoHover
  push: (size: InputDynamicVariableBase, value: DoHover) => void
} => {
  const listChangerRelative: Array<[InputDynamicVariableBase, DoHover]> = []

  return {
    push(size: InputDynamicVariableBase, value: DoHover): void {
      listChangerRelative.push([size, value])
    },
    doHover: (args): void => {
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
